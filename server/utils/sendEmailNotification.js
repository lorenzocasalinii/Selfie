import nodemailer from "nodemailer";
import config from "../config/config.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.emailUser,
    pass: config.emailPass,
  },
});

// Funzione per inviare una email
const sendEmailNotification = async (to, subject, message) => {
  try {
    await transporter.sendMail({
      from: config.emailUser,
      to,
      subject,
      html: `
        <html>
          <body>
            <h1>${subject}</h1>
            <div>${message}</div>
          </body>
        </html>
      `,
    });

  } catch (err) {
    console.error(`Errore durante l'invio della mail a ${to}:`, err);
  }
};

export default sendEmailNotification;
