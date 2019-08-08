'use strict';
// tslint:disable max-line-length

import { Router } from 'express';
import * as blogController from '../controllers/blogs';
import * as validators from '../validators/helper';
import { BLOG } from '../utils/constants';
import * as auth from '../middlewares/auth';

const blogRouter = Router();

/* SUBROUTER */
blogRouter.get('/', blogController.getAll);
blogRouter.get('/:blogID', validators.get(BLOG.IS_ID_CORRECT), blogController.getByID);
blogRouter.post('/create', auth.isAuth, validators.get(BLOG.VALIDATION), blogController.create);
blogRouter.put('/:blogID', auth.isAuth, validators.get(BLOG.MODIFICATION), blogController.modifyByID);
blogRouter.delete('/:blogID', auth.isAuth, validators.get(BLOG.IS_ID_CORRECT), blogController.deleteByID);

export default blogRouter;
