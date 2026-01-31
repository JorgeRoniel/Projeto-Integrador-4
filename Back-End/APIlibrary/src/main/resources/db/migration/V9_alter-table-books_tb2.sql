ALTER TABLE books_tb 
ADD COLUMN count_in_wishlist INT DEFAULT 0,
ADD COLUMN count_reading INT DEFAULT 0, 
ADD COLUMN count_read INT DEFAULT 0,
ADD COLUMN popularity_score FLOAT DEFAULT 0;