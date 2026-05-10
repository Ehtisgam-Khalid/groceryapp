import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { UserProfile, UserRole } from './types';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import Cart from './pages/Cart';
import PricingPlans from './pages/PricingPlans';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import Inventory from './pages/admin/Inventory';
import Orders from './pages/admin/Orders';
import Users from './pages/admin/Users';
import Vendors from './pages/admin/Vendors';
import Reports from './pages/admin/Reports';
import { seedInitialData } from './lib/seeds';

import { CartProvider } from './context/CartContext';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        
        const adminEmails = ['ehtisham@gmail.com', 'ehtishamarain567@gmail.com'];
        const isEmailAdmin = adminEmails.includes(user.email || '');

        if (docSnap.exists()) {
          const profile = docSnap.data() as UserProfile;
          // Auto-upgrade if email is admin but role isn't
          if (isEmailAdmin && profile.role !== UserRole.ADMIN) {
            const updatedProfile = { ...profile, role: UserRole.ADMIN };
            await setDoc(docRef, updatedProfile, { merge: true });
            setCurrentUser({ uid: user.uid, ...updatedProfile });
          } else {
            setCurrentUser({ uid: user.uid, ...profile });
          }
        } else if (isEmailAdmin) {
          // Check if admin email
          const adminProfile = {
            email: user.email,
            name: 'Admin',
            role: UserRole.ADMIN,
            loyaltyPoints: 0,
            createdAt: new Date().toISOString()
          };
          try {
            await setDoc(docRef, adminProfile);
            setCurrentUser({ uid: user.uid, ...adminProfile } as UserProfile);
          } catch (err) {
            console.error('Failed to auto-create admin doc:', err);
            setCurrentUser(null);
          }
        } else {
          setCurrentUser(null);
        }

        // Seed data if admin
        if (isEmailAdmin || (docSnap.exists() && docSnap.data().role === UserRole.ADMIN)) {
          seedInitialData();
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Router>
      <Toaster position="bottom-right" />
      <CartProvider>
        <div className="min-h-screen bg-white">
          <Routes>
            {/* Admin Routes */}
            <Route path="/admin/*" element={
              <AdminLayout>
                <Routes>
                  <Route index element={<AdminDashboard />} />
                  <Route path="inventory" element={<Inventory />} />
                  <Route path="orders" element={<Orders />} />
                  <Route path="users" element={<Users />} />
                  <Route path="vendors" element={<Vendors />} />
                  <Route path="reports" element={<Reports />} />
                  <Route path="*" element={<Navigate to="/admin" />} />
                </Routes>
              </AdminLayout>
            } />

            {/* User Routes */}
            <Route path="/*" element={
              <>
                <Navbar />
                <div className="pt-16">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/membership" element={<PricingPlans />} />
                    <Route path="*" element={<Navigate to="/" />} />
                  </Routes>
                </div>
              </>
            } />
          </Routes>
        </div>
      </CartProvider>
    </Router>
  );
}
