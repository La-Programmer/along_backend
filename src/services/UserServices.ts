import User from "../models/user";
import bcrypt from "bcrypt";
import { IUser, IUserCreation } from "../types/user";

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
      console.log("HASHED PASSWORD", hash);
      userData.password = hash;
      console.log("UPDATED PASSWORD", userData.password);
      delete userData.confirmPassword
      const newUser = new User({ ...userData });
      try {
        newUser.save()
        .then(() => newUser)
        .catch((err) => {
          throw new Error(err)
        });
      } catch (error: any) {
        console.log(error);
        throw new Error(error)
      }
    });
  }

  static async getUser(userNameOrEmail: string) {

    if (!userNameOrEmail) { throw new Error('Username/Email not found'); }

    const [userByEmail, userByUsername] = await Promise.all([
      User.findOne({ email: userNameOrEmail }),
      User.findOne({ userName: userNameOrEmail }),
    ]);

    if (userByEmail) {
      return userByEmail;
    } else if (userByUsername) {
      return userByUsername;
    } else {
      throw new Error('User not found');
    } 

  }

  static async updateUserby(email: string, key: string, value: any) {
    try {
      await User.updateOne(
        { email: email },
        { $set: { [key]: "value" } }
      );
    } catch (error: any) {
      throw new Error(error);
    }
  }
}

export default UserService;
