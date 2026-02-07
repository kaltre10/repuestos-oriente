import express from 'express';
import { googleAuth, login, register, getUser, updateUser, changePassword, deleteUser, getUsers, createUser, forgotPassword, resetPassword, verifySession } from '../controllers/user.controller.js';
import validateToken from '../midelwares/validateToken.js';
import onlyAdmin from '../midelwares/onlyAdmin.js';
const router = express.Router();

router.post('/auth/google', googleAuth);
router.post('/auth/login', login);
router.post('/auth/register', register);
router.post('/auth/forgot-password', forgotPassword);
router.post('/auth/reset-password', resetPassword);
router.get('/auth/verify', validateToken, verifySession);

// Aplicar middleware de validación de token solo a rutas de usuario

router.get('/users/:id',validateToken, getUser);

router.get('/users',[validateToken, onlyAdmin], getUsers);
router.post('/users', [validateToken, onlyAdmin], createUser);
router.put('/users/:id', validateToken, updateUser);
router.put('/users/:id/password', validateToken, changePassword);
router.delete('/users/:id', validateToken, deleteUser);

export default router;
