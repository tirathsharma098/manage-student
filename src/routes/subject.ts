import express, { NextFunction, Request, Response } from "express";
const router = express.Router();
import * as subject from "../controllers/subject";
/**
 * @swagger
 *
 */

router.post(
    "/add",
    subject.AddSubjects.validator,
    subject.AddSubjects.controller
);
export default router;
