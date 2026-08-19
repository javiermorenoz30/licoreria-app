import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Product } from '@/src/data/products';

type CartItem = { product: Product; quantity: number };
type CartContextType = {
  items: CartItem[];
  add: (product: Product) => void;
  remove: (id: string) => void;
  setQty: (id: string, quantity: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
};

const CartContext = createContext<CartContextType | null>(null);
const KEY = 'celicor_cart_v1';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(KEY).then(v => {
      if (v) setItems(JSON.parse(v));
    }).catch(() => {});
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(KEY, JSON.stringify(items)).catch(() => {});
  }, [items]);

  const add = (product: Product) => setItems(current => {
    const found = current.find(i => i.product.id === product.id);
    if (found) return current.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
    return [...current, { product, quantity: 1 }];
  });

  const remove = (id: string) => setItems(current => current.filter(i => i.product.id !== id));
  const setQty = (id: string, quantity: number) => setItems(current => quantity <= 0 ? current.filter(i => i.product.id !== id) : current.map(i => i.product.id === id ? { ...i, quantity } : i));
  const clear = () => setItems([]);

  const count = useMemo(() => items.reduce((s, i) => s + i.quantity, 0), [items]);
  const subtotal = useMemo(() => items.reduce((s, i) => s + i.quantity * i.product.price, 0), [items]);

  return <CartContext.Provider value={{ items, add, remove, setQty, clear, count, subtotal }}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
