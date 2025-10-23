import React from 'react';
import { ShoppingCart, Star } from 'lucide-react';
import { Product } from '@/lib/types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <article className="bg-cream-100 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-cream-200">
      <div className="relative overflow-hidden h-56 sm:h-48">
        <img
          src={product.image_url || '/placeholder-product.jpg'}
          alt={product.name}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
        />

        {product.featured && (
          <span className="absolute top-3 right-3 bg-copper-600 text-cream-50 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-2 shadow">
            <Star className="w-3 h-3" />
            Destacado
          </span>
        )}
      </div>

        <div className="p-4 md:p-5">
        <div className="mb-3">
          <p className="text-copper-600 text-xs font-semibold mb-1 uppercase tracking-wide">{product.brand || 'Marca'}</p>
          <h3 className="text-lg md:text-xl font-bold text-copper-800 mb-1 line-clamp-1">{product.name}</h3>
          <span className="inline-block px-3 py-1 bg-cream-50 text-copper-700 text-xs font-medium rounded-full">{product.category || (product as any).tipo || ''}</span>
        </div>

        <p className="text-copper-700 text-sm mb-4 line-clamp-3 leading-relaxed">{product.description || 'Descripción breve del producto.'}</p>

        <div className="flex items-center justify-between pt-3 border-t border-cream-200">
          <div>
            <p className="text-2xl font-bold text-copper-800">${(product.price ?? 0).toLocaleString('es-AR')}</p>
            <p className="text-xs text-copper-600">{(product.stock ?? 0) > 0 ? `${product.stock} disponibles` : 'Sin stock'}</p>
          </div>

          <button
            onClick={() => onAddToCart(product)}
            disabled={(product.stock ?? 0) === 0}
            className="inline-flex items-center gap-2 rounded-md px-3 py-2 bg-copper-500 text-cream-50 font-semibold hover:scale-105 transition">
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline">Agregar</span>
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
