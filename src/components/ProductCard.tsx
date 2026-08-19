import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import type { Product } from '@/src/data/products';
import { useCart } from '@/src/store/cart';
import { colors } from '@/src/theme';

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  return (
    <Pressable style={styles.card} onPress={() => router.push(`/product/${product.id}`)}>
      <View style={styles.visual}><Text style={styles.bottle}>🍾</Text></View>
      <Text style={styles.brand}>{product.brand}</Text>
      <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
      <Text style={styles.size}>{product.size}</Text>
      <View style={styles.row}>
        <Text style={styles.price}>${product.price.toFixed(2)}</Text>
        <Pressable style={styles.add} onPress={(e) => { e.stopPropagation(); add(product); }}>
          <Ionicons name="add" size={22} color="#fff" />
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card:{ width:'48.5%', backgroundColor:'#fff', borderRadius:20, padding:12, marginBottom:12, borderWidth:1, borderColor:'#EEF0F4' },
  visual:{ height:118, borderRadius:16, backgroundColor:'#F5F7FB', alignItems:'center', justifyContent:'center', marginBottom:12 },
  bottle:{ fontSize:54 },
  brand:{ color:colors.orangeDark, fontSize:11, fontWeight:'900', textTransform:'uppercase', letterSpacing:.5 },
  name:{ color:colors.text, fontWeight:'800', fontSize:15, minHeight:38, marginTop:3 },
  size:{ color:colors.muted, fontSize:12, marginTop:3 },
  row:{ marginTop:10, flexDirection:'row', alignItems:'center', justifyContent:'space-between' },
  price:{ color:colors.navy, fontWeight:'900', fontSize:17 },
  add:{ width:34, height:34, borderRadius:12, backgroundColor:colors.navy, alignItems:'center', justifyContent:'center' }
});
