/** @format */

const cart_schema = `#graphql

  directive @auth on FIELD_DEFINITION
  directive @userType(requires: [UserType]) on FIELD_DEFINITION

  scalar Upload
  scalar JSON

    type Query {
    retrieveCartItems(
    ): retrieveCartItemsResponse
    getTotalCartCost(
    ): getTotalCartCostResponse
  }

  type Mutation {
    addItemToCart(
      input: addItemToCartInput
    ): addItemToCartResponse
    checkout(
      input: checkoutInput
    ): checkoutResponse
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
  type Product {
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
  type RetrieveCartItemsResponseItem {
    id: String
    product: Product
    costPrice: Float
    sellingPrice: Float
    ownershipType: String
  }
  type retrieveCartItemsResponse = [RetrieveCartItemsResponseItem]
  type AddItemToCartInput {
    productId: String!
    quantity: Int!
  }
  type addItemToCartInput = AddItemToCartInput
  type AddItemToCartResponse {
    cartItemId: String
  }
  type addItemToCartResponse = AddItemToCartResponse
  type GetTotalCartCostResponse {
    total: Float
  }
  type getTotalCartCostResponse = GetTotalCartCostResponse
  type CheckoutInput {
    coverImg: String!
    eventType: String!
    eventEndDate: String!
    shippingFee: Float!
    totalAmount: Float!
  }
  type checkoutInput = CheckoutInput
  type checkoutResponse = String
  
`;

export default cart_schema;
