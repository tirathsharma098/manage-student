import { Request, Response } from "express";
import { AppDataSource } from "../..";
import { Student } from "../entity/student";
import { Subject } from "../entity/subject";
import { v4 as uuidv4 } from "uuid";
import { Status } from "../utils/constants";
import httpStatus from "http-status";
import APIResponse from "../utils/apiResponse";
import { celebrate, Joi } from "celebrate";

export const AddStudent = {
    validator: celebrate({
        body: Joi.object().keys({
            first_name: Joi.string().required(),
            last_name: Joi.string(),
            dob: Joi.date().required(),
            age: Joi.number().required(),
            standard: Joi.string().required().min(1).max(30),
            skills: Joi.string().required(),
            intro: Joi.string(),
            enrolment_from: Joi.date().required(),
            enrolment_to: Joi.date()
                .ruleset.greater(Joi.ref("enrolment_from"))
                .rule({ message: "enrolment from must be before enrolment to" })
                .required(),
            status: Joi.string().valid(...Object.values(Status)),
            is_active: Joi.boolean(),
            subjects: Joi.string(),
        }),
    }),
    controller: async (req: Request, res: Response) => {
        try {
            console.log(">> Request Body recieved: ", req.body);
            const studentRepo = AppDataSource.getRepository(Student);
            const subjectRepo = AppDataSource.getRepository(Subject);
            const {
                first_name,
                last_name,
                dob,
                age,
                standard,
                skills,
                intro,
                enrolment_from,
                enrolment_to,
                status,
                is_active,
                subjects,
            } = req.body;
            let newStudent: Student = new Student();
            newStudent.id = uuidv4();
            newStudent.first_name = first_name;
            newStudent.last_name = last_name;
            newStudent.dob = new Date(dob);
            newStudent.age = age;
            newStudent.standard = standard;
            newStudent.skills = skills;
            newStudent.intro = intro;
            newStudent.enrolment_from = new Date(enrolment_from);
            newStudent.enrolment_to = new Date(enrolment_to);
            newStudent.status = Object.values(Status).includes(status)
                ? Status.LIVE
                : Status.SUSPENDED;
            newStudent.is_active =
                is_active.toLowerCase() === "true" ? true : false;

            // Validating Subjects and than adding it into new student
            let allSubjects = JSON.parse(subjects);
            const foundSubject: Subject[] = [];
            await Promise.all(
                allSubjects.map(async (subj: string) => {
                    const newDbSubject = await subjectRepo.findOne({
                        where: { subject: subj },
                    });
                    if (newDbSubject) foundSubject.push(newDbSubject);
                })
            );
            newStudent.subjects = foundSubject;

            console.log(
                ">> ALL SUBJECTS : ",
                allSubjects,
                ">> New Student : ",
                newStudent
            );
            const studentInserted = await studentRepo.save(newStudent);
            if (studentInserted) {
                console.log(">> STUDENT ADDED SUCCESSFULLY", studentInserted);
                return res
                    .status(httpStatus.OK)
                    .json(
                        new APIResponse(
                            newStudent,
                            "Student Added Successfully",
                            true
                        )
                    );
            }
            throw new Error("Adding Student Failed");
        } catch (error) {
            return res
                .status(httpStatus.BAD_REQUEST)
                .json(new APIResponse({}, "Student data not added", false));
        }
    },
};
