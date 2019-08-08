'use strict';
// tslint:disable max-line-length

import { Router } from 'express';
import * as userController from '../controllers/users';
import * as validators from '../validators/helper';
import { USER } from '../utils/constants';
import * as auth from '../middlewares/auth';

const userRouter = Router();

/* SUBROUTER */
userRouter.get('/', userController.getAll);
userRouter.get('/:userID', auth.isAuth, validators.get(USER.IS_ID_CORRECT), userController.getByID);
userRouter.post('/create', auth.isAuth, validators.get(USER.VALIDATION), userController.create);
userRouter.put('/:userID', auth.isAuth, validators.get(USER.MODIFICATION), userController.modifyByID);
userRouter.delete('/:userID', auth.isAuth, validators.get(USER.IS_ID_CORRECT), userController.deleteByID);

export default userRouter;
