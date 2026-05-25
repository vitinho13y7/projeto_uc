import React, { useState, useMemo } from 'react';
import { 
  Cake, 
  Search, 
  ShoppingCart, 
  MapPin, 
  Phone, 
  Instagram, 
  Clock, 
  Check, 
  Plus, 
  Minus, 
  Trash2, 
  Star, 
  Sparkles, 
  Layers, 
  X, 
  ArrowRight,
  AlertTriangle,
  ChevronRight,
  Copy,
  Code,
  FileText,
  ThumbsUp,
  Heart,
  Info
} from 'lucide-react';
import { PRODUCTS, BUSINESS_INFO, INITIAL_REVIEWS } from './data';
import { Product, CartItem, Review, Category } from './types';

export default function App() {
  // Tabs: 'visual' (Landing page), 'wireframe' (Structural Skeleton), 'code' (Pure exportable HTML/CSS)
  const [activeTab, setActiveTab] = useState<'visual' | 'wireframe' | 'code'>('visual');
  const [activeCodeTab, setActiveCodeTab] = useState<'html' | 'css'>('html');
  const [copied, setCopied] = useState<boolean>(false);

  // Shopping Cart & Order State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [deliveryMethod, setDeliveryMethod] = useState<'entrega' | 'retirada'>('entrega');
  const [customerAddress, setCustomerAddress] = useState<string>('');
  const [orderNotes, setOrderNotes] = useState<string>('');
  
  // Catalog filter state
  const [selectedCategory, setSelectedCategory] = useState<Category>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Delivery simulator state
  const [simulatedCep, setSimulatedCep] = useState<string>('');
  const [freteResult, setFreteResult] = useState<{
    calculated: boolean;
    distance: number;
    fee: number;
    time: string;
    allowed: boolean;
  } | null>(null);

  // Reviews Feed State
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [newReviewName, setNewReviewName] = useState<string>('');
  const [newReviewComment, setNewReviewComment] = useState<string>('');
  const [newReviewRating, setNewReviewRating] = useState<number>(5);
  const [reviewSuccess, setReviewSuccess] = useState<boolean>(false);

  // Filter products based on search and category selection
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(product => {
      const matchesCategory = selectedCategory === 'todos' || product.category === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Cart operations
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.product.id === productId) {
          const nextQty = item.quantity + delta;
          return nextQty > 0 ? { ...item, quantity: nextQty } : item;
        }
        return item;
      }).filter(item => item.quantity > 0);
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const cartTotalItems = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  }, [cart]);

  const cartSubtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  }, [cart]);

  const finalDeliveryFee = useMemo(() => {
    if (deliveryMethod === 'retirada') return 0;
    return freteResult ? freteResult.fee : BUSINESS_INFO.deliveryFee;
  }, [deliveryMethod, freteResult]);

  const cartTotal = useMemo(() => {
    return cartSubtotal + finalDeliveryFee;
  }, [cartSubtotal, finalDeliveryFee]);

  const canPlaceOrder = useMemo(() => {
    return cartSubtotal >= BUSINESS_INFO.minOrderValue && customerName.trim().length > 0;
  }, [cartSubtotal, customerName]);

  // Simulate Freight / Shipping calculation based on CEP
  const handleCalculateFrete = (e: React.FormEvent) => {
    e.preventDefault();
    if (!simulatedCep.trim()) return;

    const parsedDigits = parseInt(simulatedCep.replace(/\D/g, '')) || 12345;
    const distance = parseFloat(((parsedDigits % 12) + 1.2).toFixed(1)); 
    const allowed = distance <= 12; 
    const fee = allowed ? parseFloat((5 + distance * 1.5).toFixed(2)) : 0;
    const time = distance < 3 ? "20-30 min" : distance < 7 ? "35-50 min" : "50-70 min";

    setFreteResult({
      calculated: true,
      distance,
      fee,
      time,
      allowed
    });
  };

  // Add customer feedback action
  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewName.trim() || !newReviewComment.trim()) return;

    const newRevObj: Review = {
      id: `custom-${Date.now()}`,
      name: newReviewName,
      rating: newReviewRating,
      comment: newReviewComment,
      date: 'Agora mesmo',
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
    };

    setReviews(prev => [newRevObj, ...prev]);
    setNewReviewName('');
    setNewReviewComment('');
    setNewReviewRating(5);
    setReviewSuccess(true);
    setTimeout(() => setReviewSuccess(false), 4000);
  };

  // WhatsApp Order payload
  const handleCheckoutWhatsApp = () => {
    if (!canPlaceOrder) return;

    const itemsText = cart.map(item => {
      return `• *${item.quantity}x* ${item.product.name} (${item.product.unit}) - R$ ${(item.product.price * item.quantity).toFixed(2)}`;
    }).join('\n');

    const methodText = deliveryMethod === 'entrega' 
      ? `🚚 *Entrega no Endereço*:\n${customerAddress || 'Não preenchido'}`
      : `🏪 *Retirada na Loja*`;

    const notesText = orderNotes.trim() ? `\n📝 *Observações*: ${orderNotes}` : '';

    const payload = `Olá, Migs Delícias! Gostaria de fazer uma encomenda:

🛒 *MEUS PRODUTOS:*
${itemsText}

----------------------------
💵 *Subtotal:* R$ ${cartSubtotal.toFixed(2)}
🛵 *Taxa de Entrega:* R$ ${finalDeliveryFee.toFixed(2)}
💰 *Total Geral:* R$ ${cartTotal.toFixed(2)}

👤 *CLIENTE:*
*Nome:* ${customerName}
*Telefone:* ${customerPhone || 'Não informado'}

📍 *MÉTODO:*
${methodText}${notesText}

*(Pedido simulado com sucesso na nossa Landing Page)*`;

    const encodedText = encodeURIComponent(payload);
    const whatsappLink = `https://api.whatsapp.com/send?phone=${BUSINESS_INFO.phone}&text=${encodedText}`;
    window.open(whatsappLink, '_blank');
  };

  const pureHtmlCode = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Migs Delícias - Doces, Bolos e Salgados</title>
  
  <!-- Fontes Plus Jakarta Sans & Playfair Display -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  
  <!-- Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            brand: {
              cream: '#FDF9F3',
              text: '#4A3728',
              rose: '#D98C8C',
              sage: '#8C9D7E',
              gold: '#E5B582',
              hover: '#F9F1E8'
            }
          },
          fontFamily: {
            sans: ['"Plus Jakarta Sans"', 'sans-serif'],
            display: ['"Playfair Display"', 'serif']
          }
        }
      }
    }
  </script>
</head>
<body class="bg-brand-cream text-brand-text font-sans scroll-smooth">

  <!-- BARRA DE NAVEGAÇÃO -->
  <header class="sticky top-0 z-40 bg-[#FDF9F3]/95 backdrop-blur-md border-b border-[#4A3728]/10 shadow-sm text-brand-text">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="bg-brand-rose p-2.5 rounded-full text-white shadow-md">
          🎂
        </div>
        <div>
          <span class="text-xl sm:text-2xl font-black tracking-tight font-display italic">Migs Delícias</span>
          <span class="block text-[10px] text-brand-rose italic font-medium -mt-1">Doce que encanta, sabor que fica!</span>
        </div>
      </div>
      
      <nav class="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-wider">
        <a href="#cardapio" class="hover:text-brand-rose transition-colors">Cardápio</a>
        <a href="#como-funcionar" class="hover:text-brand-rose transition-colors">Como Encomendar</a>
        <a href="#depoimentos" class="hover:text-brand-rose transition-colors">Avaliações</a>
        <a href="#contato" class="bg-brand-text text-white px-5 py-2 rounded-full hover:opacity-90 transition-opacity">Contato</a>
      </nav>
    </div>
  </header>

  <!-- SEÇÃO HERO -->
  <section class="relative min-h-[500px] flex items-center justify-center py-20 px-4 bg-gradient-to-br from-[#FDF2F4] via-brand-cream to-amber-50">
    <div class="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
      
      <!-- Lado Esquerdo: Conteúdo -->
      <div class="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
        <div class="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-white text-brand-rose shadow-sm border border-pink-100">
          ✨ FEITO COM AMOR & AFETO
        </div>
        
        <h1 class="text-4xl sm:text-6xl font-display font-medium text-brand-text leading-tight mb-6">
          Doces que <br class="hidden sm:inline" />
          <span class="text-brand-rose italic pl-2 sm:pl-6">abraçam</span> o coração.
        </h1>
        
        <p class="max-w-md text-lg leading-relaxed text-brand-text/80 mb-10">
          Especialista em mini tortas delicadas, bolos caseiros com gostinho de infância e salgados fritos na hora super crocantes.
        </p>
        
        <div class="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <a href="https://wa.me/5511991072583" target="_blank" class="bg-brand-rose hover:bg-[#c97b7b] text-white px-8 py-4 rounded-full font-bold uppercase tracking-wider text-xs shadow-lg shadow-brand-rose/20 text-center transition-all hover:scale-105">
            Encomende pelo WhatsApp
          </a>
          <a href="#cardapio" class="border border-brand-text text-brand-text px-8 py-4 rounded-full font-bold uppercase tracking-wider text-xs text-center hover:bg-brand-text hover:text-white transition-all">
            Ver Cardápio Completo
          </a>
        </div>
      </div>
      
      <!-- Lado Direito: Imagem Flyer Ilustração -->
      <div class="lg:col-span-5 flex justify-center w-full">
        <div class="relative w-full max-w-[400px] aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-white transform rotate-2 hover:rotate-0 transition-all duration-500 bg-white">
          <img src="https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&q=80&w=600" alt="Migs Delícias Doces Finos" class="w-full h-full object-cover">
          <div class="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 p-6 text-white">
            <p class="font-display text-lg italic">Migs Delícias</p>
            <p class="text-xs text-white/85">Bolos fofinhos, doces finos e salgados crocantes</p>
          </div>
        </div>
      </div>
      
    </div>
  </section>

  <!-- VITRINE / CARDÁPIO -->
  <section id="cardapio" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
    <div class="text-center mb-16">
      <h2 class="text-3xl sm:text-4xl font-display italic text-brand-text mb-4">Nosso Cardápio Artesanal</h2>
      <p class="max-w-lg mx-auto text-sm text-brand-text/75 leading-relaxed">
        Ingredientes selecionados e preparados diariamente para te entregar o verdadeiro sabor da felicidade!
      </p>
      <div class="w-16 h-[2.5px] bg-brand-rose mx-auto mt-4"></div>
    </div>

    <!-- Categorias do Cardápio -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      
      <!-- Bloco 1: Bolos Caseiros -->
      <div class="bg-[#FAF1E8]/60 border border-[#4A3728]/10 rounded-2xl p-6 hover:shadow-xl transition-all duration-300">
        <div class="w-14 h-14 rounded-full bg-brand-gold/15 mb-6 flex items-center justify-center text-2xl shadow-inner">
          🎂
        </div>
        <h3 class="text-2xl font-display italic text-brand-text mb-4">Bolos Caseiros</h3>
        <p class="text-xs text-brand-text/70 mb-6 font-medium uppercase tracking-wider">Fofinhos e Irresistíveis</p>
        <ul class="space-y-4 text-sm">
          <li class="flex justify-between border-b border-dashed border-brand-text/20 pb-2">
            <span>Bolo de Cenoura Vulcão</span>
            <strong class="text-brand-rose">R$ 29,90</strong>
          </li>
          <li class="flex justify-between border-b border-dashed border-brand-text/20 pb-2">
            <span>Bolo de Fubá d'vó com Goiabada</span>
            <strong class="text-brand-rose">R$ 24,90</strong>
          </li>
          <li class="flex justify-between border-b border-dashed border-brand-text/20 pb-2">
            <span>Bolo Vulcão Ninho & Morangos</span>
            <strong class="text-brand-rose">R$ 36,00</strong>
          </li>
        </ul>
      </div>

      <!-- Bloco 2: Docinhos & Mini Tortas -->
      <div class="bg-[#FAF1E8]/60 border border-[#4A3728]/10 rounded-2xl p-6 hover:shadow-xl transition-all duration-300">
        <div class="w-14 h-14 rounded-full bg-brand-rose/15 mb-6 flex items-center justify-center text-2xl shadow-inner">
          🧁
        </div>
        <h3 class="text-2xl font-display italic text-brand-text mb-4">Docinhos e Mini Tortas</h3>
        <p class="text-xs text-brand-text/70 mb-6 font-medium uppercase tracking-wider">Perfeitos para qualquer ocasião</p>
        <ul class="space-y-4 text-sm">
          <li class="flex justify-between border-b border-dashed border-brand-text/20 pb-2">
            <span>Brigadeiro Belga Gourmet</span>
            <strong class="text-brand-rose">R$ 4,50</strong>
          </li>
          <li class="flex justify-between border-b border-dashed border-brand-text/20 pb-2">
            <span>Coxinha de Morango com Ninho</span>
            <strong class="text-brand-rose">R$ 8,50</strong>
          </li>
          <li class="flex justify-between border-b border-dashed border-brand-text/20 pb-2">
            <span>Mini Torta Limão Maçaricado</span>
            <strong class="text-brand-rose">R$ 12,90</strong>
          </li>
          <li class="flex justify-between border-b border-dashed border-brand-text/20 pb-2">
            <span>Mini Banoffee Pie Crocante</span>
            <strong class="text-brand-rose">R$ 14,00</strong>
          </li>
        </ul>
      </div>

      <!-- Bloco 3: Salgados Fritos -->
      <div class="bg-[#FAF1E8]/60 border border-[#4A3728]/10 rounded-2xl p-6 hover:shadow-xl transition-all duration-300">
        <div class="w-14 h-14 rounded-full bg-brand-sage/15 mb-6 flex items-center justify-center text-2xl shadow-inner">
          🍗
        </div>
        <h3 class="text-2xl font-display italic text-brand-text mb-4">Salgados Fritos</h3>
        <p class="text-xs text-brand-text/70 mb-6 font-medium uppercase tracking-wider">Crocantes e Saborosos</p>
        <ul class="space-y-4 text-sm">
          <li class="flex justify-between border-b border-dashed border-brand-text/20 pb-2">
            <span>Coxinha de Frango com Catupiry</span>
            <strong class="text-brand-rose">R$ 7,50</strong>
          </li>
          <li class="flex justify-between border-b border-dashed border-brand-text/20 pb-2">
            <span>Bolinha de Queijo Prato Suprema</span>
            <strong class="text-brand-rose">R$ 7,00</strong>
          </li>
          <li class="flex justify-between border-b border-dashed border-brand-text/20 pb-2">
            <span>Cento de Salgadinhos de Festa</span>
            <strong class="text-brand-rose">R$ 95,00</strong>
          </li>
        </ul>
      </div>

    </div>
  </section>

  <!-- FOOTER -->
  <footer id="contato" class="bg-brand-text text-brand-cream py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      <div>
        <h3 class="text-3xl font-display italic text-brand-gold mb-4">Migs Delícias</h3>
        <p class="max-w-sm text-xs leading-relaxed opacity-80 mb-6">
          Doce que encanta, sabor que fica. Entre em contato diretamente pelo WhatsApp ou nos siga no Instagram para conferir as novidades diárias!
        </p>
        <div class="text-sm font-bold text-brand-gold">
          WhatsApp: (11) 99107-2583
        </div>
      </div>
      <div class="flex flex-col gap-3 font-semibold text-xs md:text-right">
        <span>Curitiba & São Paulo, BR</span>
        <span class="opacity-60">Atendimento Regular Segunda a Sábado</span>
        <a href="https://instagram.com/migs_delicias" target="_blank" class="text-brand-rose hover:underline pt-2">Instagram: @migs_delicias</a>
      </div>
    </div>
  </footer>

</body>
</html>`;

  const pureCssCode = `/* styles.css */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

/* Migs Delícias Theme Palette */
:root {
  --color-cream: #FDF9F3;
  --color-text: #4A3728;
  --color-rose: #D98C8C;
  --color-sage: #8C9D7E;
  --color-gold: #E5B582;
}

body {
  font-family: 'Plus Jakarta Sans', sans-serif;
  background-color: var(--color-cream);
  color: var(--color-text);
  margin: 0;
  padding: 0;
  scroll-behavior: smooth;
}

/* Typography styles */
.font-display {
  font-family: 'Playfair Display', serif;
}

/* Scrollbar customization */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: var(--color-cream);
}
::-webkit-scrollbar-thumb {
  background: var(--color-rose);
  border-radius: 4px;
}
`;

  // Copies code tab content
  const handleCopyCode = () => {
    const textToCopy = activeCodeTab === 'html' ? pureHtmlCode : pureCssCode;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'doces': return 'text-brand-rose border-brand-rose/40 bg-brand-rose/10';
      case 'minis_tortas': return 'text-brand-sage border-brand-sage/40 bg-brand-sage/10';
      case 'bolos_caseiros': return 'text-brand-gold border-brand-gold/40 bg-brand-gold/10';
      case 'salgados_fritos': return 'text-brand-text bg-brand-text/10';
      default: return 'text-neutral-500 border-neutral-300 bg-neutral-100';
    }
  };

  return (
    <div className={`min-h-screen ${activeTab === 'wireframe' ? 'bg-[#FAFAFA] font-mono text-black' : 'bg-brand-cream text-brand-text font-sans'}`}>
      
      {/* GLOBAL VIEWPORT CONTROLLER TABS BAR */}
      <div className="bg-[#4A3728] text-white py-3.5 px-4 shadow-xl sticky top-0 z-50 border-b border-amber-950/40">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-2">
            <div className="bg-[#D98C8C] text-[#4A3728] p-1.5 rounded-full font-bold text-xs animate-pulse">
              ✨
            </div>
            <span className="text-xs sm:text-sm font-bold tracking-tight font-sans">
              Migs Delícias — Seletor de Modo de Visualização do Site
            </span>
          </div>

          <div className="flex items-center bg-[#2e2117] p-1 rounded-full border border-white/10 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('visual')}
              className={`px-4 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
                activeTab === 'visual' ? 'bg-[#D98C8C] text-white shadow-md' : 'text-zinc-300 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>1. Site Visual Final</span>
            </button>
            
            <button
              onClick={() => setActiveTab('wireframe')}
              className={`px-4 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
                activeTab === 'wireframe' ? 'bg-[#E5B582] text-[#4A3728] shadow-md' : 'text-zinc-300 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>2. Wireframe Estrutural</span>
            </button>

            <button
              onClick={() => setActiveTab('code')}
              className={`px-4 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
                activeTab === 'code' ? 'bg-white text-[#4A3728] shadow-md' : 'text-zinc-300 hover:text-white'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>3. Código HTML/CSS</span>
            </button>
          </div>

        </div>
      </div>

      {/* RENDER TAB 1: VISUAL LANDING PAGE DESIGN */}
      {activeTab === 'visual' && (
        <div className="animate-fade-in">
          
          {/* HEADER HEADER */}
          <header className="bg-[#FDF9F3]/95 backdrop-blur-md border-b border-rose-100/40 shadow-xs text-brand-text">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-[#D98C8C] p-2.5 rounded-full text-white shadow-md">
                  <Cake className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xl sm:text-2xl font-black font-display text-brand-text italic tracking-tighter">Migs Delícias</span>
                  <span className="block text-[10px] text-[#D98C8C] font-semibold italic -mt-1">Doce que encanta, sabor que fica!</span>
                </div>
              </div>

              {/* Center Menu anchors */}
              <nav className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-wider text-brand-text/90">
                <a href="#visual-menu" className="hover:text-[#D98C8C] transition-colors">Cardápio</a>
                <a href="#como-comprar" className="hover:text-[#D98C8C] transition-colors">Como Encomendar</a>
                <a href="#visual-depoimentos" className="hover:text-[#D98C8C] transition-colors">Avaliações</a>
                <a href="#visual-frete" className="hover:text-[#D98C8C] transition-colors">Taxa de Entrega</a>
              </nav>

              <div className="flex items-center gap-4">
                {/* Simulated Cart button */}
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="bg-[#4A3728] hover:bg-[#342418] text-white p-2.5 rounded-full transition-all relative flex items-center justify-center shadow-lg"
                >
                  <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                  {cartTotalItems > 0 && (
                    <span className="absolute -top-1 -right-1.5 w-5 h-5 flex items-center justify-center text-[10px] font-bold bg-[#D98C8C] text-white rounded-full">
                      {cartTotalItems}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </header>

          {/* EYE MATCHING FLYER HERO STAGE */}
          <section className="relative min-h-[500px] sm:min-h-[560px] flex items-center justify-center py-16 px-4 bg-gradient-to-br from-[#FDF2F4] via-brand-cream to-amber-50">
            <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
                <div className="mb-6 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white text-[#D98C8C] border border-pink-100 shadow-sm">
                  <Heart className="w-3.5 h-3.5 fill-[#D98C8C] text-[#D98C8C] animate-pulse" />
                  <span>Feito com amor para adoçar seu dia!</span>
                </div>

                <h1 className="text-4xl sm:text-6xl font-display leading-[1.1] mb-6 text-[#4A3728] font-medium tracking-tight">
                  Doces que <br />
                  <span className="text-[#D98C8C] italic pl-2 sm:pl-8 font-serif leading-none">abraçam</span> o coração.
                </h1>

                <p className="max-w-md text-base sm:text-lg text-brand-text/80 mb-8 leading-relaxed">
                  Tradição e afeto em forma de docinhos sofisticados, mini tortas maçaricadas, bolos vulcão caseiros e salgados sequinhos e fritos na hora. 
                </p>

                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <a 
                    href={`https://wa.me/${BUSINESS_INFO.phone}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="bg-[#D98C8C] hover:bg-[#c97b7b] text-white px-8 py-4 rounded-full font-bold uppercase tracking-wider text-xs shadow-lg shadow-brand-rose/20 text-center transition-all hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <Phone className="w-4 h-4 fill-current" />
                    <span>WhatsApp: 11 99107-2583</span>
                  </a>
                  <a 
                    href="#visual-menu" 
                    className="border border-brand-text text-brand-text px-8 py-4 rounded-full font-bold uppercase tracking-wider text-xs text-center hover:bg-brand-text hover:text-white transition-all"
                  >
                    Ver Nosso Menu
                  </a>
                </div>
              </div>

              {/* Flyer Photo Grid Visual element (from flyer photo context) */}
              <div className="lg:col-span-5 flex justify-center w-full">
                <div className="relative w-full max-w-[400px] aspect-square">
                  
                  {/* Floating Golden badge */}
                  <div className="absolute -top-4 -right-4 bg-[#E5B582] text-[#4A3728] text-xs font-black p-3.5 rounded-full shadow-lg z-20 rotate-12 flex flex-col items-center justify-center border-2 border-[#4A3728]">
                    <span>PROVADO e</span>
                    <span>APROVADO!</span>
                  </div>

                  <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl border-4 border-white rotate-2 transition-transform hover:rotate-0 duration-500">
                    <img 
                      src="https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&q=80&w=600" 
                      alt="Bolo Vulcão Migs Delícias Chocolate" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#4A3728] p-5 text-white flex flex-col">
                      <span className="font-display text-lg italic">Bolos Caseiros Vulcão</span>
                      <span className="text-[11px] opacity-90">Opções deliciosas de Cenoura, Fubá com Goiabada e Leite Ninho</span>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </section>

          {/* FLYER FOCUS ADVERTISEMENTS: 3 PRINCIPLES */}
          <section className="bg-[#FAF1E8] border-y border-[#4A3728]/10 py-10 px-4">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
              
              <div className="flex items-center gap-4 p-4">
                <div className="text-3xl bg-white p-3 rounded-2xl shadow-xs">🎂</div>
                <div>
                  <h4 className="font-bold text-sm text-[#4A3728] uppercase tracking-wide">BOLOS CASEIROS</h4>
                  <p className="text-xs text-brand-text/75 mt-0.5">Fofinhos, úmidos e com recheios transbordantes irresistíveis.</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 border-y md:border-y-0 md:border-x border-[#4A3728]/10">
                <div className="text-3xl bg-white p-3 rounded-2xl shadow-xs">🍗</div>
                <div>
                  <h4 className="font-bold text-sm text-[#4A3728] uppercase tracking-wide">SALGADOS FRITOS</h4>
                  <p className="text-xs text-brand-text/75 mt-0.5">Massa fina de batata, recheio generoso e casquinha sequinha.</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4">
                <div className="text-3xl bg-white p-3 rounded-2xl shadow-xs">🧁</div>
                <div>
                  <h4 className="font-bold text-sm text-[#4A3728] uppercase tracking-wide">DOCINHOS E MINI TORTAS</h4>
                  <p className="text-xs text-brand-text/75 mt-0.5">Brigadeiros belgas gourmet e banoffees finas para festas.</p>
                </div>
              </div>

            </div>
          </section>

          {/* INTERACTIVE MENU CATALOG */}
          <section id="visual-menu" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            
            <div className="text-center mb-12">
              <span className="text-xs font-bold text-[#D98C8C] uppercase tracking-widest block mb-2">Compre com Confiança</span>
              <h2 className="text-3xl sm:text-4xl font-display font-medium italic text-brand-text">Nosso Cardápio Interativo</h2>
              <p className="text-xs sm:text-sm text-brand-text/75 max-w-md mx-auto mt-2">
                Simule seu carrinho de compras e clique em "Finalizar" para exportar a encomenda para o WhatsApp da Migs Prontamente!
              </p>
              <div className="w-16 h-0.5 bg-[#D98C8C] mx-auto mt-4" />
            </div>

            {/* Filter Pills and Search */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10 pb-6 border-b border-[#4A3728]/10">
              
              <div className="flex flex-wrap gap-2 justify-center">
                {[
                  { id: 'todos', name: 'Todos os Itens' },
                  { id: 'doces', name: '🍫 Docinhos' },
                  { id: 'minis_tortas', name: '🥧 Mini Tortas' },
                  { id: 'bolos_caseiros', name: '🎂 Bolos Caseiros' },
                  { id: 'salgados_fritos', name: '🍗 Salgados' }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id as Category)}
                    className={`px-4.5 py-2 rounded-full text-xs font-bold uppercase transition-all tracking-wide ${
                      selectedCategory === cat.id 
                        ? 'bg-[#4A3728] text-white shadow-md' 
                        : 'bg-[#FAF1E8] border border-[#4A3728]/10 text-brand-text hover:bg-white'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              {/* Instant Search bar */}
              <div className="relative w-full md:w-64">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-400">
                  <Search className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Pesquisar sabor..."
                  className="w-full pl-9 pr-4 py-2 border border-[#4A3728]/15 bg-white text-xs font-medium rounded-full focus:outline-none focus:ring-1 focus:ring-[#D98C8C]"
                />
              </div>

            </div>

            {/* Product Grid Render */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div 
                  key={product.id}
                  className="bg-[#FDF9F3] border border-[#4A3728]/10 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="relative aspect-[4/3] bg-neutral-100 overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <span className={`absolute top-2 left-2 text-[9px] font-bold uppercase py-1 px-2.5 rounded-full bg-white border border-[#4A3728]/10 ${getCategoryColor(product.category)}`}>
                      {product.category.replace('_', ' ')}
                    </span>
                    <span className="absolute bottom-2 right-2 bg-[#4A3728] text-white font-bold text-xs px-2.5 py-1 rounded-md">
                      R$ {product.price.toFixed(2)}
                    </span>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-serif italic font-semibold text-[#4A3728] text-lg leading-tight mb-1.5">{product.name}</h3>
                      <p className="text-xs text-brand-text/75 line-clamp-2 h-8 leading-relaxed mb-4">{product.description}</p>
                    </div>

                    <div className="pt-3 border-t border-[#4A3728]/5 flex items-center justify-between mt-auto">
                      <span className="text-[10px] uppercase font-bold text-zinc-400">Por: {product.unit}</span>
                      <button
                        onClick={() => addToCart(product)}
                        className="bg-[#D98C8C] hover:bg-[#c97b7b] text-white px-3.5 py-1.5 text-xs font-bold rounded-full transition-all flex items-center gap-1 uppercase tracking-wider"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Pedir</span>
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>

          </section>

          {/* HOW TO ORDER INFOGRAPHIC STEPS */}
          <section id="como-comprar" className="bg-[#FAF1E8] border-y border-[#4A3728]/15 py-16 px-4">
            <div className="max-w-7xl mx-auto">
              
              <div className="text-center mb-12">
                <span className="text-xs font-bold text-[#8C9D7E] uppercase tracking-widest block mb-2">Comodidade absoluta</span>
                <h3 className="text-2xl sm:text-3xl font-display italic text-[#4A3728]">Doce Rotina de Encomendas</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-8">
                {[
                  { step: '1', title: 'Vitrine Virtual', desc: 'Selecione os bolos caseiros, fritos ou docinhos que deseja no painel.' },
                  { step: '2', title: 'Consultar Frete', desc: 'Preencha o CEP abaixo para verificar a distância e frete estimado de motoboy.' },
                  { step: '3', title: 'Dados de Contato', desc: 'Informe os dados básicos para preparamos sua embalagem personalizada de presente.' },
                  { step: '4', title: 'WhatsApp Direct', desc: 'Clique em finalizar e sua cesta toda vai formatada para o zap da nossa equipe!' }
                ].map((item, idx) => (
                  <div key={idx} className="bg-white/80 border border-amber-900/5 rounded-2xl p-6 text-center shadow-xs">
                    <div className="w-9 h-9 rounded-full bg-[#D98C8C] text-white font-extrabold flex items-center justify-center text-xs mx-auto mb-4">
                      {item.step}
                    </div>
                    <h5 className="font-bold text-sm text-[#4A3728] mb-1.5">{item.title}</h5>
                    <p className="text-xs text-brand-text/75 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>

            </div>
          </section>

          {/* CEP SHIPPING ZONE AREA */}
          <section id="visual-frete" className="max-w-5xl mx-auto px-4 py-16 scroll-mt-24">
            <div className="bg-white rounded-3xl border border-[#4A3728]/10 overflow-hidden shadow-xl grid grid-cols-1 md:grid-cols-12">
              
              <div className="md:col-span-5 bg-[#4A3728] text-[#FDF9F3] p-8 flex flex-col justify-between">
                <div>
                  <h4 className="font-display italic text-2xl text-[#E5B582] mb-3">Estimar Entrega</h4>
                  <p className="text-xs leading-relaxed opacity-90 mb-6">
                    A Migs Delícias está baseada no centro e entrega num raio máximo de até 12 quilômetros por motoneta credenciada para garantir a integridade dos seus docinhos ou bolo vulcão.
                  </p>
                </div>

                <div className="space-y-2 mt-4">
                  <div className="flex items-center gap-2 text-[11px] font-mono">
                    <span className="w-2 h-2 rounded-full bg-green-400"></span>
                    <span>Raio Máximo: 12 km</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] font-mono">
                    <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                    <span>Taxa base: R$ 5,00 + R$ 1,50/km</span>
                  </div>
                </div>
              </div>

              <div className="md:col-span-7 p-8 flex flex-col justify-center">
                <form onSubmit={handleCalculateFrete} className="space-y-4">
                  <span className="text-[11px] font-bold text-[#D98C8C] uppercase tracking-widest block">Consulte sua região</span>
                  <label className="text-xs font-bold block -mt-2">Insira o CEP do local de entrega:</label>
                  
                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={9}
                      value={simulatedCep}
                      onChange={(e) => setSimulatedCep(e.target.value.replace(/\D/g, '').replace(/^(\d{5})(\d)/, '$1-$2'))}
                      placeholder="Ex: 01310-100"
                      className="flex-1 border px-4 py-3 text-xs font-bold rounded-xl focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="bg-[#D98C8C] text-white px-5 py-3 rounded-xl text-xs font-bold uppercase shrink-0 hover:bg-[#c97b7b]"
                    >
                      Calcular Frete
                    </button>
                  </div>
                </form>

                {freteResult ? (
                  <div className={`mt-6 p-4 rounded-xl text-xs ${
                    !freteResult.allowed 
                      ? 'bg-red-50 text-red-900 border border-red-200' 
                      : 'bg-green-50 text-green-900 border border-green-200'
                  }`}>
                    {!freteResult.allowed ? (
                      <p className="font-bold">Ah não! Distância simulada escedeu o raio limite de 12km ({freteResult.distance} km). Oferecemos opção de Retirada na Loja física gratuitamente!</p>
                    ) : (
                      <div>
                        <p className="font-bold">Entrega Disponível!</p>
                        <ul className="mt-1 space-y-0.5 opacity-90">
                          <li>Distância estimada: <strong>{freteResult.distance} km</strong></li>
                          <li>Preço do carreto de entrega: <strong>R$ {freteResult.fee.toFixed(2)}</strong></li>
                          <li>Estimativa para entrega: <strong>{freteResult.time}</strong></li>
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-[11px] text-zinc-400 mt-4 italic">Digite seu CEP acima e confira instantaneamente.</p>
                )}
              </div>

            </div>
          </section>

          {/* SOCIAL TESTIMONIAL FEED */}
          <section id="visual-depoimentos" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              
              <div className="lg:col-span-5 space-y-4">
                <span className="text-xs font-bold text-[#8C9D7E] uppercase tracking-widest block">Comunidade Migs</span>
                <h3 className="text-3xl font-display font-semibold italic text-[#4A3728]">Depoimentos De Clientes Próximos</h3>
                <p className="text-xs sm:text-sm text-brand-text/80 leading-relaxed">
                  Trabalhamos duro para entregar perfeição em cada mordida. Veja os depoimentos sinceros de quem já comprou nossos doces e salgados fritos!
                </p>

                <div className="bg-yellow-50 p-4 border rounded-2xl flex items-center gap-3">
                  <Star className="w-8 h-8 text-yellow-500 fill-yellow-500 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-zinc-800">Média Geral de Avaliações</p>
                    <p className="text-xs text-zinc-500 font-bold">5.0 Estrelas de Satisfação Suprema!</p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 space-y-4 max-h-[500px] overflow-y-auto pr-2 no-scrollbar">
                {reviews.map((rev) => (
                  <div key={rev.id} className="bg-white border rounded-2xl p-5 shadow-xs">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-[#4A3728] uppercase font-mono tracking-wider">{rev.name}</span>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3 h-3 ${i < rev.rating ? 'text-yellow-500 fill-yellow-500' : 'text-neutral-200'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm italic text-brand-text/90">"{rev.comment}"</p>
                    <span className="block text-[10px] text-zinc-400 mt-2 text-right">{rev.date}</span>
                  </div>
                ))}
              </div>

            </div>
          </section>

          {/* VISUAL FOOTER */}
          <footer className="bg-[#4A3728] text-[#FDF9F3] py-16 px-4">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10">
              
              <div className="md:col-span-6 space-y-4">
                <span className="text-2xl font-display font-semibold italic text-[#E5B582]">Migs Delícias</span>
                <p className="text-xs opacity-80 max-w-sm">
                  Doces decorados, brigadeiros finos, mini tortas francesas sob medida, bolos doces fofinhos artesanais, e salgadinhos super crocantes para garantir o sucesso do seu evento ou do café da tarde!
                </p>
              </div>

              <div className="md:col-span-3 space-y-2">
                <h5 className="text-[#D98C8C] text-xs font-bold uppercase tracking-wider">Fale Conosco</h5>
                <ul className="space-y-1 text-xs opacity-90">
                  <li className="flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    <span>(11) 99107-2583</span>
                  </li>
                  <li className="flex items-center gap-1">
                    <Instagram className="w-3 h-3" />
                    <span>@migs_delicias</span>
                  </li>
                </ul>
              </div>

              <div className="md:col-span-3 space-y-2">
                <h5 className="text-[#E5B582] text-xs font-bold uppercase tracking-wider">Apoio & Parcerias</h5>
                <p className="text-[11px] opacity-85 leading-relaxed">
                  Produzido localmente em São Paulo e Curitiba • Adoçando momentos com total higiene e amor.
                </p>
              </div>

            </div>
          </footer>

        </div>
      )}

      {/* RENDER TAB 2: WIREFRAME SKELETON BLUEPRINT */}
      {activeTab === 'wireframe' && (
        <div className="animate-fade-in font-mono p-4 sm:p-8 space-y-10 text-xs">
          
          {/* Header Skeletal */}
          <div className="border-4 border-black bg-white p-6 relative">
            <div className="absolute top-2 right-2 bg-neutral-200 px-2 py-0.5 font-bold uppercase text-[9px] border border-black">
              WIREFRAME_COMP: WIREFRAME_MAIN_HEADER (STICKY)
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 border-2 border-black bg-neutral-100 flex items-center justify-center font-bold">LGO</div>
                <div>
                  <span className="text-lg font-bold block">[MIGS_DELICIAS_LOGO_TEXT]</span>
                  <span className="text-[10px] text-zinc-500 block">SUB: SLOGAN_FLYER_DESCRIPTIVE</span>
                </div>
              </div>

              <div className="flex gap-4 font-bold">
                <span>[NAV_LINK_1: MENU]</span>
                <span>[NAV_LINK_2: OPERATION_GUIDE]</span>
                <span>[NAV_LINK_3: REVIEWS]</span>
                <span>[NAV_LINK_4: MAP_CHECK]</span>
              </div>

              <div className="w-24 h-8 border-2 border-dashed border-black flex items-center justify-center bg-neutral-50 font-bold text-[10px]">
                [CART_BAG_CTR: 0]
              </div>
            </div>
          </div>

          {/* Hero Skeletal Stage */}
          <div className="border-4 border-black bg-neutral-50 p-8 relative">
            <div className="absolute top-2 right-2 bg-neutral-200 px-2 py-0.5 font-bold uppercase text-[9px] border border-black">
              WIREFRAME_COMP: HERO_OUTER_STAGE (12_COL_GRID)
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-4">
              
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-block border-2 border-black bg-white px-3 py-1 font-bold text-[10px]">
                  [BADGE: METRIC_PROP_TEXT / AMOR_E_AFETO]
                </div>
                
                <h1 className="text-3xl sm:text-5xl font-extrabold uppercase border-b-2 border-black pb-2 leading-none">
                  [HERO_MAIN_HEADING: DOCES_QUE_ABRAÇAM_CORAÇÃO]
                </h1>

                <p className="text-sm text-zinc-700 leading-relaxed border-l-4 border-black pl-3">
                  [HERO_PARAGRAPH_PLACEHOLDER: Details regarding artisan custom chocolate brigadeiros, fresh strawberry coconuts, grandmother lemon torte treats and crunchy salty snacks.]
                </p>

                <div className="flex gap-2">
                  <div className="px-6 py-3 border-2 border-black bg-black text-white font-extrabold uppercase text-[10px] text-center">
                    [CTA_BUTTON_A: ORDER_VIA_WHATSAPP]
                  </div>
                  <div className="px-6 py-3 border-2 border-black bg-white text-black font-semibold uppercase text-[10px] text-center">
                    [CTA_BUTTON_B: SCROLL_TO_VITRINE]
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="w-full aspect-square border-4 border-dashed border-black bg-white relative flex flex-col items-center justify-center text-center p-8">
                  {/* diagon crosses */}
                  <div className="absolute inset-0 pointer-events-none opacity-20">
                    <svg className="w-full h-full">
                      <line x1="0" y1="0" x2="100%" y2="100%" stroke="black" strokeWidth="2" />
                      <line x1="100%" y1="0" x2="0" y2="100%" stroke="black" strokeWidth="2" />
                    </svg>
                  </div>
                  
                  <span className="font-bold relative z-10">[IMAGE_CONTAINER_PLACEHOLDER: FLYER_PRODUCT_COMPILATION]</span>
                  <span className="text-neutral-500 block mt-2 text-[10px]">Sugestão: Compilado elegante dos bolos, doces finos de morango e o cento de salgados sequinhos.</span>
                </div>
              </div>

            </div>
          </div>

          {/* Catalog Blueprint Skeletal Grid */}
          <div className="border-4 border-black bg-white p-8 relative">
            <div className="absolute top-2 right-2 bg-neutral-200 px-2 py-0.5 font-bold uppercase text-[9px] border border-black">
              WIREFRAME_COMP: PRODUCT_CATALOG_FILTER_GRID
            </div>

            <div className="border-b-2 border-black pb-4 mb-6 pt-4">
              <h3 className="text-xl font-bold uppercase">[VITRINE_INTERATIVA_CARDAPIO_SKELETON]</h3>
              <p className="text-zinc-500 text-[11px] mt-1">Sistemas de Abas com simulação de cesta e acréscimo de valor automático para simulações instantâneas.</p>
            </div>

            {/* Filter skeleton */}
            <div className="flex flex-wrap gap-2 mb-6 text-[10px]">
              <span className="px-3 py-1.5 border-2 border-black bg-black text-white uppercase">[VER_TODOS_ITENS_FILTRO]</span>
              <span className="px-3 py-1.5 border border-black bg-zinc-50 uppercase">[FILTRO_CATEGORIA: DOCES_FINOS]</span>
              <span className="px-3 py-1.5 border border-black bg-zinc-50 uppercase">[FILTRO_CATEGORIA: MINIS_TORTAS]</span>
              <span className="px-3 py-1.5 border border-black bg-zinc-50 uppercase">[FILTRO_CATEGORIA: BOLOS_CASEIROS]</span>
              <span className="px-3 py-1.5 border border-black bg-zinc-50 uppercase">[FILTRO_CATEGORIA: SALGADOS_FRITOS]</span>
            </div>

            {/* Simulating card skeletons */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((num) => (
                <div key={num} className="border-2 border-black p-4 bg-neutral-50 flex flex-col justify-between">
                  <div>
                    <div className="aspect-[4/3] border border-dashed border-black bg-neutral-200 flex items-center justify-center font-bold text-[9px] text-zinc-500 uppercase mb-3">
                      [IMG_PROD_THUMB_{num}]
                    </div>
                    <div className="font-bold uppercase text-[11px]">[NOME_MOCK_PRODUTO_{num}]</div>
                    <p className="text-zinc-500 text-[10px] mt-1 mb-4">[Descrição do doce, gramas, ingrediente e tipo de embalagem]</p>
                  </div>
                  <div className="flex items-center justify-between border-t border-black pt-2 text-[11px]">
                    <span className="font-bold bg-neutral-200 px-1">R$ 00,00</span>
                    <span className="border border-black px-1.5 py-0.5 text-[9px] font-bold uppercase">[+ ADD_BAG]</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery & Feedback blue box columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="border-4 border-black bg-neutral-100 p-6 relative">
              <span className="absolute top-2 right-2 uppercase bg-neutral-300 border border-black px-1.5 text-[9px] font-bold">COMP: CEP_FREIGHT_WIDGET</span>
              <h5 className="font-bold mb-3 uppercase pt-2">CALCULADORA DE DISTÂNCIA E MOTOFRETE</h5>
              <div className="border border-neutral-300 p-4 bg-white mt-2">
                <p className="text-zinc-500 text-[10px] mb-3">[INPUT_TEXT: NUMBERS_ONLY] CEP de Destino para simulação</p>
                <div className="w-24 py-1.5 bg-black text-white text-center text-[10px] font-mono font-bold uppercase cursor-pointer">[CALCULA_FRETE]</div>
              </div>
            </div>

            <div className="border-4 border-black bg-neutral-100 p-6 relative">
              <span className="absolute top-2 right-2 uppercase bg-neutral-300 border border-black px-1.5 text-[9px] font-bold">COMP: CUSTOMER_REVIEWS_FORM</span>
              <h5 className="font-bold mb-3 uppercase pt-2">AÇÕES DE DEPOIMENTO & SISTEMA DE ESTRELAS</h5>
              <div className="border border-neutral-300 p-4 bg-white mt-2 space-y-2">
                <span className="block h-2 bg-neutral-200 w-1/2"></span>
                <span className="block h-2 bg-neutral-200 w-3/4"></span>
                <div className="h-6 w-20 border border-black bg-zinc-100 text-[9px] font-bold flex items-center justify-center">[ENVIAR_DEPOIMENTO]</div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* RENDER TAB 3: SOURCE CODE DOWNLOADER FOR THE PURE HTML/CSS LANDING PAGE */}
      {activeTab === 'code' && (
        <div className="animate-fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-mono text-xs">
          
          <div className="bg-[#FAF1E8] border border-[#4A3728]/15 rounded-3xl p-6 sm:p-8 space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#4A3728]/10 pb-5">
              <div>
                <p className="text-[11px] text-[#D98C8C] uppercase font-bold tracking-widest mb-1">PROJETO MIGS DELÍCIAS DISPONÍVEL</p>
                <h3 className="text-2xl font-display font-medium italic text-[#4A3728]">Código Seco HTML & CSS da Landing Page</h3>
                <p className="text-zinc-600 text-[11px] font-sans mt-1 leading-relaxed">
                  Aqui está o código estático completo e higienizado com Tailwind CSS para você copiar e usar no seu servidor!
                </p>
              </div>

              <div className="flex items-center gap-3">
                
                {/* Secondary select tabs html/css */}
                <div className="flex bg-[#2E2117] p-1 rounded-full border border-white/5 text-xs text-white">
                  <button
                    onClick={() => setActiveCodeTab('html')}
                    className={`px-4 py-1.5 rounded-full uppercase tracking-tighter transition-all ${
                      activeCodeTab === 'html' ? 'bg-[#D98C8C] text-white font-bold' : 'text-zinc-300 hover:text-white'
                    }`}
                  >
                    migs_site.html
                  </button>
                  <button
                    onClick={() => setActiveCodeTab('css')}
                    className={`px-4 py-1.5 rounded-full uppercase tracking-tighter transition-all ${
                      activeCodeTab === 'css' ? 'bg-[#D98C8C] text-white font-bold' : 'text-zinc-300 hover:text-white'
                    }`}
                  >
                    styles.css
                  </button>
                </div>

                <button
                  onClick={handleCopyCode}
                  className="bg-[#4A3728] hover:bg-[#342418] text-white px-5 py-2 rounded-full font-bold uppercase text-[10px] flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all text-nowrap"
                >
                  <Copy className="w-3.5 h-3.5 text-[#E5B582]" />
                  <span>{copied ? "Copiado!" : "Copiar Código"}</span>
                </button>

              </div>
            </div>

            {/* Interactive Code block container */}
            <div className="relative">
              <div className="absolute top-4 right-4 bg-zinc-800 text-zinc-400 text-[9px] px-2 py-1 select-none font-sans rounded">
                {activeCodeTab === 'html' ? 'TEXT / HTML' : 'CASCADING STYLE SHEET'}
              </div>

              <pre className="w-full overflow-x-auto p-6 sm:p-8 bg-zinc-900 text-zinc-150 rounded-2xl border-2 border-[#4A3728]/15 font-mono leading-relaxed select-all shadow-inner max-h-[500px]">
                <code>
                  {activeCodeTab === 'html' ? pureHtmlCode : pureCssCode}
                </code>
              </pre>
            </div>

            <div className="bg-yellow-50/50 p-4 rounded-xl border border-yellow-200/50 text-xs font-sans text-brand-text flex items-center gap-2">
              <Info className="w-4 h-4 text-[#D98C8C] shrink-0" />
              <span>
                <strong>Como usar este código:</strong> O arquivo <strong>migs_site.html</strong> usa o motor oficial da CDN do Tailwind CSS v3/v4 para compor o visual. Você pode salvá-lo no seu computador e abri-lo direto no navegador para testá-lo instantaneamente, sem precisar instalar nada!
              </span>
            </div>

          </div>

        </div>
      )}

      {/* 8. SHOPPING CART SIMULATOR DIRECT DRAWER (SLIDES IN ON RIGHT) */}
      {isCartOpen && (
        <div id="cart-sidebar-container" className="fixed inset-0 z-50 overflow-hidden" aria-modal="true" role="dialog">
          
          {/* Backdrop overlay */}
          <div 
            onClick={() => setIsCartOpen(false)}
            className="absolute inset-0 bg-neutral-900/60 backdrop-blur-xs transition-opacity" 
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className={`w-screen max-w-md bg-white border-l-2 border-[#4A3728]/25 shadow-2xl flex flex-col justify-between p-6 sm:p-8 font-sans text-brand-text`}>
              
              {/* Drawer Container */}
              <div className="flex-1 flex flex-col justify-between overflow-y-auto no-scrollbar">
                
                {/* 8.1 Header Drawer */}
                <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5 text-[#D98C8C]" />
                    <h3 className="text-lg font-serif italic text-[#4A3728] font-bold">
                      Sua Sacola Gourmet
                    </h3>
                  </div>

                  <button 
                    id="close-cart"
                    onClick={() => setIsCartOpen(false)}
                    className="p-1.5 border border-neutral-300 hover:border-black rounded-lg transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* 8.2 Items List Body */}
                <div className="flex-1 overflow-y-auto py-4 space-y-4 no-scrollbar">
                  {cart.length === 0 ? (
                    <div className="text-center py-12 space-y-3">
                      <div className="text-4xl">🧁</div>
                      <p className="text-xs font-bold text-neutral-500">Sua sacola de simulação está vazia.</p>
                      <p className="text-[11px] text-neutral-400">Clique em "Pedir" na vitrine para adicionar!</p>
                      
                      <button
                        onClick={() => setIsCartOpen(false)}
                        className="mt-4 px-4 py-2 bg-[#D98C8C] text-white text-xs font-bold uppercase rounded-full hover:bg-[#c97b7b]"
                      >
                        Ver Cardápio
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {cart.map((item) => (
                        <div 
                          key={item.product.id}
                          className="p-3 bg-[#FAF1E8] border border-[#4A3728]/5 rounded-xl flex justify-between gap-4"
                        >
                          <div className="flex-1 min-w-0">
                            <span className="text-[9px] uppercase tracking-wider text-rose-500 font-extrabold">
                              {item.product.category.replace('_', ' ')}
                            </span>
                            
                            <h4 className="text-xs font-bold text-brand-text truncate">
                              {item.product.name}
                            </h4>
                            
                            <p className="text-[11px] text-zinc-500">
                              R$ {item.product.price.toFixed(2)} / {item.product.unit}
                            </p>
                          </div>

                          <div className="flex flex-col items-end gap-2 shrink-0 justify-between">
                            <button
                              aria-label="Apagar item"
                              onClick={() => removeFromCart(item.product.id)}
                              className="text-neutral-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>

                            <div className="flex items-center gap-1.5 border bg-white rounded-md p-0.5 border-neutral-200">
                              <button 
                                onClick={() => updateQuantity(item.product.id, -1)}
                                className="p-0.5 text-zinc-600 hover:bg-zinc-100 rounded"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              
                              <span className="w-6 text-center text-xs font-bold">
                                {item.quantity}
                              </span>
                              
                              <button 
                                onClick={() => updateQuantity(item.product.id, 1)}
                                className="p-0.5 text-zinc-600 hover:bg-zinc-100 rounded"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Address, Phone inputs details */}
                  {cart.length > 0 && (
                    <div className="mt-6 border-t pt-4 space-y-3">
                      <span className="text-[11px] font-bold text-[#D98C8C] uppercase tracking-widest block">DADOS DE ENVIO</span>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] font-bold text-zinc-500 block mb-1">Seu Nome *</label>
                          <input
                            type="text"
                            required
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            placeholder="Ana Silva"
                            className="w-full px-3 py-2 text-xs border rounded-lg focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-zinc-500 block mb-1">Celular / Whats *</label>
                          <input
                            type="text"
                            required
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                            placeholder="11 99999-8888"
                            className="w-full px-3 py-2 text-xs border rounded-lg focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Delivery method select pill */}
                      <div>
                        <label className="text-[10px] font-bold text-zinc-500 block mb-1">Retirada ou Receber em Casa?</label>
                        <div className="flex bg-zinc-100 p-1 rounded-lg">
                          <button
                            type="button"
                            onClick={() => setDeliveryMethod('entrega')}
                            className={`flex-1 py-1.5 text-xs font-bold rounded-md ${
                              deliveryMethod === 'entrega' ? 'bg-white text-zinc-800 shadow-sm' : 'text-zinc-500'
                            }`}
                          >
                            🚚 Enviar por Motoboy
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeliveryMethod('retirada')}
                            className={`flex-1 py-1.5 text-xs font-bold rounded-md ${
                              deliveryMethod === 'retirada' ? 'bg-white text-zinc-800 shadow-sm' : 'text-zinc-500'
                            }`}
                          >
                            🏪 Retirar no Balcão
                          </button>
                        </div>
                      </div>

                      {deliveryMethod === 'entrega' && (
                        <div>
                          <label className="text-[10px] font-bold text-zinc-500 block mb-1">Endereço Completo de Destino *</label>
                          <textarea
                            required
                            rows={2}
                            value={customerAddress}
                            onChange={(e) => setCustomerAddress(e.target.value)}
                            placeholder="Rua das Flores, 120 - Ap 32 - Bairro Doce"
                            className="w-full px-3 py-2 text-xs border rounded-lg focus:outline-none resize-none"
                          />
                        </div>
                      )}

                      <div>
                        <label className="text-[10px] font-bold text-zinc-500 block mb-1">Detalhes Adicionais (Opcional)</label>
                        <input
                          type="text"
                          value={orderNotes}
                          onChange={(e) => setOrderNotes(e.target.value)}
                          placeholder="Ex: Embalagem para presente, talheres..."
                          className="w-full px-3 py-2 text-xs border rounded-lg focus:outline-none"
                        />
                      </div>

                    </div>
                  )}

                </div>

                {/* 8.3 Footer Totals and checkout */}
                {cart.length > 0 && (
                  <div className="mt-4 border-t pt-4 space-y-3 bg-white">
                    <div className="space-y-1.5 text-xs">
                      
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Subtotal</span>
                        <span className="font-bold text-zinc-800">R$ {cartSubtotal.toFixed(2)}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-zinc-500">Taxa de Frete</span>
                        <span className="font-bold text-zinc-800">
                          {deliveryMethod === 'retirada' ? 'Grátis' : `R$ ${finalDeliveryFee.toFixed(2)}`}
                        </span>
                      </div>

                      <div className="flex justify-between text-sm pt-2 border-t font-extrabold text-brand-text">
                        <span>Total Calculado</span>
                        <span className="text-[#D98C8C] text-base">R$ {cartTotal.toFixed(2)}</span>
                      </div>

                    </div>

                    {/* Minimum warning indicator */}
                    {cartSubtotal < BUSINESS_INFO.minOrderValue && (
                      <div className="p-2 border border-yellow-200 bg-yellow-50 text-[10px] text-yellow-900 rounded-md">
                        ⚠️ O pedido mínimo da loja é de <strong>R$ {BUSINESS_INFO.minOrderValue.toFixed(2)}</strong> para entregarmos.
                      </div>
                    )}

                    {/* Submit Order action */}
                    <button
                      onClick={handleCheckoutWhatsApp}
                      disabled={!canPlaceOrder}
                      className={`w-full py-3.5 text-xs uppercase tracking-widest font-extrabold rounded-full transition-all text-center flex items-center justify-center gap-2 ${
                        canPlaceOrder 
                          ? 'bg-[#D98C8C] text-white hover:bg-[#c97b7b] shadow-lg shadow-[#D98C8C]/20' 
                          : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                      }`}
                    >
                      <Phone className="w-4 h-4 fill-current" />
                      <span>{customerName.trim() === '' ? 'Informe seu Nome acima' : 'Enviar Pedido p/ WhatsApp'}</span>
                    </button>

                    <div className="text-[10px] text-center text-zinc-400 italic">
                      Ao clicar, sua simulação será transmitida direto para o WhatsApp legítimo Migs Delícias: (11) 99107-2583.
                    </div>
                  </div>
                )}

              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
