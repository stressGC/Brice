'use strict';

import { Router } from 'express';
import * as authController from '../controllers/auth';
import * as validators from '../validators/helper';
import { AUTH } from '../utils/constants';
import { credentialsMatches } from '../middlewares/auth';

const authRouter = Router();

/* SUBROUTER */
authRouter.post('/login', validators.get(AUTH.LOGIN), credentialsMatches, authController.login);

export default authRouter;
