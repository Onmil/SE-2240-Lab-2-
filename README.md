# SE 2240 Lab 2 – Shopping API (Backend Only)

This project is a backend-only Express API using Supabase for the database. It includes routes and tests for **Users**, **Addresses**, and **Orders** tables.

---

## Setup & Installation

1. **Clone the repository and switch to the lab branch**:

```
git clone https://github.com/Onmil/SE-2240-Lab-2-.git
cd SE-2240-Lab-2-
git checkout Branch-Final
```

2. Install dependencies:

```
npm install
```

3. Create a .env file in root directory with the following:

```
PORT=5000
NODE_ENV=development
SUPABASE_URL=<your-supabase-url>
SUPABASE_KEY=<your-supabase-anon-key>
JWT_SECRET=your_super_secret_key
JWT_LIFETIME=1d
````

4. Starting the development server:

```
npm run dev
```

5. Run tests:

```
npm test
```
