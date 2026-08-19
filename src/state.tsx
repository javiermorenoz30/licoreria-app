import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Session } from '@supabase/supabase-js';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { CartItem, Product, Profile, supabase } from './core';

type SessionCtx = { session: Session | null; profile: Profile | null; loading: boolean; refreshProfile: () => Promise<void>; signOut: () => Promise<void> };
const SessionContext = createContext<SessionCtx | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session,setSession] = useState<Session|null>(null);
  const [profile,setProfile] = useState<Profile|null>(null);
  const [loading,setLoading] = useState(true);

  const readProfile = async (userId?: string) => {
    if (!userId) { setProfile(null); return; }
    const { data } = await supabase.from('profiles').select('*').eq('id',userId).maybeSingle();
    setProfile(data as Profile | null);
  };
  const refreshProfile = async () => readProfile(session?.user.id);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      setSession(data.session); await readProfile(data.session?.user.id); setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event,next) => {
      setSession(next); readProfile(next?.user.id).finally(()=>setLoading(false));
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  return <SessionContext.Provider value={{ session,profile,loading,refreshProfile,signOut:async()=>{await supabase.auth.signOut();setProfile(null);} }}>{children}</SessionContext.Provider>;
}
export const useSession = () => { const v=useContext(SessionContext); if(!v) throw new Error('SessionProvider missing'); return v; };

type CartCtx = { items:CartItem[]; count:number; subtotal:number; add:(p:Product)=>void; remove:(id:string)=>void; setQty:(id:string,q:number)=>void; clear:()=>void };
const CartContext = createContext<CartCtx|null>(null);
const CART_KEY='celicor_cart_v3';

export function CartProvider({ children }:{children:React.ReactNode}) {
  const [items,setItems]=useState<CartItem[]>([]);
  useEffect(()=>{ AsyncStorage.getItem(CART_KEY).then(raw=>{ if(!raw)return; try{const parsed=JSON.parse(raw); if(Array.isArray(parsed))setItems(parsed); else AsyncStorage.removeItem(CART_KEY);}catch{AsyncStorage.removeItem(CART_KEY);} }); },[]);
  useEffect(()=>{ AsyncStorage.setItem(CART_KEY,JSON.stringify(items)); },[items]);
  const add=(product:Product)=>setItems(current=>{const found=current.find(i=>i.product.id===product.id); return found?current.map(i=>i.product.id===product.id?{...i,quantity:i.quantity+1}:i):[...current,{product,quantity:1}];});
  const remove=(id:string)=>setItems(current=>current.filter(i=>i.product.id!==id));
  const setQty=(id:string,q:number)=>q<=0?remove(id):setItems(current=>current.map(i=>i.product.id===id?{...i,quantity:q}:i));
  const value=useMemo(()=>({items,count:items.reduce((s,i)=>s+i.quantity,0),subtotal:items.reduce((s,i)=>s+i.quantity*Number(i.product.price),0),add,remove,setQty,clear:()=>setItems([])}),[items]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
export const useCart=()=>{const v=useContext(CartContext);if(!v)throw new Error('CartProvider missing');return v;};
