// app/robots.ts
//
// Reemplaza al app/robots.txt estático anterior, que tenía el dominio
// hardcodeado ("https://www.getaproperty.com.pa") de forma
// independiente al resto del sitio -- eso significaba que un cambio
// de dominio (como el que se hizo en esta sesión) podía dejar el
// robots.txt apuntando a un Sitemap con el dominio VIEJO sin que nada
// avisara. Ahora usa la MISMA variable de entorno que app/sitemap.ts
// (NEXT_PUBLIC_SITE_URL), así que ambos siempre están de acuerdo.
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseURL = process.env.NEXT_PUBLIC_SITE_URL as string;

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/studio/',
    },
    sitemap: `${baseURL}/sitemap.xml`,
  };
}
