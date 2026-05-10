import { TrendingUp, DollarSign, ShoppingCart, UserPlus, Download, Calendar } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const salesData = [
  { name: 'May 02', sales: 4000 },
  { name: 'May 03', sales: 3000 },
  { name: 'May 04', sales: 5000 },
  { name: 'May 05', sales: 4500 },
  { name: 'May 06', sales: 6000 },
  { name: 'May 07', sales: 5500 },
  { name: 'May 08', sales: 7000 },
];

const categoryData = [
  { name: 'Fruits', value: 400 },
  { name: 'Veggies', value: 300 },
  { name: 'Dairy', value: 300 },
  { name: 'Meat', value: 200 },
];

const COLORS = ['#000000', '#334155', '#64748b', '#94a3b8'];

export default function AdminReports() {
  return (
    <div className="space-y-8 animate-in pb-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter uppercase">Operations Report</h2>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-1">Deep-dive performance analysis</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-100 rounded-2xl text-[10px] font-black text-slate-600 uppercase tracking-widest hover:bg-slate-50 shadow-sm transition-all">
            <Calendar size={16} />
            Epoch: May 26
          </button>
          <button className="flex items-center gap-2 px-5 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black shadow-xl shadow-black/10 transition-all active:scale-95">
            <Download size={16} />
            Export Log
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 md:p-8 rounded-[32px] md:rounded-[48px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500">
          <div className="p-3 rounded-2xl bg-slate-100 text-slate-900 w-fit mb-6 shadow-sm"><DollarSign size={20} /></div>
          <div className="text-3xl md:text-4xl font-black text-slate-900 mb-1 tracking-tighter">$45.2k</div>
          <div className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">Gross Liquidity</div>
        </div>
        <div className="bg-white p-6 md:p-8 rounded-[32px] md:rounded-[48px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500">
          <div className="p-3 rounded-2xl bg-slate-100 text-slate-900 w-fit mb-6 shadow-sm"><ShoppingCart size={20} /></div>
          <div className="text-3xl md:text-4xl font-black text-slate-900 mb-1 tracking-tighter">1.4k</div>
          <div className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">Traffic Units</div>
        </div>
        <div className="bg-white p-6 md:p-8 rounded-[32px] md:rounded-[48px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500">
          <div className="p-3 rounded-2xl bg-slate-100 text-slate-900 w-fit mb-6 shadow-sm"><UserPlus size={20} /></div>
          <div className="text-3xl md:text-4xl font-black text-slate-900 mb-1 tracking-tighter">284</div>
          <div className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">New Entrants</div>
        </div>
        <div className="bg-white p-6 md:p-8 rounded-[32px] md:rounded-[48px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500">
          <div className="p-3 rounded-2xl bg-slate-100 text-slate-900 w-fit mb-6 shadow-sm"><TrendingUp size={20} /></div>
          <div className="text-3xl md:text-4xl font-black text-slate-900 mb-1 tracking-tighter">12.5%</div>
          <div className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">Velocity Rate</div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 bg-white p-6 md:p-10 rounded-[40px] md:rounded-[64px] border border-slate-100 shadow-xl shadow-slate-200/40">
          <h3 className="font-black text-slate-900 mb-10 text-lg md:text-xl uppercase tracking-tight">Performance Stream</h3>
          <div className="h-64 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#000000" stopOpacity={0.05}/>
                    <stop offset="95%" stopColor="#000000" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 9, fill: '#cbd5e1', fontWeight: 900}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 9, fill: '#cbd5e1', fontWeight: 900}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.2)', backgroundColor: '#000', color: '#fff' }}
                  itemStyle={{ color: '#fff', fontSize: '10px', fontWeight: '900' }}
                  labelStyle={{ display: 'none' }}
                />
                <Area type="monotone" dataKey="sales" stroke="#000000" fillOpacity={1} fill="url(#colorSales)" strokeWidth={4} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="xl:col-span-1 bg-white p-6 md:p-10 rounded-[40px] md:rounded-[64px] border border-slate-100 shadow-xl shadow-slate-200/40">
          <h3 className="font-black text-slate-900 mb-10 text-lg md:text-xl uppercase tracking-tight">Node Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {categoryData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '10px', fontWeight: '900' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4 mt-8">
            {categoryData.map((cat, i) => (
              <div key={cat.name} className="flex items-center justify-between group cursor-default">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full ring-4 ring-slate-50" style={{ backgroundColor: COLORS[i] }}></div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-slate-900 transition-colors">{cat.name}</span>
                </div>
                <span className="text-[11px] font-black text-slate-900">{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
