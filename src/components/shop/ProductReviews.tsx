'use client';

import { useState, useEffect } from 'react';
import { Star, ThumbsUp, MessageCircle, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Review {
  id: number;
  reviewer: string;
  reviewer_avatar_urls?: Record<string, string>;
  review: string;
  rating: number;
  date_created: string;
  verified: boolean;
}

interface ProductReviewsProps {
  productId: number;
  productName: string;
  initialReviews?: Review[];
  averageRating?: number;
  reviewCount?: number;
}

export default function ProductReviews({ 
  productId, 
  productName,
  initialReviews = [],
  averageRating = 0,
  reviewCount = 0 
}: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [loading, setLoading] = useState(initialReviews.length === 0);
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [selectedRating, setSelectedRating] = useState(5);
  const [displayCount, setDisplayCount] = useState(3);

  // Fetch reviews from WooCommerce
  useEffect(() => {
    if (initialReviews.length > 0) return;

    async function fetchReviews() {
      try {
        const res = await fetch(`/api/products/reviews?product=${productId}`);
        const data = await res.json();
        if (data.success && data.data) {
          setReviews(data.data);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchReviews();
  }, [productId, initialReviews]);

  // Calculate rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => {
    const count = reviews.filter(r => r.rating === rating).length;
    const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
    return { rating, count, percentage };
  });

  const actualAverage = reviews.length > 0 
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
    : averageRating;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Strip HTML from review content
  const stripHtml = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };

  return (
    <div className="bg-white/5 rounded-2xl p-6 md:p-8 border border-white/10 backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h3 className="text-xl font-bold text-white antialiased flex items-center gap-2">
            <MessageCircle className="w-6 h-6 text-emerald-400" />
            Customer Reviews
          </h3>
          <p className="text-white/60 text-sm mt-1">
            {reviews.length > 0 
              ? `Based on ${reviews.length} review${reviews.length !== 1 ? 's' : ''}`
              : 'Be the first to review this product'}
          </p>
        </div>
        <button 
          onClick={() => setShowWriteReview(true)}
          className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-xl transition-colors shadow-lg shadow-emerald-500/20"
        >
          Write a Review
        </button>
      </div>

      {/* Rating Summary */}
      {reviews.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 pb-8 border-b border-white/10">
          {/* Average Rating */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-4">
              <span className="text-5xl font-bold text-white">{actualAverage.toFixed(1)}</span>
              <div>
                <div className="flex text-yellow-400 mb-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star 
                      key={star} 
                      className={`w-5 h-5 ${star <= Math.round(actualAverage) ? 'fill-yellow-400' : 'fill-white/20'}`} 
                    />
                  ))}
                </div>
                <p className="text-white/60 text-sm">{reviews.length} reviews</p>
              </div>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {ratingDistribution.map(({ rating, count, percentage }) => (
              <div key={rating} className="flex items-center gap-3">
                <span className="text-sm text-white/60 w-12">{rating} star</span>
                <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-white/40 w-8">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12">
            <Star className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/60">No reviews yet</p>
            <p className="text-white/40 text-sm mt-1">Be the first to share your experience!</p>
          </div>
        ) : (
          <AnimatePresence>
            {reviews.slice(0, displayCount).map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border-b border-white/5 pb-6 last:border-0"
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-sm font-bold flex-shrink-0">
                    {review.reviewer_avatar_urls?.['48'] ? (
                      <img 
                        src={review.reviewer_avatar_urls['48']} 
                        alt={review.reviewer}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      getInitials(review.reviewer)
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Name and Rating */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-white font-medium">{review.reviewer}</span>
                        {review.verified && (
                          <span className="px-2 py-0.5 text-xs bg-emerald-500/20 text-emerald-400 rounded-full">
                            Verified Purchase
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-white/40 flex-shrink-0">
                        {formatDate(review.date_created)}
                      </span>
                    </div>

                    {/* Stars */}
                    <div className="flex text-yellow-400 mb-3">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star 
                          key={star} 
                          className={`w-4 h-4 ${star <= review.rating ? 'fill-yellow-400' : 'fill-white/20'}`} 
                        />
                      ))}
                    </div>

                    {/* Review Text */}
                    <p className="text-white/80 text-sm leading-relaxed">
                      {stripHtml(review.review)}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center gap-4 mt-4">
                      <button className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white transition-colors">
                        <ThumbsUp className="w-3.5 h-3.5" />
                        Helpful
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}

        {/* Show More Button */}
        {reviews.length > displayCount && (
          <button
            onClick={() => setDisplayCount(prev => prev + 5)}
            className="w-full py-3 text-sm text-emerald-400 hover:text-white border border-white/10 hover:border-emerald-500/50 rounded-xl transition-colors"
          >
            Show More Reviews ({reviews.length - displayCount} remaining)
          </button>
        )}
      </div>

      {/* Write Review Modal */}
      <AnimatePresence>
        {showWriteReview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowWriteReview(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0A1F12] border border-white/10 rounded-2xl p-6 max-w-lg w-full"
              onClick={e => e.stopPropagation()}
            >
              <h4 className="text-xl font-bold text-white mb-4">Write a Review</h4>
              <p className="text-white/60 text-sm mb-6">Share your experience with {productName}</p>
              
              {/* Rating Selection */}
              <div className="mb-6">
                <label className="block text-sm text-white/80 mb-2">Your Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      onClick={() => setSelectedRating(star)}
                      className="p-1 transition-transform hover:scale-110"
                      aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                    >
                      <Star 
                        className={`w-8 h-8 ${star <= selectedRating ? 'fill-yellow-400 text-yellow-400' : 'text-white/20'}`} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Text */}
              <div className="mb-6">
                <label className="block text-sm text-white/80 mb-2">Your Review</label>
                <textarea
                  rows={4}
                  placeholder="What did you like or dislike about this product?"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowWriteReview(false)}
                  className="flex-1 py-3 border border-white/10 text-white rounded-xl hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  className="flex-1 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-500 transition-colors"
                >
                  Submit Review
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
