/** @format */

import { GraphQLError } from "graphql";
import { IUserDetails } from "../../common/Dto/IUser";
import { IError, ISuccess } from "../../common/IResponse";
import Helpers from "../../lib/helpers";

export class UserService {
  constructor() {}
  public me = async (currentUser: IUserDetails): Promise<ISuccess | IError> => {
    try {
      return Helpers.success(currentUser);
    } catch (error) {
      return Helpers.error(error?.message);
    }
  };

  public createMe = async (
    currentUser: IUserDetails
  ): Promise<ISuccess | IError> => {
    try {
      if (!currentUser) throw new GraphQLError("not data returned!");
      console.log(currentUser);
      return Helpers.success(currentUser);
    } catch (error) {
      return Helpers.error(error?.message);
    }
  };
}
