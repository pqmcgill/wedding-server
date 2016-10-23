import { request, expect } from 'chai';
import config from 'config';
import { decode } from 'jwt-simple';
import mongoose from 'mongoose';
import User from '../app/models/user';
import authenticate from './util/authHelper';

import server from '../app/server';

let adminToken, guestToken;

describe('/users', () => {
		beforeEach(done => {
			User.remove({}, (err) => {
				if (err) return done(err);
				const adminUser = new User({ access: 'admin', name: 'adminUser', password: 'adminPassword' });
				const guestUser = new User({ access: 'guest', name: 'guestUser', password: 'guestPassword' });
				adminUser.save().then(() => {
					return guestUser.save().then(() => done());
				}).catch((err) => {
					done(err);
				});
			});
		});

	describe('POST \'/authenticate\'', () => {
		it('should send a JWT upon successfull authentication', done => {
			request(server)
				.post('/api/user/authenticate')
				.send({ name: 'adminUser', password: 'adminPassword' })
				.end((err, res) => {
					if (err) return done(err);
					expect(res.body.success).to.be.true;
					expect(res.body.user.token).to.not.be.undefined;
					done();
				});
		});

		it('should return success:false for invalid username', done => {
			request(server)
				.post('/api/user/authenticate')
				.send({ name: 'testuser', password: 'adminPassword' })
				.end((err, res) => {
					expect(err).to.not.be.null;
					expect(res).to.have.status(401);
					expect(res.body.success).to.be.false;
					expect(res.body.user).to.be.undefined;
					done();
				});
		});

		it('should return success:false for invalid password', done => {
			request(server)
				.post('/api/user/authenticate')
				.send({ name: 'adminUser', password: 'testpassword' })
				.end((err, res) => {
					expect(err).to.not.be.null;
					expect(res).to.have.status(401);
					expect(res.body.success).to.be.false;
					expect(res.body.user).to.be.undefined;
					done();
				});
		});
	});
	// Post '/authenticate'
	
	describe('POST \'/\'', () => {
		it('should return Unauthorized error if token is not used', done => {
			request(server)
				.post('/api/user')
				.send({ name: 'newUser', password: 'newPassword', access: 'guest' })
				.end((err, res) => {
					expect(err).to.not.be.null;
					expect(res).to.have.status(401);
					expect(res.body.success).to.be.false;
					done();
				});
		});

		it('should restrict access to admins only', done => {
			authenticate(server, { name: 'guestUser', password: 'guestPassword' }, (err, user) => {
				if (err) return done(err);

				request(server)
					.post('/api/user')
					.set('Authorization', user.token)
					.send({ name: 'newUser', password: 'newPassword', access: 'guest' })
					.end((_err, _res) => {
						expect(_res).to.have.status(401);
						done();
					});
			});
		});

		it('should successfully create a user', done => {
			authenticate(server, { name: 'adminUser', password: 'adminPassword' }, (err, user) => {
				if (err) return done(err);
				request(server)
					.post('/api/user')
					.set('Authorization', user.token)
					.send({ name: 'foo', password: 'NewPassword', access: 'guest' })
					.end((err, res) => {
						if (err) return done(err);
						expect(res).to.have.status(201);
						const success = res.body.success;
						expect(success).to.be.true;
						done();
					});
			});
		});

		it('should fail if missing name', done => {
			authenticate(server, { name: 'adminUser', password: 'adminPassword' }, (err, user) => {
				if (err) return done(err);
				request(server)
					.post('/api/user')
					.set('Authorization', user.token)
					.send({ password: 'adminPassword' })
					.end((err, res) => {
						expect(err).to.not.be.null;
						expect(res).to.have.status(409);
						const { success, msg } = res.body;
						expect(success).to.be.false;
						done();
					});
			});
		});

		it('should fail if missing password', done => {
			authenticate(server, { name: 'adminUser', password: 'adminPassword' }, (err, user) => {
				if (err) return done(err);
				request(server)
					.post('/api/user')
					.set('Authorization', user.token)
					.send({ name: 'testName' })
					.end((err, res) => {
						expect(err).to.not.be.null;
						expect(res).to.have.status(409);
						const { success, msg } = res.body;
						expect(success).to.be.false;
						done();
				});
			});
		});

		it('shouldn\'t allow creation of duplicate users', done => {
			authenticate(server, { name: 'adminUser', password: 'adminPassword' }, (err, user) => {
				if (err) return done(err);
				request(server)
					.post('/api/user')
					.set('Authorization', user.token)
					.send({ name: 'guestUser', password: 'guestPassword' })
					.end((err, res) => {
						expect(err).to.not.be.null;
						expect(res).to.have.status(409);
						done();
					});
			});
		});
	});
		// end POST /

	describe('GET \'/\'', () => {
		beforeEach(done => {
			request(server)
				.post('/api/user/authenticate')
				.send({ name: 'adminUser', password: 'adminPassword' })
				.end((err, res) => {
					if (err) return done(err);
					adminToken = res.body.user.token;
					done();
				});
		});

		it('should return array of users', done => {
			authenticate(server, { name: 'adminUser', password: 'adminPassword' }, (err, user) => {
				if (err) return done(err);
				request(server)
					.get('/api/user')
					.set('Authorization', user.token)
					.end((err, res) => {
						if (err) return done(err);
						const { users } = res.body;
						expect(users.length).to.be.greaterThan(0);
						expect(users[0].name).to.equal('adminUser');
						done();
					});
			});
		});
	});
	// end GET '/'	

});
