/** @format */

import di from  "../../config/di";
import { UserService } from "";
const  userService: UserService = di.get("user");

const onboardingResolvers = {
  Query: {
  },
  Mutation: {
    registerUser(_: any) {
      return userService.registerUser(currentUser);
    },
  },
};

export default onboardingResolvers;


