import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import { Application } from "express";

const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: "Manage Student",
            version: "1.0.0",
        },
        basePath: "api/v1",
        schemes: ["http", "https"],
        tags: [
            {
                name: "Fetch Student",
                description:
                    "get all the details of student one or more student",
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
    apis: [],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
export const setSwagger = (app: Application) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))
  };