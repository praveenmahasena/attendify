CREATE TYPE STATUS AS ENUM ('present','absent','late');

CREATE TABLE IF NOT EXISTS attendance(
  id SERIAL PRIMARY KEY,
  student_id INT REFERENCES Users(id),
  class_id INT REFERENCES Classes(id),
  date DATE NOT NULL,
  status VARCHAR(50) NOT NULL -- 'present', 'absent', 'late'
);
