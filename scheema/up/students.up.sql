CREATE TABLE IF NOT EXISTS students(
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  class_id INT REFERENCES classes(id)
);
