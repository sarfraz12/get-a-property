// pages/api/emailJs.js
//
// API route de Next.js (Pages Router: /api/emailJs) que reenvía CUALQUIER
// formulario del sitio a través de EmailJS -- es el único lugar del
// código donde vive el serviceID/templateID, así que todos los
// formularios (ContactCtaSection en la home, ContactPageForm en
// /contact, PostContactForm en la página de un post, y NewsletterForm
// en el footer) mandan su propio {name, email, phone?, message} acá en
// vez de llamar a EmailJS cada uno por su cuenta. Corrección de un
// comentario viejo de este archivo: en algún momento se pensó que
// /contact llamaba a EmailJS directo desde el navegador -- ya no es
// así, ContactPageForm también pasa por esta misma ruta.
//
// service_6refp6c / template_7frcfrh: los IDs reales que confirmó el
// cliente para esta cuenta de EmailJS (antes tenía IDs viejos de otro
// proyecto/cuenta -- service_ns37blu / template_4noz9sf -- que ya no
// mandaban los correos a destino). El "userID" (Public Key) se deja
// igual porque no se compartió uno nuevo -- si después de publicar los
// correos NO llegan, lo primero a revisar es si ese Public Key
// pertenece a la MISMA cuenta de EmailJS que service_6refp6c (en
// dashboard.emailjs.com -> Account -> General).
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
        const serviceID = 'service_6refp6c';
        const templateID = 'template_7frcfrh';
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
