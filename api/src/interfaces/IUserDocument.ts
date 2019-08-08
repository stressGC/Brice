import { Schema, Document } from 'mongoose';

/**
 * Interface of a User document.
 * @interface IUserDocument
 * @extends {Document}
 */
export default interface IUserDocument extends Document {
  _doc: {
    [key: string]: any,
  };
  name: string;
  email: string;
  createdAt?: Number;
  password: string;
  comparePassword: (password: string) => Promise<boolean>;
}