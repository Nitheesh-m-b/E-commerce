'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Head from 'next/head';
import { MOCK_PRODUCT, Variant } from '@/data/products';
import { useStorage } from '@/hooks/use-storage';

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

// --- Dynamic Price Calculation ---//
const calculatePricePerUnit = (
  base: number,
  colorMod: number,
  sizeMod: number
): number => {
  return base + colorMod + sizeMod;
};

const formatPrice = (price: number): string => {
  return price.toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  });
};

// --- Product Page Component ---
export default function ProductPage({ params }: { params: { id: string } }) {
  const product = MOCK_PRODUCT;

  const [selectedColor, setSelectedColor] = useState(product.variants.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product.variants.sizes[0]);
  const [quantity, setQuantity] = useState(1);
  
  const [cartItems, setCartItems] = useStorage<SelectedVariant[]>(
    'productConfiguratorCart', 
    []
  );

  const [lastViewed, setLastViewed] = useStorage<LastViewedProduct | null>(
    'lastViewedProduct', 
    null,
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


  // 3. DYNAMIC PRICE CALCULATION
  const pricePerUnit = useMemo(() => {
    return calculatePricePerUnit(
      product.basePrice,
      selectedColor.modifier,
      selectedSize.modifier
    );
  }, [product.basePrice, selectedColor, selectedSize]);
  
  const totalPrice = pricePerUnit * quantity;
  const formattedTotalPrice = formatPrice(totalPrice);
  const formattedPricePerUnit = formatPrice(pricePerUnit);

  // --- Handlers ---
  const handleAddToCart = () => {
    const newItem: SelectedVariant = {
      color: selectedColor,
      size: selectedSize,
      quantity: quantity,
    };
    
    setCartItems((prevItems) => [...prevItems, newItem]);
    
    alert(`Added ${quantity} x ${selectedColor.name} ${selectedSize.name} T-Shirt for ${formattedTotalPrice} to cart! Cart items: ${cartItems.length + 1}`);
  };

  // --- Rendering Helpers ---
  const currentImageUrl = selectedColor.imageUrl;
  const colorTransitionClass = 'transition-all duration-500 ease-in-out transform';

  return (
    <>
      <Head>
        <title>{product.name} - Configurator</title>
        <meta name="description" content={product.description} />
        
        <meta property="og:title" content={`${product.name} | ${selectedColor.name} | ${selectedSize.name}`} />
        <meta property="og:description" content={`Customize your ${selectedColor.name} T-Shirt now!`} />
        
        <meta property="og:image" content={currentImageUrl} />
        <meta property="og:url" content={`/product/${product.id}`} />
      </Head>

      <div className="container mx-auto p-4 md:p-8 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">{product.name}</h1>
        
        <div className="flex flex-col md:flex-row gap-8">
          
          <div className="md:w-2/3 relative aspect-square">
            <div className={`w-full h-full relative overflow-hidden rounded-lg shadow-xl ${colorTransitionClass}`}>
              <Image
                src={currentImageUrl}
                alt={`${product.name} in ${selectedColor.name}`}
                fill
                priority
                className={`object-cover ${colorTransitionClass} opacity-100`}
              />
            </div>
          </div>
          
          <div className="md:w-1/3 space-y-6">
            <p className="text-gray-600">{product.description}</p>

            {/* Price Display */}
            <div className="py-2">
              {/* Displaying the total price */}
              <span className="text-4xl font-extrabold text-indigo-600">
                {formattedTotalPrice}
              </span>
              <p className="text-sm text-gray-500 mt-1">
                ({formattedPricePerUnit} per unit)
              </p>
              <p className="text-xs text-gray-500 mt-1">
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
      
      {/* Sticky "Add to Cart" CTA */}
      <div className="sticky bottom-0 bg-white/95 border-t border-gray-200 p-4 shadow-2xl z-10">
          <div className="container mx-auto flex justify-between items-center">
              <div className="text-lg font-bold">
                  Total: {formattedTotalPrice}
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