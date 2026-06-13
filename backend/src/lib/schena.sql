CREATE TABLE departments (
    department_id SERIAL PRIMARY KEY,
    department_name VARCHAR(100) NOT NULL UNIQUE,
    established_date DATE,
    department_email VARCHAR(120) UNIQUE,
    location VARCHAR(120),
    budget NUMERIC(12,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE employees (
    employee_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    phone_number VARCHAR(20) UNIQUE,
    date_of_birth DATE,
    hire_date DATE NOT NULL,
    salary NUMERIC(10,2),
    job_title VARCHAR(80),
    department_id INT NOT NULL,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_department FOREIGN KEY (department_id) REFERENCES departments(department_id)
);

CREATE TABLE courses (
    course_id SERIAL PRIMARY KEY,
    course_name VARCHAR(120) NOT NULL,
    course_code VARCHAR(30) UNIQUE NOT NULL,
    course_location VARCHAR(120),
    duration_days INT,
    course_details TEXT,
    instructor_name VARCHAR(100),
    cost NUMERIC(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE employee_courses (
    enrollment_id SERIAL PRIMARY KEY,
    employee_id INT NOT NULL,
    course_id INT NOT NULL,
    enrollment_date DATE DEFAULT CURRENT_DATE,
    completion_status VARCHAR(30) DEFAULT 'ONGOING',
    completion_date DATE,
    score NUMERIC(5,2),
    certificate_issued BOOLEAN DEFAULT FALSE,

    CONSTRAINT fk_employee FOREIGN KEY (employee_id) REFERENCES employees(employee_id),
    CONSTRAINT fk_course FOREIGN KEY (course_id) REFERENCES courses(course_id),
    CONSTRAINT unique_employee_course UNIQUE(employee_id, course_id)
);