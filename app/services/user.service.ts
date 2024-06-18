/** @format */

import { GraphQLError } from "graphql";
import Helpers from "../lib/helpers";

export class UserService {
  constructor() {}
  public me = async (currentUser) => {
    try {
      return Helpers.success(currentUser);
    } catch (error) {
      return Helpers.error(error?.message);
    }
  };

  public createMe = async (currentUser) => {
    try {
      if (!currentUser) throw new GraphQLError("not data returned!");
      console.log(currentUser);
      return Helpers.success(currentUser);
    } catch (error) {
      return Helpers.error(error?.message);
    }
  };

  public createOrder = async (createOrderData) => {
    try {
      return Helpers.success(createOrderData);
    } catch (error) {
      return Helpers.error(error?.message);
    }
  };
}
