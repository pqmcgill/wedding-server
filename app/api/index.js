import { Router } from 'express';
import bookApi from './book';
import userApi from './user';

export default () => {
	let api = Router();

	api.use('/book', bookApi());
	api.use('/user', userApi());

	return api;
}
