import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import passport from 'passport';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import config from 'config';

import loadStrategy from './middleware/passport';
import api from './api';

const PORT = process.env.PORT || config.port;

/////////////////////
// Configure Database
const opts = {
	server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 }},
	replset: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 }}
};

mongoose.connect(config.DBHost, opts);
const { connection } = mongoose;

connection.on('error', console.error.bind(console, 'connection error:'));

////////////////////
// Configure Express
const app = express();

app.use(cors());
if (config.util.getEnv('NODE_ENV') !== 'test') {
	app.use(morgan('combined'));
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/json' }));
app.use(passport.initialize());

loadStrategy(passport);

app.get('/', (req, res) => {
	res.json({ message: 'Welcome to our Bookstore!' });
});

app.use('/api', api());

app.server = app.listen(PORT);
console.log('Listening on port ', + PORT);

export default app;
