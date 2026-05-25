import React from 'react';
import { Cake, Layers, Sparkles, ShoppingCart, Instagram, Phone } from 'lucide-react';
import { BusinessInfo } from '../types';

interface HeaderProps {
  wireframeMode: boolean;
  setWireframeMode: (mode: boolean) => void;
  cartCount: number;
  onOpenCart: () => void;
  businessInfo: BusinessInfo;
}

export default function Header({
  wireframeMode,
  setWireframeMode,
  cartCount,
  onOpenCart,
  businessInfo
}: HeaderProps) {
  return (
    <header 
      id="main-header"
      className={`sticky top-0 z-40 transition-colors duration-300 ${
        wireframeMode 
          ? 'bg-white border-b-2 border-black text-black font-mono' 
          : 'bg-brand-cream/95 backdrop-blur-md border-b border-rose-100 shadow-sm text-brand-brown'
      }`}
    >
      {/* Visual Indicator of Wireframe Mode Active Bar */}
      {wireframeMode && (
        <div className="bg-black text-white text-[10px] py-1 text-center font-bold tracking-widest uppercase">
          &lt;wireframe_mode_active: layout_grid_skeleton&gt;
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            {wireframeMode ? (
              <div className="border-2 border-black p-1.5 flex items-center justify-center">
                <Layers className="w-6 h-6" />
              </div>
            ) : (
              <div className="bg-brand-pink-dark p-2 rounded-full text-white shadow-md">
                <Cake className="w-6 h-6 animate-bounce" />
              </div>
            )}
            
            <div className="flex flex-col">
              <span id="header-brand-title" className={`text-xl sm:text-2xl font-bold tracking-tight ${
                wireframeMode ? 'font-mono uppercase' : 'font-outfit'
              }`}>
                {businessInfo.name}
              </span>
              <span className={`text-[10px] -mt-1 ${
                wireframeMode ? 'text-neutral-500 font-mono' : 'text-rose-500 italic font-medium'
              }`}>
                {wireframeMode ? 'PROCESSO_WIREFRAME' : 'Delícias Artesanais de Verdade'}
              </span>
            </div>
          </div>

          {/* Center Navigation - Anchors */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <a 
              href="#catalogo" 
              className={`transition-colors py-1 ${
                wireframeMode 
                  ? 'hover:underline text-black' 
                  : 'hover:text-rose-600 text-brand-brown/80'
              }`}
            >
              {wireframeMode ? '1. CATALOGO_MENU' : 'Cardápio'}
            </a>
            <a 
              href="#como-funciona" 
              className={`transition-colors py-1 ${
                wireframeMode 
                  ? 'hover:underline text-black' 
                  : 'hover:text-rose-600 text-brand-brown/80 text-nowrap'
              }`}
            >
              {wireframeMode ? '2. OPERACAO_PASSOS' : 'Como Encomendar'}
            </a>
            <a 
              href="#depoimentos" 
              className={`transition-colors py-1 ${
                wireframeMode 
                  ? 'hover:underline text-black' 
                  : 'hover:text-rose-600 text-brand-brown/80'
              }`}
            >
              {wireframeMode ? '3. DEPOIMENTOS_CLIENTES' : 'Avaliações'}
            </a>
            <a 
              href="#contato" 
              className={`transition-colors py-1 ${
                wireframeMode 
                  ? 'hover:underline text-black' 
                  : 'hover:text-rose-600 text-brand-brown/80'
              }`}
            >
              {wireframeMode ? '4. CONTATOS_HORARIOS' : 'Contato'}
            </a>
          </nav>

          {/* Right Action Widgets */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* View Mode Toggle Switch */}
            <div className={`flex items-center gap-2 border rounded-full p-1 sm:p-1.5 ${
              wireframeMode ? 'border-black bg-neutral-100' : 'border-rose-100 bg-rose-50/50'
            }`}>
              <button
                id="toggle-wireframe"
                className={`px-2.5 py-1 text-xs font-semibold rounded-full md:flex items-center gap-1 transition-all ${
                  wireframeMode
                    ? 'bg-black text-white'
                    : 'text-neutral-500 hover:text-black'
                }`}
                onClick={() => setWireframeMode(true)}
                title="Ativar Wireframe (Esqueleto estrutural estruturado)"
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Wireframe</span>
              </button>
              
              <button
                id="toggle-visual"
                className={`px-2.5 py-1 text-xs font-semibold rounded-full md:flex items-center gap-1 transition-all ${
                  !wireframeMode
                    ? 'bg-brand-pink-dark text-white shadow-sm'
                    : 'text-neutral-500 hover:text-black'
                }`}
                onClick={() => setWireframeMode(false)}
                title="Ativar Design Finalizado (Cores e Visuais)"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Design Final</span>
              </button>
            </div>

            {/* Shopping Bag / Simulator Trigger */}
            <button
              id="header-cart-icon"
              onClick={onOpenCart}
              className={`relative p-2.5 rounded-full transition-all flex items-center justify-center ${
                wireframeMode
                  ? 'border-2 border-black hover:bg-black hover:text-white text-black'
                  : 'bg-brand-brown text-white hover:bg-brand-chocolate shadow-md hover:scale-105'
              }`}
              aria-label="Ver simulação de cesta"
            >
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
              {cartCount > 0 && (
                <span className={`absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-[10px] font-bold rounded-full ${
                  wireframeMode ? 'bg-black text-white border-2 border-white' : 'bg-rose-500 text-white'
                }`}>
                  {cartCount}
                </span>
              )}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
