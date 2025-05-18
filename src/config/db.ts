import sql from 'mssql';
import dotenv from 'dotenv';
import { AppError, ErrorTypes } from '@middleware/errorHandler.middleware';

dotenv.config();

// Helper function to ensure required env vars exist
const getRequiredEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new AppError(
      `Missing required environment variable: ${key}`,
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
    encrypt: false,
    trustServerCertificate: true,
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

export const connectToDatabase = async () => {
  try {
    await sql.connect(dbConfig);
    console.log('Connected to SQL Server');
  } catch (err) {
    throw new AppError(
      'Database connection failed',
      503,
      ErrorTypes.CONNECTION_ERROR,
      err
    );
  }
};

export { sql };