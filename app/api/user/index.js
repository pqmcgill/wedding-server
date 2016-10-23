import { Router } from 'express';
import passport from 'passport';
import authenticate from '../../middleware/authenticate';
import requiresAdmin from '../../middleware/requiresAdmin';
import ctrl from './controller';

export default () => {
	const userApi = Router();

	userApi.post('/', authenticate, requiresAdmin, ctrl.createUser);
	userApi.get( '/', authenticate, requiresAdmin, ctrl.getAllUsers);
	userApi.post('/authenticate', ctrl.authenticateUser);

	return userApi;
};

