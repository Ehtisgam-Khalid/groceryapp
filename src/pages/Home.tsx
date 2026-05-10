import { useState, useEffect } from 'react';
import { collection, getDocs, query, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product, Category } from '../types';
import ProductCard from '../components/ProductCard';
import { ChevronRight, ArrowRight, Truck, ShieldCheck, Clock, Award, ShoppingBag, Zap, TrendingUp, Search } from 'lucide-react';
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

  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="pb-32 min-h-screen bg-[#FDFCFB] overflow-x-hidden">
      {/* Desktop Search / Header */}
      <div className="hidden lg:flex items-center justify-between px-12 py-8">
        <h1 className="text-3xl font-black tracking-tight text-slate-900 italic">Fresh<span className="text-emerald-500">Box</span></h1>
        <div className="flex items-center bg-white rounded-2xl px-6 py-3 shadow-sm border border-slate-100 min-w-[500px]">
          <Search size={20} className="text-slate-300" />
          <input 
            type="text" 
            placeholder="Search premium groceries..." 
            className="bg-transparent border-none focus:ring-0 text-sm w-full ml-4 font-medium placeholder:text-slate-200 outline-none"
          />
        </div>
        <div className="flex items-center gap-6 text-slate-400 font-bold text-xs uppercase tracking-widest">
           <span className="text-slate-900 border-b-2 border-emerald-500 pb-1">Groceries</span>
           <span className="hover:text-slate-900 transition-colors">Recipes</span>
           <span className="hover:text-slate-900 transition-colors">Offers</span>
        </div>
      </div>

      {/* Modern Hero Section */}
      <section className="px-6 lg:px-12 pt-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative h-[240px] md:h-[500px] rounded-[3rem] overflow-hidden group shadow-2xl shadow-emerald-900/5"
        >
          {/* Layered Backgrounds */}
          <div className="absolute inset-0 bg-slate-900">
            <img 
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1200" 
              className="w-full h-full object-cover opacity-60 scale-105 group-hover:scale-100 transition-transform duration-[2000ms]"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/60 to-transparent"></div>
          
          <div className="relative z-10 h-full flex flex-col justify-center px-8 md:px-20">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 px-4 py-1.5 rounded-full mb-6 w-fit"
            >
              <Zap size={14} className="text-emerald-400 fill-emerald-400" />
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Premium Selection</span>
            </motion.div>

            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-8xl font-black text-white leading-[0.95] tracking-tighter mb-8 max-w-2xl"
            >
              Freshness<br/>
              <span className="text-emerald-400">Simplified.</span>
            </motion.h2>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-4"
            >
              <button className="bg-emerald-500 text-white px-10 py-5 rounded-[2rem] font-bold text-sm hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/20 flex items-center gap-3 active:scale-95">
                Explore Market <ArrowRight size={20} />
              </button>
              <div className="hidden md:flex flex-col ml-8">
                 <span className="text-white/40 text-[10px] uppercase font-black tracking-widest mb-1">Stocked precisely</span>
                 <span className="text-white font-bold">2 Hours Ago</span>
              </div>
            </motion.div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute bottom-10 right-10 hidden lg:flex items-center gap-4">
             <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white cursor-pointer hover:bg-white hover:text-slate-900 transition-all">
                <ChevronRight className="rotate-180" />
             </div>
             <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white cursor-pointer hover:bg-white hover:text-slate-900 transition-all">
                <ChevronRight />
             </div>
          </div>
        </motion.div>
      </section>

      {/* Categories Grid - Elevated */}
      <section className="mt-20 px-6 lg:px-12">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              Market Sections <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            </h3>
            <p className="text-slate-400 text-sm font-medium mt-1">Organized precisely for your needs</p>
          </div>
          <button className="hidden md:flex items-center gap-2 text-xs font-black text-emerald-600 uppercase tracking-widest group">
            All Categories <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
          <motion.div 
            whileHover={{ y: -5 }}
            onClick={() => setSelectedCategory('All')}
            className={`group h-40 rounded-[2.5rem] border-2 p-6 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all duration-500 ${selectedCategory === 'All' ? 'bg-emerald-500 border-emerald-500 text-white shadow-2xl shadow-emerald-100' : 'bg-white border-slate-50 text-slate-600 hover:border-emerald-100 hover:shadow-xl'}`}
          >
            <div className="text-4xl group-hover:scale-125 transition-transform duration-500">🧺</div>
            <span className="font-bold text-xs uppercase tracking-widest">All</span>
          </motion.div>
          {categories.map((cat) => (
            <motion.div 
              key={cat.id}
              whileHover={{ y: -5 }}
              onClick={() => setSelectedCategory(cat.name)}
              className={`group h-40 rounded-[2.5rem] border-2 p-6 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all duration-500 ${selectedCategory === cat.name ? 'bg-emerald-500 border-emerald-500 text-white shadow-2xl shadow-emerald-100' : 'bg-white border-slate-50 text-slate-600 hover:border-emerald-100 hover:shadow-xl'}`}
            >
              <div className="text-4xl group-hover:scale-125 transition-transform duration-500">{cat.icon || '🥬'}</div>
              <span className="font-bold text-xs uppercase tracking-widest">{cat.name}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Product List - Premium Layout */}
      <section className="mt-24 px-6 lg:px-12">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Today's Highlights</h3>
            <p className="text-slate-400 text-sm font-medium mt-1">Hand-picked by our produce experts</p>
          </div>
          <div className="flex items-center gap-3 bg-emerald-50 px-5 py-2.5 rounded-2xl border border-emerald-100">
            <TrendingUp size={16} className="text-emerald-600" />
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Live Updates</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-6 md:gap-10">
          {loading ? (
            Array(10).fill(0).map((_, i) => (
              <div key={i} className="aspect-[4/5] bg-slate-100 rounded-[3rem] animate-pulse"></div>
            ))
          ) : filteredProducts.map((prod) => (
            <ProductCard 
              key={prod.id} 
              product={prod} 
            />
          ))}
        </div>

        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-32 bg-slate-50 rounded-[4rem] border border-slate-100">
            <div className="text-6xl mb-6 grayscale opacity-20">🛒</div>
            <h4 className="text-xl font-bold text-slate-900">Restocking in Progress</h4>
            <p className="text-slate-400 text-sm mt-2">Come back in 15 minutes for new stock!</p>
          </div>
        )}
      </section>

      {/* New Arrivals Section */}
      <section className="mt-12 px-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-slate-900">New Arrivals</h3>
          <button className="text-xs font-bold text-slate-400">View All</button>
        </div>
        
        <div className="bg-soft-teal rounded-[40px] p-8 overflow-hidden relative">
          <div className="relative z-10">
            <h4 className="text-xl font-bold text-slate-800 mb-2">Fresh Bakery Items</h4>
            <p className="text-xs text-slate-500 mb-6 font-medium">Get fresh bread and pastries every morning</p>
            <button className="bg-brand-500 text-white px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-brand-200 active:scale-95">
              Explore Now
            </button>
          </div>
          <div className="absolute right-0 bottom-0 w-32 h-32 bg-white/20 rounded-tl-full"></div>
        </div>
      </section>
    </div>
  );
}
