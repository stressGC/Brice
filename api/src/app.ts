'use strict';
// tslint:disable: import-name

/* all imports */
import * as express from 'express';
import routes from './routes';
import * as morgan from './utils/logger/morgan';
import * as helmet from 'helmet';
import * as path from 'path';
import cors from './middlewares/cors';
import mongo from './utils/mongo';
import genericErrorHandler from './middlewares/genericErrorHandler';
import notFoundErrorHandler from './middlewares/notFoundErrorHandler';
require('dotenv').config();

/* instanciate app */
const app = express();

/* set options */
app.set('port', process.env.PORT || 3000);
app.set('env', process.env.NODE_ENV || 'dev');

/* set loggers */
if (app.get('env') !== 'test') {
  app.use(morgan.errorLogging);
  app.use(morgan.successLogging);
}

/* initialise MongoDB connection */
mongo.init();

/* initialize middlewares */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors);

/* initialise static files serving */
app.use('/admin/', express.static(path.join(__dirname, '../backoffice')));
app.get('/admin/*', (req, res) => {
  res.sendFile(path.join(__dirname, '/../backoffice/index.html'));
});
app.use('/food/', express.static(path.join(__dirname, '../food-detection')));
app.get('/food/*', (req, res) => {
  res.sendFile(path.join(__dirname, '/../food-detection/index.html'));
});

/* initialise API routes */
app.use('/api', routes);

/* error middlewares */
app.use(genericErrorHandler);
app.use(notFoundErrorHandler); // must be the last one !

export default app;
