'use client';

import { useState } from 'react';
import { useAddReview, useProductReviews } from '@/lib/hooks/useProducts';
import Button from './Button';
import Input from './Input';

interface ProductReviewsProps {
  productId: number;
}

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`h-5 w-5 ${
            star <= rating ? 'text-primary-500' : 'text-white/40'
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const { data: reviews, isLoading } = useProductReviews(productId);
  const addReview = useAddReview();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 5,
    review: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addReview.mutateAsync({
      product_id: productId,
      reviewer: formData.name,
      reviewer_email: formData.email,
      rating: formData.rating,
      review: formData.review,
    });
    setFormData({ name: '', email: '', rating: 5, review: '' });
  };

  if (isLoading) {
    return <div className="text-center">Loading reviews...</div>;
  }

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 antialiased">Customer Reviews</h3>

      {/* Review List */}
      <div className="mt-6 space-y-6">
        {reviews?.map((review: any) => (
          <div key={review.id} className="border-t border-gray-200 pt-6">
            <div className="flex items-center">
              <StarRating rating={review.rating} />
              <p className="ml-3 text-sm text-gray-600">
                by {review.reviewer}
              </p>
            </div>
            <div className="mt-4 space-y-6 text-sm text-gray-600">
              <p>{review.review}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Review Form */}
      <div className="mt-10 border-t border-gray-200 pt-10">
        <h3 className="text-lg font-medium text-gray-900 antialiased">Write a review</h3>
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <Input
            label="Name"
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <Input
            label="Email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Rating
            </label>
            <select
              value={formData.rating}
              onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm antialiased"
              aria-label="Select rating"
            >
              <option value="5">5 stars</option>
              <option value="4">4 stars</option>
              <option value="3">3 stars</option>
              <option value="2">2 stars</option>
              <option value="1">1 star</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="review"
              className="block text-sm font-medium text-gray-700"
            >
              Review
            </label>
            <div className="mt-1">
              <textarea
                id="review"
                rows={4}
                required
                value={formData.review}
                onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>
          </div>
          <div>
            <Button
              type="submit"
              disabled={addReview.isPending}
            >
              {addReview.isPending ? 'Submitting...' : 'Submit Review'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}