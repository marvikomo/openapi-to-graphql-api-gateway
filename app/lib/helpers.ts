import { IError, ISuccess } from '../common/IResponse';
import ResponseMessages from './response-messages';

/**
 * Class with methods to help your life... LOL
 */
export default class Helpers {
  /**
   * Checks if an object data is empty and returns.
   * @param  {object} obj - The object to check.
   * @return {boolean} - The result.
   */
  static isEmptyObject = (obj: object): boolean => {
    return (
      obj &&
      Object.keys(obj).length === 0 &&
      Object.getPrototypeOf(obj) === Object.prototype
    );
  };

  /**
   * returns success data.
   * @param  {object} obj - The data.
   * @param  {string} message - success message.
   */
  static success = (
    data: object | Array<object> | null,
    message?: string
  ): ISuccess => {
    return {
      message,
      data,
      status: ResponseMessages.STATUS_SUCCESS,
    };
  };

  /**
   * returns formatted error.
   * @param  {string} message - Error message.
   * @return {object} - The result.
   */
  static error = (message?: string): IError => {
    return {
      message,
      status: ResponseMessages.STATUS_ERROR,
    };
  };

  /**
   * Replace Spaces with Dashes in a String.
   * @param  {string} str - The string to be replaced.
   * @return {string} - The result to lowercase.
   */
  static replaceSpaceWithDashes = (str: string): string => {
    return str.replace(/\s+/g, '-').toLowerCase();
  };

  /**
   * Encode text
   * @param  {string} text - The text.
   * @return {string} - The encoded string
   */
  static encode = (text: string): string => {
    return Buffer.from(text).toString('base64');
  };

  /**
   * Decode text
   * @param  {string} encodedText - The encoded text.
   * @return {string} - The decoded string
   */
  static decode = (encodedText: string): string => {
    return Buffer.from(encodedText, 'base64').toString('ascii');
  };
}
