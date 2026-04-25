-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Add location column to users
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS location GEOGRAPHY(POINT, 4326);

-- Update users with Patiala coordinates
UPDATE users SET location = ST_MakePoint(76.3869, 30.3398)
WHERE name = 'Pizza Place';

UPDATE users SET location = ST_MakePoint(76.3900, 30.3420)
WHERE name = 'Burger Hub';

UPDATE users SET location = ST_MakePoint(76.3880, 30.3410)
WHERE name = 'Helping NGO';

UPDATE users SET location = ST_MakePoint(76.3950, 30.3450)
WHERE name = 'Food Rescue';