import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, Platform } from 'react-native';
import { createClient, processLock } from '@supabase/supabase-js';

export const colors = {
  navy: '#061C4B', navy2: '#0B2D6B', orange: '#F4A000', bg: '#F6F7FB', card: '#FFFFFF',
  text: '#111827', muted: '#6B7280', line: '#E5E7EB', green: '#159A61', red: '#DC3F45', white: '#FFFFFF'
};

export const store = {
  name: 'CELICOR La Castellana',
  address: 'Av. Blandín con Calle Mata de Coco, La Castellana, Caracas',
  whatsapp: '584242583500',
  phone: '+582122634948',
  currency: 'USD'
};

export type Role = 'customer' | 'admin' | 'staff' | 'driver';
export type Category = { id: string; name: string; slug: string; emoji: string; active?: boolean };
export type Product = {
  id: string; category_id?: string | null; brand?: string | null; name: string; slug?: string;
  description?: string | null; size?: string | null; image_url?: string | null; price: number;
  box_qty?: number | null; box_price?: number | null; stock: number; featured?: boolean; active?: boolean;
};
export type Profile = { id: string; email?: string | null; full_name?: string | null; phone?: string | null; role: Role; active: boolean };
export type PaymentLink = { id: string; label: string; provider: string; url: string; instructions?: string | null; active: boolean };
export type CartItem = { product: Product; quantity: number };

const SUPABASE_URL = 'https://uhggdsdsjmaffzuvhhim.supabase.co';
const SUPABASE_KEY = 'sb_publishable_nA55kOTI3p3qHl1Yb8xTAg_rJstvucj';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    ...(Platform.OS !== 'web' ? { storage: AsyncStorage } : {}),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    lock: processLock
  }
});

if (Platform.OS !== 'web') {
  AppState.addEventListener('change', state => {
    if (state === 'active') supabase.auth.startAutoRefresh();
    else supabase.auth.stopAutoRefresh();
  });
}

export const money = (value: number | string | null | undefined) => `$${Number(value || 0).toFixed(2)}`;
export const isUuid = (value: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);

export const fallbackCategories: Category[] = [
  { id:'cat-ron', name:'Ron', slug:'ron', emoji:'🥃' }, { id:'cat-whisky', name:'Whisky', slug:'whisky', emoji:'🥃' },
  { id:'cat-vino', name:'Vino', slug:'vino', emoji:'🍷' }, { id:'cat-cerveza', name:'Cerveza', slug:'cerveza', emoji:'🍺' },
  { id:'cat-tequila', name:'Tequila', slug:'tequila', emoji:'🌵' }, { id:'cat-vodka', name:'Vodka', slug:'vodka', emoji:'🍸' },
  { id:'cat-esp', name:'Espumantes', slug:'espumantes', emoji:'🥂' }, { id:'cat-mix', name:'Mixers', slug:'mixers-snacks', emoji:'🧊' }
];

export const fallbackProducts: Product[] = [
  { id:'demo-1', category_id:'cat-ron', brand:'Santa Teresa', name:'Superior 1 Litro', size:'1 L', price:4.5, box_qty:12, box_price:51, stock:24, featured:true, description:'Licor de ron seco, perfecto para disfrutar puro o mezclado.' },
  { id:'demo-2', category_id:'cat-ron', brand:'Santa Teresa', name:'Carta Roja 1 Litro', size:'1 L', price:5.5, box_qty:12, box_price:60, stock:24, description:'Licor de ron seco de color rojizo con aroma a madera.' },
  { id:'demo-3', category_id:'cat-ron', brand:'Santa Teresa', name:'Gran Reserva', size:'0,75 L', price:9, box_qty:6, box_price:50, stock:18, featured:true, description:'Ron envejecido hasta 5 años en barricas de roble.' },
  { id:'demo-4', category_id:'cat-ron', brand:'Santa Teresa', name:'Linaje', size:'0,70 L', price:14.95, box_qty:6, box_price:82, stock:12, featured:true, description:'Ron premium de mezclas de rones añejos de primera calidad.' },
  { id:'demo-5', category_id:'cat-ron', brand:'Santa Teresa', name:'Solera 1796', size:'0,75 L', price:26.9, box_qty:6, box_price:152, stock:12, featured:true, description:'Ron súper premium envejecido mediante el proceso Solera.' },
  { id:'demo-6', category_id:'cat-ron', brand:'Carúpano', name:'Carúpano Extra', size:'1 L', price:6, box_qty:12, box_price:65, stock:24, description:'Licor seco elaborado con ron envejecido en roble blanco americano.' },
  { id:'demo-7', category_id:'cat-ron', brand:'Carúpano', name:'Añejo 6 Años', size:'0,75 L', price:12.5, box_qty:12, box_price:144, stock:18, featured:true, description:'Ron con añejamiento cerrado en barricas de roble blanco americano.' },
  { id:'demo-8', category_id:'cat-ron', brand:'Carúpano', name:'Oro 12 Años', size:'0,75 L', price:18.9, box_qty:12, box_price:216, stock:12, featured:true, description:'Ron con añejamiento cerrado y madres de reservas especiales.' }
];

export async function loadCatalog() {
  const [catRes, productRes] = await Promise.all([
    supabase.from('categories').select('*').eq('active', true).order('sort_order'),
    supabase.from('products').select('*').eq('active', true).order('featured', { ascending:false }).order('name')
  ]);
  return {
    categories: catRes.data?.length ? catRes.data as Category[] : fallbackCategories,
    products: productRes.data?.length ? productRes.data as Product[] : fallbackProducts,
    demo: !productRes.data?.length
  };
}
