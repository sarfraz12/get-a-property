// lib/legalContent.js
//
// Contenido bilingüe de las 3 páginas legales del sitio (Términos y
// Condiciones / Política de Privacidad / Política de Cookies). Texto
// simple, en lenguaje llano, escrito a partir de la información que
// YA es pública en el sitio (nombre de la empresa, correo, teléfono y
// dirección que se muestran en el pie de página -- ver
// components/navigation/footer.js -- y las integraciones reales que
// ya tiene el sitio: Google Analytics/Tag Manager en
// app/(website)/[lang]/layout.tsx, y Facebook/Meta SOLO a través de
// metadatos Open Graph para las vistas previas al compartir un link
// -- este sitio NO usa Facebook Pixel ni Facebook Login).
//
// No es asesoría legal: es el piso razonable de cumplimiento que
// Google/Facebook piden para un sitio de este tamaño (aviso de
// cookies, qué datos se recogen y para qué, y a quién contactar). Si
// el negocio cambia de proveedor de analítica, agrega un pixel de
// Facebook, o empieza a procesar pagos en el sitio, este texto debe
// actualizarse para seguir siendo preciso.

export const LAST_UPDATED = {
  es: "Última actualización: 29 de agosto de 2026",
  en: "Last updated: August 29, 2026",
};

const CONTACT_INFO = {
  es: {
    email: "admin@getapropertypanama.com",
    phone: "+507 6652-5238",
    address: "Avenida La Paz, al lado del Banco General, Ciudad de Panamá, Panamá",
  },
  en: {
    email: "admin@getapropertypanama.com",
    phone: "+507 6652-5238",
    address: "La Paz Avenue, next to Banco General, Panama City, Panama",
  },
};

export const TERMS_CONTENT = {
  es: {
    h1: "Términos y Condiciones",
    intro:
      "Estos Términos y Condiciones regulan el uso del sitio web de Get a Property (el \"Sitio\"). Al navegar o usar el Sitio, aceptás estos términos. Si no estás de acuerdo, por favor no uses el Sitio.",
    sections: [
      {
        heading: "1. Sobre este Sitio",
        body: `<p>Get a Property es una agencia de bienes raíces en Panamá. El Sitio publica información sobre casas, apartamentos, terrenos y otras propiedades disponibles para venta o alquiler, con fines informativos y de contacto comercial.</p>
        <p>El Sitio <strong>no es una plataforma de compra, venta o pago en línea</strong>: no se procesan transacciones inmobiliarias, reservas ni pagos a través del Sitio. Cualquier acuerdo sobre una propiedad se realiza directamente entre el interesado y Get a Property, fuera del Sitio.</p>`,
      },
      {
        heading: "2. Exactitud de la información",
        body: `<p>Hacemos un esfuerzo razonable por mantener actualizada la información de precios, disponibilidad, características y ubicación de cada propiedad. Sin embargo, estos datos pueden cambiar sin previo aviso (una propiedad puede venderse, alquilarse o cambiar de precio en cualquier momento).</p>
        <p>Te recomendamos <strong>confirmar directamente con Get a Property</strong> (ver datos de contacto abajo) la disponibilidad y condiciones exactas de cualquier propiedad antes de tomar una decisión.</p>`,
      },
      {
        heading: "3. Propiedad intelectual",
        body: `<p>Los textos, fotografías, logotipos y demás contenido del Sitio pertenecen a Get a Property o se usan con la autorización correspondiente. No está permitido copiar, reproducir o distribuir este contenido con fines comerciales sin autorización previa por escrito.</p>`,
      },
      {
        heading: "4. Enlaces a sitios de terceros",
        body: `<p>El Sitio puede incluir enlaces a redes sociales u otros sitios de terceros (por ejemplo, Instagram, Facebook o Google Maps). No somos responsables del contenido ni de las prácticas de privacidad de esos sitios externos.</p>`,
      },
      {
        heading: "5. Limitación de responsabilidad",
        body: `<p>El Sitio se ofrece "tal cual". En la medida permitida por la ley, Get a Property no garantiza que el Sitio esté libre de errores o interrupciones, y no será responsable por daños derivados del uso del Sitio o de decisiones tomadas con base en la información publicada en él.</p>`,
      },
      {
        heading: "6. Cambios a estos términos",
        body: `<p>Podemos actualizar estos Términos y Condiciones en cualquier momento para reflejar cambios en el Sitio o en la normativa aplicable. La fecha de la última actualización aparece al inicio de esta página.</p>`,
      },
      {
        heading: "7. Ley aplicable",
        body: `<p>Estos términos se rigen por las leyes de la República de Panamá.</p>`,
      },
      {
        heading: "8. Contacto",
        body: `<p>Si tenés preguntas sobre estos Términos y Condiciones, podés escribirnos a <a href="mailto:${CONTACT_INFO.es.email}">${CONTACT_INFO.es.email}</a> o llamarnos al <a href="tel:${CONTACT_INFO.es.phone}">${CONTACT_INFO.es.phone}</a>. Dirección: ${CONTACT_INFO.es.address}.</p>`,
      },
    ],
  },
  en: {
    h1: "Terms and Conditions",
    intro:
      "These Terms and Conditions govern the use of the Get a Property website (the \"Site\"). By browsing or using the Site, you accept these terms. If you do not agree, please do not use the Site.",
    sections: [
      {
        heading: "1. About this Site",
        body: `<p>Get a Property is a real estate agency in Panama. The Site publishes information about houses, apartments, land, and other properties available for sale or rent, for informational and business-contact purposes.</p>
        <p>The Site <strong>is not an online purchase, sale, or payment platform</strong>: no real estate transactions, reservations, or payments are processed through the Site. Any agreement regarding a property is made directly between the interested party and Get a Property, outside the Site.</p>`,
      },
      {
        heading: "2. Accuracy of information",
        body: `<p>We make a reasonable effort to keep pricing, availability, features, and location information for each property up to date. However, this information can change without notice (a property may be sold, rented, or change in price at any time).</p>
        <p>We recommend <strong>confirming directly with Get a Property</strong> (see contact details below) the exact availability and terms of any property before making a decision.</p>`,
      },
      {
        heading: "3. Intellectual property",
        body: `<p>The text, photographs, logos, and other content on the Site belong to Get a Property or are used with the corresponding authorization. Copying, reproducing, or distributing this content for commercial purposes without prior written authorization is not permitted.</p>`,
      },
      {
        heading: "4. Links to third-party sites",
        body: `<p>The Site may include links to social media or other third-party sites (for example, Instagram, Facebook, or Google Maps). We are not responsible for the content or privacy practices of those external sites.</p>`,
      },
      {
        heading: "5. Limitation of liability",
        body: `<p>The Site is provided "as is". To the extent permitted by law, Get a Property does not guarantee that the Site will be free of errors or interruptions, and will not be liable for damages arising from use of the Site or decisions made based on the information published on it.</p>`,
      },
      {
        heading: "6. Changes to these terms",
        body: `<p>We may update these Terms and Conditions at any time to reflect changes to the Site or applicable regulations. The date of the last update appears at the top of this page.</p>`,
      },
      {
        heading: "7. Governing law",
        body: `<p>These terms are governed by the laws of the Republic of Panama.</p>`,
      },
      {
        heading: "8. Contact",
        body: `<p>If you have questions about these Terms and Conditions, you can write to us at <a href="mailto:${CONTACT_INFO.en.email}">${CONTACT_INFO.en.email}</a> or call us at <a href="tel:${CONTACT_INFO.en.phone}">${CONTACT_INFO.en.phone}</a>. Address: ${CONTACT_INFO.en.address}.</p>`,
      },
    ],
  },
};

export const PRIVACY_CONTENT = {
  es: {
    h1: "Política de Privacidad",
    intro:
      "En Get a Property respetamos tu privacidad. Esta política explica qué información recogemos a través de nuestro sitio web, para qué la usamos y con quién la compartimos.",
    sections: [
      {
        heading: "1. Qué información recogemos",
        body: `<ul>
          <li><strong>Formulario de contacto:</strong> nombre, correo electrónico, teléfono y el mensaje que escribís. Se usa únicamente para responder tu consulta sobre una propiedad o servicio.</li>
          <li><strong>Suscripción al boletín (newsletter):</strong> tu correo electrónico, si decidís suscribirte, para enviarte novedades sobre propiedades. Podés darte de baja en cualquier momento.</li>
          <li><strong>Datos de navegación (cookies):</strong> información automática sobre cómo usás el Sitio (páginas visitadas, dispositivo, navegador, ubicación aproximada) a través de Google Analytics y Google Tag Manager. Ver el detalle en nuestra <a href="/es/cookies">Política de Cookies</a>.</li>
        </ul>
        <p>No pedimos ni almacenamos información de pago ni datos financieros a través del Sitio.</p>`,
      },
      {
        heading: "2. Para qué usamos tu información",
        body: `<ul>
          <li>Responder tus consultas y darte seguimiento sobre propiedades de tu interés.</li>
          <li>Enviarte el boletín de novedades, si te suscribiste.</li>
          <li>Entender cómo se usa el Sitio y mejorarlo (estadísticas agregadas de visitas, con Google Analytics).</li>
        </ul>`,
      },
      {
        heading: "3. Con quién compartimos tu información",
        body: `<p>No vendemos tu información personal. La compartimos únicamente con:</p>
        <ul>
          <li><strong>Proveedores que nos ayudan a operar el Sitio:</strong> por ejemplo, Google (Analytics y Tag Manager, para estadísticas de uso) y Sanity (la plataforma donde se administra el contenido del Sitio).</li>
          <li><strong>Autoridades</strong>, sólo cuando la ley lo exija.</li>
        </ul>
        <p><strong>Sobre Facebook/Meta:</strong> el Sitio usa metadatos "Open Graph" para que, cuando alguien comparte un link nuestro en Facebook o WhatsApp, se muestre una vista previa con imagen y título. Esto no envía datos personales a Facebook ni instala ningún rastreador de Facebook (Facebook Pixel) en el Sitio -- Get a Property no usa Facebook Pixel ni inicio de sesión con Facebook.</p>`,
      },
      {
        heading: "4. Cuánto tiempo guardamos tu información",
        body: `<p>Guardamos los mensajes de contacto y correos de suscripción mientras sean necesarios para los fines descritos arriba, o hasta que solicités que los eliminemos.</p>`,
      },
      {
        heading: "5. Tus derechos",
        body: `<p>Podés solicitarnos en cualquier momento: acceder a la información que tenemos sobre vos, corregirla, o pedir que la eliminemos (por ejemplo, darte de baja del boletín). Para ejercer estos derechos, escribinos a <a href="mailto:${CONTACT_INFO.es.email}">${CONTACT_INFO.es.email}</a>.</p>`,
      },
      {
        heading: "6. Seguridad",
        body: `<p>Tomamos medidas razonables para proteger la información que nos compartís, aunque ningún sitio web puede garantizar seguridad absoluta.</p>`,
      },
      {
        heading: "7. Menores de edad",
        body: `<p>El Sitio está dirigido a personas mayores de edad interesadas en bienes raíces. No recogemos a sabiendas información de menores de edad.</p>`,
      },
      {
        heading: "8. Cambios a esta política",
        body: `<p>Podemos actualizar esta Política de Privacidad de vez en cuando. La fecha de la última actualización aparece al inicio de esta página.</p>`,
      },
      {
        heading: "9. Contacto",
        body: `<p>Si tenés preguntas sobre esta Política de Privacidad, escribinos a <a href="mailto:${CONTACT_INFO.es.email}">${CONTACT_INFO.es.email}</a> o llamanos al <a href="tel:${CONTACT_INFO.es.phone}">${CONTACT_INFO.es.phone}</a>. Dirección: ${CONTACT_INFO.es.address}.</p>`,
      },
    ],
  },
  en: {
    h1: "Privacy Policy",
    intro:
      "At Get a Property we respect your privacy. This policy explains what information we collect through our website, what we use it for, and who we share it with.",
    sections: [
      {
        heading: "1. Information we collect",
        body: `<ul>
          <li><strong>Contact form:</strong> your name, email, phone number, and the message you write. Used only to respond to your inquiry about a property or service.</li>
          <li><strong>Newsletter subscription:</strong> your email address, if you choose to subscribe, to send you property updates. You can unsubscribe at any time.</li>
          <li><strong>Browsing data (cookies):</strong> automatic information about how you use the Site (pages visited, device, browser, approximate location) through Google Analytics and Google Tag Manager. See details in our <a href="/en/cookies">Cookie Policy</a>.</li>
        </ul>
        <p>We do not request or store payment information or financial data through the Site.</p>`,
      },
      {
        heading: "2. How we use your information",
        body: `<ul>
          <li>Respond to your inquiries and follow up on properties you're interested in.</li>
          <li>Send you our newsletter, if you subscribed.</li>
          <li>Understand how the Site is used and improve it (aggregated visit statistics via Google Analytics).</li>
        </ul>`,
      },
      {
        heading: "3. Who we share your information with",
        body: `<p>We do not sell your personal information. We share it only with:</p>
        <ul>
          <li><strong>Providers that help us run the Site:</strong> for example, Google (Analytics and Tag Manager, for usage statistics) and Sanity (the platform used to manage the Site's content).</li>
          <li><strong>Authorities</strong>, only when required by law.</li>
        </ul>
        <p><strong>About Facebook/Meta:</strong> the Site uses "Open Graph" metadata so that when someone shares one of our links on Facebook or WhatsApp, a preview with an image and title is shown. This does not send personal data to Facebook and does not install any Facebook tracker (Facebook Pixel) on the Site -- Get a Property does not use Facebook Pixel or Facebook Login.</p>`,
      },
      {
        heading: "4. How long we keep your information",
        body: `<p>We keep contact messages and subscription emails for as long as necessary for the purposes described above, or until you ask us to delete them.</p>`,
      },
      {
        heading: "5. Your rights",
        body: `<p>You can ask us at any time to: access the information we have about you, correct it, or request that we delete it (for example, unsubscribe from the newsletter). To exercise these rights, write to us at <a href="mailto:${CONTACT_INFO.en.email}">${CONTACT_INFO.en.email}</a>.</p>`,
      },
      {
        heading: "6. Security",
        body: `<p>We take reasonable measures to protect the information you share with us, although no website can guarantee absolute security.</p>`,
      },
      {
        heading: "7. Children",
        body: `<p>The Site is aimed at adults interested in real estate. We do not knowingly collect information from minors.</p>`,
      },
      {
        heading: "8. Changes to this policy",
        body: `<p>We may update this Privacy Policy from time to time. The date of the last update appears at the top of this page.</p>`,
      },
      {
        heading: "9. Contact",
        body: `<p>If you have questions about this Privacy Policy, write to us at <a href="mailto:${CONTACT_INFO.en.email}">${CONTACT_INFO.en.email}</a> or call us at <a href="tel:${CONTACT_INFO.en.phone}">${CONTACT_INFO.en.phone}</a>. Address: ${CONTACT_INFO.en.address}.</p>`,
      },
    ],
  },
};

export const COOKIES_CONTENT = {
  es: {
    h1: "Política de Cookies",
    intro:
      "Esta página explica qué son las cookies, cuáles usa el sitio de Get a Property y cómo podés controlarlas.",
    sections: [
      {
        heading: "1. Qué es una cookie",
        body: `<p>Una cookie es un pequeño archivo que un sitio web guarda en tu navegador para recordar información sobre tu visita (por ejemplo, estadísticas de uso o preferencias).</p>`,
      },
      {
        heading: "2. Cookies que usamos",
        body: `<ul>
          <li><strong>Cookies esenciales:</strong> necesarias para que el Sitio funcione correctamente (por ejemplo, recordar que ya viste el aviso de cookies).</li>
          <li><strong>Cookies de analítica (Google Analytics / Google Tag Manager):</strong> nos ayudan a entender cuánta gente visita el Sitio, qué páginas ven y desde qué dispositivos, de forma agregada. No usamos esta información para identificarte individualmente.</li>
        </ul>
        <p>Get a Property <strong>no usa Facebook Pixel</strong> ni cookies de publicidad de terceros en este Sitio.</p>`,
      },
      {
        heading: "3. Aviso de cookies en el Sitio",
        body: `<p>Al entrar por primera vez, el Sitio muestra un aviso breve informándote que usamos cookies de analítica. Es un aviso informativo: podés seguir navegando con normalidad, y podés cerrarlo cuando quieras. No bloqueamos el uso del Sitio mientras el aviso esté visible.</p>`,
      },
      {
        heading: "4. Cómo controlar las cookies",
        body: `<p>Podés borrar o bloquear las cookies desde la configuración de tu navegador en cualquier momento. Tené en cuenta que bloquear todas las cookies puede afectar el funcionamiento de algunas partes del Sitio.</p>`,
      },
      {
        heading: "5. Cambios a esta política",
        body: `<p>Podemos actualizar esta Política de Cookies de vez en cuando. La fecha de la última actualización aparece al inicio de esta página.</p>`,
      },
      {
        heading: "6. Contacto",
        body: `<p>Si tenés preguntas sobre el uso de cookies en el Sitio, escribinos a <a href="mailto:${CONTACT_INFO.es.email}">${CONTACT_INFO.es.email}</a>.</p>`,
      },
    ],
  },
  en: {
    h1: "Cookie Policy",
    intro:
      "This page explains what cookies are, which ones the Get a Property site uses, and how you can control them.",
    sections: [
      {
        heading: "1. What is a cookie",
        body: `<p>A cookie is a small file that a website stores in your browser to remember information about your visit (for example, usage statistics or preferences).</p>`,
      },
      {
        heading: "2. Cookies we use",
        body: `<ul>
          <li><strong>Essential cookies:</strong> necessary for the Site to work correctly (for example, remembering that you already saw the cookie notice).</li>
          <li><strong>Analytics cookies (Google Analytics / Google Tag Manager):</strong> help us understand how many people visit the Site, which pages they view, and from which devices, in aggregate. We do not use this information to identify you individually.</li>
        </ul>
        <p>Get a Property <strong>does not use Facebook Pixel</strong> or third-party advertising cookies on this Site.</p>`,
      },
      {
        heading: "3. Cookie notice on the Site",
        body: `<p>The first time you visit, the Site shows a brief notice letting you know we use analytics cookies. It is an informational notice: you can keep browsing normally, and you can dismiss it whenever you like. We do not block use of the Site while the notice is visible.</p>`,
      },
      {
        heading: "4. How to control cookies",
        body: `<p>You can delete or block cookies from your browser settings at any time. Keep in mind that blocking all cookies may affect how some parts of the Site work.</p>`,
      },
      {
        heading: "5. Changes to this policy",
        body: `<p>We may update this Cookie Policy from time to time. The date of the last update appears at the top of this page.</p>`,
      },
      {
        heading: "6. Contact",
        body: `<p>If you have questions about the use of cookies on the Site, write to us at <a href="mailto:${CONTACT_INFO.en.email}">${CONTACT_INFO.en.email}</a>.</p>`,
      },
    ],
  },
};
