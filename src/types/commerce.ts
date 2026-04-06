export type Stock = { total: number; status: "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK"; lowThreshold: number };

export type ProductImage = { id: string; url: string; sortOrder: number; alt?: string | null };

export type Category = { id: string; name: string; slug: string; description?: string | null };

export type Product = {
  id: string;
  name: string;
  slug: string;
  sku: string;
  priceCents: number;
  compareAtPriceCents?: number | null;
  isFeatured: boolean;
  isActive: boolean;
  shortDescription?: string | null;
  description: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
  createdAt?: string;
  images: ProductImage[];
  category?: Category | null;
  stock?: Stock;
};
