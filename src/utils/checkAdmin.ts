import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import APIResponse from "./apiResponse";
import jwt from "jsonwebtoken";
import AppDataSource from "../database/dbRunner";
import { Admin } from "../entity/admin";

interface JwtPayload {
    id: string;
}

export const verifyAdmin = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const token = req.headers.authorization;
    if (!token || typeof token !== "string") {
        return res
            .status(httpStatus.OK)
            .json(new APIResponse({}, "You should login first", false));
    }
    const decodedToken = jwt.verify(
        token,
        process.env.SECRET_KEY
    ) as JwtPayload;
    // console.log("Decoded token",decodedToken, typeof decodedToken);
    // return res.json({docodedToken: decodedToken.id});
    if (!decodedToken.id) {
        return res
            .status(httpStatus.OK)
            .json(new APIResponse({}, "You should login again", false));
    }
    const adminRepo = AppDataSource.getRepository(Admin);
    const foundAdmin = adminRepo.findOne({ where: { id: decodedToken.id } });
    if (!foundAdmin) {
        return res
            .status(httpStatus.OK)
            .json(new APIResponse({}, "You should login again", false));
    }
    return next();
};
