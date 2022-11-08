import { celebrate, Joi } from "celebrate";
import { Request, Response } from "express";
import httpStatus from "http-status";
import AppDataSource from "../database/dbRunner";
import { Admin } from "../entity/admin";
import APIResponse from "../utils/apiResponse";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const AdminLogin = {
    validator: celebrate({
        body: Joi.object().keys({
            username: Joi.string().min(3).max(50).required(),
            password: Joi.string().min(1).max(30).required(),
        }),
    }),
    controller: async (req: Request, res: Response) => {
        try {
            const { username, password } = req.body;
            const adminRepo = AppDataSource.getRepository(Admin);
            const foundAdmin = await adminRepo.findOne({
                where: { username: username },
            });
            if (!foundAdmin) throw new Error("Admin does not exist");
            const isMatched = await bcrypt.compare(
                password,
                foundAdmin.password
            );
            if (!isMatched)
                return res
                    .status(httpStatus.OK)
                    .json(
                        new APIResponse(
                            {},
                            "Username or Password is incorrect",
                            false
                        )
                    );
            const tokenGenerated = jwt.sign(
                { id: foundAdmin.id },
                process.env.SECRET_KEY
            );
            console.log(">> Token generated: ", tokenGenerated);
            return res
                .status(httpStatus.OK)
                .json(
                    new APIResponse(
                        { admin: foundAdmin.username, token: tokenGenerated },
                        "Admin Got Successfuly",
                        true
                    )
                );
        } catch (err) {
            console.log(">> ERROR OCCURED WHILE LOGIN ADMIN", err);
            return res
                .status(httpStatus.BAD_REQUEST)
                .json(
                    new APIResponse(
                        {},
                        "Error Occured while login admin",
                        false
                    )
                );
        }
    },
};
