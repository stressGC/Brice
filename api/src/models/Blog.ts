'use strict';

import { Schema, Model, model } from 'mongoose';
import IBlogDocument from './../interfaces/IBlogDocument';
import * as Boom from '@hapi/boom';
import { INTERNAL_SERVER_ERROR, getStatusText } from 'http-status-codes';
import { RESSOURCE_NOT_FOUND, EMAIL_ALREADY_TAKEN } from '../utils/lang';

/* Blog document extended */
export interface IBlog extends IBlogDocument {}

/* Blog model extended */
export interface IBlogModel extends Model<IBlog> {
  fetchAll(): Promise<{}>;
  fetchByID(blogID: string): Promise<{}>;
  insertOne(newBlog: any): Promise<{}>;
  deleteByID(blogID: string): Promise<{}>;
  modifyByID(blogID: string, modifications: {}): Promise<{}>;
}

/** Mongoose Blog Schema */
export const blogSchema: Schema = new Schema({
  createdAt: Number,
  updatedAt: Number,
  title: String,
  keywords: String,
  content: String,
});

// we want to up automatically add the createdAt if not present
blogSchema.pre<IBlogDocument>('save', function (next) {
  const now = Date.now();
  if (!this.createdAt) {
    this.createdAt = now;
  }
  this.updatedAt = now;
  next();
});

/**
 * Fetches all Blogs on DB
 *
 * @returns {Promise<{}>} Promise Object to be called by the controller
 */
blogSchema.statics.fetchAll = function (): Promise<{}> {
  return new Promise((resolve, reject) => {
    this.find({}).select('-__v').exec((err: any, docs: any) => {
      if (err) return reject(Boom.internal(getStatusText(INTERNAL_SERVER_ERROR)));
      return resolve(docs);
    });
  });
};

/**
 * Fetches a Blog based on its ID
 *
 * @param {String} blogID Blog ID (MongoID format) to be fetched
 * @returns {Promise<{}>} Promise Object to be called by the controller
 */
blogSchema.statics.fetchByID = function (blogID: string) {
  return new Promise((resolve, reject) => {
    this.findById(blogID).select('-__v').exec((err: any, Blog: IBlogDocument) => {
      if (err) return reject(Boom.internal(getStatusText(INTERNAL_SERVER_ERROR)));
      if (!Blog) return reject(Boom.notFound(RESSOURCE_NOT_FOUND));
      return resolve(Blog);
    });
  });
};

/**
 * Inserts a new Blog
 *
 * @param {any} newBlog JSON containing the new Blog infos
 * @returns {Promise<{}>} Promise Object to be called by the controller
 */
blogSchema.statics.insertOne = function (newBlog: any) {
  return new Promise((resolve, reject) => {
    this.create(newBlog, (err: any, blog: IBlogDocument) => {
      if (err) {
        if (err.code === 11000) return reject(Boom.badRequest(EMAIL_ALREADY_TAKEN));
        return reject(Boom.internal(getStatusText(INTERNAL_SERVER_ERROR)));
      }
      const { __v, password, ...formatedBlog } = blog.toObject();
      return resolve(formatedBlog);
    });
  });
};

/**
 * Fetches a Blog based on its ID
 *
 * @param {String} blogID Blog ID (MongoID format) to be fetched
 * @param {any} midifications JSON containing the updated Blog infos
 * @returns {Promise<{}>} Promise Object to be called by the controller
 */
blogSchema.statics.modifyByID = function (blogID: string, modifications: {}) {
  return new Promise((resolve, reject) => {
    this.findOneAndUpdate(
      { _id: blogID }, modifications,
      { new: true },
      (err: any, blog: IBlogDocument) => {
        if (err) return reject(Boom.internal(getStatusText(INTERNAL_SERVER_ERROR)));
        if (!blog) return reject(Boom.notFound(RESSOURCE_NOT_FOUND));

        const { __v, password, ...formatedBlog } = blog.toObject();
        return resolve(formatedBlog);
      });
  });
};

/**
 * Deletes a Blog based on its ID
 *
 * @param {any} blogID Blog ID (MongoID format) to be deleted
 * @returns {Promise<{}>} Promise Object to be called by the controller
 */
blogSchema.statics.deleteByID = function (blogID: string) {
  return new Promise((resolve, reject) => {
    this.findOneAndRemove(blogID, (err: any, blog: IBlogDocument) => {
      if (err) return reject(Boom.internal(getStatusText(INTERNAL_SERVER_ERROR)));
      if (!blog) return reject(Boom.notFound(RESSOURCE_NOT_FOUND));

      const { __v, password, ...formatedBlog } = blog.toObject();
      return resolve(formatedBlog);
    });
  });
};

const blogModel: IBlogModel = model<IBlog, IBlogModel>('Blog', blogSchema);
export default blogModel;
