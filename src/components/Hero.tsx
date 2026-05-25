import React from 'react';
import { Sparkles, Calendar, ShoppingCart, HelpCircle, Layers, ArrowRight } from 'lucide-react';
import { BusinessInfo } from '../types';

interface HeroProps {
  wireframeMode: boolean;
  businessInfo: BusinessInfo;
  onOpenSimulator: () => void;
}

export default function Hero({ wireframeMode, businessInfo, onOpenSimulator }: HeroProps) {
  return (
    <section 
      id="hero"
      className={`relative min-h-[500px] sm:min-h-[600px] flex items-center justify-center overflow-hidden py-16 transition-all duration-300 ${
        wireframeMode 
          ? 'bg-neutral-50 border-b-2 border-black font-mono' 
          : 'bg-gradient-to-br from-brand-pink via-brand-cream to-amber-50/50 text-brand-brown'
      }`}
    >
      {/* Absolute Decorative Elements for Final UI */}
      {!wireframeMode && (
        <>
          <div className="absolute top-12 left-10 w-24 h-24 rounded-full bg-rose-200/30 blur-2xl pointer-events-none" />
          <div className="absolute bottom-16 right-10 w-40 h-40 rounded-full bg-amber-200/20 blur-3xl pointer-events-none" />
          {/* Subtle food/pastry-themed overlay vectors or patterns */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#3a2e2b_1px,transparent_1px)] [background-size:16px_16px]" />
        </>
      )}

      {/* Wireframe blueprints mock boundaries */}
      {wireframeMode && (
        <div className="absolute inset-0 pointer-events-none border-t border-b border-dashed border-neutral-300 flex items-center justify-center opacity-40">
          <div className="w-[85%] h-[80%] border-2 border-dashed border-neutral-300 relative">
            <div className="absolute -top-3 -left-3 text-[10px] bg-white border px-1 text-neutral-400">HERO_OUTER_STAGE</div>
            <div className="absolute -bottom-3 -right-3 text-[10px] bg-white border px-1 text-neutral-400">85%_SPAN_CONTAINER</div>
            <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-dashed bg-neutral-300" />
            <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-dashed bg-neutral-300" />
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text / Info content (Length: 7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
            
            {/* Tag / Badge */}
            <div className={`mb-6 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
              wireframeMode 
                ? 'border-2 border-black bg-white uppercase text-[10px]' 
                : 'bg-rose-100 text-rose-700 shadow-sm border border-rose-200'
            }`}>
              {wireframeMode ? (
                <>
                  <Layers className="w-3.5 h-3.5" />
                  <span>BADGE_TAG: HOME_DELIVERY_HIGHLIGHT</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>🧁 Delícias Caseiras Feitas Sob Medida</span>
                </>
              )}
            </div>

            {/* Core Display Heading */}
            <h1 className={`leading-tight font-bold tracking-tight mb-6 ${
              wireframeMode 
                ? 'text-3xl sm:text-5xl font-mono uppercase text-black' 
                : 'text-4xl sm:text-6xl font-display text-brand-brown'
            }`}>
              {wireframeMode ? (
                <>
                  MIGS_DELICIA: LANDING_HERO_DISPLAY
                </>
              ) : (
                <>
                  Adoce a vida com o <span className="text-brand-pink-dark block sm:inline">Amor e Sabor</span> da Migs Delícia!
                </>
              )}
            </h1>

            {/* Subtext description */}
            <p className={`max-w-2xl text-base sm:text-lg mb-8 leading-relaxed ${
              wireframeMode 
                ? 'text-neutral-600 border-l-4 border-black pl-4' 
                : 'text-brand-chocolate/80'
            }`}>
              {wireframeMode ? (
                'DESC_TEXT: Wireframe placeholder text for landing sub-headline. Employs descriptive adjectives detailing the products: fresh doces premium, mini pie treats with lemon meringue, grandma cakes, golden crunchy salgadinhos fritos.'
              ) : (
                'Doces finos artesanais, mini tortas irresistíveis para sua festa, bolos caseiros fofinhos saídos direto do forno e salgados fritos super crocantes na hora. Levamos felicidade em forma de sabor até sua mesa!'
              )}
            </p>

            {/* CTAs Trigger elements Grid */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <a
                href="#catalogo"
                className={`w-full sm:w-auto text-center px-8 py-4 text-sm font-bold shadow-lg transition-transform hover:-translate-y-0.5 active:translate-y-0 ${
                  wireframeMode
                    ? 'bg-black text-white border-2 border-black font-mono uppercase hover:bg-neutral-800'
                    : 'bg-brand-brown hover:bg-brand-chocolate text-white rounded-xl'
                }`}
              >
                {wireframeMode ? 'BUTTON_LINK: GO_TO_MENU_GRID' : 'Conhecer Nosso Cardápio'}
              </a>

              <button
                onClick={onOpenSimulator}
                className={`w-full sm:w-auto px-8 py-4 text-sm font-semibold transition-all hover:scale-[1.02] flex items-center justify-center gap-2 ${
                  wireframeMode
                    ? 'border-2 border-black bg-white hover:bg-neutral-100 font-mono text-black'
                    : 'bg-white hover:bg-rose-50 border border-brand-pink-dark/35 text-brand-pink-dark rounded-xl shadow-md'
                }`}
              >
                <ShoppingCart className="w-4 h-4" />
                {wireframeMode ? 'ACTION: TRIGGER_ORDER_WIDGET' : 'Simular Encomenda / Sacola'}
              </button>
            </div>

            {/* Operating Badge/Warning under CTAs */}
            <div className={`mt-8 flex items-center gap-2 text-xs ${
              wireframeMode ? 'text-neutral-500 font-mono' : 'text-brand-chocolate/60 font-medium'
            }`}>
              <Calendar className="w-4 h-4 text-brand-pink-dark" />
              <span>
                {wireframeMode 
                  ? 'SYS_METADATA: SAT_SUN_STORE_SCHEDULE' 
                  : `Atendimento de ${businessInfo.workingHours.weekdays} | Pedido Mínimo de R$ ${businessInfo.minOrderValue.toFixed(2)}`}
              </span>
            </div>

          </div>

          {/* Right Graphical Box / Illustration container (Length: 5 cols) */}
          <div className="lg:col-span-5 flex justify-center w-full">
            
            {wireframeMode ? (
              // Wireframe Skeleton layout with Crossed Box representing visual element
              <div className="w-full max-w-[420px] aspect-square border-4 border-black relative bg-neutral-100 flex flex-col items-center justify-center text-center p-8">
                {/* Diagonal crosses */}
                <div className="absolute inset-0 pointer-events-none opacity-20">
                  <svg className="w-full h-full" xmlns="http://www.w3.org/0000/svg">
                    <line x1="0" y1="0" x2="100%" y2="100%" stroke="black" strokeWidth="2" />
                    <line x1="100%" y1="0" x2="0" y2="100%" stroke="black" strokeWidth="2" />
                  </svg>
                </div>
                
                <Layers className="w-12 h-12 mb-3 text-neutral-400" />
                <span className="font-bold text-neutral-700">[IMAGEM_HERO_PRINCIPAL: HERO_IMAGE_4X3]</span>
                <span className="text-xs text-neutral-500 mt-2 font-light">Sugestão: Compilado elegante de Doces, Mini Tortas fatiadas, Bolo Vulcão derretendo chocolate e Salgadinhos de festa quentes.</span>
              </div>
            ) : (
              // Production ready delicious layout card with multi-image stacked concept
              <div className="relative w-full max-w-[420px] aspect-square">
                
                {/* Floating Sweet Sticker Badge */}
                <div className="absolute -top-4 -right-4 bg-yellow-400 text-brand-brown text-xs font-extrabold px-3.5 py-3.5 rounded-full shadow-lg z-20 rotate-12 flex flex-col items-center justify-center border-2 border-brand-brown tracking-tighter">
                  <span>100%</span>
                  <span>Gostoso!</span>
                </div>

                <div className="w-full h-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white rotate-2 transition-transform hover:rotate-0 hover:scale-[1.01] duration-500">
                  <img
                    src="https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&q=80&w=600"
                    alt="Coleção de doces deliciosos Migs Delícia"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Subtle caption tray on image bottom */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 text-white flex flex-col">
                    <span className="font-display text-xl font-bold">Nossa Especialidade</span>
                    <span className="text-xs text-white/80">Caxinhas de Morango frescas e Brigadeiros gourmet feitos diariamente.</span>
                  </div>
                </div>

                {/* Secondary small absolute floating card for design flavor */}
                <div className="absolute -bottom-6 -left-6 bg-white p-3.5 rounded-2xl shadow-xl flex items-center gap-3 border border-brand-pink -rotate-3 hover:rotate-0 transition-transform duration-300">
                  <img
                    src="https://images.unsplash.com/photo-1585325701956-60dd9c8553bc?auto=format&fit=crop&q=80&w=150"
                    alt="Coxinha"
                    className="w-12 h-12 rounded-xl object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex flex-col">
                    <span className="text-[11px] uppercase tracking-wider font-extrabold text-rose-500 font-sans">Salgado Crocante</span>
                    <span className="text-xs font-bold text-brand-brown">Coxinhas super sequinhas</span>
                  </div>
                </div>

              </div>
            )}

          </div>

        </div>
      </div>
    </section>
  );
}
