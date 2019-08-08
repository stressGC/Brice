'use strict';

import app from '../../src/app';
import { expect } from 'chai';
import * as request from 'supertest';
import * as HTTPStatus from 'http-status-codes';
import * as lang from '../../src/utils/lang';

describe('Blog API is working', () => {
  let blogID: number;
  let title: string;
  let keywords: string;
  let content: string;
  let createdAt: number;
  let blog = {};
  let token: string;

  before((done) => {
    const authUser = {
      email: process.env.TEST_USER,
      password: process.env.TEST_USER_PASSWORD,
    };

    request(app)
      .post('/api/auth/login')
      .send(authUser)
      .end((err, res) => {
        token = res.body.token;
        done();
      });
  });

  before(() => {
    title = 'My awesome title';
    keywords = 'SVGZoomEvent, blog, keywords';
    content = '<h1>some content</h1><h1>some content</h1>';
    blog = { title, keywords, content };
  });

  /**
   * BLOG CREATION
   **/

  it('should create new blog post', (done) => {
    request(app)
      .post('/api/blogs/create')
      .set('Authorization', `Bearer ${token}`)
      .send(blog)
      .end((err, res) => {
        expect(err).to.equal(null);
        expect(res.status).to.equal(HTTPStatus.OK);
        const { body } = res;
        expect(body).to.have.all.keys(
          '_id',
          'createdAt',
          'updatedAt',
          'title',
          'keywords',
          'content',
        );
        expect(body).not.to.have.any.keys(
          '__v',
        );
        expect(body.title).to.equal(title);
        expect(body.content).to.equal(content);
        expect(body.keywords).to.equal(keywords);
        done();
        blogID = body._id;
        createdAt = body.createdAt;
      });
  });

  it('should fail when passing incomplete body', (done) => {
    request(app)
      .post('/api/blogs/create')
      .send({ title: 'correctTitle', wrongKey: 'somevalue' })
      .end((err, res) => {
        expect(err).to.equal(null);
        expect(res.status).to.equal(HTTPStatus.BAD_REQUEST);
        const { body } = res;
        expect(body).to.have.property('error');
        expect(body.error.code).to.equal(HTTPStatus.BAD_REQUEST);
        expect(body.error.data[0].msg).to.equal(lang.fieldMissing('keywords'));
        done();
      });
  });

  /**
   * BLOG GET
   **/

  it('should return recently created blog info', (done) => {
    request(app)
      .get(`/api/blogs/${blogID}`)
      .end((err, res) => {
        expect(err).to.equal(null);
        expect(res.status).to.equal(HTTPStatus.OK);
        const { body } = res;
        expect(body).to.be.an('object');
        expect(body).to.have.all.keys(
          '_id',
          'updatedAt',
          'keywords',
          'content',
          'createdAt',
          'title',
        );
        expect(body).not.to.have.any.keys(
          '__v',
        );
        expect(body.title).to.equal(title);
        expect(body.content).to.equal(content);
        done();
      });
  });

  it('should fail when blog not found', (done) => {
    const randomValidMongoID = '5cd8e8437bcac443f85d358a';
    request(app)
      .get(`/api/blogs/${randomValidMongoID}`)
      .end((err, res) => {
        expect(err).to.equal(null);
        expect(res.status).to.equal(HTTPStatus.NOT_FOUND);
        const { body } = res;
        expect(body).to.have.property('error');
        expect(body.error.code).to.equal(HTTPStatus.NOT_FOUND);
        expect(body.error.message).to.equal(lang.RESSOURCE_NOT_FOUND);
        done();
      });
  });

  it('should fail when invalid MongoID is provided', (done) => {
    const randomInvalidMongoID = '5cd8e8437bcac443';
    request(app)
      .get(`/api/blogs/${randomInvalidMongoID}`)
      .end((err, res) => {
        expect(err).to.equal(null);
        expect(res.status).to.equal(HTTPStatus.BAD_REQUEST);
        const { body } = res;
        expect(body).to.have.property('error');
        expect(body.error.code).to.equal(HTTPStatus.BAD_REQUEST);
        expect(body.error.message).to.equal(HTTPStatus.getStatusText(HTTPStatus.BAD_REQUEST));
        done();
      });
  });

  it('should return blog list', (done) => {
    request(app)
      .get('/api/blogs')
      .end((err, res) => {
        expect(err).to.equal(null);
        expect(res.status).to.equal(HTTPStatus.OK);
        const { body } = res;
        expect(body).to.be.an('array');
        expect(body[0]).to.have.all.keys(
          '_id',
          'updatedAt',
          'keywords',
          'content',
          'createdAt',
          'title',
        );
        expect(body[0]).not.to.have.any.keys(
          '__v',
        );
        done();
      });
  });

  /**
    * BLOG MODIFICATION
    **/

  it('should update blog', (done) => {
    const newTitle = 'someNewTitle';
    request(app)
      .put(`/api/blogs/${blogID}`)
      .send({ title: newTitle })
      .end((err, res) => {
        expect(err).to.equal(null);
        const { status, body } = res;
        expect(status).to.equal(HTTPStatus.OK);
        expect(body).to.have.all.keys(
          '_id',
          'updatedAt',
          'keywords',
          'content',
          'createdAt',
          'title',
        );
        expect(body).not.to.have.any.keys(
          '__v',
        );
        expect(body._id).to.equal(blogID);
        expect(body.title).to.equal(newTitle);
        expect(body.updatedAt).to.be.above(createdAt - 1); // tests cant take less than one sec
        done();
      });
  });

  it('should fail when passing empty body', (done) => {
    request(app)
      .put(`/api/blogs/${blogID}`)
      .send({ wrongKey: 'w/e value' })
      .end((err, res) => {
        expect(err).to.equal(null);
        const { body, status } = res;
        expect(status).to.equal(HTTPStatus.BAD_REQUEST);
        expect(body).to.have.property('error');
        expect(body.error.code).to.equal(HTTPStatus.BAD_REQUEST);
        expect(body.error.data[0].msg).to.equal(lang.EMPTY_BODY);
        done();
      });
  });

  /**
    * USER DELETION
    **/
  it('should delete blog post', (done) => {
    request(app)
      .delete(`/api/blogs/${blogID}`)
      .end((err, res) => {
        /* deletion returns correct informations */
        expect(err).to.equal(null);
        const { status, body } = res;
        expect(status).to.equal(HTTPStatus.OK);
        expect(body._id).to.be.equal(blogID);
        expect(body).to.have.all.keys(
          '_id',
          'updatedAt',
          'keywords',
          'content',
          'createdAt',
          'title',
        );
        expect(body).not.to.have.any.keys(
          '__v',
        );
        /* and the blog has been successfully deleted */
        request(app)
          .get(`/api/blogs/${blogID}`)
          .end((err, res) => {
            expect(err).to.equal(null);
            const { status, body } = res;
            expect(status).to.equal(HTTPStatus.NOT_FOUND);
            expect(body).to.have.property('error');
            expect(body.error.code).to.equal(HTTPStatus.NOT_FOUND);
            expect(body.error.message).to.equal(lang.RESSOURCE_NOT_FOUND);
            done();
          });
      });
  });
});
