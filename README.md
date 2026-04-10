# Banking Transaction System (Frontend)

A React + Vite frontend for a real-time banking system. The app lets users create accounts, view account details, run transactions (deposit, withdraw, transfer), and monitor live backend events over Socket.IO.

## What This App Does

- Shows a dashboard with real-time transaction events.
- Lists all accounts and supports account search by account ID.
- Creates new accounts.
- Displays account details, including current balance and holder name.
- Performs deposit, withdraw, and transfer operations.
- Reacts to live backend events and refreshes account data.

## Main Routes

- `/` - Dashboard (live activity stream)
- `/accounts` - Account listing, search, and account creation
- `/accounts/:id` - Account detail view
- `/transactions` - Deposit, withdraw, and transfer forms

## Prerequisites

- Node.js 18+
- npm 9+
- A running backend API and Socket.IO server

## Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

Defaults are already coded:

- `VITE_API_BASE_URL` defaults to `http://localhost:5000/api`
- `VITE_SOCKET_URL` defaults to `http://localhost:5000`

## Install and Run

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`).

## How To Use The Application

### 1. Open Dashboard

- Go to `/`.
- Confirm connection status in the top bar:
  - `Live` means socket is connected.
  - `Offline` means socket is disconnected.
- Watch incoming backend events in the "Real-Time Activity" panel.

### 2. Create an Account

- Go to `/accounts`.
- Click **Create Account**.
- Fill:
  - Account ID (example: `ACC1001`)
  - Holder Name
  - Initial Balance
- Submit to create the account.

Notes:

- Account IDs are normalized to uppercase by the frontend before API calls.
- After success, the accounts list refreshes.

### 3. Search and View Accounts

- On `/accounts`, enter an account ID in the search input.
- Press Enter or click **Search**.
- The matched account is shown at the top of the list.
- Click any account row to open `/accounts/:id`.

### 4. View Account Details

- On `/accounts/:id`, view account ID, holder, and current balance.
- Use **Refresh** to manually re-fetch the latest data.

### 5. Run Transactions

- Go to `/transactions`.
- Use one of the three tabs:
  - **Deposit**: account ID + amount
  - **Withdraw**: account ID + amount
  - **Transfer**: source account ID + destination account ID + amount
- Submit the form to run the operation.

Validation rules in UI:

- Amount must be greater than 0.
- Required fields must not be empty.
- Transfer source and destination account IDs must be different.

### 6. Observe Real-Time Updates

- After successful operations, backend socket events trigger UI updates.
- Dashboard event feed shows:
  - `transaction:created`
  - `balance:updated`
  - `transaction:failed`
- Account caches are updated/invalidate-refetched to keep views current.

## Expected Backend Endpoints

The frontend calls these API routes:

- `GET /accounts`
- `POST /accounts/create`
- `GET /accounts/:id`
- `POST /transactions/deposit`
- `POST /transactions/withdraw`
- `POST /transactions/transfer`

The frontend also expects Socket.IO events:

- `transaction:created`
- `balance:updated`
- `transaction:failed`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests once (Vitest)
- `npm run test:watch` - Run tests in watch mode

## Tech Stack

- React 18 + TypeScript
- Vite
- React Router
- TanStack Query
- Socket.IO Client
- Tailwind CSS + shadcn/ui
- Sonner (toast notifications)
