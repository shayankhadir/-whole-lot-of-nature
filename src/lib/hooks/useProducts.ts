import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Product } from '@/types/product';

type ProductParams = {
  search?: string;
  category?: string | number;
  limit?: number;
};

export function useProducts(params: ProductParams = {}) {
  return useQuery<Product[]>({
    queryKey: ['products', params],
    queryFn: async () => {
      const qs = new URLSearchParams();
      if (params.search) qs.set('search', params.search);
      if (params.category) qs.set('category', String(params.category));
      if (params.limit) qs.set('limit', String(params.limit));
      const url = `/api/products${qs.toString() ? `?${qs.toString()}` : ''}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      return result.success ? result.data : [];
    },
  });
}

export function useProduct(idOrSlug: number | string) {
  return useQuery<Product | null>({
    queryKey: ['product', idOrSlug],
    queryFn: async () => {
      const response = await fetch(`/api/products/${idOrSlug}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      return result.success ? (result.data as Product) : null;
    },
  });
}

export function useProductCategories() {
  return useQuery({
    queryKey: ['productCategories'],
    queryFn: async () => {
      const response = await fetch('/api/categories');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      return result.success ? result.data : [];
    },
  });
}

export function useProductReviews(productId: number) {
  return useQuery({
    queryKey: ['productReviews', productId],
    queryFn: async () => {
      const response = await fetch(`/api/reviews?product=${productId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
  });
}

export function useAddReview() {
  const queryClient = useQueryClient();

  type NewReview = {
    product_id: number;
    review: string;
    reviewer?: string;
    reviewer_email?: string;
    rating?: number;
    status?: 'approved' | 'hold' | 'spam' | 'trash';
  };

  return useMutation({
    mutationFn: async (reviewData: NewReview) => {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      return response.json();
    },
    onSuccess: (data, variables) => {
      // Invalidate the reviews query for this product
      queryClient.invalidateQueries({
        queryKey: ['productReviews', variables.product_id],
      });
    },
  });
}