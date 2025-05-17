// Update the database schema to include date fields for price tracking

-- Update the LowestPrices Table to include date fields for price tracking
ALTER TABLE lowest_prices ADD COLUMN previous_price_date TIMESTAMP;
ALTER TABLE lowest_prices ADD COLUMN current_price_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
