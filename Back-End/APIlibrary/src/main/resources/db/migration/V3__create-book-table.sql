CREATE TABLE books_tb (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title VARCHAR(100) NOT NULL,
    author VARCHAR(100) NOT NULL,
    edition VARCHAR(45),
    date_publication INT,
    publisher VARCHAR(100),
    preview_picture BYTEA,
    description VARCHAR(255),

    sum_ratings INT DEFAULT 0,
    reviews_count INT DEFAULT 0,
    rating_avg FLOAT DEFAULT 0,

    acquision_date DATE
);