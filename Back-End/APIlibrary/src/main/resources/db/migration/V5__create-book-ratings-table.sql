CREATE TABLE book_ratings (
    user_id INT NOT NULL,
    book_id INT NOT NULL,

    rating INT CHECK (rating = -1 OR rating BETWEEN 0 AND 5),
    review TEXT,
    date_review TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (user_id, book_id),
    FOREIGN KEY (user_id) REFERENCES users_tb(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books_tb(id) ON DELETE CASCADE
);