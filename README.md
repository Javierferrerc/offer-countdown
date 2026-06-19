# Offer Countdown — VTEX IO

Componente custom de VTEX IO que muestra un **contador regresivo** para una oferta por tiempo limitado en la Home: días, horas, minutos y segundos. Cuando la oferta termina, el contador se reemplaza por un mensaje de cierre.

El componente vive dentro del theme `armotosandbox.store` (el theme suma el builder `react`) y todo lo visible se configura desde el **Site Editor**.

## Requisitos

- Node.js >= 14
- [VTEX IO CLI](https://developers.vtex.com/docs/guides/vtex-io-cli-installation-and-command-reference)
- Acceso a la cuenta `armotosandbox`

## Instalación

Las dependencias de desarrollo (tipos y TypeScript, sólo para el chequeo local) viven en `react/`:

```bash
cd react
yarn install
```

## Linkear en VTEX

Desde la raíz del repo:

```bash
vtex login armotosandbox
vtex use javierferrer
vtex link
```

El componente ya viene declarado (`store/interfaces.json`) y agregado a la Home (`store/blocks/home/home.jsonc`), así que con el link alcanza para verlo en `https://javierferrer--armotosandbox.myvtex.com/`.

## Configuración (Site Editor)

El bloque **"Contador de Oferta"** expone cuatro props:

| Prop | Descripción |
|------|-------------|
| `showComponent` | Muestra u oculta el componente |
| `title` | Texto principal de la oferta |
| `finalDate` | Fecha y hora de fin (selector date-time) |
| `finishedText` | Texto al terminar la oferta |

## Cómo probar

1. Abrir `https://javierferrer--armotosandbox.myvtex.com/` y ver el contador bajando segundo a segundo.
2. En el **Site Editor**, sobre el bloque "Contador de Oferta":
   - Cambiar el **texto principal**.
   - Poner una **fecha pasada** → debe mostrar el texto de finalización.
   - Desmarcar **Mostrar componente** → desaparece sin romper la página.
3. Probar en **mobile** (DevTools responsive).

## Decisiones técnicas

- **Lógica separada en el hook `useCountdown`.** Guarda el `now` y deriva el tiempo restante en cada render (`target - now`) en vez de decrementar un contador; así no se desfasa si la pestaña se suspende o el intervalo se atrasa. El `setInterval` se limpia solo al llegar a la fecha.
- **Robustez ante config incompleta.** Si la fecha falta o es inválida, o si el editor ocultó el bloque, el componente devuelve `null`: nunca rompe la Home.
- **Estilos (handoff de diseño Motorola AR).** CSS Modules con los tokens del diseño: tipografía Manrope, acento azul `#1a6cff`, dígitos grandes estilo "plano" con animación tipo odómetro y punto "live" pulsante. Los colores quedan como CSS custom properties para poder retematizar desde el theme. Responsive con un breakpoint para mobile.
- **Formato de fecha local-independiente.** La fecha de fin se formatea a `dd/mm/aaaa hh:mm` sin depender del ICU del runtime, para evitar diferencias entre server y cliente (SSR).

## Estructura

```
.
├── manifest.json                  # vendor: armotosandbox, name: store (builders incl. react)
├── store/
│   ├── interfaces.json            # declara el bloque offer-countdown
│   └── blocks/home/home.jsonc     # incluye offer-countdown#home en la Home
└── react/
    ├── OfferCountdown.tsx          # componente + schema de Site Editor
    ├── components/TimeUnit.tsx     # grupo de dígitos (odómetro)
    ├── hooks/useCountdown.ts       # lógica del contador
    ├── styles.css                  # estilos (CSS Modules)
    └── typings/global.d.ts         # tipos del storefront + CSS Modules
```
