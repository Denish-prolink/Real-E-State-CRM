# Backend

This folder contains the backend server for the Real-E-State project.

## Seeding the database

Run the following from the `Backend` folder to seed the database with mock data (requires a running MongoDB and `.env` configured):

```bash
pnpm install
pnpm run seed
```

The seeder is implemented at `src/database/seed.ts` and will create sample agencies, users, categories, contacts, employees, SKUs, suppliers, warehouses, products and orders.
