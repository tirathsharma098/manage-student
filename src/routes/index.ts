import { Application } from "express";
import studentRoute from "./student";
import subjectRoute from "./subject";
import adminRoute from "./admin";
import { verifyAdmin } from "../utils/checkAdmin";
export const setup = (app: Application) => {
    app.use("/api/admin", adminRoute);
    app.use("/api", verifyAdmin);
    app.use("/api/student", studentRoute);
    app.use("/api/subject", subjectRoute);
};
