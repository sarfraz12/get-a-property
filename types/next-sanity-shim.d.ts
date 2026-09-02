// next-sanity@13.3.3 no publica dist/index.d.ts ni dist/studio/index.d.ts
// (bug de empaquetado río arriba: el resto de subpaths -- image,
// draft-mode, hooks, live/cache-life -- sí traen sus .d.ts, pero estos
// dos no). Sin este shim, tsc falla con TS7016 en cada import de estos
// dos módulos. Este archivo no cambia nada en tiempo de ejecución --
// sólo evita que el checker se queje de una declaración de tipos que
// el propio paquete no entrega.
declare module "next-sanity";
declare module "next-sanity/studio";
// Mismo caso que arriba, para el subpath usado por
// app/api/revalidate/route.ts (parseBody, para validar el webhook de
// Sanity).
declare module "next-sanity/webhook";
