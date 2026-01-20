import { createWithEqualityFn } from 'zustand/traditional';
import { ProductFormData, ProductStoreState } from '../utils/interfaces';

const initialFormData: ProductFormData = {
  name: '',
  brandId: '',
  modelId: '',
  brand: '',
  model: '',
  productBrand: '',
  categories: '',
  subcategories: '',
  years: '',
  description: '',
  discount: 0,
  amount: 0,
  price: 0,
  freeDelivery: false,
  partNumber: '',
  noBrand: false,
};

const useProductStore = createWithEqualityFn<ProductStoreState>((set) => ({
  error: null,
  editingProduct: null,
  showForm: false,
  formData: { ...initialFormData },
  formLoading: false,
  formError: null,
  fieldErrors: {},
  products: [],
  setProducts: (products) => set({ products }),
  setError: (error) => set(() => ({ error })),
  setEditingProduct: (editingProduct) => set(() => ({ editingProduct })),
  setShowForm: (showForm) => set(() => ({ showForm })),
  setFormData: (formData) => set(() => ({ formData })),
  setFormLoading: (formLoading) => set(() => ({ formLoading })),
  setFormError: (formError) => set(() => ({ formError })),
  setFieldErrors: (fieldErrors) => set(() => ({ fieldErrors })),
}));

export default useProductStore;
