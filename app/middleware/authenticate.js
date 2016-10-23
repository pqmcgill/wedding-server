import passport from 'passport';

export default (req, res, next) => {
	passport.authenticate('jwt', { session: false }, (err, user) => {
		if (err) {
			res.status(500);
			return res.json({ success: false, msg: 'Error' });
		} else if (!user) {
			res.status(401);
			return res.json({ success: false, msg: 'Unauthorized' });
		}
		req.user = user;
		next();
	})(req, res, next);
};
