# Opti Manage – Eye Glasses Management System

Opti Manage is a full‑stack web application for managing an optical store. It helps managers and staff track inventory, record sales, manage user access, and monitor activity across the business in a single, user‑friendly dashboard.

The project consists of:

- **Backend:** Node.js, Express, TypeScript, MongoDB (Mongoose), JWT, Zod
- **Frontend:** React, TypeScript, Vite, Ant Design, Redux Toolkit

---

## Core Features

### Authentication & Roles

- Secure login using username and password.
- Role‑based access control:
  - **Manager:** full access to all modules, including users, activity log, dashboard statistics, and inventory.
  - **User/Staff:** limited access focused on day‑to‑day sales and inventory operations.
- JWT‑based authentication with protected routes on both backend and frontend.
- Automatic seeding of an initial manager account on first backend startup (configurable via environment variables).

### Dashboard & Analytics

- Role‑aware dashboard:
  - **Manager Dashboard:** global metrics such as total revenue, total sales, total products, inventory value, and sales by staff.
  - **Staff View:** personal performance summary including own sales, today’s revenue, and recently added items.
- Visual insights:
  - Revenue trend line chart over recent sales.
  - Pie chart of revenue by staff for managers.
  - Tabular view of recent sales with buyer, product, date, and amount.
  - “My Recently Added Items” list for staff users.

### Eye Glass Inventory Management

- Centralized management of all eye‑glass products.
- Create, update, duplicate and delete eye‑glass records.
- Rich table experience:
  - Column search and text highlighting.
  - Sorting and filtering by multiple attributes (including numeric ranges like price, bridge width, temple length).
  - Pagination for large inventories.
- Bulk operations:
  - Multi‑select rows and delete multiple items at once.
- Ownership handling:
  - Each eye glass has an owner.
  - Managers can reassign ownership to other users.
  - Non‑owners can request access via the ownership request workflow (see below).

### Sales Management

- Create sales directly from the Eye Glasses page using a dedicated Sell modal.
- Validation of available quantity before confirming the sale.
- Capture buyer details, quantity, and sale date.
- Automatic calculation of revenue amounts for dashboards and reports.
- Generation of invoices:
  - Invoice page for completed sales.
  - PDF/printable invoice document for customers.
- Sales history page:
  - Filterable table of past sales.
  - Key information such as buyer name, product, quantity, date, and total amount.

### Ownership Requests & Access Control

- Non‑owners can request access to eye‑glass items owned by others.
- Ownership request lifecycle:
  - Staff submits a request for a specific product.
  - Manager (and/or owner) can review all pending requests.
  - Approve or reject requests with one click from the dashboard.
- Approved requests grant appropriate access so staff can work with the requested items.

### User Management & Profiles

- Manager‑only Users page:
  - View all users with role and contact details.
  - Create new users via a dedicated modal.
  - Delete users (with safeguards to prevent deleting self).
- Profile management:
  - Update personal details such as full name.
  - Managers can also update their own username and email.
  - Change password workflow with validation and feedback.

### Activity Logging & Auditing

- Manager‑only Activity Log page.
- Central audit trail listing:
  - Who performed an action.
  - User role.
  - Action type (LOGIN, CREATE, UPDATE, DELETE).
  - Target entity or details.
  - Timestamp formatted for easy review.
- Useful for security reviews and tracking changes across the system.

### User Experience & UI

- Responsive layout with a collapsible sidebar and top navigation.
- Consistent design system based on Ant Design.
- Landing page explaining the product and providing a clear entry point to login.
- Login page with demo credentials section to quickly access the app.
- Professional styling across dashboard, management pages, and profile/settings.

---

## High‑Level Architecture

- **Backend API**
  - Express 5 with TypeScript.
  - Modular structure: `auth`, `user`, `eyeGlass`, `sales`, `ownershipRequest`, `activityLog`, and `dashboard`.
  - Request validation using Zod.
  - Centralized error handling and consistent API responses.
  - MongoDB database via Mongoose models.
  - Activity logging middleware to capture key actions.
  - Initial manager seeding on startup.

- **Frontend App**
  - React + TypeScript + Vite.
  - State management via Redux Toolkit and RTK Query for API calls.
  - React Router for routing and layout composition.
  - Protected routes for dashboard areas.
  - Ant Design components for forms, tables, cards, modals, and layout.

---

## Getting Started (Clone & Run)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/opti-manage.git
cd opti-manage
```

> Replace `your-username` with the actual GitHub username or organisation, if different.

### 2. Backend Setup

1. Navigate to the backend:

   ```bash
   cd backend
   npm install
   ```

2. Create a `.env` file based on `.env.example` and fill in:
   - MongoDB `DATABASE_URL`
   - `PORT`, `NODE_ENV`
   - `BCRYPT_SALT_ROUNDS`
   - `JWT_ACCESS_SECRET`, `JWT_ACCESS_EXPIRES_IN`
   - Optional `SEED_MANAGER_*` values if you want a custom initial manager.

3. Start the backend in development mode:

   ```bash
   npm run dev
   ```

   The API will run on `http://localhost:<PORT>` (default from `.env`).

### 3. Frontend Setup

1. In a new terminal, navigate to the frontend:

   ```bash
   cd frontend
   npm install
   ```

2. (Optional) Create a `.env` file in `frontend` with Vite‑style variables (for example `VITE_API_BASE_URL` pointing to your backend URL).

3. Start the frontend dev server:

   ```bash
   npm run dev
   ```

4. Open the URL printed by Vite (commonly `http://localhost:5173`) in your browser.

You should now be able to log in using the seeded manager credentials and explore all features described above.

---

## Related Documentation

- Backend details and environment configuration: [backend/README.md](backend/README.md)
- Frontend scripts and environment configuration: [frontend/README.md](frontend/README.md)
