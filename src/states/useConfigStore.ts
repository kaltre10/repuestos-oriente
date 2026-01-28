import { create } from 'zustand';
import request from '../utils/request';
import { apiUrl } from '../utils/utils';

interface Brand {
  id: number;
  brand: string;
}

interface Model {
  id: number;
  model: string;
  brandId: number;
  brand?: {
    brand: string;
  };
  Brand?: {
    brand: string;
  };
}

interface Category {
  id: number;
  category: string;
}

interface SubCategory {
  id: number;
  subCategory: string;
  categoryId: number;
  category?: {
    category: string;
  };
}

interface ConfigState {
  brands: Brand[];
  models: Model[];
  categories: Category[];
  subCategories: SubCategory[];
  dollarRate: string;
  freeShippingThreshold: string;
  shippingPrice: string;
  configId: number | null;
  loadingBrands: boolean;
  loadingModels: boolean;
  loadingCategories: boolean;
  loadingSubCategories: boolean;
  loadingDollar: boolean;
  errorBrands: string | null;
  errorModels: string | null;
  errorCategories: string | null;
  errorSubCategories: string | null;
  errorDollar: string | null;

  // Brands Actions
  fetchBrands: () => Promise<void>;
  addBrand: (brandName: string) => Promise<boolean>;
  updateBrand: (id: number, brandName: string) => Promise<boolean>;
  deleteBrand: (id: number) => Promise<boolean>;

  // Models Actions
  fetchModels: () => Promise<void>;
  addModel: (modelName: string, brandId: number) => Promise<boolean>;
  updateModel: (id: number, modelName: string, brandId: number) => Promise<boolean>;
  deleteModel: (id: number) => Promise<boolean>;

  // Categories Actions
  fetchCategories: (onlyActive?: boolean) => Promise<void>;
  addCategory: (categoryName: string) => Promise<boolean>;
  updateCategory: (id: number, categoryName: string) => Promise<boolean>;
  deleteCategory: (id: number) => Promise<boolean>;

  // SubCategories Actions
  fetchSubCategories: (onlyActive?: boolean) => Promise<void>;
  addSubCategory: (subCategoryName: string, categoryId: number) => Promise<boolean>;
  updateSubCategory: (id: number, subCategoryName: string, categoryId: number) => Promise<boolean>;
  deleteSubCategory: (id: number) => Promise<boolean>;

  // Config Actions
  fetchDollarRate: () => Promise<void>;
  saveConfig: (newRate: string, freeShippingThreshold: string, shippingPrice: string) => Promise<boolean>;
  setLocalDollarRate: (rate: string) => void;
  setLocalFreeShippingThreshold: (threshold: string) => void;
  setLocalShippingPrice: (price: string) => void;
}

const formatName = (name: string) => {
  if (!name) return '';
  const trimmed = name.trim();
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
};

export const useConfigStore = create<ConfigState>((set, get) => ({
  brands: [],
  models: [],
  categories: [],
  subCategories: [],
  dollarRate: '0',
  freeShippingThreshold: '200',
  shippingPrice: '0',
  configId: null,
  loadingBrands: false,
  loadingModels: false,
  loadingCategories: false,
  loadingSubCategories: false,
  loadingDollar: false,
  errorBrands: null,
  errorModels: null,
  errorCategories: null,
  errorSubCategories: null,
  errorDollar: null,

  // Brands Actions
  // ... (no changes in fetchBrands, addBrand)

  // ... (inside the store definition)
  fetchBrands: async () => {
    set({ loadingBrands: true, errorBrands: null });
    try {
      const response = await request.get(`${apiUrl}/brands`);
      set({ brands: response.data.body.brands });
    } catch (err) {
      console.error('Error fetching brands:', err);
      set({ errorBrands: 'Error al obtener las marcas' });
    } finally {
      set({ loadingBrands: false });
    }
  },

  addBrand: async (brandName) => {
    set({ loadingBrands: true, errorBrands: null });
    try {
      const formattedName = formatName(brandName);
      const response = await request.post(`${apiUrl}/brands`, { brand: formattedName });
      const newBrand = response.data.body.brand;
      set((state) => ({ 
        brands: [...state.brands, newBrand].sort((a, b) => a.brand.localeCompare(b.brand)) 
      }));
      return true;
    } catch (err: any) {
      console.error('Error adding brand:', err);
      set({ errorBrands: err.response?.data?.message || 'Error al agregar la marca' });
      return false;
    } finally {
      set({ loadingBrands: false });
    }
  },

  updateBrand: async (id, brandName) => {
    set({ loadingBrands: true, errorBrands: null });
    try {
      const formattedName = formatName(brandName);
      const response = await request.put(`${apiUrl}/brands/${id}`, { brand: formattedName });
      const updatedBrand = response.data.body.brand;
      
      set((state) => {
        const newBrands = state.brands
          .map(b => b.id === id ? updatedBrand : b)
          .sort((a, b) => a.brand.localeCompare(b.brand));
        const newModels = state.models.map(m => {
          if (m.brandId === id) {
            return {
              ...m,
              brand: { brand: updatedBrand.brand },
              Brand: { brand: updatedBrand.brand }
            };
          }
          return m;
        });

        return { brands: newBrands, models: newModels };
      });
      
      return true;
    } catch (err: any) {
      console.error('Error updating brand:', err);
      set({ errorBrands: err.response?.data?.message || 'Error al actualizar la marca' });
      return false;
    } finally {
      set({ loadingBrands: false });
    }
  },

  deleteBrand: async (id) => {
    set({ loadingBrands: true, errorBrands: null });
    try {
      await request.delete(`${apiUrl}/brands/${id}`);
      
      set((state) => ({
        brands: state.brands.filter(b => b.id !== id),
        models: state.models.filter(m => m.brandId !== id)
      }));
      
      return true;
    } catch (err: any) {
      console.error('Error deleting brand:', err);
      set({ errorBrands: err.response?.data?.message || 'Error al eliminar la marca' });
      return false;
    } finally {
      set({ loadingBrands: false });
    }
  },

  // Models Actions
  fetchModels: async () => {
    set({ loadingModels: true, errorModels: null });
    try {
      const response = await request.get(`${apiUrl}/models`);
      set({ models: response.data.body.models });
    } catch (err) {
      console.error('Error fetching models:', err);
      set({ errorModels: 'Error al obtener los modelos' });
    } finally {
      set({ loadingModels: false });
    }
  },

  addModel: async (modelName, brandId) => {
    set({ loadingModels: true, errorModels: null });
    try {
      const formattedName = formatName(modelName);
      const response = await request.post(`${apiUrl}/models`, { 
        model: formattedName,
        brandId 
      });
      const newModel = response.data.body.model;
      set((state) => ({ models: [newModel, ...state.models] }));
      return true;
    } catch (err: any) {
      console.error('Error adding model:', err);
      set({ errorModels: err.response?.data?.message || 'Error al agregar el modelo' });
      return false;
    } finally {
      set({ loadingModels: false });
    }
  },

  updateModel: async (id, modelName, brandId) => {
    set({ loadingModels: true, errorModels: null });
    try {
      const formattedName = formatName(modelName);
      const response = await request.put(`${apiUrl}/models/${id}`, { 
        model: formattedName,
        brandId 
      });
      const updatedModel = response.data.body.model;
      set((state) => ({
        models: state.models.map(m => m.id === id ? updatedModel : m)
      }));
      return true;
    } catch (err: any) {
      console.error('Error updating model:', err);
      set({ errorModels: err.response?.data?.message || 'Error al actualizar el modelo' });
      return false;
    } finally {
      set({ loadingModels: false });
    }
  },

  deleteModel: async (id) => {
    set({ loadingModels: true, errorModels: null });
    try {
      await request.delete(`${apiUrl}/models/${id}`);
      set((state) => ({
        models: state.models.filter(m => m.id !== id)
      }));
      return true;
    } catch (err: any) {
      console.error('Error deleting model:', err);
      set({ errorModels: err.response?.data?.message || 'Error al eliminar el modelo' });
      return false;
    } finally {
      set({ loadingModels: false });
    }
  },

  // Categories Actions
  fetchCategories: async (onlyActive = false) => {
    set({ loadingCategories: true, errorCategories: null });
    try {
      const response = await request.get(`${apiUrl}/categories${onlyActive ? '?onlyActive=true' : ''}`);
      set({ categories: response.data.body.categories });
    } catch (err) {
      console.error('Error fetching categories:', err);
      set({ errorCategories: 'Error al obtener las categorías' });
    } finally {
      set({ loadingCategories: false });
    }
  },

  addCategory: async (categoryName) => {
    set({ loadingCategories: true, errorCategories: null });
    try {
      const formattedName = formatName(categoryName);
      const response = await request.post(`${apiUrl}/categories`, { category: formattedName });
      const newCategory = response.data.body.category;
      set((state) => ({ categories: [...state.categories, newCategory] }));
      return true;
    } catch (err: any) {
      console.error('Error adding category:', err);
      set({ errorCategories: err.response?.data?.message || 'Error al agregar la categoría' });
      return false;
    } finally {
      set({ loadingCategories: false });
    }
  },

  updateCategory: async (id, categoryName) => {
    set({ loadingCategories: true, errorCategories: null });
    try {
      const formattedName = formatName(categoryName);
      const response = await request.put(`${apiUrl}/categories/${id}`, { category: formattedName });
      const updatedCategory = response.data.body.category;
      set((state) => ({
        categories: state.categories.map(c => c.id === id ? updatedCategory : c)
      }));
      return true;
    } catch (err: any) {
      console.error('Error updating category:', err);
      set({ errorCategories: err.response?.data?.message || 'Error al actualizar la categoría' });
      return false;
    } finally {
      set({ loadingCategories: false });
    }
  },

  deleteCategory: async (id) => {
    set({ loadingCategories: true, errorCategories: null });
    try {
      await request.delete(`${apiUrl}/categories/${id}`);
      set((state) => ({
        categories: state.categories.filter(c => c.id !== id)
      }));
      return true;
    } catch (err: any) {
      console.error('Error deleting category:', err);
      set({ errorCategories: err.response?.data?.message || 'Error al eliminar la categoría' });
      return false;
    } finally {
      set({ loadingCategories: false });
    }
  },

  // SubCategories Actions
  fetchSubCategories: async (onlyActive = false) => {
    set({ loadingSubCategories: true, errorSubCategories: null });
    try {
      const response = await request.get(`${apiUrl}/subcategories${onlyActive ? '?onlyActive=true' : ''}`);
      set({ subCategories: response.data.body.subCategories });
    } catch (err) {
      console.error('Error fetching subcategories:', err);
      set({ errorSubCategories: 'Error al obtener las subcategorías' });
    } finally {
      set({ loadingSubCategories: false });
    }
  },

  addSubCategory: async (subCategoryName, categoryId) => {
    set({ loadingSubCategories: true, errorSubCategories: null });
    try {
      const formattedName = formatName(subCategoryName);
      const response = await request.post(`${apiUrl}/subcategories`, { 
        subCategory: formattedName,
        categoryId 
      });
      const newSubCategory = response.data.body.subCategory;
      set((state) => ({ subCategories: [newSubCategory, ...state.subCategories] }));
      return true;
    } catch (err: any) {
      console.error('Error adding subcategory:', err);
      set({ errorSubCategories: err.response?.data?.message || 'Error al agregar la subcategoría' });
      return false;
    } finally {
      set({ loadingSubCategories: false });
    }
  },

  updateSubCategory: async (id, subCategoryName, categoryId) => {
    set({ loadingSubCategories: true, errorSubCategories: null });
    try {
      const formattedName = formatName(subCategoryName);
      const response = await request.put(`${apiUrl}/subcategories/${id}`, { 
        subCategory: formattedName,
        categoryId 
      });
      const updatedSubCategory = response.data.body.subCategory;
      set((state) => ({
        subCategories: state.subCategories.map(s => s.id === id ? updatedSubCategory : s)
      }));
      return true;
    } catch (err: any) {
      console.error('Error updating subcategory:', err);
      set({ errorSubCategories: err.response?.data?.message || 'Error al actualizar la subcategoría' });
      return false;
    } finally {
      set({ loadingSubCategories: false });
    }
  },

  deleteSubCategory: async (id) => {
    set({ loadingSubCategories: true, errorSubCategories: null });
    try {
      await request.delete(`${apiUrl}/subcategories/${id}`);
      set((state) => ({
        subCategories: state.subCategories.filter(s => s.id !== id)
      }));
      return true;
    } catch (err: any) {
      console.error('Error deleting subcategory:', err);
      set({ errorSubCategories: err.response?.data?.message || 'Error al eliminar la subcategoría' });
      return false;
    } finally {
      set({ loadingSubCategories: false });
    }
  },

  // Config Actions
  fetchDollarRate: async () => {
    set({ loadingDollar: true, errorDollar: null });
    try {
      const response = await request.get(`${apiUrl}/configs`);
      const configs = response.data.body.configs;
      if (configs && configs.length > 0) {
        set({ 
          dollarRate: configs[0].dolarRate.toString(),
          freeShippingThreshold: configs[0].freeShippingThreshold.toString(),
          shippingPrice: configs[0].shippingPrice.toString(),
          configId: configs[0].id 
        });
      }
    } catch (err) {
      console.error('Error fetching configs:', err);
      set({ errorDollar: 'Error al obtener las configuraciones' });
    } finally {
      set({ loadingDollar: false });
    }
  },

  saveConfig: async (newRate, freeShippingThreshold, shippingPrice) => {
    set({ loadingDollar: true, errorDollar: null });
    try {
      const rateValue = parseFloat(newRate);
      const freeShippingValue = parseFloat(freeShippingThreshold);
      const shippingPriceValue = parseFloat(shippingPrice);
      
      if (isNaN(rateValue) || rateValue <= 0) {
        throw new Error('La tasa del dólar debe ser un número mayor a 0');
      }
      
      if (isNaN(freeShippingValue) || freeShippingValue < 0) {
        throw new Error('La cantidad de envío gratis debe ser un número mayor o igual a 0');
      }
      
      if (isNaN(shippingPriceValue) || shippingPriceValue < 0) {
        throw new Error('El precio de envío debe ser un número mayor o igual a 0');
      }

      const { configId } = get();
      const configData = {
        dolarRate: rateValue,
        freeShippingThreshold: freeShippingValue,
        shippingPrice: shippingPriceValue
      };
      
      if (configId) {
        await request.put(`${apiUrl}/configs/${configId}`, configData);
      } else {
        const response = await request.post(`${apiUrl}/configs`, configData);
        const newConfig = response.data.body.config;
        set({ configId: newConfig.id });
      }
      
      set({ 
        dollarRate: newRate,
        freeShippingThreshold,
        shippingPrice
      });
      
      return true;
    } catch (err: any) {
      console.error('Error saving configs:', err);
      set({ errorDollar: err.message || 'Error al guardar las configuraciones' });
      return false;
    } finally {
      set({ loadingDollar: false });
    }
  },

  setLocalDollarRate: (rate) => set({ dollarRate: rate }),
  setLocalFreeShippingThreshold: (threshold : any) => set({ freeShippingThreshold: threshold }),
  setLocalShippingPrice: (price: any) => set({ shippingPrice: price }),
}));
