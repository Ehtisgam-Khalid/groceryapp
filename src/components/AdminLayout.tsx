import { LayoutDashboard, Package, ShoppingBag, Users, Settings, LogOut, TrendingUp, DollarSign, Activity, Bell, ChevronDown, ShieldCheck, Menu, X } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { auth, db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { UserProfile, UserRole } from '../types';
import { onAuthStateChanged } from 'firebase/auth';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Close sidebar on route change for mobile
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const adminEmails = ['ehtisham@gmail.com', 'ehtishamarain567@gmail.com'];
        if (adminEmails.includes(user.email || '')) {
          setIsAdmin(true);
          return;
        }

        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists() && userDoc.data().role === UserRole.ADMIN) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
          navigate('/');
        }
      } else {
        setIsAdmin(false);
        navigate('/auth');
      }
    });
    return unsub;
  }, [navigate]);

  if (isAdmin === null) return (
    <div className="h-screen flex flex-col items-center justify-center bg-white gap-4">
      <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Synchronizing Session...</span>
    </div>
  );

  if (isAdmin === false) return (
    <div className="h-screen flex flex-col items-center justify-center bg-slate-900 text-white gap-6">
      <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center text-red-500 border border-red-500/50">
        <ShieldCheck size={40} />
      </div>
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black uppercase tracking-tighter">Access Forbidden</h1>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Security Clearance Insufficient</p>
      </div>
      <Link to="/" className="px-8 py-3 bg-white text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-slate-200 transition-all">
        Return to Safety
      </Link>
    </div>
  );

  const menuItems = [
    { icon: LayoutDashboard, label: 'Control Center', path: '/admin' },
    { icon: Package, label: 'Asset Vault', path: '/admin/inventory' },
    { icon: ShoppingBag, label: 'Order Log', path: '/admin/orders' },
    { icon: Users, label: 'Access Control', path: '/admin/users' },
    { icon: Activity, label: 'Resource Flow', path: '/admin/vendors' },
    { icon: TrendingUp, label: 'Performance', path: '/admin/reports' },
    { icon: Settings, label: 'Parameters', path: '/admin/settings' },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden text-slate-900 font-sans selection:bg-brand-100 selection:text-brand-900">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[60] lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-[70] w-72 bg-slate-900 flex flex-col shrink-0 transition-transform duration-500 ease-in-out lg:relative lg:translate-x-0 overflow-hidden
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
       shadow-2xl`}>
        <div className="absolute top-0 left-0 w-full h-96 bg-brand-500/10 rounded-full blur-[80px] -translate-y-1/2"></div>
        
        <div className="h-28 px-8 flex items-center border-b border-white/5 relative z-10 justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-900 font-black shadow-2xl shadow-white/10 group-hover:rotate-12 transition-transform duration-500">SE</div>
            <div>
              <span className="text-2xl font-black tracking-tighter text-white block leading-none">ShopEasy<span className="text-white/30">.</span></span>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1 block">Enterprise Node</span>
            </div>
          </Link>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-2 text-white/50 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-grow p-8 space-y-2 relative z-10 overflow-y-auto">
          <div className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] px-4 mb-6">Management Architecture</div>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-4 px-5 py-4 rounded-3xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                location.pathname === item.path 
                  ? 'bg-white text-slate-900 shadow-2xl shadow-white/20 scale-[1.02]' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon size={18} className={location.pathname === item.path ? 'text-slate-900' : 'text-slate-600'} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-8 border-t border-white/5 relative z-10 bg-black/20">
          <button 
            onClick={() => auth.signOut()}
            className="flex items-center gap-4 px-6 py-4 w-full rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/5 hover:border-white/10 border border-transparent transition-all"
          >
            <LogOut size={16} />
            Terminate Session
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative w-full">
        <header className="h-20 lg:h-28 bg-white border-b border-slate-100 flex items-center justify-between px-6 lg:px-12 shrink-0">
          <div className="flex items-center gap-3">
             <button 
               onClick={() => setIsSidebarOpen(true)}
               className="lg:hidden p-2 text-slate-400 hover:text-slate-900"
             >
               <Menu size={24} />
             </button>
             <div className="hidden sm:flex w-10 h-10 bg-slate-900 rounded-2xl items-center justify-center text-white">
                <ShieldCheck size={20} />
             </div>
             <h2 className="font-black text-lg lg:text-xl text-slate-900 tracking-tighter uppercase leading-none">
               {menuItems.find(i => i.path === location.pathname)?.label || 'Core System'}
             </h2>
          </div>

          <div className="flex items-center gap-3 lg:gap-10">
            <div className="hidden md:flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-100">
               <button className="p-3 text-slate-400 hover:text-slate-900 hover:bg-white rounded-xl transition-all relative">
                 <Bell size={18} />
                 <div className="absolute top-2 right-2 w-2 h-2 bg-slate-900 rounded-full border-2 border-slate-50"></div>
               </button>
               <button className="p-3 text-slate-400 hover:text-slate-900 hover:bg-white rounded-xl transition-all">
                 <Settings size={18} />
               </button>
            </div>

            <div className="flex items-center gap-2 lg:gap-4 pl-4 lg:pl-10 lg:border-l border-slate-100 group cursor-pointer">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] lg:text-xs font-black text-slate-900 uppercase tracking-tight">Executive Admin</p>
                <p className="text-[8px] lg:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mt-1">Status: Active</p>
              </div>
              <div className="relative scale-75 lg:scale-100 origin-right">
                <div className="w-14 h-14 bg-slate-50 rounded-3xl border border-slate-200 flex items-center justify-center text-slate-300 shadow-sm group-hover:scale-105 transition-all">
                   <Users size={24} />
                </div>
                <div className="absolute -bottom-1 -right-1 p-1 bg-white rounded-full">
                   <div className="w-4 h-4 bg-slate-900 rounded-xl border-4 border-white"></div>
                </div>
              </div>
              <ChevronDown size={16} className="text-slate-300 group-hover:translate-y-0.5 transition-transform hidden lg:block" />
            </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-6 lg:p-12 bg-slate-50/50 custom-scrollbar text-slate-900">
          {children}
        </div>

        <footer className="h-10 lg:h-12 bg-white border-t border-slate-100 px-6 lg:px-12 flex items-center justify-between text-[8px] lg:text-[10px] font-black text-slate-300 shrink-0 uppercase tracking-[0.3em]">
          <div className="flex gap-4 lg:gap-10">
             <span className="flex items-center gap-2">Protocol: <span className="text-slate-600">Secure AES-256</span></span>
             <span className="hidden md:flex items-center gap-2">Core Health: <span className="text-slate-900">Optimal (12ms)</span></span>
          </div>
          <div className="flex items-center gap-4">
             <div className="w-2 h-2 bg-slate-900 rounded-full animate-pulse"></div>
             <span>System Ready</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
