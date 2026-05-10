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
  <div className="bg-white p-6 md:p-8 rounded-[40px] md:rounded-[48px] border border-slate-100 shadow-sm transition-hover hover:shadow-2xl hover:shadow-slate-200/50 duration-500 group relative overflow-hidden">
    <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 translate-x-12 -translate-y-12 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <div className={`p-3 md:p-4 rounded-2xl md:rounded-3xl bg-slate-100 text-slate-800 group-hover:bg-slate-900 group-hover:text-white transition-all duration-500 shadow-sm`}>
          <Icon size={20} />
        </div>
        <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${trend === 'up' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400'}`}>
          {trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {trendValue}%
        </div>
      </div>
      <div className="text-3xl md:text-4xl font-black text-slate-900 mb-1 tracking-tighter leading-none">{value}</div>
      <div className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">{label}</div>
    </div>
  </div>
);

export default function AdminDashboard() {
  return (
    <div className="space-y-8 md:space-y-12 animate-in pb-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter uppercase">Executive Intelligence</h1>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-1">Global performance and real-time operations</p>
        </div>
        
        <div className="flex items-center gap-3 bg-white px-5 py-2.5 rounded-2xl border border-slate-100 shadow-sm">
          <Calendar size={16} className="text-slate-300" />
          <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-none">Global Log: May 2026</span>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        <StatCard icon={DollarSign} label="Liquidity" value="$24.5k" trend="up" trendValue="12.5" />
        <StatCard icon={ShoppingBag} label="Order Traffic" value="284" trend="up" trendValue="8.2" />
        <StatCard icon={Users} label="Entrants" value="1.2k" trend="down" trendValue="2.1" />
        <StatCard icon={Zap} label="Efficiency" value="4.8%" trend="up" trendValue="5.0" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 md:gap-10">
        <div className="bg-white p-6 md:p-10 rounded-[40px] md:rounded-[64px] border border-slate-100 shadow-xl shadow-slate-200/40">
          <div className="flex items-center justify-between mb-8 md:mb-12">
            <div>
              <h3 className="text-lg md:text-xl font-black text-slate-900 uppercase tracking-tight">Financial Trajectory</h3>
              <p className="text-[9px] text-slate-300 font-bold uppercase tracking-widest mt-1">Valuation in USD</p>
            </div>
            <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase text-white shadow-lg shadow-black/10">
               Live <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
            </div>
          </div>
          <div className="h-64 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#000000" stopOpacity={0.05}/>
                    <stop offset="95%" stopColor="#000000" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 900, fill: '#cbd5e1'}} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 900, fill: '#cbd5e1'}} />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '20px', 
                    border: 'none', 
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.2)',
                    padding: '12px',
                    backgroundColor: '#000',
                    color: '#fff'
                  }}
                  itemStyle={{ color: '#fff', fontSize: '10px', fontWeight: 'bold' }}
                  labelStyle={{ fontSize: '11px', fontWeight: '900', color: '#fff', marginBottom: '4px' }}
                />
                <Area type="monotone" dataKey="sales" stroke="#000000" fillOpacity={1} fill="url(#colorSales)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 md:p-10 rounded-[40px] md:rounded-[64px] border border-slate-100 shadow-xl shadow-slate-200/40">
          <div className="flex items-center justify-between mb-8 md:mb-12">
            <div>
              <h3 className="text-lg md:text-xl font-black text-slate-900 uppercase tracking-tight">Demand Density</h3>
              <p className="text-[9px] text-slate-300 font-bold uppercase tracking-widest mt-1">Transaction units</p>
            </div>
            <div className="p-3 bg-slate-100 rounded-2xl text-slate-900">
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="h-64 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 900, fill: '#cbd5e1'}} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 900, fill: '#cbd5e1'}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.1)',
                    backgroundColor: '#fff',
                    padding: '10px'
                  }}
                />
                <Bar dataKey="orders" fill="#000000" radius={[8, 8, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 rounded-[40px] md:rounded-[64px] p-8 md:p-14 text-white shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(255,255,255,0.05)_0%,_transparent_70%)]"></div>
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
          <div className="max-w-xl text-center lg:text-left">
             <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-2 rounded-full mb-6 md:mb-8">
               <Rocket size={14} className="text-white" />
               <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white">System Integrity: Optimal</span>
             </div>
             <h3 className="text-3xl md:text-5xl font-black mb-4 md:mb-6 leading-[0.9] tracking-tighter uppercase italic">Compile System Logs</h3>
             <p className="text-slate-400 font-bold text-xs md:text-sm leading-relaxed mb-8 md:mb-10">Generate a comprehensive deep-dive of the logistics funnel and inventory velocity for the current epoch.</p>
             <button className="w-full sm:w-auto px-10 py-5 bg-white text-slate-900 rounded-[28px] text-[10px] font-black uppercase tracking-[0.4em] hover:bg-slate-100 transition-all shadow-2xl active:scale-95">Execute Export</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4 w-full lg:w-auto">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="aspect-square w-full sm:w-32 bg-white/5 rounded-[32px] md:rounded-[40px] border border-white/10 flex flex-col items-center justify-center gap-2 group/btn hover:bg-white/10 transition-all cursor-pointer">
                <div className="text-xl md:text-2xl transition-all group-hover/btn:scale-125">⚡</div>
                <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none">NODE {i}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
