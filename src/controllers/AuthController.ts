import express from "express";
import AuthService from "../services/AuthServices";

class AuthController {
  /**
   * Class to handle all authentication logic as it related to request handling
   */
  static loginUser (request: express.Request, response: express.Response) {
    
    const { password, email, userName } = request.body;

    const name = email || userName;

    try {
      const user = AuthService.authenticate(password, name);
      const result = AuthService.login(user);
      response.status(200).send(result);
    } catch (error: any) {
      response.status(401).send(error.message);
    }
  }
}

export default AuthController;
