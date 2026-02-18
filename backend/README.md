# Opti Manage Backend

Backend API for the Opti Manage application, built with Express, TypeScript, and MongoDB (Mongoose).

## Tech Stack

- Node.js
- Express 5
- TypeScript
- MongoDB with Mongoose
- Zod for validation
- JSON Web Tokens (JWT) for authentication
- Bcrypt for password hashing

## Prerequisites

- Node.js (LTS recommended)
- npm or yarn
- MongoDB instance (local or hosted, e.g. MongoDB Atlas)

## Getting Started

Clone the repository and install dependencies:

```bash
cd backend
npm install
```

## Environment Variables

Use the provided `.env.example` as a reference and create a `.env` file in the `backend` folder:

```bash
cp .env.example .env
```

Then fill in the values:

- `NODE_ENV` – `DEVELOPMENT` or `PRODUCTION`
- `PORT` – API port (e.g. `3001`)
- `DATABASE_URL` – MongoDB connection string
- `BCRYPT_SALT_ROUNDS` – salt rounds for bcrypt (e.g. `10`)
- `JWT_ACCESS_SECRET` – secret used to sign access tokens
- `JWT_ACCESS_EXPIRES_IN` – access token expiry (e.g. `1h`)
- (Optional) `SEED_MANAGER_USERNAME`, `SEED_MANAGER_EMAIL`, `SEED_MANAGER_PASSWORD` – overrides for the initial manager user

## Running the App

### Development

Runs the server with `ts-node-dev` and auto-reload:

```bash
npm run dev
```

The API will be available at:

```text
http://localhost:<PORT>
```

### Production Build

Compile TypeScript and start the compiled server:

```bash
npm run build
npm start
```

## Initial Manager User

On first startup, the server automatically seeds a manager user if no users exist. Defaults:

- Username: `Manager`
- Email: `manager@example.com`
- Password: `Manager@2026`

You can override these with the `SEED_MANAGER_*` environment variables described above.

## Linting and Formatting

To run ESLint:

```bash
npm run lint
```

To fix lint issues and apply Prettier formatting:

```bash
npm run lint:fix
npm run prettier
```
