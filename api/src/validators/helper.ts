// tslint:disable: max-line-length
'use strict';

import { validateUser, validateUserID, validateUserModificationBody } from './userValidator';
import { validateBlog, validateBlogID, validateBlogModificationBody } from './blogValidator';
import { validateLoginBody } from './authValidator';
import winston from '../utils/logger/winston';
import validationErrorHandler from './validationErrorHandler';
import { USER, BLOG, AUTH } from '../utils/constants';
import * as lang from '../utils/lang';
import { body, param } from 'express-validator/check';

/**
 * returns a 'is_present' validator based of fieldName
 *
 * @param {string} fieldName
 */
export const exists = (fieldName: string, where: 'body' | 'param') => {
  if (where === 'param') return param(fieldName, lang.fieldMissing(fieldName)).exists();
  return body(fieldName, lang.fieldMissing(fieldName)).exists();
};

/**
 * Get a validator middlewares chain based on its identifier
 *
 * @param {string} identifier
 * @returns Middleware chain
 */
const getValidatorFunction = (identifier: string) => {
  switch (identifier) {
    case USER.VALIDATION:
      return validateUser;
    case USER.IS_ID_CORRECT:
      return validateUserID;
    case USER.MODIFICATION:
      return validateUserModificationBody;
    case BLOG.VALIDATION:
      return validateBlog;
    case BLOG.IS_ID_CORRECT:
      return validateBlogID;
    case BLOG.MODIFICATION:
      return validateBlogModificationBody;
    case AUTH.LOGIN:
      return validateLoginBody;
    default:
      winston.error(`No validator found with identifier {${identifier}}`);
      break;
  }
};

/** 
 * Merges the validator chain and the validation error handler based on the identifier
 *
 * @param {string} identifier
 */
export const get = (identifier: string) => [...getValidatorFunction(identifier), validationErrorHandler];
