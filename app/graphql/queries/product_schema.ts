/** @format */

const product_schema = `#graphql
  type Query {
    products: ProductResponse
  }

  type Mutation {
    addProduct(productInput: ProductInput): ProductResponse
  }

  input ProductInput {
    productitems: [[ProductItem]]
    productArray: [[ProductItem]]
    total: Int,
    products: ProductItem
  }

  input ProductItem {
      id: String,
      cuteName: String,
      cuteBrand: String,
      price: Int,
      otherItems: OtherItemsInput
  }

  input OtherItemsInput {
      id: String,
      name: String,
}

  type ProductData {
    productitems: [[Products]]
    productArray: [[Products]]
    total: Int,
    products: Products
  }

  type ProductResponse {
    status: String
    data: ProductData
    message: String
  }

  type Products {
      id: String,
      cuteName: String,
      cuteBrand: String,
      price: Int,
      otherItems: OtherItems
  }

  type OtherItems {
      id: String,
      name: String,
    }
`;

export default product_schema;
