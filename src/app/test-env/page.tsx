export default function TestEnvPage() {
  const envVars = {
    WORDPRESS_API_URL: process.env.WORDPRESS_API_URL ? '✅ Set' : '❌ Missing',
    WORDPRESS_URL: process.env.WORDPRESS_URL ? '✅ Set' : '❌ Missing',
    WORDPRESS_USERNAME: process.env.WORDPRESS_USERNAME ? '✅ Set' : '❌ Missing',
    WORDPRESS_APP_PASSWORD: process.env.WORDPRESS_APP_PASSWORD ? '✅ Set' : '❌ Missing',
    WC_CONSUMER_KEY: process.env.WC_CONSUMER_KEY ? '✅ Set' : '❌ Missing',
    WC_CONSUMER_SECRET: process.env.WC_CONSUMER_SECRET ? '✅ Set' : '❌ Missing',
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || '❌ Missing',
    NEXT_PUBLIC_WORDPRESS_URL: process.env.NEXT_PUBLIC_WORDPRESS_URL || '❌ Missing',
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'monospace' }}>
      <h1>Environment Variables Check</h1>
      <pre>{JSON.stringify(envVars, null, 2)}</pre>
      <hr />
      <h2>Public Variables (visible in browser):</h2>
      <p>NEXT_PUBLIC_API_URL: {process.env.NEXT_PUBLIC_API_URL || 'Not set'}</p>
      <p>NEXT_PUBLIC_WORDPRESS_URL: {process.env.NEXT_PUBLIC_WORDPRESS_URL || 'Not set'}</p>
    </div>
  );
}
