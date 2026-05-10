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
    <div className="flex h-screen bg-slate-50 overflow-hidden text-slate-800 font-sans selection:bg-brand-50 selection:text-brand-700">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 z-[60] lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-[70] w-72 bg-white flex flex-col shrink-0 transition-transform duration-500 ease-in-out lg:relative lg:translate-x-0 overflow-hidden
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
       shadow-[20px_0_50px_rgba(0,0,0,0.03)] border-r border-slate-100`}>
        
        <div className="h-28 px-8 flex items-center border-b border-slate-50 relative z-10 justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black shadow-lg shadow-black/10 group-hover:rotate-12 transition-transform duration-500">SE</div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900 block leading-none">ShopEasy Admin</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 block">Control Center</span>
            </div>
          </Link>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-2 text-slate-400 hover:text-slate-900"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-grow p-8 space-y-2 relative z-10 overflow-y-auto scrollbar-hide">
          <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest px-4 mb-6">Management</div>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-4 px-5 py-4 rounded-3xl text-xs font-bold transition-all duration-300 ${
                location.pathname === item.path 
                  ? 'bg-brand-500 text-white shadow-xl shadow-brand-100 scale-[1.02]' 
                  : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-8 border-t border-slate-50 relative z-10 bg-slate-50/50">
          <button 
            onClick={() => auth.signOut()}
            className="flex items-center gap-4 px-6 py-4 w-full rounded-2xl text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative w-full">
        <header className="h-20 lg:h-24 bg-white/80 backdrop-blur-xl border-b border-slate-100 flex items-center justify-between px-6 lg:px-12 shrink-0">
          <div className="flex items-center gap-3">
             <button 
               onClick={() => setIsSidebarOpen(true)}
               className="lg:hidden p-2 text-slate-400 hover:text-slate-900"
             >
               <Menu size={24} />
             </button>
             <h2 className="font-bold text-lg text-slate-900 tracking-tight">
               {menuItems.find(i => i.path === location.pathname)?.label || 'System'}
             </h2>
          </div>

          <div className="flex items-center gap-4">
             <button className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all relative">
               <Bell size={20} />
               <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></div>
             </button>

            <div className="flex items-center gap-3 pl-4 border-l border-slate-100">
              <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 font-bold">
                 AD
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-bold text-slate-900 leading-none">Admin User</p>
                <p className="text-[10px] font-medium text-slate-400 leading-none mt-1">Super Admin</p>
              </div>
            </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-6 lg:p-10 bg-soft-beige/50 text-slate-800 scrollbar-hide">
          {children}
        </div>
      </main>
    </div>
  );
}
