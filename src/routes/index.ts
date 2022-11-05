import express, { Application } from "express";
import studentRoute from "./student";
import subjectRoute from "./subject";
export const setup = (app: Application) => {
    app.use(express.urlencoded({ extended: true }));
    app.use("/api/student", studentRoute);
    app.use("/api/subject", subjectRoute);
};
