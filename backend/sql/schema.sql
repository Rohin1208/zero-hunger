CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    role VARCHAR(20) CHECK (role IN ('restaurant', 'ngo')),
    location GEOGRAPHY(POINT, 4326)
);

CREATE TABLE food_listings (
    id SERIAL PRIMARY KEY,
    food_name VARCHAR(100),
    quantity INTEGER,
    expiry TIMESTAMP,
    restaurant_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE requests (
    id SERIAL PRIMARY KEY,
    food_id INTEGER REFERENCES food_listings(id),
    ngo_id INTEGER REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'pending'
);

CREATE TABLE pickups (
    id SERIAL PRIMARY KEY,
    request_id INTEGER REFERENCES requests(id),
    volunteer_name VARCHAR(100),
    pickup_time TIMESTAMP
);