/** @format */

import di from  "../../config/di";
import { UserService } from "";
const  userService: UserService = di.get("user");

const cartResolvers = {
  Query: {
      retrieveCartItems(_: any, {}, {}) {
      
      return userService.retrieveCartItems(currentUser);
    },
      getTotalCartCost(_: any, {}, {}) {
      
      return userService.getTotalCartCost(currentUser);
    },
  },
  Mutation: {
    addItemToCart(_: any) {
      return userService.addItemToCart(currentUser);
    },
    checkout(_: any) {
      return userService.checkout(currentUser);
    },
  },
};

export default cartResolvers;


