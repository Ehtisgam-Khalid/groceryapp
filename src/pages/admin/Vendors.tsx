import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Search, Plus, Store, Star, Mail, MapPin, MoreVertical, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminVendors() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'vendors'));
      setVendors(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      toast.error('Failed to fetch vendors');
    } finally {
      setLoading(false);
    }
  };

  const filteredVendors = vendors.filter(v => 
    v.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    v.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in pb-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter uppercase">Vendor Hub</h1>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-1">Manage supply nodes and partnerships</p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-slate-100 flex-grow md:w-[350px] shadow-sm transition-all focus-within:ring-4 focus-within:ring-slate-50">
            <Search size={18} className="text-slate-300" />
            <input 
              type="text" 
              placeholder="Search Entities..." 
              className="bg-transparent border-none focus:ring-0 text-sm w-full font-bold placeholder:text-slate-200 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-5 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-black/10 shrink-0">
            <Plus size={18} />
            <span className="hidden sm:inline">Add Entity</span>
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {loading ? (
             <div className="col-span-full py-20 text-center text-slate-300">
                <Loader2 className="animate-spin mx-auto mb-4" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Querying Supply Nodes...</span>
             </div>
        ) : filteredVendors.length === 0 ? (
          <div className="col-span-full py-20 bg-white rounded-[48px] border border-dashed border-slate-200 text-center text-slate-400 font-black uppercase text-[10px] tracking-widest shadow-inner">
             Zero active vendors detected.
          </div>
        ) : filteredVendors.map((vendor) => (
          <div key={vendor.id} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 translate-x-12 -translate-y-12 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
            
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-8 md:mb-10">
                <div className="w-16 h-16 rounded-[24px] bg-slate-900 text-white flex items-center justify-center shadow-2xl shadow-black/20 group-hover:bg-black transition-colors">
                  <Store size={28} />
                </div>
                <button className="p-3 text-slate-200 hover:text-slate-900 transition-colors">
                  <MoreVertical size={20} />
                </button>
              </div>
              
              <h3 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight">{vendor.name}</h3>
              <div className="flex items-center gap-1.5 mb-6">
                <Star size={10} className="fill-slate-900 text-slate-900" />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">{vendor.rating || '5.0'} Global Rating</span>
              </div>

              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-slate-400 text-[10px] font-black uppercase tracking-tight">
                  <Mail size={14} className="text-slate-200" /> <span className="truncate">{vendor.email}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-400 text-[10px] font-black uppercase tracking-tight">
                  <MapPin size={14} className="text-slate-200" /> City Hub Alpha
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                <div className="text-center">
                  <div className="text-base font-black text-slate-900 leading-none mb-1">24</div>
                  <div className="text-[8px] font-black text-slate-300 uppercase tracking-[0.2em]">Assets</div>
                </div>
                <div className="w-px h-6 bg-slate-100"></div>
                <div className="text-center">
                  <div className="text-base font-black text-slate-900 leading-none mb-1">1.2k</div>
                  <div className="text-[8px] font-black text-slate-300 uppercase tracking-[0.2em]">Traffic</div>
                </div>
                <div className="w-px h-6 bg-slate-100"></div>
                <div className="text-center">
                  <div className="text-[9px] font-black text-slate-900 px-3 py-1 bg-slate-50 border border-slate-100 rounded-full uppercase tracking-widest group-hover:bg-slate-900 group-hover:text-white transition-all">Active</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
