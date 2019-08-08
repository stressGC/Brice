import { Document } from 'mongoose';

/**
 * Interface of a Blog document.
 * @interface IBlogDocument
 * @extends {Document}
 */
export default interface IBlogDocument extends Document {
  createdAt?: number;
  updatedAt?: number;
  title: string;
  keywords: string;
  content: string;
}
