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
export default function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const userAgent = request.headers.get('user-agent') || '';

    const isBot = /Googlebot|Bingbot|DuckDuckBot|Slurp|YandexBot/i.test(userAgent);

    // ✅ Evita redirección para bots
    if (isBot && pathname === '/') {
        return NextResponse.next();
    }

    // ✅ Redirige solo en la raíz del sitio
    if (pathname === '/') {
        const url = request.nextUrl.clone();
        url.pathname = '/es'; // o '/en' si quieres usar otro idioma por defecto
        return NextResponse.redirect(url, 302);
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
