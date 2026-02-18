# Opti Manage Frontend

Frontend for the Opti Manage application, built with React, TypeScript, Vite, Ant Design, and Redux Toolkit.

## Tech Stack

- React
- TypeScript
- Vite
- Ant Design (UI library)
- Redux Toolkit & React Redux
- React Router

## Prerequisites

- Node.js (LTS recommended)
- npm or yarn

## Getting Started

From the project root:

```bash
cd frontend
npm install
```

## Available Scripts

### Development

Start the development server with hot reloading:

```bash
npm run dev
```

The app will be available at the URL printed in the terminal (by default something like `http://localhost:5173`).

### Production Build

Build the production bundle:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

### Linting and Formatting

Run ESLint:

```bash
npm run lint
```

Format the codebase with Prettier:

```bash
npm run format
```

Check formatting without writing changes:

```bash
npm run format:check
```

## Environment Variables

This project uses Vite, so frontend environment variables must be prefixed with `VITE_` (for example `VITE_API_BASE_URL`). Create a `.env` file in the `frontend` folder and define your variables as needed, then restart the dev server.
