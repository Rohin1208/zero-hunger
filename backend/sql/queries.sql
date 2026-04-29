-- All available food (> 0 quantity)
SELECT * FROM food_listings
WHERE quantity > 0;

-- Pending requests only
SELECT * FROM requests
WHERE status = 'pending';

-- Show food with restaurant name
SELECT f.food_name, f.quantity, u.name AS restaurant
FROM food_listings f
JOIN users u ON f.restaurant_id = u.id;

-- Show which NGO requested which food
SELECT r.id, u.name AS ngo, f.food_name, r.status
FROM requests r
JOIN users u ON r.ngo_id = u.id
JOIN food_listings f ON r.food_id = f.id;

-- Number of requests per NGO
SELECT u.name AS ngo, COUNT(*) AS total_requests
FROM requests r
JOIN users u ON r.ngo_id = u.id
GROUP BY u.name;

-- Latest food listings
SELECT * FROM food_listings
ORDER BY created_at DESC
LIMIT 5;

-- Accept a request
UPDATE requests
SET status = 'accepted'
WHERE id = 1;

-- Delete expired food
DELETE FROM food_listings
WHERE quantity = 0;

-- Get food requested in accepted requests
SELECT food_name
FROM food_listings
WHERE id IN (
    SELECT food_id FROM requests WHERE status = 'accepted'
);

-- Find food near an NGO (PostGIS)
SELECT 
    f.food_name,
    f.quantity,
    f.expiry,
    u.name AS restaurant,
    ROUND(ST_Distance(ngo.location, u.location)::numeric / 1000, 2) AS distance_km
FROM food_listings f
JOIN users u ON f.restaurant_id = u.id
JOIN users ngo ON ngo.id = 6
WHERE f.quantity > 0
  AND f.expiry > NOW()
  AND ST_DWithin(ngo.location, u.location, 5000)
ORDER BY distance_km ASC;

-- Expiring food (next 2 hours)
SELECT * FROM food_listings
WHERE expiry <= NOW() + INTERVAL '2 hours'
AND quantity > 0;

-- Total food quantity available
SELECT SUM(quantity) AS total_food 
FROM food_listings
WHERE quantity > 0 AND expiry > NOW();

-- Full pickup report
SELECT 
    r.name AS restaurant,
    f.food_name,
    n.name AS ngo,
    p.volunteer_name,
    p.pickup_time
FROM pickups p
JOIN requests req ON p.request_id = req.id
JOIN food_listings f ON req.food_id = f.id
JOIN users r ON f.restaurant_id = r.id
JOIN users n ON req.ngo_id = n.id;