import { celebrate, Joi } from "celebrate";
import { Request, Response } from "express";
import APIResponse from "../utils/apiResponse";
import httpStatus from "http-status";
import { AppDataSource } from "../..";
import { Subject } from "../entity/subject";

export const GetSubject = {
    controller: async (req: Request, res: Response) => {
        try {
            const subjectRepo = AppDataSource.getRepository(Subject);
            const allSubjects = await subjectRepo.find({
                select: {
                    id: true,
                    subject: true,
                },
            });
            if (!allSubjects) {
            }
            return res
                .status(httpStatus.OK)
                .json(
                    new APIResponse(
                        allSubjects,
                        "Subjects got Successfully",
                        true
                    )
                );
        } catch (err) {
            console.log(">> ERROR OCCURED WHILE Getting SUBJECTS: ", err);
            return res
                .status(httpStatus.BAD_REQUEST)
                .json(
                    new APIResponse(
                        {},
                        "Error Occured while getting Subjects",
                        false
                    )
                );
        }
    },
};

export const AddSubjects = {
    validator: celebrate({
        body: Joi.object().keys({
            subjects: Joi.array()
                .items(Joi.string().max(100).required())
                .required(),
        }),
    }),
    controller: async (req: Request, res: Response) => {
        try {
            const { subjects } = req.body;
            console.log("subject received: ", subjects);
            const subjectRepo = AppDataSource.getRepository(Subject);
            const subjectToInsert: Subject[] = [];
            await Promise.all(
                subjects.map(async (subj: any) => {
                    const newDbSubject = await subjectRepo
                        .createQueryBuilder()
                        .where("LOWER(subject) LIKE LOWER(:subject) ", {
                            subject: subj,
                        })
                        .getOne();
                    const currSubject: any = { subject: subj };
                    if (!newDbSubject) subjectToInsert.push(currSubject);
                })
            );
            console.log("Subjects to Insert: ", subjectToInsert);
            if (subjectToInsert.length < 1) {
                return res
                    .status(httpStatus.BAD_REQUEST)
                    .json(
                        new APIResponse(
                            {},
                            "All Subjects Already exists",
                            false
                        )
                    );
            }
            const insertDataResult = await subjectRepo
                .createQueryBuilder()
                .insert()
                .values(subjectToInsert)
                .execute();
            console.log("Subjects inserted: ", insertDataResult);
            return res
                .status(httpStatus.OK)
                .json(
                    new APIResponse(
                        { subjectsInserted: subjectToInsert },
                        "Subjects inserted Successfully",
                        true
                    )
                );
        } catch (err) {
            console.log(">> ERROR OCCURED WHILE INSERTING SUBJECTS: ", err);
            return res
                .status(httpStatus.BAD_REQUEST)
                .json(
                    new APIResponse(
                        {},
                        "Error Occured while inserting Subjects",
                        false
                    )
                );
        }
    },
};
