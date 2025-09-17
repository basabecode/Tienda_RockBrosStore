-- Script para actualizar productos con imágenes y precios colombianos
-- Ejecutar en Supabase SQL Editor

-- Primero, limpiar productos existentes
DELETE FROM public.products;

-- Insertar productos actualizados con imágenes y precios en pesos colombianos
INSERT INTO public.products (
  name,
  slug,
  description,
  price,
  main_image,
  category,
  brand,
  stock,
  is_featured,
  is_active,
  rating,
  review_count
) VALUES
(
  'RockBros MTB Pro 2025',
  'rockbros-mtb-pro-2025',
  'Bicicleta de montaña full suspension con componentes de alta gama para terrenos extremos',
  18500000, -- 18.5 millones de pesos colombianos
  'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=400&fit=crop',
  'Bicicletas de Montaña',
  'RockBros',
  15,
  true,
  true,
  4.8,
  24
),
(
  'Trek Fuel EX 9.8',
  'trek-fuel-ex-9-8',
  'Bicicleta e-MTB con motor Bosch y batería integrada de larga duración',
  35000000, -- 35 millones de pesos colombianos
  'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=400&fit=crop',
  'Bicicletas de Montaña',
  'Trek',
  8,
  true,
  true,
  4.9,
  18
),
(
  'Giant Trance X Advanced Pro',
  'giant-trance-x-advanced-pro',
  'Bicicleta de trail con cuadro Advanced Composite ultraliviano',
  25500000, -- 25.5 millones de pesos colombianos
  'https://images.unsplash.com/photo-1544191696-15693346b302?w=400&h=400&fit=crop',
  'Bicicletas de Montaña',
  'Giant',
  12,
  true,
  true,
  4.7,
  31
),
(
  'Specialized Epic Pro',
  'specialized-epic-pro',
  'Bicicleta de cross-country con Brain technology para competición',
  23800000, -- 23.8 millones de pesos colombianos
  'https://images.unsplash.com/photo-1502744688674-c619d1586c9c?w=400&h=400&fit=crop',
  'Bicicletas de Montaña',
  'Specialized',
  10,
  false,
  true,
  4.6,
  15
),
(
  'RockBros Urban Commuter',
  'rockbros-urban-commuter',
  'Bicicleta urbana perfecta para el transporte diario en la ciudad',
  2800000, -- 2.8 millones de pesos colombianos
  'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=400&fit=crop',
  'Bicicletas Urbanas',
  'RockBros',
  25,
  true,
  true,
  4.3,
  42
),
(
  'Trek Domane SL 6',
  'trek-domane-sl-6',
  'Bicicleta de ruta con tecnología IsoSpeed para máximo confort',
  12500000, -- 12.5 millones de pesos colombianos
  'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&h=400&fit=crop',
  'Bicicletas de Ruta',
  'Trek',
  18,
  true,
  true,
  4.7,
  28
),
(
  'Casco RockBros Pro Shield',
  'casco-rockbros-pro-shield',
  'Casco de alta protección con certificación MIPS y ventilación avanzada',
  450000, -- 450 mil pesos colombianos
  'https://images.unsplash.com/photo-1544966503-7cc5ac882d57?w=400&h=400&fit=crop',
  'Accesorios',
  'RockBros',
  50,
  true,
  true,
  4.5,
  67
),
(
  'Luces LED RockBros Set',
  'luces-led-rockbros-set',
  'Kit completo de luces LED delantera y trasera, recargables por USB',
  180000, -- 180 mil pesos colombianos
  'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=400&fit=crop',
  'Accesorios',
  'RockBros',
  100,
  false,
  true,
  4.4,
  89
);

-- Verificar que los productos se insertaron correctamente
SELECT
  name,
  price,
  main_image IS NOT NULL as has_image,
  category,
  brand,
  stock,
  is_active
FROM public.products
ORDER BY price DESC;
