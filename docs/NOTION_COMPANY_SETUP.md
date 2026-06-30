# Conectar Notion con /hq/company

Esta guía te lleva paso a paso para que la página interna `/hq/company` lea los datos reales del inventario de tu empresa desde Notion. No te preocupes si nunca lo has hecho: es más fácil de lo que parece.

> Nota: si no configuras nada, la página sigue funcionando. Verás la estructura con datos de ejemplo y un banner que dice **"Sin Notion conectado — datos de ejemplo"**. Cuando termines esta guía, esos datos serán reemplazados por los reales de tu Notion.

---

## 1. Crear la integración de Notion

1. Abre [notion.so/my-integrations](https://www.notion.so/my-integrations) en tu navegador.
2. Pulsa **"+ New integration"**.
3. Ponle de nombre: **`Zapli Company Sync`**.
4. Asocia la integración al workspace correcto (el de tu empresa).
5. En **Capabilities** deja activadas las opciones de lectura (Read content). No necesitas más para empezar.
6. Guarda y entra en la integración recién creada.
7. Copia el **Internal Integration Secret** (empieza por `secret_...` o `ntn_...`). Lo necesitarás más adelante. Guárdalo en un sitio seguro.

---

## 2. Crear la base de datos en Notion

Ahora vamos a crear la tabla donde irá toda la info de la empresa.

1. En Notion, crea una nueva página y dentro añade una **Database — Full page**.
2. Ponle de nombre: **`Zapli Company Inventory`**.
3. Configura **exactamente** estas propiedades (los nombres deben coincidir, respetando mayúsculas y espacios):

| Propiedad        | Tipo        | Para qué sirve                                    |
|------------------|-------------|---------------------------------------------------|
| `Name`           | Title       | Nombre del servicio o ítem                        |
| `Category`       | Select      | Categoría — opciones: `Stack`, `Costos`, `Repos`, `Socios`, `Cuentas`, `Legal` |
| `Status`         | Select      | Estado — opciones: `Activo`, `Inactivo`, `Test`   |
| `URL`            | URL         | Link al dashboard, repo o documento               |
| `Monthly Cost`   | Number      | Coste mensual en EUR                              |
| `Account Email`  | Email       | Email de pago o administración                    |
| `Notes`          | Rich text   | Descripción libre                                 |
| `Owner`          | Text        | Quién lo gestiona dentro del equipo               |

> Truco: para los `Select` añade ya todas las opciones desde el inicio. Así evitas typos cuando empieces a meter filas.

---

## 3. Compartir la base de datos con la integración

Notion no le da acceso a tu integración por defecto. Hay que invitarla explícitamente.

1. Abre la base de datos `Zapli Company Inventory` en Notion.
2. Arriba a la derecha, pulsa **`•••`** → **`Connections`** (o **`Share`** según la versión).
3. Busca **`Zapli Company Sync`** y selecciónala.
4. Confirma. A partir de aquí, la integración ya puede leer las filas.

Si te olvidas de este paso, la API te devolverá un 404 — es el error más común.

---

## 4. Copiar el Database ID

Cada base de datos en Notion tiene un ID de 32 caracteres. Lo sacamos de la URL.

1. Con la base de datos abierta a pantalla completa, mira la URL del navegador. Algo así:

   ```
   https://www.notion.so/tuworkspace/Zapli-Company-Inventory-1a2b3c4d5e6f7890abcd1234ef567890?v=...
   ```

2. El **Database ID** es ese bloque de 32 caracteres entre el último guion del título y el `?v=`:

   ```
   1a2b3c4d5e6f7890abcd1234ef567890
   ```

3. Cópialo. Da igual si lo guardas con o sin guiones — los dos formatos funcionan.

---

## 5. Configurar Vercel

Ahora le decimos a la web dónde está la integración y la base.

1. Entra en [vercel.com](https://vercel.com), abre el proyecto del portal.
2. Ve a **Settings → Environment Variables**.
3. Añade estas dos variables:

   | Nombre                  | Valor                                       |
   |-------------------------|---------------------------------------------|
   | `NOTION_API_KEY`        | El secret que copiaste en el paso 1         |
   | `NOTION_COMPANY_DB_ID`  | El Database ID del paso 4                   |

4. Para cada una, marca los tres entornos: **Production**, **Preview** y **Development**. Así funcionarán en cualquier deploy y también en local si te traes las env vars.
5. Guarda.

---

## 6. Redesplegar

Vercel no aplica nuevas env vars al deploy actual. Tienes dos opciones:

- Espera al próximo push a `main` y se aplicarán solas.
- O fuerza un redeploy desde **Deployments → •••  → Redeploy**.

---

## 7. Verificar

1. Entra (logueado como admin) a:

   ```
   https://hq.portalservices.digital/hq/company
   ```

2. Si todo está bien:
   - El banner **"Sin Notion conectado — datos de ejemplo"** desaparece.
   - Las filas que veas son las que tienes en tu base `Zapli Company Inventory`.

3. Si sigues viendo el banner o un error:
   - Repasa el paso 3 (¿está la integración invitada a la base?).
   - Verifica que el `NOTION_COMPANY_DB_ID` es correcto.
   - Comprueba que el deploy nuevo terminó con éxito en Vercel.

---

¡Listo! A partir de ahora, cualquier cambio que hagas en Notion se reflejará en `/hq/company` en el siguiente refresco de la página. Sin código, sin despliegues.
