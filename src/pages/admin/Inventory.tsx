import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Product, Category } from '../../types';
import { Search, Plus, Edit2, Trash2, Package, Filter, MoreVertical, Loader2, X, Image as ImageIcon, Tag, ArrowUpRight, Zap, Target } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'motion/react';

export default function Inventory() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    category: '',
    stock: 0,
    images: [''],
    vendorId: 'system',
    isFeatured: false
  });

  const [categoryData, setCategoryData] = useState({
    name: '',
    icon: 'Package'
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'products'));
      setProducts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
    } catch (err) {
      toast.error('Failed to fetch inventory');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const snap = await getDocs(query(collection(db, 'categories'), orderBy('name')));
      setCategories(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category)));
    } catch (err) {
      console.error('Failed to fetch categories');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteDoc(doc(db, 'products', id));
        toast.success('Product deleted');
        fetchProducts();
      } catch (err) {
        toast.error('Failed to delete product');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingProduct) {
        await updateDoc(doc(db, 'products', editingProduct.id), formData);
        toast.success('Product updated');
      } else {
        await addDoc(collection(db, 'products'), {
          ...formData,
          rating: 4.5, // Default rating for new items
          reviewCount: 0,
        });
        toast.success('Product added');
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (err) {
      toast.error('Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryData.name) return;
    try {
      await addDoc(collection(db, 'categories'), categoryData);
      toast.success('Category added');
      setIsCategoryModalOpen(false);
      setCategoryData({ name: '', icon: 'Package' });
      fetchCategories();
    } catch (err) {
      toast.error('Failed to add category');
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-in">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Product Catalog</h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Manage inventory and stock levels</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-slate-100 flex-grow max-w-md shadow-sm focus-within:ring-4 focus-within:ring-brand-50 transition-all">
            <Search size={18} className="text-slate-300" />
            <input 
              type="text" 
              placeholder="Search products..." 
              className="bg-transparent border-none focus:ring-0 text-sm w-full outline-none font-bold placeholder:text-slate-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsCategoryModalOpen(true)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-white border border-slate-100 rounded-2xl text-[10px] font-bold text-slate-600 uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm"
            >
              <Tag size={16} />
              Categories
            </button>
            
            <button 
              onClick={() => { 
                setEditingProduct(null); 
                setFormData({
                  name: '',
                  description: '',
                  price: 0,
                  category: categories[0]?.name || '',
                  stock: 0,
                  images: [''],
                  vendorId: 'system',
                  isFeatured: false
                });
                setIsModalOpen(true); 
              }}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200"
            >
              <Plus size={18} />
              Publish
            </button>
          </div>
        </div>
      </header>

      {/* Grid container */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        {/* Card view for mobile */}
        <div className="md:hidden divide-y divide-slate-100">
          {loading && products.length === 0 ? (
            <div className="p-12 text-center">
              <Loader2 className="animate-spin mx-auto mb-4 text-slate-900" size={32} />
              <span className="font-black text-[10px] uppercase tracking-[0.3em] text-slate-300">Cataloging...</span>
            </div>
          ) : filteredProducts.map((prod) => (
            <div key={prod.id} className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden shrink-0">
                  <img src={prod.images[0]} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-900 truncate">{prod.name}</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest truncate">#{prod.id.slice(0, 8)}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-full text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                  {prod.category}
                </div>
                <div className="text-xl font-bold text-slate-900 tracking-tight">${prod.price.toFixed(2)}</div>
              </div>
              <div className="flex items-center justify-between">
                <div className={`px-4 py-2 rounded-xl text-[9px] font-bold uppercase tracking-widest border ${prod.stock > 10 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                  {prod.stock} In Stock
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      setEditingProduct(prod);
                      setFormData({
                        name: prod.name,
                        description: prod.description,
                        price: prod.price,
                        category: prod.category,
                        stock: prod.stock,
                        images: prod.images,
                        vendorId: prod.vendorId,
                        isFeatured: prod.isFeatured
                      });
                      setIsModalOpen(true);
                    }}
                    className="p-3 bg-slate-50 text-slate-600 rounded-xl"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(prod.id)} className="p-3 bg-red-50 text-red-600 rounded-xl">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table view */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                <th className="px-10 py-6 text-left">Product Information</th>
                <th className="px-10 py-6 text-left">Category</th>
                <th className="px-10 py-6 text-left">Price</th>
                <th className="px-10 py-6 text-left">Status</th>
                <th className="px-10 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-10 py-24 text-center">
                    <Loader2 className="animate-spin mx-auto mb-4 text-brand-500" size={32} />
                    <span className="font-black text-[10px] uppercase tracking-[0.3em] text-slate-300">Cataloging digital assets...</span>
                  </td>
                </tr>
              ) : filteredProducts.map((prod) => (
                <tr key={prod.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 rounded-3xl bg-slate-100 overflow-hidden shadow-inner flex-shrink-0 group-hover:scale-105 transition-transform duration-500">
                        <img src={prod.images[0]} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div>
                        <div className="text-base font-bold text-slate-900 group-hover:text-brand-500 transition-colors">{prod.name}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1.5 mt-1">
                          <Package size={10} className="text-slate-300" /> #{prod.id.slice(0, 8)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <span className="text-[9px] font-bold text-brand-500 bg-brand-50 px-4 py-1.5 rounded-full uppercase tracking-widest border border-brand-100 shadow-sm">
                      {prod.category}
                    </span>
                  </td>
                  <td className="px-10 py-8">
                    <div className="text-lg font-bold text-slate-900 tracking-tight leading-none">${prod.price.toFixed(2)}</div>
                  </td>
                  <td className="px-10 py-8">
                    <div className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl shadow-sm border ${prod.stock > 10 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                      {prod.stock > 10 ? <Target size={14} /> : <Zap size={14} />}
                      <span className="text-[10px] font-bold uppercase tracking-widest">{prod.stock} In Stock</span>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <button 
                        onClick={() => {
                          setEditingProduct(prod);
                          setFormData({
                            name: prod.name,
                            description: prod.description,
                            price: prod.price,
                            category: prod.category,
                            stock: prod.stock,
                            images: prod.images,
                            vendorId: prod.vendorId,
                            isFeatured: prod.isFeatured
                          });
                          setIsModalOpen(true);
                        }}
                        className="p-3 bg-white text-slate-400 hover:text-brand-600 hover:bg-brand-50 border border-slate-100 rounded-2xl transition-all shadow-sm active:scale-90"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(prod.id)} className="p-3 bg-white text-slate-400 hover:text-red-500 hover:bg-red-50 border border-slate-100 rounded-2xl transition-all shadow-sm active:scale-90">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Modal Overlay */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 40 }}
                className="bg-white rounded-[40px] md:rounded-[64px] shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row h-full md:h-auto max-h-[90vh]"
              >
                {/* Left Side: Visual Preview */}
                <div className="w-full md:w-1/3 bg-slate-900 p-8 md:p-12 text-white flex flex-col justify-between relative overflow-hidden shrink-0">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px]"></div>
                  <div className="relative z-10 hidden md:block">
                    <Package size={48} className="text-white/20 mb-8" />
                    <h2 className="text-4xl lg:text-6xl font-black tracking-tighter leading-none mb-6">
                      {editingProduct ? 'Edit Item' : 'New Item'}
                    </h2>
                    <p className="text-[10px] text-slate-400 font-bold tracking-[0.2em] uppercase leading-relaxed">Ensure all specifications match hardware stock.</p>
                  </div>
                  
                  <div className="relative z-10 flex flex-row md:flex-col gap-6 items-center md:items-stretch">
                    <div className="w-24 h-24 md:w-full aspect-square rounded-3xl md:rounded-[40px] bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                      {formData.images[0] ? (
                        <img src={formData.images[0]} className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon size={40} className="text-white/20" />
                      )}
                    </div>
                    <div className="flex-1 p-4 md:p-5 bg-white text-slate-900 rounded-2xl md:rounded-3xl shadow-2xl">
                      <div className="text-[8px] md:text-[10px] font-black uppercase tracking-widest opacity-40 mb-1 md:mb-2">Valuation</div>
                      <div className="text-2xl md:text-3xl font-black tracking-tighter">${formData.price.toFixed(2)}</div>
                    </div>
                  </div>
                </div>

                {/* Right Side: Form Controls */}
                <div className="flex-grow flex flex-col bg-slate-50 overflow-hidden">
                  <div className="px-8 md:px-12 py-6 md:py-8 flex items-center justify-between bg-white border-b border-slate-100">
                    <span className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-300">Technical Attributes</span>
                    <button onClick={() => setIsModalOpen(false)} className="p-3 bg-slate-50 rounded-full hover:bg-slate-900 hover:text-white transition-all active:scale-90">
                      <X size={20} />
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-8 overflow-y-auto flex-grow custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                      <div className="space-y-3">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Official Name</label>
                        <input 
                          required
                          type="text" 
                          placeholder="Product name"
                          className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 bg-white focus:border-slate-900 outline-none transition-all font-bold text-sm"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Classification</label>
                        <select 
                          required
                          className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 bg-white focus:border-slate-900 outline-none transition-all font-bold text-sm appearance-none cursor-pointer"
                          value={formData.category}
                          onChange={(e) => setFormData({...formData, category: e.target.value})}
                        >
                          <option value="">Select Category</option>
                          {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                        </select>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Cost (USD)</label>
                        <input 
                          required
                          type="number" 
                          step="0.01"
                          className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 bg-white focus:border-slate-900 outline-none transition-all font-bold text-sm"
                          value={formData.price}
                          onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">In Stock</label>
                        <input 
                          required
                          type="number" 
                          className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 bg-white focus:border-slate-900 outline-none transition-all font-bold text-sm"
                          value={formData.stock}
                          onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value)})}
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Image Source</label>
                      <input 
                        required
                        type="url" 
                        placeholder="https://..."
                        className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 bg-white focus:border-slate-900 outline-none transition-all font-bold text-sm"
                        value={formData.images[0]}
                        onChange={(e) => setFormData({...formData, images: [e.target.value]})}
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Summary</label>
                      <textarea 
                        required
                        rows={3}
                        className="w-full px-5 py-5 rounded-2xl border border-slate-200 bg-white focus:border-slate-900 outline-none transition-all font-bold text-sm resize-none"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                      ></textarea>
                    </div>

                    <button 
                      type="submit"
                      disabled={loading}
                      className="w-full bg-slate-900 text-white py-5 rounded-2xl text-[9px] font-black uppercase tracking-[0.4em] hover:bg-black transition-all shadow-xl shadow-slate-200 disabled:opacity-50 active:scale-95"
                    >
                      {loading ? 'Processing...' : editingProduct ? 'Commit Changes' : 'Publish Item'}
                    </button>
                  </form>
                </div>
              </motion.div>

          </div>
        )}
      </AnimatePresence>

      {/* Category Modal Overlay */}
      <AnimatePresence>
        {isCategoryModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="bg-white rounded-[64px] shadow-2xl w-full max-w-xl overflow-hidden"
            >
              <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Categories</h2>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Taxonomy System</p>
                </div>
                <button onClick={() => setIsCategoryModalOpen(false)} className="p-3 bg-slate-50 rounded-full hover:bg-slate-900 hover:text-white transition-all active:scale-90">
                  <X size={20} />
                </button>
              </div>

              <div className="p-10 space-y-10 bg-slate-50">
                <form onSubmit={handleCategorySubmit} className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">New Descriptor</label>
                  <div className="flex gap-4">
                    <input 
                      type="text" 
                      placeholder="e.g. Artisanal Dairy"
                      className="flex-grow px-6 py-4 rounded-2xl border border-slate-200 bg-white focus:ring-4 focus:ring-brand-50 focus:border-brand-500 outline-none transition-all font-bold text-sm shadow-sm"
                      value={categoryData.name}
                      onChange={(e) => setCategoryData({...categoryData, name: e.target.value})}
                    />
                    <button type="submit" className="px-8 bg-brand-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-brand-700 transition-all shadow-lg active:scale-90">
                      Add
                    </button>
                  </div>
                </form>

                <div className="space-y-3 max-h-72 overflow-y-auto pr-2 custom-scrollbar">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Active Taxonomy</label>
                  {categories.map(c => (
                    <div key={c.id} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 group hover:border-brand-200 transition-all shadow-sm">
                      <span className="text-sm font-black text-slate-700 uppercase tracking-tight">{c.name}</span>
                      <button 
                        onClick={async () => {
                          if(confirm(`Delete category "${c.name}"?`)) {
                            await deleteDoc(doc(db, 'categories', c.id));
                            fetchCategories();
                            toast.success('Category deleted');
                          }
                        }}
                        className="p-2 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
