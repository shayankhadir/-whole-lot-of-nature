export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-green-600 mb-8">
          Whole Lot of Nature
        </h1>
        <p className="text-lg text-center text-gray-700 max-w-2xl mx-auto">
          Welcome to our premium plant store! We're currently fixing some technical issues.
          The server is running and we're working to restore full functionality.
        </p>
        <div className="mt-8 text-center">
          <div className="inline-block bg-green-100 px-4 py-2 rounded-lg">
            <p className="text-green-800">🌿 Server Status: Active</p>
          </div>
        </div>
      </main>
    </div>
  );
}