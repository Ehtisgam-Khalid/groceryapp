import React, { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { UserProfile, UserRole } from '../../types';
import { Search, User, Mail, Shield, ShieldAlert, ShieldCheck, MoreVertical, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'users'));
      setUsers(snap.docs.map(doc => ({ uid: doc.id, ...doc.data() } as UserProfile)));
    } catch (err) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const toggleRole = async (userId: string, currentRole: UserRole) => {
    const newRole = currentRole === UserRole.ADMIN ? UserRole.USER : UserRole.ADMIN;
    try {
      await updateDoc(doc(db, 'users', userId), { role: newRole });
      toast.success('User role updated');
      fetchUsers();
    } catch (err) {
      toast.error('Failed to update role');
    }
  };

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in pb-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter uppercase">User Index</h1>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-1">Manage personnel and permissions</p>
        </div>
        
        <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-slate-100 flex-grow max-w-md shadow-sm transition-all focus-within:ring-4 focus-within:ring-slate-50">
          <Search size={18} className="text-slate-300" />
          <input 
            type="text" 
            placeholder="Search by Identity..." 
            className="bg-transparent border-none focus:ring-0 text-sm w-full font-bold placeholder:text-slate-200 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      <div className="bg-white rounded-[32px] md:rounded-[48px] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
        {/* Mobile View */}
        <div className="md:hidden divide-y divide-slate-100 italic">
          {loading ? (
             <div className="p-12 text-center text-slate-300">
               <Loader2 className="animate-spin mx-auto mb-4" />
               <span className="text-[10px] font-black uppercase tracking-[0.2em]">Syncing Userbase...</span>
             </div>
          ) : filteredUsers.map((u) => (
            <div key={u.uid} className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-sm uppercase">
                  {u.name?.[0] || u.email?.[0]}
                </div>
                <div className="flex-grow">
                  <h4 className="font-black text-slate-900 text-sm truncate">{u.name || 'Anonymous'}</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase truncate">{u.email}</p>
                </div>
                <button onClick={() => toggleRole(u.uid, u.role)} className="p-3 bg-slate-50 text-slate-400 rounded-xl">
                  <Shield size={18} />
                </button>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                <div className="flex flex-col">
                  <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Points</span>
                  <span className="text-sm font-black text-slate-900 leading-none">{u.loyaltyPoints}</span>
                </div>
                <span className={`text-[8px] font-black px-3 py-1 rounded-full border uppercase tracking-widest ${u.role === 'admin' ? 'bg-black text-white' : 'bg-white text-slate-400 border-slate-100'}`}>
                  {u.role}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                <th className="px-8 py-6">Identity</th>
                <th className="px-8 py-6">Privilege</th>
                <th className="px-8 py-6">Nodes</th>
                <th className="px-8 py-6">Registry Date</th>
                <th className="px-8 py-6 text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredUsers.map((u) => (
                <tr key={u.uid} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6 text-sm">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-xs uppercase shadow-lg shadow-black/10">
                        {u.name?.[0] || u.email?.[0]}
                      </div>
                      <div>
                        <div className="font-black text-slate-900">{u.name || 'Anonymous'}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${u.role === 'admin' ? 'bg-black text-white' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-8 py-6 font-black text-slate-900 text-sm">
                    {u.loyaltyPoints} PTS
                  </td>
                  <td className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-tighter">
                    {new Date(u.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric'})}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button 
                      onClick={() => toggleRole(u.uid, u.role)} 
                      className="p-3 text-slate-300 hover:text-slate-900 hover:bg-slate-50 rounded-2xl transition-all active:scale-90"
                    >
                      <Shield size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
