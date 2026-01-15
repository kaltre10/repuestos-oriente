import { useState, useEffect } from 'react';
import request from '../utils/request';
import { User } from '../utils/interfaces';
import { apiUrl } from '../utils/utils';

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form and modal state
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
  });
  const [formLoading, setFormLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await request.get(`${apiUrl}/users`);
      setUsers(response.data.body.users);
    } catch (err) {
      setError('Error al cargar los usuarios');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (userData: { email: string; password: string; name: string; phone?: string; address?: string }) => {
    try {
      const response = await request.post(`${apiUrl}/users`, userData);
      setUsers([...users, response.data.body.user]);
      return response.data.body.user;
    } catch (err) {
      setError('Error al crear el usuario');
      console.error('Error creating user:', err);
      throw err;
    }
  };

  const updateUser = async (id: number, userData: Partial<User>) => {
    try {
      const response = await request.put(`${apiUrl}/users/${id}`, userData);
      setUsers(users.map(user =>
        user.id === id ? { ...user, ...response.data.body.user } : user
      ));
      return response.data.body.user;
    } catch (err) {
      setError('Error al actualizar el usuario');
      console.error('Error updating user:', err);
      throw err;
    }
  };

  const deleteUser = async (id: number) => {
    try {
      await request.delete(`${apiUrl}/users/${id}`);
      setUsers(users.filter(user => user.id !== id));
    } catch (err) {
      setError('Error al eliminar el usuario');
      console.error('Error deleting user:', err);
      throw err;
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      try {
        await deleteUser(id);
      } catch (err) {
        // Error is handled in the hook
      }
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '', // Password not shown when editing
      phone: user.phone || '',
      address: user.address || '',
    });
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setEditingUser(null);
    setShowForm(false);
    setFormData({
      name: '',
      email: '',
      password: '',
      phone: '',
      address: '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      if (editingUser) {
        // Update existing user
        await updateUser(editingUser.id, formData);
      } else {
        // Create new user
        await createUser(formData);
      }
      handleCloseForm();
    } catch (err) {
      // Error is handled in the hook
    } finally {
      setFormLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    // Data
    users,
    loading,
    error,

    // Form state
    editingUser,
    showForm,
    formData,
    formLoading,

    // Actions
    fetchUsers,
    updateUser,
    deleteUser,
    handleDelete,
    handleEdit,
    handleCloseForm,
    handleSubmit,
    handleInputChange,
    setShowForm,
  };
};
