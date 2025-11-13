// app/page.tsx
import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  const mockProductId = 'tshirt-001';

  return (
    <div className="relative min-h-screen flex items-center justify-center text-center overflow-hidden">
      <Image
        src="/images/shopify.png" // MAKE SURE THIS IMAGE EXISTS IN public/images
        alt="Stylish T-shirt Background"
        layout="fill"
        objectFit="cover"
        quality={90}
        className="absolute inset-0 z-0 animate-fade-in" // Added fade-in animation
        priority
      />
      <div className="absolute inset-0 bg-black opacity-60 z-10"></div>

      {/* Content Container */}
      <div className="relative z-20 p-8 text-white max-w-4xl mx-auto space-y-8 animate-slide-up">
        
        {/* Title */}
        <h1 className="text-6xl md:text-7xl font-extrabold leading-tight tracking-tight drop-shadow-lg animate-fade-in-up">
          Shopify
          <br />
          <span className="text-indigo-300">(Buy T-shirts Online)</span>
        </h1>
        
        {/* Tagline */}
        <p className="text-2xl md:text-3xl font-light leading-relaxed drop-shadow-md animate-fade-in-up delay-200">
          Design your perfect look. Buy your favorite customized T-shirt
          <br className="hidden md:block"/> choose your size, color, and quantity.
        </p>

        {/* Call to Action Section */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-12 animate-fade-in-up delay-400">
          
          <Link
            href={`/product/${mockProductId}`}
            className="px-12 py-5 bg-indigo-600 text-white text-2xl font-bold rounded-full shadow-2xl hover:bg-indigo-700 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-70"
          >
            Shop Here <span className="ml-2"></span>
          </Link>
        </div>

      </div>
    </div>
  );
}