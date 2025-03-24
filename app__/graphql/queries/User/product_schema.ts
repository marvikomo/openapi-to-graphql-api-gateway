/** @format */

const product_schema = `#graphql

  directive @auth on FIELD_DEFINITION
  directive @userType(requires: [UserType]) on FIELD_DEFINITION

  scalar Upload
  scalar JSON

    type Query {
    fetchProducts(
    ): fetchProductsResponse
  }

  type Mutation {
  }

  type ChildrenItem {
    id: Int
    position: Int
    name: String
    slug: String
    status: String
    children: [ChildrenItem]
  }
  type Category {
    id: Int
    position: Int
    name: String
    slug: String
    status: String
    children: [ChildrenItem]
  }
  type ProductImagesItem {
    productId: String
    image: String
    position: Float
  }
  type FetchProductsResponseItem {
    productId: String
    name: String
    price: Float
    sku: Int
    category: Category
    description: String
    brand: String
    productImages: [ProductImagesItem]
    status: String
  }
  type fetchProductsResponse = [FetchProductsResponseItem]
  
`;

export default product_schema;
