# Supabase setup for this project

MongoDB has been replaced with Supabase (PostgreSQL).

## Steps

1. **Create a project on [Supabase](https://supabase.com)**  
   - Sign in or create an account  
   - New Project → choose organization, region, and project name  

2. **Run the schema (tables)**  
   - From the project dashboard: **SQL Editor** → New query  
   - Copy the contents of `migrations/001_initial_schema.sql` and paste into the editor → **Run**  
   - Then open a new query, copy `migrations/002_brands_wishlist_addresses_auth.sql` and run it (adds brands, wishlist, addresses, password reset)  

3. **Configure backend environment variables**  
   - From the project: **Settings** → **API**  
   - Copy **Project URL** and **service_role** key (not the anon key)  
   - In the `backend` folder, create or update the `.env` file:

```env
PORT=5000
JWT_SECRET=your_jwt_secret_change_in_production

SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc... (full service_role value)
```

4. **Run the backend**  
   - `npm run dev` from the `backend` folder  
   - Run the frontend from the `frontend` folder  

## Optional: seed data

- **Users:** Register from the app UI; users are stored in the `users` table.
- **Categories and products:** From **SQL Editor**:

```sql
INSERT INTO categories (name) VALUES ('Men'), ('Women'), ('Shoes'), ('Accessories');

INSERT INTO products (name, image, description, category_id, price, count_in_stock, rating, num_reviews)
VALUES (
  'Running Sneakers',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
  'Comfortable running shoes.',
  (SELECT id FROM categories LIMIT 1),
  119.99,
  50,
  4.9,
  312
);
```

For more sample products, use the statements in `seed-products.sql`.
