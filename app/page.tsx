// app/page.tsx
import Link from 'next/link';

export default function HomePage() {
  const mockProductId = 'tshirt-001'; // Use the ID from your data/products.ts

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-gray-50">
      <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
        Welcome to the Custom T-Shirt Builder!
      </h1>
      <p className="text-xl text-gray-600 mb-8 max-w-2xl">
        Design your perfect t-shirt by customizing the color, size, and quantity.
        Click below to start configuring your product.
      </p>
      
      {/* Link to the Product Configurator Page */}
      <Link 
        href={`/product/${mockProductId}`}
        className="px-8 py-4 bg-indigo-600 text-white text-lg font-semibold rounded-lg shadow-xl hover:bg-indigo-700 transition duration-300 transform hover:scale-105"
      >
        Start Customizing Now!
      </Link>
      
      <div className="mt-12 text-sm text-gray-400">
        <p>Built with Next.js and TypeScript for the E-Commerce Configurator Assignment.</p>
      </div>
    </div>
  );
}