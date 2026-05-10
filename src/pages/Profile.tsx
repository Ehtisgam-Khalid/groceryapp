import React, { useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { UserProfile, Order, OrderStatus } from '../types';
import { onAuthStateChanged } from 'firebase/auth';
import { User, Mail, MapPin, Phone, Package, Bell, Shield, LogOut, Clock, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', address: '', phone: '' });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const snap = await getDoc(doc(db, 'users', user.uid));
        if (snap.exists()) {
          const data = snap.data() as UserProfile;
          setProfile({ uid: user.uid, ...data });
          setFormData({ name: data.name || '', address: data.address || '', phone: data.phone || '' });
        }
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    try {
      await updateDoc(doc(db, 'users', profile.uid), formData);
      setProfile({ ...profile, ...formData });
      setIsEditing(false);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error('Failed to update profile');
    }
  };

  if (loading) return null;
  if (!profile) return <div className="p-12 text-center font-bold text-gray-500 uppercase tracking-widest">Please sign in to view profile</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-[40px] border border-gray-100 p-8 shadow-sm text-center">
            <div className="w-24 h-24 rounded-3xl bg-brand-100 text-brand-600 flex items-center justify-center text-4xl font-black mx-auto mb-6 shadow-inner">
              {profile.name?.[0] || profile.email[0].toUpperCase()}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 leading-tight mb-1">{profile.name || 'ShopEasy User'}</h2>
            <p className="text-gray-400 font-medium text-sm mb-6">{profile.email}</p>
            
            <div className="flex items-center justify-center gap-4 py-4 border-y border-gray-50 mb-8">
              <div className="text-center">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Points</div>
                <div className="text-xl font-black text-brand-500">{profile.loyaltyPoints}</div>
              </div>
              <div className="w-px h-8 bg-gray-100"></div>
              <div className="text-center">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Status</div>
                <div className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">{profile.role.toUpperCase()}</div>
              </div>
            </div>

            <nav className="space-y-1">
              {[
                { icon: User, label: 'Account Info', active: true },
                { icon: Clock, label: 'Order History', active: false },
                { icon: Shield, label: 'Security', active: false },
                { icon: Bell, label: 'Notifications', active: false },
              ].map((item) => (
                <button key={item.label} className={`w-full flex items-center gap-3 px-6 py-3 rounded-2xl text-sm font-bold transition-all ${item.active ? 'bg-brand-500 text-white shadow-lg shadow-brand-200' : 'text-gray-500 hover:bg-gray-50'}`}>
                  <item.icon size={18} />
                  {item.label}
                </button>
              ))}
              <button 
                onClick={() => auth.signOut()}
                className="w-full flex items-center gap-3 px-6 py-3 rounded-2xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all mt-4"
              >
                <LogOut size={18} />
                Logout
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[40px] border border-gray-100 p-10 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-gray-900">Personal Details</h3>
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className="px-6 py-2 rounded-xl text-sm font-bold bg-brand-50 text-brand-600 hover:bg-brand-100 transition-all"
              >
                {isEditing ? 'Cancel Edit' : 'Edit Profile'}
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2">Display Name</label>
                  <div className="relative group">
                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-500 transition-colors" />
                    <input 
                      type="text" 
                      disabled={!isEditing}
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full h-14 bg-gray-50 border-none rounded-2xl pl-12 pr-4 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-brand-500 disabled:opacity-70 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2">Contact Number</label>
                  <div className="relative group">
                    <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-500 transition-colors" />
                    <input 
                      type="tel" 
                      disabled={!isEditing}
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      className="w-full h-14 bg-gray-50 border-none rounded-2xl pl-12 pr-4 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-brand-500 disabled:opacity-70 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2">Delivery Address</label>
                <div className="relative group">
                  <MapPin size={18} className="absolute left-4 top-4 text-gray-400 group-focus-within:text-brand-500 transition-colors" />
                  <textarea 
                    rows={3}
                    disabled={!isEditing}
                    value={formData.address}
                    onChange={e => setFormData({...formData, address: e.target.value})}
                    className="w-full bg-gray-50 border-none rounded-2xl pl-12 pr-4 py-4 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-brand-500 disabled:opacity-70 transition-all resize-none"
                  ></textarea>
                </div>
              </div>

              {isEditing && (
                <button 
                  type="submit" 
                  className="w-full md:w-auto px-10 py-4 bg-brand-500 text-white rounded-2xl font-bold shadow-xl shadow-brand-200 hover:bg-brand-600 transition-all"
                >
                  Save Changes
                </button>
              )}
            </form>
          </div>

          <div className="bg-white rounded-[40px] border border-gray-100 p-10 shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Recent Orders</h3>
            <div className="space-y-4">
              {[1].map((o) => (
                <div key={o} className="p-6 bg-gray-50 rounded-3xl border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-brand-200 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-brand-600">
                      <Package size={28} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-900 group-hover:text-brand-600 transition-colors">ORD-1234-5678</div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ordered May 09, 2026 • 2 items</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-lg font-black text-gray-900">$45.50</div>
                      <div className="flex items-center justify-end gap-1 text-[10px] font-bold text-brand-600 uppercase">
                        <CheckCircle2 size={12} /> Delivered
                      </div>
                    </div>
                    <button className="px-5 py-2 rounded-xl text-xs font-bold border border-gray-200 text-gray-600 hover:bg-brand-500 hover:text-white hover:border-brand-500 transition-all">
                      Track Order
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
