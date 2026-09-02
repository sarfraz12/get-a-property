// app/(website)/[lang]/contact/contact.js
//
// Página de contacto — rediseñada por completo para calcar la
// referencia que enviaste ("Contact us"): un banner negro redondeado
// con el título y un texto de bienvenida, y debajo una sola fila
// dividida en dos columnas (misma altura de fila): a la izquierda el
// bloque de información (correo / dirección / teléfono + redes
// sociales) y a la derecha la tarjeta gris con el formulario. Al
// final se mantiene el mapa de Google, sólo con estilo nuevo.
//
// Funciones/datos que YA existían y se mantienen intactos:
// - settings.email / settings.phone / settings.address / settings.social
//   (mismos campos de Sanity que ya usaba esta página y el footer).
// - settings.googleIframe -> el iframe embebido de Google Maps sigue
//   ahí, sólo con un contenedor redondeado nuevo.
// - El envío del formulario sigue mandando un correo real, pero ahora
//   pasa por el mismo endpoint que ya usa el resto del sitio
//   (pages/api/emailJs.js -> POST /api/emailJs) en vez de llamar a
//   emailjs.send(...) directo desde este componente. Ver
//   components/sections/ContactPageForm.tsx.
//
// Placeholders / valores por defecto (para poder previsualizar la UI
// aunque falte algún dato en Sanity, y para no dejar nada roto):
// - DEFAULT_EMAIL / DEFAULT_PHONE: los mismos datos de contacto que ya
//   se usan como respaldo en otras partes del sitio (footer,
//   AboutTeamSection).
// - DEFAULT_ADDRESS: si "settings.address" está vacío, se muestra
//   "Ciudad de Panamá, Panamá" como placeholder.
// - DEFAULT_GOOGLE_IFRAME: si "settings.googleIframe" está vacío, se
//   embebe un mapa genérico de Ciudad de Panamá (sin necesitar una API
//   key de Google), sólo para que el bloque del mapa no quede vacío
//   mientras cargas el link real en Sanity.
// - La línea final ("¿Tienes más preguntas?") en la referencia
//   enlazaba a una página de FAQs -- este sitio todavía no tiene una,
//   así que en vez de dejar un link roto se conecta al canal de
//   contacto más rápido que sí existe hoy (el correo). El día que haya
//   una página de preguntas frecuentes, sólo hay que cambiar el href.
import Container from "@/components/generalUse/container";
import ContactPageForm from "@/components/sections/ContactPageForm";
import SocialLink from "@/components/generalUse/socialIcons";
import { MapPinIcon, EnvelopeIcon, PhoneIcon } from "@heroicons/react/24/outline";

const DEFAULT_EMAIL = "admin@getapropertypanama.com";
const DEFAULT_PHONE = "+507 6652-5238";
const DEFAULT_ADDRESS = {
  es: "Ciudad de Panamá, Panamá",
  en: "Panama City, Panama",
};
const DEFAULT_GOOGLE_IFRAME =
  "https://maps.google.com/maps?q=Panama%20City%2C%20Panama&t=&z=12&ie=UTF8&iwloc=&output=embed";

const COPY = {
  es: {
    heroTitle: "Contáctanos",
    heroDescription:
      "Escríbenos con tus preguntas sobre nuestras propiedades. Tu mensaje es importante para nosotros y nuestro equipo te responderá lo antes posible.",
    sectionTitle: "Contáctanos hoy",
    sectionDescription:
      "Nuestras puertas están abiertas para consultas, comentarios y alianzas. Escríbenos y conversemos.",
    emailLabel: "Correo",
    addressLabel: "Dirección",
    phoneLabel: "Teléfono",
    questionsText: "¿Tienes más preguntas? Escríbenos directamente por",
    questionsLink: "correo",
    mapEyebrow: "Ubicación",
    mapTitle: "Encuéntranos",
  },
  en: {
    heroTitle: "Contact us",
    heroDescription:
      "Send us your questions about our properties. Your message matters to us and our team will get back to you as soon as possible.",
    sectionTitle: "Contact us today",
    sectionDescription:
      "Our doors are open for inquiries, feedback, and collaboration. Reach out to us and let's connect.",
    emailLabel: "Email",
    addressLabel: "Address",
    phoneLabel: "Phone",
    questionsText: "Do you still have questions? Reach us directly by",
    questionsLink: "email",
    mapEyebrow: "Location",
    mapTitle: "Find us",
  },
};

function InfoItem({ icon: Icon, label, children }) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <Icon className="h-6 w-6 flex-shrink-0 text-black" />
        <p className="text-xl font-extrabold text-black sm:text-2xl">{label}</p>
      </div>
      <div className="mt-2 pl-9 text-[15px] text-black/60">{children}</div>
    </div>
  );
}

export default function Contact({ settings, lang }) {
  const t = COPY[lang] || COPY.es;

  const email = settings?.email || DEFAULT_EMAIL;
  const phone = settings?.phone || DEFAULT_PHONE;
  const address = settings?.address || DEFAULT_ADDRESS[lang] || DEFAULT_ADDRESS.es;
  const googleIframe = settings?.googleIframe || DEFAULT_GOOGLE_IFRAME;
  const sectionDescription = settings?.description || t.sectionDescription;

  return (
    <Container large alt className="py-10 md:py-16">
      {/* Banner negro (misma pieza que ya se usa en /all y en categorías,
          para que todas las páginas "de listado/landing" del sitio se
          sientan parte de la misma familia visual). */}
      <div className="overflow-hidden rounded-3xl bg-black px-6 py-14 text-center sm:py-20">
        <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl">
          {t.heroTitle}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-sm font-semibold text-white/70 sm:text-base">
          {t.heroDescription}
        </p>
      </div>

      {/* Una sola fila dividida en dos columnas: info a la izquierda,
          formulario a la derecha. */}
      <div className="mt-16 grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-black sm:text-4xl">
            {t.sectionTitle}
          </h2>
          <p className="mt-4 max-w-md text-black/60">{sectionDescription}</p>

          <div className="mt-10 space-y-8">
            <InfoItem icon={EnvelopeIcon} label={t.emailLabel}>
              <a
                href={`mailto:${email}`}
                className="font-semibold underline decoration-black/20 underline-offset-4 transition-opacity hover:opacity-60"
              >
                {email}
              </a>
            </InfoItem>

            <InfoItem icon={MapPinIcon} label={t.addressLabel}>
              <span>{address}</span>
            </InfoItem>

            <InfoItem icon={PhoneIcon} label={t.phoneLabel}>
              <a
                href={`tel:${phone}`}
                className="font-semibold underline decoration-black/20 underline-offset-4 transition-opacity hover:opacity-60"
              >
                {phone}
              </a>
            </InfoItem>
          </div>

          {settings?.social?.length > 0 && (
            <ul className="mt-10 flex gap-3">
              {settings.social.map((item, index) => (
                <li key={item.id || `${item.media}-${index}`}>
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black/5 text-black transition-colors hover:bg-black hover:text-white [&_svg]:h-[1.15rem] [&_svg]:w-[1.15rem]">
                    <SocialLink platform={item.media} link={item.url} />
                  </div>
                </li>
              ))}
            </ul>
          )}

          <p className="mt-10 text-sm text-black/50">
            {t.questionsText}{" "}
            <a
              href={`mailto:${email}`}
              className="font-bold text-black underline decoration-black/20 underline-offset-4 hover:opacity-60"
            >
              {t.questionsLink}
            </a>
            .
          </p>
        </div>

        <ContactPageForm lang={lang} />
      </div>

      {/* Mapa embebido de Google — se mantiene igual que antes
          (settings.googleIframe), sólo con un contenedor nuevo. */}
      <div className="mt-16">
        <p className="text-xs font-bold uppercase tracking-widest text-brand-gold">{t.mapEyebrow}</p>
        <h3 className="mt-2 text-2xl font-extrabold text-black sm:text-3xl">{t.mapTitle}</h3>
        <div className="mt-6 overflow-hidden rounded-3xl border border-black/10">
          <iframe
            className="h-80 w-full sm:h-96"
            src={googleIframe}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </Container>
  );
}
