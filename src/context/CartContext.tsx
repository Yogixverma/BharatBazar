import React, { createContext, useContext, useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { INITIAL_COUPONS } from '../data/mockProducts';
import { db } from '../firebase';
import { CartItem, Coupon, Product, SavedForLaterItem } from '../types/ecommerce';
import { useAuth } from './AuthContext';

interface CartContextType {
  items: CartItem[];
  savedForLater: SavedForLaterItem[];
  itemCount: number;
  subtotal: number;
  deliveryCharge: number;
  discount: number;
  appliedCoupon: Coupon | null;
  finalTotal: number;
  freeDeliveryThreshold: number;
  amountNeededForFreeDelivery: number;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  saveForLater: (productId: string) => void;
  moveToCartFromSaved: (productId: string) => void;
  removeSavedItem: (productId: string) => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  clearCart: () => void;
  availableCoupons: Coupon[];
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  lastAddedProduct: Product | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const FREE_DELIVERY_THRESHOLD = 499;
const STANDARD_DELIVERY_FEE = 40;

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('bb_cart_items');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [savedForLater, setSavedForLater] = useState<SavedForLaterItem[]>(() => {
    try {
      const saved = localStorage.getItem('bb_saved_for_later');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(() => {
    try {
      const saved = localStorage.getItem('bb_applied_coupon');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [availableCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [lastAddedProduct, setLastAddedProduct] = useState<Product | null>(null);

  // Sync with LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('bb_cart_items', JSON.stringify(items));
    } catch (e) {
      console.warn('Failed saving cart to localStorage', e);
    }
  }, [items]);

  useEffect(() => {
    try {
      localStorage.setItem('bb_saved_for_later', JSON.stringify(savedForLater));
    } catch (e) {
      console.warn('Failed saving saved items to localStorage', e);
    }
  }, [savedForLater]);

  useEffect(() => {
    try {
      if (appliedCoupon) {
        localStorage.setItem('bb_applied_coupon', JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem('bb_applied_coupon');
      }
    } catch (e) {
      console.warn('Failed saving coupon', e);
    }
  }, [appliedCoupon]);

  // Sync with Firestore for logged-in user
  useEffect(() => {
    if (!user) return;

    const syncFromFirestore = async () => {
      try {
        const cartRef = doc(db, 'carts', user.uid);
        const snap = await getDoc(cartRef);
        if (snap.exists()) {
          const remoteItems = snap.data().items as CartItem[];
          if (remoteItems && Array.isArray(remoteItems) && remoteItems.length > 0) {
            setItems(remoteItems);
          }
        }
      } catch (err) {
        console.warn('Error fetching cart from Firestore:', err);
      }
    };

    syncFromFirestore();
  }, [user]);

  // Push to Firestore when items change
  useEffect(() => {
    if (!user) return;

    const saveToFirestore = async () => {
      try {
        const cartRef = doc(db, 'carts', user.uid);
        await setDoc(cartRef, {
          userId: user.uid,
          items,
          updatedAt: new Date().toISOString(),
        }, { merge: true });
      } catch (err) {
        console.warn('Error persisting cart to Firestore:', err);
      }
    };

    const timeout = setTimeout(saveToFirestore, 800);
    return () => clearTimeout(timeout);
  }, [items, user]);

  const addToCart = (product: Product, quantity: number = 1) => {
    setLastAddedProduct(product);
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      const maxAllowed = Math.min(product.stock, 10);

      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, maxAllowed);
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: newQty } : item
        );
      } else {
        return [...prev, { product, quantity: Math.min(quantity, maxAllowed) }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          const maxAllowed = Math.min(item.product.stock, 10);
          return { ...item, quantity: Math.min(quantity, maxAllowed) };
        }
        return item;
      })
    );
  };

  const saveForLater = (productId: string) => {
    const itemToSave = items.find((i) => i.product.id === productId);
    if (!itemToSave) return;

    removeFromCart(productId);
    setSavedForLater((prev) => {
      if (prev.some((s) => s.product.id === productId)) return prev;
      return [...prev, { product: itemToSave.product, addedAt: new Date().toISOString() }];
    });
  };

  const moveToCartFromSaved = (productId: string) => {
    const saved = savedForLater.find((s) => s.product.id === productId);
    if (!saved) return;

    setSavedForLater((prev) => prev.filter((s) => s.product.id !== productId));
    addToCart(saved.product, 1);
  };

  const removeSavedItem = (productId: string) => {
    setSavedForLater((prev) => prev.filter((s) => s.product.id !== productId));
  };

  const applyCoupon = (code: string): { success: boolean; message: string } => {
    const upperCode = code.trim().toUpperCase();
    const found = availableCoupons.find((c) => c.code === upperCode && c.active);

    if (!found) {
      return { success: false, message: 'Invalid or expired coupon code' };
    }

    if (subtotal < found.minOrderValue) {
      return {
        success: false,
        message: `Coupon requires a minimum order value of ₹${found.minOrderValue.toLocaleString('en-IN')}`,
      };
    }

    setAppliedCoupon(found);
    return {
      success: true,
      message: `Coupon "${found.code}" applied successfully!`,
    };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
  };

  // Calculations
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const deliveryCharge = items.length === 0 || subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : STANDARD_DELIVERY_FEE;
  const amountNeededForFreeDelivery = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);

  let discount = 0;
  if (appliedCoupon && subtotal >= appliedCoupon.minOrderValue) {
    if (appliedCoupon.discountType === 'fixed') {
      discount = appliedCoupon.value;
    } else if (appliedCoupon.discountType === 'percentage') {
      const calculated = (subtotal * appliedCoupon.value) / 100;
      discount = appliedCoupon.maxDiscount ? Math.min(calculated, appliedCoupon.maxDiscount) : calculated;
    }
  }

  const finalTotal = Math.max(0, subtotal + deliveryCharge - discount);

  return (
    <CartContext.Provider
      value={{
        items,
        savedForLater,
        itemCount,
        subtotal,
        deliveryCharge,
        discount,
        appliedCoupon,
        finalTotal,
        freeDeliveryThreshold: FREE_DELIVERY_THRESHOLD,
        amountNeededForFreeDelivery,
        addToCart,
        removeFromCart,
        updateQuantity,
        saveForLater,
        moveToCartFromSaved,
        removeSavedItem,
        applyCoupon,
        removeCoupon,
        clearCart,
        availableCoupons,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        lastAddedProduct,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
