import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { supabase } from '@/src/lib/supabase';
import { colors } from '@/src/theme';

export default function LoginScreen(){
  const [mode,setMode]=useState<'login'|'register'>('login');
  const [name,setName]=useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [loading,setLoading]=useState(false);

  const submit=async()=>{
    if(!email.trim()||!password.trim()) return Alert.alert('Completa los datos','Ingresa correo y contraseña.');
    setLoading(true);
    try{
      if(mode==='login'){
        const {error}=await supabase.auth.signInWithPassword({email:email.trim(),password});
        if(error) throw error;
      }else{
        const {error}=await supabase.auth.signUp({email:email.trim(),password,options:{data:{full_name:name.trim()}}});
        if(error) throw error;
        Alert.alert('Cuenta creada','Revisa tu correo si Supabase solicita confirmación.');
      }
      router.back();
    }catch(e:any){Alert.alert('No pudimos continuar',e?.message||'Inténtalo de nuevo.');}
    finally{setLoading(false);}
  };

  return <SafeAreaView style={styles.safe}><View style={styles.nav}><Pressable style={styles.back} onPress={()=>router.back()}><Ionicons name="chevron-back" size={24} color={colors.navy}/></Pressable></View><View style={styles.content}><Text style={styles.brand}>CELICOR</Text><Text style={styles.title}>{mode==='login'?'Bienvenido de nuevo':'Crea tu cuenta'}</Text><Text style={styles.copy}>{mode==='login'?'Guarda tus direcciones y revisa tus pedidos desde cualquier dispositivo.':'Regístrate para agilizar futuras compras y guardar tus favoritos.'}</Text>
  {mode==='register'&&<TextInput style={styles.input} placeholder="Nombre y apellido" placeholderTextColor="#9CA3AF" value={name} onChangeText={setName}/>}<TextInput style={styles.input} placeholder="Correo electrónico" placeholderTextColor="#9CA3AF" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail}/><TextInput style={styles.input} placeholder="Contraseña" placeholderTextColor="#9CA3AF" secureTextEntry value={password} onChangeText={setPassword}/>
  <Pressable style={styles.primary} onPress={submit} disabled={loading}><Text style={styles.primaryText}>{loading?'PROCESANDO...':mode==='login'?'INICIAR SESIÓN':'CREAR CUENTA'}</Text></Pressable>
  <Pressable style={styles.switch} onPress={()=>setMode(mode==='login'?'register':'login')}><Text style={styles.switchText}>{mode==='login'?'¿No tienes cuenta? Crear una':'¿Ya tienes cuenta? Iniciar sesión'}</Text></Pressable>
  <View style={styles.note}><Ionicons name="shield-checkmark-outline" size={20} color={colors.success}/><Text style={styles.noteText}>Tu sesión se almacena de forma segura mediante Supabase Auth.</Text></View></View></SafeAreaView>
}
const styles=StyleSheet.create({safe:{flex:1,backgroundColor:'#fff'},nav:{padding:18},back:{width:44,height:44,borderRadius:15,backgroundColor:colors.background,alignItems:'center',justifyContent:'center'},content:{paddingHorizontal:24,paddingTop:20},brand:{fontSize:20,fontWeight:'900',fontStyle:'italic',color:colors.navy},title:{fontSize:32,fontWeight:'900',color:colors.text,marginTop:22},copy:{fontSize:14,lineHeight:21,color:colors.muted,marginTop:8,marginBottom:22},input:{height:54,borderRadius:16,backgroundColor:colors.background,borderWidth:1,borderColor:colors.line,paddingHorizontal:15,fontSize:15,color:colors.text,marginBottom:10},primary:{backgroundColor:colors.orange,borderRadius:16,paddingVertical:17,alignItems:'center',marginTop:6},primaryText:{fontSize:13,fontWeight:'900',color:colors.navy},switch:{alignItems:'center',padding:16},switchText:{fontSize:13,fontWeight:'800',color:colors.navy},note:{marginTop:16,backgroundColor:'#EAF8F3',borderRadius:16,padding:14,flexDirection:'row',gap:10,alignItems:'center'},noteText:{flex:1,fontSize:12,lineHeight:18,color:colors.muted}})
