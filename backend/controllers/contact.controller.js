import { sendContactEmail } from '../utils/mailer.js';
import responser from './responser.js';

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const sendContact = asyncHandler(async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return responser.error({
      res,
      message: 'Todos los campos son obligatorios',
      status: 400,
    });
  }

  await sendContactEmail({ name, email, message });

  responser.success({
    res,
    message: 'Mensaje enviado correctamente',
  });
});

export default {
  sendContact,
};
