import { Request, Response } from "express";
import { AppDataSource } from "../..";
import { Student } from "../entity/student";
import { Subject } from "../entity/subject";
import { Status } from "../utils/constants";
import httpStatus from "http-status";
import APIResponse from "../utils/apiResponse";
import { celebrate, Joi } from "celebrate";

export const AddStudent = {
    validator: celebrate({
        body: Joi.object().keys({
            first_name: Joi.string().required(),
            last_name: Joi.string(),
            mobile_number: Joi.string()
                .pattern(/^\d+$/)
                .min(10)
                .max(18)
                .required(),
            dob: Joi.date().required(),
            age: Joi.number().required(),
            standard: Joi.number().required().min(1).max(30),
            skills: Joi.array()
                .items(Joi.string().max(100).required())
                .required(),
            intro: Joi.string(),
            enrolment_from: Joi.date().required(),
            enrolment_to: Joi.date()
                .required()
                .ruleset.greater(Joi.ref("enrolment_from"))
                .rule({ message: "enrolment from must be before enrolment to" })
                .required(),
            status: Joi.string()
                .valid(...Object.values(Status))
                .required(),
            is_active: Joi.boolean().required(),
            subjects: Joi.array()
                .items(Joi.string().max(500).required())
                .required(),
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
                mobile_number,
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
            // checking if student already exists
            const isStudentExist = await studentRepo
                .createQueryBuilder()
                .where("mobile_number LIKE :mobileNumber", {
                    mobileNumber: mobile_number,
                })
                .getOne();
            if (isStudentExist) {
                console.log(">> STUDENT EXISTS ALREADY: ", isStudentExist);
                return res
                    .status(httpStatus.BAD_REQUEST)
                    .json(
                        new APIResponse(
                            {},
                            "Student Already exists with same mobile",
                            false
                        )
                    );
            }

            let newStudent: Student = new Student();
            newStudent.first_name = first_name;
            newStudent.last_name = last_name;
            newStudent.mobile_number = mobile_number;
            newStudent.dob = new Date(dob);
            newStudent.age = age;
            newStudent.standard = standard;
            newStudent.skills = JSON.stringify(skills);
            newStudent.intro = intro;
            newStudent.enrolment_from = new Date(enrolment_from);
            newStudent.enrolment_to = new Date(enrolment_to);
            newStudent.status = status;
            newStudent.is_active = is_active;

            // Validating Subjects and than adding it into new student
            // let allSubjects = subjects;
            const foundSubject: Subject[] = [];
            await Promise.all(
                subjects.map(async (subjectID: string) => {
                    const newDbSubject = await subjectRepo.findOne({
                        where: { id: subjectID },
                    });
                    if (newDbSubject) foundSubject.push(newDbSubject);
                })
            );
            newStudent.subjects = [...foundSubject];
            console.log(
                ">> ALL SUBJECTS : ",
                subjects,
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
            console.log(">> ERROR OCCURED WHILE SAVING STUDENT DATA: ", error);
            return res
                .status(httpStatus.BAD_REQUEST)
                .json(new APIResponse({}, "Student data not added", false));
        }
    },
};
