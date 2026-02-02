CREATE TABLE books_tb (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    edition VARCHAR(45),
    date_publication INT,
    publisher VARCHAR(100),
    preview_picture BYTEA,
    description TEXT,

    sum_ratings INT DEFAULT 0,
    reviews_count INT DEFAULT 0,
    rating_avg FLOAT DEFAULT 0,

    acquision_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    preview_picture_url TEXT,
    count_in_wishlist INT DEFAULT 0,
    count_reading INT DEFAULT 0, 
    count_read INT DEFAULT 0,
    popularity_score FLOAT DEFAULT 0,
    isbn VARCHAR(13) UNIQUE,
    subtitulo VARCHAR(255),
    paginas INTEGER,
    idioma VARCHAR(50),
    preview_url TEXT
);