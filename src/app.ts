import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import router from './routes';
import routes from './routes/index';

const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', router);
app.use('/', routes);

export default app;