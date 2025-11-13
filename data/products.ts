// data/products.ts

export type Variant = {
  id: string;
  name: string; // e.g., "Red", "Blue", "Small", "Large"
  modifier: number; // Price adjustment (can be positive or negative)
  imageUrl: string; // Only needed for color/main variant
};

export type Product = {
  id: string;
  name: string;
  basePrice: number;
  description: string;
  variants: {
    colors: Variant[];
    sizes: Variant[];
  };
};

export const MOCK_PRODUCT: Product = {
  id: 'tshirt-001',
  name: 'Premium Custom T-Shirt',
  basePrice: 499.00, // Base price in ₹
  description: 'A comfortable and high-quality cotton t-shirt, fully customizable.',
  variants: {
    colors: [
      { id: 'c-white', name: 'White', modifier: 0, imageUrl: '/images/tshirt-white.jpg' },
      { id: 'c-red', name: 'Red', modifier: 50.00, imageUrl: '/images/tshirt-red.jpg' }, // ₹50 premium
      { id: 'c-blue', name: 'Blue', modifier: 50.00, imageUrl: '/images/tshirt-blue.jpg' },
    ],
    sizes: [
      { id: 's-s', name: 'S', modifier: 0, imageUrl: '' },
      { id: 's-m', name: 'M', modifier: 0, imageUrl: '' },
      { id: 's-l', name: 'L', modifier: 25.00, imageUrl: '' }, // ₹25 modifier
      { id: 's-xl', name: 'XL', modifier: 50.00, imageUrl: '' }, // ₹50 modifier
    ],
  },
};