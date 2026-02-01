import { OAuth2Client } from 'google-auth-library';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import models from '../models/index.js';
import { sendResetPasswordEmail } from '../utils/mailer.js';
import { Op } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const { User } = models;

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

class UserService {

  async verifyGoogleToken(token) {
    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      return {
        googleId: payload.sub,
        email: payload.email,
        name: payload.name,
        profilePicture: payload.picture,
      };
    } catch (error) {
      throw new Error('Token de Google inválido');
    }
  }

  async getAllUsers() {
    try {
      const users = await User.findAll();
      return users;
    } catch (error) {
      throw new Error(`Error al obtener usuarios: ${error.message}`);
    }
  }

  // Authenticate or create user with Google
  async authenticateWithGoogle(token) {
    try {
      const googleUser = await this.verifyGoogleToken(token);

      // Check if user exists
      let user = await User.findOne({ where: { googleId: googleUser.googleId } });

      if (!user) {
        // Create new user
        user = await User.create({
          googleId: googleUser.googleId,
          email: googleUser.email,
          name: googleUser.name,
          profilePicture: googleUser.profilePicture,
        });
      }

      return user;
    } catch (error) {
      throw new Error(`Autenticación fallida: ${error.message}`);
    }
  }

  // Get user by ID
  async getUserById(id) {
    try {
      const user = await User.findByPk(id);
      if (!user) {
        throw new Error('Usuario no encontrado');
      }
      return user;
    } catch (error) {
      throw new Error(`Error al obtener usuario: ${error.message}`);
    }
  }

  // Update user profile
  async updateUser(id, updateData) {
    try {
      const user = await User.findByPk(id);
      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      // Only allow updating specific fields
      const allowedFields = ['name', 'phone', 'address'];
      const filteredData = {};

      Object.keys(updateData).forEach(key => {
        if (allowedFields.includes(key)) {
          filteredData[key] = updateData[key];
        }
      });

      await user.update(filteredData);
      return user;
    } catch (error) {
      throw new Error(`Error al actualizar usuario: ${error.message}`);
    }
  }

  // Change user password
  async changePassword(id, { oldPassword, newPassword }) {
    try {
      const user = await User.findByPk(id);
      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      // If user has a password (not a Google-only user)
      if (user.password) {
        const isValidPassword = await bcrypt.compare(oldPassword, user.password);
        if (!isValidPassword) {
          throw new Error('La contraseña actual es incorrecta');
        }
      }

      // Hash new password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

      await user.update({ password: hashedPassword });
      return { message: 'Contraseña actualizada exitosamente' };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Delete user
  async deleteUser(id) {
    try {
      const user = await User.findByPk(id);
      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      await user.destroy();
      return { message: 'Usuario eliminado con éxito' };
    } catch (error) {
      throw new Error(`Error al eliminar usuario: ${error.message}`);
    }
  }

  // Create user (admin)
  async createUser({ email, password, name, phone, address }) {
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        throw new Error('Ya existe un usuario con este correo electrónico');
      }

      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create user
      const user = await User.create({
        email,
        password: hashedPassword,
        name,
        phone,
        address,
      });

      return user;
    } catch (error) {
      throw new Error(`Error al crear el usuario: ${error.message}`);
    }
  }

  // Register user with email and password
  async register({ email, password, name }) {
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        throw new Error('Ya existe un usuario con este correo electrónico');
      }

      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create user
      const user = await User.create({
        email,
        password: hashedPassword,
        name,
      });

      return user;
    } catch (error) {
      throw new Error(`Error en el registro: ${error.message}`);
    }
  }

  // Login user with email and password
  async login(email, password) {
    try {
      // Find user by email
      const user = await User.findOne({ where: { email } });
      if (!user) {
        throw new Error('Email o contraseña invalida');
      }

      // Check if user has a password (might be a Google user without password)
      if (!user.password) {
        throw new Error('Esta cuenta está vinculada con Google. Por favor, inicia sesión con Google.');
      }

      // Check password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new Error('Email o contraseña invalida');
      }

      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Generate JWT token
  generateToken(user) {
    return jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'd34efsdf45lts45343ec5re345t',
      { expiresIn: '50d' }
    );
  }

  // Forgot password - Generate token and send email
  async forgotPassword(email) {
    try {
      const user = await User.findOne({ where: { email } });
      
      // For security, don't reveal if user exists or not
      if (!user) {
        return { message: 'Si el correo electrónico está registrado, recibirás un enlace para restablecer tu contraseña.' };
      }

      // Generate token
      const token = crypto.randomBytes(32).toString('hex');
      const expires = new Date(Date.now() + 3600000); // 1 hour from now

      await user.update({
        resetPasswordToken: token,
        resetPasswordExpires: expires
      });

      // Send email
      await sendResetPasswordEmail(email, token);

      return { message: 'Si el correo electrónico está registrado, recibirás un enlace para restablecer tu contraseña.' };
    } catch (error) {
      throw new Error(`Error al procesar el olvido de contraseña: ${error.message}`);
    }
  }

  // Reset password - Verify token and update password
  async resetPassword(token, newPassword) {
    try {
      const user = await User.findOne({
        where: {
          resetPasswordToken: token,
          resetPasswordExpires: {
            [Op.gt]: new Date()
          }
        }
      });

      if (!user) {
        throw new Error('El enlace de restablecimiento es inválido o ha expirado.');
      }

      // Hash new password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

      await user.update({
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null
      });

      return { message: 'Tu contraseña ha sido actualizada exitosamente.' };
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

export default new UserService();
