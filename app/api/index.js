import { Router } from 'express';
import bookApi from './book';
import guestApi from './guest';

export default () => {
	let api = Router();

	api.use('/book', bookApi());
	api.use('/user', guestApi());

	return api;
}
