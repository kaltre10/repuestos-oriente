import { useEffect, useRef, useState } from 'react';
import request from '../utils/request';
import { Product } from '../utils/interfaces';
import { apiUrl } from '../utils/utils';
import useProductStore from '../states/useProductStore';

export const useProducts = () => {

  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState([])

  const {
    setShowForm, setFormError,
    setFormLoading, editingProduct,
    error, showForm,
    formLoading, formError,
    formData, setEditingProduct,
    setFormData, setError
  } = useProductStore();

  const hasFetchedRef = useRef(false);

  const fetchProducts = async () => {

    if (loading || hasFetchedRef.current) return

    try {
      setLoading(true);
      setError(null);
      const response = await request.get(`${apiUrl}/products`);
      setProducts(response.data.body.products);
      console.log("fetch products", response.data);
      hasFetchedRef.current = true;
    } catch (err) {
      setError('Error al cargar los productos');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const getProducts = async () => {
    try {
      setLoading(true)
      const response = await request.get(`${apiUrl}/products`)
      const products = response.data.body.products
      setProducts(products)
      console.log("obteniendo productos: ,", products)

    } catch (error) {
      console.log(error)
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
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
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
      brand: product.brand,
      productBrand: product.productBrand,
      categories: product.categories,
      years: product.years,
      description: product.description || '',
      discount: product.discount,
      amount: product.amount,
      price: product.price,
      freeDelivery: product.freeDelivery,
      partNumber: product.partNumber,
    });
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setEditingProduct(null);
    setShowForm(false);
    setFormError(null);
    setFormData({
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
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);

    try {
      if (editingProduct) {
        // Update existing product
        await updateProduct(editingProduct.id, formData);
      } else {
        // Create new product
        await createProduct(formData);
      }
      handleCloseForm();
    } catch (err) {
      setFormError(editingProduct ? 'Error al actualizar el producto' : 'Error al crear el producto');
    } finally {
      setFormLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  useEffect(() => {
    getProducts()
    console.log("fetchin products in useEfect")
  }, []);

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
    fetchProducts,
    updateProduct,
    deleteProduct,
    handleDelete,
    handleEdit,
    handleCloseForm,
    handleSubmit,
    handleInputChange,
    setShowForm: setShowForm,
  };
};
