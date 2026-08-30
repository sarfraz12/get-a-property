// lib/sanity/components/StudioLogo.tsx
//
// Reemplaza el título estático del Studio ("Get a Property", fijado
// en sanity.config.ts) por uno que sigue en vivo al campo
// "title" (Site title) del documento singleton "settings" -- así,
// si el negocio cambia de nombre algún día, sólo hace falta editarlo
// una vez en Settings y el título de arriba del Studio (la barra de
// navegación superior, junto al logo) se actualiza solo, sin tocar
// código ni volver a desplegar.
//
// Se conecta con sanity.config.ts vía `studio.components.logo` (la
// forma soportada por Sanity Studio v3 para reemplazar el logo/título
// de la barra superior -- ver
// https://www.sanity.io/docs/studio-configuration#branding).
//
// client.listen(...) mantiene el título sincronizado en tiempo real
// (si alguien más edita Settings mientras el Studio está abierto, se
// actualiza sin recargar la página); el fetch inicial evita esperar al
// primer evento del listener para mostrar el nombre real la primera vez.
import { useEffect, useState } from "react";
import { useClient } from "sanity";
import { apiVersion } from "../config";

const SETTINGS_TITLE_QUERY = `*[_type == "settings"][0]{ title }`;
// Mismo valor de respaldo que ya usa sanity.config.ts si Settings
// todavía no tiene "Site title" completado.
const FALLBACK_TITLE = "Get a Property";

export function StudioLogo() {
  const client = useClient({ apiVersion });
  const [title, setTitle] = useState<string>(FALLBACK_TITLE);

  useEffect(() => {
    let active = true;

    client
      .fetch(SETTINGS_TITLE_QUERY)
      .then((settings: { title?: string } | null) => {
        if (active && settings?.title) setTitle(settings.title);
      })
      .catch(() => {
        // Sin conexión o sin permisos todavía (ej. primer login): se
        // deja el respaldo, no rompe el Studio.
      });

    const subscription = client.listen(SETTINGS_TITLE_QUERY).subscribe({
      next: (update: any) => {
        const nextTitle = update?.result?.title;
        if (active && nextTitle) setTitle(nextTitle);
      },
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [client]);

  return <span style={{ fontWeight: 700 }}>{title}</span>;
}
