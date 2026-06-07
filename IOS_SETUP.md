# 📱 Publicar Portal Services en iOS App Store

Esta app usa **Capacitor** para envolver el web (`portalservices.digital`) en un
shell nativo iOS. Cuando publiques una versión nueva en Vercel, la app la toma
al instante — no hay que recompilar el binario salvo que toques permisos nativos.

---

## 1) Lo que tenés que tener listo

- ✅ Mac (lo tenés)
- ✅ Cuenta Apple Developer Program activa ($99/año) — ya pagada
- ⬜ **Xcode** (descarga gratis del App Store del Mac, ~10 GB, 1-2 h)
- ⬜ **Command Line Tools** — abre Terminal y corre:
  ```bash
  xcode-select --install
  ```
- ⬜ **CocoaPods** — gestor de dependencias nativas:
  ```bash
  sudo gem install cocoapods
  ```

Verificá Xcode con:
```bash
xcode-select -p
# Debe imprimir algo como /Applications/Xcode.app/Contents/Developer
```

---

## 2) Setup local de la app iOS

En tu Mac, clonás el repo y entrás al folder:

```bash
git clone https://github.com/Mauro1563/portal--services-website.git
cd portal--services-website
pnpm install
```

Instalá las dependencias nativas + generá los íconos:

```bash
# Genera todos los tamaños de ícono iOS desde resources/icon.png
npx capacitor-assets generate --ios

# Sincroniza la config + instala los pods nativos
npx cap sync ios
```

---

## 3) Abrir en Xcode

```bash
npx cap open ios
```

Eso abre `ios/App/App.xcworkspace` en Xcode.

En el panel izquierdo de Xcode, click en **App** (proyecto azul) → tab **Signing & Capabilities**:

- **Team:** elegí tu cuenta Apple Developer del dropdown
- **Bundle Identifier:** `com.portalservices.digital` (ya configurado)
- Xcode auto-genera el certificado y provisioning profile

---

## 4) Probar en tu iPhone

1. Conectá tu iPhone con cable USB al Mac
2. En Xcode, arriba al lado del botón ▶, elegí tu iPhone del dropdown de devices
3. Click ▶ — compila + instala + abre la app en tu iPhone
4. La primera vez tu iPhone va a pedir confirmar el certificado developer:
   - iPhone → Settings → General → VPN & Device Management → tu Apple ID → Trust

---

## 5) Subir a App Store Connect

### a) Crear la app en App Store Connect

1. Andá a https://appstoreconnect.apple.com
2. **My Apps → + → New App**
3. Plataforma: **iOS**
4. Name: `Portal Services` (lo que verán los usuarios)
5. Primary Language: Spanish
6. Bundle ID: seleccioná `com.portalservices.digital`
7. SKU: `portal-services-2026`
8. Click **Create**

### b) Configurar el listing (info que ve el usuario)

En App Store Connect → tu app → tab **App Information**:

- **Category:** Business
- **Privacy Policy URL:** `https://portalservices.digital/privacy`
- **Terms of Service URL:** `https://portalservices.digital/terms`

Tab **Pricing and Availability**:
- **Free** (el SaaS cobra desde el web, no IAP)

Tab **App Privacy** (obligatorio):
- Click **Get Started**
- Declarar datos que recopilas: Email (linked to user), Location (GPS check-in), Camera (photos)
- Apple te guía pregunta por pregunta

Tab **iOS App** → versión 1.0:
- **Promotional text:** ej. "Gestiona tu empresa de limpieza desde una sola plataforma"
- **Description:** copia de tu marketing site
- **Keywords:** limpieza, hogar, airbnb, cleaning, propiedades, servicios
- **Support URL:** `https://portalservices.digital`
- **Marketing URL:** `https://portalservices.digital`
- **Screenshots:** mín 1 por device class (iPhone 6.7", iPhone 6.5", iPad 12.9"). Usá las pantallas reales — el preview que armamos sirve.

### c) Build desde Xcode → subir

En Xcode, arriba al lado del play ▶:

1. Cambiá el destino a **Any iOS Device (arm64)** (NO un simulador)
2. Menu **Product → Archive** (tarda 2-3 min)
3. Cuando termine se abre **Organizer**:
   - Click **Distribute App**
   - **App Store Connect**
   - **Upload**
   - Acepta los defaults
   - Sign In con tu Apple ID
   - **Upload**
4. Esperá 10-30 min — Apple procesa el binario
5. Volvés a App Store Connect → tu app → versión 1.0 → **Build** → seleccioná el upload que apareció
6. Click **Submit for Review**

### d) Review de Apple

- Tarda **1-3 días** normalmente
- Te llega un email con el resultado
- **Si rechazan**: el email te dice por qué. Causas típicas para apps webview:
  - "Falta valor nativo" → asegurate que la cámara/GPS funcionan
  - "Bug X en pantalla Y" → arregla en el web, no necesitás re-subir el binario
- Cuando aprueban: click **Release this version** → en 1-2 h está en la App Store

---

## 6) Updates posteriores

### Si solo cambiás el web (lo más común):
- Push a `main` → Vercel autodespliega → la app lo toma al instante ✓

### Si tocás permisos / nuevas APIs nativas:
```bash
cd portal--services-website
git pull
npx cap sync ios
npx cap open ios
# Subir build version en Xcode, Archive, Upload
```

---

## 🎨 Personalizar el ícono / splash

- **Ícono:** reemplazá `resources/icon.png` (debe ser 1024×1024, fondo opaco) y corré `npx capacitor-assets generate --ios`
- **Splash screen:** crea `resources/splash.png` (2732×2732, centro vacío de 1024×1024). Mismo comando.

---

## 🆘 Problemas comunes

| Problema | Solución |
|---|---|
| `pod install` falla | `sudo gem install cocoapods` + `cd ios/App && pod install` |
| Xcode "No matching signing certificate" | En Signing & Capabilities, click **Try Again** o **Add Account** |
| App muestra pantalla en blanco | Revisá `capacitor.config.ts` → `server.url` es accesible, prueba `curl https://portalservices.digital` |
| App rechazada por Apple | Lee el email; respondé desde Resolution Center con captures de la cámara/GPS funcionando |
