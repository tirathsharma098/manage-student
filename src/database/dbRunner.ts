import { DataSource } from "typeorm";
import dotenv from "dotenv";
dotenv.config();
import { development, production } from "./config";

let AppDataSource: DataSource;
switch (process.env.NODE_ENV) {
    case "development":
        AppDataSource = development;
        break;
    case "production":
        AppDataSource = production;
    default:
        break;
}

export default AppDataSource;