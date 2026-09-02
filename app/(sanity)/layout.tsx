import "./reset.css";

import type { Metadata } from "next";
import { getSettings } from "@/lib/sanity/client";
import { getFaviconIcons } from "@/lib/sanity/favicon";

// El studio vive en su propio route group (sanity), con su propio
// root layout -- no comparte metadata con app/(website)/[lang]/layout.tsx.
// Sin esto, la pestaña de /studio no declara ningun <link rel="icon">
// propio, y el navegador cae solo al public/favicon.ico genérico en
// vez del favicon real (Settings -> fieldset "Favicon" en Sanity) que
// sí usa el resto del sitio. Se arma con la misma función que ya usan
// todas las páginas de app/(website) para que las pestañas del studio
// y del sitio muestren el mismo ícono.
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    icons: getFaviconIcons(settings),
  };
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
