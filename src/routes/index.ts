import express, { Application } from 'express';
import authMiddleware from '../middlewares/jwtMiddleWare';
import AuthController from '../controllers/AuthController';
import UserController from '../controllers/UserController';
import VerificationController from "../controllers/VerificationController";


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

  // Send OTP out.
  router.post("/send-otp", async (req, res) => {
    VerificationController.sendOtp(req, res)
  });

  // Verify OTP 
  router.post("/verify-otp", async (req, res) => {
    VerificationController.verifyOtp(req, res)
  });

}

export default controllerRouting;
