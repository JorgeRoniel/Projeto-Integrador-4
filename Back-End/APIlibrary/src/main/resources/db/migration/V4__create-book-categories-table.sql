CREATE TABLE book_categories (
     id INT NOT NULL,
     category VARCHAR(100) NOT NULL,

     PRIMARY KEY (id, category),
     FOREIGN KEY (id) REFERENCES books_tb(id) ON DELETE CASCADE
);