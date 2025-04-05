# Attendify

Attendify is a web-based MVP for attendance management system designed for schools, colleges, or any educational institution. The app provides role-based access for admins , teachers , and students to manage classes, mark attendance, view reports, and update personal profiles.

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

| Route                          |  ROLE   | Description                                 |
|:-------------------------------|:--------|:--------------------------------------------|
| /                              | Public  | Homepage (Landing page with login/signup).  |
| /login                         | Public  | Login page for all users.                   |
| /signup                        | Public  | Signup page for new users (optional).       |
| /admin/dashboard               | Admin   | Admin dashboard landing page.               |
| /admin/users                   | Admin   | List of all users (teachers and students).  |
| /admin/classes                 | Admin   | List of all classes.                        |
| /admin/reports                 | Admin   | Attendance reports for admins.              |
| /teacher/dashboard             | Teacher | Teacher dashboard landing page.             |
| /teacher/classes               | Teacher | List of classes assigned to the teacher.    |
| /teacher/attendance/:classId   | Teacher | Mark attendance for a specific class.       |
| /teacher/reports               | Teacher | Attendance reports for teachers.            |
| /student/dashboard             | Student | Student dashboard showing attendance stats. |
| /student/profile/:studentId    | Student | Student profile page (view/edit details).   |
| /student/attendance/:studentId | Student | Student attendance history.                 |

## Setup Instructions
 - Install [Node.js](https://nodejs.org) and npm.
 - Install [PostgreSQL](https://www.postgresql.org/download/).
 - Install [Git](https://git-scm.com/).

## Clone the Repository


## Backend Setup

 1. ### Clone repo

    ```bash
    git clone https://github.com/praveenmahasena/chat_auth.git
    ```

 2. ### Change working dir

    ```bash
    cd /server
    ```

 3. ### Install dependency

    ```bash
    npm install
    ```

 4. ### Migrate DB
    use [psqltool](https://github.com/praveenmahasena/sqltool/d) to do migration

 5. ### Config
    These properties goes into .env file

    ```bash
        PORT=
        DB_NAME=
        DB_USR=
        DB_HOST=
        DB_PASSWORD=
        DB_PORT=
        DB_SSL=
        JWT_KEY=

    ```

 6. Start the backend in development mode server

    ```bash
        npm run dev
    ```

 7. Start the backend in prod mode server

    ```bash
        npm run prod
    ```

## Frontend Setup

   1. ### Change working dir

      ```bash
      cd /client
      ```

   2. ### Install dependency

      ```bash
      npm install
      ```

   3. ### build

      ```bash
      npm run build
      ```

## Upcoming features
 - Proper authentication with cookies and JWT
 - Email validation via OTP

## Upcoming dev features
 - TypeScript intergration for backend
 - Alternative Golang server
 - Protected routes

# This is a MVP for attendance software
