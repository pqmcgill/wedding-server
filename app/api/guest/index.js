import { Router } from 'express';
import passport from 'passport';
import authenticate from '../../middleware/authenticate';
import requiresAdmin from '../../middleware/requiresAdmin';
import ctrl from './controller';

export default () => {
	const userApi = Router();

	userApi.post('/', authenticate, requiresAdmin, ctrl.createGuest);
	userApi.get('/', authenticate, requiresAdmin, ctrl.getAllGuests);
	userApi.delete('/:id', authenticate, requiresAdmin, ctrl.deleteGuest);
	userApi.post('/authenticate', ctrl.authenticateUser);

	return userApi;
};

