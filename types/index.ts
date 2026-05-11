// src/types/index.ts
export interface QuoteSettings {
  enableQuote: boolean;
  quoteButtonText?: string;
  minimumQuantity?: number;
  showPrice?: boolean;
}

export interface CollectionRef {
  _id: string;
  title: string;
  slug: { current: string };
}

export interface SimpleProduct {
  _id: string;
  title: string;
  slug: { current: string };
  sku?: string;
  images?: Array<{_key: string; asset: any; alt?: string}>;
  collections?: CollectionRef[];  // ✅ CHANGED: plural + array of collections
  brand?: string;
  manufacturer?: string;
  color?: string;
  pattern?: string;
  price: number;
  compareAtPrice?: number;
  description?: any;
  features?: string[];
  specifications?: {
    brand?: string;
    manufacturer?: string;
    color?: string;
    pattern?: string;
    composition?: string;
    fabricType?: string;
    apparelType?: string;
    productionType?: string;
    use?: string;
  };
  stock?: number;
  tags?: string[];
  quoteSettings?: QuoteSettings;
}

export interface SimpleCollection {
  _id: string;
  title: string;
  slug: { current: string };
  description?: string;
  image?: any;
  products?: SimpleProduct[];
}

export interface QuoteFormData {
  fullName: string;
  email: string;
  phone: string;
  company?: string;
  quantity: number;
  requirements?: string;
}