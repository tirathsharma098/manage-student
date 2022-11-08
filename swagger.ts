import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import { Application } from "express";

const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: "Manage Student",
            version: "1.0.0",
        },
        basePath: "/api",
        schemes: ["http", "https"],
        tags: [
            {
                name: "FetchInsertStudent",
                description:
                    "Add Student or Get all the details of student one or more student",
            },
            {
                name: "FetchInsertSubjects",
                description: "Add subjects fetch subjects data",
            },
            {
                name: "AdminSpace",
                description: "Do Admin things here, manage students and all",
            },
        ],
        securityDefinitions: {
            Token: {
                type: "apiKey",
                name: "Authorization",
                in: "header",
            },
        },
    },
    apis: [
        "./src/routes/subject.ts",
        "./src/routes/student.ts",
        "./src/routes/admin.ts",
    ],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
export const setSwagger = (app: Application) => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};
