```sql
-- DAY 6 ASSIGNMENT
-- School Database Management System

-- 1. CREATE TABLES

-- Students table stores student information.
CREATE TABLE students (
    student_id INTEGER PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
);

-- Courses table stores available courses.
CREATE TABLE courses (
    course_id INTEGER PRIMARY KEY,
    course_name TEXT NOT NULL,
    course_code TEXT NOT NULL UNIQUE
);

-- Enrolments table links students to courses and stores their grades.
CREATE TABLE enrolments (
    enrolment_id INTEGER PRIMARY KEY,
    student_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    grade TEXT,

    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (course_id) REFERENCES courses(course_id),

    UNIQUE (student_id, course_id)
);


-- 2. INSERT SAMPLE DATA

-- Insert at least three students.
INSERT INTO students (student_id, full_name, email)
VALUES
    (1, 'Faith Mutanu', 'faith@example.com'),
    (2, 'Brian Kamau', 'brian@example.com'),
    (3, 'Grace Wanjiku', 'grace@example.com'),
    (4, 'David Mwangi', 'david@example.com');

-- Insert at least three courses.
INSERT INTO courses (course_id, course_name, course_code)
VALUES
    (1, 'Medical Biochemistry', 'MBC101'),
    (2, 'Human Physiology', 'PHY102'),
    (3, 'Medical Microbiology', 'MIC103');

-- Insert at least five enrolments.
INSERT INTO enrolments
    (enrolment_id, student_id, course_id, grade)
VALUES
    (1, 1, 1, 'A'),
    (2, 1, 2, 'B'),
    (3, 2, 1, 'B'),
    (4, 2, 3, 'A'),
    (5, 3, 2, 'A');


-- 3. REQUIRED QUERIES

-- QUERY 1:
-- Find all courses taken by one student using their name.
SELECT
    s.full_name,
    c.course_name,
    c.course_code,
    e.grade
FROM students AS s
JOIN enrolments AS e
    ON s.student_id = e.student_id
JOIN courses AS c
    ON e.course_id = c.course_id
WHERE s.full_name = 'Faith Mutanu';


-- QUERY 2:
-- Find all students enrolled in one course.
SELECT
    c.course_name,
    s.full_name,
    s.email,
    e.grade
FROM courses AS c
JOIN enrolments AS e
    ON c.course_id = e.course_id
JOIN students AS s
    ON e.student_id = s.student_id
WHERE c.course_name = 'Medical Biochemistry';


-- QUERY 3:
-- Count the number of students enrolled in each course.
-- LEFT JOIN includes courses with zero enrolments.
SELECT
    c.course_name,
    COUNT(e.student_id) AS number_of_students
FROM courses AS c
LEFT JOIN enrolments AS e
    ON c.course_id = e.course_id
GROUP BY c.course_id, c.course_name
ORDER BY c.course_name;


-- QUERY 4:
-- Find students who have no enrolments.
SELECT
    s.student_id,
    s.full_name,
    s.email
FROM students AS s
LEFT JOIN enrolments AS e
    ON s.student_id = e.student_id
WHERE e.student_id IS NULL;


-- QUERY 5:
-- Update the grade of one enrolment.
UPDATE enrolments
SET grade = 'A'
WHERE enrolment_id = 2;
```
