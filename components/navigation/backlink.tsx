// components/navigation/backlink.tsx
//
// Botón flotante fijo (abajo a la derecha) que abre WhatsApp en una
// pestaña nueva -- se monta una sola vez en
// app/(website)/[lang]/layout.tsx, con el link real (settings.url)
// que carga desde Sanity.
//
// Rediseñado a pedido del usuario: antes era una placita blanca
// rectangular con un ícono de chat genérico y texto "Whatsapp ↗"
// (poco reconocible como WhatsApp de un vistazo). Ahora es el círculo
// flotante clásico de WhatsApp -- degradé "metálico" en los colores
// reales de la marca (verde claro -> verde WhatsApp -> verde azulado
// oscuro) con un brillo sutil arriba a la izquierda para dar
// sensación de superficie pulida, más un ícono de teléfono blanco.
// "Llamativo pero no invasivo": sin animación de pulso constante (eso
// se siente invasivo con el tiempo), sólo una pequeña entrada suave al
// cargar la página y una reacción sutil al pasar el mouse -- el color
// de marca ya hace su trabajo de llamar la atención sin necesidad de
// movimiento permanente.
//
// z-50: mismo nivel que el navbar (navbar.tsx) -- por encima del
// aviso de cookies (CookieNotice.tsx, z-40), que también vive fijo
// abajo de la pantalla, para que el botón nunca quede tapado ni
// inaccesible mientras ese aviso está visible.

import { PhoneIcon } from "@heroicons/react/24/solid";

export const Backlink = (props: { linkValue: string }) => {
    const { linkValue } = props;

    if (!linkValue) return null;

    return (
        <a
            href={linkValue}
            target="_blank"
            rel="noopener"
            aria-label="Chatear por WhatsApp"
            title="Chatear por WhatsApp"
            className="group fixed bottom-4 right-4 z-50 flex h-12 w-12 items-center justify-center
                rounded-full bg-gradient-to-br from-[#3EE087] via-[#25D366] to-[#0B6E52]
                shadow-lg shadow-[#0B6E52]/40 ring-1 ring-white/30
                transition-transform duration-300 ease-out
                hover:scale-110 hover:shadow-xl hover:shadow-[#0B6E52]/50
                focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366]
                animate-fadeInScale sm:bottom-5 sm:right-5 sm:h-14 sm:w-14"
        >
            {/* Brillo superior -- simula una superficie metálica/pulida en
                vez de un verde plano, sin depender de ninguna imagen. */}
            <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-br from-white/50 via-white/5 to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-90"
            />
            <PhoneIcon className="relative h-6 w-6 text-white drop-shadow-sm sm:h-7 sm:w-7" />
        </a>
    );
};
