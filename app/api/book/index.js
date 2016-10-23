import { Router } from 'express';
import ctrl from './controller';

export default () => {
	let bookApi = Router();

	bookApi
		.get('/', ctrl.getBooks)
		.post('/', ctrl.postBook)
		.get('/:id', ctrl.getBook)
		.delete('/:id', ctrl.deleteBook)
		.put('/:id', ctrl.updateBook);

	return bookApi;
};
