/** @format */

import di from "../../config/di";
import { ProductService } from "../../services/product.service";
const productService: ProductService = di.get("product");

const productResolvers = {
  Query: {
    products(_: any, {}, {}) {
      const productData = {
        productitems: [
          [
            {
              id: "string",
              cuteName: "string",
              cuteBrand: "string",
              price: 0,
              otherItems: {
                id: "string",
                name: "string",
              },
            },
          ],
        ],
        productArray: [
          [
            {
              id: "string",
              cuteName: "string",
              cuteBrand: "string",
              price: 0,
              otherItems: {
                id: "string",
                name: "string",
              },
            },
          ],
        ],
        total: 0,
        products: {
          id: "string",
          cuteName: "string",
          cuteBrand: "string",
          price: 0,
          otherItems: {
            id: "string",
            name: "string",
          },
        },
      };

      return productService.products(productData);
    },
  },
  Mutation: {
    addProduct(_: any, { productInput: args }, {}) {
      const products = {
        ...args,
      };
      return productService.addProduct(products);
    },
  },
};

export default productResolvers;
