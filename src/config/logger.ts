import winston from 'winston';
import path from 'path';
import dotenv from 'dotenv';
import { sanitizeObject, sanitizeMessageAndMeta } from '../utils/sanitizeLog'; // Adjusted path

dotenv.config();

const logDir = 'logs'; // Directory to store log files

// Define log levels and colors
const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const logColors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

winston.addColors(logColors);

// Determine log level from environment variable or default to 'info'
const logLevel = process.env.LOG_LEVEL || 'info';
const logToFile = process.env.LOG_TO_FILE === 'true';

// Custom formatter to sanitize logs
const sanitizeFormat = winston.format((info) => {
  // Ensure message is a string and meta is an object before sanitizing
  const message = typeof info.message === 'string' ? info.message : String(info.message);
  const meta = typeof info.meta === 'object' && info.meta !== null ? info.meta : {};
  const sanitized = sanitizeMessageAndMeta(message, meta);
  return { ...info, message: sanitized.message, meta: sanitized.meta };
});

const transports = [];

// Console transport
transports.push(
  new winston.transports.Console({
    level: logLevel,
    format: winston.format.combine(
      sanitizeFormat(), // Add sanitizer
      winston.format.colorize({ all: true }),
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.printf(
        (info) => {
          // Ensure message is a string and meta is an object before sanitizing
          const message = typeof info.message === 'string' ? info.message : String(info.message);
          const metaData = info.meta ? info.meta : (info as any).metadata;
          const meta = typeof metaData === 'object' && metaData !== null ? metaData : {};
          const sanitized = sanitizeMessageAndMeta(message, meta);
          return `[${info.timestamp}] ${info.level}: ${sanitized.message} ${sanitized.meta && Object.keys(sanitized.meta).length > 0 ? JSON.stringify(sanitized.meta) : ''}`;
        }
      )
    ),
  })
);

if (logToFile) {
  // File transport for all logs
  transports.push(
    new winston.transports.File({
      level: logLevel,
      filename: path.join(logDir, 'app.log'),
      format: winston.format.combine(
        sanitizeFormat(), // Add sanitizer
        winston.format.timestamp(),
        winston.format.json() // This will automatically stringify the sanitized info object
      ),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  );

  // File transport for error logs
  transports.push(
    new winston.transports.File({
      level: 'error',
      filename: path.join(logDir, 'error.log'),
      format: winston.format.combine(
        sanitizeFormat(), // Add sanitizer
        winston.format.timestamp(),
        winston.format.json() // This will automatically stringify the sanitized info object
      ),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  );
}

const Logger = winston.createLogger({
  levels: logLevels,
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'label'] }),
    // sanitizeFormat() // Apply sanitizer at logger level if desired, or keep at transport level
  ),
  transports: transports,
  exitOnError: false, // Do not exit on handled exceptions
});

export default Logger;
