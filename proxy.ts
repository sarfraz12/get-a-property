import { NextRequest, NextResponse } from "next/server";
import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { i18n } from "./i18n.config";

// Get Locale Handler
function getLocale(request: NextRequest): string | undefined {
    const negotiatorHeaders: Record<string, string> = {};
    request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

    const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
    const locales: string[] = i18n.locales;
    return matchLocale(languages, locales, i18n.defaultLocale);
}

// Middleware
export default function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // BUG REAL corregido (encontrado durante la auditoría de SEO
    // previa al lanzamiento): antes, para bots (Googlebot/Bingbot/
    // etc.) la raíz "/" NO se redirigía a "/es" -- se dejaba pasar tal
    // cual con NextResponse.next(). El problema es que no existe
    // ningún app/page.tsx en la raíz del proyecto (todo el contenido
    // vive bajo app/(website)/[lang]/...), así que Googlebot recibía
    // un 404 al visitar el dominio pelado (https://tudominio.com/) --
    // justo la URL más importante del sitio para SEO. Se quita el
    // trato especial para bots: ahora TODOS (bots y personas) reciben
    // el mismo redirect 301 (permanente -- antes era 302/temporal,
    // que le dice a Google que no consolide el "link equity" de "/"
    // hacia "/es") hacia el idioma por defecto. Un redirect es 100%
    // normal para SEO (Google lo sigue sin penalizar); un 404 en la
    // raíz del dominio no lo es.
    if (pathname === '/') {
        const url = request.nextUrl.clone();
        url.pathname = '/es'; // o '/en' si quieres usar otro idioma por defecto
        return NextResponse.redirect(url, 301);
    }

    const pathnameIsMissingLocale = i18n.locales.every(
        (locale) =>
            !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
    );

    // Skip middleware for sitemap, robots.txt, etc.
    if (
        pathname === '/sitemap.xml' ||
        pathname === '/robots.txt' ||
        pathname === '/favicon.ico'
    ) {
        return NextResponse.next();
    }

    if (pathnameIsMissingLocale) {
        const locale = getLocale(request);
        return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url));
    }

    return NextResponse.next();
}

// ✅ Matcher
export const config = {
    matcher: [
        /*
         * Run middleware on all routes except:
         * - static files
         * - sitemap, robots.txt, favicon, studio, etc.
         */
        '/((?!api|_next/static|_next/image|pages/api/|public|appletouchicon|favicon.ico|robots.txt|sitemap.xml|studio|images|opengraph-image).*)',
    ],
};
