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

-- Delete expired food (example logic)
DELETE FROM food_listings
WHERE quantity = 0;

-- Get food requested in accepted requests
SELECT food_name
FROM food_listings
WHERE id IN (
    SELECT food_id FROM requests WHERE status = 'accepted'
);