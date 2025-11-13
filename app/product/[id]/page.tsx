// app/product/[id]/page.tsx - Next.js App Router structure
'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Head from 'next/head';
import { MOCK_PRODUCT, Variant } from '@/data/products';
import { useStorage } from '@/hooks/use-storage';

// Define the structure for the selected variant in the cart
interface SelectedVariant {
  color: Variant;
  size: Variant;
  quantity: number;
}
interface LastViewedProduct {
  id: string;
  color: string;
  size: string;
  time: string;
}
// --- Dynamic Price Calculation ---
const calculatePrice = (
  base: number,
  colorMod: number,
  sizeMod: number
): string => {
  const totalPrice = base + colorMod + sizeMod;
  return totalPrice.toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  });
};

// --- Product Page Component ---
export default function ProductPage({ params }: { params: { id: string } }) {
  // Simulating fetching product data (in a real app, you'd use params.id)
  const product = MOCK_PRODUCT;

  // 1. STATE MANAGEMENT
  const [selectedColor, setSelectedColor] = useState(product.variants.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product.variants.sizes[0]);
  const [quantity, setQuantity] = useState(1);
  
  // 2. PERSISTENCE (localStorage for Cart, sessionStorage for Last Viewed)
  // Cart items persistence (Requirement: Store selected variant in localStorage)
  const [cartItems, setCartItems] = useStorage<SelectedVariant[]>(
    'productConfiguratorCart', 
    []
  );

  // Last viewed properties tracking (Requirement: Track last viewed using sessionStorage)
  const [lastViewed, setLastViewed] = useStorage<LastViewedProduct | null>(
    'lastViewedProduct', 
    null, // Initial value is null or an empty object {}
    'sessionStorage'
);

  // Update last viewed on variant change
useEffect(() => {
    setLastViewed({ 
        id: product.id, 
        color: selectedColor.name, 
        size: selectedSize.name, 
        time: new Date().toISOString()
    });
}, [product.id, selectedColor.name, selectedSize.name, setLastViewed]);


  // 3. DYNAMIC PRICE CALCULATION (useMemo for performance)
  const dynamicPrice = useMemo(() => {
    return calculatePrice(
      product.basePrice,
      selectedColor.modifier,
      selectedSize.modifier
    );
  }, [product.basePrice, selectedColor, selectedSize]);

  // --- Handlers ---
  const handleAddToCart = () => {
    const newItem: SelectedVariant = {
      color: selectedColor,
      size: selectedSize,
      quantity: quantity,
    };
    
    // Add the new item to the existing cart items
    setCartItems((prevItems) => [...prevItems, newItem]);
    
    alert(`Added ${quantity} x ${selectedColor.name} ${selectedSize.name} T-Shirt to cart! Cart items: ${cartItems.length + 1}`);
  };

  // --- Rendering Helpers ---
  const currentImageUrl = selectedColor.imageUrl;
  const colorTransitionClass = 'transition-all duration-500 ease-in-out transform';

  return (
    <>
      {/* 4. SSR + SEO META + Open Graph (Requirement) */}
      <Head>
        <title>{product.name} - Configurator</title>
        <meta name="description" content={product.description} />
        {/* Open Graph Tags for Social Sharing */}
        <meta property="og:title" content={`${product.name} | ${selectedColor.name} | ${selectedSize.name}`} />
        <meta property="og:description" content={`Customize your ${selectedColor.name} T-Shirt now!`} />
        {/* Open Graph Preview (Requirement: shows selected variant thumbnail) */}
        <meta property="og:image" content={currentImageUrl} />
        <meta property="og:url" content={`/product/${product.id}`} />
      </Head>

      <div className="container mx-auto p-4 md:p-8 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">{product.name}</h1>
        
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* 5. Product Image Section (2/3 width on desktop) */}
          <div className="md:w-2/3 relative aspect-square">
            <div className={`w-full h-full relative overflow-hidden rounded-lg shadow-xl ${colorTransitionClass}`}>
              <Image
                src={currentImageUrl}
                alt={`${product.name} in ${selectedColor.name}`}
                fill
                priority
                className={`object-cover ${colorTransitionClass} opacity-100`}
              />
              {/* Bonus: Crossfade effect (simplified: a single image update with a fade-in) 
                  A true crossfade would involve two separate image elements for cleaner transition.
              */}
            </div>
          </div>
          
          {/* 6. Controls/Configurator Section (1/3 width on desktop) */}
          <div className="md:w-1/3 space-y-6">
            <p className="text-gray-600">{product.description}</p>

            {/* Price Display */}
            <div className="py-2">
              <span className="text-4xl font-extrabold text-indigo-600">
                {dynamicPrice}
              </span>
              <p className="text-sm text-gray-500 mt-1">
                (Base ₹{product.basePrice} + Color {selectedColor.modifier} + Size {selectedSize.modifier})
              </p>
            </div>

            {/* --- Color Selector --- */}
            <div>
              <h3 className="text-xl font-semibold mb-2">Color: {selectedColor.name}</h3>
              <div className="flex gap-3">
                {product.variants.colors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => setSelectedColor(color)}
                    className={`w-10 h-10 rounded-full border-2 focus:outline-none ${colorTransitionClass}`}
                    style={{ backgroundColor: color.name.toLowerCase() }}
                    aria-label={`Select color ${color.name}`}
                  >
                    {selectedColor.id === color.id && (
                      <span className="block w-full h-full rounded-full ring-4 ring-offset-2 ring-indigo-500"></span>
                    )}
                  </button>
                ))}
              </div>
            </div>
            
            {/* --- Size Selector --- */}
            <div>
              <h3 className="text-xl font-semibold mb-2">Size: {selectedSize.name}</h3>
              <div className="flex gap-2">
                <select
                  value={selectedSize.id}
                  onChange={(e) => {
                    const newSize = product.variants.sizes.find(s => s.id === e.target.value);
                    if (newSize) setSelectedSize(newSize);
                  }}
                  className="p-2 border border-gray-300 rounded-md shadow-sm w-full"
                >
                  {product.variants.sizes.map((size) => (
                    <option key={size.id} value={size.id}>
                      {size.name} ({size.modifier > 0 ? `+₹${size.modifier}` : 'No extra cost'})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* --- Quantity Selector --- */}
            <div>
                <h3 className="text-xl font-semibold mb-2">Quantity</h3>
                <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="p-2 border border-gray-300 rounded-md shadow-sm w-20 text-center"
                />
            </div>
            
          </div>
        </div>
      </div>
      
      {/* 7. Sticky "Add to Cart" CTA (Requirement: Responsive layout with sticky CTA) */}
      <div className="sticky bottom-0 bg-white/95 border-t border-gray-200 p-4 shadow-2xl z-10">
          <div className="container mx-auto flex justify-between items-center">
              <div className="text-lg font-bold">
                  Total: {dynamicPrice}
              </div>
              <button
                  onClick={handleAddToCart}
                  className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50"
              >
                  Add {quantity} to Cart
              </button>
          </div>
      </div>
    </>
  );
}