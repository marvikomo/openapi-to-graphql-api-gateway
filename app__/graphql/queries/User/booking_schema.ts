/** @format */

const booking_schema = `#graphql

  directive @auth on FIELD_DEFINITION
  directive @userType(requires: [UserType]) on FIELD_DEFINITION

  scalar Upload
  scalar JSON

    type Query {
    getCartItemsSummary(
      itemId: String!
    ): getCartItemsSummaryResponse
  }

  type Mutation {
    confirmBooking(
      input: confirmBookingInput
    ): confirmBookingResponse
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
  type ProductItem {
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
  type GetCartItemsSummaryResponse {
    total: Float
    product: [ProductItem]
    shippingFee: Float
  }
  type getCartItemsSummaryResponse = GetCartItemsSummaryResponse
  type ConfirmBookingInput {
    coverImage: String!
    purchaseEndDate: String!
    eventType: String!
  }
  type confirmBookingInput = ConfirmBookingInput
  type ConfirmBookingResponse {
    bookingId: String
    bookingNumber: Int
    bookingUrl: String
  }
  type confirmBookingResponse = ConfirmBookingResponse
  
`;

export default booking_schema;
