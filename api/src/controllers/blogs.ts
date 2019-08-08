'use strict';

import { Request, Response, NextFunction } from 'express';
import { OK } from 'http-status-codes';
import Blog from '../models/Blog';
import IBlogDocument from '../interfaces/IBlogDocument';

/**
 * Fetches all blogs and return them as a JSON
 *
 * @param {Request} _req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Response}
 */
export const getAll = (req: Request, res: Response, next: NextFunction): void => {
  Blog
    .fetchAll()
    .then(result => res.status(OK).json(result))
    .catch(error => next(error));
};

/**
 * Fetches an Blog based on its ID, and returns it as a JSON
 *
 * @param {Request} _req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Response}
 */
export const getByID = (req: Request, res: Response, next: NextFunction): void => {
  const { blogID } = req.params;

  Blog
    .fetchByID(blogID)
    .then((result: IBlogDocument) => res.status(OK).json(result))
    .catch((error: any) => next(error));
};

/**
 * Updates an Blog based on its ID, and returns the updated user as a JSON
 *
 * @param {Request} _req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Response}
 */
export const modifyByID = (req: Request, res: Response, next: NextFunction): void => {
  const { blogID } = req.params;
  const modifications = req.body;

  Blog
    .modifyByID(blogID, modifications)
    .then((result: IBlogDocument) => res.status(OK).json(result))
    .catch((error: any) => next(error));
};

/**
 * Creates a new Blog, and returns it as a JSON
 *
 * @param {Request} _req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Response}
 */

export const create = (req: Request, res: Response, next: NextFunction): void => {
  const { title, keywords, content } = req.body;

  const newBlog = {
    title,
    keywords,
    content,
  };

  Blog
    .insertOne(newBlog)
    .then(result => res.status(OK).json(result))
    .catch((error: any) => next(error));
};

/**
 * Deletes a Blog based on its ID, and returns the deleted user as a JSON
 *
 * @param {Request} _req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Response}
 */
export const deleteByID = (req: Request, res: Response, next: NextFunction): void => {
  const { blogID } = req.params;

  Blog
    .deleteByID(blogID)
    .then((result: IBlogDocument) => res.status(OK).json(result))
    .catch((error: any) => next(error));
};
