import express from 'express';
import { googleAuth, login, register, getUser, updateUser, changePassword, deleteUser, getUsers, createUser, forgotPassword, resetPassword } from '../controllers/user.controller.js';
import validateToken from '../midelwares/validateToken.js';
const router = express.Router();

router.post('/auth/google', googleAuth);
router.post('/auth/login', login);
router.post('/auth/register', register);
router.post('/auth/forgot-password', forgotPassword);
router.post('/auth/reset-password', resetPassword);

// Aplicar middleware de validación de token solo a rutas de usuario

router.get('/users/:id',validateToken, getUser);

router.get('/users',validateToken, getUsers);
router.post('/users', validateToken, createUser);
router.put('/users/:id', validateToken, updateUser);
router.put('/users/:id/password', validateToken, changePassword);
router.delete('/users/:id', validateToken, deleteUser);

export default router;
