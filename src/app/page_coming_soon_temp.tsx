export default function Home() {
  return (
    <div className="min-h-screen bg-[#1A1A1A] relative overflow-hidden">
      {/* Forest Leaf Decorations */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Top Left Leaves */}
        <div 
          className="absolute -top-32 -left-32 w-96 h-96 opacity-10"
          style={{
            backgroundImage: 'url(https://admin.wholelotofnature.com/wp-content/uploads/2025/11/bgleaf2.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: 'rotate(-15deg)',
          }}
        />
        
        {/* Top Right Leaves */}
        <div 
          className="absolute -top-24 -right-24 w-80 h-80 opacity-8"
          style={{
            backgroundImage: 'url(https://admin.wholelotofnature.com/wp-content/uploads/2025/11/bgleaf3.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: 'rotate(25deg)',
          }}
        />
        
        {/* Bottom Left Leaves */}
        <div 
          className="absolute -bottom-40 -left-40 w-[500px] h-[500px] opacity-12"
          style={{
            backgroundImage: 'url(https://admin.wholelotofnature.com/wp-content/uploads/2025/11/bgleaf1.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: 'rotate(45deg)',
          }}
        />
        
        {/* Bottom Right Leaves */}
        <div 
          className="absolute -bottom-32 -right-32 w-96 h-96 opacity-10"
          style={{
            backgroundImage: 'url(https://admin.wholelotofnature.com/wp-content/uploads/2025/11/bgleaf2.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: 'rotate(-35deg)',
          }}
        />
        
        {/* Center Accent Leaves */}
        <div 
          className="absolute top-1/3 right-10 w-64 h-64 opacity-6"
          style={{
            backgroundImage: 'url(https://admin.wholelotofnature.com/wp-content/uploads/2025/11/bgleaf3.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: 'rotate(60deg)',
          }}
        />
        
        <div 
          className="absolute bottom-1/4 left-16 w-72 h-72 opacity-8"
          style={{
            backgroundImage: 'url(https://admin.wholelotofnature.com/wp-content/uploads/2025/11/bgleaf1.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: 'rotate(-20deg)',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-bold text-[#2E7D32] mb-6 font-header antialiased">
            BRING THE FOREST HOME
          </h1>
          <p className="text-2xl text-[#66BB6A] mb-8 font-body antialiased">
            Premium Plants & Sustainable Gardening
          </p>
          <p className="text-lg text-white/85 mb-12 font-body antialiased">
            Discover organic soil mixes, rare plants, and eco-friendly essentials
          </p>
          
          {/* CTA Button */}
          <a
            href="/products"
            className="inline-block bg-[#2E7D32] text-white px-10 py-4 rounded-lg text-lg font-semibold hover:bg-[#66BB6A] transition-all duration-300 shadow-lg hover:shadow-[#2E7D32]/50 antialiased"
          >
            Explore Collection
          </a>
        </div>
      </div>
    </div>
  );
}
