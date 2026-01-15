import { ReactNode } from 'react';

export interface HomeLayoutProps {
  children: ReactNode;
}

export interface User {
  id: number;
  googleId?: string;
  email: string;
  password?: string;
  name: string;
  phone?: string;
  address?: string;
  profilePicture?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: number;
  name: string;
  brand: string;
  productBrand: string;
  categories: string;
  years: string;
  description?: string;
  discount: number;
  amount: number;
  price: number;
  freeDelivery: boolean;
  partNumber: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFormData {
  name: string;
  brand: string;
  productBrand: string;
  categories: string;
  years: string;
  description: string;
  discount: number;
  amount: number;
  price: number;
  freeDelivery: boolean;
  partNumber: string;
}

export interface ProductStoreState {
  // Data state
  products: Product[];
  loading: boolean;
  error: string | null;

  // Form and modal state
  editingProduct: Product | null;
  showForm: boolean;
  formData: ProductFormData;
  formLoading: boolean;
  formError: string | null;

  // State setters
  setProducts: (products: Product[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setEditingProduct: (product: Product | null) => void;
  setShowForm: (show: boolean) => void;
  setFormData: (data: ProductFormData) => void;
  setFormLoading: (loading: boolean) => void;
  setFormError: (error: string | null) => void;
}
