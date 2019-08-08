import { Response } from 'express';
import * as jwt from 'jsonwebtoken';
import * as Boom from '@hapi/boom';
import { getStatusText, FORBIDDEN, OK } from 'http-status-codes';
import { IContextualRequest } from './../interfaces/IRequest';
require('dotenv').config();

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

/**
 * Logs a user in
 *
 * @param {IContextualRequest} _req
 * @param {Response} res
 * @returns {Response}
 */
export const login = (req: IContextualRequest, res: Response) => {
  const { user } = req.context;

  jwt.sign({ user }, JWT_SECRET_KEY, { expiresIn: '2h' }, (error: Error, token) => {
    if (error) return Boom.forbidden(getStatusText(FORBIDDEN));

    return res.status(OK).json({
      token,
      user,
    });
  });
};
