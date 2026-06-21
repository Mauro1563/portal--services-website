-- Portal Home booking engine — seed data. Idempotent via ON CONFLICT
-- and existence checks so it can be re-run safely.

insert into public.booking_services (key, name_i18n, description_i18n, base_price, sort) values
  ('std',  '{"es":"Limpieza estándar","en":"Standard cleaning","pt":"Limpeza padrão"}',
           '{"es":"Limpieza regular para mantener tu casa al día.","en":"Regular cleaning to keep your home tidy.","pt":"Limpeza regular para manter a casa em dia."}',
           25, 1),
  ('deep', '{"es":"Limpieza profunda","en":"Deep cleaning","pt":"Limpeza profunda"}',
           '{"es":"Limpieza a fondo de cocina, baños y todas las áreas.","en":"Deep clean of kitchen, bathrooms and all areas.","pt":"Limpeza a fundo da cozinha, banheiros e todas as áreas."}',
           45, 2),
  ('bnb',  '{"es":"Turnover Airbnb","en":"Airbnb turnover","pt":"Turnover Airbnb"}',
           '{"es":"Limpieza entre huéspedes con reposición de amenities.","en":"Between-guest clean with amenity restock.","pt":"Limpeza entre hóspedes com reposição de amenities."}',
           38, 3),
  ('win',  '{"es":"Limpieza de cristales","en":"Window cleaning","pt":"Limpeza de vidros"}',
           '{"es":"Limpieza interior y exterior de ventanas.","en":"Inside and outside window cleaning.","pt":"Limpeza interna e externa de janelas."}',
           22, 4),
  ('post', '{"es":"Limpieza fin de obra","en":"Post-construction clean","pt":"Limpeza pós-obra"}',
           '{"es":"Limpieza profunda tras reforma u obra.","en":"Deep clean after renovation or construction.","pt":"Limpeza profunda após reforma ou obra."}',
           70, 5)
on conflict (key) do nothing;

insert into public.booking_extras (key, label_i18n, price, sort) values
  ('oven',    '{"es":"Horno","en":"Oven","pt":"Forno"}',                                          12, 1),
  ('fridge',  '{"es":"Frigorífico","en":"Fridge","pt":"Geladeira"}',                              10, 2),
  ('windows', '{"es":"Ventanas","en":"Windows","pt":"Janelas"}',                                  15, 3),
  ('iron',    '{"es":"Planchado","en":"Ironing","pt":"Passar roupa"}',                            18, 4),
  ('linen',   '{"es":"Cambio de sábanas","en":"Linen change","pt":"Troca de roupa de cama"}',      8, 5)
on conflict (key) do nothing;

-- Singleton row: only inserts if empty (the unique index enforces single row).
insert into public.booking_pricing_config (size_add, bath_rate, freq_discounts)
select
  '{"studio":0,"1":8,"2":18,"3":30,"4":44}'::jsonb,
  6,
  '{"once":0,"weekly":0.20,"biweekly":0.15,"monthly":0.10}'::jsonb
where not exists (select 1 from public.booking_pricing_config);

insert into public.booking_professionals (name, rating, jobs) values
  ('María García',     4.92, 312),
  ('Carlos Méndez',    4.85, 248),
  ('Isabel Rodríguez', 4.97, 401)
on conflict do nothing;
