-- Initialize database tables for TMNT Comic Price Tracker

-- Comics Table
CREATE TABLE IF NOT EXISTS comics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  issue_number INTEGER NOT NULL,
  series TEXT NOT NULL,
  publisher TEXT NOT NULL,
  year INTEGER NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Prices Table
CREATE TABLE IF NOT EXISTS prices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  comic_id INTEGER NOT NULL,
  price REAL NOT NULL,
  source TEXT NOT NULL,
  url TEXT,
  condition TEXT,
  date_checked TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (comic_id) REFERENCES comics(id)
);

-- LowestPrices Table
CREATE TABLE IF NOT EXISTS lowest_prices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  comic_id INTEGER NOT NULL,
  current_price REAL NOT NULL,
  previous_price REAL,
  source TEXT NOT NULL,
  url TEXT,
  condition TEXT,
  date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (comic_id) REFERENCES comics(id)
);

-- Insert initial TMNT Series 1 comics (issues 1-66)
INSERT INTO comics (title, issue_number, series, publisher, year, description)
VALUES 
('Teenage Mutant Ninja Turtles', 1, 'Series 1', 'Mirage Studios', 1984, 'First appearance of the Teenage Mutant Ninja Turtles'),
('Teenage Mutant Ninja Turtles', 2, 'Series 1', 'Mirage Studios', 1984, 'Second issue of TMNT'),
('Teenage Mutant Ninja Turtles', 3, 'Series 1', 'Mirage Studios', 1985, 'Third issue of TMNT'),
('Teenage Mutant Ninja Turtles', 4, 'Series 1', 'Mirage Studios', 1985, 'Fourth issue of TMNT');

-- Add more issues 5-66 here
-- For brevity, only adding first 4 issues as examples
-- In production, all 66 issues would be added
