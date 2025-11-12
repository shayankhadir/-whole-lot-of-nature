export default function ProductsPage() {
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
        
        {/* Bottom Right Leaves */}
        <div 
          className="absolute -bottom-32 -right-32 w-96 h-96 opacity-10"
          style={{
            backgroundImage: 'url(https://admin.wholelotofnature.com/wp-content/uploads/2025/11/bgleaf1.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: 'rotate(-35deg)',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-bold text-[#2E7D32] mb-4 font-header">
              Our Collection
            </h1>
            <p className="text-xl text-[#66BB6A] font-body">
              Premium plants, soil mixes & sustainable essentials
            </p>
          </div>
          
          {/* Coming Soon Card */}
          <div className="max-w-2xl mx-auto text-center bg-[#2C2C2C] border border-[#2E7D32]/30 rounded-lg p-12">
            <div className="mb-6">
              <svg 
                className="w-24 h-24 mx-auto text-[#66BB6A] opacity-50" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" 
                />
              </svg>
            </div>
            
            <h2 className="text-3xl font-bold text-white mb-4 font-header">
              Store Coming Soon
            </h2>
            <p className="text-lg text-white/70 mb-8 font-body">
              We're preparing something special for you. Our full product catalog with premium plants and gardening essentials will be available shortly.
            </p>
            
            <a
              href="/"
              className="inline-block bg-[#2E7D32] text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-[#66BB6A] transition-all duration-300 shadow-lg hover:shadow-[#2E7D32]/50"
            >
              Back to Home
            </a>
          </div>
          
          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-[#2E7D32]/20 rounded-full">
                <svg className="w-8 h-8 text-[#66BB6A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#66BB6A] mb-2 font-header">
                100% Organic
              </h3>
              <p className="text-white/60 font-body">
                All our products are certified organic and eco-friendly
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-[#2E7D32]/20 rounded-full">
                <svg className="w-8 h-8 text-[#66BB6A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#66BB6A] mb-2 font-header">
                Fast Delivery
              </h3>
              <p className="text-white/60 font-body">
                Quick and safe delivery across India
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-[#2E7D32]/20 rounded-full">
                <svg className="w-8 h-8 text-[#66BB6A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#66BB6A] mb-2 font-header">
                Quality Assured
              </h3>
              <p className="text-white/60 font-body">
                Premium quality plants and materials guaranteed
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
