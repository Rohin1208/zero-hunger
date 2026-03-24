CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    role VARCHAR(20) CHECK (role IN ('restaurant', 'ngo'))
);
CREATE TABLE food_listings (
    id SERIAL PRIMARY KEY,
    food_name VARCHAR(100),
    quantity INTEGER,
    expiry TIMESTAMP,
    restaurant_id INTEGER REFERENCES users(id)
);