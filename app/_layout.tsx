import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { CartProvider } from '@/src/store/cart';
import { colors } from '@/src/theme';

export default function RootLayout() {
  return (
    <CartProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }} />
    </CartProvider>
  );
}
