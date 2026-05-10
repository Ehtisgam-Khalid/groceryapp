import { useState, useEffect } from 'react';
import { collection, getDocs, query, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product, Category } from '../types';
import ProductCard from '../components/ProductCard';
import { ChevronRight, ArrowRight, Truck, ShieldCheck, Clock, Award, ShoppingBag, Zap, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const prodSnap = await getDocs(query(collection(db, 'products'), limit(20)));
        setProducts(prodSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));

        const catSnap = await getDocs(collection(db, 'categories'));
        setCategories(catSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category)));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const addToWishlist = (p: Product) => {
    toast.success(`${p.name} added to wishlist!`);
  };

  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="pb-20 max-w-[1440px] mx-auto min-h-screen bg-slate-50">
      {/* Premium Hero Banner */}
      <section className="px-4 md:px-12 pt-12">
        <div className="relative h-[480px] bg-slate-900 rounded-[64px] p-10 md:p-20 flex items-center overflow-hidden shadow-2xl shadow-brand-900/20">
          {/* Decorative gradients */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-500/10 rounded-full blur-[120px] -mr-48 -mt-48"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-600/5 rounded-full blur-[100px] -ml-24 -mb-24"></div>
          
          <div className="relative z-10 max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-xl px-5 py-2 rounded-full mb-8 border border-white/10"
            >
              <Zap size={14} className="text-brand-400 fill-brand-400" />
              <span className="text-[10px] font-black text-brand-400 uppercase tracking-[0.3em]">Freshly Harvested Today</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter mb-10"
            >
              The Modern<br/>
              <span className="text-brand-500">Grocery</span> Store
            </motion.h1>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap items-center gap-4"
            >
              <button className="bg-brand-500 text-white px-10 py-5 rounded-3xl font-black text-sm hover:bg-brand-400 transition-all shadow-2xl shadow-brand-950/20 flex items-center gap-3 group uppercase tracking-widest leading-none">
                Start Shopping <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
              </button>
              <div className="flex -space-x-3 items-center ml-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-4 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-bold text-white overflow-hidden uppercase">
                    {['A', 'B', 'C'][i-1]}
                  </div>
                ))}
                <div className="ml-6 text-slate-400 font-bold text-xs uppercase tracking-widest">+2k Happy Customers</div>
              </div>
            </motion.div>
          </div>

          <div className="hidden xl:grid grid-cols-2 gap-6 absolute right-20 z-10 scale-110 rotate-3">
             {[
               { img: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=200', label: 'Fresh' },
               { img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=200', label: 'Organic' },
               { img: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?q=80&w=200', label: 'Fruits' },
               { img: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?q=80&w=200', label: 'Veggies' }
             ].map((item, i) => (
               <motion.div 
                 key={i}
                 initial={{ opacity: 0, scale: 0.8 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ delay: 0.3 + i * 0.1 }}
                 className="w-32 h-32 rounded-[32px] overflow-hidden border border-white/10 shadow-2xl relative group"
               >
                 <img src={item.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                 <div className="absolute inset-0 bg-emerald-950/20"></div>
                 <div className="absolute bottom-2 left-0 right-0 text-center text-[8px] font-black text-white uppercase tracking-widest">{item.label}</div>
               </motion.div>
             ))}
          </div>
        </div>
      </section>

      <div className="flex flex-col lg:flex-row gap-16 px-4 md:px-12 mt-20">
        {/* Main Content Area */}
        <div className="flex-1 space-y-24">
          {/* Categories Horizontal Scroll */}
          <section>
            <div className="flex items-center justify-between mb-10">
              <div>
                <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Explore Freshness</h3>
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Pick by category</p>
              </div>
              <button className="flex items-center gap-2 text-xs font-black text-brand-600 uppercase tracking-[0.2em] hover:opacity-80 transition-opacity">View All Categories <ChevronRight size={16} /></button>
            </div>
            
            <div className="flex gap-8 overflow-x-auto pb-10 -mx-4 px-4 scrollbar-hide">
              <motion.div 
                whileHover={{ y: -8 }}
                onClick={() => setSelectedCategory('All')}
                className={`flex-shrink-0 w-36 aspect-square rounded-[48px] border-2 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${selectedCategory === 'All' ? 'bg-brand-600 border-brand-600 text-white shadow-2xl shadow-brand-900/20 scale-105' : 'bg-white border-slate-100 text-slate-600 hover:border-brand-200'}`}
              >
                <div className="text-4xl">🧺</div>
                <span className="font-black text-[10px] uppercase tracking-widest">Everything</span>
              </motion.div>
              {categories.map((cat) => (
                <motion.div 
                  key={cat.id}
                  whileHover={{ y: -8 }}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`flex-shrink-0 w-36 aspect-square rounded-[48px] border-2 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${selectedCategory === cat.name ? 'bg-brand-600 border-brand-600 text-white shadow-2xl shadow-brand-900/20 scale-105' : 'bg-white border-slate-100 text-slate-600 hover:border-brand-200'}`}
                >
                  <div className="text-4xl">{cat.icon || '📦'}</div>
                  <span className="font-black text-[10px] uppercase tracking-widest">{cat.name}</span>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Product Feed */}
          <section>
            <div className="flex items-center justify-between mb-12">
              <div>
                <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Fresh Arrivals</h3>
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Stocked precisely 2 hours ago</p>
              </div>
              <div className="flex items-center gap-3 bg-brand-50 px-5 py-2.5 rounded-2xl border border-brand-100">
                <TrendingUp size={16} className="text-brand-600" />
                <span className="text-[10px] font-black text-brand-600 uppercase tracking-widest">Trending Now</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-10">
              {loading ? (
                Array(8).fill(0).map((_, i) => (
                  <div key={i} className="h-[420px] bg-slate-100 rounded-[48px] animate-pulse"></div>
                ))
              ) : filteredProducts.map((prod) => (
                <ProductCard 
                  key={prod.id} 
                  product={prod} 
                  onAddToCart={addToCart} 
                  onAddToWishlist={addToWishlist} 
                />
              ))}
            </div>
            {!loading && filteredProducts.length === 0 && (
              <div className="text-center py-32 bg-white rounded-[64px] border border-slate-100 shadow-xl shadow-slate-200/50">
                <div className="text-7xl mb-6 grayscale opacity-50">🍱</div>
                <h4 className="text-2xl font-black text-slate-900 uppercase">Restocking This Section</h4>
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-2">Come back in a few hours for fresh stock</p>
              </div>
            )}
          </section>
        </div>

        {/* Side Panels */}
        <aside className="w-full lg:w-[400px] flex flex-col gap-10 shrink-0">
          <div className="sticky top-32 space-y-10">
            {/* Real-time Order Card */}
            <div className="bg-white rounded-[56px] p-10 border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand-50 rounded-bl-[40px] flex items-center justify-center text-brand-600">
                <Clock size={28} />
              </div>
              <h4 className="text-[10px] font-black mb-10 uppercase tracking-[0.3em] text-slate-300">Live Services</h4>
              <div className="space-y-8">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-brand-600 rounded-3xl flex items-center justify-center text-3xl shadow-xl shadow-brand-100 rotate-3 group-hover:rotate-0 transition-transform">🚚</div>
                  <div>
                    <h5 className="text-lg font-black text-slate-900 leading-none mb-1">Ultra-Fast Shipping</h5>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Available in your area</p>
                  </div>
                </div>
                <div className="pt-8 border-t border-slate-50">
                  <div className="flex justify-between items-center mb-5">
                    <span className="text-[10px] font-black uppercase text-slate-400">Current Load</span>
                    <span className="text-[10px] font-black uppercase text-brand-600 bg-brand-50 px-3 py-1 rounded-full">Optimal</span>
                  </div>
                  <div className="h-3 bg-slate-50 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '45%' }}
                      className="h-full bg-brand-500 rounded-full"
                    />
                  </div>
                  <p className="text-[9px] text-slate-300 font-bold text-center mt-4 uppercase tracking-[0.2em]">Next pickup in 18 minutes</p>
                </div>
              </div>
            </div>

            {/* Loyalty Premium */}
            <div className="bg-slate-900 rounded-[56px] p-10 text-white shadow-2xl shadow-brand-900/10 relative overflow-hidden overflow-visible">
              <div className="absolute -right-12 -top-12 w-48 h-48 bg-brand-500/10 rounded-full blur-[80px]"></div>
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-10">
                  <span className="bg-brand-500 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-brand-500/50">Membership Card</span>
                  <Award size={24} className="text-brand-400" />
                </div>
                <h5 className="text-5xl font-black mb-2 tracking-tighter">1,890</h5>
                <p className="text-[10px] text-slate-400 uppercase font-black tracking-[0.3em] mb-10">Reward Balance</p>
                
                <div className="bg-white/5 p-6 rounded-[32px] border border-white/10 backdrop-blur-md mb-8">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-black uppercase tracking-widest">Silver Tier</span>
                    <span className="text-[10px] font-black text-brand-400 uppercase">Save 15%</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="w-[65%] h-full bg-brand-500" />
                  </div>
                </div>
                
                <button className="w-full py-5 bg-brand-500 text-white text-[10px] font-black rounded-3xl hover:bg-brand-400 transition-all uppercase tracking-[0.2em] shadow-2xl shadow-brand-950/40">
                  View Privilege Center
                </button>
              </div>
            </div>

            <div className="bg-slate-900 p-1 rounded-[56px]">
              <div className="bg-brand-600 rounded-[54px] p-10 text-center space-y-6">
                <div className="text-6xl animate-bounce">📦</div>
                <h4 className="text-2xl font-black text-white leading-tight underline decoration-white/20 underline-offset-8">Same Day Delivery<br/>Everywhere</h4>
                <button className="w-full py-4 bg-white text-brand-700 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-brand-800/20 hover:scale-105 transition-all">Check My Zipcode</button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
