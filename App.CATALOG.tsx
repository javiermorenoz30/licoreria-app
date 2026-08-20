import React, { useEffect, useState } from 'react';
import { Alert, Linking, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { initialProducts, type Product } from './catalog';

const C={navy:'#071A3D',orange:'#F5A000',bg:'#F5F7FB',white:'#FFFFFF',text:'#101828',muted:'#667085',line:'#E4E7EC',green:'#0E9F6E',red:'#D92D20'};
const STORAGE_KEY='celicor_v4';
const LEGACY_KEYS=['celicor_v3','celicor_v2'];

type Payment={id:string;name:string;url:string;enabled:boolean};
type Cart=Record<string,number>;
type OrderItem={id:string;name:string;qty:number;price:number};
type Order={id:string;items:OrderItem[];total:number;status:string;driver:string;createdAt:string};

const initialPayments:Payment[]=[
 {id:'p1',name:'Pago móvil',url:'https://example.com/pago-movil',enabled:true},
 {id:'p2',name:'Zelle',url:'https://example.com/zelle',enabled:true},
 {id:'p3',name:'Transferencia',url:'https://example.com/transferencia',enabled:true},
];

const money=(value:number)=>`$${value.toFixed(2)}`;
const priceText=(value:number|null)=>value==null?'Precio por consultar':money(value);
const parseNumber=(value:string)=>Number(value.replace(',','.'));

export default function App(){
 const [age,setAge]=useState(false);
 const [screen,setScreen]=useState('home');
 const [products,setProducts]=useState<Product[]>(initialProducts);
 const [cart,setCart]=useState<Cart>({});
 const [orders,setOrders]=useState<Order[]>([]);
 const [payments,setPayments]=useState<Payment[]>(initialPayments);
 const [query,setQuery]=useState('');
 const [selected,setSelected]=useState<Product|null>(null);

 useEffect(()=>{(async()=>{
  try{
   const raw=await AsyncStorage.getItem(STORAGE_KEY);
   if(raw){
    const state=JSON.parse(raw);
    setAge(!!state.age);
    if(Array.isArray(state.products))setProducts(state.products);
    if(state.cart)setCart(state.cart);
    if(Array.isArray(state.orders))setOrders(state.orders);
    if(Array.isArray(state.payments))setPayments(state.payments);
    return;
   }
   for(const key of LEGACY_KEYS){
    const legacy=await AsyncStorage.getItem(key);
    if(!legacy)continue;
    const state=JSON.parse(legacy);
    setAge(!!state.age);
    if(Array.isArray(state.orders))setOrders(state.orders);
    if(Array.isArray(state.payments))setPayments(state.payments);
    break;
   }
   setProducts(initialProducts);
   setCart({});
  }catch{
   setProducts(initialProducts);
  }
 })()},[]);

 useEffect(()=>{
  AsyncStorage.setItem(STORAGE_KEY,JSON.stringify({age,products,cart,orders,payments})).catch(()=>{});
 },[age,products,cart,orders,payments]);

 const count=Object.values(cart).reduce((a,b)=>a+b,0);
 const subtotal=products.reduce((sum,p)=>sum+(cart[p.id]||0)*(p.price??0),0);
 const filtered=products.filter(p=>(`${p.brand} ${p.name} ${p.category} ${p.description}`).toLowerCase().includes(query.toLowerCase()));

 const add=(id:string)=>{
  const product=products.find(p=>p.id===id);
  if(!product||product.price==null)return Alert.alert('Precio por consultar','Este producto no tiene precio publicado en el catálogo.');
  setCart(current=>({...current,[id]:(current[id]||0)+1}));
 };
 const change=(id:string,delta:number)=>setCart(current=>{
  const next=Math.max(0,(current[id]||0)+delta);
  const copy={...current,[id]:next};
  if(!next)delete copy[id];
  return copy;
 });
 const createOrder=()=>{
  if(!count)return;
  const id='CEL-'+String(Date.now()).slice(-6);
  const items:OrderItem[]=products.filter(p=>cart[p.id]&&p.price!=null).map(p=>({id:p.id,name:p.name,qty:cart[p.id],price:p.price as number}));
  setOrders(current=>[{id,items,total:subtotal,status:'Nuevo',driver:'Sin asignar',createdAt:new Date().toISOString()},...current]);
  setCart({});
  setScreen('orders');
  Alert.alert('Pedido creado',`Pedido ${id} por ${money(subtotal)}`);
 };

 if(!age)return <SafeAreaView style={s.age}><StatusBar style="light"/><View><Text style={s.brand}>CELICOR</Text><Text style={s.brandSub}>LA CASTELLANA</Text></View><View style={s.ageCard}><Text style={s.age18}>18+</Text><Text style={s.h1}>Antes de comprar</Text><Text style={s.bodyCenter}>Debes tener la edad legal requerida para comprar bebidas alcohólicas.</Text><Btn title="CONFIRMO QUE SOY MAYOR DE EDAD" onPress={()=>setAge(true)}/></View><Text style={s.legal}>Disfruta responsablemente.</Text></SafeAreaView>;

 const Home=()=> <ScrollView style={s.page} contentContainerStyle={{paddingBottom:120}}>
  <View style={s.hero}><Text style={s.heroMini}>📍 Entrega en La Castellana</Text><Text style={s.heroTitle}>¿Qué vas a brindar hoy?</Text><Text style={s.heroText}>{products.length} productos cargados en el catálogo.</Text></View>
  <TextInput value={query} onChangeText={setQuery} placeholder="Buscar producto o marca..." placeholderTextColor="#98A2B3" style={s.search}/>
  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.chips}>{['Todos','Santa Teresa','Carúpano','Diplomático','Pampero','Cacique','Ron'].map(x=><Pressable key={x} onPress={()=>setQuery(x==='Todos'?'':x)} style={s.chip}><Text style={s.chipText}>{x}</Text></Pressable>)}</ScrollView>
  <View style={s.promo}><View><Text style={s.promoTag}>CATÁLOGO CELICOR</Text><Text style={s.promoTitle}>Venta al mayor y al detal.</Text><Text style={s.promoText}>Precios unitarios y por caja según el catálogo.</Text></View><Text style={{fontSize:54}}>🥃</Text></View>
  <Text style={s.section}>Productos ({filtered.length})</Text>
  <View style={s.grid}>{filtered.map(p=><Pressable key={p.id} style={s.card} onPress={()=>{setSelected(p);setScreen('product')}}>
   <View style={s.bottle}><Text style={{fontSize:52}}>{p.emoji}</Text></View>
   <Text style={s.category}>{p.brand} · {p.category}</Text>
   <Text style={s.productName}>{p.name}</Text>
   <Text style={s.unitLabel}>Unidad · {priceText(p.price)}</Text>
   {p.boxPrice!=null&&p.boxQty!=null&&<Text style={s.boxLabel}>Caja {p.boxQty} uds · {money(p.boxPrice)}</Text>}
   <View style={s.priceRow}><Text style={s.price}>{priceText(p.price)}</Text><Pressable style={[s.plus,p.price==null&&s.plusDisabled]} onPress={()=>add(p.id)}><Text style={s.plusText}>{p.price==null?'?':'+'}</Text></Pressable></View>
  </Pressable>)}</View>
 </ScrollView>;

 const Product=()=>selected?<ScrollView style={s.page} contentContainerStyle={{padding:20,paddingBottom:120}}>
  <Pressable onPress={()=>setScreen('home')}><Text style={s.back}>‹ Volver</Text></Pressable>
  <View style={s.productHero}><Text style={{fontSize:100}}>{selected.emoji}</Text></View>
  <Text style={s.category}>{selected.brand} · {selected.category}</Text>
  <Text style={s.productTitle}>{selected.name}</Text>
  <Text style={s.productPrice}>{priceText(selected.price)} {selected.price!=null&&<Text style={s.unitSuffix}>/ unidad</Text>}</Text>
  {selected.boxPrice!=null&&selected.boxQty!=null&&<View style={s.boxPriceCard}><Text style={s.boxPriceTitle}>Precio por caja</Text><Text style={s.boxPriceValue}>{selected.boxQty} unidades · {money(selected.boxPrice)}</Text></View>}
  <Text style={s.body}>{selected.description}</Text>
  <Text style={s.availability}>{selected.stock==null?'Disponibilidad por confirmar':selected.stock>0?`Stock: ${selected.stock} unidades`:'Agotado'}</Text>
  <Btn title={selected.price==null?'PRECIO POR CONSULTAR':'AGREGAR UNIDAD AL CARRITO'} onPress={()=>add(selected.id)}/>
 </ScrollView>:null;

 const CartView=()=> <ScrollView style={s.page} contentContainerStyle={{padding:20,paddingBottom:120}}>
  <Text style={s.h1}>Tu carrito</Text>
  {count===0?<Empty icon="🛒" title="Tu carrito está vacío"/>:products.filter(p=>cart[p.id]).map(p=><View key={p.id} style={s.cartRow}>
   <View style={s.cartEmoji}><Text style={{fontSize:30}}>{p.emoji}</Text></View>
   <View style={{flex:1}}><Text style={s.productName}>{p.name}</Text><Text style={s.price}>{p.price==null?'Consultar':`${money(p.price)} / unidad`}</Text></View>
   <View style={s.qty}><Pressable onPress={()=>change(p.id,-1)}><Text style={s.qtyBtn}>−</Text></Pressable><Text style={s.qtyNum}>{cart[p.id]}</Text><Pressable onPress={()=>change(p.id,1)}><Text style={s.qtyBtn}>+</Text></Pressable></View>
  </View>)}
  {count>0&&<><View style={s.total}><Text style={s.body}>Subtotal</Text><Text style={s.totalPrice}>{money(subtotal)}</Text></View><Btn title="CONTINUAR AL CHECKOUT" onPress={()=>setScreen('checkout')}/></>}
 </ScrollView>;

 const Checkout=()=> <ScrollView style={s.page} contentContainerStyle={{padding:20,paddingBottom:120}}>
  <Text style={s.h1}>Checkout</Text><Text style={s.label}>Entrega</Text>
  <View style={s.option}><Text style={s.optionTitle}>🛵 Delivery</Text><Text style={s.muted}>La Castellana y zonas configuradas</Text></View>
  <Text style={s.label}>Método de pago</Text>
  {payments.filter(p=>p.enabled).map(p=><Pressable key={p.id} style={s.option} onPress={()=>Linking.openURL(p.url).catch(()=>Alert.alert('Enlace inválido'))}><Text style={s.optionTitle}>🔗 {p.name}</Text><Text style={s.muted}>Abrir enlace de pago</Text></Pressable>)}
  <View style={s.total}><Text style={s.body}>Total</Text><Text style={s.totalPrice}>{money(subtotal)}</Text></View><Btn title="CREAR PEDIDO" onPress={createOrder}/>
 </ScrollView>;

 const Orders=()=> <ScrollView style={s.page} contentContainerStyle={{padding:20,paddingBottom:120}}>
  <Text style={s.h1}>Pedidos</Text>{orders.length===0?<Empty icon="📦" title="Aún no hay pedidos"/>:orders.map(o=><View key={o.id} style={s.order}><View style={s.orderTop}><Text style={s.orderId}>{o.id}</Text><Text style={s.badge}>{o.status}</Text></View><Text style={s.muted}>{o.items.map(i=>`${i.qty}× ${i.name}`).join(' · ')}</Text><Text style={s.price}>{money(o.total)}</Text></View>)}
 </ScrollView>;

 const Admin=()=> <ScrollView style={s.page} contentContainerStyle={{padding:20,paddingBottom:120}}>
  <Text style={s.h1}>Administración</Text><Text style={s.muted}>CELICOR La Castellana</Text>
  <View style={s.stats}><Stat n={products.length} t="Productos"/><Stat n={products.filter(p=>p.stock!=null).length} t="Con stock"/><Stat n={orders.length} t="Pedidos"/></View>
  <AdminTile icon="📦" title="Productos e inventario" text="Descripción, precio unitario, caja y stock" onPress={()=>setScreen('admin-products')}/>
  <AdminTile icon="💳" title="Enlaces de pago" text="Pago móvil, Zelle, transferencia y otros" onPress={()=>setScreen('admin-payments')}/>
  <AdminTile icon="🛵" title="Delivery y repartidores" text="Asignar y actualizar entregas" onPress={()=>setScreen('driver')}/>
  <AdminTile icon="🧾" title="Pedidos" text="Gestionar estados de venta" onPress={()=>setScreen('orders')}/>
 </ScrollView>;

 const content=screen==='home'?<Home/>:screen==='product'?<Product/>:screen==='cart'?<CartView/>:screen==='checkout'?<Checkout/>:screen==='orders'?<Orders/>:screen==='admin'?<Admin/>:screen==='admin-products'?<ProductAdmin products={products} setProducts={setProducts} back={()=>setScreen('admin')}/>:screen==='admin-payments'?<PaymentAdmin payments={payments} setPayments={setPayments} back={()=>setScreen('admin')}/>:screen==='driver'?<DriverView orders={orders} setOrders={setOrders} back={()=>setScreen('admin')}/>:<Home/>;

 return <SafeAreaView style={s.root}><StatusBar style="dark"/>{content}{!['product','checkout','admin-products','admin-payments','driver'].includes(screen)&&<View style={s.nav}><Nav icon="🏠" label="Inicio" active={screen==='home'} onPress={()=>setScreen('home')}/><Nav icon="🧾" label="Pedidos" active={screen==='orders'} onPress={()=>setScreen('orders')}/><Nav icon="🛒" label={`Carrito${count?` (${count})`:''}`} active={screen==='cart'} onPress={()=>setScreen('cart')}/><Nav icon="⚙️" label="Admin" active={screen==='admin'} onPress={()=>setScreen('admin')}/></View>}</SafeAreaView>;
}

function Btn({title,onPress}:{title:string;onPress:()=>void}){return <Pressable style={s.button} onPress={onPress}><Text style={s.buttonText}>{title}</Text></Pressable>}
function Nav({icon,label,active,onPress}:{icon:string;label:string;active:boolean;onPress:()=>void}){return <Pressable style={s.navItem} onPress={onPress}><Text style={{fontSize:21}}>{icon}</Text><Text style={[s.navText,active&&s.navActive]}>{label}</Text></Pressable>}
function Empty({icon,title}:{icon:string;title:string}){return <View style={s.empty}><Text style={{fontSize:48}}>{icon}</Text><Text style={s.optionTitle}>{title}</Text></View>}
function Stat({n,t}:{n:number;t:string}){return <View style={s.stat}><Text style={s.statN}>{n}</Text><Text style={s.muted}>{t}</Text></View>}
function AdminTile({icon,title,text,onPress}:{icon:string;title:string;text:string;onPress:()=>void}){return <Pressable style={s.adminTile} onPress={onPress}><Text style={{fontSize:32}}>{icon}</Text><View style={{flex:1}}><Text style={s.optionTitle}>{title}</Text><Text style={s.muted}>{text}</Text></View><Text style={s.chev}>›</Text></Pressable>}

function ProductAdmin({products,setProducts,back}:{products:Product[];setProducts:React.Dispatch<React.SetStateAction<Product[]>>;back:()=>void}){
 const [name,setName]=useState('');const [brand,setBrand]=useState('');const [category,setCategory]=useState('Ron');const [description,setDescription]=useState('');const [price,setPrice]=useState('');const [boxQty,setBoxQty]=useState('');const [boxPrice,setBoxPrice]=useState('');const [stock,setStock]=useState('');
 const addProduct=()=>{
  const unitPrice=price?parseNumber(price):null;
  if(!name||!brand)return Alert.alert('Faltan datos','Agrega marca y nombre.');
  if(price&&Number.isNaN(unitPrice))return Alert.alert('Precio inválido');
  const qty=boxQty?Number(boxQty):null;const wholesale=boxPrice?parseNumber(boxPrice):null;const stockValue=stock?Number(stock):null;
  setProducts(current=>[{id:String(Date.now()),brand,name,category,description:description||'Sin descripción.',price:unitPrice,boxQty:qty,boxPrice:wholesale,stock:stockValue,emoji:'🥃'},...current]);
  setName('');setBrand('');setDescription('');setPrice('');setBoxQty('');setBoxPrice('');setStock('');
 };
 const changeStock=(id:string,delta:number)=>setProducts(current=>current.map(p=>p.id===id?{...p,stock:Math.max(0,(p.stock??0)+delta)}:p));
 return <ScrollView style={s.page} contentContainerStyle={{padding:20,paddingBottom:80}}>
  <Pressable onPress={back}><Text style={s.back}>‹ Administración</Text></Pressable><Text style={s.h1}>Productos e inventario</Text><Text style={s.muted}>{products.length} productos cargados</Text>
  <TextInput style={s.input} placeholder="Marca" value={brand} onChangeText={setBrand}/><TextInput style={s.input} placeholder="Nombre del producto" value={name} onChangeText={setName}/><TextInput style={s.input} placeholder="Categoría" value={category} onChangeText={setCategory}/><TextInput style={[s.input,s.multiline]} multiline placeholder="Descripción" value={description} onChangeText={setDescription}/><TextInput style={s.input} placeholder="Precio por unidad (opcional)" keyboardType="decimal-pad" value={price} onChangeText={setPrice}/><TextInput style={s.input} placeholder="Unidades por caja (opcional)" keyboardType="number-pad" value={boxQty} onChangeText={setBoxQty}/><TextInput style={s.input} placeholder="Precio por caja (opcional)" keyboardType="decimal-pad" value={boxPrice} onChangeText={setBoxPrice}/><TextInput style={s.input} placeholder="Stock disponible (opcional)" keyboardType="number-pad" value={stock} onChangeText={setStock}/><Btn title="AGREGAR PRODUCTO" onPress={addProduct}/>
  {products.map(p=><View style={s.adminRow} key={p.id}><Text style={{fontSize:28}}>{p.emoji}</Text><View style={{flex:1}}><Text style={s.productName}>{p.brand} · {p.name}</Text><Text style={s.muted}>Unidad {priceText(p.price)}{p.boxPrice!=null&&p.boxQty!=null?` · Caja ${p.boxQty}: ${money(p.boxPrice)}`:''}</Text><View style={s.stockRow}><Text style={s.muted}>{p.stock==null?'Stock por cargar':`Stock ${p.stock}`}</Text><Pressable onPress={()=>changeStock(p.id,-1)} style={s.stockBtn}><Text style={s.stockBtnText}>−</Text></Pressable><Pressable onPress={()=>changeStock(p.id,1)} style={s.stockBtn}><Text style={s.stockBtnText}>+</Text></Pressable></View></View><Pressable onPress={()=>setProducts(current=>current.filter(i=>i.id!==p.id))}><Text style={{color:C.red,fontWeight:'900'}}>Eliminar</Text></Pressable></View>)}
 </ScrollView>;
}

function PaymentAdmin({payments,setPayments,back}:{payments:Payment[];setPayments:React.Dispatch<React.SetStateAction<Payment[]>>;back:()=>void}){
 const [name,setName]=useState('');const [url,setUrl]=useState('');
 const add=()=>{if(!name||!url)return;setPayments(current=>[...current,{id:String(Date.now()),name,url,enabled:true}]);setName('');setUrl('')};
 return <ScrollView style={s.page} contentContainerStyle={{padding:20}}><Pressable onPress={back}><Text style={s.back}>‹ Administración</Text></Pressable><Text style={s.h1}>Enlaces de pago</Text><TextInput style={s.input} placeholder="Nombre: Pago móvil, Binance..." value={name} onChangeText={setName}/><TextInput style={s.input} placeholder="https://..." autoCapitalize="none" value={url} onChangeText={setUrl}/><Btn title="AGREGAR ENLACE" onPress={add}/>{payments.map(p=><View style={s.adminRow} key={p.id}><View style={{flex:1}}><Text style={s.productName}>{p.name}</Text><Text numberOfLines={1} style={s.muted}>{p.url}</Text></View><Pressable onPress={()=>setPayments(current=>current.map(i=>i.id===p.id?{...i,enabled:!i.enabled}:i))}><Text style={{fontWeight:'900',color:p.enabled?C.green:C.muted}}>{p.enabled?'Activo':'Oculto'}</Text></Pressable></View>)}</ScrollView>;
}

function DriverView({orders,setOrders,back}:{orders:Order[];setOrders:React.Dispatch<React.SetStateAction<Order[]>>;back:()=>void}){
 const next=(status:string)=>status==='Nuevo'?'Preparando':status==='Preparando'?'En camino':status==='En camino'?'Entregado':'Entregado';
 return <ScrollView style={s.page} contentContainerStyle={{padding:20}}><Pressable onPress={back}><Text style={s.back}>‹ Administración</Text></Pressable><Text style={s.h1}>Delivery</Text><Text style={s.muted}>Vista para repartidores y despacho.</Text>{orders.length===0?<Empty icon="🛵" title="No hay entregas"/>:orders.map(o=><View style={s.order} key={o.id}><View style={s.orderTop}><Text style={s.orderId}>{o.id}</Text><Text style={s.badge}>{o.status}</Text></View><Text style={s.muted}>Repartidor: {o.driver}</Text>{o.status!=='Entregado'&&<Btn title={`MARCAR: ${next(o.status).toUpperCase()}`} onPress={()=>setOrders(current=>current.map(i=>i.id===o.id?{...i,status:next(i.status),driver:i.driver==='Sin asignar'?'Repartidor CELICOR':i.driver}:i))}/>}</View>)}</ScrollView>;
}

const s=StyleSheet.create({
 root:{flex:1,backgroundColor:C.bg},page:{flex:1,backgroundColor:C.bg},
 hero:{backgroundColor:C.navy,padding:22,paddingTop:28,paddingBottom:28,borderBottomLeftRadius:28,borderBottomRightRadius:28},heroMini:{color:'#B8C7E5',fontWeight:'700',marginBottom:12},heroTitle:{color:C.white,fontWeight:'900',fontSize:30},heroText:{color:'#D4DCEC',marginTop:7,fontSize:14},
 search:{backgroundColor:C.white,margin:18,borderRadius:18,paddingHorizontal:18,paddingVertical:15,fontSize:16,borderWidth:1,borderColor:C.line},chips:{paddingHorizontal:18,gap:8,paddingBottom:10},chip:{backgroundColor:C.white,borderWidth:1,borderColor:C.line,paddingHorizontal:16,paddingVertical:10,borderRadius:99},chipText:{fontWeight:'800',color:C.text},
 promo:{margin:18,backgroundColor:'#FFF1D6',borderRadius:24,padding:20,flexDirection:'row',justifyContent:'space-between',alignItems:'center'},promoTag:{color:'#A35C00',fontWeight:'900',fontSize:11},promoTitle:{fontSize:20,fontWeight:'900',color:C.navy,marginTop:5,maxWidth:230},promoText:{fontSize:12,color:C.muted,maxWidth:230,marginTop:4},section:{fontSize:22,fontWeight:'900',color:C.text,marginHorizontal:18,marginBottom:12},
 grid:{flexDirection:'row',flexWrap:'wrap',paddingHorizontal:12},card:{width:'50%',padding:7},bottle:{height:145,borderRadius:22,backgroundColor:C.white,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:C.line},category:{fontSize:11,fontWeight:'900',color:C.orange,textTransform:'uppercase',marginTop:10},productName:{fontSize:15,fontWeight:'800',color:C.text,marginTop:3},unitLabel:{fontSize:12,fontWeight:'800',color:C.navy,marginTop:8},boxLabel:{fontSize:11,color:C.muted,marginTop:2},priceRow:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop:9},price:{fontSize:16,fontWeight:'900',color:C.navy},
 plus:{width:34,height:34,borderRadius:17,backgroundColor:C.orange,alignItems:'center',justifyContent:'center'},plusDisabled:{backgroundColor:C.line},plusText:{fontSize:22,fontWeight:'900',color:C.navy},
 nav:{position:'absolute',bottom:0,left:0,right:0,height:82,backgroundColor:C.white,borderTopWidth:1,borderTopColor:C.line,flexDirection:'row',justifyContent:'space-around',paddingTop:9},navItem:{alignItems:'center',minWidth:70},navText:{fontSize:10,fontWeight:'700',color:C.muted,marginTop:3},navActive:{color:C.navy,fontWeight:'900'},
 age:{flex:1,backgroundColor:C.navy,padding:26,justifyContent:'space-between'},brand:{fontSize:42,fontWeight:'900',fontStyle:'italic',color:C.white,letterSpacing:-2},brandSub:{color:C.orange,fontWeight:'900',fontSize:15,letterSpacing:2},ageCard:{backgroundColor:C.white,borderRadius:30,padding:28,alignItems:'center'},age18:{backgroundColor:C.orange,color:C.navy,fontSize:28,fontWeight:'900',paddingHorizontal:18,paddingVertical:12,borderRadius:50,overflow:'hidden'},h1:{fontSize:30,fontWeight:'900',color:C.text,marginBottom:18},bodyCenter:{textAlign:'center',color:C.muted,lineHeight:22,marginBottom:20},legal:{textAlign:'center',color:'#AFC0E3',fontSize:12},
 button:{backgroundColor:C.orange,paddingVertical:16,paddingHorizontal:20,borderRadius:16,alignItems:'center',marginTop:16},buttonText:{fontWeight:'900',color:C.navy,fontSize:13},back:{color:C.navy,fontWeight:'900',fontSize:16,marginBottom:18},
 productHero:{height:260,borderRadius:30,backgroundColor:C.white,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:C.line},productTitle:{fontSize:28,fontWeight:'900',color:C.text,marginTop:5},productPrice:{fontSize:26,fontWeight:'900',color:C.navy,marginTop:10},unitSuffix:{fontSize:13,color:C.muted,fontWeight:'700'},boxPriceCard:{backgroundColor:'#FFF1D6',borderRadius:16,padding:14,marginTop:12},boxPriceTitle:{fontSize:11,fontWeight:'900',color:'#A35C00',textTransform:'uppercase'},boxPriceValue:{fontSize:16,fontWeight:'900',color:C.navy,marginTop:3},availability:{fontSize:13,fontWeight:'800',color:C.green,marginTop:14},body:{fontSize:15,color:C.muted,lineHeight:22,marginTop:12},
 cartRow:{backgroundColor:C.white,borderRadius:18,padding:14,marginBottom:10,flexDirection:'row',alignItems:'center',gap:12},cartEmoji:{width:55,height:55,borderRadius:14,backgroundColor:C.bg,alignItems:'center',justifyContent:'center'},qty:{flexDirection:'row',alignItems:'center',gap:12},qtyBtn:{fontSize:22,fontWeight:'900',color:C.navy},qtyNum:{fontWeight:'900',minWidth:18,textAlign:'center'},total:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop:18,paddingTop:18,borderTopWidth:1,borderTopColor:C.line},totalPrice:{fontSize:24,fontWeight:'900',color:C.navy},
 empty:{alignItems:'center',padding:50,gap:12},label:{fontWeight:'900',fontSize:14,color:C.text,marginTop:10,marginBottom:8},option:{backgroundColor:C.white,borderWidth:1,borderColor:C.line,borderRadius:18,padding:16,marginBottom:10},optionTitle:{fontWeight:'900',fontSize:16,color:C.text},muted:{color:C.muted,fontSize:13,marginTop:3},
 order:{backgroundColor:C.white,padding:17,borderRadius:20,marginBottom:12,borderWidth:1,borderColor:C.line},orderTop:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:10},orderId:{fontWeight:'900',fontSize:16,color:C.navy},badge:{backgroundColor:'#E8F7F1',color:C.green,fontWeight:'900',paddingHorizontal:10,paddingVertical:6,borderRadius:99,overflow:'hidden',fontSize:11},
 stats:{flexDirection:'row',gap:8,marginVertical:18},stat:{flex:1,backgroundColor:C.white,borderRadius:18,padding:14,borderWidth:1,borderColor:C.line},statN:{fontSize:24,fontWeight:'900',color:C.navy},adminTile:{backgroundColor:C.white,borderRadius:20,padding:17,marginBottom:12,flexDirection:'row',alignItems:'center',gap:14,borderWidth:1,borderColor:C.line},chev:{fontSize:30,color:C.muted},input:{backgroundColor:C.white,borderWidth:1,borderColor:C.line,borderRadius:15,paddingHorizontal:15,paddingVertical:14,marginBottom:10,fontSize:15},multiline:{minHeight:90,textAlignVertical:'top'},adminRow:{backgroundColor:C.white,borderRadius:17,padding:14,marginTop:10,flexDirection:'row',alignItems:'center',gap:12,borderWidth:1,borderColor:C.line},stockRow:{flexDirection:'row',alignItems:'center',gap:7,marginTop:5},stockBtn:{width:26,height:26,borderRadius:13,backgroundColor:C.bg,alignItems:'center',justifyContent:'center'},stockBtnText:{fontWeight:'900',color:C.navy,fontSize:16}
});