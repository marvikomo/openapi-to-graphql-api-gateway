/** @format */

const auth_schema = `#graphql

  directive @auth on FIELD_DEFINITION
  directive @userType(requires: [UserType]) on FIELD_DEFINITION

  scalar Upload
  scalar JSON

    type Query {
  }

  type Mutation {
    loginUser(
      input: loginUserInput
    ): loginUserResponse
    verifyOtp(
      input: verifyOtpInput
    ): verifyOtpResponse
  }

  type LoginUserInput {
    email: String!
    password: String!
  }
  type loginUserInput = LoginUserInput
  type LoginUserResponse {
    email: String
    firstname: String
    lastname: String
    status: String
    accessToken: String
  }
  type loginUserResponse = LoginUserResponse
  type VerifyOtpInput {
    email: String!
    otp: String!
  }
  type verifyOtpInput = VerifyOtpInput
  type VerifyOtpResponse {
    accessToken: String
  }
  type verifyOtpResponse = VerifyOtpResponse
  
`;

export default auth_schema;
