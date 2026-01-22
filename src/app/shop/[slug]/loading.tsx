export default function ProductLoading() {
  return (
    <div className="min-h-screen bg-[#030a06] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2E7D32] mx-auto"></div>
        <p className="mt-4 text-white/85">Loading product...</p>
      </div>
    </div>
  );
}
