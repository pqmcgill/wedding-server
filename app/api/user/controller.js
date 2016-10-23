import config from 'config';
import { encode, decode } from 'jwt-simple';
import User from '../../models/user';

const createUser = (req, res) => {
	if (!req.body.name || !req.body.password || !req.body.access) {
		res.status(409);
		return res.json({ success: false, msg: 'Please pass name, password and access' });
	} 

	const newUser = new User({
		name:     req.body.name,
		password: req.body.password,
		access:     req.body.access
	});

	newUser.save(err => {
		if (err) {
			res.status(409);
			return res.json({ success: false, msg: 'Username already exists' });
		}

		res.status(201);
		return res.json({ success: true, msg: 'Successfully created new user' });
	});
};

const getAllUsers = (req, res) => {
	User.find({}, (err, users) => {
		if (err) {
			return res.sendStatus(500);
		}

		res.status(200);
		return res.json({ users });
	});
};

const authenticateUser = (req, res) => {
	User.findOne({
		name: req.body.name
	}, (err, user) => {
		if (err) throw err;

		if (!user) {
			res.status(401);
			return res.send({ success: false, msg: 'Authentication failed. User not found.' });
		}

		user.comparePassword(req.body.password, (err, isMatch) => {
			if (isMatch && !err) {
				const token = encode(user, config.secret);
				res.status(200);
				res.json({ 
					success: true, 
					user: { 
						name: user.name,
						access: user.access,
						token: `JWT ${token}` 
					}
				});
			} else {
				res.status(401);
				res.send({success: false, msg: 'Authentication failed. Wrong password.' });
			}
		});
	});
};

export default {
	createUser,
	getAllUsers,
	authenticateUser
};
