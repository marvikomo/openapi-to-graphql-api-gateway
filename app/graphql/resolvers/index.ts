import productResolvers from './product.resolver';
import userResolvers from './user.resolver';

const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...productResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...productResolvers.Mutation
  },
};

export default resolvers;
