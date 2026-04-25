ALTER TABLE users
ALTER COLUMN name SET NOT NULL;

ALTER TABLE users
ADD CONSTRAINT unique_user_name UNIQUE (name);

ALTER TABLE food_listings
ALTER COLUMN food_name SET NOT NULL;

ALTER TABLE food_listings
ALTER COLUMN quantity SET NOT NULL;

ALTER TABLE food_listings
ADD CONSTRAINT positive_quantity CHECK (quantity > 0);

ALTER TABLE requests
ADD CONSTRAINT valid_status 
CHECK (status IN ('pending', 'accepted', 'rejected'));

CREATE INDEX idx_food_restaurant 
ON food_listings(restaurant_id);

CREATE INDEX idx_requests_food 
ON requests(food_id);

CREATE INDEX idx_requests_ngo 
ON requests(ngo_id);

ALTER TABLE food_listings
DROP CONSTRAINT food_listings_restaurant_id_fkey;

ALTER TABLE food_listings
ADD CONSTRAINT food_listings_restaurant_id_fkey
FOREIGN KEY (restaurant_id)
REFERENCES users(id)
ON DELETE CASCADE;