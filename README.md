# Electricity Bill Generator

A full-stack web application for managing electricity connections, generating bills, and processing payments.

## Features
-   **Three-Tier Architecture**: Admin, Employee, User.
-   **User Dashboard**: View connection details, bill history, and download receipts.
-   **Employee Portal**: Register users and generate electricity bills.
-   **Admin Panel**: Approve/Reject new connection applications.
-   **Slab-Based Billing**: Dynamic billing logic based on consumption slabs for Household, Commercial, and Industrial connections.
-   **Receipt Generation**: Printable payment receipts with detailed billing period and user info.

## Tech Stack
-   **Frontend**: HTML, CSS, JavaScript
-   **Backend**: Node.js, Express.js
-   **Database**: MongoDB

## Setup

1.  **Install Dependencies**:
    ```bash
    cd backend
    npm install
    ```

2.  **Run Database**:
    Ensure MongoDB is running locally on port `27017`.

3.  **Seed Database** (Optional - for initial admin/employee):
    ```bash
    node seed.js
    ```

4.  **Start Server**:
    ```bash
    node server.js
    ```
    Server runs on `http://localhost:3000`.

5.  **Access Application**:
    Open `public/login.html` (or `http://localhost:3000/login.html` if served statically, currently file-based open or via backend static serve).

## Roles & Credentials (Default)
-   **Admin**: `admin@ebill.com` / `Admin@123`
-   **Employee**: `employee@ebill.com` / `Employee@123`
