import nodemailer from 'nodemailer';
import { getConfig } from '../config';

const config = getConfig();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.gmailUser,
    pass: config.gmailAppPassword,
  },
});

interface ContactEmailData {
  fullName: string;
  email: string;
  message: string;
}

export const sendContactEmail = async (data: ContactEmailData) => {
  const mailOptions = {
    from: `"Portfolio Contact" <${config.gmailUser}>`, // sender address
    to: config.gmailUser, // list of receivers
    subject: `New Contact Message from ${data.fullName}`, // Subject line
    text: `You have received a new message from your portfolio contact form.\n\n           Name: ${data.fullName}\n           Email: ${data.email}\n           Message: \n${data.message}`, // plain text body
    html: `<p>You have received a new message from your portfolio contact form.</p>
           <h3>Details:</h3>
           <ul>
             <li><strong>Name:</strong> ${data.fullName}</li>
             <li><strong>Email:</strong> ${data.email}</li>
           </ul>
           <h3>Message:</h3>
           <p>${data.message}</p>`, // html body
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email.');
  }
};
