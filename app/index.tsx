import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/src/theme';

const AGE_KEY = 'celicor_age_confirmed_v1';

export default function AgeGate() {
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(AGE_KEY).then(value => {
      if (value === 'yes') router.replace('/(tabs)');
      else setChecking(false);
    }).catch(() => setChecking(false));
  }, []);

  const confirm = async () => {
    await AsyncStorage.setItem(AGE_KEY, 'yes');
    router.replace('/(tabs)');
  };

  if (checking) return <SafeAreaView style={styles.screen} />;

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.brandMark}>
        <Text style={styles.brand}>CELICOR</Text>
        <View style={styles.orangeLine} />
        <Text style={styles.place}>LA CASTELLANA</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.ageCircle}><Text style={styles.age}>18+</Text></View>
        <Text style={styles.title}>Antes de brindar</Text>
        <Text style={styles.copy}>Debes tener la edad legal requerida para comprar bebidas alcohólicas en tu ubicación.</Text>
        <Pressable style={styles.primary} onPress={confirm}><Text style={styles.primaryText}>CONFIRMO QUE SOY MAYOR DE EDAD</Text></Pressable>
        <Pressable style={styles.secondary}><Text style={styles.secondaryText}>Salir</Text></Pressable>
      </View>

      <Text style={styles.legal}>CELICOR promueve el consumo responsable.</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen:{ flex:1, backgroundColor:'#fff', padding:24, justifyContent:'space-between' },
  brandMark:{ marginTop:36, alignItems:'center' },
  brand:{ fontSize:42, fontWeight:'900', fontStyle:'italic', letterSpacing:-2, color:colors.navy },
  orangeLine:{ width:132, height:7, borderRadius:8, backgroundColor:colors.orange, transform:[{rotate:'-8deg'}], marginTop:-15, marginBottom:12 },
  place:{ fontSize:18, color:'#111', letterSpacing:2 },
  card:{ backgroundColor:colors.background, borderRadius:28, padding:26, alignItems:'center' },
  ageCircle:{ width:72, height:72, borderRadius:36, backgroundColor:colors.navy, alignItems:'center', justifyContent:'center', marginBottom:18 },
  age:{ color:'#fff', fontSize:26, fontWeight:'900' },
  title:{ fontSize:28, fontWeight:'900', color:colors.text, marginBottom:10 },
  copy:{ textAlign:'center', color:colors.muted, fontSize:15, lineHeight:22, marginBottom:24 },
  primary:{ width:'100%', backgroundColor:colors.orange, paddingVertical:16, borderRadius:16, alignItems:'center' },
  primaryText:{ color:colors.navy, fontSize:13, fontWeight:'900' },
  secondary:{ marginTop:16, padding:8 },
  secondaryText:{ color:colors.muted, fontWeight:'700' },
  legal:{ textAlign:'center', color:'#9CA3AF', fontSize:12, marginBottom:10 }
});
