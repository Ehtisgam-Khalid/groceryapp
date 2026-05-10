import { Package, ShoppingBag, Users, DollarSign, ArrowUpRight, ArrowDownRight, TrendingUp, Calendar, Zap, Rocket } from 'lucide-react';
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { motion } from 'motion/react';

const data = [
  { name: 'Mon', sales: 4000, orders: 24 },
  { name: 'Tue', sales: 3000, orders: 18 },
  { name: 'Wed', sales: 2000, orders: 15 },
  { name: 'Thu', sales: 2780, orders: 20 },
  { name: 'Fri', sales: 1890, orders: 12 },
  { name: 'Sat', sales: 2390, orders: 22 },
  { name: 'Sun', sales: 3490, orders: 28 },
];

const StatCard = ({ icon: Icon, label, value, trend, trendValue }: any) => (
  <div className="bg-white p-6 md:p-8 rounded-[40px] md:rounded-[48px] border border-slate-100 shadow-sm transition-hover hover:shadow-2xl hover:shadow-brand-100/50 duration-500 group relative overflow-hidden">
    <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 translate-x-12 -translate-y-12 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <div className={`p-3 md:p-4 rounded-2xl md:rounded-3xl bg-slate-100 text-slate-800 group-hover:bg-brand-500 group-hover:text-white transition-all duration-500 shadow-sm`}>
          <Icon size={20} />
        </div>
        <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
          {trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {trendValue}%
        </div>
      </div>
      <div className="text-3xl md:text-4xl font-bold text-slate-900 mb-1 tracking-tight leading-none">{value}</div>
      <div className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">{label}</div>
    </div>
  </div>
);

export default function AdminDashboard() {
  return (
    <div className="space-y-12 animate-in pb-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="relative">
          <div className="absolute -left-4 top-0 w-1 h-full bg-emerald-500 rounded-full"></div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Executive Control</h1>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em] mt-1">Live Operations Architecture • Node 01</p>
        </div>
        
        <div className="bg-white border border-slate-100 shadow-xl shadow-slate-200/40 rounded-[2rem] p-4 flex items-center gap-6">
           <div className="flex -space-x-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400 shadow-sm relative">
                   {i === 1 && <div className="absolute top-0 right-0 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white"></div>}
                   A{i}
                </div>
              ))}
           </div>
           <div className="h-8 w-px bg-slate-100"></div>
           <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">System Health</span>
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5 leading-none mt-1">
                Optimal <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
              </span>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
        <StatCard icon={DollarSign} label="Liquidity" value="$24.5k" trend="up" trendValue="12.5" />
        <StatCard icon={ShoppingBag} label="Order Traffic" value="284" trend="up" trendValue="8.2" />
        <StatCard icon={Users} label="Active Entrants" value="1.2k" trend="down" trendValue="2.1" />
        <StatCard icon={Zap} label="Core Efficiency" value="4.8%" trend="up" trendValue="5.0" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
        <div className="lg:col-span-8 bg-white p-8 md:p-12 rounded-[3.5rem] border border-slate-100 shadow-2xl shadow-slate-200/40 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-12 opacity-[0.03] scale-150 rotate-12 group-hover:rotate-0 transition-transform duration-1000 pointer-events-none">
             <TrendingUp size={240} />
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-12 gap-6 relative z-10">
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">Fiscal Trajectory</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Live Revenue Stream Analysis</p>
            </div>
            <div className="flex items-center gap-3">
               <div className="hidden sm:flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Real-time</span>
               </div>
               <button className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-emerald-500 transition-colors">View Detailed Log</button>
            </div>
          </div>
          
          <div className="h-[400px] w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 900, fill: '#cbd5e1'}} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 900, fill: '#cbd5e1'}} />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '24px', 
                    border: '1px solid #f1f5f9', 
                    boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.08)',
                    padding: '16px',
                    backgroundColor: '#fff',
                  }}
                  itemStyle={{ color: '#0f172a', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase' }}
                  labelStyle={{ fontSize: '12px', fontWeight: '900', color: '#94a3b8', marginBottom: '8px', letterSpacing: '0.1em' }}
                />
                <Area type="monotone" dataKey="sales" stroke="#14b8a6" fillOpacity={1} fill="url(#colorSales)" strokeWidth={4} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-8 md:gap-12">
           <div className="bg-emerald-500 p-10 rounded-[3.5rem] text-white shadow-2xl shadow-emerald-200 relative overflow-hidden group border border-emerald-400">
              <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
              <div className="relative z-10">
                 <div className="w-14 h-14 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center mb-8">
                    <Award size={28} />
                 </div>
                 <h4 className="text-2xl font-black tracking-tighter uppercase italic mb-4 leading-none">System Efficiency</h4>
                 <p className="text-emerald-100 font-bold text-xs leading-relaxed mb-10">All nodes operating at peak velocity with 99.98% operational uptime.</p>
                 <div className="flex items-end gap-3 font-black">
                    <span className="text-6xl tracking-tighter">98.2</span>
                    <span className="text-xs uppercase tracking-widest mb-2 opacity-60">% Score</span>
                 </div>
              </div>
           </div>

           <div className="flex-1 bg-slate-900 p-10 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden group">
              <div className="flex items-center justify-between mb-8">
                 <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center">
                    <ShieldCheck size={24} className="text-emerald-400" />
                 </div>
                 <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Protocol v4.0</span>
              </div>
              <h4 className="text-xl font-black uppercase italic tracking-tighter mb-4">Security Anchor</h4>
              <div className="space-y-4">
                 {[1, 2].map(i => (
                   <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all cursor-pointer">
                      <div className="flex items-center gap-3">
                         <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                         <span className="text-[10px] font-bold uppercase tracking-widest text-white/60 leading-none">Node 0{i} - Encrypted</span>
                      </div>
                      <ChevronDown size={14} className="-rotate-90 text-white/20" />
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>

      <div className="bg-slate-900 rounded-[4rem] p-10 md:p-20 text-white shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(255,255,255,0.05)_0%,_transparent_70%)]"></div>
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 relative z-10">
          <div className="max-w-2xl text-center lg:text-left">
             <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-2.5 rounded-full mb-10">
               <Rocket size={16} className="text-emerald-400" />
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">System Integrity: Verified</span>
             </div>
             <h3 className="text-4xl md:text-7xl font-black mb-8 leading-[0.85] tracking-tighter uppercase italic">Export Master Architecture</h3>
             <p className="text-slate-400 font-bold text-sm md:text-base leading-relaxed mb-12 max-w-xl mx-auto lg:mx-0">Generate a comprehensive deep-dive into the logistics funnel and inventory velocity for the current operational epoch.</p>
             <button className="w-full sm:w-auto px-12 py-6 bg-white text-slate-900 rounded-[2.5rem] text-[11px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all shadow-2xl active:scale-95 group/btn">
                Execute Data Migration <ArrowUpRight size={18} className="inline ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
             </button>
          </div>
          <div className="grid grid-cols-2 gap-6 w-full lg:w-auto">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="aspect-square w-full sm:w-40 bg-white/5 rounded-[3.5rem] border border-white/10 flex flex-col items-center justify-center gap-3 group/node hover:bg-white/10 transition-all cursor-pointer">
                <div className="text-2xl transition-all group-hover/node:scale-125 duration-500">⚡</div>
                <div className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] leading-none">NODE 0{i}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
