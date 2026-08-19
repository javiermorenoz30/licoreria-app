import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { products } from '@/src/data/products';
import { useCart } from '@/src/store/cart';
import { colors } from '@/src/theme';

export default function ProductDetail(){
  const {id}=useLocalSearchParams<{id:string}>();
  const product=products.find(p=>p.id===id);
  const {add}=useCart();
  if(!product) return <SafeAreaView style={styles.safe}><Text style={styles.missing}>Producto no encontrado</Text></SafeAreaView>;
  return <SafeAreaView style={styles.safe}>
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.nav}><Pressable style={styles.iconBtn} onPress={()=>router.back()}><Ionicons name="chevron-back" size={24} color={colors.navy}/></Pressable><Pressable style={styles.iconBtn}><Ionicons name="heart-outline" size={23} color={colors.navy}/></Pressable></View>
      <View style={styles.visual}><Text style={styles.bottle}>🍾</Text><View style={styles.badge}><Text style={styles.badgeText}>Disponible</Text></View></View>
      <Text style={styles.brand}>{product.brand}</Text><Text style={styles.name}>{product.name}</Text><Text style={styles.size}>{product.size}</Text>
      <View style={styles.priceRow}><Text style={styles.price}>${product.price.toFixed(2)}</Text>{product.boxPrice&&<View style={styles.boxPrice}><Text style={styles.boxLabel}>Caja {product.boxQty} und.</Text><Text style={styles.boxValue}>${product.boxPrice.toFixed(2)}</Text></View>}</View>
      <View style={styles.divider}/><Text style={styles.sectionTitle}>Sobre esta botella</Text><Text style={styles.description}>{product.description}</Text>
      <View style={styles.infoRow}><View style={styles.info}><Ionicons name="shield-checkmark-outline" size={21} color={colors.success}/><Text style={styles.infoText}>Compra segura</Text></View><View style={styles.info}><Ionicons name="bicycle-outline" size={21} color={colors.orangeDark}/><Text style={styles.infoText}>Delivery local</Text></View></View>
    </ScrollView>
    <View style={styles.footer}><Pressable style={styles.add} onPress={()=>{add(product);router.push('/(tabs)/cart')}}><Ionicons name="cart-outline" size={20} color={colors.navy}/><Text style={styles.addText}>AGREGAR AL CARRITO</Text></Pressable></View>
  </SafeAreaView>
}
const styles=StyleSheet.create({safe:{flex:1,backgroundColor:'#fff'},content:{padding:18,paddingBottom:120},nav:{flexDirection:'row',justifyContent:'space-between',alignItems:'center'},iconBtn:{width:44,height:44,borderRadius:15,backgroundColor:colors.background,alignItems:'center',justifyContent:'center'},visual:{height:300,borderRadius:28,backgroundColor:'#F5F7FB',alignItems:'center',justifyContent:'center',marginTop:16,position:'relative'},bottle:{fontSize:118},badge:{position:'absolute',left:14,bottom:14,backgroundColor:'#E7F8F1',borderRadius:999,paddingHorizontal:11,paddingVertical:7},badgeText:{fontSize:11,fontWeight:'900',color:colors.success},brand:{marginTop:22,fontSize:12,fontWeight:'900',color:colors.orangeDark,textTransform:'uppercase',letterSpacing:1},name:{fontSize:31,lineHeight:35,fontWeight:'900',color:colors.navy,marginTop:5},size:{fontSize:14,color:colors.muted,marginTop:5},priceRow:{marginTop:18,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},price:{fontSize:30,fontWeight:'900',color:colors.text},boxPrice:{alignItems:'flex-end'},boxLabel:{fontSize:11,color:colors.muted},boxValue:{fontSize:16,fontWeight:'900',color:colors.navy,marginTop:2},divider:{height:1,backgroundColor:colors.line,marginVertical:22},sectionTitle:{fontSize:18,fontWeight:'900',color:colors.text},description:{fontSize:14,lineHeight:22,color:colors.muted,marginTop:8},infoRow:{flexDirection:'row',gap:10,marginTop:22},info:{flex:1,backgroundColor:colors.background,padding:14,borderRadius:16,flexDirection:'row',alignItems:'center',gap:8},infoText:{fontSize:11,fontWeight:'800',color:colors.text},footer:{position:'absolute',left:0,right:0,bottom:0,backgroundColor:'#fff',padding:18,paddingBottom:24,borderTopWidth:1,borderColor:colors.line},add:{backgroundColor:colors.orange,borderRadius:16,paddingVertical:17,alignItems:'center',justifyContent:'center',flexDirection:'row',gap:9},addText:{fontWeight:'900',fontSize:13,color:colors.navy},missing:{padding:30,fontSize:18,fontWeight:'800'}})
