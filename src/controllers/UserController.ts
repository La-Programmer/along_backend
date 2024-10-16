import express from "express";
import UserService from "../services/UserServices";
import validator from "validator";

class UserController {
  /**
   * Class to handle all user logic relating to input reception and validation
   */

  static async registerUser (request: express.Request, response: express.Response) {

    const { userName, firstName, lastName, email, password, confirmPassword } = request.body;
    
    if (!userName) { return response.status(400).send({error: 'Missing username'}) }
    
    if (!email) { return response.status(400).send({error: 'Missing email'}) }
    
    if (!password) { return response.status(400).send({error: 'Missing password'}) }
    
    // VALIDATE EMAIL INPUT
    if (!validator.isEmail(email)) { return response.status(400).send('Please input a valid email') }

    // VALIDATE PASSWORD
    if (!validator.equals(password, confirmPassword)) {
      return response.status(400).send('The two passwords do not match')
    }

    UserService.createNewUser({
      userName,
      firstName,
      lastName,
      email,
      password,
      confirmPassword
    })
      .then(() => {
        response.status(200).send({message: 'User registered successfully'});
      })
      .catch(err => {
        console.log(err);
        response.status(400).send({error: err.message});
      });

  }
}

export default UserController;
