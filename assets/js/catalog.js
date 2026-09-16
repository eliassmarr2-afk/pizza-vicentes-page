export const siteConfig = {
  businessName: 'Pizza Vicente',
  profileImage: 'https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=400&q=80',
  coverImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1400&q=80',
  promoBanner: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1400&q=80',
  defaultEtaMinutes: 45,
  registerBenefit: '$7.000 OFF por registrarte',
  tabs: [
    { id: 'combos', label: 'Combos', layout: 'featured' },
    { id: 'pizzas', label: 'Pizzas', layout: 'featured' },
    { id: 'empanadas', label: 'Empanadas', layout: 'featured' },
    { id: 'bebidas', label: 'Bebidas', layout: 'compact' },
    { id: 'postres', label: 'Postres', layout: 'compact' }
  ]
};

export const products = [
  {
    id: 'combo-satisfaccion',
    type: 'offer',
    tab: 'combos',
    title: 'Combo Satisfacción 100%',
    subtitle: '1 Pizza + 2 Fainá + 6 Empanadas + 1 Gaseosa',
    description: 'Una combinación completa para compartir.',
    price: 22400,
    compareAtPrice: 27900,
    badges: ['MEJOR OFERTA', 'LLEGA EN 45 MINUTOS'],
    images: [
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=1200&q=80'
    ],
    enabledSections: ['extras', 'desserts']
  },
  {
    id: 'pizza-calabresa',
    type: 'product',
    tab: 'pizzas',
    title: 'Pizza de Calabresa',
    subtitle: 'Muzzarella, calabresa y aceitunas',
    description: 'Pizza grande de masa clásica, horneada al momento.',
    price: 12900,
    compareAtPrice: 14900,
    badges: ['MÁS VENDIDO', 'LLEGA EN 45 MINUTOS'],
    images: [
      'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=1200&q=80'
    ],
    matchingOfferId: 'combo-satisfaccion',
    enabledSections: ['matchingOffer', 'extras', 'desserts']
  },
  {
    id: 'pizza-muzzarella',
    type: 'product',
    tab: 'pizzas',
    title: 'Pizza de Muzzarella',
    subtitle: 'Muzzarella, salsa de tomate y aceitunas',
    description: 'Un clásico de la casa.',
    price: 10900,
    badges: ['CLÁSICA'],
    images: ['https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80'],
    enabledSections: ['extras', 'desserts']
  },
  {
    id: 'empanadas-docena',
    type: 'product',
    tab: 'empanadas',
    title: 'Docena de Empanadas',
    subtitle: 'Elegí tus gustos favoritos',
    description: '12 empanadas horneadas.',
    price: 15800,
    badges: ['IDEAL PARA COMPARTIR'],
    images: ['https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=80'],
    enabledSections: ['extras', 'desserts']
  },
  {
    id: 'coca-cola-15',
    type: 'product',
    tab: 'bebidas',
    title: 'Coca-Cola 1,5 L',
    subtitle: 'Bien fría',
    description: 'Bebida gaseosa.',
    price: 4200,
    badges: [],
    images: ['https://images.unsplash.com/photo-1629203851122-3726ecdf080e?auto=format&fit=crop&w=900&q=80'],
    enabledSections: []
  },
  {
    id: 'agua-15',
    type: 'product',
    tab: 'bebidas',
    title: 'Agua mineral 1,5 L',
    subtitle: 'Sin gas',
    description: 'Agua mineral.',
    price: 2800,
    badges: [],
    images: ['https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=900&q=80'],
    enabledSections: []
  },
  {
    id: 'chocotorta',
    type: 'product',
    tab: 'postres',
    title: 'Chocotorta en bandeja',
    subtitle: '250 g · acompañá tu comida con un postre delicioso',
    description: 'Postre frío con capas de galletitas y crema.',
    price: 6890,
    badges: ['RECOMENDADO'],
    images: ['https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=80'],
    enabledSections: []
  },
  {
    id: 'flan-casero',
    type: 'product',
    tab: 'postres',
    title: 'Flan casero',
    subtitle: 'Con dulce de leche',
    description: 'Porción individual.',
    price: 5200,
    badges: [],
    images: ['https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=900&q=80'],
    enabledSections: []
  }
];

export const extras = [
  { id: 'extra-queso', title: 'Extra queso', subtitle: 'Más muzzarella', price: 1900 },
  { id: 'faina', title: 'Fainá x1', subtitle: 'Porción individual', price: 1200 },
  { id: 'coca-cola-15', title: 'Coca-Cola 1,5 L', subtitle: 'Bien fría', price: 4200 }
];

export const desserts = products.filter((item) => item.tab === 'postres').slice(0, 3);

export const formatARS = (value) => new Intl.NumberFormat('es-AR', {
  style: 'currency', currency: 'ARS', maximumFractionDigits: 0
}).format(value);

export const getProduct = (id) => products.find((item) => item.id === id) || products[0];
export const getProductsByTab = (tab) => products.filter((item) => item.tab === tab);
