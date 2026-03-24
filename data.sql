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
(15, 13, 'pending'),
(16, 14, 'pending');

INSERT INTO pickups (request_id, volunteer_name, pickup_time) VALUES
(1, 'Rahul', NOW());

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