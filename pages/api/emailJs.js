// pages/api/emailJs.js
//
// API route de Next.js (Pages Router: /api/emailJs) que reenvía un
// mensaje de contacto a través de EmailJS.
//
// OJO — hallazgo importante: hoy este endpoint solo lo usa
// ContactCtaSection (el formulario nuevo de 3 campos en la home). La
// página /contact (app/(website)/[lang]/contact/contact.js) NO pasa
// por acá: llama a `emailjs.send(...)` directo desde el navegador con
// la librería @emailjs/browser. Esa librería está pensada para correr
// en el navegador, así que ejecutarla en un route handler de servidor
// (como este) puede no comportarse igual en todos los entornos — si
// después de publicar notas que los correos de ESTE formulario no
// llegan, la alternativa segura es mover el envío al cliente, con el
// mismo patrón que ya usa /contact.
//
// Body esperado: { name, email, phone?, message }
// `phone` es opcional (así una request vieja sin ese campo sigue
// funcionando igual que antes) — si viene, se agrega al mensaje y se
// manda también como variable propia del template por si la quieres
// usar en la plantilla de EmailJS.
import emailjs from '@emailjs/browser';

export default async function Handler(req, res) {

    if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
    }

    const { name, email, phone, message } = req.body;

    const templateParams = {
        from_name: name,
        from_email: email,
        phone: phone || "",
        message: phone ? `${message}\n\nTeléfono: ${phone}` : message,
    };

    try {
        const serviceID = 'service_ns37blu';
        const templateID = 'template_4noz9sf';
        const userID = 'etnkFFSzzkczK63iL';

        await emailjs.send(serviceID, templateID, templateParams, userID).then(
            (result) => {
              console.log("resukt",result.text);
            },
            (error) => {
              console.log("erro2    ",error);
            }
          );

        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Failed to send email', error });
    }
}
