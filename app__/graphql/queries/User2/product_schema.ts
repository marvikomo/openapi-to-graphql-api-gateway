/** @format */

const product_schema = `#graphql

  directive @auth on FIELD_DEFINITION
  directive @userType(requires: [UserType]) on FIELD_DEFINITION

  scalar Upload
  scalar JSON

    type Query {
    fetchProducts(
      size: Int, 
      page: Int, 
      brand: String
    ): fetchProductsResponse
    fetchProduct(
      size: Int, 
      page: Int, 
      brand: String
    ): fetchProductResponse
  }

  type Mutation {
    fetchProduct(
      productId: String!, 
      size: Int, 
      page: Int, 
      brand: String, 
      input: fetchProductInput
    ): fetchProductResponse
    fetchProduct(
      productId: String!, 
      input: fetchProductInput
    ): fetchProductResponse
  }

  type SomeThingItem {
    id: String
    name: String
    brand: String
    price: Float
  }
  type OtherItems {
    id: String
    name: String
    someThing: [SomeThingItem]
  }
  type ProductitemsItemItem {
    id: String
    cuteName: String
    cuteBrand: String
    price: Float
    otherItems: OtherItems
  }
  type ProductArrayItemItem {
    id: String
    cuteName: String
    cuteBrand: String
    price: Float
    otherItems: OtherItems
  }
  type Products {
    id: String
    cuteName: String
    cuteBrand: String
    price: Float
    otherItems: OtherItems
  }
  type FetchProductsResponse {
    productitems: [[ProductitemsItemItem]]
    productArray: [[ProductArrayItemItem]]
    total: Int
    products: Products
  }
  type fetchProductsResponse = FetchProductsResponse
  type FetchProductResponse {
    productitems: [[ProductitemsItemItem]]
    productArray: [[ProductArrayItemItem]]
    total: Int
    products: Products
  }
  type fetchProductResponse = FetchProductResponse
  type FetchProductInputItem {
    id: String
    cuteName: String
    cuteBrand: String
    price: Float
    otherItems: OtherItems
  }
  type fetchProductInput = [FetchProductInputItem]
  type FetchProductResponseItem {
    id: String
    cuteName: String
    cuteBrand: String
    price: Float
    otherItems: OtherItems
  }
  
`;

export default product_schema;
