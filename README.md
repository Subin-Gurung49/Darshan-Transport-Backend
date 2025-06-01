# Darshan Transport Backend

Backend API for Darshan Transport's delivery tracking system, built with Node.js, Express, TypeScript, and MSSQL. This project has been prepared for deployment with a focus on security, logging, and configuration.

## Key Features Implemented

*   **Security Enhancements:**
    *   `Helmet` for securing HTTP headers.
    *   Configurable Cross-Origin Resource Sharing (CORS) for production and development environments.
    *   Rate limiting on API routes to prevent abuse.
    *   Input validation middleware for API request parameters.
    *   Database connection configured for production security (e.g., `encrypt: true`).
*   **Production-Grade Logging:**
    *   Structured logging using `Winston`.
    *   Configurable log levels via environment variables.
    *   Log rotation for file transports (`logs/app.log`, `logs/error.log`).
    *   Sensitive data masking in log outputs.
    *   HTTP request logging via `morgan` integrated with Winston.
*   **Configuration Management:**
    *   All critical configurations (database credentials, ports, API keys, log settings) managed via environment variables.
    *   An `.env.example` file is provided as a template.
*   **Standardized Build Process:**
    *   TypeScript compilation to JavaScript using `npm run build`.
*   **Health Check Endpoint:**
    *   `GET /health` endpoint for monitoring application status.
*   **Path Management:**
    *   Uses standard relative paths for module imports (previously used `module-alias` has been removed).

## API Endpoints

All API endpoints are prefixed with `/api/v1`.

*   **`GET /health`**
    *   Returns the health status of the application.
    *   Example: `{"status":"UP","timestamp":"2023-10-27T10:00:00.000Z"}`

*   **`GET /api/v1/delivery/series`**
    *   Returns a list of all available delivery series from the database.

*   **`GET /api/v1/delivery/status/:series/:invoiceNumber`**
    *   Checks the delivery status for a specific invoice.
    *   Path Parameters:
        *   `series`: The delivery series code.
        *   `invoiceNumber`: The invoice number.

## Setup and Running the Application

### Prerequisites
*   Node.js (v18.x or later recommended)
*   npm (comes with Node.js)
*   Access to an MSSQL Server instance

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Darshan-Transport-Backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory by copying `.env.example`. Update it with your specific configurations:
```env
# Server Configuration
PORT=3000 # Or your desired port
NODE_ENV=development # or 'production'

# Database Credentials (MSSQL)
DB_SERVER=your_db_server_address
DB_PORT=1433 # Or your MSSQL port
DB_NAME=your_database_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password

# Logging Configuration
LOG_LEVEL=debug # e.g., error, warn, info, http, debug
LOG_TO_FILE=true # 'true' to enable file logging, 'false' to disable

# CORS Configuration (for production)
# Comma-separated list of allowed origins for production
# PROD_ALLOWED_ORIGINS=https://your-frontend-domain.com,https://another-frontend.com
```

### 4. Build the Application (Required for Production and if not using `npm run dev`)
```bash
npm run build
```
This compiles TypeScript files from `src/` to JavaScript in `dist/`.

### 5. Run the Application

*   **Development Mode (with auto-reloading):**
    ```bash
    npm run dev
    ```
    This uses `nodemon` and `ts-node` to run the TypeScript source directly.

*   **Production Mode (after building):**
    ```bash
    npm start
    ```
    This runs the compiled JavaScript from the `dist/` folder.

## Frontend Demo

A simple HTML, CSS, and JavaScript frontend demo is available in the `frontend-demo/` directory.
To use it:
1.  Ensure the backend server is running.
2.  Open `frontend-demo/index.html` in your web browser.
3.  The demo will make requests to the locally running backend (ensure CORS settings in `src/app.ts` allow `http://127.0.0.1:5500` or your local server's origin if you serve it via a local HTTP server). The `script.js` within the demo is configured to hit `/api/v1` endpoints.

## Logging

*   Logs are output to the console.
*   If `LOG_TO_FILE=true` in your `.env`, logs are also saved to:
    *   `logs/app.log` (all logs based on `LOG_LEVEL`)
    *   `logs/error.log` (only error logs)

## Available Scripts

*   `npm run build`: Compiles TypeScript to JavaScript.
*   `npm start`: Starts the production server from the `dist` folder.
*   `npm run dev`: Starts the development server with `nodemon` and `ts-node`.
*   `npm run clean`: (Windows) Removes the `dist` directory.
*   `npm test`: Placeholder for tests.

## Deployment Notes

When deploying to a production server:

*   **Process Manager:** Use a process manager like PM2 to keep the application running reliably. The `npm start` script is suitable for this.
*   **Environment Variables:** Ensure all necessary environment variables (especially `NODE_ENV=production`, database credentials, `PROD_ALLOWED_ORIGINS`) are securely configured on the server.
*   **Build:** Run `npm run build` on the server or upload the `dist` folder as part of your deployment package.
*   **Database Connectivity:** Ensure the server can connect to your MSSQL database (check firewalls, VPNs, IP whitelisting as per your database setup).
