CREATE TABLE book_ratings (
    user_id INT NOT NULL,
    book_id INT NOT NULL,

    rating INT CHECK (rating BETWEEN 0 AND 5),
    review VARCHAR(255),
    date_review DATE,

    PRIMARY KEY (user_id, book_id),
    FOREIGN KEY (user_id) REFERENCES users_tb(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books_tb(id) ON DELETE CASCADE
);