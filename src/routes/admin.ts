import express from "express";
const router = express.Router();
import * as admin from "../controllers/admin";

/**
 * @swagger
 * /admin/login:
 *  post:
 *      tags: [AdminSpace]
 *      description: Login as admin to manage all students
 *      parameters:
 *      - in: body
 *        name: body
 *        required: true
 *        schema:
 *          type: object
 *          properties:
 *              username:
 *                  type: string
 *                  example: user0123
 *              password:
 *                  type: string
 *                  example: password@123
 *      responses:
 *          200:
 *              description: success
 *              content: {}
 */
router.post("/login", admin.AdminLogin.validator, admin.AdminLogin.controller);

export default router;
