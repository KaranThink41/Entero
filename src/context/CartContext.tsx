import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the cart item type
export interface CartItem {
  id: string;
  title: string;
  price: number;
  originalPrice: number;
  discount: string;
  imageUrl: string;
  quantity: number;
  packSize?: string;
  prescriptionRequired?: boolean;
}

// Define the context type
interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getTotalPrice: () => number;
}

// Create the context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Create a provider component
export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (item: CartItem) => {
    setItems(prevItems => {
      // Check if the item already exists in the cart
      const existingItemIndex = prevItems.findIndex(i => i.id === item.id);
      
      if (existingItemIndex !== -1) {
        // If item exists, update its quantity
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + item.quantity
        };
        return updatedItems;
      } else {
        // If item doesn't exist, add it to the cart
        return [...prevItems, item];
      }
    });
  };

  const removeFromCart = (itemId: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      ).filter(item => item.quantity > 0) // Remove items with quantity 0
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getItemCount = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <CartContext.Provider value={{ 
      items, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart,
      getItemCount,
      getTotalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
};

// Create a custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
