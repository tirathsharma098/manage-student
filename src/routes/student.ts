import express from "express";
const router = express.Router();
import * as student from '../controllers/student';

/**
 * @swagger
 * 
 */
router.post("/add", student.AddStudent.validator, student.AddStudent.controller);

export default router;