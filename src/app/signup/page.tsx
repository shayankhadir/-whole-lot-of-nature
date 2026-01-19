'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, EyeOff, Mail, Lock, User, Loader2 } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import type { Metadata } from 'next';

const metadata: Metadata = {
  title: 'Signup | Whole Lot of Nature',
  description: 'Discover premium plants and gardening supplies at Whole Lot of Nature. Expert advice and quality products for your green space in Bangalore.',
  openGraph: {
    title: 'Signup | Whole Lot of Nature',
    description: 'Discover premium plants and gardening supplies at Whole Lot of Nature. Expert advice and quality products for your green space in Bangalore.',
    images: ['https://wholelotofnature.com/images/og-image.jpg'],
    url: 'https://wholelotofnature.com/signup',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Signup | Whole Lot of Nature',
    description: 'Discover premium plants and gardening supplies at Whole Lot of Nature. Expert advice and quality products for your green space in Bangalore.',
    images: ['https://wholelotofnature.com/images/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://wholelotofnature.com/signup',
  },
};



interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

/**
 * CustomSignupPage Component
 * 
 * Premium signup page with split layout, nature imagery, and green theme.
 * Features:
 * - Split layout (form left, image right)
 * - Elegant typography
 * - Smooth animations
 * - Form validation
 * - Social auth integration
 * - Responsive design
 */
export default function CustomSignupPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState<SignupFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Call the registration API
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({
          submit: data.message || 'Registration failed. Please try again.',
        });
        return;
      }

      // Registration successful - auto sign in
      const signInResult = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (signInResult?.ok) {
        setSuccessMessage('Account created successfully! Redirecting...');
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          agreeToTerms: false,
        });

        // Redirect after brief delay
        setTimeout(() => {
          router.push('/account');
          router.refresh();
        }, 1500);
      } else {
        // Registration successful but sign-in failed
        setSuccessMessage('Account created! Please sign in.');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      }
    } catch (error) {
      setErrors({
        submit: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignup = async (provider: 'google' | 'facebook') => {
    try {
      await signIn(provider, { callbackUrl: '/account' });
    } catch (error) {
      setErrors({
        submit: `Failed to sign up with ${provider}. Please try again.`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-black flex overflow-hidden">
      {/* Left Side - Form Container */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="mb-10">
            <h1 className="text-5xl font-bold text-white mb-3 antialiased">
              Let&apos;s Get Started
            </h1>
            <p className="text-white/90 text-lg antialiased">
              Create your account to explore premium organic seeds and plants
            </p>
          </motion.div>

          {/* Success Message */}
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-[#2E7D32]/20 border border-[#2E7D32] rounded-lg text-[#2E7D32] backdrop-blur-md"
            >
              {successMessage}
            </motion.div>
          )}

          {/* Error Message */}
          {errors.submit && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-600/20 border border-red-600 rounded-lg text-red-400"
            >
              {errors.submit}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Input */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-semibold text-white mb-3 uppercase tracking-wide">
                Your Name
              </label>
              <div className="relative">
                <User className="absolute left-0 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#2E7D32]" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full h-14 bg-transparent border-b-2 border-gray-600 text-white placeholder-gray-500 pl-8 transition-all duration-300 focus:border-[#2E7D32] focus:outline-none"
                />
              </div>
              {errors.name && (
                <p className="text-red-400 text-sm mt-2">{errors.name}</p>
              )}
            </motion.div>

            {/* Email Input */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-semibold text-white mb-3 uppercase tracking-wide">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-0 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#2E7D32]" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="w-full h-14 bg-transparent border-b-2 border-gray-600 text-white placeholder-gray-500 pl-8 transition-all duration-300 focus:border-[#2E7D32] focus:outline-none"
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-sm mt-2">{errors.email}</p>
              )}
            </motion.div>

            {/* Password Input */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-semibold text-white mb-3 uppercase tracking-wide">
                Create Password
              </label>
              <div className="relative">
                <Lock className="absolute left-0 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#2E7D32]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full h-14 bg-transparent border-b-2 border-gray-600 text-white placeholder-gray-500 pl-8 pr-12 transition-all duration-300 focus:border-[#2E7D32] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#2E7D32] transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-sm mt-2">{errors.password}</p>
              )}
            </motion.div>

            {/* Confirm Password Input */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-semibold text-white mb-3 uppercase tracking-wide">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-0 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#2E7D32]" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full h-14 bg-transparent border-b-2 border-gray-600 text-white placeholder-gray-500 pl-8 pr-12 transition-all duration-300 focus:border-[#2E7D32] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#2E7D32] transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-400 text-sm mt-2">{errors.confirmPassword}</p>
              )}
            </motion.div>

            {/* Terms Checkbox */}
            <motion.div variants={itemVariants} className="flex items-start gap-3 pt-2">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                id="terms"
                className="w-5 h-5 accent-green-600 cursor-pointer mt-0.5 flex-shrink-0"
              />
              <label htmlFor="terms" className="text-sm text-white/90 cursor-pointer leading-relaxed">
                I agree to the{' '}
                <Link href="/terms" className="text-[#2E7D32] hover:text-[#2E7D32] transition-colors">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy-policy" className="text-[#2E7D32] hover:text-[#2E7D32] transition-colors">
                  Privacy Policy
                </Link>
              </label>
            </motion.div>
            {errors.agreeToTerms && (
              <p className="text-red-400 text-sm mt-2">{errors.agreeToTerms}</p>
            )}

            {/* Submit Button */}
            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading}
              type="submit"
              className="w-full h-14 bg-[#2E7D32] hover:bg-[#1B5E20] disabled:bg-[#2E7D32]/70 disabled:cursor-not-allowed text-white font-bold rounded-full transition-all duration-300 mt-8 text-lg shadow-lg hover:shadow-xl antialiased flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <motion.div variants={itemVariants} className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-gray-700" />
            <span className="text-gray-500 text-sm">OR</span>
            <div className="flex-1 h-px bg-gray-700" />
          </motion.div>

          {/* Social Auth Buttons */}
          <motion.div variants={itemVariants} className="space-y-3">
            <SocialSignupButton provider="google" onClick={() => handleSocialSignup('google')} />
            <SocialSignupButton provider="facebook" onClick={() => handleSocialSignup('facebook')} />
          </motion.div>

          {/* Login Link */}
          <motion.p variants={itemVariants} className="text-center text-white/90 mt-8">
            Already have an account?{' '}
            <Link href="/login" className="text-[#2E7D32] hover:text-[#2E7D32] transition-colors font-semibold">
              Sign in here
            </Link>
          </motion.p>
        </motion.div>
      </motion.div>

      {/* Right Side - Decorative Image Container */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex w-1/2 relative overflow-hidden bg-gradient-to-br from-green-900 to-black"
      >
        {/* Background Image */}
        <Image
          src="/images/backgrounds/ai-generated-lush-tropical-green-leaves-background-photo.jpg"
          alt="Lush tropical green leaves"
          fill
          priority
          className="object-cover opacity-70"
          sizes="(max-width: 1024px) 0vw, 50vw"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Decorative Elements */}
        <motion.div
          animate={{ float: [0, 20, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-20 right-10 w-40 h-40 bg-[#2E7D32]/10 rounded-full blur-3xl backdrop-blur-md"
        />
        <motion.div
          animate={{ float: [0, -20, 0] }}
          transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
          className="absolute bottom-40 left-10 w-60 h-60 bg-[#2E7D32]/5 rounded-full blur-3xl backdrop-blur-md"
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center h-full px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >

            <p className="text-xl text-white/90 mb-8 leading-relaxed antialiased">
              Get exclusive access to premium organic seeds, expert gardening tips, and a thriving community of plant lovers
            </p>

            {/* Feature List */}
            <div className="space-y-4 text-left">
              {[
                '100% organic seeds',
                'Eco-friendly practices',
                'Community support',
                'Expert guides',
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center gap-3 text-lg text-white/90 antialiased"
                >
                  <span className="text-[#66BB6A] font-bold">•</span>
                  <span>{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

interface SocialSignupButtonProps {
  provider: 'google' | 'facebook';
  onClick: () => void;
}

const SocialSignupButton = ({ provider, onClick }: SocialSignupButtonProps) => {
  const config = {
    google: { 
      label: 'Sign up with Google', 
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
      )
    },
    facebook: { 
      label: 'Sign up with Facebook', 
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      )
    },
  };

  const { label, icon } = config[provider];

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      type="button"
      onClick={onClick}
      className="w-full h-12 bg-white/10 hover:bg-white/20 border border-gray-600 hover:border-[#2E7D32] rounded-full flex items-center justify-center gap-3 text-white font-semibold transition-all duration-300 backdrop-blur-md"
    >
      {icon}
      {label}
    </motion.button>
  );
};
