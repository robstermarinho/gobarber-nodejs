import { Router } from 'express';
import User from './app/models/Users';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import authMiddleware from './app/middleware/auth';

const routes = new Router();

routes.get('/test_create_user', async (req, res) => {
  const user = await User.create({
    name: 'Robert Marinho',
    email: 'robster.mr@gmail.com',
    password_hash: '123456',
  });
  return res.json(user);
});

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

// It will use the auth middleware for the other routes bellow:
routes.use(authMiddleware);
routes.put('/users', UserController.update);

export default routes;
