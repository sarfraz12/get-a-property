// components/navigation/backlink.tsx
//
// Botón flotante fijo (abajo a la derecha) que abre WhatsApp en una
// pestaña nueva -- se monta una sola vez en
// app/(website)/[lang]/layout.tsx, con el link real (settings.url)
// que carga desde Sanity.
//
// SEGUNDA vuelta de este componente, a pedido del usuario: quería que
// fuera MÁS llamativo/invasivo que la versión anterior (más discreta),
// con la forma real del ícono de WhatsApp (no un teléfono genérico),
// una animación de "palpitación" constante, y que se mueva un poco
// mientras se desliza la página. Cambios puntuales:
//
// 1) ÍCONO: antes era un <PhoneIcon> genérico de Heroicons. Ahora es
//    un SVG propio con la silueta clásica del auricular de WhatsApp
//    (la forma curva reconocible del logo real), no un teléfono recto
//    cualquiera.
// 2) PALPITACIÓN CONSTANTE: dos anillos que se expanden y se
//    desvanecen en bucle (animate-ping, con el segundo retrasado para
//    que no palpiten los dos exactamente juntos) detrás del círculo
//    sólido, más el círculo mismo "latiendo" (heartbeat, definida en
//    tailwind.config.ts: dos pulsos cortos y una pausa, como un pulso
//    real en vez de un simple fundido).
// 3) MOVIMIENTO AL HACER SCROLL: este archivo ahora es un Client
//    Component ("use client") porque escucha el evento "scroll" de la
//    ventana -- mientras el usuario desliza, se agrega una animación
//    corta de vaivén/inclinación (scrollWiggle, también en
//    tailwind.config.ts); 150ms después de que el scroll se detiene,
//    se quita sola.
// 4) ACCESIBILIDAD: las tres animaciones (ping x2, heartbeat,
//    scrollWiggle) llevan el prefijo "motion-safe:" de Tailwind -- si
//    la persona tiene activada la preferencia del sistema operativo
//    "reducir movimiento" (común en gente con mareo/migraña por
//    animaciones), Tailwind no aplica esas clases y el botón se queda
//    quieto, sólo con el degradé de marca. Es angosto de código y es
//    lo correcto: un botón que no se puede "apagar" y palpita sin
//    parar es un problema real de accesibilidad para esas personas.
//
// z-50: mismo nivel que el navbar (navbar.tsx) -- por encima del
// aviso de cookies (CookieNotice.tsx, z-40), que también vive fijo
// abajo de la pantalla, para que el botón nunca quede tapado ni
// inaccesible mientras ese aviso está visible.
"use client";

import { useEffect, useRef, useState } from "react";

// Silueta del auricular de WhatsApp (la forma curva característica
// del logo real), en vez de un ícono de teléfono genérico -- pedido
// puntual del usuario ("más alineado a la forma de whatsapp").
function WhatsAppGlyph({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
            <path
                d="M23.7 19.9c-.6-.3-3.6-1.8-4.2-2-.6-.2-1-.3-1.4.3-.4.6-1.6 2-1.9 2.4-.4.4-.7.4-1.3.1-.6-.3-2.6-1-5-3.1-1.8-1.6-3-3.6-3.4-4.2-.4-.6 0-1 .3-1.3.3-.3.6-.7.9-1 .2-.3.4-.6.6-1 .2-.4.1-.7 0-1-.1-.3-1.4-3.3-1.9-4.5-.5-1.2-1-1-1.4-1-.4 0-.8 0-1.2 0-.4 0-1.1.2-1.7.8-.6.6-2.2 2.1-2.2 5.2 0 3.1 2.2 6 2.5 6.4.3.4 4.4 6.7 10.6 9.4 1.5.6 2.6 1 3.5 1.3 1.5.5 2.8.4 3.9.2 1.2-.2 3.6-1.5 4.1-2.9.5-1.4.5-2.7.4-2.9-.1-.3-.5-.4-1.2-.7z"
                fill="currentColor"
            />
        </svg>
    );
}

export const Backlink = (props: { linkValue: string }) => {
    const { linkValue } = props;

    // Mientras el usuario desliza la página, true; 150ms después de
    // parar, vuelve a false (debounce simple con un solo timeout).
    const [isScrolling, setIsScrolling] = useState(false);
    const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        function handleScroll() {
            setIsScrolling(true);
            if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
            scrollTimeout.current = setTimeout(() => setIsScrolling(false), 150);
        }
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", handleScroll);
            if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
        };
    }, []);

    if (!linkValue) return null;

    return (
        <a
            href={linkValue}
            target="_blank"
            rel="noopener"
            aria-label="Chatear por WhatsApp"
            title="Chatear por WhatsApp"
            className={`fixed bottom-4 right-4 z-50 flex h-16 w-16 items-center justify-center
                transition-transform duration-300 ease-out hover:scale-110
                focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366]
                sm:bottom-5 sm:right-5 sm:h-[4.5rem] sm:w-[4.5rem]
                ${isScrolling ? "motion-safe:animate-scrollWiggle" : ""}`}
        >
            {/* Anillos de pulso -- se expanden y desvanecen en bucle detrás
                del círculo sólido, el segundo con un pequeño retraso para
                que no "palpiten" exactamente al mismo tiempo. */}
            <span className="pointer-events-none absolute inset-0 rounded-full bg-[#25D366] opacity-70 motion-safe:animate-ping" />
            <span
                className="pointer-events-none absolute inset-0 rounded-full bg-[#25D366] opacity-50 motion-safe:animate-ping"
                style={{ animationDelay: "0.6s" }}
            />

            {/* Círculo sólido: degradé "metálico" en los colores reales de
                WhatsApp (verde claro -> verde WhatsApp -> verde azulado
                oscuro), con su propio latido (heartbeat) independiente del
                hover del <a> de afuera, para que no se pisen los dos. */}
            <span className="relative z-10 flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-[#3EE087] via-[#25D366] to-[#0B6E52] shadow-xl shadow-[#0B6E52]/50 ring-2 ring-white/40 motion-safe:animate-heartbeat">
                {/* Brillo superior -- simula una superficie metálica/pulida
                    en vez de un verde plano. */}
                <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-br from-white/50 via-white/5 to-transparent opacity-70"
                />
                <WhatsAppGlyph className="relative h-8 w-8 text-white drop-shadow-sm sm:h-9 sm:w-9" />
            </span>
        </a>
    );
};
