'use client';

import { useState } from 'react';
import { useLoading } from '@/contexts/LoadingContext';
import { useRouteLoading } from '@/hooks/useRouteLoading';
import Button from '@/components/ui/Button';

export default function LoadingDemoPage() {
  const { startLoading, stopLoading, setProgress } = useLoading();
  const { pushWithLoading } = useRouteLoading();
  const [manualMode, setManualMode] = useState(false);

  const handleSimpleLoad = () => {
    startLoading('Growing your garden...');
    setTimeout(() => stopLoading(), 3000);
  };

  const handleCustomMessage = () => {
    startLoading('Preparing your plants...');
    setTimeout(() => stopLoading(), 4000);
  };

  const handleManualProgress = async () => {
    setManualMode(true);
    startLoading('Uploading plant data...');
    
    for (let i = 0; i <= 100; i += 10) {
      setProgress(i);
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    stopLoading();
    setManualMode(false);
  };

  const handleNavigation = () => {
    pushWithLoading('/shop', 'Finding plants for you...');
  };

  return (
    <div className="min-h-screen bg-white px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-black mb-2">Loading Screen Demo</h1>
        <p className="text-gray-700 mb-12">
          Test the custom plant SVG progress bar loading screen with various scenarios.
        </p>

        <div className="space-y-6">
          {/* Simple Load */}
          <div className="p-6 bg-primary-50 rounded-lg border border-primary-200">
            <h2 className="text-xl font-semibold text-black mb-3">Auto-Incrementing Progress</h2>
            <p className="text-gray-700 mb-4">
              Shows loading screen with automatic progress increment (0-90%) over time.
            </p>
            <Button 
              onClick={handleSimpleLoad}
              className="bg-primary-700 hover:bg-primary-800"
            >
              Start Loading (3 seconds)
            </Button>
          </div>

          {/* Custom Message */}
          <div className="p-6 bg-primary-50 rounded-lg border border-primary-200">
            <h2 className="text-xl font-semibold text-black mb-3">Custom Message</h2>
            <p className="text-gray-700 mb-4">
              Same as above but with a custom loading message.
            </p>
            <Button 
              onClick={handleCustomMessage}
              className="bg-primary-700 hover:bg-primary-800"
            >
              Start with Custom Message (4 seconds)
            </Button>
          </div>

          {/* Manual Progress */}
          <div className="p-6 bg-primary-50 rounded-lg border border-primary-200">
            <h2 className="text-xl font-semibold text-black mb-3">Manual Progress Control</h2>
            <p className="text-gray-700 mb-4">
              You control the progress percentage. Useful for upload/download scenarios.
            </p>
            <Button 
              onClick={handleManualProgress}
              disabled={manualMode}
              className="bg-primary-700 hover:bg-primary-800 disabled:opacity-50"
            >
              {manualMode ? 'Loading... (See Progress)' : 'Start Manual Progress'}
            </Button>
          </div>

          {/* Route Navigation */}
          <div className="p-6 bg-primary-50 rounded-lg border border-primary-200">
            <h2 className="text-xl font-semibold text-black mb-3">Route Navigation</h2>
            <p className="text-gray-700 mb-4">
              Navigate to the shop page with loading screen. The plant grows as you navigate.
            </p>
            <Button 
              onClick={handleNavigation}
              className="bg-primary-700 hover:bg-primary-800"
            >
              Navigate to Shop (with Loading Screen)
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="mt-16 p-8 bg-white border-l-4 border-primary-700">
          <h3 className="text-2xl font-bold text-black mb-4">Features</h3>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="text-primary-700 font-bold">✓</span>
              <span>Beautiful plant SVG that grows as loading progresses</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary-700 font-bold">✓</span>
              <span>Animated circular progress indicator</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary-700 font-bold">✓</span>
              <span>Auto-incrementing progress (0-90%) with realistic timing</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary-700 font-bold">✓</span>
              <span>Manual progress control for API integration</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary-700 font-bold">✓</span>
              <span>Smooth Framer Motion animations</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary-700 font-bold">✓</span>
              <span>Global state management with Context API</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary-700 font-bold">✓</span>
              <span>Multiple leaves appear at different progress thresholds</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary-700 font-bold">✓</span>
              <span>Customizable loading messages</span>
            </li>
          </ul>
        </div>

        {/* How to Use */}
        <div className="mt-12 p-8 bg-gray-50 rounded-lg">
          <h3 className="text-2xl font-bold text-black mb-4">How to Use in Your Code</h3>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm mb-4">
{`'use client';
import { useLoading } from '@/context/LoadingContext';

export default function MyComponent() {
  const { startLoading, stopLoading } = useLoading();

  const handleClick = async () => {
    startLoading('Loading your garden...');
    try {
      // Do your async operation
      await fetch('/api/products');
    } finally {
      stopLoading();
    }
  };

  return <button onClick={handleClick}>Load</button>;
}`}
          </pre>

          <p className="text-gray-700 mb-4">
            See <code className="bg-gray-200 px-2 py-1 rounded">LOADING_SCREEN_GUIDE.md</code> for complete documentation and more examples.
          </p>
        </div>
      </div>
    </div>
  );
}
