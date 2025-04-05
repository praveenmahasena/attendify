# Attendify

Attendify is a web-based attendance management system designed for schools, colleges, or any educational institution. The app provides role-based access for admins , teachers , and students to manage classes, mark attendance, view reports, and update personal profiles.

## Features

### Admin
 - Manage users (teachers and students).
 - Create, update, and delete classes.
 - View attendance trends and generate reports.
 - Export attendance data as CSV.

### Teacher
 - View assigned classes.
 - Mark attendance for their classes.
 - Generate and view attendance reports for their classes.

### Student
 - View personal profile and update details.
 - View attendance history and statistics.

## Tech Stack
 - Frontend : React.js, React Router, Axios, Tailwind CSS (or Bootstrap).
 - Backend : Node.js, Express.js, PostgreSQL (or any relational database).
 - Authentication : JWT (JSON Web Tokens) for secure authentication.

## Admin Routes

| Method |  Endpoint                 | Description                                                   |
|:-------|:--------------------------|:--------------------------------------------------------------|
| GET    | /api/admin/dashboard      | Fetches admin dashboard metrics (total users, classes, etc.). |
| GET    | /api/admin/users          | Fetches all users (teachers and students).                    |
| GET    | /api/admin/classes        | Fetches all classes.                                          |
| GET    | /api/admin/reports/trends | Fetches attendance trends over time (daily/weekly/monthly).   |
| GET    | /api/admin/reports/export | Exports attendance reports as CSV.                            |


## Teacher Routes

| Method |  Endpoint                              | Description                                          |
|:-------|:---------------------------------------|:-----------------------------------------------------|
| GET    | /api/teacher/dashboard                 | Fetches teacher dashboard metrics.                   |
| GET    | /api/teacher/classes                   | Fetches all classes assigned to the teacher.         |
| GET    | /api/teacher/attendance/:classId       | Fetches attendance records for a specific class..    |
| POST   | /api/teacher/attendance/:classId       | Saves attendance records for a specific class.       |
| GET    | /api/teacher/reports/trends            | Fetches attendance trends for the teacher's classes. |
| GET    | /api/teacher/reports/class-performance | Fetches attendance rates for each class.             |
| GET    | /api/teacher/reports/export            | Exports attendance reports as CSV.                   |



## Student Routes

| Method |  Endpoint                          | Description                                              |
|:-------|:-----------------------------------|:---------------------------------------------------------|
| GET    | /api/student/profile/:studentId    | Fetches the student's profile information.               |
| PUT    | /api/student/profile/:studentId    | Updates the student's profile information.               |
| GET    | /api/student/dashboard             | Fetches the student's attendance history and statistics. |
| GET    | /api/student/attendance/:studentId | Fetches the student's attendance history.                |

## Frontend Routes

| Route |  ROLE                          | Description                                              |
|:-------|:----------------------------------:|---------------------------------------------------------:|
| /    | /api/student/profile/:studentId    | Fetches the student's profile information.               |
| /login    | /api/student/profile/:studentId    |  Updates the student's profile information.              |
| /signup    | /api/student/dashboard             | Fetches the student's attendance history and statistics. |
| /admin/dashboard    | /api/student/attendance/:studentId | Fetches the student's attendance history.                |
| /admin/users     | /api/student/attendance/:studentId | Fetches the student's attendance history.                |
| /admin/classes    | /api/student/attendance/:studentId | Fetches the student's attendance history.                |
| GET    | /api/student/attendance/:studentId | Fetches the student's attendance history.                |
| GET    | /api/student/attendance/:studentId | Fetches the student's attendance history.                |
| GET    | /api/student/attendance/:studentId | Fetches the student's attendance history.                |
| GET    | /api/student/attendance/:studentId | Fetches the student's attendance history.                |
| GET    | /api/student/attendance/:studentId | Fetches the student's attendance history.                |
| GET    | /api/student/attendance/:studentId | Fetches the student's attendance history.                |
| GET    | /api/student/attendance/:studentId | Fetches the student's attendance history.                |
| GET    | /api/student/attendance/:studentId | Fetches the student's attendance history.                |
| GET    | /api/student/attendance/:studentId | Fetches the student's attendance history.                |
| GET    | /api/student/attendance/:studentId | Fetches the student's attendance history.                |
| GET    | /api/student/attendance/:studentId | Fetches the student's attendance history.                |
| GET    | /api/student/attendance/:studentId | Fetches the student's attendance history.                |
| GET    | /api/student/attendance/:studentId | Fetches the student's attendance history.                |
| GET    | /api/student/attendance/:studentId | Fetches the student's attendance history.                |
| GET    | /api/student/attendance/:studentId | Fetches the student's attendance history.                |
| GET    | /api/student/attendance/:studentId | Fetches the student's attendance history.                |

