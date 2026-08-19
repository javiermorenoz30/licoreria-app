import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { colors } from '@/src/core';
import { useCart } from '@/src/state';
const Icon=({emoji,color}:{emoji:string;color:string})=><Text style={{fontSize:20,color}}>{emoji}</Text>;
export default function TabsLayout(){const{count}=useCart();return <Tabs screenOptions={{headerShown:false,tabBarActiveTintColor:colors.navy,tabBarInactiveTintColor:'#9AA1AD',tabBarStyle:{height:72,paddingBottom:10,paddingTop:7,borderTopColor:'#EEF0F4'},tabBarLabelStyle:{fontWeight:'800',fontSize:10}}}><Tabs.Screen name="home" options={{title:'Inicio',tabBarIcon:({color})=><Icon emoji="🏠" color={color}/>}}/><Tabs.Screen name="search" options={{title:'Buscar',tabBarIcon:({color})=><Icon emoji="🔎" color={color}/>}}/><Tabs.Screen name="cart" options={{title:'Carrito',tabBarBadge:count||undefined,tabBarIcon:({color})=><Icon emoji="🛒" color={color}/>}}/><Tabs.Screen name="orders" options={{title:'Pedidos',tabBarIcon:({color})=><Icon emoji="🧾" color={color}/>}}/><Tabs.Screen name="account" options={{title:'Cuenta',tabBarIcon:({color})=><Icon emoji="👤" color={color}/>}}/></Tabs>}
