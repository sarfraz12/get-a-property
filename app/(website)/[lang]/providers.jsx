"use client";

import { ThemeProvider } from "next-themes";

// BUG CORREGIDO: defaultTheme="light" forzaba modo claro para
// cualquier visitante nuevo (sin preferencia guardada en
// localStorage), incluso si su sistema operativo estaba en modo
// oscuro -- por eso "System" en el selector del footer (ver
// components/generalUse/themeSwitch.tsx) no parecía "funcionar" en la
// primera visita: el valor por defecto ya estaba fijado en "light" en
// vez de resolverse según prefers-color-scheme. defaultTheme="system"
// (+ enableSystem, que además agrega el listener que reacciona si el
// visitante cambia el tema de su sistema operativo mientras el sitio
// está abierto) hace que un visitante nuevo vea automáticamente claro
// u oscuro según su sistema, y que elegir "System" en el selector
// vuelva a ese comportamiento en cualquier momento.
export function Providers({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  );
}
