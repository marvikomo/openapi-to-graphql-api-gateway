/** @format */

import di from "../../../config/di";
import { UserService } from "../../../services/UserService/user.service";
import { IUserDetails } from "../../../common/Dto/IUser";
const userService: UserService = di.get("user");

const userResolvers = {
  Query: {
    me(_: any, { firstName, lastName }: IUserDetails, {}) {
      const currentUser = {
        firstName,
        lastName,
      };
      return userService.me(currentUser);
    },
  },
  // Mutation: {},
};

export default userResolvers;
