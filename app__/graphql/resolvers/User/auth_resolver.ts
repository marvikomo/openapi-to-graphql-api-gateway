/** @format */

import di from  "../../config/di";
import { UserService } from "";
const  userService: UserService = di.get("user");

const authResolvers = {
  Query: {
  },
  Mutation: {
    loginUser(_: any) {
      return userService.loginUser(currentUser);
    },
    verifyOtp(_: any) {
      return userService.verifyOtp(currentUser);
    },
  },
};

export default authResolvers;


