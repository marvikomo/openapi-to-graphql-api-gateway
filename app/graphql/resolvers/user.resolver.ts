/** @format */

import di from "../../config/di";
import { UserService } from "../../services/user.service";
const userService: UserService = di.get("user");

const userResolvers = {
  Query: {
    me(_: any, {}, {}) {
      const currentUser = {
        firstName: "test",
        lastName: "test",
      };
      return userService.me(currentUser);
    },
  },
  Mutation: {
    createMe(_: any, { firstName, lastName }, {}) {
      const currentUser = {
        firstName, lastName
      };
      console.log(currentUser)
      return userService.createMe(currentUser);
    },

    createOrder(_: any, { orderInput: args }, {}) {
      const body = {
        ...args,
      };
      return userService.createOrder(body);
    },
  },
};

export default userResolvers;
