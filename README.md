# UmaShankar Printers & Solutions — REST API Backend

> A production-ready RESTful API backend powering the UmaShankar Printers & Solutions service platform. Built with **Node.js**, **Express.js**, and **MongoDB Atlas**, delivering structured device and service data for printer repair, computer/laptop repair, and CCTV installation verticals.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Configuration](#environment-configuration)
  - [Running the Server](#running-the-server)
- [API Reference](#api-reference)
- [Database Schema](#database-schema)
- [Middleware](#middleware)
- [Error Handling](#error-handling)
- [Security](#security)
- [Deployment](#deployment)

---

## Overview

This repository contains the **backend service layer** for the UmaShankar Printers & Solutions website. It exposes a RESTful API consumed by the React + Vite frontend via **Axios HTTP client**. The API handles dynamic retrieval of device/service records stored in a **MongoDB Atlas** cloud database, categorized by service type.

**Key Capabilities:**
- Type-based dynamic routing for multi-category service data
- MongoDB Atlas cloud database integration with Mongoose ODM
- CORS-enabled for cross-origin frontend consumption
- Environment-variable-driven configuration with dotenv
- Clean MVC-inspired separation of concerns (config / models / routes)

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Runtime | Node.js | v18+ |
| Web Framework | Express.js | ^4.x |
| ODM | Mongoose | ^8.x |
| Database | MongoDB Atlas | Cloud (M0+) |
| Environment Management | dotenv | ^16.x |
| CORS Handling | cors (npm) | ^2.x |
| Package Manager | npm | — |

---

## Architecture

```
Client (React + Vite + Axios)
        │
        │  HTTP GET /:type
        ▼
Express.js REST API  ──►  Mongoose ODM  ──►  MongoDB Atlas
        │
   CORS Middleware
   Route Handler
   Error Handler
```

- **Stateless REST architecture** — no sessions or authentication layer
- **Single-collection strategy** — all service types stored in one `devices` collection, differentiated by a `type` enum field
- **Cloud-native database** — MongoDB Atlas with connection string injected via environment variable

---

## Project Structure

```
backend/
├── config/
│   └── database.js          # MongoDB Atlas connection logic (Mongoose)
├── models/
│   └── device.js            # Mongoose Schema & Model definition
├── routes/
│   └── info.js              # Express Router — GET /:type endpoint
├── .env                     # Environment variables — NOT committed to VCS
├── .gitignore               # Excludes node_modules, .env
├── app.js                   # Application entry point — Express app init
└── package.json             # Project metadata & dependency manifest
```

---

## Getting Started

### Prerequisites

Ensure the following are installed and configured on your system:

- **Node.js** v18 or higher — [Download](https://nodejs.org/)
- **npm** v9 or higher (bundled with Node.js)
- **MongoDB Atlas Account** — [Sign up](https://www.mongodb.com/cloud/atlas) with an active cluster and a database user with read/write privileges
- **Git** — for version control

---

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/<your-repo-name>.git

# 2. Navigate into the backend directory
cd backend

# 3. Install all dependencies from package.json
npm install
```

---

### Environment Configuration

This project uses **dotenv** for environment variable management. Sensitive credentials are never hardcoded.

Create a `.env` file in the **project root**:

```env
# MongoDB Atlas credentials
DBPASSWORD=your_mongodb_atlas_password

# Server port
PORT=3000
```

> ⚠️ **Security Notice:** Never commit `.env` to version control. It is excluded via `.gitignore`. Exposing database credentials publicly will compromise your MongoDB Atlas cluster.

**How it works:**  
`require("dotenv").config()` is called at the top of `app.js` before any other module imports. This loads all key-value pairs from `.env` into `process.env`, making them accessible throughout the entire application via `process.env.VARIABLE_NAME`.

---

### Running the Server

```bash
# Standard start
node app.js

# Development mode with auto-restart on file changes (recommended)
npx nodemon app.js

# Or if nodemon is globally installed
nodemon app.js
```

On successful startup, the console will output:

```
Db connection successful
Server is successfully listening to port 3000
```

API is now accessible at: `http://localhost:3000`

---

## API Reference

### Base URL

```
http://localhost:3000
```

---

### Endpoints

#### `GET /:type` — Fetch devices/services by category

Retrieves all documents from the `devices` collection that match the specified `type`.

**URL Parameters**

| Parameter | Type | Required | Accepted Values |
|---|---|---|---|
| `type` | `string` | ✅ Yes | `printer` \| `computer` \| `cctv` |

**Example Requests**

```http
GET /printer
GET /computer
GET /cctv
```

**Success Response — `200 OK`**

```json
[
  {
    "_id": "664a1f3c8b2e4a001f3d9c12",
    "title": "HP LaserJet Pro Repair",
    "description": "Full diagnostic and repair service for HP LaserJet Pro series printers including cartridge replacement and drum cleaning.",
    "image": "https://example.com/images/hp-laserjet.jpg",
    "type": "printer"
  },
  {
    "_id": "664a1f3c8b2e4a001f3d9c13",
    "title": "Canon Inkjet Servicing",
    "description": "Ink head cleaning, alignment calibration, and roller replacement for Canon Inkjet printers.",
    "image": "https://example.com/images/canon-inkjet.jpg",
    "type": "printer"
  }
]
```

**Error Response — `400 Bad Request`**

```
Error<error message string>
```

Triggered when a database query fails or an unexpected server error occurs.

---

## Database Schema

**Collection:** `devices`  
**ODM:** Mongoose  
**Database:** MongoDB Atlas

### Device Schema

```javascript
{
  title: String,           // Service/product title
  description: String,     // Detailed description of the service
  image: String,           // URL pointing to the service image asset
  type: {
    type: String,
    enum: ["printer", "computer", "cctv"]   // Enforced enum constraint
  }
}
```

| Field | Type | Constraint | Description |
|---|---|---|---|
| `_id` | ObjectId | Auto-generated | MongoDB document identifier |
| `title` | String | None | Display name of the service |
| `description` | String | None | Full description of the service |
| `image` | String | None | CDN or static URL for the service image |
| `type` | String | Enum | Service category: `printer`, `computer`, or `cctv` |

**Indexing Strategy:**  
Consider adding an index on the `type` field for improved query performance as the collection grows:

```javascript
deviceSchema.index({ type: 1 });
```

---

## Middleware

| Middleware | Package | Purpose |
|---|---|---|
| CORS | `cors` | Allows cross-origin requests from the frontend (React dev server / production domain) |
| JSON Body Parser | Built-in (`express.json()`) | Parses incoming JSON request bodies (add if POST/PUT routes are introduced) |

**Current CORS Configuration:**

```javascript
app.use(cors()); // Allows all origins — suitable for development
```

**Recommended Production CORS Configuration:**

```javascript
app.use(cors({
  origin: "https://your-frontend-domain.com",
  methods: ["GET"],
}));
```

---

## Error Handling

Currently implemented as inline try/catch blocks within route handlers. Errors are caught and returned as `400 Bad Request` with the error message appended.

**Recommended Enhancement — Centralized Error Middleware:**

```javascript
// Add at the bottom of app.js, after all routes
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});
```

---

## Security

| Concern | Current Status | Recommendation |
|---|---|---|
| Database credentials | ✅ Stored in `.env` | 
| `.env` in VCS | ✅ Excluded via `.gitignore` |

---

## Deployment

### Environment Variables on Hosting Platforms

When deploying to platforms like **Render**, **Railway**, **Heroku**, or **Vercel (serverless)**, set environment variables through the platform dashboard — do **not** upload the `.env` file.

| Variable | Value |
|---|---|
| `DBPASSWORD` | Your MongoDB Atlas password |
| `PORT` | Platform-assigned (usually auto-injected) |

### MongoDB Atlas Network Access

In **MongoDB Atlas → Network Access**, whitelist:
- `0.0.0.0/0` for open access (development / staging)
- Your server's static IP (recommended for production)

---


> Built for **UmaShankar Printers & Solutions**, Palakol — providing trusted printer repair, computer servicing, and CCTV installation services.
