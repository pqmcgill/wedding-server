import { Router } from 'express';
import guestApi from './guest';

export default () => {
	let api = Router();

	api.use('/user', guestApi());

	return api;
}
