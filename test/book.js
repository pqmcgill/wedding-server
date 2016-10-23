import { request } from 'chai';
import mongoose from 'mongoose';
import Book from '../app/models/book';

import server from '../app/server';

describe('Books', () => {
	beforeEach((done) => {
		Book.remove({}, done);
	});

	it('should GET all the books', (done) => {
		request(server)
			.get('/api/book')
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a('array');
				res.body.length.should.be.eql(0);
				done();
			});
	});
});
