# Darshan Transport Backend

Backend API for Darshan Transport's delivery tracking system (MERN + TypeScript)

## Features
- Redis caching for improved performance
- Rate limiting to prevent server overload
- Check delivery status by series and invoice number
- Get list of available series
- SQL database integration (read-only)

## API Endpoints

### `GET /api/delivery/series`
Returns all available series from the database.

### `GET /api/delivery/status/:series/:invoiceNumber`
Checks delivery status for a specific invoice.

### `GET /api/delivery-status`
Fetches delivery information based on query parameters `series` and `invoiceNumber`.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
Create a `.env` file in the root directory with the following variables:
```
DB_USER=<your-database-username>
DB_PASSWORD=<your-database-password>
DB_SERVER=<your-database-server>
DB_NAME=<your-database-name>
DB_PORT=<your-database-port>
PORT=<application-port>
```

3. Start the development server:
```bash
npm run dev
```

4. Build and start the production server:
```bash
npm run build
npm start
```

## Additional Features

### Redis Caching
- Caches search results for 1 hour to reduce database load.

### Rate Limiting
- Limits requests to prevent server overload (10 requests per minute per IP).
