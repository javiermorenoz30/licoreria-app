import type { Product } from './catalog';

const T=(id:string,brand:string,name:string,description:string,price:number|null,boxQty:number|null=null,boxPrice:number|null=null):Product=>({id,brand,name,category:'Tequila',description,price,boxQty,boxPrice,stock:null,emoji:'🌵'});

export const tequilaProducts:Product[]=[
T('tq-jose-cuervo-rep-075','José Cuervo','José Cuervo Reposado 0,75 L','Tequila joven de estilo dorado elaborado con una mezcla de tequilas reposado (añejo) y más jóvenes.',null,12,null),
T('tq-jose-cuervo-rep-1l','José Cuervo','José Cuervo Reposado 1 L','Tequila joven de estilo dorado elaborado con una mezcla de tequilas reposado (añejo) y más jóvenes.',31.99,12,365),
T('tq-jose-cuervo-blanco-075','José Cuervo','José Cuervo Blanco 0,75 L','Resultado de la mezcla de hasta 40 whiskies de single malt y de grano en cada botella, tiene un añejamiento mínimo de 5 años.',null,12,null),
T('tq-jose-cuervo-blanco-1l','José Cuervo','José Cuervo Blanco 1 L','Resultado de la mezcla de hasta 40 whiskies de single malt y de grano en cada botella, tiene un añejamiento mínimo de 5 años.',31.99,12,365),
T('tq-arraigo-blanco-075','Arraigo','Arraigo Blanco 0,75 L','Transparente como el agua. Se obtiene después de la tercera destilación, resaltando el sabor de agave, con más cuerpo e intensidad que otros tequilas blancos. Tiene un sabor más puro.',42.80,12,492),
T('tq-arraigo-rep-075','Arraigo','Arraigo Reposado 0,75 L','Tequila con sabor único gracias a su elaboración 100% de agave azul, proveniente principalmente de Jalisco, México. Elaborado mediante un proceso cuidadoso de destilación.',42.80,12,492),

T('tq-jimador-blanco-075','El Jimador','El Jimador Blanco 0,75 L','Joven y fresco, elaborado con agave azul Weber cosechado a mano al 100% y doblemente destilado.',null,12,null),
T('tq-jimador-blanco-1l','El Jimador','El Jimador Blanco 1 L','Joven y fresco, elaborado con agave azul Weber cosechado a mano al 100% y doblemente destilado.',null,12,null),
T('tq-jimador-rep-075','El Jimador','El Jimador Reposado 0,75 L','Con 100% agave azul Weber cosechado a mano, fermentado naturalmente y doblemente destilado. Reposa dos meses en barricas de roble americano artesanales.',null,12,null),
T('tq-jimador-rep-1l','El Jimador','El Jimador Reposado 1 L','Con 100% agave azul Weber cosechado a mano, fermentado naturalmente y doblemente destilado. Reposa dos meses en barricas de roble americano artesanales.',null,12,null),
T('tq-jimador-anejo-075','El Jimador','El Jimador Añejo 0,75 L','Destilado dos veces a partir de agave azul Weber y madurado en barricas de roble americano durante 12 meses.',null,12,null),
T('tq-jimador-anejo-1l','El Jimador','El Jimador Añejo 1 L','Destilado dos veces a partir de agave azul Weber y madurado en barricas de roble americano durante 12 meses.',null,12,null),

T('tq-patron-silver-075','Patrón','Patrón Silver 0,75 L','Es 100% del mejor agave azul tequilana Weber. Elaborado en pequeñas cantidades y presentado en botellas enumeradas a mano.',76.50,6,444),
T('tq-patron-silver-1l','Patrón','Patrón Silver 1 L','Es 100% del mejor agave azul tequilana Weber. Elaborado en pequeñas cantidades y presentado en botellas enumeradas a mano.',null,6,null),
T('tq-patron-rep-075','Patrón','Patrón Reposado 0,75 L','Es 100% del mejor agave azul tequilana Weber, destilado cuidadosamente en pequeñas cantidades y añejado en barriles de roble durante más de dos meses.',92.50,12,1092),
T('tq-patron-anejo-075','Patrón','Patrón Añejo 0,75 L','Elaborado artesanalmente con agave Weber azul 100%. Añejado en roble durante más de 12 meses.',null,12,null),
T('tq-patron-anejo-1l','Patrón','Patrón Añejo 1 L','Elaborado artesanalmente con agave Weber azul 100%. Añejado en roble durante más de 12 meses.',75,6,420),
T('tq-patron-xo-cafe-075','Patrón','Patrón X.O Café 0,75 L','Patrón Silver y la esencia del café Arábica. Mezcla oscura y deliciosa, excelente para beber, en cócteles o como ingrediente de postre.',50,6,290),
T('tq-patron-roca-silver-075','Patrón','Patrón Roca Silver 0,75 L','Elaborado a mano con 100% agave azul Weber. El agave se hornea, se prensa con tahona de piedra volcánica, se fermenta y se destila en sus propias fibras.',95,6,540),

T('tq-frida-blanco-075','Frida Kahlo','Frida Kahlo Blanco 0,75 L','Tequila blanco joven producido tras la fermentación natural del agave durante cuatro días y destilado en alambiques de cobre tradicionales.',39,6,230),
T('tq-frida-rep-075','Frida Kahlo','Frida Kahlo Reposado 0,75 L','Tras la fermentación del agave durante 4 días, el tequila es envejecido durante 9 meses.',45.50,12,270),
T('tq-frida-anejo-075','Frida Kahlo','Frida Kahlo Añejo 0,75 L','Tras 4 días de fermentación natural y destilado en alambiques de cobre, es envejecido en barricas de roble americano durante al menos tres años.',63.50,12,360),
T('tq-frida-anejo-1l','Frida Kahlo','Frida Kahlo Añejo 1 L','Tras 4 días de fermentación natural y destilado en alambiques de cobre, es envejecido en barricas de roble americano durante al menos tres años.',null,6,null),

T('tq-don-julio-blanco-075','Don Julio','Don Julio Blanco 0,75 L','Elaborado con agave azul y un proceso de destilación de larga tradición. Conocido como tequila plateado, su sabor es fresco a agave y con toques cítricos.',85.50,6,500),
T('tq-don-julio-rep-075','Don Julio','Don Julio Reposado 0,75 L','Envejecido durante ocho meses en barricas de roble blanco americano. De color ámbar dorado y acabado rico y suave.',107.80,6,630),
T('tq-don-julio-anejo-075','Don Julio','Don Julio Añejo 0,75 L','Envejecido 18 meses en barricas de roble blanco americano. Rico, distintivo y complejo, con equilibrio entre agave y madera.',113.85,6,672),
T('tq-don-julio-70-075','Don Julio','Don Julio 70 0,75 L','Añejo cristalino que combina la suavidad de un tequila blanco y la complejidad de un tequila añejo.',128.50,6,762),
T('tq-don-julio-primavera-075','Don Julio','Don Julio Primavera 0,75 L','Toma el tradicional Reposado y lo termina en una barrica europea que anteriormente contenía vino infusionado con cáscara de naranja macerada, para obtener un sabor cítrico suave, sofisticado y ligero.',193.50,null,null),
T('tq-don-julio-1942-075','Don Julio','Don Julio 1942 0,75 L','Producido en lotes pequeños y añejado durante un mínimo de 2 años y medio, elaborado artesanalmente en homenaje al año en que Don Julio González comenzó su trayectoria.',285.90,null,null),

T('tq-dobel-silver-075','Maestro Dobel','Maestro Dobel Silver 0,75 L','Tequila increíblemente suave que presenta aromas y sabores complejos. Brillante y claro con toques plateados y cuerpo excepcional.',46.50,6,260),
T('tq-dobel-anejo-075','Maestro Dobel','Maestro Dobel Añejo 0,75 L','Lento y artesanal añejamiento en barricas de roble blanco americano durante 14 a 16 meses, con notas de vainilla, canela y manzana.',59.50,6,348),
T('tq-dobel-diamante-075','Maestro Dobel','Maestro Dobel Diamante 0,75 L','Tequila cristalino elaborado con agave 100% puro y formulado con una mezcla de Extra-Añejo, Añejo y Reposado. Después del añejamiento pasa por filtración.',67.50,6,396),

T('tq-1800-silver-075','1800','1800 Silver 0,75 L','Hecho 100% de agave azul Weber, cosechado en su punto máximo. El líquido se destila dos veces y se mezcla una selección especial de tequilas blancos.',null,12,null),
T('tq-1800-silver-1l','1800','1800 Silver 1 L','Hecho 100% de agave azul Weber, cosechado en su punto máximo. El líquido se destila dos veces y se mezcla una selección especial de tequilas blancos.',44.50,6,258),
T('tq-1800-anejo-075','1800','1800 Añejo 0,75 L','Utilizando 100% agave azul Weber, Añejo se envejece en barricas de roble francés durante un mínimo de 14 meses. Final especiado y bien redondeado.',41.50,6,228),
T('tq-1800-cristalino-075','1800','1800 Cristalino 0,75 L','Envejece en barricas de roble americano y francés durante 16 meses; luego se termina en barricas de vino de Oporto durante 6 meses más y se filtra.',64.95,6,381),
T('tq-herradura-silver-075','Herradura','Herradura Silver 0,75 L','Fabricado con base 100% de agave azul Weber madurado en la planta durante 9 o 10 años para conseguir su mejor punto de azúcar y sabor.',69.90,6,412),
T('tq-espolon-blanco-1l','Espolón','Espolón Blanco 1 L','Blanco, sin envejecer. Creado en Los Altos y destilado dos veces utilizando alambiques de columna y olla para un perfil suave y equilibrado.',28.80,6,162),
T('tq-casamigos-blanco-1l','Casamigos','Casamigos Blanco 1 L','Elaborado con 100% agave azul. Fermentación extremadamente lenta que otorga un sabor sublime y limpio. Realizado con agua purificada y de color transparente.',64,6,375),
T('tq-casamigos-rep-1l','Casamigos','Casamigos Reposado 1 L','Elaborado con 100% agave azul de 7 a 9 años. Su sabor es resultado de un proceso de fermentación de 80 horas.',69.50,6,408),
T('tq-casa-dragones-blanco-075','Casa Dragones','Casa Dragones Blanco 0,75 L','Agave azul 100% puro, de lote pequeño, elaborado para brindar la esencia del agave mediante un proceso centrado en la pureza, para un sabor fresco y suave.',285.50,6,1680),
T('tq-clase-azul-rep-075','Clase Azul','Clase Azul Reposado 0,75 L','Tequila ultra premium hecho con Agave Azul en cocción lenta. Añejado durante 8 meses en barricas de whiskey americano, con sabor a avellana y vainilla.',478.90,null,null),
T('tq-clase-azul-gold-075','Clase Azul','Clase Azul Gold 0,75 L','Tequila ultra premium inspirado en los atardeceres mexicanos. Combina Tequila Plata, un reposado en roble francés y un extra añejo terminado en barricas de jerez Pedro Ximénez.',1200,null,null),

T('tq-azulejos-silver-clasicos-075','Los Azulejos','Silver - Colección Azulejos Clásicos 0,75 L','100% agave Weber azul elaborado con método tradicional. Producido con agave de 7 a 10 años, fermentación lenta y extracción con prensa de rodillos.',63.50,null,null),
T('tq-azulejos-rep-clasicos-075','Los Azulejos','Reposado - Colección Azulejos Clásicos 0,75 L','100% agave Weber azul elaborado con método tradicional. Añejado en barricas de bourbon durante 6 meses y sin aditivos.',79.80,null,null),
T('tq-azulejos-anejo-talavera-075','Los Azulejos','Añejo - Colección Talavera 0,75 L','Inspirada en diseños de azulejos de haciendas. Producido con agave de 7 a 10 años, doble destilado y añejado en barricas de bourbon durante 18 meses.',115.50,null,null),
T('tq-azulejos-anejo-masterpiece-075','Los Azulejos','Añejo - Colección Masterpiece 0,75 L','100% agave Weber azul elaborado con método tradicional. Producido con agave de 7 a 10 años, doble destilado y añejado en bourbon durante 18 meses.',135,null,null),
T('tq-azulejos-rep-masterpiece-075','Los Azulejos','Reposado - Colección Masterpiece 0,75 L','100% agave Weber azul elaborado con método tradicional. Producido con agave de 7 a 10 años y añejado en bourbon durante 6 meses sin aditivos.',99.50,null,null),
T('tq-azulejos-rep-trofeo-075','Los Azulejos','Reposado - Colección Cabeza de Trofeo 0,75 L','Elaborado con método tradicional, agave de 7 a 10 años, doble destilado y añejado en barricas de bourbon durante 6 meses sin aditivos.',99.75,null,null),
T('tq-azulejos-anejo-trofeo-075','Los Azulejos','Añejo - Colección Cabeza de Trofeo 0,75 L','Elaborado con método tradicional, agave de 7 a 10 años, doble destilado y añejado en barricas de bourbon durante 18 meses.',117,null,null),
T('tq-skelly-silver-075','Los Azulejos Skelly','Skelly Silver 0,75 L','Botella de arcilla de Talavera hecha a mano en forma de esqueleto; utiliza agaves de 7-10 años cocinados en hornos tradicionales de ladrillo.',63.50,null,null),
T('tq-skelly-rep-075','Los Azulejos Skelly','Skelly Reposado 0,75 L','100% agave, añejado en barricas de roble premium durante seis meses. Tequila digno de beberse a sorbos para realmente disfrutar.',94.50,null,null),
T('tq-skelly-anejo-075','Los Azulejos Skelly','Skelly Añejo 0,75 L','100% agave. Reposa pacientemente durante 18 meses en roble de primera calidad hasta alcanzar la perfección.',114.50,null,null),

T('tq-chiapas-blanco-070','Chiapas','Chiapas Blanco 0,70 L','Licor seco a base de tequila blanco. Ideal para mezclas y cocteles.',6.50,12,72),
T('tq-chiapas-rep-070','Chiapas','Chiapas Reposado 0,70 L','Licor seco a base de tequila dorado. Ideal para mezclas y cocteles.',7,12,78),
T('tq-sol-maya-070','Sol Maya','Sol Maya 0,70 L','Licor seco a base de tequila blanco. Ideal para mezclas y cocteles.',7,12,78),
T('tq-tequirita-blanco-070','Tequirita','Tequirita Blanco 0,70 L','Licor seco a base de tequila blanco. Ideal para mezclas y cocteles.',6.50,12,72),
T('tq-tequirita-limon-070','Tequirita','Tequirita Limón 0,70 L','Licor seco a base de tequila blanco con sabor a limón. Ideal para mezclas y cocteles.',5.50,12,60),
T('tq-tequirita-fruta-070','Tequirita','Tequirita Fresa & Parchita 0,70 L','Licor seco a base de tequila blanco con sabor. Ideal para mezclas y cocteles.',5.50,12,60),
];
