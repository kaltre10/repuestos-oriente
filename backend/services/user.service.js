import { OAuth2Client } from 'google-auth-library';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import models from '../models/index.js';
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
      throw new Error('Invalid Google token');
    }
  }

  async getAllUsers() {
    try {
      const users = await User.findAll();
      return users;
    } catch (error) {
      throw new Error(`Failed to get users: ${error.message}`);
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
      throw new Error(`Authentication failed: ${error.message}`);
    }
  }

  // Get user by ID
  async getUserById(id) {
    try {
      const user = await User.findByPk(id);
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      throw new Error(`Failed to get user: ${error.message}`);
    }
  }

  // Update user profile
  async updateUser(id, updateData) {
    try {
      const user = await User.findByPk(id);
      if (!user) {
        throw new Error('User not found');
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
      throw new Error(`Failed to update user: ${error.message}`);
    }
  }

  async deleteUser(id) {
    try {
      const user = await User.findByPk(id);
      if (!user) {
        throw new Error('User not found');
      }

      await user.destroy();
      return { message: 'User deleted successfully' };
    } catch (error) {
      throw new Error(`Failed to delete user: ${error.message}`);
    }
  }

  // Register user with email and password
  async register(email, password, name) {
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        throw new Error('User already exists with this email');
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
      throw new Error(`Registration failed: ${error.message}`);
    }
  }

  // Login user with email and password
  async login(email, password) {
    try {
      // Find user by email
      const user = await User.findOne({ where: { email } });
      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Check password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new Error('Invalid email or password');
      }

      return user;
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }
  }

  // Generate JWT token
  generateToken(user) {
    return jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
  }
}

export default new UserService();
