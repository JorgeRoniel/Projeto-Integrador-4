ALTER TABLE users_tb
    RENAME COLUMN phone_numer TO phone_number;

ALTER TABLE users_tb
    ALTER COLUMN password TYPE VARCHAR(255);