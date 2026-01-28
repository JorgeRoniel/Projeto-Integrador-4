CREATE TABLE wishlist (
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    notification BOOLEAN DEFAULT FALSE,

    PRIMARY KEY (user_id, book_id),
    FOREIGN KEY (user_id) REFERENCES users_tb(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books_tb(id) ON DELETE CASCADE
);