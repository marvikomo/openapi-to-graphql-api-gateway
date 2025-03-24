/** @format */

import di from  "../../config/di";
import { UserService } from "";
const  userService: UserService = di.get("user");

const bookingResolvers = {
  Query: {
      getCartItemsSummary(_: any, {}, {}) {
      
      return userService.getCartItemsSummary(currentUser);
    },
  },
  Mutation: {
    confirmBooking(_: any) {
      return userService.confirmBooking(currentUser);
    },
  },
};

export default bookingResolvers;


