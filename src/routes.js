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
import ScheduleController from './app/controllers/ScheduleController';
import NotificationsController from './app/controllers/NotificationsController';
import AvailableController from './app/controllers/AvailableController';

const routes = new Router();
const upload = new Multer(multerConfig);
routes.get('/', () => ({ OK: 'OK' }));

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

// It will use the auth middleware for the other routes bellow:
routes.use(authMiddleware);
routes.put('/users', UserController.update);

routes.get('/providers', ProviderController.index);
routes.get('/providers/:providerId/available', AvailableController.index);

routes.get('/appointments', AppointmentController.index);
routes.post('/appointments', AppointmentController.store);
routes.delete('/appointments/:id', AppointmentController.delete);

routes.get('/schedule', ScheduleController.index);

routes.get('/notifications', NotificationsController.index);
routes.put('/notifications/:id', NotificationsController.update);

routes.post('/files', upload.single('file'), FileController.store);
export default routes;
