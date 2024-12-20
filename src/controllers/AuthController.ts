import express from "express";
import AuthService from "../services/AuthServices";

class AuthController {
  /**
   * Class to handle all authentication logic as it related to request handling
   */
  static async loginUser (request: express.Request, response: express.Response) {
    
    const { password, email, userName } = request.body;

    const name = email || userName;

    if (!name) {
      response.status(400).json({ error: 'Please input email or username' });
    }

    console.log('NAME', name);

    AuthService.authenticate(password, name)
      .then(user => {
        console.log('USER', user);
        const result = AuthService.login(user);
        response.status(200).send(result);
      })
      .catch(error => {
        console.log('ERROR', error);
        response.status(401).send(error.message);
      })
  }

  static async logoutUser (request: any, response: any) {

    await AuthService.deleteRefreshTokenFromRedis(request.user._id)

    response.status(204).send();

  }
  
}

export default AuthController;
