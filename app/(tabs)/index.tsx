import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ProductCard } from '@/src/components/ProductCard';
import { products } from '@/src/data/products';
import { colors } from '@/src/theme';

const quick = [
  ['Ron','wine-outline'],['Whisky','flask-outline'],['Vodka','snow-outline'],['Tequila','sparkles-outline'],['Vino','wine-outline'],['Cerveza','beer-outline']
] as const;

export default function HomeScreen(){
  const featured = products.filter(p => p.featured).slice(0,6);
  return <SafeAreaView style={styles.safe}>
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
      <View style={styles.top}>
        <View><Text style={styles.eyebrow}>CELICOR LA CASTELLANA</Text><Text style={styles.greeting}>¿Qué vamos a brindar hoy?</Text></View>
        <Pressable style={styles.avatar} onPress={()=>router.push('/(tabs)/profile')}><Ionicons name="person-outline" size={22} color={colors.navy}/></Pressable>
      </View>

      <Pressable style={styles.location}><Ionicons name="location" size={18} color={colors.orangeDark}/><View style={{flex:1}}><Text style={styles.locationLabel}>Entregar en</Text><Text style={styles.locationText}>La Castellana, Caracas</Text></View><Ionicons name="chevron-down" size={18} color={colors.navy}/></Pressable>

      <Pressable style={styles.search} onPress={()=>router.push('/(tabs)/search')}><Ionicons name="search" size={20} color={colors.muted}/><Text style={styles.searchText}>Buscar ron, vino, whisky...</Text></Pressable>

      <View style={styles.hero}>
        <View style={{flex:1}}><Text style={styles.heroKicker}>DELIVERY · PICKUP</Text><Text style={styles.heroTitle}>Tu cava, ahora más cerca.</Text><Text style={styles.heroCopy}>Compra al detal o por caja desde CELICOR La Castellana.</Text><Pressable style={styles.heroButton} onPress={()=>router.push('/(tabs)/search')}><Text style={styles.heroButtonText}>VER CATÁLOGO</Text></Pressable></View>
        <Text style={styles.heroEmoji}>🥃</Text>
      </View>

      <View style={styles.sectionHead}><Text style={styles.sectionTitle}>Categorías</Text><Pressable onPress={()=>router.push('/(tabs)/search')}><Text style={styles.link}>Ver todas</Text></Pressable></View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap:10}}>{quick.map(([name,icon])=><Pressable key={name} style={styles.cat} onPress={()=>router.push({pathname:'/(tabs)/search',params:{category:name}})}><View style={styles.catIcon}><Ionicons name={icon as any} size={22} color={colors.navy}/></View><Text style={styles.catText}>{name}</Text></Pressable>)}</ScrollView>

      <View style={[styles.sectionHead,{marginTop:26}]}><Text style={styles.sectionTitle}>Más buscados</Text><Text style={styles.link}>Hoy</Text></View>
      <View style={styles.grid}>{featured.map(p=><ProductCard product={p} key={p.id}/>)}</View>

      <View style={styles.info}><Ionicons name="shield-checkmark" size={24} color={colors.success}/><View style={{flex:1}}><Text style={styles.infoTitle}>Compra responsable</Text><Text style={styles.infoCopy}>Venta exclusiva para mayores de edad. Podremos solicitar identificación al entregar.</Text></View></View>
    </ScrollView>
  </SafeAreaView>
}

const styles=StyleSheet.create({safe:{flex:1,backgroundColor:colors.background},content:{padding:18,paddingBottom:30},top:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:8},eyebrow:{fontSize:11,fontWeight:'900',letterSpacing:1,color:colors.orangeDark},greeting:{fontSize:28,fontWeight:'900',color:colors.navy,marginTop:4,maxWidth:270},avatar:{width:44,height:44,borderRadius:16,backgroundColor:'#fff',alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:colors.line},location:{marginTop:18,backgroundColor:'#fff',borderRadius:16,padding:13,flexDirection:'row',gap:10,alignItems:'center'},locationLabel:{fontSize:10,color:colors.muted,fontWeight:'700'},locationText:{fontSize:13,color:colors.text,fontWeight:'800',marginTop:2},search:{marginTop:12,backgroundColor:'#fff',borderRadius:16,padding:15,flexDirection:'row',alignItems:'center',gap:10,borderWidth:1,borderColor:colors.line},searchText:{color:colors.muted,fontSize:14},hero:{marginTop:16,backgroundColor:colors.navy,borderRadius:26,padding:22,flexDirection:'row',alignItems:'center',overflow:'hidden'},heroKicker:{color:colors.orange,fontWeight:'900',fontSize:11,letterSpacing:1},heroTitle:{color:'#fff',fontWeight:'900',fontSize:27,lineHeight:30,marginTop:8},heroCopy:{color:'#D6DEED',fontSize:13,lineHeight:19,marginTop:8},heroButton:{alignSelf:'flex-start',backgroundColor:colors.orange,borderRadius:12,paddingHorizontal:14,paddingVertical:10,marginTop:15},heroButtonText:{fontSize:11,fontWeight:'900',color:colors.navy},heroEmoji:{fontSize:68,marginLeft:8,transform:[{rotate:'10deg'}]},sectionHead:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop:22,marginBottom:12},sectionTitle:{fontSize:20,fontWeight:'900',color:colors.text},link:{fontSize:12,fontWeight:'800',color:colors.orangeDark},cat:{width:78,alignItems:'center',gap:7},catIcon:{width:58,height:58,borderRadius:20,backgroundColor:'#fff',alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:colors.line},catText:{fontSize:11,fontWeight:'800',color:colors.text},grid:{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between'},info:{marginTop:12,backgroundColor:'#EAF8F3',padding:16,borderRadius:18,flexDirection:'row',gap:12,alignItems:'flex-start'},infoTitle:{fontWeight:'900',color:colors.text},infoCopy:{fontSize:12,lineHeight:18,color:colors.muted,marginTop:3}})
