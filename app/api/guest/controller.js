import mongoose from 'mongoose';
import shortid from 'shortid';
import config from 'config';
import { encode, decode } from 'jwt-simple';
import User from '../../models/user';

const createGuest = (req, res) => {
	if (!req.body.username || !req.body.access) {
		res.status(409);
		return res.json({ success: false, msg: 'Please pass username and access' });
	} 

	const guest = new User({
		username:    req.body.username,
		password:    shortid.generate(),
    access:      req.body.access,
    affiliation: req.body.affiliation
	});

	guest.save((err, user) => {
		if (err) {
			console.log(err);
			res.status(409);
			return res.json({ success: false, msg: 'guest with that username already exists' });
		}
		res.status(201);
		return res.json({ success: true, msg: 'Successfully created new guest', guest });
	});
};

const getAllGuests = (req, res) => {
	User.find({ access: 'guest' }, (err, guests) => {
		if (err) {
			return res.sendStatus(500);
		}
		const formatted = Object.keys(guests)
			.reduce((acc, curr) => { 
				const guest = { [guests[curr]._id]: guests[curr] };
				return { ...acc, ...guest };
			}, {});
		res.status(200);
		return res.json({ guests: formatted });
	});
};

const deleteGuest = ({ params }, res) => {
	User.findOne({ _id: mongoose.Types.ObjectId(params.id) }).then((found) => {
		if (!found) return res.json({ success: false, msg: 'No records found with that id' });
		found.remove().then((record) => {
			res.status(200);
			return res.json({ success: true, msg: 'successfully deleted' });
		});

	}).catch((err) => {
		res.json({ success: false, msg: 'Error: ' + err });
	});
};

const authenticateUser = (req, res) => {
	User.findOne({
		username: req.body.username
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
						username: user.username,
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
	createGuest,
	getAllGuests,
	deleteGuest,
	authenticateUser
};
