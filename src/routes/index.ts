import express, { Application } from 'express';
import AuthController from '../controllers/AuthController';
import UserController from '../controllers/UserController';
import { authenticateAccessToken, authenticateRefreshToken } from '../middlewares/AuthMiddleWare';

function controllerRouting(app: Application) {
  const router = express.Router();
  app.use('/', router);
  // User Controller for user endpoints

  // Register a new user
  router.post('/register', (req, res) => {
    console.log("Request body", req.body);
    UserController.registerUser(req, res);
  })

  // Auth Controller for authentication endpoints

  // Authenticate a registered user
  router.post('/login', async (req, res) => {
    AuthController.loginUser(req, res);
  })
}

export default controllerRouting;
