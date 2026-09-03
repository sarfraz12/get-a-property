// components/generalUse/themeSwitch.tsx
//
// Selector de tema claro/oscuro (usa next-themes). Se usa en el pie de
// página (components/navigation/footer.js).
//
// BUG DE HIDRATACIÓN CORREGIDO (React error #418 en producción/Vercel,
// visible en get-a-property.vercel.app pero NO en `next dev`): este
// componente leía `theme` de useTheme() y lo usaba directo en
// `<select value={theme}>`. next-themes, a propósito, no puede saber
// en el SERVIDOR cuál es el tema real del visitante (depende de
// localStorage o de `prefers-color-scheme` del sistema operativo, que
// sólo existen en el navegador) -- así que en el build estático de
// Vercel el servidor siempre asume un valor por defecto, mientras que
// en el navegador del visitante, apenas monta, next-themes puede
// resolver un valor DISTINTO (ej. "dark" si su sistema operativo está
// en modo oscuro). Ese desajuste entre lo que mandó el servidor y lo
// que React esperaba en el primer render del cliente es exactamente
// un "hydration mismatch". No se veía en `next dev` porque ahí el
// navegador de prueba ya tenía un tema guardado en localStorage (bajo
// el origen localhost:3000) que coincidía con el default -- pero en
// producción (get-a-property.vercel.app), un visitante nuevo sin nada
// guardado y con su sistema en modo oscuro dispara el error en CADA
// carga.
//
// La documentación de next-themes es explícita sobre esto: cualquier
// UI que dependa de `theme`/`resolvedTheme` debe esperar a que el
// componente esté montado en el cliente antes de mostrarse (con
// exactamente este patrón). Antes este bloque estaba comentado en el
// código -- se reactiva acá para corregir el error real de producción.
"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { SunIcon } from "@heroicons/react/24/outline";

const ThemeSwitch = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect sólo corre en el cliente, después de la hidratación --
  // recién ahí es seguro mostrar UI que depende del tema real.
  useEffect(() => {
    // Patrón de sincronización con un sistema externo (¿ya montamos en
    // el cliente?), no un derivado de estado -- mismo patrón/exención
    // ya usado en este código (ver navbar.tsx y CookieNotice.tsx).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="inline-flex items-center">
      <SunIcon className="w-4 h-4 mr-2" />
      <select
        name="themeSwitch"
        value={theme}
        onChange={e => setTheme(e.target.value)}>
        <option value="system">System</option>
        <option value="dark">Dark</option>
        <option value="light">Light</option>
      </select>
    </div>
  );
};

export default ThemeSwitch;
