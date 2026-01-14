import express from 'express';
import { googleAuth, getUser, updateUser, deleteUser, getUsers } from '../controllers/user.controller.js';
import responser from '../controllers/responser.js';

const router = express.Router();

router.get('/', (_req, res) => {
  responser.success({ res, message: 'User API is working' });
});

router.post('/auth/google', googleAuth);

router.get('/users', getUsers);

router.get('/users/:id', getUser);


router.put('/users/:id', updateUser);

router.delete('/users/:id', deleteUser);

export default router;
