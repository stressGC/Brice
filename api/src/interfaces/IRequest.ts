import { Request } from 'express';
export interface IContextualRequest extends Request {
  // we added a context key so we can pass local data through our middleware chain
  context?: {
    [key: string]: any,
    token?: string,
  };
}
