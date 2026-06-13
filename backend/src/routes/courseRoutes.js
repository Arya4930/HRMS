import express from "express";

const router = express.Router();

router.get("/", async (req, res) => {
    let { page = 1, limit = 10 } = req.query;

    // Logic to fetch courses from the database with pagination will go here

    res.status(200).json({ message: "Courses fetched successfully!" });
})

router.get("/:id", (req, res) => {
    const { id } = req.params;
    console.log(id); // Debugging log

    // Logic to fetch course details from the database will go here

    res.status(200).json({ message: "Course details fetched successfully!" });
})

router.post("/", (req, res) => {
    const { name, code, location, duration, details, instructor, cost } = req.body;

    console.log("Received course data:", req.body); // Debugging log

    if(!name || !code || !location || !duration || !details || !instructor || !cost) {
        return res.status(400).json({ message: "All fields are required." });
    }

    // Logic to add course to the database will go here

    res.status(201).json({ message: "Course added successfully!" });
});

router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { name, code, location, duration, details, instructor, cost } = req.body;

    console.log("Received course update data:", req.body); // Debugging log

    if(!name || !code || !location || !duration || !details || !instructor || !cost) {
        return res.status(400).json({ message: "All fields are required." });
    }

    // Logic to update course details in the database will go here

    res.status(200).json({ message: "Course updated successfully!" });
});

router.delete("/:id", (req, res) => {
    const { id } = req.params;
    console.log(id); // Debugging log

    // Logic to delete course from the database will go here

    res.status(200).json({ message: "Course deleted successfully!" });
});

export default router;