/** @format */


const userResolvers = {
  Query: {
    me(_: any, {}, {}) {
      const currentUser = {
        firstName: "test",
        lastName: "test",
      };
      return {
        status: "sucess",
        data: currentUser,
        message: "sucessful"
      }
    },
  },
  Mutation: {
    createMe(_: any, { firstName, lastName }, {}) {
      const currentUser = {
        firstName, lastName
      };
      return {
        status: "sucess",
        data: currentUser,
        message: "sucessful"
      }
    },
  },
};

export default userResolvers;
