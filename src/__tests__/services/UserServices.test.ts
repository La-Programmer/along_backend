import { IUserCreation } from "../../types/user"
import UserService from "../../services/UserServices"
// {
//   userName,
//   firstName,
//   lastName,
//   email,
//   password,
//   confirmPassword
// }

const userName = "TestUser1"
const firstName = "Test"
const lastName = "User1"
const email = "test@gmail.com"
const password = "123456789"
const confirmPassword = "123456789"

const userData: IUserCreation = {
  userName, firstName, lastName, email, password, confirmPassword
}

describe("UserServices.ts tests", () => {
  test("createNewUser", async () => {
    await expect(UserService.createNewUser(userData)).resolves.not.toThrow();
  });
});
