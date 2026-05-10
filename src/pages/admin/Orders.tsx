import React, { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Order, OrderStatus } from '../../types';
import { Search, Filter, Eye, Truck, CheckCircle, XCircle, Clock, Loader2, X, User, MapPin, Calendar, CreditCard, Phone, Package, Hash, Home } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'motion/react';

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setOrders(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order)));
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: OrderStatus) => {
    try {
      await updateDoc(doc(db, 'orders', id), { status, updatedAt: new Date().toISOString() });
      toast.success('Order status updated');
      fetchOrders();
      if (selectedOrder && selectedOrder.id === id) {
        setSelectedOrder({ ...selectedOrder, status });
      }
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const getStatusStyle = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING: return 'bg-amber-50 text-amber-600 border-amber-100';
      case OrderStatus.CONFIRMED: return 'bg-blue-50 text-blue-600 border-blue-100';
      case OrderStatus.SHIPPED: return 'bg-purple-50 text-purple-600 border-purple-100';
      case OrderStatus.DELIVERED: return 'bg-brand-50 text-brand-600 border-brand-100';
      case OrderStatus.CANCELLED: return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.shippingDetails?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.shippingDetails?.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in">
      <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter uppercase">Order Log</h1>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-1">Process and track customer deliveries</p>
        </div>
        
        <div className="flex items-center gap-3 w-full xl:w-auto">
          <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-slate-100 flex-grow xl:w-[400px] shadow-sm focus-within:ring-4 focus-within:ring-brand-50 transition-all">
            <Search size={18} className="text-slate-300" />
            <input 
              type="text" 
              placeholder="Search Customer, ID..." 
              className="bg-transparent border-none focus:ring-0 text-sm w-full outline-none font-bold placeholder:text-slate-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 transition-all shadow-sm">
            <Filter size={20} />
          </button>
        </div>
      </header>

      <div className="bg-white rounded-[32px] md:rounded-[48px] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
        {/* Mobile View */}
        <div className="md:hidden divide-y divide-slate-100">
          {loading ? (
            <div className="p-12 text-center">
              <Loader2 className="animate-spin mx-auto mb-4 text-slate-900" size={32} />
            </div>
          ) : filteredOrders.map((order) => (
            <div key={order.id} className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-slate-100 rounded-lg text-slate-400">
                    <Hash size={14} />
                  </div>
                  <span className="font-mono text-[10px] font-black text-slate-400">{order.id.slice(0, 10)}</span>
                </div>
                <span className={`text-[8px] font-black px-3 py-1 rounded-full border ${getStatusStyle(order.status)} uppercase tracking-widest`}>
                  {order.status}
                </span>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-xs">
                  {order.shippingDetails?.name?.[0] || 'U'}
                </div>
                <div>
                  <h4 className="font-black text-slate-900 text-sm">{order.shippingDetails?.name || 'Unknown'}</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{order.shippingDetails?.phone}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="text-xl font-black text-slate-900">${order.totalAmount.toFixed(2)}</div>
                <div className="flex gap-2">
                  <button onClick={() => setSelectedOrder(order)} className="p-3 bg-slate-50 text-slate-600 rounded-xl">
                    <Eye size={18} />
                  </button>
                  <button className="p-3 bg-slate-900 text-white rounded-xl shadow-lg shadow-black/10 transition-all active:scale-95">
                    <Truck size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                <th className="px-8 py-6">Order ID</th>
                <th className="px-8 py-6">Customer</th>
                <th className="px-8 py-6">Items</th>
                <th className="px-8 py-6">Total</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <Hash size={14} className="text-slate-300" />
                      <span className="font-mono text-[10px] font-black text-slate-400 uppercase">
                        {order.id.slice(0, 12)}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-xs uppercase">
                        {order.shippingDetails?.name?.[0] || 'U'}
                      </div>
                      <div>
                        <div className="text-sm font-black text-slate-900">{order.shippingDetails?.name || 'Unknown'}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{order.shippingDetails?.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    {order.items.length} Products
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-base font-black text-slate-900">${order.totalAmount.toFixed(2)}</div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`text-[9px] font-black px-4 py-1.5 rounded-full border ${getStatusStyle(order.status)} uppercase tracking-widest`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="p-2.5 hover:bg-slate-100 rounded-xl transition-all"
                      >
                        <Eye size={18} className="text-slate-400" />
                      </button>
                      <button className="p-2.5 hover:bg-slate-900 hover:text-white rounded-xl transition-all">
                        <Truck size={18} className="text-slate-400 hover:text-white" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="bg-white rounded-[40px] md:rounded-[56px] shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row relative"
            >
              <button 
                onClick={() => setSelectedOrder(null)} 
                className="absolute top-4 right-4 md:top-8 md:right-8 z-[110] p-3 md:p-4 bg-slate-900 text-white rounded-full hover:bg-black transition-all shadow-xl active:scale-90"
              >
                <X size={20} />
              </button>

              {/* Left Side: Items & Summary */}
              <div className="flex-grow p-6 md:p-12 bg-slate-50 overflow-y-auto">
                <header className="mb-8 md:mb-12">
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] mb-2">Internal Manifest</div>
                  <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase items-center flex gap-4">
                    Invoice <Package className="text-slate-200 hidden sm:block" size={40} />
                  </h2>
                </header>

                <div className="space-y-4">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row items-center gap-4 md:gap-8 bg-white p-4 md:p-6 rounded-3xl md:rounded-[40px] border border-slate-100 shadow-sm">
                      <div className="w-20 h-20 rounded-2xl md:rounded-3xl bg-slate-100 overflow-hidden shrink-0">
                        <img src={item.image} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-grow text-center sm:text-left">
                        <div className="text-lg font-black text-slate-900 uppercase tracking-tighter">{item.name}</div>
                        <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">Price: ${item.price.toFixed(2)}</div>
                      </div>
                      <div className="flex items-center gap-8 md:gap-10">
                        <div className="flex flex-col items-center">
                          <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Qty</span>
                          <span className="text-lg font-black text-slate-900">x{item.quantity}</span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Subtotal</span>
                          <span className="text-xl font-black text-slate-900">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 md:mt-12 p-8 md:p-10 bg-slate-900 rounded-[32px] md:rounded-[48px] text-white flex flex-col sm:flex-row justify-between items-center gap-8 shadow-2xl">
                  <div className="text-center sm:text-left">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Valuation</p>
                    <div className="text-4xl md:text-6xl font-black tracking-tighter">${selectedOrder.totalAmount.toFixed(2)}</div>
                  </div>
                  <div className="flex gap-3">
                    <div className="px-4 md:px-6 py-3 md:py-4 bg-white/5 rounded-2xl border border-white/10 text-center">
                      <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Status</p>
                      <p className="text-[10px] font-black text-white uppercase">{selectedOrder.status}</p>
                    </div>
                    <div className="px-4 md:px-6 py-3 md:py-4 bg-white/5 rounded-2xl border border-white/10 text-center">
                      <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Nodes</p>
                      <p className="text-lg font-black text-white">{selectedOrder.items.length}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: Shipping & Buyer Meta */}
              <div className="w-full md:w-[400px] p-6 md:p-12 overflow-y-auto border-t md:border-t-0 md:border-l border-slate-100 flex flex-col space-y-10">
                <section>
                  <h4 className="text-[9px] font-black text-slate-300 uppercase tracking-[0.4em] mb-6 md:mb-8">Logistics Hub</h4>
                  <div className="space-y-6 md:space-y-8">
                    <div className="flex items-start gap-5">
                      <div className="p-3 bg-slate-100 rounded-xl text-slate-500">
                        <User size={20} />
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Purchaser</p>
                        <p className="text-base font-black text-slate-900">{selectedOrder.shippingDetails?.name || 'Guest'}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-5">
                      <div className="p-3 bg-slate-100 rounded-xl text-slate-500">
                        <Phone size={20} />
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Node Reference</p>
                        <p className="text-base font-black text-slate-900">{selectedOrder.shippingDetails?.phone}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-5">
                      <div className="p-3 bg-slate-100 rounded-xl text-slate-500">
                        <MapPin size={20} />
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Geocode Area</p>
                        <p className="text-base font-black text-slate-900">{selectedOrder.shippingDetails?.area}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-5">
                      <div className="p-3 bg-slate-100 rounded-xl text-slate-500">
                        <Home size={20} />
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Address</p>
                        <p className="text-xs font-bold text-slate-600 leading-relaxed">{selectedOrder.shippingDetails?.address}</p>
                      </div>
                    </div>
                  </div>
                </section>

                <div className="mt-auto p-6 bg-slate-50 rounded-3xl border border-slate-100">
                  <div className="grid grid-cols-1 gap-2">
                    <button 
                      onClick={() => updateStatus(selectedOrder.id, OrderStatus.CONFIRMED)}
                      className="w-full py-4 bg-white text-slate-900 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                    >
                      Confirm Node
                    </button>
                    <button 
                      onClick={() => updateStatus(selectedOrder.id, OrderStatus.DELIVERED)}
                      className="w-full py-4 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-black/10"
                    >
                      Terminate Logistics
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
