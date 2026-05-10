import React from 'react';
import { motion } from 'motion/react';
import { Plus, Heart, Star, ShoppingBag } from 'lucide-react';
import { Product } from '../types';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const discount = product.discountedPrice 
    ? Math.round(((product.price - product.discountedPrice) / product.price) * 100) 
    : 0;

  const activeWishlist = isInWishlist(product.id);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      className="group relative flex flex-col bg-white rounded-[2.5rem] p-3 transition-all duration-500 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] border border-transparent hover:border-slate-100"
    >
      <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-slate-50">
        <img 
          src={product.images[0] || `https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600`} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        
        {/* Wishlist Button */}
        <button 
          onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}
          className={`absolute top-4 right-4 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-md border z-10 ${
            activeWishlist 
              ? 'bg-red-500 text-white border-red-400 shadow-lg shadow-red-200' 
              : 'bg-white/90 text-slate-400 hover:text-red-500 border-white shadow-xl opacity-0 group-hover:opacity-100'
          }`}
        >
          <Heart size={18} fill={activeWishlist ? "currentColor" : "none"} className={activeWishlist ? "scale-110" : "transition-transform group-hover:scale-110"} />
        </button>

        {/* Badge */}
        {discount > 0 && (
          <div className="absolute top-4 left-4 bg-emerald-500/90 backdrop-blur-sm text-white text-[10px] font-black px-4 py-1.5 rounded-2xl shadow-lg shadow-emerald-200/50 z-10">
            {discount}% OFF
          </div>
        )}

        {/* Quick Add Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 hidden md:block">
           <button 
             onClick={() => addToCart(product)}
             className="w-full h-14 bg-slate-900 text-white rounded-[1.25rem] flex items-center justify-center gap-3 font-bold text-sm shadow-2xl hover:bg-emerald-500 transition-colors"
           >
             <ShoppingBag size={18} />
             Add to Cart
           </button>
        </div>
      </div>

      <div className="pt-5 px-3 pb-2 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-[0.15em]">{product.category}</span>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 rounded-full">
            <Star size={10} className="fill-emerald-500 text-emerald-500" />
            <span className="text-[10px] font-bold text-slate-600">{product.rating.toFixed(1)}</span>
          </div>
        </div>

        <h3 className="text-lg font-bold text-slate-900 line-clamp-1 leading-tight mb-3 group-hover:text-emerald-600 transition-colors">
          {product.name}
        </h3>
        
        <div className="mt-auto flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-2xl font-black text-slate-900 tracking-tight leading-none">
              ${(product.discountedPrice || product.price).toFixed(2)}
            </span>
            {product.discountedPrice && (
              <span className="text-[11px] text-slate-300 line-through font-medium mt-1">${product.price.toFixed(2)}</span>
            )}
          </div>

          <button 
            onClick={() => addToCart(product)}
            className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center hover:bg-emerald-500 transition-all active:scale-95 shadow-lg md:hidden"
          >
            <Plus size={24} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default ProductCard;
