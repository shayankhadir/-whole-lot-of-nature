'use client';

/**
 * TestimonialForm Component
 * Form for customers to submit testimonials and ratings
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface TestimonialFormProps {
  productId?: string | number;
  productName?: string;
  onSubmit?: (data: {
    authorName: string;
    authorEmail: string;
    rating: number;
    content: string;
  }) => Promise<boolean>;
  onSuccess?: () => void;
}

const TestimonialForm: React.FC<TestimonialFormProps> = ({
  productId,
  productName,
  onSubmit,
  onSuccess,
}) => {
  const [authorName, setAuthorName] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Validation
    if (!authorName.trim()) {
      setErrorMessage('Please enter your name');
      return;
    }
    if (!authorEmail.trim() || !authorEmail.includes('@')) {
      setErrorMessage('Please enter a valid email');
      return;
    }
    if (!content.trim()) {
      setErrorMessage('Please enter your testimonial');
      return;
    }
    if (content.trim().length < 20) {
      setErrorMessage('Testimonial must be at least 20 characters');
      return;
    }

    setIsSubmitting(true);

    try {
      const success = await onSubmit?.({
        authorName: authorName.trim(),
        authorEmail: authorEmail.trim(),
        rating,
        content: content.trim(),
      });

      if (success) {
        setSuccessMessage('Thank you! Your testimonial has been submitted for moderation.');
        setAuthorName('');
        setAuthorEmail('');
        setRating(5);
        setContent('');
        setTimeout(() => onSuccess?.(), 2000);
      } else {
        setErrorMessage('Failed to submit testimonial. Please try again.');
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border-2 border-black rounded-lg overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-green-50 to-white border-b-2 border-black px-6 py-4">
        <h3 className="text-xl font-bold text-black antialiased">Share Your Experience</h3>
        {productName && <p className="text-sm text-gray-100 mt-1">{productName}</p>}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {/* Success message */}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#2E7D32] border-2 border-[#2E7D32] rounded-lg p-4 text-[#2E7D32] font-medium"
          >
            ✓ {successMessage}
          </motion.div>
        )}

        {/* Error message */}
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/5 border-2 border-black/20 rounded-lg p-4 text-black font-medium"
          >
            ✕ {errorMessage}
          </motion.div>
        )}

        {/* Name field */}
        <div>
          <label className="block font-bold text-black mb-2 antialiased">Your Name *</label>
          <input
            type="text"
            value={authorName}
            onChange={e => setAuthorName(e.target.value)}
            placeholder="Enter your full name"
            className="w-full px-4 py-2 border-2 border-black rounded focus:outline-none focus:border-[#2E7D32] bg-white text-black"
          />
        </div>

        {/* Email field */}
        <div>
          <label className="block font-bold text-black mb-2 antialiased">Email Address *</label>
          <input
            type="email"
            value={authorEmail}
            onChange={e => setAuthorEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full px-4 py-2 border-2 border-black rounded focus:outline-none focus:border-[#2E7D32] bg-white text-black"
          />
        </div>

        {/* Rating field */}
        <div>
          <label className="block font-bold text-black mb-2 antialiased">Rating *</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(star => (
              <motion.button
                key={star}
                type="button"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setRating(star)}
                className={`text-4xl transition-all ${star <= rating ? 'text-[#2E7D32]' : 'text-gray-300 opacity-50'}`}
              >
                ★
              </motion.button>
            ))}
          </div>
          <p className="text-sm text-gray-100 mt-2">{rating} out of 5 stars</p>
        </div>

        {/* Content field */}
        <div>
          <label className="block font-bold text-black mb-2 antialiased">Your Testimonial *</label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Share your experience with this product... (minimum 20 characters)"
            rows={5}
            className="w-full px-4 py-2 border-2 border-black rounded focus:outline-none focus:border-[#2E7D32] bg-white text-black resize-none"
          />
          <p className="text-xs text-gray-100 mt-1">{content.length} characters</p>
        </div>

        {/* Submit button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#2E7D32] text-white font-bold py-3 rounded border-2 border-[#2E7D32] hover:bg-[#2E7D32] disabled:opacity-50 disabled:cursor-not-allowed transition-colors antialiased"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Testimonial'}
        </motion.button>

        <p className="text-xs text-gray-100 text-center">
          Your testimonial will be reviewed before appearing on our site.
        </p>
      </form>
    </motion.div>
  );
};

export default TestimonialForm;
