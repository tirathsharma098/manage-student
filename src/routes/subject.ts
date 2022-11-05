import express, { NextFunction, Request, Response } from "express";
const router = express.Router();
import * as subject from "../controllers/subject";

/**
 * @swagger
 * /subject/add:
 *  post:
 *      tags: [FetchInsertSubjects]
 *      description: Add Multiple Subjects at once
 *      parameters:
 *      - in: body
 *        name: body
 *        required: true
 *        schema:
 *          type: object
 *          properties:
 *              subjects:
 *                  type: array
 *                  example: ["math", "hindi"]
 *      responses:
 *          200:
 *              description: success
 *              content: {}
 */
router.post(
    "/add",
    subject.AddSubjects.validator,
    subject.AddSubjects.controller
);
export default router;
