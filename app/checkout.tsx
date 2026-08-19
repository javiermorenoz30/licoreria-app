import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useCart } from '@/src/store/cart';
import { colors } from '@/src/theme';

const zones=[['La Castellana',2],['Altamira',2],['Los Palos Grandes',2],['Chacao',3],['El Rosal',3],['Las Mercedes',4]] as const;
const methods=['Pago móvil','Zelle','Transferencia','Efectivo / pago al recibir'] as const;
const ORDERS_KEY='celicor_orders_v1';

export default function Checkout(){
  const {items,subtotal,clear}=useCart();
  const [mode,setMode]=useState<'delivery'|'pickup'>('delivery');
  const [zone,setZone]=useState<(typeof zones)[number]>(zones[0]);
  const [address,setAddress]=useState('');
  const [reference,setReference]=useState('');
  const [payment,setPayment]=useState<string>(methods[0]);
  const fee=mode==='delivery'?zone[1]:0;
  const total=subtotal+fee;

  const placeOrder=async()=>{
    if(!items.length) return;
    if(mode==='delivery'&&!address.trim()){Alert.alert('Falta la dirección','Escribe la dirección de entrega.');return;}
    const order={id:Date.now().toString(),number:String(Date.now()).slice(-6),createdAt:new Date().toISOString(),status:'pending',mode,zone:mode==='delivery'?zone[0]:'Retiro en tienda',address:mode==='delivery'?address:'Av. Blandín con Calle Mata de Coco, La Castellana',reference,payment,subtotal,deliveryFee:fee,total,items};
    const current=JSON.parse((await AsyncStorage.getItem(ORDERS_KEY))||'[]');
    await AsyncStorage.setItem(ORDERS_KEY,JSON.stringify([order,...current]));
    clear();
    router.replace({pathname:'/order-success',params:{number:order.number,total:String(total.toFixed(2))}});
  };

  return <SafeAreaView style={styles.safe}><View style={styles.nav}><Pressable style={styles.back} onPress={()=>router.back()}><Ionicons name="chevron-back" size={24} color={colors.navy}/></Pressable><Text style={styles.navTitle}>Finalizar pedido</Text><View style={{width:44}}/></View>
  <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
    <Text style={styles.sectionTitle}>¿Cómo lo quieres?</Text><View style={styles.segment}><Pressable onPress={()=>setMode('delivery')} style={[styles.segmentBtn,mode==='delivery'&&styles.segmentActive]}><Ionicons name="bicycle-outline" size={20} color={mode==='delivery'?'#fff':colors.navy}/><Text style={[styles.segmentText,mode==='delivery'&&styles.segmentTextActive]}>Delivery</Text></Pressable><Pressable onPress={()=>setMode('pickup')} style={[styles.segmentBtn,mode==='pickup'&&styles.segmentActive]}><Ionicons name="storefront-outline" size={20} color={mode==='pickup'?'#fff':colors.navy}/><Text style={[styles.segmentText,mode==='pickup'&&styles.segmentTextActive]}>Retirar</Text></Pressable></View>

    {mode==='delivery'?<><Text style={styles.sectionTitle}>Zona de entrega</Text><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap:8,paddingBottom:4}}>{zones.map(z=><Pressable key={z[0]} onPress={()=>setZone(z)} style={[styles.chip,zone[0]===z[0]&&styles.chipActive]}><Text style={[styles.chipText,zone[0]===z[0]&&styles.chipTextActive]}>{z[0]} · ${z[1]}</Text></Pressable>)}</ScrollView><Text style={styles.sectionTitle}>Dirección</Text><TextInput value={address} onChangeText={setAddress} placeholder="Edificio, calle, avenida..." placeholderTextColor="#9CA3AF" style={styles.input}/><TextInput value={reference} onChangeText={setReference} placeholder="Piso, apto. o referencia (opcional)" placeholderTextColor="#9CA3AF" style={styles.input}/></>:<View style={styles.pickupCard}><Ionicons name="location" size={24} color={colors.orangeDark}/><View style={{flex:1}}><Text style={styles.pickupTitle}>CELICOR La Castellana</Text><Text style={styles.pickupText}>Av. Blandín con Calle Mata de Coco, La Castellana, Caracas</Text></View></View>}

    <Text style={styles.sectionTitle}>Método de pago</Text>{methods.map(m=><Pressable key={m} onPress={()=>setPayment(m)} style={styles.option}><View style={[styles.radio,payment===m&&styles.radioActive]}>{payment===m&&<View style={styles.radioDot}/>}</View><Text style={styles.optionText}>{m}</Text></Pressable>)}

    <Text style={styles.sectionTitle}>Resumen</Text><View style={styles.summary}><View style={styles.line}><Text style={styles.label}>Productos</Text><Text style={styles.value}>${subtotal.toFixed(2)}</Text></View><View style={styles.line}><Text style={styles.label}>Delivery</Text><Text style={styles.value}>${fee.toFixed(2)}</Text></View><View style={styles.divider}/><View style={styles.line}><Text style={styles.totalLabel}>Total</Text><Text style={styles.total}>${total.toFixed(2)}</Text></View></View>
    <View style={styles.notice}><Ionicons name="id-card-outline" size={22} color={colors.orangeDark}/><Text style={styles.noticeText}>Se podrá solicitar identificación válida al momento de la entrega o retiro.</Text></View>
  </ScrollView>
  <View style={styles.footer}><Pressable style={styles.primary} onPress={placeOrder}><Text style={styles.primaryText}>CONFIRMAR PEDIDO · ${total.toFixed(2)}</Text></Pressable></View></SafeAreaView>
}
const styles=StyleSheet.create({safe:{flex:1,backgroundColor:colors.background},nav:{paddingHorizontal:18,paddingVertical:12,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},back:{width:44,height:44,borderRadius:15,backgroundColor:'#fff',alignItems:'center',justifyContent:'center'},navTitle:{fontSize:17,fontWeight:'900',color:colors.navy},content:{padding:18,paddingTop:4,paddingBottom:140},sectionTitle:{fontSize:17,fontWeight:'900',color:colors.text,marginTop:22,marginBottom:11},segment:{backgroundColor:'#E9EDF4',padding:4,borderRadius:17,flexDirection:'row'},segmentBtn:{flex:1,paddingVertical:12,borderRadius:14,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:7},segmentActive:{backgroundColor:colors.navy},segmentText:{fontWeight:'800',color:colors.navy},segmentTextActive:{color:'#fff'},chip:{backgroundColor:'#fff',borderWidth:1,borderColor:colors.line,borderRadius:999,paddingHorizontal:13,paddingVertical:9},chipActive:{backgroundColor:colors.navy,borderColor:colors.navy},chipText:{fontSize:12,fontWeight:'800',color:colors.text},chipTextActive:{color:'#fff'},input:{height:52,backgroundColor:'#fff',borderRadius:15,paddingHorizontal:14,fontSize:14,color:colors.text,borderWidth:1,borderColor:colors.line,marginBottom:9},pickupCard:{backgroundColor:'#fff',borderRadius:18,padding:15,flexDirection:'row',gap:12,alignItems:'flex-start',marginTop:4},pickupTitle:{fontWeight:'900',color:colors.text},pickupText:{fontSize:12,lineHeight:18,color:colors.muted,marginTop:3},option:{height:52,backgroundColor:'#fff',borderRadius:15,paddingHorizontal:14,flexDirection:'row',alignItems:'center',gap:11,borderWidth:1,borderColor:colors.line,marginBottom:8},radio:{width:20,height:20,borderRadius:10,borderWidth:2,borderColor:'#C5CAD3',alignItems:'center',justifyContent:'center'},radioActive:{borderColor:colors.orangeDark},radioDot:{width:10,height:10,borderRadius:5,backgroundColor:colors.orangeDark},optionText:{fontSize:14,fontWeight:'700',color:colors.text},summary:{backgroundColor:'#fff',borderRadius:18,padding:16},line:{flexDirection:'row',justifyContent:'space-between',marginBottom:10},label:{fontSize:13,color:colors.muted},value:{fontSize:13,fontWeight:'800',color:colors.text},divider:{height:1,backgroundColor:colors.line,marginVertical:4,marginBottom:13},totalLabel:{fontSize:16,fontWeight:'900',color:colors.text},total:{fontSize:21,fontWeight:'900',color:colors.navy},notice:{marginTop:14,backgroundColor:'#FFF7E6',borderRadius:16,padding:14,flexDirection:'row',gap:10,alignItems:'flex-start'},noticeText:{flex:1,fontSize:12,lineHeight:18,color:'#765318'},footer:{position:'absolute',left:0,right:0,bottom:0,backgroundColor:'#fff',padding:18,paddingBottom:24,borderTopWidth:1,borderColor:colors.line},primary:{backgroundColor:colors.orange,borderRadius:16,paddingVertical:17,alignItems:'center'},primaryText:{fontSize:13,fontWeight:'900',color:colors.navy}})
