import { createWithEqualityFn } from 'zustand/traditional';
import { ProductFormData, ProductStoreState } from '../utils/interfaces';

const initialFormData: ProductFormData = {
  name: '',
  brand: '',
  productBrand: '',
  categories: '',
  years: '',
  description: '',
  discount: 0,
  amount: 0,
  price: 0,
  freeDelivery: false,
  partNumber: '',
};

const useProductStore = createWithEqualityFn<ProductStoreState>((set) => ({
  products: [],
  setProducts: (products) => set(()=>({ products })),
  loading: false,
  error: null,
  editingProduct: null,
  showForm: false,
  formData: { ...initialFormData },
  formLoading: false,
  formError: null,
  setLoading: (loading) => set(()=>({ loading })),
  setError: (error) => set(()=>({ error })),
  setEditingProduct: (editingProduct) => set(()=>({ editingProduct })),
  setShowForm: (showForm) => set(()=>({ showForm })),
  setFormData: (formData) => set(()=>({ formData })),
  setFormLoading: (formLoading) => set(()=>({ formLoading })),
  setFormError: (formError) => set(()=>({ formError })),
}));

export default useProductStore;
