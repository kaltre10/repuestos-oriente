import { useEffect, useState } from 'react';
import request from '../utils/request';
import { Product } from '../utils/interfaces';
import { apiUrl } from '../utils/utils';
import useProductStore from '../states/useProductStore';
import { useConfirm } from './useConfirm';
export const useProducts = () => {
  const confirm = useConfirm();
  const [loading, setLoading] = useState(false)

  const {
    products, setProducts,
    setShowForm, setFormError,
    setFormLoading, editingProduct,
    error, showForm,
    formLoading,
    formError,
    fieldErrors,
    formData,
    setEditingProduct,
    setFormData,
    setError,
    setFieldErrors,
  } = useProductStore();


  useEffect(() => {
    // Solo cargamos productos inicialmente si no estamos en una página que maneja su propia carga (como BestSellers)
    // Para evitar cargar todos los productos sin filtros.
    // getProducts(); 
  }, []);

  const getProducts = async (filters: { year?: string, onSale?: boolean, page?: number, limit?: number, sortBy?: string, search?: string } = {}) => {
    try {
      setLoading(true)
      const { year, onSale, page = 1, limit = 20, sortBy, search } = filters;
      let url = `${apiUrl}/products`;
      const params = new URLSearchParams();
      if (year) params.append('year', year);
      if (onSale) params.append('onSale', 'true');
      if (search) params.append('search', search);
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      if (sortBy) params.append('sortBy', sortBy);
      
      const queryString = params.toString();
      if (queryString) url += `?${queryString}`;

      const response = await request.get(url)

      const fetchedProducts = response.data.body.products.map((p: any) => ({
        ...p,
        price: Number(p.price),
        discount: p.discount ? Number(p.discount) : 0,
        rating: p.rating || 0,
        reviews: p.reviews || 0
      }))

      if (page && page > 1) {
        setProducts([...products, ...fetchedProducts]);
      } else {
        setProducts(fetchedProducts);
      }
      
      return {
        products: fetchedProducts,
        pagination: response.data.body.pagination || { total: fetchedProducts.length, hasMore: false }
      };

    } catch (error) {
      console.log(error)
      return { products: [], pagination: { total: 0, hasMore: false } };
    } finally {
      setLoading(false)
    }
  }

  const createProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await request.post(`${apiUrl}/products`, productData);
      const newProduct = response.data.body.product;
      /* setProducts([products, newProduct]); */
      return newProduct;
    } catch (err) {
      setError('Error al crear el producto');
      console.error('Error creating product:', err);
      throw err;
    }
  };

  const updateProduct = async (id: number, productData: Partial<Product>) => {
    try {
      const response = await request.put(`${apiUrl}/products/${id}`, productData);
      const updatedProduct = response.data.body.product;
      /* setProducts(products.map(product =>
        product.id === id ? { ...product, ...updatedProduct } : product
      )); */
      return updatedProduct;
    } catch (err) {
      setError('Error al actualizar el producto');
      console.error('Error updating product:', err);
      throw err;
    }
  };

  const deleteProduct = async (id: number) => {
    try {
      await request.delete(`${apiUrl}/products/${id}`);
      await getProducts()
      /* setProducts(products.length > 0 ? products.filter(product => product?.id !== id) : []); */
    } catch (err) {
      setError('Error al eliminar el producto');
      console.error('Error deleting product:', err);
      throw err;
    }
  };

  const handleDelete = async (id: number) => {
    const respuesta = await confirm('¿Estás seguro de que quieres eliminar este producto?');
    if (respuesta) {
      try {
        await deleteProduct(id);
      } catch (err) {
        // Error is handled in the hook
      }
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      brandId: (product as any).brandId?.toString() || '',
      modelId: (product as any).modelId?.toString() || '',
      brand: product.brand,
      model: (product as any).model || '',
      productBrand: product.productBrand,
      categories: product.categories,
      subcategories: (product as any).subcategories || '',
      years: product.years,
      description: product.description || '',
      discount: product.discount,
      amount: product.amount,
      price: product.price,
      freeDelivery: product.freeDelivery,
      partNumber: product.partNumber,
      garantia: (product as any).garantia || '',
      noBrand: !(product as any).brandId && !(product as any).modelId,
    });
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setEditingProduct(null);
    setShowForm(false);
    setFormError(null);
    setFormData({
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
      garantia: '',
      noBrand: false,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);
    setFieldErrors({});

    // Frontend Validation
    const requiredFields: Record<string, string> = {
      name: 'Nombre',
      productBrand: 'Marca del producto',
      categories: 'Categorías',
      subcategories: 'Subcategorías',
      years: 'Años',
      price: 'Precio',
      amount: 'Cantidad',
      partNumber: 'Número de parte'
    };

    if (!formData.noBrand) {
      requiredFields.brandId = 'Marca del vehículo';
      requiredFields.modelId = 'Modelo del vehículo';
    }

    const newFieldErrors: Record<string, string> = {};

    Object.entries(requiredFields).forEach(([key, label]) => {
      const value = formData[key as keyof typeof formData];
      let isEmpty = false;
      if (typeof value === 'string') isEmpty = !value.trim();
      else if (typeof value === 'number') isEmpty = value === undefined || value === null;
      else isEmpty = !value;

      if (isEmpty) {
        newFieldErrors[key] = `El campo ${label.toLowerCase()} es requerido`;
      }
    });

    if (Number(formData.price) <= 0 && !newFieldErrors.price) {
      newFieldErrors.price = 'El precio debe ser mayor que cero';
    }

    if (Number(formData.amount) <= 0 && !newFieldErrors.amount) {
      newFieldErrors.amount = 'La cantidad debe ser mayor que cero';
    }

    if (Object.keys(newFieldErrors).length > 0) {
      setFieldErrors(newFieldErrors);
      setFormError('Por favor, corrige los errores en el formulario');
      setFormLoading(false);
      return;
    }

    try {
      // Preparar datos para el envío (convertir IDs a números)
      const dataToSubmit = {
        ...formData,
        brandId: formData.brandId ? parseInt(formData.brandId) : null,
        modelId: formData.modelId ? parseInt(formData.modelId) : null,
        price: Number(formData.price),
        amount: Number(formData.amount),
        discount: Number(formData.discount) || 0,
      };

      if (editingProduct) {
        // Update existing product
        await updateProduct(editingProduct.id, dataToSubmit as any);
        return editingProduct.id;
      } else {
        // Create new product
        const product = await createProduct(dataToSubmit as any);
        return product.id;
      }
    } catch (err) {
      setFormError(editingProduct ? 'Error al actualizar el producto' : 'Error al crear el producto');
      throw err;
    } finally {
      setFormLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  return {
    // Data
    products: products,
    loading: loading,
    error: error,

    // Form state
    editingProduct: editingProduct,
    showForm: showForm,
    formData: formData,
    formLoading: formLoading,
    formError: formError,
    
    // Actions
    getProducts: getProducts,
    updateProduct,
    deleteProduct,
    handleDelete,
    handleEdit,
    handleCloseForm,
    handleSubmit,
    handleInputChange,
    setShowForm,
    setFormData,
    fieldErrors,
  };
};
