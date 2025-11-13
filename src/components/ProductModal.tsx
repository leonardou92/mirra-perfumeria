import React, { useState, useEffect } from 'react';
import { Product } from '@/lib/types';
import { getImageUrl } from '@/lib/utils';
import { X, ShoppingCart, Info } from 'lucide-react';
import { getCachedTasaActiva } from '@/integrations/api';
import { Button } from '@/components/ui/button';

interface Props {
  product: Product;
  open: boolean;
  onClose: () => void;
  onAddToCart: (p: Product) => void;
}

export default function ProductModal({ product, open, onClose, onAddToCart }: Props) {
  const [tasa, setTasa] = useState<any | null>(null);

  // Cargar tasa de cambio si es necesario
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const t = await getCachedTasaActiva();
        if (!mounted) return;
        setTasa(t);
      } catch (e) {
        console.error('Error cargando tasa de cambio:', e);
      }
    })();
    return () => { 
      mounted = false; 
    };
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative bg-white rounded-lg shadow-lg max-w-3xl w-full z-10 overflow-hidden">
        <div className="flex justify-between items-start p-4 border-b">
          <h3 className="text-xl font-semibold">{product.name}</h3>
          <button 
            onClick={onClose} 
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <div className="flex items-center justify-center">
            <div className="relative w-full max-w-md mx-auto">
              <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 shadow-sm border border-gray-100 overflow-hidden">
                <img
                  src={getImageUrl(product)}
                  alt={product.name}
                  className="h-full w-full object-contain transition-all duration-300 hover:scale-105"
                  onError={(e) => { 
                    const target = e.currentTarget as HTMLImageElement; 
                    target.onerror = null; 
                    target.src = getImageUrl(undefined) as string; 
                  }}
                />
              </div>
            </div>
          </div>
          
          <div className="flex flex-col justify-between h-full">
            <div>
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-3">{product.name}</h2>
                <div className="flex items-center gap-2 mb-6">
                  <span className="px-3 py-1 bg-green-50 text-green-700 text-sm font-medium rounded-full">
                    {(product.stock ?? 0) > 0 ? 'En stock' : 'Consultar disponibilidad'}
                  </span>
                </div>
                <h4 className="text-3xl font-bold text-copper-600 mb-4">
                  {product.price && Number(product.price) > 0 ? (
                    tasa && tasa.monto ? (
                      <>{tasa.simbolo || 'USD'} {(Number(product.price) * Number(tasa.monto)).toFixed(2)}</>
                    ) : (
                      <>${Number(product.price).toLocaleString('es-AR')}</>
                    )
                  ) : 'Consultar precio'}
                </h4>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 mt-6">
                <div className="flex items-center gap-2 mb-3 text-gray-800">
                  <Info className="h-5 w-5 text-copper-600" />
                  <h4 className="text-base font-semibold">Detalles del producto</h4>
                </div>
                {product.description ? (
                  <div className="prose prose-sm text-gray-600">
                    <p className="whitespace-pre-line">{product.description}</p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">Este producto no tiene una descripción detallada.</p>
                )}
              </div>
            </div>

            <div className="pt-4">
              <div className="flex flex-col gap-4">
                <Button 
                  onClick={() => { 
                    onAddToCart(product);
                    onClose();
                  }}
                  disabled={(product.stock ?? 0) === 0}
                  className="w-full py-4 text-base font-semibold bg-copper-700 text-black hover:bg-copper-800 transition-all duration-200 hover:shadow-md hover:shadow-copper-100"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Agregar al carrito
                </Button>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
