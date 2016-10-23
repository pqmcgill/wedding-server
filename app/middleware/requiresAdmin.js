export default (req, res, next) => {
	if (req.user && req.user.access === 'admin') {
		next();
	} else {
		res.status(401);
		res.json({ success: false, msg: 'Unauthorized' });
	}
};
