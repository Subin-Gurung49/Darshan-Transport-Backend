import app from './app';
import { connectToDatabase } from './config/db'; // Use relative path
import Logger from './config/logger'; // Use relative path
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Establish database connection
const startServer = async () => {
  try {
    await connectToDatabase();
    app.listen(PORT, () => {
      Logger.info(`Server running on port ${PORT}`); // Use Logger
      Logger.info(`Access it at http://localhost:${PORT}`);
      if (process.env.NODE_ENV !== 'production') {
        Logger.info('Application is running in development mode.');
      } else {
        Logger.info('Application is running in production mode.');
      }
    });
  } catch (error) {
    Logger.error('Failed to start the server:', { error }); // Pass error object for better logging
    process.exit(1); // Exit the process if the server fails to start
  }
};

startServer();