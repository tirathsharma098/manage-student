import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import { setSwagger } from "./swagger";
import { setup } from "./src/routes";
import { errors } from "celebrate";
import AppDataSource from "./src/database/dbRunner";
const app: Application = express();

const PORT = process.env.PORT || 5000;
app.use(express.json());
setSwagger(app);
setup(app);
app.use(errors());
app.get("/", (req: Request, res: Response) => {
    res.json({
        message: "Hello, Welcome to the student portal",
    });
});

AppDataSource.initialize()
    .then((data) => {
        app.listen(PORT, () => {
            console.log(">> LISTINING TO PORT: ", PORT);
        });
    })
    .catch((error) =>
        console.log(">> ERROR OCCURED WHILE INITIALIZING DATASOURCE: ", error)
    );
