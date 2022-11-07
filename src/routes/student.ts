import express from "express";
const router = express.Router();
import * as student from "../controllers/student";

/**
 * @swagger
 * /student:
 *  post:
 *      tags: [FetchInsertStudent]
 *      description: Get Multiple Subjects at once
 *      parameters:
 *      - in: body
 *        name: body
 *        required: true
 *        schema:
 *          type: object
 *          properties:
 *              skip:
 *                  type: number
 *                  example: 0
 *              take:
 *                  type: number
 *                  example: 1
 *      responses:
 *          200:
 *              description: success
 *              content: {}
 */
router.post(
    "/",
    student.GetAllStudent.validator,
    student.GetAllStudent.controller
);

/**
 * @swagger
 * /student/add:
 *  post:
 *      tags: [FetchInsertStudent]
 *      description: Add Student
 *      parameters:
 *      - in: body
 *        name: body
 *        required: true
 *        schema:
 *          type: object
 *          properties:
 *              first_name:
 *                  type: string
 *                  example: "firstname"
 *              last_name:
 *                  type: string
 *                  example: "lastname"
 *              mobile_number:
 *                  type: string
 *                  example: "7893493758"
 *              dob:
 *                  type: date
 *                  example: "1999-04-22"
 *              age:
 *                  type: number
 *                  example: 23
 *              standard:
 *                  type: number
 *                  example: 9
 *              skills:
 *                  type: array
 *                  example: ["hokey", "singing"]
 *              intro:
 *                  type: string
 *                  example: "This is intro about student"
 *              enrolment_from:
 *                  type: date
 *                  example: "1999-04-22"
 *              enrolment_to:
 *                  type: date
 *                  example: "1999-04-22"
 *              status:
 *                  type: string
 *                  example: "LIVE||SUSPENDED"
 *              is_active:
 *                  type: boolean
 *                  example: true
 *              subjects:
 *                  type: array
 *                  example: ["uuid", "uuid"]
 *      responses:
 *          200:
 *              description: success
 *              content: {}
 */
router.post(
    "/add",
    student.AddStudent.validator,
    student.AddStudent.controller
);

/**
 * @swagger
 * /student/update:
 *  put:
 *      tags: [FetchInsertStudent]
 *      description: Update Student and Subjects of that Student
 *      parameters:
 *      - in: body
 *        name: body
 *        required: true
 *        schema:
 *          type: object
 *          properties:
 *              id:
 *                  type: string
 *                  example: "uuid"
 *              first_name:
 *                  type: string
 *                  example: "firstname"
 *              last_name:
 *                  type: string
 *                  example: "lastname"
 *              mobile_number:
 *                  type: string
 *                  example: "7893493758"
 *              dob:
 *                  type: date
 *                  example: "1999-04-22"
 *              age:
 *                  type: number
 *                  example: 23
 *              standard:
 *                  type: number
 *                  example: 9
 *              skills:
 *                  type: array
 *                  example: ["hokey", "singing"]
 *              intro:
 *                  type: string
 *                  example: "This is intro about student"
 *              enrolment_from:
 *                  type: date
 *                  example: "1999-04-22"
 *              enrolment_to:
 *                  type: date
 *                  example: "1999-04-22"
 *              status:
 *                  type: string
 *                  example: "LIVE||SUSPENDED"
 *              is_active:
 *                  type: boolean
 *                  example: true
 *              subjects:
 *                  type: array
 *                  example: ["subject_uuid", "subject_uuid"]
 *      responses:
 *          200:
 *              description: success
 *              content: {}
 */
router.put(
    "/update",
    student.UpdateStudent.validator,
    student.UpdateStudent.controller
);

export default router;
