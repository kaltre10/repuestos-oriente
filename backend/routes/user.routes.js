import express from 'express';
import { googleAuth, login, register, getUser, updateUser, changePassword, deleteUser, getUsers, createUser, forgotPassword, resetPassword } from '../controllers/user.controller.js';
import validateToken from '../midelwares/validateToken.js';
const router = express.Router();

router.post('/auth/google', googleAuth);
router.post('/auth/login', login);
router.post('/auth/register', register);
router.post('/auth/forgot-password', forgotPassword);
router.post('/auth/reset-password', resetPassword);

router.use(validateToken);

router.get('/users', getUsers);
router.post('/users', createUser);
router.get('/users/:id', getUser);
router.put('/users/:id', updateUser);
router.put('/users/:id/password', changePassword);
router.delete('/users/:id', deleteUser);

export default router;
