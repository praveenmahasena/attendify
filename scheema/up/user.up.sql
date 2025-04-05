CREATE TYPE ROLE AS ENUM('admin','teacher','student');

CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role ROLE NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

INSERT INTO users(name,email,password,role,created_at,updated_at)VALUES('me@me.com','me@me.com','$2b$10$Z9v6X7u8w9YzA1b2c3d4eOXPqRstUvWxYzABCD1234567890abcdef','admin','2023-10-15','2023-10-15')
