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

interface StoreState {
  cart: CartItem[];
  isCartOpen: boolean;
  user: User | null;
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
}

const useStore = create<StoreState>((set, get) => ({
  cart: [],
  isCartOpen: false,
  user: getInitialUser(),
  addToCart: (product) => set((state) => {
    const existingItem = state.cart.find(item => item.id === product.id);
    if (existingItem) {
      return {
        cart: state.cart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      };
    } else {
      return {
        cart: [...state.cart, { ...product, quantity: 1 }]
      };
    }
  }),
  removeFromCart: (productId) => set((state) => ({
    cart: state.cart.filter(item => item.id !== productId)
  })),
  incrementQuantity: (productId) => set((state) => ({
    cart: state.cart.map(item =>
      item.id === productId
        ? { ...item, quantity: item.quantity + 1 }
        : item
    )
  })),
  decrementQuantity: (productId) => set((state) => ({
    cart: state.cart.map(item =>
      item.id === productId && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    )
  })),
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
  getCartTotal: () => {
    const { cart } = get();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  },
  getCartCount: () => {
    const { cart } = get();
    return cart.reduce((count, item) => count + item.quantity, 0);
  },
  clearCart: () => set({ cart: [] }),
  setUser: (user) => set({ user }),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null });
  },
}))

export default useStore
