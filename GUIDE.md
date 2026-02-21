# Opti Manage – End‑to‑End Manual Test Guide

This guide walks you **step by step from a fresh clone to testing every feature** of the Opti Manage application — covering major, minor, and even the smallest interactions — using the seeded **manager** account and additional test users.

Follow the steps in order to verify that the full application (backend + frontend) works correctly.

---

## 1. Project Setup (Fresh Clone)

> Run these commands from a terminal (PowerShell / bash).

1. **Clone the repository**

   ```bash
   git clone https://github.com/MuzakkirHossainMinhaz/opti-manage.git
   cd opti-manage
   ```

2. **Backend: install dependencies**

   ```bash
   cd backend
   npm install
   ```

3. **Backend: configure environment**
   - Copy the example env file:

     ```bash
     cp .env.example .env
     ```

   - Edit `.env` and set at least:

     ```env
     NODE_ENV=DEVELOPMENT
     PORT=3001
     DATABASE_URL=your_mongodb_connection_string
     BCRYPT_SALT_ROUNDS=10
     JWT_ACCESS_SECRET=some_long_random_secret
     JWT_ACCESS_EXPIRES_IN=1h
     ```

   For a more detailed description of backend configuration and commands, see [backend/README.md](backend/README.md).

4. **Backend: start the API in development mode**

   From the `backend` folder:

   ```bash
   npm run dev
   ```

   - Verify in the terminal:
     - You see a successful MongoDB connection log.
     - You see the server listening on `http://localhost:3001` (or your chosen port).
     - On first startup, the backend seeds an initial **manager** user.

5. **Frontend: install dependencies**

   Open a new terminal, then from the project root:

   ```bash
   cd frontend
   npm install
   ```

6. **Frontend: optional environment**
   - If needed, create `frontend/.env`:

     ```env
     VITE_API_BASE_URL=http://localhost:3001
     ```

   - Restart the frontend dev server after creating or changing `.env`.

7. **Frontend: start the app**

   From the `frontend` folder:

   ```bash
   npm run dev
   ```

   - Note the URL printed by Vite (commonly `http://localhost:5173`).
   - Open this URL in your browser.
   - For more frontend scripts, environment options, and tooling, see [frontend/README.md](frontend/README.md).

---

## 2. Log In as Manager

1. Browse to the frontend URL (for example `http://localhost:5173`).
2. On the **Landing** page, click **Sign In** to go to the **Login** page.
3. Use the seeded manager credentials:

   ```text
   Username: manager
   Password: Manager123!
   ```

4. Click **Log In**.
5. You should be redirected to the **Dashboard** and see:
   - Sidebar with items: Dashboard, Eye Glasses, Sales History, Users, Activity Log, Profile (depending on role).
   - Top‑right header showing your username and role `MANAGER`.

---

## 3. Verify Manager Dashboard

Purpose: confirm that global stats, charts, and tables load successfully.

1. After login, you are on **Dashboard**.
2. Check the **top statistic cards**:
   - Total Revenue
   - Total Sales
   - Total Products
   - Inventory Value
3. Scroll down to **Revenue Trend** chart:
   - Confirm the chart renders without errors (it may be empty at first if there are no sales).
4. Check the **Top Performing Staff** pie chart:
   - With no data, it may show an empty chart; later it should reflect revenue per staff user.
5. Scroll further:
   - Confirm **Recent Sales** table loads (initially may be empty).
6. If there are any initial seeded sales, verify:
   - Buyer names, product names, dates, and amounts look reasonable and no errors appear.

You will come back to this dashboard after creating sales to confirm that figures and charts update.

---

## 4. Eye Glass Inventory – Add & Manage Products

### 4.1 Open Eye Glass Inventory

1. From the sidebar, click **Eye Glasses**.
2. Confirm:
   - Page title: **Eye Glass Inventory**.
   - A table listing existing products (may be empty on a fresh database).
   - Top‑right controls: **Filter**, **Add Item**, **Delete**.

### 4.2 Add a New Eye Glass Product

Use this concrete test product so you can track it everywhere:

**Test Product A**

| Field          | Value                                 |
| -------------- | ------------------------------------- |
| Photo URL      | `https://via.placeholder.com/200x120` |
| Name           | `Opti Classic 101`                    |
| Price          | `120`                                 |
| Quantity       | `15`                                  |
| Frame Material | `Acetate` (or any option)             |
| Frame Shape    | `Rectangle` (or similar)              |
| Lens Type      | `Single Vision`                       |
| Temple Type    | `Spring Hinge`                        |
| Temple Length  | `140`                                 |
| Bridge Width   | `18`                                  |
| Lens Width     | `52`                                  |
| Lens Height    | `36`                                  |
| Lens Material  | `Polycarbonate`                       |
| Brand          | `RayVision` (or any)                  |
| Gender         | `Male`                                |
| Color          | `Black`                               |

Steps:

1. On **Eye Glass Inventory**, click **Add Item**.
2. Fill all the fields using the table above.
3. Click **Create** / **Submit** (primary button in the modal).
4. Expected results:
   - A success toast appears.
   - The modal closes.
   - The new product **Opti Classic 101** appears in the table.

### 4.3 Create a Variant (Duplicate Product)

Create a second product as a variant of the first:

1. In the Eye Glass table, locate **Opti Classic 101**.
2. In the **Action** column:
   - Click the **Create Variant** (copy) icon.
3. In the variant modal:
   - Change **Name** to `Opti Classic 101 – Blue`.
   - Change **Color** to `Blue`.
   - Keep other fields the same.
4. Submit the form.
5. Verify:
   - New product appears with the updated name and color.
   - Total items count at the top‑right increases accordingly.

### 4.4 Update a Product

1. For the original **Opti Classic 101**:
   - Click the **Update** (retweet) icon in the Action column.
2. Change:
   - **Price** to `130`.
   - **Quantity** to `20`.
3. Submit.
4. Verify:
   - Table now shows price `130` and quantity `20` for that product.

### 4.5 Filter and Search Products

1. Click **Filter**.
2. Apply a filter such as:
   - Brand = the brand you used (e.g. `RayVision`).
   - Price range that includes your product (e.g. `100–150`).
3. Apply the filter.
4. Verify:
   - Table lists only the products matching your filter.
5. Clear filters (using reset/clear controls or filter modal) and ensure all items show again.

### 4.6 Bulk Delete (Optional)

> You will need some products left for later steps, so only delete if you have extras.

1. Select one or more product rows using the table checkboxes.
2. Confirm the **Delete** button becomes enabled and shows “Selected N items” text.
3. Click **Delete**.
4. A confirmation modal titled **Delete Selected Eye Glasses** appears; read the warning and click **Delete** again to confirm.
5. Confirm in toast and UI that selected items disappear from the table.

---

## 5. Sell an Eye Glass and Generate Invoice

You will now create a sale for **Opti Classic 101** and generate an invoice.

### 5.1 Open Sell Modal

1. On **Eye Glass Inventory**, locate **Opti Classic 101**.
2. In the **Action** column, click the **Sell** (shopping cart) icon.
3. The **Sell Eye Glass** modal opens.

### 5.2 Fill Sale Details

Use the following sale data:

| Field         | Value        |
| ------------- | ------------ |
| Quantity      | `2`          |
| Name of Buyer | `John Doe`   |
| Date of Sell  | Today’s date |

Steps:

1. Set **Quantity** to `2`.
2. Set **Name of Buyer** to `John Doe`.
3. Use the date picker to select today’s date.
4. Click **Sell**.

Expected results:

- A success toast appears: sale created.
- The modal stays open and now shows a **Download Invoice** button.

### 5.3 Download Invoice

1. In the same modal, click **Download Invoice**.
2. Verify:
   - A PDF download starts (file named like `invoice-<id>.pdf`).
   - Open the PDF and confirm:
     - Buyer name is `John Doe`.
     - Quantity is `2`.
     - Product name matches `Opti Classic 101`.
     - Pricing and totals look correct based on the product price.
3. Close the Sell modal.

### 5.4 Verify Sale Appears in Sales History

1. From the sidebar, click **Sales History**.
2. Confirm:
   - Page title: **Sales History**.
   - Table shows at least one row for buyer `John Doe`.
3. Use the **search**:
   - Click the filter icon in the **Buyer Name** column.
   - Search for `John Doe` and apply.
   - Verify that only that sale is shown.
4. Check **Sell Date** column:
   - Date matches what you chose in the Sell modal.
5. In the **Download Invoice** column:
   - Click the button to download again and verify the PDF.

### 5.5 Verify Dashboard Stats Updated

1. Navigate back to **Dashboard**.
2. Confirm:
   - **Total Revenue** has increased by `price × quantity` for the sale you created.
   - **Total Sales** count has increased by 1.
   - **Recent Sales** table now lists the sale to `John Doe`.
   - In charts:
     - Revenue Trend line chart includes a point for today’s date.
     - Top Performing Staff pie chart shows manager revenue (if there are multiple sellers later, it will split by user).

---

## 6. User Management & Staff Flows

You will now create a staff user, log in as that user, and test staff‑specific features such as ownership requests.

### 6.1 Create a Staff User (as Manager)

1. While logged in as **Manager**, go to **Users** from the sidebar.
2. Confirm you see:
   - A table of users (at least the Manager).
   - An **Add User** button.
3. Click **Add User** to open the **Add New User** modal.
4. Use this data:

   ```text
   Full Name: Alice Staff
   Username: alice
   Email: alice@example.com
   Password: Alice@2026
   ```

5. Click **Create User**.
6. Verify:
   - Success toast appears.
   - Modal closes.
   - New user **alice** appears in the table with role `user`.

### 6.2 Log Out and Log In as Staff

1. In the header, click the **Logout** button in the sidebar.
2. You are redirected to the login screen.
3. Log in with the new staff account:

   ```text
   Username: alice
   Password: Alice@2026
   ```

4. After login:
   - You should see a more limited sidebar (no Users, no Activity Log).
   - Dashboard title becomes **My Performance** instead of Manager Dashboard.

### 6.3 Staff View of Dashboard

1. On the **Dashboard**, confirm:
   - Cards show **My Total Revenue**, **My Sales Today**, **My Recently Added Items**, **My Revenue Today**.
   - Charts/tables may initially be empty for this new user.

### 6.4 Staff – Add Their Own Product

Create a product owned by **alice** so you can test “My Recently Added Items”.

1. Go to **Eye Glasses**.
2. Click **Add Item**.
3. Use this data:

   **Test Product B (Staff‑Owned)**

   | Field          | Value                                            |
   | -------------- | ------------------------------------------------ |
   | Photo URL      | `https://via.placeholder.com/200x120?text=Staff` |
   | Name           | `Opti Staff Special`                             |
   | Price          | `90`                                             |
   | Quantity       | `5`                                              |
   | Frame Material | choose any                                       |
   | Frame Shape    | choose any                                       |
   | Lens Type      | choose any                                       |
   | Temple Type    | choose any                                       |
   | Temple Length  | `138`                                            |
   | Bridge Width   | `17`                                             |
   | Lens Width     | `50`                                             |
   | Lens Height    | `34`                                             |
   | Lens Material  | choose any                                       |
   | Brand          | e.g. `OptiBrand`                                 |
   | Gender         | `Female`                                         |
   | Color          | `Red`                                            |

4. Submit the form.
5. Verify:
   - Product appears in the table.

### 6.5 Staff – Verify “My Recently Added Items”

1. Go to **Dashboard** while logged in as **alice**.
2. Scroll down and check the **My Recently Added Items** table.
3. Verify:
   - `Opti Staff Special` is listed with correct brand, quantity, and price.

### 6.6 Staff – Request Ownership of Manager Product

1. On **Eye Glasses** as **alice**, identify a product created by the manager (for example **Opti Classic 101**).
2. In the **Action** column for that product, you should see a **Request Access** button (since `createdBy` is not the current user).
3. Click **Request Access**.
4. Expected:
   - Toast shows `Access request sent to owner and manager.` (or similar).
   - No error message is displayed.

---

## 7. Manager – Ownership Requests & Activity Log

Now switch back to the manager account to approve the access request and review activity logs.

### 7.1 Log Back In as Manager

1. Log out from **alice** using the sidebar Logout.
2. Log in again with:

   ```text
   Username: Manager
   Password: Manager@2026
   ```

### 7.2 Review Ownership Requests

1. Open **Users** page.
2. Scroll down to the **Ownership Requests** section.
3. Confirm you see a row where:
   - Eye Glass name is the manager‑owned product (e.g. `Opti Classic 101`).
   - **From** is `alice`.
   - Status is `pending`.
4. Click **Approve** for this request.
5. Verify:
   - Toast indicates success.
   - Status changes to `approved`.

### 7.3 Verify Staff Can Act on Approved Product

1. (Optional, but recommended) Log out as Manager and back in as **alice**.
2. On **Eye Glasses**, find the product for which access was approved.
3. Confirm:
   - Actions such as **Sell** and **Update** work without permission errors.
4. Optionally create a small test sale as **alice** (e.g. quantity `1` to some buyer).
5. Then:
   - Check **Sales History** (as alice) to see the sale.
   - Return to **Dashboard** as alice to see updates in personal stats.
6. Log out and back in as **Manager** and verify manager dashboard also reflects this additional sale in totals and charts.

### 7.4 Check Activity Log

1. While logged in as **Manager**, go to **Activity Log**.
2. Confirm the table shows a history of actions, such as:
   - `LOGIN` entries for Manager and alice.
   - `CREATE` entries for:
     - Eye Glass creation (Opti Classic 101, Opti Classic 101 – Blue, Opti Staff Special).
     - User creation (alice).
     - Sales.
   - `UPDATE` entries for updated products or approved ownership requests.
   - `DELETE` entries if you performed any deletions.
3. Check that each row shows:
   - Time, user, role, action type, and details/target text.

---

## 8. Profile & Password Management

### 8.1 Update Manager Profile

1. While logged in as **Manager**, click your avatar in the header or **Profile** in the sidebar.
2. On the **Profile** page, in **Personal Details**:
   - Set **Full Name** to `Manager Demo`.
   - Optionally update **Email** if desired.
3. Click **Save Changes**.
4. Verify:
   - Success toast appears.
   - If you refresh and return to Profile, new values persist.

### 8.2 Change Password (Optional)

> Only do this if you are comfortable changing the manager password. You can revert by changing it back using the same flow.

1. On the **Profile** page, under **Change Password**:
   - Set **Current Password** to `Manager@2026`.
   - Set **New Password** to `Manager@2027`.
2. Click **Change Password**.
3. Verify:
   - Success toast appears.
4. Log out and log in again using:

   ```text
   Username: Manager
   Password: Manager@2027
   ```

5. After confirming it works, you can repeat the process to change back to `Manager@2026` if desired.

---

## 9. User Deletion & Safety Checks

### 9.1 Delete a Staff User

1. Log in as **Manager** (using whichever password is currently set).
2. Go to **Users** page.
3. In the users table, find **alice**.
4. Click **Delete** for that row.
5. Confirm in the Popconfirm dialog.
6. Verify:
   - Success toast appears.
   - `alice` is removed from the table.

### 9.2 Ensure Self‑Deletion Is Blocked

1. Still on **Users** page, find the Manager row.
2. Confirm:
   - The **Delete** button is disabled for the current user.
   - You cannot delete yourself.

---

## 10. Final Verification Checklist

Use this checklist to ensure you have tested all major features:

- [ ] Backend and frontend start without errors.
- [ ] Manager can log in with seeded credentials.
- [ ] Dashboard loads with correct manager metrics and responds to new data.
- [ ] Eye Glass Inventory:
  - [ ] Add product works.
  - [ ] Update product works.
  - [ ] Create Variant works.
  - [ ] Filter/search works.
  - [ ] Bulk delete works.
- [ ] Sales:
  - [ ] Sell eye glass works with validation (quantity, buyer, date).
  - [ ] Invoice PDF downloads correctly from Sell modal.
  - [ ] Sales appear in Sales History.
  - [ ] Invoice is downloadable from Sales History.
- [ ] User Management:
  - [ ] Manager can create staff users.
  - [ ] Manager can delete staff users.
  - [ ] Self‑deletion is blocked.
- [ ] Ownership Requests:
  - [ ] Staff user can request access to manager‑owned product.
  - [ ] Manager sees pending request and can approve/reject.
  - [ ] Approved access works as expected in Eye Glasses for staff.
- [ ] Activity Log:
  - [ ] Logs show login, create, update, delete actions with correct users and roles.
- [ ] Profile:
  - [ ] Manager can update profile details.
  - [ ] Password change works and is enforced on next login.

If every box above is checked and no errors appear in the UI or console, the Opti Manage application is functioning correctly end to end.
