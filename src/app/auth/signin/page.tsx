'use client';

import { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Leaf, CheckCircle2, Mail } from 'lucide-react';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password) {
      setError('Password is required for password sign in');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
      } else {
        setSuccess(true);
        const session = await getSession();
        if (session) {
          setTimeout(() => {
            router.push('/');
            router.refresh();
          }, 1000);
        }
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/' });
  };

  const handleMagicLinkSignIn = async () => {
    if (!email) {
      setError('Please enter your email address to sign in with a magic link');
      return;
    }
    
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('email', { 
        email, 
        redirect: false,
        callbackUrl: '/' 
      });

      if (result?.error) {
        setError('Error sending magic link. Please try again.');
      } else {
        setSuccess(true);
        // Show a message that the email was sent
        setError('Check your email for the sign-in link!');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Forest Background with "SIGN IN" Text */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Forest Background Image */}
        <Image
          src="/images/backgrounds/bgleaf1.png"
          alt="Lush forest background"
          fill
          className="object-cover"
          priority
        />
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#010a05]/98 via-[#041107]/94 to-[#010a05]/98" />

        {/* Decorative Leaf SVGs */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 0.1, x: 0 }}
          transition={{ duration: 1.5 }}
          className="absolute top-10 left-10 w-32 h-32 text-[#66BB6A]"
        >
          <Leaf className="w-full h-full" strokeWidth={0.5} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 0.08, x: 0 }}
          transition={{ duration: 1.5, delay: 0.3 }}
          className="absolute bottom-20 right-20 w-48 h-48 text-[#2E7D32]"
        >
          <Leaf className="w-full h-full rotate-45" strokeWidth={0.5} />
        </motion.div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full px-12">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-montserrat text-7xl md:text-8xl lg:text-9xl font-bold text-white uppercase leading-[0.9] text-center antialiased"
          >
            SIGN
            <br />
            <span className="text-[#66BB6A] drop-shadow-[0_0_40px_rgba(102,187,106,0.6)]">IN</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-8 font-inter text-xl text-white/80 text-center max-w-md antialiased"
          >
            Welcome back to Whole Lot of Nature
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-12 text-center"
          >
            <p className="text-sm text-white/85 uppercase tracking-widest font-montserrat">
              Stay Loyal to the Soil
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Sign In Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-[#0D1B0F] to-[#0a1f0d]">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Glassmorphism Card */}
          <div className="backdrop-blur-xl bg-white/5 p-10 rounded-2xl shadow-2xl border border-[#2E7D32]/20 relative overflow-hidden">
            {/* Decorative Corner Leaf */}
            <div className="absolute -top-10 -right-10 w-32 h-32 text-[#2E7D32]/10 pointer-events-none">
              <Leaf className="w-full h-full rotate-45" strokeWidth={1} />
            </div>

            <div className="relative z-10">
              {/* Header */}
              <h2 className="font-montserrat text-3xl md:text-4xl font-bold text-white mb-2 antialiased">
                Welcome Back
              </h2>
              <p className="font-inter text-white/85 mb-8">
                Sign in to continue your green journey
              </p>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-red-500/20 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg mb-6 backdrop-blur-sm"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Success Animation */}
              <AnimatePresence>
                {success && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center bg-[#0A0A0A]/90 backdrop-blur-lg rounded-2xl z-50"
                  >
                    <div className="text-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                      >
                        <CheckCircle2 className="w-20 h-20 text-[#66BB6A] mx-auto mb-4" />
                      </motion.div>
                      <h3 className="text-2xl font-bold text-white antialiased">Welcome Back!</h3>
                      <p className="text-white/85 mt-2">Redirecting...</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Input */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-white/90 mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent transition-all backdrop-blur-sm"
                    placeholder="you@example.com"
                  />
                </div>

                {/* Password Input */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-white/90 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent transition-all backdrop-blur-sm pr-12"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/85 hover:text-white transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center text-white/85 hover:text-white cursor-pointer">
                    <input
                      type="checkbox"
                      className="mr-2 w-4 h-4 rounded border-white/20 bg-white/5 text-[#2E7D32] focus:ring-[#2E7D32] focus:ring-offset-0 backdrop-blur-md"
                    />
                    Remember me
                  </label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-[#66BB6A] hover:text-[#2E7D32] transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: '0 0 32px rgba(46,125,50,0.6)' }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#2E7D32] text-white font-montserrat font-bold text-lg py-4 rounded-lg hover:bg-[#66BB6A] transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed antialiased"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </span>
                  ) : (
                    'Sign In'
                  )}
                </motion.button>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-[#0A0A0A]/50 text-white/85 backdrop-blur-md">Or continue with</span>
                  </div>
                </div>

                {/* Google Sign In */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="w-full bg-white/10 text-white font-medium py-3 rounded-lg border border-white/20 hover:bg-white/20 transition-all backdrop-blur-sm flex items-center justify-center gap-3"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Sign in with Google
                </motion.button>

                {/* Magic Link Sign In */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={handleMagicLinkSignIn}
                  className="w-full mt-3 bg-white/10 text-white font-medium py-3 rounded-lg border border-white/20 hover:bg-white/20 transition-all backdrop-blur-sm flex items-center justify-center gap-3"
                >
                  <Mail className="w-5 h-5" />
                  Sign in with OTP / Email Link
                </motion.button>
              </form>

              {/* Sign Up Link */}
              <p className="mt-8 text-center text-sm text-white/85">
                Don't have an account?{' '}
                <Link href="/auth/signup" className="text-[#66BB6A] hover:text-[#2E7D32] font-semibold transition-colors">
                  Sign up
                </Link>
              </p>
            </div>
          </div>

          {/* Mobile Logo (shown only on mobile) */}
          <div className="lg:hidden mt-8 text-center">
            <p className="text-xs text-white/40 uppercase tracking-widest font-montserrat">
              Stay Loyal to the Soil
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
