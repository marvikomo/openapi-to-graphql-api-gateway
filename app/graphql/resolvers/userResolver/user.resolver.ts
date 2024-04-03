/** @format */

import di from "../../../config/di";
import { UserService } from "../../../services/UserService/user.service";
import { IUserDetails } from "../../../common/Dto/IUser";
const userService: UserService = di.get("user");

const userResolvers = {
  Query: {
    me(_: any, {}: IUserDetails, {}) {
      const currentUser = {
        firstName: "test",
        lastName: "test",
      };
      return userService.me(currentUser);
    },
  },
  Mutation: {
    createMe(_: any, { firstName, lastName }: IUserDetails, {}) {
      const currentUser = {
        firstName, lastName
      };
      console.log(currentUser)
      return userService.createMe(currentUser);
    },
  },
};

export default userResolvers;
