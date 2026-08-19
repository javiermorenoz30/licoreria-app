# CELICOR La Castellana — App móvil

Aplicación móvil para Android y iOS construida con React Native + Expo y preparada para Supabase.

## Desarrollo

```bash
npm install
npx expo start
```

## Cuenta Expo

Owner configurado: `jamz979712`

## Generar APK de prueba

El repositorio incluye un workflow manual en GitHub Actions:

`Build Android Preview APK`

Antes de ejecutarlo, crea un token personal en Expo y guárdalo en GitHub como Repository Secret con el nombre exacto:

`EXPO_TOKEN`

El workflow se encarga de:

1. autenticar Expo/EAS,
2. vincular el proyecto con EAS,
3. crear una clave temporal exclusiva para el APK de prueba,
4. iniciar el build Android en la nube.

La clave temporal se usa solamente para builds de prueba. La publicación final en Google Play utilizará credenciales de producción separadas.

## Objetivo V1

- Catálogo y búsqueda
- Carrito
- Registro / login
- Delivery o retiro
- Checkout
- Pedidos e historial
- Panel administrativo
- Inventario y promociones
- Verificación de mayoría de edad

## Marca

CELICOR La Castellana — Caracas, Venezuela.
