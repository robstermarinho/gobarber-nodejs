import { Router } from 'express';
import Multer from 'multer';
import User from './app/models/Users';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import authMiddleware from './app/middleware/auth';
import multerConfig from './config/multer';
import ProviderController from './app/controllers/ProviderController';
import AppointmentController from './app/controllers/AppointmentController';

const routes = new Router();
const upload = new Multer(multerConfig);
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
routes.get('/providers', ProviderController.index);

routes.get('/appointments', AppointmentController.index);
routes.post('/appointments', AppointmentController.store);
routes.post('/files', upload.single('file'), FileController.store);
export default routes;
