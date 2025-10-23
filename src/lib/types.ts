export interface Product {
  id: number;
  name: string;
  image_url?: string;
  featured?: boolean;
  brand?: string;
  category?: string;
  description?: string;
  price?: number;
  stock?: number;
}

export type ProductListResponse =
  | Product[]
  | { data: Product[]; total?: number; page?: number; per_page?: number };
