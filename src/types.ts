export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  VENDOR = 'vendor',
}

export interface UserProfile {
  uid: string;
  email: string;
  name?: string;
  role: UserRole;
  loyaltyPoints: number;
  address?: string;
  phone?: string;
  area?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountedPrice?: number;
  category: string;
  stock: number;
  images: string[];
  vendorId: string;
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
}

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: 'paid' | 'unpaid';
  paymentMethod: string;
  shippingDetails: {
    name: string;
    phone: string;
    address: string;
    area: string;
  };
  trackingInfo?: {
    lat: number;
    lng: number;
    step: number; // 0-4 matching OrderStatus
  };
  createdAt: any;
  updatedAt: any;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: any;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'order' | 'promo' | 'system';
  read: boolean;
  createdAt: any;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  features: string[];
  description: string;
}
