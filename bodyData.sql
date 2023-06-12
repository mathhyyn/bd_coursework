CREATE TABLE body_data (
  id SERIAL PRIMARY KEY,
  user_id_ref INTEGER REFERENCES users(user_id),
  weight FLOAT,
  chest FLOAT,
  waist FLOAT,
  hips FLOAT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

drop table body_data;