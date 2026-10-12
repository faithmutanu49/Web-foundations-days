# School Database Design

## 1. Tables and Their Purpose

### Students Table

The students table stores information about students in the school. It contains the student's ID, full name and email address. The student ID is the primary key, while the email address is unique to prevent duplicate student accounts. The student's name and email are required fields.

### Courses Table

The courses table stores information about the courses offered by the school. It contains the course ID, course name and course code. The course ID is the primary key, and the course code is unique so that every course can be identified by its own code.

### Enrolments Table

The enrolments table records which students are enrolled in which courses. It contains an enrolment ID, student ID, course ID and grade. The student ID and course ID are foreign keys referencing the students and courses tables, respectively. The combination of student ID and course ID is unique, preventing a student from enrolling in the same course more than once. The grade is stored in this table because it may differ for each student in each course.

## 2. Relationships Between the Tables

### One-to-Many Relationships

The relationship between students and enrolments is one-to-many. One student can have multiple enrolment records because they can take several courses. However, each enrolment record belongs to one student.

The relationship between courses and enrolments is also one-to-many. One course can have multiple enrolment records because many students can take the same course. However, each enrolment record refers to one course.

### Many-to-Many Relationship

Students and courses have a many-to-many relationship. A student can enrol in several courses, and each course can have several students.

The enrolments table acts as a join table between students and courses. It is necessary because a many-to-many relationship cannot be represented properly using a single foreign key in either the students table or the courses table. The join table also stores additional information about the relationship, such as the student's grade in a particular course.

## 3. Index Recommendation

I would add an index on the `enrolments.course_id` column to improve queries that retrieve all students enrolled in a particular course. This index can also help when counting the number of students enrolled in each course. The unique constraint on `(student_id, course_id)` already creates an index that begins with `student_id`, so a separate index on `enrolments.student_id` may be unnecessary for this design.

The index can be created using the following SQL statement:

```sql
CREATE INDEX idx_enrolments_course_id
ON enrolments(course_id);
```

## 4. Choosing SQL or NoSQL

I would choose a relational SQL database such as SQLite for this school management system. The information has a clear structure, with students, courses and enrolments connected through primary and foreign keys. SQL supports joins, grouping, counting and updates, making it suitable for retrieving course information, identifying students without enrolments and managing grades. Constraints also help maintain data accuracy by preventing duplicate email addresses and duplicate enrolments. Although a NoSQL database can be useful for flexible or rapidly changing data structures, a relational SQL database is more appropriate for this system because the data is structured and the relationships between the entities are important.

```

```
