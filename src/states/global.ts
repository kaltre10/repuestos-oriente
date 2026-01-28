import { create } from 'zustand'

interface Product {
  id: number;
  category: string;
  name: string;
  rating: number;
  reviews: number;
  price: number;
  image: string;
  tag?: string;
  discount?: number;
}

interface CartItem extends Product {
  quantity: number;
}

interface User {
  id: number;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  profilePicture?: string;
}

const getInitialUser = (): User | null => {
  const savedUser = localStorage.getItem('user');
  if (savedUser) {
    try {
      return JSON.parse(savedUser);
    } catch (error) {
      console.error('Error parsing user from localStorage', error);
      return null;
    }
  }
  return null;
};

const getInitialCart = (): CartItem[] => {
  const savedCart = localStorage.getItem('cart');
  if (savedCart) {
    try {
      return JSON.parse(savedCart);
    } catch (error) {
      console.error('Error parsing cart from localStorage', error);
      return [];
    }
  }
  return [];
};

interface StoreState {
  cart: CartItem[];
  isCartOpen: boolean;
  user: User | null;
  currency: 'USD' | 'BS';
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  incrementQuantity: (productId: number) => void;
  decrementQuantity: (productId: number) => void;
  toggleCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  clearCart: () => void;
  setUser: (user: User | null) => void;
  logout: () => void;
  setCurrency: (currency: 'USD' | 'BS') => void;
}

const useStore = create<StoreState>((set, get) => ({
  cart: getInitialCart(),
  isCartOpen: false,
  user: getInitialUser(),
  currency: (localStorage.getItem('currency') as 'USD' | 'BS') || 'USD',
  addToCart: (product) => set((state) => {
    let newCart;
    const existingItem = state.cart.find(item => item.id === product.id);
    if (existingItem) {
      newCart = state.cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      newCart = [...state.cart, { ...product, quantity: 1 }];
    }
    localStorage.setItem('cart', JSON.stringify(newCart));
    return { cart: newCart };
  }),
  removeFromCart: (productId) => set((state) => {
    const newCart = state.cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(newCart));
    return { cart: newCart };
  }),
  incrementQuantity: (productId) => set((state) => {
    const newCart = state.cart.map(item =>
      item.id === productId
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
    localStorage.setItem('cart', JSON.stringify(newCart));
    return { cart: newCart };
  }),
  decrementQuantity: (productId) => set((state) => {
    const newCart = state.cart.map(item =>
      item.id === productId && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    localStorage.setItem('cart', JSON.stringify(newCart));
    return { cart: newCart };
  }),
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
  getCartTotal: () => {
    const { cart } = get();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  },
  getCartCount: () => {
    const { cart } = get();
    return cart.reduce((count, item) => count + item.quantity, 0);
  },
  clearCart: () => {
    localStorage.removeItem('cart');
    set({ cart: [] });
  },
  setUser: (user) => set({ user }),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
    set({ user: null, cart: [] });
  },
  setCurrency: (currency) => {
    localStorage.setItem('currency', currency);
    set({ currency });
  },
}))

export default useStore
