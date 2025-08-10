import sql from 'mssql';
import dotenv from 'dotenv';
import { AppError, ErrorTypes } from '../middleware/errorHandler.middleware'; // Adjusted path
import Logger from './logger'; // Adjusted path

dotenv.config();

// Helper function to ensure required env vars exist
const getRequiredEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    const errorMessage = `Missing required environment variable: ${key}`;
    Logger.error(errorMessage, { missingEnvVar: key });
    throw new AppError(
      errorMessage,
      500,
      ErrorTypes.SERVER_ERROR,
      { missingEnvVar: key }
    );
  }
  return value;
};

const dbConfig: sql.config = {
  user: getRequiredEnv('DB_USER'),
  password: getRequiredEnv('DB_PASSWORD'),
  server: getRequiredEnv('DB_SERVER'),
  database: getRequiredEnv('DB_NAME'),
  port: parseInt(getRequiredEnv('DB_PORT')),
  options: {
    encrypt: process.env.NODE_ENV === 'production', // Set to true in production
    trustServerCertificate: process.env.NODE_ENV !== 'production', // Set to false in production
    cryptoCredentialsDetails: {
      minVersion: 'TLSv1.2' as const
    }
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

export const connectToDatabase = async (): Promise<void> => {
  try {
    Logger.info('Attempting to connect to SQL Server...', { 
      server: dbConfig.server, 
      database: dbConfig.database,
      port: dbConfig.port,
      user: dbConfig.user 
    });
    
    await sql.connect(dbConfig);
    Logger.info('Successfully connected to SQL Server.');
  } catch (err: any) {
    Logger.error('Failed to connect to SQL Server:', { 
      error: err.message,
      code: err.code,
      originalError: err
    });
    throw new AppError(
      'Database connection failed',
      503,
      ErrorTypes.CONNECTION_ERROR,
      err
    );
  }
};

export { sql };