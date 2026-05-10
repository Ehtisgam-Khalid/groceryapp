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

  const addToWishlist = (p: Product) => {
    toast.success(`${p.name} added to wishlist!`);
  };

  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="pb-32 min-h-screen bg-soft-beige overflow-x-hidden">
      {/* Search Header for Mobile */}
      <div className="lg:hidden px-6 pt-6 pb-2">
        <div className="flex items-center bg-white rounded-3xl px-5 py-3.5 shadow-sm border border-slate-100">
          <Search size={18} className="text-slate-300" />
          <input 
            type="text" 
            placeholder="Search for groceries and more..." 
            className="bg-transparent border-none focus:ring-0 text-sm w-full ml-3 font-medium placeholder:text-slate-300 outline-none"
          />
        </div>
      </div>

      {/* Hero Section - App Style */}
      <section className="px-6 pt-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative h-48 md:h-[320px] bg-soft-orange rounded-[40px] p-8 flex items-center overflow-hidden"
        >
          <div className="relative z-10 max-w-sm">
            <h2 className="text-2xl md:text-5xl font-black text-slate-800 leading-[1.1] mb-6">
              30% Off Your<br/>First Order
            </h2>
            <button className="bg-slate-900 text-white px-8 py-3 rounded-full text-xs font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95">
              Order Now
            </button>
          </div>
          <img 
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400" 
            className="absolute right-0 top-0 h-full w-1/2 object-cover opacity-80 mix-blend-multiply md:mix-blend-normal"
            referrerPolicy="no-referrer"
          />
          {/* Decorative dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5">
            <div className="w-6 h-1.5 bg-slate-900 rounded-full"></div>
            <div className="w-1.5 h-1.5 bg-slate-300 rounded-full"></div>
            <div className="w-1.5 h-1.5 bg-slate-300 rounded-full"></div>
          </div>
        </motion.div>
      </section>

      {/* Categories Grid/Carousel */}
      <section className="mt-10 px-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-slate-900">Categories</h3>
          <button className="text-xs font-bold text-slate-400">View All</button>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-2 px-2">
          <motion.div 
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedCategory('All')}
            className={`flex-shrink-0 flex items-center gap-3 px-6 py-3 rounded-2xl border transition-all cursor-pointer ${selectedCategory === 'All' ? 'bg-brand-500 border-brand-500 text-white shadow-lg shadow-brand-100' : 'bg-white border-slate-100 text-slate-600 shadow-sm'}`}
          >
            <span className="text-lg">📦</span>
            <span className="text-xs font-bold">All</span>
          </motion.div>
          {categories.map((cat) => (
            <motion.div 
              key={cat.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(cat.name)}
              className={`flex-shrink-0 flex items-center gap-3 px-6 py-3 rounded-2xl border transition-all cursor-pointer ${selectedCategory === cat.name ? 'bg-brand-500 border-brand-500 text-white shadow-lg shadow-brand-100' : 'bg-white border-slate-100 text-slate-600 shadow-sm'}`}
            >
              <span className="text-lg">{cat.icon || '🥬'}</span>
              <span className="text-xs font-bold">{cat.name}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Product List */}
      <section className="mt-10 px-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-slate-900">Popular Items</h3>
          <button className="text-xs font-bold text-slate-400">View All</button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {loading ? (
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="aspect-[4/5] bg-white rounded-[32px] animate-pulse"></div>
            ))
          ) : filteredProducts.map((prod) => (
            <ProductCard 
              key={prod.id} 
              product={prod} 
              onAddToWishlist={addToWishlist} 
            />
          ))}
        </div>
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
