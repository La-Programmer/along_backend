import express, { Application } from 'express';
import authMiddleware from '../middlewares/jwtMiddleWare';
import AuthController from '../controllers/AuthController';
import UserController from '../controllers/UserController';

function controllerRouting(app: Application) {
  const router = express.Router();
  app.use('/', router);

  // User Controller for user endpoints

  // Register a new user
  router.post('/register', (req, res) => {
    UserController.registerUser(req, res);
  })

  // Auth Controller for authentication endpoints

  // Authenticate a registered user
  router.post('/login', async (req, res) => {
    AuthController.loginUser(req, res);
  })
}

export default controllerRouting;
