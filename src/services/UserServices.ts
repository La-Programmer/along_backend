import User, { IUser } from "../models/user";
import bcrypt from "bcrypt";

export interface IUserCreation {
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

const saltRounds: number = 14;

class UserService {
  /**
   * Class to handle all User logic with relation to database operations
   */
  static async createNewUser(userData: IUserCreation) {

    const existingUserEmail = await User.findOne({ email: userData.email })

    const existingUserUserName = await User.findOne({ userName: userData.userName })

    if (existingUserEmail) { throw new Error('This email is already taken'); }

    if (existingUserUserName) { throw new Error('This username is already taken'); }

    // HASH PASSWORD AND STORE IN DATABASE OR RAISE AN ERROR IF ONE OCCURS
    bcrypt.hash(userData.password, saltRounds, (err, hash) => {
      if (err) { throw new Error(`Error: ${err}`); }
      userData.password = hash;      
    });

    const newUser = new User({ userData });

    newUser.save()
      .then(() => newUser)
      .catch((err) => {
        throw new Error(err)
      });
  }

  static getUser(userNameOrEmail: string) {

    if (!userNameOrEmail) { throw new Error('Username/Email not found'); }

    const user = User.findOne({ email:userNameOrEmail })
      .then((user) => user)
      .catch((err) => {
        // Log the actual err
        throw new Error('Email not found');
      }) || User.findOne({ userName:userNameOrEmail })
      .then((user) => user)
      .catch((err) => {
        // Log the actual err
        throw new Error('Email not found');
      }); 

    return user;
  }
}

export default UserService;
