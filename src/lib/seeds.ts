import { db } from './firebase';
import { collection, doc, setDoc, query, getDocs } from 'firebase/firestore';
import { UserRole, Product } from '../types';

export async function seedInitialData() {
  const productsRef = collection(db, 'products');
  const q = query(productsRef);
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    // Seed Categories
    const categories = [
      { id: 'fruits', name: 'Fresh Fruits', icon: '🍎' },
      { id: 'veggies', name: 'Vegetables', icon: '🥦' },
      { id: 'dairy', name: 'Dairy & Eggs', icon: '🥛' },
      { id: 'bakery', name: 'Bakery', icon: '🍞' },
      { id: 'meat', name: 'Meat & Seafood', icon: '🥩' },
      { id: 'snacks', name: 'Snacks', icon: '🍪' },
    ];

    for (const cat of categories) {
      await setDoc(doc(db, 'categories', cat.id), cat);
    }

    // Seed Products
    const initialProducts: Partial<Product>[] = [
      {
        name: 'Organic Red Apples',
        description: 'Crisp and juicy organic red apples from local farms.',
        price: 4.99,
        discountedPrice: 3.99,
        category: 'fruits',
        stock: 50,
        images: ['https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&q=80&w=400'],
        vendorId: 'vendor1',
        rating: 4.8,
        reviewCount: 120,
        isFeatured: true,
      },
      {
        name: 'Fresh Green Broccoli',
        description: 'Nutritious green broccoli, harvested daily.',
        price: 2.50,
        category: 'veggies',
        stock: 30,
        images: ['https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&q=80&w=400'],
        vendorId: 'vendor1',
        rating: 4.5,
        reviewCount: 85,
        isFeatured: true,
      },
      {
        name: 'Whole Wheat Bread',
        description: 'Freshly baked whole wheat bread with no preservatives.',
        price: 3.25,
        category: 'bakery',
        stock: 20,
        images: ['https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=400'],
        vendorId: 'vendor1',
        rating: 4.9,
        reviewCount: 200,
        isFeatured: false,
      },
      {
        name: 'Organic Milk 1L',
        description: 'Pure organic whole milk from grass-fed cows.',
        price: 5.50,
        discountedPrice: 4.50,
        category: 'dairy',
        stock: 15,
        images: ['https://images.unsplash.com/photo-1563636619-e9107da5a76a?auto=format&fit=crop&q=80&w=400'],
        vendorId: 'vendor2',
        rating: 4.7,
        reviewCount: 45,
        isFeatured: true,
      }
    ];

    for (const prod of initialProducts) {
      const newRef = doc(collection(db, 'products'));
      await setDoc(newRef, { id: newRef.id, ...prod });
    }

    // Seed Pricing Plans
    const plans = [
      { id: 'basic', name: 'Basic', price: 0, description: 'Free for everyone', features: ['Standard delivery', 'Email support'] },
      { id: 'plus', name: 'Plus', price: 9.99, description: 'Best for families', features: ['Free delivery on $20+', 'Priority support', '2% Cashback'] },
      { id: 'pro', name: 'Pro', price: 19.99, description: 'Unlimited everything', features: ['Unlimited free delivery', 'Exclusive offers', '5% Cashback', 'Flash sales access'] },
    ];

    for (const plan of plans) {
      await setDoc(doc(db, 'pricingPlans', plan.id), plan);
    }
  }
}
