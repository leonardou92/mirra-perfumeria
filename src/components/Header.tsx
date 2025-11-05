import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  cartItemsCount: number;
  onCartClick: () => void;
}

export function Header({ cartItemsCount, onCartClick }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-opacity-95 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-3">
            <div className="p-1.5 bg-white rounded-full shadow-md ring-2 ring-[#ca9e67] ring-offset-2">
              <img src="/logo.png" alt="Mirra Perfumería" className="w-12 h-12 rounded-full object-cover" />
            </div>
            <div>
              <h1 className="text-2xl font-bell-mt font-bold text-gray-900 tracking-tight">Mirra Perfumería</h1>
              <p className="text-sm text-[#878787] font-montserrat font-medium">Fragancias selectas</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="bg-[#CA9E67] hover:bg-[#b88d58] text-white px-5 py-2.5 rounded-lg font-montserrat font-semibold transition-all duration-300 shadow-md hover:shadow-lg whitespace-nowrap"
            >
              Comprar Ahora
            </Link>
            <button 
              onClick={onCartClick}
              className="relative p-2 text-[#878787] hover:text-[#CA9E67] rounded-full hover:bg-gray-50 transition-colors"
              aria-label="Carrito de compras"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#CA9E67] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
