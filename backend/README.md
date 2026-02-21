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

## Default Demo Users

On first startup (and every scheduled reset), the server automatically seeds demo users from `src/utils/seedUsers.ts`. By default:

- Manager:
  - Username: `manager`
  - Email: `manager@example.com`
  - Password: `Manager123!`
- Users:
  - Username: `user`, Email: `user@example.com`, Password: `User123!`
  - Username: `dahl`, Email: `dahl@example.com`, Password: `User123!`
  - Username: `eich`, Email: `eich@example.com`, Password: `User123!`

You can adjust or extend this list directly in `seedUsers.ts`.

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
