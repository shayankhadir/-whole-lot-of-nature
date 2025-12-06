export interface Product {
  id: number;
  name: string;
  slug: string;
  price: string;
  regular_price: string;
  sale_price: string;
  description: string;
  short_description: string;
  categories: ProductCategory[];
  images: ProductImage[];
  attributes: ProductAttribute[];
  variations: number[];
  in_stock: boolean;
  stock_quantity: number;
  average_rating?: number;
  rating_count?: number;
  tags?: ProductTag[];
  date_created?: string;
  featured?: boolean;
}

export interface ProductCategory {
  id: number;
  name: string;
  slug: string;
  count: number;
  parent?: number;
  image?: {
    src: string;
    alt: string;
  };
}

export interface ProductImage {
  id: number;
  src: string;
  alt: string;
}

export interface ProductAttribute {
  id: number;
  name: string;
  position: number;
  visible: boolean;
  variation: boolean;
  options: string[];
}

export interface ProductTag {
  id: number;
  name: string;
  slug: string;
}
export interface ProductReview {
  id: number;
  date_created: string;
  date_created_gmt: string;
  product_id: number;
  status: string;
  reviewer: string;
  reviewer_email: string;
  review: string;
  rating: number;
  verified: boolean;
}
