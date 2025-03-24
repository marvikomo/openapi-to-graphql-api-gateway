/** @format */

import di from  "../../config/di";
import { User2Service } from "";
const  user2Service: User2Service = di.get("user2");

const productResolvers = {
  Query: {
      fetchProducts(_: any, {}, {}) {
      
      return user2Service.fetchProducts(currentUser);
    },
      fetchProduct(_: any, {}, {}) {
      
      return user2Service.fetchProduct(currentUser);
    },
  },
  Mutation: {
    fetchProduct(_: any) {
      return user2Service.fetchProduct(currentUser);
    },
    fetchProduct(_: any) {
      return user2Service.fetchProduct(currentUser);
    },
  },
};

export default productResolvers;


