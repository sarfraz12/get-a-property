// instrumentation-client.ts
//
// DIAGNÓSTICO TEMPORAL para el error de hidratación (React #418) que
// aparece en producción (www.getaproperty.com.pa) pero no en `next
// dev` -- ver commit "fix: corregir hydration mismatch..." de esta
// misma sesión, que corrigió un caso real (ThemeSwitch) pero el error
// SIGUE apareciendo, así que hay otra causa sin identificar todavía.
//
// Next.js ejecuta este archivo automáticamente ANTES de que React
// hidrate (ver docs: "instrumentation-client.js" -- corre después de
// cargar el HTML pero antes de la hidratación), así que es el único
// lugar donde se puede "atrapar" el error de hidratación completo
// (sin cortar) apenas ocurre, sin pelear con condiciones de carrera.
//
// Sólo guarda el mensaje/stack completo en localStorage (nada se
// manda a ningún servidor de terceros) para poder leerlo después
// desde afuera y ver el detalle real que React no muestra en
// producción (ahí el mensaje sale "minificado", sólo con un link a
// react.dev/errors/418 + argumentos en la URL). Con eso se puede
// identificar la causa real y aplicar el fix correcto.
//
// BORRAR este archivo en cuanto el bug esté identificado y corregido
// -- es sólo una herramienta de diagnóstico, no debe quedar en el
// sitio para siempre.
window.addEventListener("error", (event) => {
  try {
    const msg = String(event?.error?.message || event?.message || "");
    if (!/Minified React error #41[89]|#425/.test(msg)) return;

    const entry = {
      message: msg,
      stack: String(event?.error?.stack || ""),
      url: window.location.href,
      time: new Date().toISOString(),
    };

    const KEY = "__gap_hydration_debug";
    const existingRaw = localStorage.getItem(KEY);
    const existing = existingRaw ? JSON.parse(existingRaw) : [];
    existing.push(entry);
    // guarda como mucho las últimas 5 capturas
    localStorage.setItem(KEY, JSON.stringify(existing.slice(-5)));
  } catch {
    // nunca romper la carga real del sitio por culpa del diagnóstico
  }
});
