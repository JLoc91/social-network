CREATE TABLE users (
     id SERIAL PRIMARY KEY,
     first VARCHAR NOT NULL CHECK (first != ''),
     last VARCHAR NOT NULL CHECK (last != ''),
     email VARCHAR NOT NULL CHECK (email != '') unique,
     password VARCHAR NOT NULL CHECK (password != ''),
     timestamp timestamp default current_timestamp
);