export type Product = {
  id: string;
  brand: string;
  name: string;
  size: string;
  price: number;
  boxQty?: number | null;
  boxPrice?: number | null;
  description: string;
  category: 'Ron' | 'Whisky' | 'Vodka' | 'Tequila' | 'Vino' | 'Cerveza' | 'Otros';
  featured?: boolean;
};

export const products: Product[] = [
  { id:'st-superior-1l', brand:'Santa Teresa', name:'Superior', size:'1 L', price:4.5, boxQty:12, boxPrice:51, description:'Licor de ron seco, ideal para disfrutar puro o mezclado.', category:'Ron', featured:true },
  { id:'st-gran-reserva-075', brand:'Santa Teresa', name:'Gran Reserva', size:'750 ml', price:9, boxQty:6, boxPrice:50, description:'Ron envejecido hasta 5 años en barricas de roble.', category:'Ron', featured:true },
  { id:'st-1796', brand:'Santa Teresa', name:'Solera 1796', size:'750 ml', price:26.9, boxQty:6, boxPrice:152, description:'Ron súper premium elaborado con mezclas de rones de 4 a 35 años.', category:'Ron', featured:true },
  { id:'carupano-anejo6', brand:'Carúpano', name:'Añejo 6 Años', size:'750 ml', price:12.5, boxQty:12, boxPrice:144, description:'Añejo en barricas de roble blanco americano.', category:'Ron' },
  { id:'carupano-oro12', brand:'Carúpano', name:'Oro 12 Años', size:'750 ml', price:18.9, boxQty:12, boxPrice:216, description:'Ron con añejamiento cerrado y perfil elegante.', category:'Ron', featured:true },
  { id:'diplomatico-mantuano', brand:'Diplomático', name:'Mantuano', size:'700 ml', price:22.5, boxQty:6, boxPrice:126, description:'Mezcla de rones envejecidos hasta 8 años.', category:'Ron' },
  { id:'diplomatico-reserva', brand:'Diplomático', name:'Reserva Exclusiva', size:'700 ml', price:29.5, boxQty:6, boxPrice:170, description:'Mezcla de rones añejados hasta 12 años.', category:'Ron', featured:true },
  { id:'pampero-aniversario', brand:'Pampero', name:'Aniversario Estuche', size:'750 ml', price:23, boxQty:6, boxPrice:134, description:'Ron complejo, redondo y balanceado.', category:'Ron' },
  { id:'zacapa-23', brand:'Zacapa', name:'Zacapa 23', size:'750 ml', price:70, description:'Ron añejo premium de producción limitada.', category:'Ron', featured:true },
  { id:'roble-maestro', brand:'Roble Viejo', name:'Maestro', size:'700 ml', price:20.5, boxQty:6, boxPrice:114, description:'Ron aterciopelado, profundo y con carácter.', category:'Ron' },
  { id:'cacique-anejo', brand:'Cacique', name:'Añejo', size:'750 ml', price:10, boxQty:12, boxPrice:115, description:'Ron añejado de color dorado brillante.', category:'Ron' },
  { id:'bodega1800-12', brand:'Bodega 1800', name:'12 Años', size:'700 ml', price:14.5, boxQty:12, boxPrice:162, description:'Ron elaborado con caña venezolana y blend de 12 años mínimo.', category:'Ron' }
];

export const categories = ['Todos','Ron','Whisky','Vodka','Tequila','Vino','Cerveza','Otros'] as const;
