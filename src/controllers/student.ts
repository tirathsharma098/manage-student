import { Request, Response } from "express";
import { Student } from "../entity/student";
import { Subject } from "../entity/subject";
import { Status } from "../utils/constants";
import httpStatus from "http-status";
import APIResponse from "../utils/apiResponse";
import { celebrate, Joi } from "celebrate";
import AppDataSource from "../database/dbRunner";

const validateStudentObject = {
    first_name: Joi.string().required(),
    last_name: Joi.string(),
    mobile_number: Joi.string().pattern(/^\d+$/).min(10).max(18).required(),
    dob: Joi.date().required(),
    age: Joi.number().required(),
    standard: Joi.number().required().min(1).max(30),
    skills: Joi.array().items(Joi.string().max(100).required()).required(),
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
    subjects: Joi.array().items(Joi.string().max(500).required()).required(),
};

export const GetAllStudent = {
    validator: celebrate({
        body: Joi.object().keys({
            skip: Joi.number().min(0).required(),
            take: Joi.number().min(1).max(100).required(),
        }),
    }),
    controller: async (req: Request, res: Response) => {
        try {
            const { skip, take } = req.body;
            console.log(">> GET STUDENT REQ BODY: ", req.body);
            const studentRepo = AppDataSource.getRepository(Student);
            const allStudents = await studentRepo.find({
                order: {
                    first_name: "ASC",
                },
                skip: skip,
                take: take,
            });
            return res
                .status(httpStatus.OK)
                .json(
                    new APIResponse(
                        allStudents,
                        "Students got Successfully",
                        true
                    )
                );
        } catch (err) {
            console.log(">> ERROR OCCURED WHILE Getting STUDENTS: ", err);
            return res
                .status(httpStatus.BAD_REQUEST)
                .json(
                    new APIResponse(
                        {},
                        "Error Occured while getting STUDENTS",
                        false
                    )
                );
        }
    },
};

export const AddStudent = {
    validator: celebrate({
        body: Joi.object().keys(validateStudentObject),
    }),
    controller: async (req: Request, res: Response) => {
        try {
            console.log(">> Request Body recieved: ", req.body);
            const studentRepo = AppDataSource.getRepository(Student);
            const subjectRepo = AppDataSource.getRepository(Subject);
            // checking if student already exists
            const isStudentExist = await studentRepo
                .createQueryBuilder()
                .where("mobile_number LIKE :mobileNumber", {
                    mobileNumber: req.body.mobile_number,
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
            const {
                id,
                dob,
                skills,
                enrolment_from,
                enrolment_to,
                subjects,
                ...reqBody
            } = req.body;
            let newStudent: Student = new Student();
            newStudent = reqBody;
            newStudent.dob = new Date(dob);
            newStudent.skills = JSON.stringify(skills);
            newStudent.enrolment_from = new Date(enrolment_from);
            newStudent.enrolment_to = new Date(enrolment_to);

            // Validating Subjects and than adding it into new student
            const foundSubject: Subject[] = [];
            await Promise.all(
                subjects.map(async (subjectID: string) => {
                    const newDbSubject = await subjectRepo.findOne({
                        where: { id: subjectID },
                    });
                    if (newDbSubject) foundSubject.push(newDbSubject);
                })
            );
            newStudent.subjects = foundSubject;
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

export const UpdateStudent = {
    validator: celebrate({
        body: Joi.object().keys({
            id: Joi.string().min(5).max(500).required(),
            ...validateStudentObject,
        }),
    }),
    controller: async (req: Request, res: Response) => {
        try {
            const studentRepo = AppDataSource.getRepository(Student);
            const subjectRepo = AppDataSource.getRepository(Subject);
            const {
                id,
                dob,
                skills,
                enrolment_from,
                enrolment_to,
                subjects,
                ...reqBody
            } = req.body;
            const studentToUpdate = studentRepo.findOne({ where: { id: id } });
            if (!studentToUpdate) throw new Error("Student does not exist");
            const newStudent: Student = { ...reqBody };
            newStudent.skills = JSON.stringify(skills);
            newStudent.dob = new Date(req.body.dob);
            newStudent.enrolment_from = new Date(req.body.enrolment_from);
            newStudent.enrolment_to = new Date(req.body.enrolment_to);

            const foundSubject: Subject[] = [];
            await Promise.all(
                subjects.map(async (subjectID: string) => {
                    const newDbSubject = await subjectRepo.findOne({
                        where: { id: subjectID },
                    });
                    if (newDbSubject) foundSubject.push(newDbSubject);
                })
            );

            await studentRepo
                .createQueryBuilder()
                .update(newStudent)
                .where({ id: id })
                .execute()
                .then((response) => response);
            console.log(">> Student Updated Successfully");
            const studentSubject: Student = await studentRepo.findOne({
                where: { id: id },
            });
            studentSubject.subjects = foundSubject;
            const studentSubjectUpdated = await studentRepo.save(
                studentSubject
            );
            if (studentSubjectUpdated) {
                console.log(
                    ">> Student Subject Updated Successfully: ",
                    studentSubjectUpdated
                );
                return res
                    .status(httpStatus.OK)
                    .json(
                        new APIResponse(
                            studentSubject,
                            "Student Updated Successfully",
                            true
                        )
                    );
            }
            throw new Error("Updating Student Failed");
        } catch (err) {
            console.log(">> ERROR OCCURED WHILE UPDATING STUDENT DATA: ", err);
            return res
                .status(httpStatus.BAD_REQUEST)
                .json(new APIResponse({}, "Student not updated", false));
        }
    },
};
