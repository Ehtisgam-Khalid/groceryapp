import React, { useState, useEffect } from 'react';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, CreditCard, Truck, ShieldCheck, CheckCircle, MapPin, User, Phone, Home } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { OrderStatus } from '../types';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'motion/react';

export default function Cart() {
  const { items, totalItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [shippingDetails, setShippingDetails] = useState({
    name: '',
    phone: '',
    area: '',
    address: ''
  });
  const navigate = useNavigate();

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleCheckout = async () => {
    if (!auth.currentUser) {
      toast.error('Please sign in to checkout');
      navigate('/auth');
      return;
    }

    if (!shippingDetails.name || !shippingDetails.phone || !shippingDetails.address || !shippingDetails.area) {
      toast.error('Please fill in all delivery details');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        userId: auth.currentUser.uid,
        items,
        totalAmount: total,
        status: OrderStatus.PENDING,
        paymentStatus: 'unpaid' as const,
        paymentMethod: 'cash_on_delivery',
        shippingDetails,
        trackingInfo: {
          lat: 0,
          lng: 0,
          step: 0
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await addDoc(collection(db, 'orders'), orderData);
      toast.success('Order placed successfully! We will call you to confirm.', { duration: 5000 });
      clearCart();
      navigate('/profile');
    } catch (err) {
      console.error(err);
      toast.error('Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-4 bg-white">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-48 h-48 bg-slate-50 rounded-[60px] flex items-center justify-center text-slate-200 mb-8 relative"
        >
          <ShoppingBag size={80} strokeWidth={1} />
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute -top-4 -right-4 w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center text-brand-600 text-2xl"
          >
            ?
          </motion.div>
        </motion.div>
        <h2 className="text-4xl font-black text-slate-900 mb-3 tracking-tighter">Your Bag is Empty</h2>
        <p className="text-slate-400 mb-10 max-w-sm text-center font-medium leading-relaxed">
          Looks like you haven't discovered our fresh products yet. Start exploring and fill your bag!
        </p>
        <Link to="/" className="btn-primary">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-12 py-16">
      <header className="mb-16">
        <h1 className="text-6xl font-black text-slate-900 tracking-tighter uppercase mb-2">My Shopping Bag</h1>
        <div className="flex items-center gap-4">
          <p className="text-brand-600 font-bold text-sm tracking-widest uppercase">Verified Quality Check Active</p>
          <div className="h-0.5 w-12 bg-slate-100"></div>
          <p className="text-slate-400 font-bold text-sm uppercase">{totalItems} Items Selected</p>
        </div>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Items List */}
        <div className="lg:col-span-7 space-y-8">
          <AnimatePresence mode='popLayout'>
            {items.map((item) => (
              <motion.div 
                key={item.productId}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group flex flex-col sm:flex-row items-center gap-8 bg-white p-8 rounded-[48px] border border-slate-100 hover:border-brand-100 transition-all hover:shadow-2xl hover:shadow-brand-900/5"
              >
                <div className="w-40 h-40 rounded-[32px] bg-slate-50 overflow-hidden flex-shrink-0 relative">
                  <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-brand-950/0 group-hover:bg-brand-950/10 transition-colors"></div>
                </div>
                
                <div className="flex-grow text-center sm:text-left">
                  <h3 className="text-2xl font-black text-slate-900 group-hover:text-brand-600 transition-colors leading-tight mb-2 underline decoration-transparent group-hover:decoration-brand-200 decoration-4 underline-offset-4">{item.name}</h3>
                  <div className="flex items-center justify-center sm:justify-start gap-2 text-brand-600 font-black text-[10px] uppercase tracking-widest">
                    <CheckCircle size={12} strokeWidth={3} /> Freshly Picked
                  </div>
                  
                  <div className="mt-8 flex items-center justify-center sm:justify-start gap-6">
                    <div className="flex items-center gap-4 py-2 px-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <button onClick={() => updateQuantity(item.productId, -1)} className="p-1 hover:text-brand-600 transition-colors">
                        <Minus size={16} strokeWidth={3} />
                      </button>
                      <span className="font-black text-slate-900 w-6 text-center text-lg">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.productId, 1)} className="p-1 hover:text-brand-600 transition-colors">
                        <Plus size={16} strokeWidth={3} />
                      </button>
                    </div>
                    
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-300 line-through tracking-tighter">${(item.price * item.quantity * 1.2).toFixed(2)}</span>
                      <span className="text-2xl font-black text-slate-900">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => removeFromCart(item.productId)} 
                  className="p-4 text-slate-200 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                >
                  <Trash2 size={24} strokeWidth={2.5} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Checkout Side */}
        <div className="lg:col-span-5 space-y-8">
          {/* Delivery Form */}
          <div className="bg-white rounded-[48px] p-10 border border-slate-100 shadow-xl shadow-slate-200/50">
            <h3 className="text-2xl font-black text-slate-900 mb-8 tracking-tighter uppercase">Delivery Information</h3>
            <div className="space-y-4">
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-600 transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="Full Name"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:bg-white focus:ring-4 focus:ring-brand-50 focus:border-brand-200 transition-all font-bold text-sm outline-none"
                  value={shippingDetails.name}
                  onChange={e => setShippingDetails({...shippingDetails, name: e.target.value})}
                />
              </div>
              <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-600 transition-colors" size={18} />
                <input 
                  type="tel" 
                  placeholder="Phone Number"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:bg-white focus:ring-4 focus:ring-brand-50 focus:border-brand-200 transition-all font-bold text-sm outline-none"
                  value={shippingDetails.phone}
                  onChange={e => setShippingDetails({...shippingDetails, phone: e.target.value})}
                />
              </div>
              <div className="relative group">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-600 transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="Area / Neighborhood"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:bg-white focus:ring-4 focus:ring-brand-50 focus:border-brand-200 transition-all font-bold text-sm outline-none"
                  value={shippingDetails.area}
                  onChange={e => setShippingDetails({...shippingDetails, area: e.target.value})}
                />
              </div>
              <div className="relative group">
                <Home className="absolute left-4 top-4 text-slate-300 group-focus-within:text-brand-600 transition-colors" size={18} />
                <textarea 
                  placeholder="Complete Delivery Address"
                  rows={3}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:bg-white focus:ring-4 focus:ring-brand-50 focus:border-brand-200 transition-all font-bold text-sm outline-none resize-none"
                  value={shippingDetails.address}
                  onChange={e => setShippingDetails({...shippingDetails, address: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-slate-900 rounded-[48px] p-10 text-white shadow-2xl shadow-slate-900/20">
            <h3 className="text-2xl font-black uppercase tracking-tight mb-8">Checkout Summary</h3>
            
            <div className="space-y-4 mb-10 pb-8 border-b border-white/5 font-bold">
              <div className="flex justify-between items-center text-xs uppercase tracking-widest text-slate-400">
                <span>Subtotal</span>
                <span className="text-white">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-xs uppercase tracking-widest text-slate-400">
                <span>Shipping</span>
                <span className="text-white">{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between items-center text-xs uppercase tracking-widest text-slate-400">
                <span>Estimated Tax</span>
                <span className="text-white">${tax.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between items-end mb-10">
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-400 mb-1">Total Payable</span>
                <span className="text-5xl font-black tracking-tighter">${total.toFixed(2)}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[9px] font-bold text-slate-400 uppercase">Payment Mode</span>
                <span className="text-xs font-black uppercase">COD Only</span>
              </div>
            </div>

            <button 
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-brand-500 text-white py-6 rounded-[32px] font-black text-sm shadow-2xl shadow-brand-950/20 hover:bg-brand-400 active:scale-[0.98] transition-all flex items-center justify-center gap-4 group disabled:opacity-50 uppercase tracking-widest"
            >
              {loading ? 'Finalizing...' : (
                <>
                  Place My Order <ArrowRight size={22} strokeWidth={3} className="group-hover:translate-x-3 transition-transform" />
                </>
              )}
            </button>
            
            <p className="text-[9px] text-center text-slate-500 font-bold uppercase tracking-widest mt-8">
              By clicking Place Order, you agree to our terms of service
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
