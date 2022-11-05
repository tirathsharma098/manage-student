import { celebrate, Joi } from "celebrate";
import { Request, Response } from "express";
import APIResponse from "../utils/apiResponse";
import httpStatus from "http-status";

export const AddSubjects = {
    validator: celebrate({
        body: Joi.object().keys({
            subjects: Joi.array().items(Joi.string()).required(),
        }),
    }),
    controller: async (req: Request, res: Response) => {
        const { subjects } = req.body;
        console.log("subject received: ", subjects);
        return res
            .status(httpStatus.OK)
            .json(new APIResponse({subjects}, "Subjects got Successfully", true));
    },
};
