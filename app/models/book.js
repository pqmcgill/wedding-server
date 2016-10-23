import mongoose, { Schema } from 'mongoose';

const BookSchema = new Schema({
		title: { type: String, required: true },
		author: { type: String, required: true },
		year: { type: Number, required: true },
		pages: { type: Number, required: true, min: 1 },
		createdAt: { type: Date, default: Date.now }
}, {
	versionKey: false
});

BookSchema.pre('save', next => {
	now = new Date();
	if(!this.createdAt) {
		this.createdAt = now;
	}
	next();
});

export default mongoose.model('book', BookSchema);
