import { celebrate, Joi } from "celebrate";
import { Request, Response } from "express";
import APIResponse from "../utils/apiResponse";
import httpStatus from "http-status";
// array().items(Joi.string().max(100)).required()
const subjectJoi = Joi.extend({
    type: "array",
    base: Joi.array(),
    coerce: {
        from: "string",
        method(value, helpers) {
            if (
                typeof value !== "string" ||
                (value[0] !== "[" && !/^\s*\[/.test(value))
            ) {
                return;
            }
            try {
                console.log("subject parsing executed");
                return { value: JSON.parse(value) };
            } catch (err) {
                return;
            }
        },
    },
});
export const AddSubjects = {
    validator: celebrate({
        body: Joi.object().keys({
            subjects: subjectJoi.array().items(Joi.string()),
        }),
    }),
    controller: async (req: Request, res: Response) => {
        const { subjects } = req.body;
        console.log("subject received: ", subjects);
        return res
            .status(httpStatus.OK)
            .json(new APIResponse({}, "Subjects got Successfully", true));
    },
};
