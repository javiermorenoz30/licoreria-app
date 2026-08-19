import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { CartProvider, SessionProvider } from '@/src/state';

export default function RootLayout(){return <SessionProvider><CartProvider><StatusBar style="dark"/><Stack screenOptions={{headerShown:false,animation:'slide_from_right'}}/></CartProvider></SessionProvider>;}
