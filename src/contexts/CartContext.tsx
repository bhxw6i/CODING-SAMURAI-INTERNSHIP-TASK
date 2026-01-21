import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { api, Cart } from '@/lib/api';
import { useAuth } from './AuthContext';

interface CartContextType {
  cart: Cart | null;
  cartCount: number;
  loading: boolean;
  refreshCart: () => Promise<void>;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateCartItem: (itemId: string, quantity: number) => Promise<void>;
  removeCartItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const cartData = await api.getCart();
      // Ensure items is always an array
      if (cartData && !cartData.items) {
        cartData.items = [];
      }
      setCart(cartData);
    } catch (error: any) {
      console.error('Error fetching cart:', error);
      // If cart doesn't exist or error, set to null
      setCart(null);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = async (productId: string, quantity: number = 1) => {
    if (!isAuthenticated) {
      throw new Error('You must be logged in to add items to cart');
    }
    try {
      const updatedCart = await api.addToCart(productId, quantity);
      setCart(updatedCart);
    } catch (error) {
      throw error;
    }
  };

  const updateCartItem = async (itemId: string, quantity: number) => {
    if (!isAuthenticated) {
      throw new Error('You must be logged in to update cart');
    }
    try {
      const updatedCart = await api.updateCartItem(itemId, quantity);
      setCart(updatedCart);
    } catch (error) {
      throw error;
    }
  };

  const removeCartItem = async (itemId: string) => {
    if (!isAuthenticated) {
      throw new Error('You must be logged in to remove items from cart');
    }
    try {
      const updatedCart = await api.removeCartItem(itemId);
      setCart(updatedCart);
    } catch (error) {
      throw error;
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated) {
      throw new Error('You must be logged in to clear cart');
    }
    try {
      const updatedCart = await api.clearCart();
      setCart(updatedCart);
    } catch (error) {
      throw error;
    }
  };

  const cartCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        loading,
        refreshCart,
        addToCart,
        updateCartItem,
        removeCartItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
