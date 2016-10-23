import config from 'config';
import { Strategy, ExtractJwt } from 'passport-jwt';

import User from '../models/user';

export default passport => {
	const opts = { 
		secretOrKey: config.secret,
	 	jwtFromRequest: ExtractJwt.fromAuthHeader()	
	};
	passport.use(new Strategy(opts, (jwt, done) => {
		User.findOne({ _id: jwt._id }, (err, user) => {
			if (err) return done(err, false);
			if (user) {
				done(null, user);
			} else {
				done(null, false);
			}
		});
	}));
};
