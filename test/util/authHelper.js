import { request } from 'chai';

export default (server, payload, done) => {
	request(server)
		.post('/api/user/authenticate')
		.send(payload)
		.end((err, res) => {
			if (err) return done(err);
			done(null, res.body.user);
		});
}
