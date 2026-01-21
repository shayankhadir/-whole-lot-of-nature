'use client';

import Image from 'next/image';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Leaf, CheckCircle2, Mail, Facebook } from 'lucide-react';

import type { Metadata } from 'next';

/*
export const metadata: Metadata = {
  title: 'Auth | Whole Lot of Nature',
  description: 'Discover premium plants and gardening supplies at Whole Lot of Nature. Expert advice and quality products for your green space in Bangalore.',
  openGraph: {
    title: 'Auth | Whole Lot of Nature',
    description: 'Discover premium plants and gardening supplies at Whole Lot of Nature. Expert advice and quality products for your green space in Bangalore.',
    images: ['https://wholelotofnature.com/images/og-image.jpg'],
    url: 'https://wholelotofnature.com/auth',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Auth | Whole Lot of Nature',
    description: 'Discover premium plants and gardening supplies at Whole Lot of Nature. Expert advice and quality products for your green space in Bangalore.',
    images: ['https://wholelotofnature.com/images/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://wholelotofnature.com/auth',
  },
};
*/



export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });
  const router = useRouter();

  const validatePassword = (password: string) => {
    setPasswordValidation({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'password') {
      validatePassword(value);
    }
  };

  const isPasswordValid = Object.values(passwordValidation).every(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (!isPasswordValid) {
      setError('Please ensure your password meets all requirements');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone
        }),
      });

      if (response.ok) {
        // Auto sign in after successful registration
        const result = await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        if (result?.ok) {
          router.push('/');
          router.refresh();
        }
      } else {
        const data = await response.json();
        setError(data.message || 'An error occurred during registration');
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

  const handleFacebookSignIn = () => {
    signIn('facebook', { callbackUrl: '/' });
  };

  const handleMagicLinkSignUp = async () => {
    if (!formData.email) {
      setError('Please enter your email address to continue with a magic link');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('email', {
        email: formData.email,
        redirect: false,
        callbackUrl: '/',
      });

      if (result?.error) {
        setError('Error sending magic link. Please try again.');
      } else {
        setError('Check your email for the sign-up link!');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Forest Background with "SIGN UP" Text */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <Image
          src="/images/backgrounds/bgleaf1.webp"
          alt="Lush forest background"
          fill
          className="object-cover"
          priority
        />

        <div className="absolute inset-0 bg-gradient-to-br from-[#010a05]/98 via-[#041107]/94 to-[#010a05]/98" />

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

        <div className="relative z-10 flex flex-col items-center justify-center w-full px-12">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-montserrat text-6xl md:text-7xl lg:text-8xl font-bold text-white uppercase leading-[0.9] text-center antialiased"
          >
            SIGN
            <br />
            <span className="text-[#66BB6A] drop-shadow-[0_0_40px_rgba(102,187,106,0.6)]">UP</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-8 font-inter text-xl text-white/80 text-center max-w-md antialiased"
          >
            Create your Whole Lot of Nature account in seconds
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

      {/* Right Side - Sign Up Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 lg:p-10 bg-gradient-to-br from-[#0D1B0F] to-[#0a1f0d]">
        <h1 className="text-3xl font-bold mb-4 text-white lg:hidden">Sign Up</h1>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="backdrop-blur-xl bg-white/5 p-8 rounded-2xl shadow-2xl border border-[#2E7D32]/20 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 text-[#2E7D32]/10 pointer-events-none">
              <Leaf className="w-full h-full rotate-45" strokeWidth={1} />
            </div>

            <div className="relative z-10">
              <h2 className="font-montserrat text-3xl md:text-4xl font-bold text-white mb-2 antialiased">
                Create Account
              </h2>
              <p className="font-inter text-white/85 mb-6">
                Join the plant community and unlock member perks
              </p>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-red-500/20 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg mb-5 backdrop-blur-sm"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {isLoading && (
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
                      <h3 className="text-2xl font-bold text-white antialiased">Creating account...</h3>
                      <p className="text-white/85 mt-2">Hang tight while we set things up.</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-white/90 mb-2">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent transition-all backdrop-blur-sm"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-white/90 mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent transition-all backdrop-blur-sm"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-white/90 mb-2">
                    Phone Number (Optional)
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent transition-all backdrop-blur-sm"
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-white/90 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 pr-12 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent transition-all backdrop-blur-sm"
                      placeholder="Create a strong password"
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

                  {formData.password && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-3"
                    >
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                        {[
                          { key: 'length', text: '8+ characters' },
                          { key: 'uppercase', text: 'Uppercase letter' },
                          { key: 'lowercase', text: 'Lowercase letter' },
                          { key: 'number', text: 'One number' },
                          { key: 'special', text: 'Special character' }
                        ].map(({ key, text }) => (
                          <div key={key} className="flex items-center gap-2">
                            <CheckCircle2
                              className={`h-3 w-3 ${
                                passwordValidation[key as keyof typeof passwordValidation]
                                  ? 'text-emerald-400'
                                  : 'text-white/30'
                              }`}
                            />
                            <span
                              className={
                                passwordValidation[key as keyof typeof passwordValidation]
                                  ? 'text-emerald-200'
                                  : 'text-white/50'
                              }
                            >
                              {text}
                            </span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-white/90 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 pr-12 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent transition-all backdrop-blur-sm"
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/85 hover:text-white transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p className="mt-1 text-xs text-red-300">Passwords do not match</p>
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: '0 0 32px rgba(46,125,50,0.6)' }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading || !isPasswordValid || formData.password !== formData.confirmPassword}
                  className="w-full bg-[#2E7D32] text-white font-montserrat font-bold text-lg py-3.5 rounded-lg hover:bg-[#66BB6A] transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed antialiased"
                >
                  Create Account
                </motion.button>

                <div className="relative my-5">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-[#0A0A0A]/50 text-white/85 backdrop-blur-md">Or continue with</span>
                  </div>
                </div>

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
                  Continue with Google
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={handleFacebookSignIn}
                  className="w-full mt-3 bg-white/10 text-white font-medium py-3 rounded-lg border border-white/20 hover:bg-white/20 transition-all backdrop-blur-sm flex items-center justify-center gap-3"
                >
                  <Facebook className="w-5 h-5" />
                  Continue with Facebook
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={handleMagicLinkSignUp}
                  className="w-full mt-3 bg-white/10 text-white font-medium py-3 rounded-lg border border-white/20 hover:bg-white/20 transition-all backdrop-blur-sm flex items-center justify-center gap-3"
                >
                  <Mail className="w-5 h-5" />
                  Continue with Email Link
                </motion.button>
              </form>

              <p className="mt-6 text-center text-sm text-white/85">
                Already have an account?{' '}
                <Link href="/auth/signin" className="text-[#66BB6A] hover:text-[#2E7D32] font-semibold transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
          </div>

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