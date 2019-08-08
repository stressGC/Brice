// tslint:disable: max-line-length import-name
'use strict';

import { body, param } from 'express-validator/check';
import * as lang from '../utils/lang';

/**
 * returns a 'is_present' validator based of fieldName
 *
 * @param {string} fieldName
 */
export const exists = (fieldName: string, where: 'body' | 'param') => {
  if (where === 'param') {
    return param(fieldName, lang.fieldMissing(fieldName)).exists().not().isEmpty();
  }
  return body(fieldName, lang.fieldMissing(fieldName)).exists().not().isEmpty();
};

/* MISSING */
const MISSING_EMAIL = exists('email', 'body');
const MISSING_PASSWORD = exists('password', 'body');

/* INVALID */
const INVALID_EMAIL_IS_EMAIL =  body('email', lang.fieldInvalid('email'))
                                  .isEmail()
                                  .normalizeEmail();

/**
 * email field is valid
 * @email present
 * @email is valid email
 */
const EMAIL_VALIDATION = [
  MISSING_EMAIL,
  INVALID_EMAIL_IS_EMAIL,
];

/**
 * validates a login request body
 * @password is present
 * @email is valid email
 */
export const validateLoginBody = [
  MISSING_PASSWORD,
  ...EMAIL_VALIDATION,
];
