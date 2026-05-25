import { Product, Review, BusinessInfo } from './types';

export const BUSINESS_INFO: BusinessInfo = {
  name: "Migs Delícias",
  phone: "5511991072583", // Real WhatsApp from flyer
  address: "Doce que encanta, sabor que fica! • São Paulo - SP",
  deliveryFee: 7.00,
  minOrderValue: 20.00,
  instagram: "@migs_delicias",
  workingHours: {
    weekdays: "Segunda a Sexta: 09h às 19h",
    weekends: "Sábados e Feriados: 10h às 17h"
  }
};

export const PRODUCTS: Product[] = [
  // 1. DOCES (sweets)
  {
    id: "doce-1",
    name: "Brigadeiro Belga Gourmet",
    description: "Feito com chocolate belga legítimo 54% cacau, granulado split Callebaut e muita cremosidade.",
    price: 4.50,
    category: "doces",
    unit: "unidade",
    image: "https://images.unsplash.com/photo-1541795795328-f073b763494e?auto=format&fit=crop&q=80&w=600",
    featured: true
  },
  {
    id: "doce-2",
    name: "Coxinha de Morango",
    description: "Um morango fresco e gigante envolto em nosso brigadeiro de leite ninho cremoso e casquinha de chocolate.",
    price: 8.50,
    category: "doces",
    unit: "unidade",
    image: "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&q=80&w=600",
    featured: true
  },
  {
    id: "doce-3",
    name: "Brownie Supremo Ninho & Nutella",
    description: "Molhadinho por dentro, casquinha crocante por fora, generosa camada de creme de leite ninho e Nutella legítima.",
    price: 11.00,
    category: "doces",
    unit: "unidade",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=600",
    featured: false
  },
  {
    id: "doce-4",
    name: "Cento de Brigadeiros Tradicionais",
    description: "Perfeito para festas! 100 brigadeiros enrolados na hora para garantir o frescor absoluto.",
    price: 120.00,
    category: "doces",
    unit: "cento (100 un)",
    image: "https://images.unsplash.com/photo-1559181567-c3190ca9959b?auto=format&fit=crop&q=80&w=600",
    featured: false
  },

  // 2. MINI TORTAS (mini pies)
  {
    id: "torta-1",
    name: "Mini Torta de Limão",
    description: "Casquinha de biscoito amanteigado, recheio cremoso e azedinho de limão siciliano, coberta com merengue suíço maçaricado.",
    price: 12.90,
    category: "minis_tortas",
    unit: "unidade",
    image: "https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&q=80&w=600",
    featured: true
  },
  {
    id: "torta-2",
    name: "Mini Banoffee Pie",
    description: "Base crocante, doce de leite artesanal cozido lentamente, bananas frescas em rodelas e chantilly polvilhado com cacau.",
    price: 14.00,
    category: "minis_tortas",
    unit: "unidade",
    image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&q=80&w=600",
    featured: true
  },
  {
    id: "torta-3",
    name: "Mini Torta Holandesa",
    description: "Creme leve de baunilha, base de biscoito e cobertura espelhada de ganache de chocolate meio amargo, finalizada com biscoito Calipso.",
    price: 13.50,
    category: "minis_tortas",
    unit: "unidade",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=600", // fallback brownie/cake-like visual
    featured: false
  },

  // 3. BOLOS CASEIROS (homemade cakes)
  {
    id: "bolo-1",
    name: "Bolo de Cenoura Vulcão",
    description: "Aquele clássico! Massa super fofinha de cenoura com cobertura transbordante de calda quente de chocolate.",
    price: 29.90,
    category: "bolos_caseiros",
    unit: "unidade",
    image: "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&q=80&w=600",
    featured: true
  },
  {
    id: "bolo-2",
    name: "Bolo de Fubá com Goiabada",
    description: "Receita de vó! Massa de milho ultra úmida, salpicada com generosos cubos de goiabada cascão derretida por dentro e por fora.",
    price: 24.90,
    category: "bolos_caseiros",
    unit: "unidade",
    image: "https://images.unsplash.com/photo-1586985289688-ca9cf499150a?auto=format&fit=crop&q=80&w=600",
    featured: false
  },
  {
    id: "bolo-3",
    name: "Bolo Vulcão Ninho & Morangos",
    description: "Bolo branco fofinho, preenchido no centro com brigadeiro cremoso de leite ninho e morangos frescos picados por cima.",
    price: 36.00,
    category: "bolos_caseiros",
    unit: "unidade",
    image: "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&q=80&w=600", // placeholder
    featured: false
  },

  // 4. SALGADOS FRITOS (fried savories)
  {
    id: "salgado-1",
    name: "Coxinha de Frango com Catupiry",
    description: "A queridinha do Brasil! Massa de batata macia, recheio de frango caipira super desfiado, Catupiry original e casquinha ultra crocante.",
    price: 7.50,
    category: "salgados_fritos",
    unit: "unidade grande",
    image: "https://images.unsplash.com/photo-1585325701956-60dd9c8553bc?auto=format&fit=crop&q=80&w=600",
    featured: true
  },
  {
    id: "salgado-2",
    name: "Bolinha de Queijo Suprema",
    description: "Derrete na boca! Uma mistura de queijos selecionados que criam o puxa-puxa perfeito no primeiro dente.",
    price: 7.00,
    category: "salgados_fritos",
    unit: "unidade grande",
    image: "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&q=80&w=600",
    featured: false
  },
  {
    id: "salgado-3",
    name: "Cento de Salgadinhos Fritos",
    description: "Sortidos ou de um único sabor (Coxinhas, Bolinhas de Queijo, Risoles). Fritos na hora de retirar.",
    price: 95.00,
    category: "salgados_fritos",
    unit: "cento (100 un)",
    image: "https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?auto=format&fit=crop&q=80&w=600",
    featured: true
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: "rev-1",
    name: "Mariana Souza",
    rating: 5,
    comment: "A coxinha de morango é simplesmente de outro planeta! Morango doce e fresquinho, com uma quantidade perfeita de brigadeiro. Fiquei fã e sempre peço!",
    date: "Há 2 dias",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"
  },
  {
    id: "rev-2",
    name: "Thiago Oliveira",
    rating: 5,
    comment: "Salgados fritos na perfeição, sequinhos e super crocantes. A bolinha de queijo realmente derrete na boca. Recomendo muito o cento de salgados para festas!",
    date: "Há 1 semana",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150"
  },
  {
    id: "rev-3",
    name: "Aline Santos",
    rating: 5,
    comment: "Eu encomendei o Bolo de Cenoura Vulcão e foi a atração do café da tarde de aniversário do meu irmão. Veio quentinho e transbordando chocolate!",
    date: "Há 2 semanas",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150"
  }
];
