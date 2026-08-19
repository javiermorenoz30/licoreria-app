import { router } from 'expo-router';
import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, money, Product } from './core';
import { useCart } from './state';

export function Brand({ compact=false }:{compact?:boolean}) {
  return <View style={{alignItems:'flex-start'}}><Text style={[s.brand,{fontSize:compact?24:36}]}>CELI<Text style={{color:colors.orange}}>C</Text>OR</Text><Text style={[s.sub,{fontSize:compact?8:10}]}>LA CASTELLANA</Text></View>;
}

export function ProductCard({ product, wide=false }:{product:Product;wide?:boolean}) {
  const {add}=useCart();
  return <Pressable style={[s.card,wide&&{width:210}]} onPress={()=>router.push({pathname:'/product/[id]',params:{id:product.id}} as any)}>
    <View style={s.imageBox}>{product.image_url?<Image source={{uri:product.image_url}} style={s.image}/>:<Text style={{fontSize:52}}>🍾</Text>}{product.featured?<Text style={s.badge}>TOP</Text>:null}</View>
    <Text style={s.brandName}>{product.brand || 'CELICOR'}</Text><Text style={s.name} numberOfLines={2}>{product.name}</Text>
    <View style={s.row}><View><Text style={s.price}>{money(product.price)}</Text><Text style={s.size}>{product.size || 'Unidad'}</Text></View><Pressable onPress={(e)=>{e.stopPropagation();add(product);}} style={s.add}><Text style={s.addText}>＋</Text></Pressable></View>
  </Pressable>;
}

export function ScreenTitle({title,subtitle}:{title:string;subtitle?:string}) { return <View style={{marginBottom:18}}><Text style={s.title}>{title}</Text>{subtitle?<Text style={s.subtitle}>{subtitle}</Text>:null}</View>; }
export function Notice({children}:{children:React.ReactNode}) { return <View style={s.notice}><Text style={s.noticeText}>{children}</Text></View>; }

const s=StyleSheet.create({brand:{fontWeight:'1000',letterSpacing:-2,color:colors.navy},sub:{fontWeight:'900',letterSpacing:2.5,color:colors.text,marginLeft:2},card:{width:'48%',backgroundColor:'#fff',borderRadius:22,padding:11,marginBottom:14,borderWidth:1,borderColor:'#EEF0F4'},imageBox:{height:130,borderRadius:16,backgroundColor:'#F4F5F8',alignItems:'center',justifyContent:'center',overflow:'hidden'},image:{width:'100%',height:'100%',resizeMode:'contain'},badge:{position:'absolute',left:8,top:8,backgroundColor:colors.orange,color:colors.navy,fontWeight:'900',fontSize:10,paddingHorizontal:8,paddingVertical:4,borderRadius:99},brandName:{fontSize:10,fontWeight:'900',color:colors.orange,marginTop:10,textTransform:'uppercase'},name:{fontSize:15,fontWeight:'800',color:colors.text,minHeight:38,marginTop:2},row:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop:8},price:{fontSize:18,fontWeight:'1000',color:colors.navy},size:{fontSize:11,color:colors.muted},add:{width:38,height:38,borderRadius:19,backgroundColor:colors.navy,alignItems:'center',justifyContent:'center'},addText:{color:'#fff',fontSize:23,fontWeight:'700'},title:{fontSize:28,fontWeight:'1000',color:colors.text},subtitle:{fontSize:14,color:colors.muted,marginTop:4},notice:{backgroundColor:'#FFF7E5',borderRadius:16,padding:14},noticeText:{color:'#725100',lineHeight:19,fontSize:13}});
