import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { PricingPlan } from '../types';
import { Check, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import toast from 'react-hot-toast';

export default function PricingPlans() {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const snap = await getDocs(collection(db, 'pricingPlans'));
        setPlans(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as PricingPlan)));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const handleSelectPlan = (plan: PricingPlan) => {
    toast.success(`You have selected the ${plan.name} plan!`);
  };

  if (loading) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-20 bg-white">
      <div className="text-center mb-16 space-y-4">
        <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-600 px-4 py-2 rounded-full font-bold text-[10px] uppercase tracking-widest border border-brand-100">
          <Sparkles size={14} />
          ShopEasy Membership
        </div>
        <h1 className="text-5xl font-black text-gray-900 tracking-tight">Choose your <span className="text-brand-500 italic underline decoration-wavy underline-offset-8 decoration-brand-200">perfect</span> plan.</h1>
        <p className="text-gray-400 font-medium text-sm max-w-lg mx-auto leading-relaxed">
          Unlock premium benefits including free delivery, exclusive discounts, and priority support with our flexible membership plans.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, i) => (
          <motion.div 
            key={plan.id}
            whileHover={{ y: -8 }}
            className={`relative p-10 rounded-[48px] border ${plan.price > 0 ? 'bg-brand-900 text-white border-brand-800 shadow-2xl shadow-brand-200' : 'bg-white text-gray-900 border-gray-100 shadow-sm'} flex flex-col`}
          >
            {plan.name === 'Plus' && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-500 text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-[0.2em] shadow-lg">
                Most Popular
              </div>
            )}

            <div className="mb-8">
              <h3 className="text-2xl font-black mb-2">{plan.name}</h3>
              <p className={`text-sm font-medium ${plan.price > 0 ? 'text-brand-200' : 'text-gray-400'}`}>{plan.description}</p>
            </div>

            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-5xl font-black">${plan.price}</span>
              <span className={`text-sm font-bold ${plan.price > 0 ? 'text-brand-400' : 'text-gray-400'}`}>/month</span>
            </div>

            <div className="space-y-4 flex-grow mb-12">
              {plan.features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className={`mt-1 p-1 rounded-full ${plan.price > 0 ? 'bg-brand-500 text-brand-900' : 'bg-brand-100 text-brand-600'}`}>
                    <Check size={12} strokeWidth={4} />
                  </div>
                  <span className="text-sm font-bold tracking-tight">{feature}</span>
                </div>
              ))}
            </div>

            <button 
              onClick={() => handleSelectPlan(plan)}
              className={`w-full py-5 rounded-3xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 group ${
                plan.price > 0 
                  ? 'bg-brand-500 text-white hover:bg-brand-400 shadow-lg shadow-brand-950/20' 
                  : 'bg-gray-900 text-white hover:bg-gray-800'
              }`}
            >
              Get Started <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
