import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendResetPasswordEmail = async (email, token) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
  
  const mailOptions = {
    from: `"Marketplace Support" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Recuperación de contraseña',
    html: `
      <h1>Recuperación de contraseña</h1>
      <p>Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace para crear una nueva:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>Este enlace expirará en 1 hora.</p>
      <p>Si no solicitaste este cambio, puedes ignorar este correo.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    // console.log(`Reset email sent to ${email}`);
  } catch (error) {
    console.error('Error sending reset email:', error);
    throw new Error('Error al enviar el correo de recuperación');
  }
};

export const sendContactEmail = async ({ name, email, message }) => {
  const mailOptions = {
    from: `"Marketplace Contact" <${process.env.EMAIL_USER}>`,
    to: 'manuelperez.0000@gmail.com',
    subject: `Nuevo mensaje de contacto de ${name}`,
    html: `
      <h1>Nuevo mensaje de contacto</h1>
      <p><strong>Nombre:</strong> ${name}</p>
      <p><strong>Correo:</strong> ${email}</p>
      <p><strong>Mensaje:</strong></p>
      <p>${message}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    // console.log(`Contact email sent from ${email}`);
  } catch (error) {
    console.error('Error sending contact email:', error);
    throw new Error('Error al enviar el correo de contacto');
  }
};
