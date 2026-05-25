export type Category = 'todos' | 'doces' | 'minis_tortas' | 'bolos_caseiros' | 'salgados_fritos';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  unit: string; // e.g., "unidade", "cento", "fatia"
  image: string;
  featured?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  notes?: string;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
  avatar?: string;
}

export interface BusinessInfo {
  name: string;
  phone: string;
  address: string;
  deliveryFee: number;
  minOrderValue: number;
  instagram: string;
  workingHours: {
    weekdays: string;
    weekends: string;
  };
}
