import { Response, NextFunction } from 'express';
import * as Boom from '@hapi/boom';
import { NO_JWT_TOKEN, INVALID_JWT_TOKEN } from '../utils/lang';
import * as jwt from 'jsonwebtoken';
import winston from '../utils/logger/winston';
import { getStatusText, UNAUTHORIZED, INTERNAL_SERVER_ERROR, BAD_REQUEST } from 'http-status-codes';
import User from '../models/User';
import IUserDocument from '../interfaces/IUserDocument';
import { IContextualRequest } from './../interfaces/IRequest';
require('dotenv').config();

// encryption key
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

/**
 * makes sure there is a parsable token in the header
 *
 * @param {IContextualRequest} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {void}
 */
export const tokenExists = (req: IContextualRequest, res: Response, next: NextFunction): void => {
  // Get auth header value
  const bearerHeader = req.headers.authorization;

  // Check if bearer is undefined, auth fails
  if (typeof bearerHeader === 'undefined') return next(Boom.unauthorized(NO_JWT_TOKEN));

  try {
    // extract the token
    req.context = {
      token: bearerHeader.split(' ')[1],
    };

    return next();
  } catch (e) {
    return next(Boom.unauthorized(INVALID_JWT_TOKEN));
  }
};

/**
 * check if a user is logged with the token and populate local context with it
 *
 * @param {IContextualRequest} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export const tokenIsLegit = (req: IContextualRequest, res: Response, next: NextFunction): void => {
  const { token } = req.context;

  jwt.verify(token, JWT_SECRET_KEY, (err: jwt.VerifyErrors, authData: object) => {
    if (err) return next(Boom.unauthorized(getStatusText(UNAUTHORIZED)));

    req.context.authData = authData;
    return next();
  });
};

/**
 * checks if the provided credentials are correct
 *
 * @param {IContextualRequest} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns
 */
export const credentialsMatches = (req: IContextualRequest, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  User.findOne({ email }, (err: any, user: IUserDocument) => {
    // internal error
    if (err) return next(Boom.internal(getStatusText(INTERNAL_SERVER_ERROR)));
    // no user found
    if (!user) return next(Boom.unauthorized(getStatusText(UNAUTHORIZED)));

    // passwords dont match
    user
      .comparePassword(password)
      .then((result) => {
        if (!result) return next(Boom.unauthorized(getStatusText(UNAUTHORIZED)));

        // format user and remove unwanted infos
        const formattedUser = { ...user._doc };
        delete formattedUser.password;
        delete formattedUser.__v;
        req.context = { user: formattedUser };
        return next();
      });
  });
};

export const isAuth = [tokenExists, tokenIsLegit];
export default isAuth;
