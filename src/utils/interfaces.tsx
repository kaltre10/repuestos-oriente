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
  model?: string;
  brandId?: number;
  modelId?: number;
  productBrand: string;
  categories: string;
  subcategories?: string;
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
  brandId: string;
  modelId: string;
  brand: string;
  model: string;
  productBrand: string;
  categories: string;
  subcategories: string;
  years: string;
  description: string;
  discount: number;
  amount: number;
  price: number;
  freeDelivery: boolean;
  partNumber: string;
  noBrand: boolean;
}

export interface ProductStoreState {
  // Data state
  error: string | null;

  // Form and modal state
  editingProduct: Product | null;
  showForm: boolean;
  formData: ProductFormData;
  formLoading: boolean;
  formError: string | null;
  fieldErrors: Record<string, string>;
  products: Product[];
  // State setters
  setProducts: (products: Product[]) => void;
  setError: (error: string | null) => void;
  setEditingProduct: (product: Product | null) => void;
  setShowForm: (show: boolean) => void;
  setFormData: (data: ProductFormData) => void;
  setFormLoading: (loading: boolean) => void;
  setFormError: (error: string | null) => void;
  setFieldErrors: (errors: Record<string, string>) => void;
}
