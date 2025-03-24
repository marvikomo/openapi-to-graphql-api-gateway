/** @format */

const onboarding_schema = `#graphql

  directive @auth on FIELD_DEFINITION
  directive @userType(requires: [UserType]) on FIELD_DEFINITION

  scalar Upload
  scalar JSON

    type Query {
  }

  type Mutation {
    registerUser(
      input: registerUserInput
    ): registerUserResponse
  }

  type RegisterUserInput {
    firstName: String!
    lastName: String!
    email: String!
    phone: String!
    password: String!
  }
  type registerUserInput = RegisterUserInput
  type RegisterUserResponse {
  }
  type registerUserResponse = RegisterUserResponse
  
`;

export default onboarding_schema;
