# Expense Tracker

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-v22+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-node:sqlite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)
![Express](https://img.shields.io/badge/Express-4-000000?style=for-the-badge&logo=express&logoColor=white)

**A modern, self-contained personal finance and expense analytics web application.**  
*Zero external database setup. Zero Docker required. Ready to run out-of-the-box.*

[Highlights](#highlights) • [Quick Start](#quick-start) • [Tech Stack](#tech-stack) • [Project Structure](#project-structure) • [API Reference](#api-reference)

</div>

---

## Highlights

Expense Tracker is a full-stack personal finance platform designed for speed, simplicity, and complete data privacy. Built with **React 18** and **Node.js (Express)**, it utilizes Node's native embedded SQLite engine (`node:sqlite`), making it 100% portable, offline-capable, and local.

- **Zero Configuration**: No MongoDB, Docker, or external database server needed. Launching the project automatically creates and initializes the local database file.
- **Rich Analytics**: Dynamic visual spending breakdowns powered by Material-UI X-Charts, featuring category distribution pie charts, monthly comparison bar charts, and historical timeline graphs.
- **Instant CSV Ingestion**: Transaction-backed batch importer that parses and uploads thousands of transactions in seconds with automatic category creation.
- **Category & Expense Management**: Organize expenses by custom categories, with live balance computation, inline editing, and deletion protections.
- **Secure Authentication**: Stateless JWT auth with bcrypt password hashing and persistent client-side session management.
- **Dark Theme Interface**: Clean, responsive dark-mode interface crafted with styled-components and Material-UI design tokens.
- **Streamlined Dev Runner**: Custom startup orchestrator that reports local and network URLs cleanly in the terminal without unsolicited browser popups.

---

## Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) **v22.5.0 or higher** (Node v24 recommended)
- **npm** (bundled with Node.js)

---

### Step 1: Install Dependencies
Open your terminal in the project root directory and run:
```bash
npm run install:all
```

---

### Step 2: Start the App
Start both the backend API and frontend client with a single command:
```bash
npm run dev
```

The embedded database will auto-create on your first run, and the terminal will output the live addresses:
- **Frontend App**: [http://localhost:5173](http://localhost:5173) *(and local network address if connected)*
- **Backend API**: [http://localhost:5100](http://localhost:5100) *(Health check: `http://localhost:5100/health`)*

---

## Configuration (Optional)

The application comes **pre-configured with working defaults** so you can run it immediately without modifying anything. 

If you ever need to customize ports or secret keys, template files are provided:

| File | Variable | Default | Purpose |
| :--- | :--- | :--- | :--- |
| `server/.env` | `PORT` | `5100` | Port on which the Express REST API runs |
| `server/.env` | `JWT_SECRET` | *(pre-set dev key)* | Secret key used to encrypt and sign JWT auth tokens |
| `client/.env` | `VITE_API_URL` | `http://localhost:5100/api` | Base URL used by the React client to contact the backend |

> **Note**: `.env` files are protected by `.gitignore` so your private secrets will never be committed to Git. Public configuration templates are preserved in `.env.example`.

---

## Tech Stack

| Domain | Technology | Description |
| :--- | :--- | :--- |
| **Frontend Framework** | React 18 & Vite 5 | Modern component architecture with lightning-fast HMR |
| **UI & Styling** | Material-UI (MUI v6) & styled-components | Dark theme, responsive typography, and form controls |
| **Charts & Data Viz** | `@mui/x-charts` | Interactive pie charts, multi-year lines, and monthly bars |
| **State Management** | Redux Toolkit & Redux Persist | Centralized auth and user session persistence |
| **Data Ingestion** | PapaParse | High-throughput client-side CSV parsing |
| **Backend Framework** | Express 4 (Node.js ES Modules) | RESTful API architecture |
| **Database Engine** | Embedded SQLite (`node:sqlite`) | Native zero-dependency database with WAL mode |
| **Authentication** | JWT (`jsonwebtoken`) & `bcrypt` | Secure token generation and salted password hashing |
| **Orchestration** | Node Process Runner (`server/dev.js`) | Clean, unified local development environment |

---

## Project Structure

```
ExpenseTracker/
├── client/                                 # React 18 Frontend (Vite)
│   ├── public/                             # Public static assets & favicon
│   ├── src/
│   │   ├── assets/                         # SVG logos and vector graphics
│   │   ├── components/
│   │   │   ├── charts/                     # Pie, bar, and timeline charts
│   │   │   ├── common/                     # Reusable Button and Input UI primitives
│   │   │   ├── features/                   # Feature modules (auth, expenses, categories)
│   │   │   └── layout/                     # App Navbar and ProtectedRoute guards
│   │   ├── pages/                          # AuthPage, DashboardPage, BudgetPage
│   │   ├── services/                       # Axios API client with token interceptors
│   │   ├── store/                          # Redux Toolkit store and authSlice
│   │   ├── styles/                         # Theme definitions and dark mode tokens
│   │   ├── App.jsx                         # React router and route configuration
│   │   └── main.jsx                        # React root entrypoint
│   ├── .env.example                        # Client environment template
│   ├── vite.config.js                      # Vite configuration (host enabled, auto-open disabled)
│   └── package.json
├── server/                                 # Express 4 Backend API
│   ├── src/
│   │   ├── config/                         # SQLite initialization & schema migration
│   │   ├── controllers/                    # Request handlers (auth, category, expense)
│   │   ├── middleware/                     # JWT authentication middleware
│   │   ├── models/                         # SQLite models (User, Category, Expense)
│   │   ├── routes/                         # Express API route modules
│   │   ├── app.js                          # Express application setup & middleware
│   │   └── server.js                       # Server startup and port binding
│   ├── data/                               # Local SQLite database directory (.gitkeep)
│   ├── .env.example                        # Server environment template
│   ├── dev.js                              # Unified dev orchestrator (no extra dependencies)
│   └── package.json
├── sample/                                 # Dedicated folder containing sample CSV datasets
│   ├── household_monthly.csv               # Household monthly expenses
│   ├── freelance_business.csv              # Freelancer business operating expenses
│   ├── student_lifestyle.csv               # Student budget and college expenses
│   ├── travel_vacation.csv                 # Holiday trip and travel ledger
│   └── sample_expenses.csv                 # Starter dataset
├── package.json                            # Monorepo root workspace configuration
└── .gitignore                              # Comprehensive Git rules (protects DB & secrets)
```

---

## API Reference

All protected endpoints require an `Authorization: Bearer <token>` header obtained via login.

### Authentication
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/register` | Register a new user account | Public |
| `POST` | `/api/auth/login` | Authenticate user & return JWT token | Public |
| `GET` | `/health` | Server health check endpoint | Public |

### Categories
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/categories` | Fetch all categories belonging to the user | Protected |
| `POST` | `/api/categories` | Create a new custom category | Protected |
| `DELETE` | `/api/categories/:id` | Delete a category | Protected |

### Expenses
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/expenses` | Get all expenses (supports filtering by category) | Protected |
| `POST` | `/api/expenses` | Create a single expense entry | Protected |
| `PUT` | `/api/expenses/:id` | Update an existing expense entry | Protected |
| `DELETE` | `/api/expenses/:id` | Delete an expense entry | Protected |
| `POST` | `/api/expenses/bulk` | Bulk import expenses via atomic SQLite transaction | Protected |

---

## CSV Bulk Import Specification

You can import transaction history in bulk using the built-in CSV importer on the Budget page. 

A dedicated [`sample/`](sample/) folder is included with pre-configured datasets for various scenarios:

| Dataset | File Path | Use Case |
|---|---|---|
| **Household Budget** | [`sample/household_monthly.csv`](sample/household_monthly.csv) | Standard monthly family bills, groceries, utilities & housing |
| **Freelance Business** | [`sample/freelance_business.csv`](sample/freelance_business.csv) | Software subscriptions, coworking, cloud servers & client lunches |
| **Student Lifestyle** | [`sample/student_lifestyle.csv`](sample/student_lifestyle.csv) | College tuition, textbooks, transit passes, laundry & food |
| **Travel & Vacation** | [`sample/travel_vacation.csv`](sample/travel_vacation.csv) | Flights, boutique hotels, activities, dining & local transit |
| **Starter Dataset** | [`sample/sample_expenses.csv`](sample/sample_expenses.csv) | General sample transactions for immediate quick-testing |

### CSV Format Requirements
```csv
dateStr,description,amount,categoryName
2026-03-01,Apartment Rental Lease,1450.00,Housing
2026-03-03,Whole Foods Weekly Groceries,164.25,Groceries
2026-03-05,Fiber Optic Internet Bill,70.00,Utilities
2026-03-10,Gasoline Fill-Up,52.30,Transportation
```

*Note: Any categories listed in your CSV that do not already exist in your account will be created automatically during import.*

