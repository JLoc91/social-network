CREATE TABLE users (
     id SERIAL PRIMARY KEY,
     first VARCHAR NOT NULL CHECK (first != ''),
     last VARCHAR NOT NULL CHECK (last != ''),
     email VARCHAR NOT NULL CHECK (email != '') unique,
     password VARCHAR NOT NULL CHECK (password != ''),
     timestamp timestamp default current_timestamp
);

CREATE TABLE reset_codes(
    id SERIAL PRIMARY KEY,
    email VARCHAR NOT NULL,
    code VARCHAR NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

CREATE TABLE friendships(
    id SERIAL PRIMARY KEY,
    sender_id INTEGER NOT NULL references users(id),
    recipient_id INTEGER NOT NULL references users(id),
    accepted BOOLEAN NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

CREATE TABLE chat_messages(
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL references users(id),
    message VARCHAR NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );


  select chat_messages.id, chat_messages.user_id, message, chat_messages.timestamp from chat_messages join users on (ch
at_messages.user_id = users.id);