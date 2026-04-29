-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Add location column to users
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS location GEOGRAPHY(POINT, 4326);

-- Update users with Patiala coordinates
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