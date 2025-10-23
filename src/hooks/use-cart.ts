import { useEffect, useState } from 'react';
import { Product } from '@/lib/types';

export interface CartItem {
  product: Product;
  qty: number;
}

const STORAGE_KEY = 'cart_items_v1';

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch (e) {
      // noop
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      // noop
    }
  }, [items]);

  function addItem(product: Product, qty = 1) {
    setItems((prev) => {
      const idx = prev.findIndex((p) => p.product.id === product.id);
      if (idx === -1) return [...prev, { product, qty }];
      const copy = [...prev];
      copy[idx] = { ...copy[idx], qty: copy[idx].qty + qty };
      return copy;
    });
  }

  function removeItem(productId: number) {
    setItems((prev) => prev.filter((p) => p.product.id !== productId));
  }

  function updateQty(productId: number, qty: number) {
    setItems((prev) => prev.map((p) => p.product.id === productId ? { ...p, qty } : p));
  }

  function clear() {
    setItems([]);
  }

  const count = items.reduce((s, it) => s + it.qty, 0);

  return { items, addItem, removeItem, updateQty, clear, count };
}

export default useCart;
