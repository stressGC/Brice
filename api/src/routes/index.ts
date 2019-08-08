'use strict';

import * as express from 'express';
import * as path from 'path';

// tslint:disable: import-name
import usersRouter from '../routes/users';
import blogsRouter from '../routes/blogs';
import authRouter from '../routes/auth';

const router = express.Router();

/* expose public folder */
router.use('/public', express.static(path.join(__dirname, '../../public')));

/* use our subrouters */
router.use('/auth', authRouter);
router.use('/users', usersRouter);
router.use('/blogs', blogsRouter);

export default router;