export default function ShopLoading() {
  return (
    <div className="min-h-screen bg-[var(--brand-bg1)] text-white">
      {/* Header Section Skeleton */}
      <div className="relative border-b border-white/5 py-12 sm:py-16 px-4 sm:px-6 overflow-hidden bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.0))]">
        <div className="max-w-7xl mx-auto text-center">
          <div className="h-12 w-64 bg-white/10 rounded-lg mx-auto mb-3 animate-pulse" />
          <div className="h-6 w-96 max-w-full bg-white/5 rounded-lg mx-auto animate-pulse" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Skeleton */}
          <aside className="hidden lg:block w-72 flex-shrink-0 space-y-8">
            <div>
              <div className="h-4 w-24 bg-emerald-500/20 rounded mb-6 animate-pulse" />
              <div className="space-y-2">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-10 bg-white/5 rounded-lg animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
                ))}
              </div>
            </div>
          </aside>

          {/* Product Grid Skeleton */}
          <div className="flex-1">
            <div className="mb-8 flex flex-col sm:flex-row gap-4">
              <div className="flex-1 h-11 bg-white/10 rounded-lg animate-pulse" />
              <div className="w-44 h-11 bg-white/10 rounded-lg animate-pulse" />
            </div>
            
            <div className="mb-6">
              <div className="h-4 w-32 bg-white/5 rounded animate-pulse" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div 
                  key={i} 
                  className="aspect-[4/5] rounded-2xl bg-white/5 animate-pulse" 
                  style={{ animationDelay: `${i * 100}ms` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
