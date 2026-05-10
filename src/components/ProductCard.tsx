import { Heart, Plus, Star, Zap } from 'lucide-react';
import React from 'react';
import { Product } from '../types';
import { motion } from 'motion/react';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  onAddToWishlist: (p: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToWishlist }) => {
  const { addToCart } = useCart();
  const discount = product.discountedPrice 
    ? Math.round(((product.price - product.discountedPrice) / product.price) * 100) 
    : 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="card-soft group p-3 flex flex-col bg-white"
    >
      <div className="relative aspect-[4/5] rounded-[32px] overflow-hidden bg-slate-50">
        <img 
          src={product.images[0] || `https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600`} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        
        <button 
          onClick={(e) => { e.stopPropagation(); onAddToWishlist(product); }}
          className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 transition-all border border-white/50 shadow-sm opacity-0 group-hover:opacity-100"
        >
          <Heart size={18} />
        </button>

        {discount > 0 && (
          <div className="absolute top-4 left-4 bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg shadow-emerald-200">
            {discount}% OFF
          </div>
        )}
      </div>

      <div className="pt-4 px-2 flex flex-col flex-grow">
        <div className="flex items-center gap-1 mb-1">
          <Star size={10} className="fill-brand-500 text-brand-500" />
          <span className="text-[10px] font-bold text-slate-400">{product.rating.toFixed(1)}</span>
        </div>

        <h3 className="text-base font-bold text-slate-900 line-clamp-2 leading-tight mb-2">
          {product.name}
        </h3>
        
        <div className="mt-auto flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-slate-900 tracking-tight">
              ${(product.discountedPrice || product.price).toFixed(2)}
            </span>
            {product.discountedPrice && (
              <span className="text-[10px] text-slate-300 line-through font-medium">${product.price.toFixed(2)}</span>
            )}
          </div>

          <button 
            onClick={() => addToCart(product)}
            className="w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center hover:bg-brand-500 hover:scale-110 transition-all shadow-lg active:scale-95"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default ProductCard;
