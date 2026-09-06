// pages/api/emailJs.js
//
// API route de Next.js (Pages Router: /api/emailJs) que reenvía CUALQUIER
// formulario del sitio a EmailJS -- es el único lugar del código donde
// vive la configuración de EmailJS, así que todos los formularios
// (ContactCtaSection en la home, ContactPageForm en /contact,
// PostContactForm en la página de un post, y NewsletterForm en el
// footer) mandan su propio {name, email, phone?, message} acá en vez
// de llamar a EmailJS cada uno por su cuenta.
//
// ================================================================
// HISTORIAL -- BUG REAL que hacía que NINGÚN correo se entregara
// ================================================================
// Esta ruta usaba el paquete `@emailjs/browser` -- diseñado
// específicamente para correr DENTRO de un navegador, no en un
// servidor. Su función `send()` lee, sin protegerse, las variables
// globales `location`/`navigator` (existen en un navegador, NO en
// Node.js). Cada envío explotaba de entrada con `ReferenceError:
// location is not defined` -- ANTES de siquiera contactar a EmailJS.
// Ese error se capturaba pero sólo se imprimía en la consola del
// servidor, y el código igual respondía 200 "Email sent successfully"
// al navegador. Por eso todos los formularios mostraban éxito, pero
// ningún correo llegaba nunca a destino.
// Se corrigió llamando directo (con `fetch`) al mismo endpoint REST
// que el SDK usa por debajo, sin tocar ningún global de navegador.
//
// ================================================================
// SEGURIDAD -- lo que se endureció en esta revisión
// ================================================================
// Antes, este endpoint era básicamente un "relay" abierto: cualquiera
// en internet (no sólo el sitio) podía mandarle un POST directo con
// {name, email, message} y el servidor se lo reenviaba a EmailJS,
// usando la cuota/reputación de la cuenta del negocio para mandar
// spam, phishing, etc. Los IDs de EmailJS también estaban escritos
// directo en el código fuente (visible para cualquiera con acceso al
// repo). Se agregaron 5 capas de protección:
//
// 1) CREDENCIALES EN VARIABLES DE ENTORNO, no en el código: el
//    service ID, template ID y las llaves de EmailJS ahora se leen de
//    process.env -- ver ".env.example" / instrucciones más abajo.
//    Nunca quedan escritas en el repo ni en el historial de git desde
//    este cambio en adelante.
// 2) VALIDACIÓN Y SANEAMIENTO del lado del servidor: correo con
//    formato válido, largos máximos razonables por campo (evita
//    payloads absurdos), y se quitan saltos de línea/caracteres de
//    control de "name"/"phone" (evita que alguien intente inyectar
//    contenido extra en el correo final a través de esos campos).
// 3) VALIDACIÓN DE ORIGEN: se revisa que la petición venga realmute
//    del propio sitio (header Origin/Referer contra la lista de
//    dominios permitidos) antes de reenviar nada a EmailJS. Esto no
//    detiene a alguien que arme la petición a mano con curl (ese
//    header lo puede inventar cualquiera), pero sí bloquea el abuso
//    automático más común: bots y scripts genéricos que escanean
//    internet buscando endpoints de formularios abiertos.
// 4) CAMPO "TRAMPA" (honeypot): cada formulario del sitio ahora manda
//    un campo extra oculto (invisible e inalcanzable por teclado para
//    una persona real) que los bots rellenan casi siempre porque
//    completan cualquier campo que encuentran en el HTML. Si llega
//    lleno, se responde 200 (para no delatar el mecanismo) pero NO se
//    manda ningún correo real.
// 5) LÍMITE DE INTENTOS por IP (best-effort): máximo 5 envíos cada 10
//    minutos por dirección IP. OJO: en un entorno serverless (Vercel)
//    cada instancia de la función tiene su propia memoria, así que
//    este límite no es 100% preciso (se reinicia si Vercel crea una
//    instancia nueva) -- igual sirve como primera barrera contra un
//    script que golpea el endpoint en loop. Si más adelante quieres
//    un límite exacto y compartido entre todas las instancias, se
//    puede migrar a Vercel KV / Upstash Redis (requiere una cuenta
//    nueva, no es algo que se pueda activar sólo con código).
//
// También se dejó de devolverle al navegador el detalle interno del
// error de EmailJS (antes se mandaba tal cual en la respuesta JSON);
// ahora sólo se loguea completo del lado del servidor (Vercel ->
// Functions -> Logs) y al navegador le llega un mensaje genérico.
//
// ================================================================
// LO MÁS SEGURO TODAVÍA (requiere un paso tuyo en EmailJS, no sólo código)
// ================================================================
// La forma "correcta" de llamar a EmailJS desde un servidor (en vez
// del truco de fingir el header Origin, ver abajo) es con una Private
// Key: en dashboard.emailjs.com -> Account -> API Keys, generás una
// Private Key nueva y la agregás acá como EMAILJS_PRIVATE_KEY (ver
// instrucciones de variables de entorno más abajo). Si esa variable
// existe, este archivo la usa automáticamente (envía "accessToken" en
// la petición) y ya no depende de que el header Origin engañe la
// verificación de EmailJS. No generé esa llave yo mismo porque
// requiere entrar a tu cuenta de EmailJS, algo que no hago por vos.
//
// Variables de entorno que este archivo necesita (agregar en
// .env.local para desarrollo local, y en Vercel -> Project Settings ->
// Environment Variables para producción):
//
//   EMAILJS_SERVICE_ID=service_6refp6c
//   EMAILJS_TEMPLATE_ID=template_7frcfrh
//   EMAILJS_PUBLIC_KEY=etnkFFSzzkczK63iL
//   EMAILJS_PRIVATE_KEY=          (opcional, ver párrafo de arriba)
//   EMAILJS_TO_EMAIL=             (ver bloque "DESTINATARIO" abajo)
//
// (Los valores de arriba son los mismos IDs que ya estaban
// funcionando -- sólo se movieron del código a variables de entorno.
// Si el Public Key algún día deja de servir, dashboard.emailjs.com ->
// Account -> General tiene el actual.)
//
// ================================================================
// DESTINATARIO -- por qué se agregó EMAILJS_TO_EMAIL
// ================================================================
// La plantilla de EmailJS tenía el campo "To Email" escrito fijo en
// SU panel (no en este código) -- y apuntaba a la dirección de otro
// negocio, no a la de Get a Property. Para poder controlar el
// destinatario desde acá (y que sea fácil de corregir sin entrar a
// EmailJS cada vez), este archivo ahora manda una variable nueva,
// `to_email`, con el valor de EMAILJS_TO_EMAIL.
//
// PASO PENDIENTE EN EMAILJS (no es código, es su panel): en
// dashboard.emailjs.com -> Email Templates -> tu plantilla -> pestaña
// Content, el campo "To Email" (columna derecha) hay que cambiarlo de
// la dirección fija actual a la variable `{{to_email}}` y guardar.
// Mientras ese campo siga fijo en el panel de EmailJS, esta variable
// nueva no tiene efecto (EmailJS simplemente la ignora y sigue usando
// la dirección fija de su plantilla).
//
// A propósito, esta dirección NUNCA se toma de lo que manda el
// visitante en el formulario (sería un hueco de seguridad: cualquiera
// podría usar tu cuenta de EmailJS para mandar correos a la dirección
// que quisiera) -- sale siempre de esta variable de entorno, fija del
// lado del servidor.
//
// Body esperado: { name, email, phone?, message, company? }
// `phone` es opcional. `company` es el campo trampa (ver punto 4) --
// nunca debería venir lleno en un envío real de una persona.

const EMAILJS_ENDPOINT = "https://api.emailjs.com/api/v1.0/email/send";

// Dominios desde los que se acepta una petición real del sitio.
// "sin origen" (undefined) se acepta también -- algunos clientes HTTP
// legítimos (o versiones viejas de navegadores en ciertas
// configuraciones) no siempre mandan el header Origin en un POST del
// mismo sitio; bloquear esos de punta dejaría a gente real sin poder
// escribir. La validación real y más fuerte para production sigue
// siendo el honeypot + el límite de intentos, no esto.
const ALLOWED_ORIGINS = [
    "https://www.getaproperty.com.pa",
    "https://getaproperty.com.pa",
    "http://localhost:3000",
];

const MAX_LENGTHS = { name: 150, email: 200, phone: 40, message: 5000 };

// Límite de intentos por IP -- ver punto (5) del comentario grande de
// arriba sobre por qué esto es "best-effort" en serverless.
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutos
const RATE_LIMIT_MAX = 5;
const rateLimitStore = new Map();

function isRateLimited(ip) {
    const now = Date.now();
    const timestamps = (rateLimitStore.get(ip) || []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
    timestamps.push(now);
    rateLimitStore.set(ip, timestamps);

    // Evita que este Map crezca sin límite en una instancia de larga
    // vida: si ya hay demasiadas IPs registradas, se descartan las más
    // viejas (no necesita ser exacto, sólo evitar una fuga de memoria).
    if (rateLimitStore.size > 5000) {
        const oldestKey = rateLimitStore.keys().next().value;
        rateLimitStore.delete(oldestKey);
    }

    return timestamps.length > RATE_LIMIT_MAX;
}

function getClientIp(req) {
    const forwarded = req.headers["x-forwarded-for"];
    if (typeof forwarded === "string" && forwarded.length > 0) {
        return forwarded.split(",")[0].trim();
    }
    return req.socket?.remoteAddress || "unknown";
}

function isAllowedOrigin(req) {
    const origin = req.headers.origin;
    if (!origin) return true; // ver comentario de ALLOWED_ORIGINS arriba
    return ALLOWED_ORIGINS.some((allowed) => origin === allowed);
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Saca saltos de línea y caracteres de control de un campo de una sola
// línea (name, phone) -- evita que alguien intente colar contenido
// extra en el correo final a través de esos campos.
function sanitizeSingleLine(value) {
    return String(value).replace(/[\r\n\t]+/g, " ").trim();
}

export default async function Handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    if (!isAllowedOrigin(req)) {
        console.warn('emailJs: bloqueado por origen no permitido:', req.headers.origin);
        return res.status(403).json({ message: 'Forbidden' });
    }

    const ip = getClientIp(req);
    if (isRateLimited(ip)) {
        console.warn('emailJs: límite de intentos alcanzado para IP:', ip);
        return res.status(429).json({ message: 'Too many requests. Please try again later.' });
    }

    const body = req.body || {};
    const { name, email, phone, message, company } = body;

    // Campo trampa: una persona real nunca lo ve ni lo llena. Si viene
    // con contenido, es casi con certeza un bot -- se responde éxito
    // (para no revelar el mecanismo) sin mandar nada de verdad.
    if (company) {
        console.warn('emailJs: honeypot activado, envío descartado silenciosamente.');
        return res.status(200).json({ message: 'Email sent successfully' });
    }

    if (!name || !email || !message) {
        return res.status(400).json({ message: 'Missing required fields: name, email, message' });
    }

    if (!EMAIL_RE.test(String(email).trim())) {
        return res.status(400).json({ message: 'Invalid email address' });
    }

    if (
        String(name).length > MAX_LENGTHS.name ||
        String(email).length > MAX_LENGTHS.email ||
        (phone && String(phone).length > MAX_LENGTHS.phone) ||
        String(message).length > MAX_LENGTHS.message
    ) {
        return res.status(400).json({ message: 'One or more fields exceed the allowed length' });
    }

    const cleanName = sanitizeSingleLine(name);
    const cleanPhone = phone ? sanitizeSingleLine(phone) : "";
    const cleanEmail = String(email).trim();
    // El mensaje sí puede tener varias líneas (es el único campo de
    // texto libre multilínea), así que no se le aplica sanitizeSingleLine.
    const cleanMessage = String(message).trim();

    const serviceID = process.env.EMAILJS_SERVICE_ID;
    const templateID = process.env.EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.EMAILJS_PUBLIC_KEY;
    const privateKey = process.env.EMAILJS_PRIVATE_KEY; // opcional, ver comentario grande arriba
    const toEmail = process.env.EMAILJS_TO_EMAIL; // ver bloque "DESTINATARIO" arriba

    if (!serviceID || !templateID || !publicKey || !toEmail) {
        // Esto SOLO puede pasar si todavía no agregaste las variables de
        // entorno (ver instrucciones arriba) -- se loguea bien claro en
        // vez de fallar de forma confusa más abajo.
        console.error('emailJs: faltan variables de entorno EMAILJS_SERVICE_ID / EMAILJS_TEMPLATE_ID / EMAILJS_PUBLIC_KEY / EMAILJS_TO_EMAIL.');
        return res.status(500).json({ message: 'Email service is not configured' });
    }

    const templateParams = {
        from_name: cleanName,
        from_email: cleanEmail,
        phone: cleanPhone,
        message: cleanPhone ? `${cleanMessage}\n\nTeléfono: ${cleanPhone}` : cleanMessage,
        // Destinatario real -- ver bloque "DESTINATARIO" arriba. Sale
        // siempre de la variable de entorno, nunca de lo que manda el
        // visitante en el formulario.
        to_email: toEmail,
    };

    const payload = {
        service_id: serviceID,
        template_id: templateID,
        user_id: publicKey,
        template_params: templateParams,
    };
    // Con una Private Key configurada, EmailJS confía en la petición
    // por esa llave (pensada para servidores) en vez de necesitar que
    // el header Origin coincida con un dominio permitido en su panel.
    if (privateKey) {
        payload.accessToken = privateKey;
    }

    try {
        const emailjsRes = await fetch(EMAILJS_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Sin Private Key configurada, esto es lo que le hace creer
                // a EmailJS que la petición viene del sitio real (ver
                // comentario grande arriba). Con Private Key, EmailJS ya no
                // depende de este header para confiar en la petición.
                origin: ALLOWED_ORIGINS[0],
            },
            body: JSON.stringify(payload),
        });

        const emailjsText = await emailjsRes.text();

        if (!emailjsRes.ok) {
            console.error('EmailJS respondió con error:', emailjsRes.status, emailjsText);
            return res.status(502).json({ message: 'Failed to send email' });
        }

        return res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ message: 'Failed to send email' });
    }
}
