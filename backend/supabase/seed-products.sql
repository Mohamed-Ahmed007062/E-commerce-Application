-- إدراج تصنيفات ومنتجات تجريبية (شغّل هذا في Supabase → SQL Editor)

-- 1) التصنيفات
INSERT INTO categories (name) VALUES
  ('Men'),
  ('Women'),
  ('Shoes'),
  ('Accessories')
ON CONFLICT (name) DO NOTHING;

-- 2) المنتجات (تعتمد على وجود التصنيفات)
INSERT INTO products (name, image, description, category_id, price, count_in_stock, rating, num_reviews)
SELECT
  'Running Sneakers',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
  'Comfortable running shoes for daily use.',
  (SELECT id FROM categories WHERE name = 'Shoes' LIMIT 1),
  119.99,
  50,
  4.9,
  312
WHERE EXISTS (SELECT 1 FROM categories WHERE name = 'Shoes');

INSERT INTO products (name, image, description, category_id, price, count_in_stock, rating, num_reviews)
SELECT
  'Floral Summer Dress',
  'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=600&q=80',
  'Light and elegant summer dress.',
  (SELECT id FROM categories WHERE name = 'Women' LIMIT 1),
  59.99,
  30,
  4.8,
  203
WHERE EXISTS (SELECT 1 FROM categories WHERE name = 'Women');

INSERT INTO products (name, image, description, category_id, price, count_in_stock, rating, num_reviews)
SELECT
  'High-Waisted Yoga Pants',
  'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=600&q=80',
  'Stretchy and comfortable yoga pants.',
  (SELECT id FROM categories WHERE name = 'Women' LIMIT 1),
  54.99,
  40,
  4.8,
  234
WHERE EXISTS (SELECT 1 FROM categories WHERE name = 'Women');

INSERT INTO products (name, image, description, category_id, price, count_in_stock, rating, num_reviews)
SELECT
  'Slim Fit Denim Jeans',
  'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=600&q=80',
  'Classic slim fit denim jeans.',
  (SELECT id FROM categories WHERE name = 'Men' LIMIT 1),
  79.99,
  25,
  4.7,
  156
WHERE EXISTS (SELECT 1 FROM categories WHERE name = 'Men');

INSERT INTO products (name, image, description, category_id, price, count_in_stock, rating, num_reviews)
SELECT
  'Cotton Crew Neck T-Shirt',
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80',
  'Premium cotton t-shirt, comfortable for everyday wear.',
  (SELECT id FROM categories WHERE name = 'Men' LIMIT 1),
  24.99,
  150,
  4.5,
  421
WHERE EXISTS (SELECT 1 FROM categories WHERE name = 'Men');

INSERT INTO products (name, image, description, category_id, price, count_in_stock, rating, num_reviews)
SELECT
  'Canvas Backpack',
  'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
  'Spacious and durable canvas backpack.',
  (SELECT id FROM categories WHERE name = 'Accessories' LIMIT 1),
  45.99,
  60,
  4.4,
  267
WHERE EXISTS (SELECT 1 FROM categories WHERE name = 'Accessories');
