/** @format */

const user_schema = `#graphql
  enum UserType {
    CUSTOMER
  }

  enum GenderEnum {
    male
    female
    others
  }

  directive @auth on FIELD_DEFINITION
  directive @userType(requires: [UserType]) on FIELD_DEFINITION

  scalar Upload
  scalar JSON

  type Query {
    me(firstName: String, lastName: String): UserResponse
  }

  type Mutation {
    createMe(firstName: String, lastName: String, gender: GenderEnum, age: Int, totalMoney: Float): UserResponse
    createOrder(orderInput: OrderInput): OrderResponse
  }

  input OrderInput {
    name: String
    orderID: Int
    singleProduct: ProductInput
    manyProducts: [ProductInput]
  }

  input ProductInput {
    name: String
    price: Int
    imageUrl: String
    productAvailable: Boolean
  }

  type Product {
    name: String
    price: Int
    productAvailable: Boolean
    imageUrl: String
  }

  type UserObject {
    firstName: String
    lastName: String
  }

  type UserResponse {
    status: String
    data: UserObject
    message: String
  }

  type OrderData {
    name: String
    orderID: Int
    singleProduct: Product
    manyProducts: [Product]
  }

  type OrderResponse {
    status: String
    data: OrderData
    message: String
  }

  type Response {
    status: String
    message: String
  }
`;

export default user_schema;
