import express from "express";

const router = express.Router();

router.get("/", async (req, res) => {
    let { page = 1, limit = 10 } = req.query;

    // Logic to fetch Departments from the database with pagination will go here

    res.status(200).json({ message: "Departments fetched successfully!" });
})

router.get("/:id", (req, res) => {
    const { id } = req.params;
    console.log(id); // Debugging log

    // Logic to fetch department details from the database will go here

    res.status(200).json({ message: "Department details fetched successfully!" });
})

router.post("/", (req, res) => {
    const { dept_name, established_date, dept_email, location, budget } = req.body;

    console.log("Received department data:", req.body); // Debugging log

    if(!dept_name || !established_date || !dept_email || !location || !budget) {
        return res.status(400).json({ message: "All fields are required." });
    }

    // Regex for the department name to make sure it doesnt contain any numbers
    if(/\d/.test(dept_name)) {
        return res.status(400).json({ message: "Department name should not contain numbers." });
    }

    // Regex for validating email format
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dept_email)) {
        return res.status(400).json({ message: "Invalid email format." });
    }

    const eod = new Date(established_date);
    if(Number.isNaN(eod.getTime()) || eod > new Date()) {
        return res.status(400).json({ message: "Invalid Established Date format." });
    }
    
    // Logic to add department to the database will go here

    res.status(201).json({ message: "Department added successfully!" });
});

router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { dept_name, established_date, dept_email, location, budget } = req.body;

    console.log("Received department update data:", req.body); // Debugging log

    if(!dept_name || !established_date || !dept_email || !location || !budget) {
        return res.status(400).json({ message: "All fields are required." });
    }

    // Regex for the department name to make sure it doesnt contain any numbers
    if(/\d/.test(dept_name)) {
        return res.status(400).json({ message: "Department name should not contain numbers." });
    }

    // Regex for validating email format
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dept_email)) {
        return res.status(400).json({ message: "Invalid email format." });
    }

    const eod = new Date(established_date);
    if(Number.isNaN(eod.getTime()) || eod > new Date()) {
        return res.status(400).json({ message: "Invalid Established Date format." });
    }

    // Logic to update department details in the database will go here

    res.status(200).json({ message: "Department updated successfully!" });
});

router.delete("/:id", (req, res) => {
    const { id } = req.params;
    console.log(id); // Debugging log

    // Logic to delete department from the database will go here

    res.status(200).json({ message: "Department deleted successfully!" });
});

export default router;