/** @format */

import di from  "../../config/di";
import { UserService } from "";
const  userService: UserService = di.get("user");

const productResolvers = {
  Query: {
      fetchProducts(_: any, {}, {}) {
      
      return userService.fetchProducts(currentUser);
    },
  },
  Mutation: {
  },
};

export default productResolvers;


