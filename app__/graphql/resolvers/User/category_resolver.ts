/** @format */

import di from  "../../config/di";
import { UserService } from "";
const  userService: UserService = di.get("user");

const categoryResolvers = {
  Query: {
      fetchCategories(_: any, {}, {}) {
      
      return userService.fetchCategories(currentUser);
    },
      fetchCategoryById(_: any, {}, {}) {
      
      return userService.fetchCategoryById(currentUser);
    },
  },
  Mutation: {
    addCategory(_: any) {
      return userService.addCategory(currentUser);
    },
  },
};

export default categoryResolvers;


