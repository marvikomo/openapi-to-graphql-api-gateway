/** @format */

const user_schema = `#graphql
  enum UserType {
    CUSTOMER
  }

  directive @auth on FIELD_DEFINITION
  directive @userType(requires: [UserType]) on FIELD_DEFINITION

  scalar Upload
  scalar JSON

  type Query {
    me(firstName: String, lastName: String): UserResponse
  }

  type Mutation {
    createMe(firstName: String, lastName: String): UserResponse
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

  type Response {
    status: String
    message: String
  }
`;

export default user_schema;
