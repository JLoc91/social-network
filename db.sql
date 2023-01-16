CREATE TABLE social_users (
     id SERIAL PRIMARY KEY,
     first VARCHAR NOT NULL CHECK (first != ''),
     last VARCHAR NOT NULL CHECK (last != ''),
     email VARCHAR NOT NULL CHECK (email != '') unique,
     password VARCHAR NOT NULL CHECK (password != ''),
     image VARCHAR,
     bio VARCHAR,
     timestamp timestamp default current_timestamp
);

CREATE TABLE social_reset_codes(
    id SERIAL PRIMARY KEY,
    email VARCHAR NOT NULL,
    code VARCHAR NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

CREATE TABLE social_friendships(
    id SERIAL PRIMARY KEY,
    sender_id INTEGER NOT NULL references users(id),
    recipient_id INTEGER NOT NULL references users(id),
    accepted BOOLEAN NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

CREATE TABLE social_chat_messages(
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL references users(id),
    message VARCHAR NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );


ALTER TABLE social_users
ADD image VARCHAR;

ALTER TABLE social_users
ADD bio VARCHAR;

  ALTER TABLE users
  DROP COLUMN online;