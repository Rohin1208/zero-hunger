-- Clear existing data
TRUNCATE TABLE pickups, requests, food_listings, users RESTART IDENTITY CASCADE;

-- Users (Restaurants + NGOs)
INSERT INTO users (name, role) VALUES
('Pizza Palace', 'restaurant'),
('Burger Barn', 'restaurant'),
('Spice Garden', 'restaurant'),
('The Bakery House', 'restaurant'),
('Green Bites', 'restaurant'),
('Hope Shelter', 'ngo'),
('Food For All', 'ngo'),
('Street Kids Foundation', 'ngo'),
('City Food Bank', 'ngo'),
('Hunger Free Zone', 'ngo');

-- Food Listings (mix of active, expiring soon, expired)
INSERT INTO food_listings (food_name, quantity, expiry, restaurant_id) VALUES
('Margherita Pizza', 20, NOW() + INTERVAL '5 hours', 
 (SELECT id FROM users WHERE name = 'Pizza Palace')),
('Garlic Bread', 15, NOW() + INTERVAL '4 hours', 
 (SELECT id FROM users WHERE name = 'Pizza Palace')),
('Chicken Burger', 10, NOW() + INTERVAL '6 hours', 
 (SELECT id FROM users WHERE name = 'Burger Barn')),
('Veggie Burger', 8, NOW() + INTERVAL '3 hours', 
 (SELECT id FROM users WHERE name = 'Burger Barn')),
('Paneer Curry', 25, NOW() + INTERVAL '8 hours', 
 (SELECT id FROM users WHERE name = 'Spice Garden')),
('Dal Makhani', 30, NOW() + INTERVAL '7 hours', 
 (SELECT id FROM users WHERE name = 'Spice Garden')),
('Croissants', 40, NOW() + INTERVAL '12 hours', 
 (SELECT id FROM users WHERE name = 'The Bakery House')),
('Banana Bread', 20, NOW() + INTERVAL '10 hours', 
 (SELECT id FROM users WHERE name = 'The Bakery House')),
('Mixed Salad', 12, NOW() + INTERVAL '2 hours', 
 (SELECT id FROM users WHERE name = 'Green Bites')),
('Fruit Bowl', 18, NOW() + INTERVAL '3 hours', 
 (SELECT id FROM users WHERE name = 'Green Bites')),
('Pasta Arrabiata', 5, NOW() + INTERVAL '30 minutes', 
 (SELECT id FROM users WHERE name = 'Spice Garden')),
('Leftover Rice', 10, NOW() + INTERVAL '20 minutes', 
 (SELECT id FROM users WHERE name = 'Green Bites'));

-- Requests (mix of pending, accepted, rejected)
INSERT INTO requests (food_id, ngo_id, status) VALUES
(
  (SELECT id FROM food_listings WHERE food_name = 'Margherita Pizza'),
  (SELECT id FROM users WHERE name = 'Hope Shelter'),
  'accepted'
),
(
  (SELECT id FROM food_listings WHERE food_name = 'Chicken Burger'),
  (SELECT id FROM users WHERE name = 'Food For All'),
  'accepted'
),
(
  (SELECT id FROM food_listings WHERE food_name = 'Paneer Curry'),
  (SELECT id FROM users WHERE name = 'Street Kids Foundation'),
  'pending'
),
(
  (SELECT id FROM food_listings WHERE food_name = 'Dal Makhani'),
  (SELECT id FROM users WHERE name = 'City Food Bank'),
  'pending'
),
(
  (SELECT id FROM food_listings WHERE food_name = 'Croissants'),
  (SELECT id FROM users WHERE name = 'Hunger Free Zone'),
  'pending'
),
(
  (SELECT id FROM food_listings WHERE food_name = 'Veggie Burger'),
  (SELECT id FROM users WHERE name = 'Hope Shelter'),
  'rejected'
),
(
  (SELECT id FROM food_listings WHERE food_name = 'Fruit Bowl'),
  (SELECT id FROM users WHERE name = 'Food For All'),
  'pending'
),
(
  (SELECT id FROM food_listings WHERE food_name = 'Banana Bread'),
  (SELECT id FROM users WHERE name = 'City Food Bank'),
  'accepted'
);

-- Pickups (for accepted requests)
INSERT INTO pickups (request_id, volunteer_name, pickup_time) VALUES
(
  (SELECT r.id FROM requests r 
   JOIN food_listings f ON r.food_id = f.id 
   WHERE f.food_name = 'Margherita Pizza' AND r.status = 'accepted'),
  'Rahul Sharma',
  NOW() + INTERVAL '1 hour'
),
(
  (SELECT r.id FROM requests r 
   JOIN food_listings f ON r.food_id = f.id 
   WHERE f.food_name = 'Chicken Burger' AND r.status = 'accepted'),
  'Priya Verma',
  NOW() + INTERVAL '2 hours'
),
(
  (SELECT r.id FROM requests r 
   JOIN food_listings f ON r.food_id = f.id 
   WHERE f.food_name = 'Banana Bread' AND r.status = 'accepted'),
  'Amit Singh',
  NOW() + INTERVAL '3 hours'
);

-- Locations for PostGIS
UPDATE users SET location = ST_MakePoint(76.3869, 30.3398) WHERE name = 'Pizza Palace';
UPDATE users SET location = ST_MakePoint(76.3900, 30.3420) WHERE name = 'Burger Barn';
UPDATE users SET location = ST_MakePoint(76.3750, 30.3300) WHERE name = 'Spice Garden';
UPDATE users SET location = ST_MakePoint(76.4000, 30.3500) WHERE name = 'The Bakery House';
UPDATE users SET location = ST_MakePoint(76.3800, 30.3450) WHERE name = 'Green Bites';
UPDATE users SET location = ST_MakePoint(76.3880, 30.3410) WHERE name = 'Hope Shelter';
UPDATE users SET location = ST_MakePoint(76.3920, 30.3380) WHERE name = 'Food For All';
UPDATE users SET location = ST_MakePoint(76.3850, 30.3430) WHERE name = 'Street Kids Foundation';
UPDATE users SET location = ST_MakePoint(76.3780, 30.3350) WHERE name = 'City Food Bank';
UPDATE users SET location = ST_MakePoint(76.3950, 30.3470) WHERE name = 'Hunger Free Zone';