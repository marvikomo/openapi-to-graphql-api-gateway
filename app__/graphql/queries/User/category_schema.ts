/** @format */

const category_schema = `#graphql

  directive @auth on FIELD_DEFINITION
  directive @userType(requires: [UserType]) on FIELD_DEFINITION

  scalar Upload
  scalar JSON

    type Query {
    fetchCategories(
    ): fetchCategoriesResponse
    fetchCategoryById(
      categoryId: String!
    ): fetchCategoryByIdResponse
  }

  type Mutation {
    addCategory(
      input: addCategoryInput
    ): addCategoryResponse
  }

  type ChildrenItem {
    id: Int
    position: Int
    name: String
    slug: String
    status: String
    children: [ChildrenItem]
  }
  type FetchCategoriesResponseItem {
    id: Int
    position: Int
    name: String
    slug: String
    status: String
    children: [ChildrenItem]
  }
  type fetchCategoriesResponse = [FetchCategoriesResponseItem]
  type AddCategoryInput {
    parentId: Int!
    position: Int!
    name: String!
    slug: String!
  }
  type addCategoryInput = AddCategoryInput
  type AddCategoryResponse {
    success: Boolean!
    message: String
  }
  type addCategoryResponse = AddCategoryResponse
  type FetchCategoryByIdResponse {
    id: Int
    position: Int
    name: String
    slug: String
    status: String
    children: [ChildrenItem]
  }
  type fetchCategoryByIdResponse = FetchCategoryByIdResponse
  
`;

export default category_schema;
