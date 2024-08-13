/** @format */

import { GraphQLError } from "graphql";
import Helpers from "../lib/helpers";

export class ProductService {
  constructor() {}
  public products = async (products) => {
    try {
      return Helpers.success(products);
    } catch (error) {
      return Helpers.error(error?.message);
    }
  };

  public addProduct = async (
    products
  ) => {
    try {
      if (!products) throw new GraphQLError("not data returned!");
      console.log(products);
      return Helpers.success(products);
    } catch (error) {
      return Helpers.error(error?.message);
    }
  };
}
