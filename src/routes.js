import { Router } from 'express';
import User from './app/models/Users';
import UserController from './app/controllers/UserController';

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

export default routes;
