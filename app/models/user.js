import { genSalt, hash, compare } from 'bcrypt';
import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
	name: {
		type: String,
		unique: true,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	access: {
		type: String,
		required: true
	}
});

UserSchema.pre('save', function(next) {
	if (this.isModified('password') || this.isNew) {
		genSalt(10, (err, salt) => {
			if (err) return next(err);

			hash(this.password, salt, (err, hash) => {
				if (err) return next(err);
				this.password = hash;
				return next();
			});
		});
	} else {
		return next();
	}
});

UserSchema.methods.comparePassword = function (passw, cb) {
	compare(passw, this.password, (err, isMatch) => {
		if (err) return cb(err);
		cb(null, isMatch);
	});
};

export default mongoose.model('user', UserSchema);
