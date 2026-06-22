CREATE TABLE departments (
    departmentid VARCHAR(20) PRIMARY KEY,
    departmentname VARCHAR(100) NOT NULL UNIQUE,
    establisheddate DATE,
    departmentemail VARCHAR(120) UNIQUE,
    location VARCHAR(120),
    budget NUMERIC(12,2),
    createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE employees (
    emp_id VARCHAR(20) PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    phone VARCHAR(20) UNIQUE,
    date_of_birth DATE,
    hire_date DATE NOT NULL,
    job_title VARCHAR(80),
    department_id VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    zipcode VARCHAR(10),
    address VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_department FOREIGN KEY (department_id) REFERENCES departments(departmentid)
);

CREATE TABLE courses (
    courseid VARCHAR(20) PRIMARY KEY,
    coursename VARCHAR(120) NOT NULL,
    coursecode VARCHAR(30) UNIQUE NOT NULL,
    courselocation VARCHAR(120),
    durationdays INT,
    coursedetails TEXT,
    instructorname VARCHAR(100),
    cost NUMERIC(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE employee_courses (
    enrollment_id SERIAL PRIMARY KEY,
    employee_id VARCHAR(20) NOT NULL,
    courseid VARCHAR(20) NOT NULL,
    enrollment_date DATE DEFAULT CURRENT_DATE,
    completion_status VARCHAR(30) DEFAULT 'ONGOING',
    completion_date DATE,
    score NUMERIC(5,2),
    certificate_issued BOOLEAN DEFAULT FALSE,

    CONSTRAINT fk_employee FOREIGN KEY (employee_id) REFERENCES employees(emp_id),
    CONSTRAINT fk_course FOREIGN KEY (courseid) REFERENCES courses(courseid),
    CONSTRAINT unique_employee_course UNIQUE(employee_id, courseid)
);
