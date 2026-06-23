# HRMS

HRMS is a full-stack employee management system for managing departments, employees, courses, and course enrollments completed by employees.

## Project Structure

```text
backend/
  src/
    lib/schema.sql
    lib/models/user.js
    routes/
    middleware.js
    server.js
  init_db.js

frontend/
  src/
    pages/
    components/
    api.js
```

## Database

The PostgreSQL database name expected by the backend is `hrms`.

The schema is defined in:

```text
backend/src/lib/schema.sql
```

It creates tables for:

- `users`
- `departments`
- `employees`
- `courses`
- `employee_courses`

Run the schema with:

```bash
cd backend
node init_db.js
```

Column names are intentionally lowercase or snake_case because PostgreSQL folds unquoted identifiers to lowercase.

## Authentication

Users log in with email and password through:

```text
POST /api/login
```

Protected frontend pages verify the saved token through:

```text
GET /api/me
```

Admins can create new admins from the dashboard page:

```text
/register-admin
```

That page calls:

```text
POST /api/register
```

`/api/register` is protected and requires a valid auth token.

## Running Locally

Install dependencies separately for backend and frontend:

```bash
cd backend
npm install
npm run dev
```

```bash
cd frontend
npm install
npm run dev
```

## API Endpoints
### Employee Routes

| Method | Endpoint             | Description                       |
| ------ | -------------------- | --------------------------------- |
| GET    | `/api/employees`     | Fetch paginated list of employees |
| GET    | `/api/employees/:id` | Fetch employee details by ID      |
| POST   | `/api/employees`     | Create a new employee             |
| PUT    | `/api/employees/:id` | Update employee details           |
| DELETE | `/api/employees/:id` | Delete an employee                |

### Department Routes

| Method | Endpoint              | Description                         |
| ------ | --------------------- | ----------------------------------- |
| GET    | `/api/department`     | Fetch paginated list of departments |
| GET    | `/api/department/:id` | Fetch department details by ID      |
| POST   | `/api/department`     | Create a new department             |
| PUT    | `/api/department/:id` | Update department details           |
| DELETE | `/api/department/:id` | Delete a department                 |

### Course Routes

| Method | Endpoint          | Description                     |
| ------ | ----------------- | ------------------------------- |
| GET    | `/api/course`     | Fetch paginated list of courses |
| GET    | `/api/course/:id` | Fetch course details by ID      |
| POST   | `/api/course`     | Create a new course             |
| PUT    | `/api/course/:id` | Update course details           |
| DELETE | `/api/course/:id` | Delete a course                 |

## Frontend Pages

| Route | Description |
| ----- | ----------- |
| `/` | Login page |
| `/dashboard` | Dashboard and recent searches |
| `/employees` | Employee list |
| `/add-employee` | Add employee |
| `/edit-employee/:id` | Edit employee |
| `/employee-profile/:id` | View employee profile and course enrollments |
| `/departments` | Manage departments |
| `/courses` | Manage courses |
| `/register-admin` | Register a new admin |

All pages except login are protected by authentication.

## Authors

[![Arya Panwar](https://img.shields.io/badge/Arya4930-000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Arya4930)
[![Manvendra Singh Bisht](https://img.shields.io/badge/Manvendra775-000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Manvendra775)
[![Aryaman Saraswat](https://img.shields.io/badge/AryamanSaraswat2004-000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Aryaman-Saraswat2004)
