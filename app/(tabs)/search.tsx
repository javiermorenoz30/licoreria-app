import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View, Pressable } from 'react-native';
import { ProductCard } from '@/src/components/ProductCard';
import { categories, products } from '@/src/data/products';
import { colors } from '@/src/theme';

export default function SearchScreen(){
  const params=useLocalSearchParams<{category?:string}>();
  const [query,setQuery]=useState('');
  const [category,setCategory]=useState<string>(params.category ?? 'Todos');
  const list=useMemo(()=>products.filter(p=>{
    const matchesCategory=category==='Todos'||p.category===category;
    const q=query.trim().toLowerCase();
    return matchesCategory && (!q || `${p.brand} ${p.name} ${p.size}`.toLowerCase().includes(q));
  }),[query,category]);

  return <SafeAreaView style={styles.safe}><View style={styles.header}><Text style={styles.title}>Buscar</Text><Text style={styles.subtitle}>Encuentra tu próxima botella.</Text></View>
    <View style={styles.search}><Ionicons name="search" size={20} color={colors.muted}/><TextInput style={styles.input} placeholder="Ron, marca, presentación..." placeholderTextColor="#9CA3AF" value={query} onChangeText={setQuery}/>{query.length>0&&<Pressable onPress={()=>setQuery('')}><Ionicons name="close-circle" size={20} color="#9CA3AF"/></Pressable>}</View>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>{categories.map(c=><Pressable key={c} onPress={()=>setCategory(c)} style={[styles.chip,category===c&&styles.chipActive]}><Text style={[styles.chipText,category===c&&styles.chipTextActive]}>{c}</Text></Pressable>)}</ScrollView>
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.results}><Text style={styles.count}>{list.length} productos</Text><View style={styles.grid}>{list.map(p=><ProductCard key={p.id} product={p}/>)}</View>{!list.length&&<View style={styles.empty}><Ionicons name="search-outline" size={42} color="#B7BECA"/><Text style={styles.emptyTitle}>No encontramos resultados</Text><Text style={styles.emptyText}>Prueba otra marca, categoría o presentación.</Text></View>}</ScrollView>
  </SafeAreaView>
}
const styles=StyleSheet.create({safe:{flex:1,backgroundColor:colors.background},header:{paddingHorizontal:18,paddingTop:12},title:{fontSize:30,fontWeight:'900',color:colors.navy},subtitle:{fontSize:13,color:colors.muted,marginTop:3},search:{margin:18,marginBottom:10,backgroundColor:'#fff',borderRadius:16,paddingHorizontal:14,height:52,flexDirection:'row',alignItems:'center',gap:9,borderWidth:1,borderColor:colors.line},input:{flex:1,fontSize:15,color:colors.text},chips:{paddingHorizontal:18,gap:8,paddingBottom:12},chip:{paddingHorizontal:14,paddingVertical:9,borderRadius:999,backgroundColor:'#fff',borderWidth:1,borderColor:colors.line},chipActive:{backgroundColor:colors.navy,borderColor:colors.navy},chipText:{fontSize:12,fontWeight:'800',color:colors.text},chipTextActive:{color:'#fff'},results:{padding:18,paddingTop:6,paddingBottom:30},count:{fontSize:12,fontWeight:'800',color:colors.muted,marginBottom:10},grid:{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between'},empty:{alignItems:'center',paddingTop:70},emptyTitle:{fontSize:18,fontWeight:'900',color:colors.text,marginTop:12},emptyText:{fontSize:13,color:colors.muted,marginTop:5,textAlign:'center'}})
