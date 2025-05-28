import winston from 'winston';
import path from 'path';
import dotenv from 'dotenv';

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

const transports = [];

// Console transport
transports.push(
  new winston.transports.Console({
    level: logLevel,
    format: winston.format.combine(
      winston.format.colorize({ all: true }),
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.printf(
        (info) => `[${info.timestamp}] ${info.level}: ${info.message} ${info.meta ? JSON.stringify(info.meta) : ''}`
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
        winston.format.timestamp(),
        winston.format.json()
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
        winston.format.timestamp(),
        winston.format.json()
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
    winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'label'] })
  ),
  transports: transports,
  exitOnError: false, // Do not exit on handled exceptions
});

export default Logger;
