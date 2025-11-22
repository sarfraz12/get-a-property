
import emailjs from '@emailjs/browser';

export default async function Handler (req, res)  {
    

    if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
    }

    const { name, email, message } = req.body;

    const templateParams = {
        from_name: name,
        from_email: email,
        message: message,
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