# Darshan Transport Backend

Backend API for Darshan Transport's delivery tracking system (MERN + TypeScript)

## Features
- Check delivery status by series and invoice number
- Get list of available series
- SQL database integration (read-only)

## API Endpoints

### `GET /api/delivery/series`
Returns all available series from the database

### `GET /api/delivery/status/:series/:invoiceNumber`
Checks delivery status for a specific invoice

## Setup

1. Install dependencies:
```bash
npm install

