import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, OrderItem } from '../types';
import toast from 'react-hot-toast';

interface CartContextType {
  items: OrderItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<OrderItem[]>(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addToCart = React.useCallback((product: Product) => {
    setItems(prev => {
      const existing = prev.find(i => i.productId === product.id);
      if (existing) {
        return prev.map(i => i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, {
        productId: product.id,
        name: product.name,
        price: product.discountedPrice || product.price,
        quantity: 1,
        image: product.images[0]
      }];
    });

    // Move toast outside of setItems updater to avoid state update during render issues
    const isExisting = items.some(i => i.productId === product.id);
    if (isExisting) {
      toast.success(`Increased ${product.name} quantity`);
    } else {
      toast.success(`${product.name} added to cart`);
    }
  }, [items]);

  const removeFromCart = React.useCallback((productId: string) => {
    setItems(prev => prev.filter(i => i.productId !== productId));
    toast.success('Item removed from cart');
  }, []);

  const updateQuantity = React.useCallback((productId: string, delta: number) => {
    setItems(prev => prev.map(i => 
      i.productId === productId ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i
    ));
  }, []);

  const clearCart = React.useCallback(() => setItems([]), []);

  const totalItems = items.reduce((acc, i) => acc + i.quantity, 0);

  const value = React.useMemo(() => ({
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems
  }), [items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
