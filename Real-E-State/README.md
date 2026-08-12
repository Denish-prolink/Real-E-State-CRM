# Real-E-State CRM

## Project Overview
Real-E-State is a comprehensive, modern, and highly scalable Real-E-State CRM built to handle daily operations smoothly. It offers features like product management, sales, purchases, and advanced reporting.

## Features
- Dashboard
- Products
- Categories
- Brands
- Suppliers
- Customers
- Sales
- Purchases
- Expenses
- Reports
- Role Management
- User Management
- Authentication
- Profile Settings

## Tech Stack
- **Frontend**: React, Vite
- **Backend**: Node.js, Express
- **Database**: MongoDB

## Folder Structure
```text
Real-E-State/
├── README.md
├── LICENSE
├── CHANGELOG.md
├── Backend/
├── Frontend/
└── documentation/
```

## Requirements
- Node.js >= 20
- MongoDB
- pnpm (Recommended) or npm/yarn

## Default Credentials
**Admin**
- **Email:** admin@example.com
- **Password:** admin123

## Database Configuration
Make sure your MongoDB server is running. Create a new database for Real-E-State and keep the connection string ready.

## Environment Variables
The `.env.example` file is provided in both `Frontend` and `Backend` folders. Rename it to `.env` and fill in the required variables.

Example Backend `.env`:
```env
PORT=5000
DATABASE_URL=mongodb://localhost:27017/Real-E-State
JWT_SECRET=your_jwt_secret_key
```

## Installation & Setup

1. **Backend Install:**
   ```bash
   cd Backend
   pnpm install
   ```

2. **Frontend Install:**
   ```bash
   cd Frontend
   pnpm install
   ```

## Development

Run the backend:
```bash
cd Backend
pnpm run dev
```

Run the frontend:
```bash
cd Frontend
pnpm run dev
```

## Build
To build the frontend project for production:
```bash
cd Frontend
pnpm run build
```

To build the backend:
```bash
cd Backend
pnpm run build
```

## Production
In a production environment, serve the compiled backend (e.g. using `node dist/server.js` or `pm2 start dist/server.js`) and host the built static frontend files on a web server (e.g. Nginx, Vercel, or Apache).

## Security Checklist
This project has been implemented keeping security best practices in mind:
- Passwords are encrypted using **bcrypt**.
- Authentication relies on secure **JWT**.
- Access Tokens have an expiry.
- Refresh Token strategy is available.
- Proper **Logout** invalidates access.
- Every API endpoint ensures full **Validation**.

## FAQ
**Q: How do I change the default admin credentials?**
A: After your first login, navigate to the Profile Settings to update the password, or manage users via the User Management module.

**Q: Can I use MySQL instead of MongoDB?**
A: By default, the system is built with MongoDB. You will need to rewrite the database models and controllers to use a SQL database.

## Support
For any queries or support, please check the included documentation.
