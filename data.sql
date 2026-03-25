INSERT INTO users (name, role) VALUES
('Pizza Place', 'restaurant'),
('Burger Hub', 'restaurant'),
('Helping NGO', 'ngo'),
('Food Rescue', 'ngo');

INSERT INTO food_listings (food_name, quantity, expiry, restaurant_id) VALUES
('Pizza', 10, NOW() + INTERVAL '2 hours',
 (SELECT id FROM users WHERE name = 'Pizza Place')),
('Burger', 5, NOW() + INTERVAL '3 hours',
 (SELECT id FROM users WHERE name = 'Burger Hub'));

INSERT INTO requests (food_id, ngo_id, status) VALUES
(
  (SELECT id FROM food_listings WHERE food_name = 'Pizza' LIMIT 1),
  (SELECT id FROM users WHERE name = 'Helping NGO' LIMIT 1),
  'pending'
),
(
  (SELECT id FROM food_listings WHERE food_name = 'Burger' LIMIT 1),
  (SELECT id FROM users WHERE name = 'Food Rescue' LIMIT 1),
  'pending'
);

INSERT INTO pickups (request_id, volunteer_name, pickup_time) VALUES
(
  (SELECT id FROM requests 
   WHERE ngo_id = (SELECT id FROM users WHERE name = 'Helping NGO' LIMIT 1)
   ORDER BY id DESC LIMIT 1),
  'Rahul',
  NOW()
);

SELECT 
    r.name AS restaurant,
    f.food_name,
    n.name AS ngo,
    p.volunteer_name
FROM pickups p
JOIN requests req ON p.request_id = req.id
JOIN food_listings f ON req.food_id = f.id
JOIN users r ON f.restaurant_id = r.id
JOIN users n ON req.ngo_id = n.id;

-- Pending requests
SELECT * FROM requests
WHERE status = 'pending';

-- Expiring food (next 2 hours)
SELECT * FROM food_listings
WHERE expiry <= NOW() + INTERVAL '2 hours';

-- Aggregation queries

-- Requests per NGO
SELECT 
    u.name AS ngo,
    COUNT(*) AS total_requests
FROM requests r
JOIN users u ON r.ngo_id = u.id
GROUP BY u.name;

-- Total food quantity
SELECT SUM(quantity) AS total_food FROM food_listings;