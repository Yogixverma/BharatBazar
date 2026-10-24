import React, { createContext, useContext, useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Product } from '../types/ecommerce';
import { useAuth } from './AuthContext';
import { useCart } from './CartContext';

interface WishlistContextType {
  wishlist: Product[];
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  moveToCart: (product: Product) => void;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('bb_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // LocalStorage persist
  useEffect(() => {
    try {
      localStorage.setItem('bb_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.warn('Failed saving wishlist to localStorage', e);
    }
  }, [wishlist]);

  // Firestore sync when user logs in
  useEffect(() => {
    if (!user) return;

    const syncFromFirestore = async () => {
      try {
        const snap = await getDoc(doc(db, 'wishlists', user.uid));
        if (snap.exists()) {
          const remoteWishlist = snap.data().items as Product[];
          if (remoteWishlist && Array.isArray(remoteWishlist)) {
            setWishlist(remoteWishlist);
          }
        }
      } catch (err) {
        console.warn('Error fetching wishlist from Firestore:', err);
      }
    };

    syncFromFirestore();
  }, [user]);

  // Push to Firestore on change
  useEffect(() => {
    if (!user) return;

    const saveToFirestore = async () => {
      try {
        await setDoc(doc(db, 'wishlists', user.uid), {
          userId: user.uid,
          items: wishlist,
          updatedAt: new Date().toISOString(),
        }, { merge: true });
      } catch (err) {
        console.warn('Error saving wishlist to Firestore:', err);
      }
    };

    const timeout = setTimeout(saveToFirestore, 800);
    return () => clearTimeout(timeout);
  }, [wishlist, user]);

  const isInWishlist = (productId: string): boolean => {
    return wishlist.some((p) => p.id === productId);
  };

  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist((prev) => prev.filter((p) => p.id !== productId));
  };

  const moveToCart = (product: Product) => {
    removeFromWishlist(product.id);
    addToCart(product, 1);
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        moveToCart,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
};
