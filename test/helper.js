import chaiHttp from 'chai-http';
import chai from 'chai';
chai.should();
chai.use(chaiHttp);

import mongoose from 'mongoose';
import User from '../app/models/user';
import app from '../app/server';

after(() => {
	app.server.close();
	mongoose.models = {};
	mongoose.modelSchemas = {};
	mongoose.connection.close();
});
