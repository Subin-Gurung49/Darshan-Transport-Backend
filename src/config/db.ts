import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

// Helper function to ensure required env vars exist
const getRequiredEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
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
      minVersion: 'TLSv1.2' as const // Type assertion for correct type
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
    console.error('Database connection failed:', err);
    throw err;
  }
};

export { sql };