export interface ProductSpecification {
  [key: string]: string;
}

export interface Product {
  id: string;
  title: string;
  brand: string;
  category: string;
  price: number;
  mrp: number;
  discountPercent: number;
  rating: number;
  reviewCount: number;
  stock: number;
  images: string[];
  description: string;
  specifications: ProductSpecification;
  isBestSeller?: boolean;
  isDealOfDay?: boolean;
  isBharatAssured?: boolean;
  freeDelivery?: boolean;
  deliveryDays?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  itemCount: number;
  description?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface SavedForLaterItem {
  product: Product;
  addedAt: string;
}

export interface Address {
  id: string;
  userId: string;
  fullName: string;
  mobileNumber: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
  addressType?: 'home' | 'work' | 'other';
}

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  mrp: number;
  image: string;
  quantity: number;
  brand: string;
}

export interface OrderStatusCheckpoint {
  status: 'placed' | 'confirmed' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled';
  label: string;
  timestamp: string;
  location?: string;
  description?: string;
  completed: boolean;
}

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  couponCode?: string;
  total: number;
  shippingAddress: Address;
  paymentMethod: 'cod' | 'upi' | 'card' | 'netbanking';
  paymentStatus: 'pending' | 'paid' | 'failed';
  orderStatus: 'placed' | 'confirmed' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled';
  trackingNumber: string;
  statusHistory: OrderStatusCheckpoint[];
  cancelReason?: string;
  createdAt: string;
  estimatedDeliveryDate: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  isVerifiedPurchase: boolean;
  helpfulVotes: number;
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number;
  minOrderValue: number;
  maxDiscount?: number;
  active: boolean;
  description: string;
  expiryDate?: string;
}

export interface FilterState {
  category: string;
  brand: string[];
  minPrice: number;
  maxPrice: number;
  minRating: number;
  inStockOnly: boolean;
  bharatAssuredOnly: boolean;
  sortBy: 'featured' | 'price_low_high' | 'price_high_low' | 'avg_rating' | 'newest';
  searchQuery: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'customer' | 'admin';
  phoneNumber?: string;
  createdAt?: string;
}
