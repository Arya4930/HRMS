import express from "express";
import "dotenv/config";
import pg from "pg";

import { Pool } from "pg";

const pool = new Pool({
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: "password",
  database: "hrms",
});

const router = express.Router();

async function getEmployeeWithCourses(employeeid) {
    return pool.query(
        `SELECT
            e.*,
            COALESCE(
                json_agg(
                    json_build_object(
                        'enrollment_id', ec.enrollment_id,
                        'employee_id', ec.employee_id,
                        'courseid', c.courseid,
                        'coursename', c.coursename,
                        'coursecode', c.coursecode,
                        'courselocation', c.courselocation,
                        'durationdays', c.durationdays,
                        'coursedetails', c.coursedetails,
                        'instructorname', c.instructorname,
                        'cost', c.cost,
                        'enrollment_date', ec.enrollment_date,
                        'completion_status', ec.completion_status,
                        'completion_date', ec.completion_date,
                        'score', ec.score,
                        'certificate_issued', ec.certificate_issued
                    )
                    ORDER BY ec.enrollment_date DESC
                ) FILTER (WHERE ec.enrollment_id IS NOT NULL),
                '[]'::json
            ) AS courses
         FROM employees e
         LEFT JOIN employee_courses ec ON ec.employee_id = e.emp_id
         LEFT JOIN courses c ON c.courseid = ec.courseid
         WHERE e.emp_id = $1
         GROUP BY e.emp_id`,
        [employeeid]
    );
}

function validateEnrollmentPayload({
    courseid,
    enrollment_date,
    completion_status,
    completion_date,
    score
}) {
    if(!courseid || !enrollment_date || !completion_status) {
        return "Course ID, enrollment date, and completion status are required.";
    }

    const enrollmentDate = new Date(enrollment_date);
    if(Number.isNaN(enrollmentDate.getTime())) {
        return "Invalid enrollment date format.";
    }

    if(completion_date) {
        const completionDate = new Date(completion_date);
        if(Number.isNaN(completionDate.getTime())) {
            return "Invalid completion date format.";
        }
    }

    if(completion_status === "COMPLETED" && !completion_date) {
        return "Completion date is required when status is COMPLETED.";
    }

    if(score !== undefined && score !== null && score !== "" && Number.isNaN(Number(score))) {
        return "Score must be a number.";
    }

    return null;
}

router.get("/", async (req, res) => {
    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const offset = (page - 1) * limit;

    try {
        const result = await pool.query(
            "SELECT * FROM employees ORDER BY emp_id LIMIT $1 OFFSET $2",
            [limit, offset]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching employees:", error);
        res.status(500).json({ message: "Internal server error." });
    }
})

router.get("/:id", async (req, res) => {
    const { id } = req.params;
    console.log(id); // Debugging log

    try {
        const result = await getEmployeeWithCourses(id);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Employee not found." });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error("Error fetching employee:", error);
        res.status(500).json({ message: "Internal server error." });
    }
})

router.post("/", async (req, res) => {
    const { emp_id, first_name, last_name, email, phone, date_of_birth, hire_date, job_title, department_id, status, zipcode, address } = req.body;

    console.log("Received employee data:", req.body); // Debugging log

    if(!emp_id || !first_name || !last_name || !email || !phone || !date_of_birth || !hire_date || !job_title || !department_id || !status) {
        return res.status(400).json({ message: "All fields are required." });
    }

    // Regex for the employee First and Last name to make sure it doesnt contain any numbers
    if(/\d/.test(first_name) || /\d/.test(last_name)) {
        return res.status(400).json({ message: "First name and last name should not contain numbers." });
    }

    // Regex for validating email format
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ message: "Invalid email format." });
    }

    if(!/^\d{10}$/.test(phone)) {
        return res.status(400).json({ message: "Phone number should be 10 digits." });
    }

    const dob = new Date(date_of_birth);
    if(Number.isNaN(dob.getTime()) || dob >= new Date()) {
        return res.status(400).json({ message: "Invalid Birth Date format." });
    }

    const hod = new Date(hire_date);
    if(Number.isNaN(hod.getTime()) || hod > new Date()) {
        return res.status(400).json({ message: "Invalid Hiring Date format." });
    }

    try {
        const result = await pool.query(
            `INSERT INTO employees (emp_id, first_name, last_name, email, phone, date_of_birth, hire_date, job_title, department_id, status, zipcode, address)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
            [emp_id, first_name, last_name, email, phone, date_of_birth, hire_date, job_title, department_id, status, zipcode, address]
        );

        res.status(201).json({ message: "Employee added successfully!", employee: result.rows[0] });
    } catch (error) {
        console.error("Error adding employee:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});

router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { emp_id, first_name, last_name, email, phone, date_of_birth, hire_date, job_title, department_id, status, zipcode, address } = req.body;

    console.log("Received employee update data:", req.body); // Debugging log

    if(!emp_id || !first_name || !last_name || !email || !phone || !date_of_birth || !hire_date || !job_title || !department_id || !status || !address) {
        return res.status(400).json({ message: "All fields are required." });
    }

    // Regex for the employee First and Last name to make sure it doesnt contain any numbers
    if(/\d/.test(first_name) || /\d/.test(last_name)) {
        return res.status(400).json({ message: "First name and last name should not contain numbers." });
    }

    // Regex for validating email format
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ message: "Invalid email format." });
    }

    if(!/^\d{10}$/.test(phone)) {
        return res.status(400).json({ message: "Phone number should be 10 digits." });
    }

    const dob = new Date(date_of_birth);
    if(Number.isNaN(dob.getTime()) || dob >= new Date()) {
        return res.status(400).json({ message: "Invalid Birth Date format." });
    }

    const hod = new Date(hire_date);
    if(Number.isNaN(hod.getTime()) || hod > new Date()) {
        return res.status(400).json({ message: "Invalid Hiring Date format." });
    }

    try {
        const result = await pool.query(
            `UPDATE employees
             SET first_name = $1, last_name = $2, email = $3, phone = $4,
                 date_of_birth = $5, hire_date = $6, job_title = $7, department_id = $8, status = $9,
                 zipcode = $10, address = $11
             WHERE emp_id = $12 RETURNING *`,
            [first_name, last_name, email, phone, date_of_birth, hire_date, job_title, department_id, status, zipcode, address, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Employee not found." });
        }

        res.status(200).json({ message: "Employee updated successfully!", employee: result.rows[0] });
    } catch (error) {
        console.error("Error updating employee:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});

router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    console.log(id); // Debugging log

    try {
        const result = await pool.query(
            "DELETE FROM employees WHERE emp_id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Employee not found." });
        }

        res.status(200).json({ message: "Employee deleted successfully!" });
    } catch (error) {
        console.error("Error deleting employee:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});

router.post("/addCourse/:id", async (req, res) => {
    const { id } = req.params;
    const {
        courseid,
        enrollment_date,
        completion_status,
        completion_date,
        score,
        certificate_issued
    } = req.body;

    console.log(`Adding course ${courseid} to employee ${id}`); // Debugging log

    const validationError = validateEnrollmentPayload(req.body);
    if(validationError) {
        return res.status(400).json({ message: validationError });
    }

    try {
        await pool.query(
            `INSERT INTO employee_courses (
                employee_id,
                courseid,
                enrollment_date,
                completion_status,
                completion_date,
                score,
                certificate_issued
             )
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [
                id,
                courseid,
                enrollment_date,
                completion_status,
                completion_date || null,
                score === "" || score === undefined ? null : score,
                Boolean(certificate_issued)
            ]
        );

        const employeeResult = await getEmployeeWithCourses(id);

        res.status(200).json({
            message: "Course added to employee successfully!",
            employee: employeeResult.rows[0]
        });
    } catch (error) {
        console.error("Error adding course to employee:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});

router.put("/:id/course/:enrollmentId", async (req, res) => {
    const { id, enrollmentId } = req.params;
    const {
        courseid,
        enrollment_date,
        completion_status,
        completion_date,
        score,
        certificate_issued
    } = req.body;

    const validationError = validateEnrollmentPayload(req.body);
    if(validationError) {
        return res.status(400).json({ message: validationError });
    }

    try {
        const result = await pool.query(
            `UPDATE employee_courses
             SET courseid = $1,
                 enrollment_date = $2,
                 completion_status = $3,
                 completion_date = $4,
                 score = $5,
                 certificate_issued = $6
             WHERE enrollment_id = $7 AND employee_id = $8
             RETURNING *`,
            [
                courseid,
                enrollment_date,
                completion_status,
                completion_date || null,
                score === "" || score === undefined ? null : score,
                Boolean(certificate_issued),
                enrollmentId,
                id
            ]
        );

        if(result.rows.length === 0) {
            return res.status(404).json({ message: "Employee course enrollment not found." });
        }

        const employeeResult = await getEmployeeWithCourses(id);

        res.status(200).json({
            message: "Course enrollment updated successfully!",
            employee: employeeResult.rows[0]
        });
    } catch (error) {
        console.error("Error updating employee course:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});

router.delete("/:id/course/:enrollmentId", async (req, res) => {
    const { id, enrollmentId } = req.params;

    try {
        const result = await pool.query(
            `DELETE FROM employee_courses
             WHERE enrollment_id = $1 AND employee_id = $2
             RETURNING *`,
            [enrollmentId, id]
        );

        if(result.rows.length === 0) {
            return res.status(404).json({ message: "Employee course enrollment not found." });
        }

        const employeeResult = await getEmployeeWithCourses(id);

        res.status(200).json({
            message: "Course enrollment removed successfully!",
            employee: employeeResult.rows[0]
        });
    } catch (error) {
        console.error("Error removing employee course:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});

export default router;
