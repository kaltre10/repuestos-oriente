import userService from '../services/user.service.js';
import responser from './responser.js';
import { z } from 'zod';

const emailSchema = z.string().email();
const resetPasswordSchema = z.object({
  token: z.string(),
  newPassword: z.string().min(6)
});

// Async handler wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Google authentication
const googleAuth = asyncHandler(async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return responser.error({
      res,
      message: 'El token es requerido',
      status: 400,
    });
  }

  const user = await userService.authenticateWithGoogle(token);
  const jwtToken = userService.generateToken(user);

  responser.success({
    res,
    message: 'Autenticación exitosa',
    body: {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        address: user.address,
        profilePicture: user.profilePicture,
        role: user.role,
      },
      token: jwtToken,
    },
  });
});

const getUsers = asyncHandler(async (req, res) => {
  const users = await userService.getAllUsers();
  responser.success({
    res,
    body: { users },
  });
});

// Create new user (admin)
const createUser = asyncHandler(async (req, res) => {
  const { email, password, name, phone, address } = req.body;

  if (!email || !password || !name) {
    return responser.error({
      res,
      message: 'Email, contraseña y nombre son requeridos',
      status: 400,
    });
  }

  const user = await userService.createUser({ email, password, name, phone, address });

  responser.success({
    res,
    message: 'Usuario creado con éxito',
    body: {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        address: user.address,
        profilePicture: user.profilePicture,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    },
  });
});

// Get user by ID
const getUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await userService.getUserById(id);

  responser.success({
    res,
    body: {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        address: user.address,
        profilePicture: user.profilePicture,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    },
  });
});

// Update user profile
const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  const user = await userService.updateUser(id, updateData);

  responser.success({
    res,
    message: 'Usuario actualizado con éxito',
    body: {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        address: user.address,
        profilePicture: user.profilePicture,
        role: user.role,
        updatedAt: user.updatedAt,
      },
    },
  });
});

// Change password
const changePassword = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return responser.error({
      res,
      message: 'Ambas contraseñas son requeridas',
      status: 400,
    });
  }

  const result = await userService.changePassword(id, { oldPassword, newPassword });

  responser.success({
    res,
    message: result.message,
  });
});

// Delete user
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await userService.deleteUser(id);

  responser.success({
    res,
    message: result.message,
  });
});

// Login with email and password
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return responser.error({
      res,
      message: 'Email y contraseña son requeridos',
      status: 400,
    });
  }

  const user = await userService.login(email, password);

  const token = userService.generateToken(user);

  responser.success({
    res,
    message: 'Inicio de sesión exitoso',
    body: {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        phone: user.phone,
        address: user.address,
        profilePicture: user.profilePicture,
      },
      token,
    },
  });
});

// Register with email and password
const register = asyncHandler(async (req, res) => {
  const { email, password, name } = req.body;

  console.log(req.body);

  if (!email || !password || !name) {
    return responser.error({
      res,
      message: 'Email, contraseña y nombre son requeridos',
      status: 400,
    });
  }

  const user = await userService.register({email, password, name});
  const token = userService.generateToken(user);

  responser.success({
    res,
    message: 'Registro exitoso',
    body: {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        address: user.address,
        profilePicture: user.profilePicture,
        role: user.role
      },
      token,
    },
  });
});

// Forgot password
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const validation = emailSchema.safeParse(email);
  if (!validation.success) {
    return responser.error({
      res,
      message: 'Email inválido',
      status: 400,
    });
  }

  const result = await userService.forgotPassword(email);

  responser.success({
    res,
    message: result.message,
  });
});

// Reset password
const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;

  const validation = resetPasswordSchema.safeParse({ token, newPassword });
  if (!validation.success) {
    return responser.error({
      res,
      message: 'Datos inválidos. La contraseña debe tener al menos 6 caracteres.',
      status: 400,
    });
  }

  const result = await userService.resetPassword(token, newPassword);

  responser.success({
    res,
    message: result.message,
  });
});

export {
  googleAuth,
  login,
  register,
  getUser,
  updateUser,
  changePassword,
  deleteUser,
  getUsers,
  createUser,
  forgotPassword,
  resetPassword
};
