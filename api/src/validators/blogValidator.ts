// tslint:disable: max-line-length import-name
'use strict';

import { body, param, oneOf, ValidationChain } from 'express-validator/check';
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
const MISSING_TITLE = exists('title', 'body');
const MISSING_CONTENT = exists('content', 'body');
const MISSING_KEYWORDS = exists('keywords', 'body');
const MISSING_BLOGID = exists('blogID', 'param');

/* INVALID */
const INVALID_CONTENT_LENGTH = body('content', lang.fieldLengthInvalid('content', 30))
                                  .isString()
                                  .isLength({ min: 30 })
                                  .trim();
const INVALID_TITLE_LENGTH = body('title', lang.fieldLengthInvalid('title', 8, 120))
                                  .isString()
                                  .isLength({ min: 8, max: 120 })
                                  .trim();
const INVALID_ID_NOT_MONGOID = param('blogID', lang.fieldInvalid('blogID'))
                                  .isMongoId();

/**
 * title field is valid
 * @title present
 * @title 8 < length < 120
 */
const TITLE_VALIDATION = [
  MISSING_TITLE,
  INVALID_TITLE_LENGTH,
];

/**
 * content field is valid
 * @content present
 * @content 30 < length
 */
const CONTENT_VALIDATION = [
  MISSING_CONTENT,
  INVALID_CONTENT_LENGTH,
];

/**
 * blogID field is valid
 * @blogID is present
 * @blogID is valid MongoID
 */
const BLOGID_VALIDATION = [
  MISSING_BLOGID,
  INVALID_ID_NOT_MONGOID,
];

/**
 * validates blog post creation
 * @body title, keywords, content
 * @title is valid
 * @content is valid
 */
export const validateBlog: ValidationChain[] = [
  MISSING_KEYWORDS,
  ...TITLE_VALIDATION,
  ...CONTENT_VALIDATION,
];

/**
 * validates a blogID
 * @param blogID
 * @blogID is valid MongoID
 */
export const validateBlogID: ValidationChain[] = [
  ...BLOGID_VALIDATION,
];

/**
 * validates a blog post modification
 * @param blogID
 * @body oneOf(title, keywords, content)
 * @userID is valid MongoID
 * @title is valid
 * @content is valid
 * @keywords is present
 */
export const validateBlogModificationBody = [
  ...BLOGID_VALIDATION,
  oneOf([
    TITLE_VALIDATION,
    CONTENT_VALIDATION,
    MISSING_KEYWORDS,
  ],    lang.EMPTY_BODY),
];
