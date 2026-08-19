import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/src/theme';
import { useCart } from '@/src/store/cart';

export default function TabsLayout() {
  const { count } = useCart();
  return (
    <Tabs screenOptions={({ route }) => ({
      headerShown:false,
      tabBarActiveTintColor:colors.orangeDark,
      tabBarInactiveTintColor:'#7B8494',
      tabBarStyle:{ height:78, paddingTop:8, paddingBottom:12, borderTopColor:'#E5E7EB', backgroundColor:'#fff' },
      tabBarLabelStyle:{ fontSize:11, fontWeight:'700' },
      tabBarIcon:({ color, size }) => {
        const names: Record<string, keyof typeof Ionicons.glyphMap> = {
          index:'home-outline', search:'search-outline', cart:'cart-outline', orders:'receipt-outline', profile:'person-outline'
        };
        return <Ionicons name={names[route.name] ?? 'ellipse-outline'} size={size} color={color} />;
      }
    })}>
      <Tabs.Screen name="index" options={{ title:'Inicio' }} />
      <Tabs.Screen name="search" options={{ title:'Buscar' }} />
      <Tabs.Screen name="cart" options={{ title:'Carrito', tabBarBadge: count ? count : undefined, tabBarBadgeStyle:{ backgroundColor:colors.navy } }} />
      <Tabs.Screen name="orders" options={{ title:'Pedidos' }} />
      <Tabs.Screen name="profile" options={{ title:'Perfil' }} />
    </Tabs>
  );
}
