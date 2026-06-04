import express from "express";

const router = express.Router();

// All DB routes to be added here later
router.get("/test", (req, res) => {
    res.status(200).json({ message: "Test route is working!" });
});

export default router;