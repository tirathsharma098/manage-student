import dotenv from "dotenv";
dotenv.config();
import { DataSource } from "typeorm";
import path from 'path';

const development = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: String(process.env.DEV_DB_PASSWORD),
  database: "manage_student",
  entities: [path.join(__dirname, "../entity/*{.ts,.js}")],
  migrations: [path.join(__dirname, "../migration/*{.ts,.js}")],
  subscribers: [path.join(__dirname, "../subscriber/*{.ts,.js}")],
  synchronize: true,
})

const production = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: String(process.env.DB_PASSWORD),
    database: process.env.DB_NAME,
    entities: [path.join(__dirname, "../entity/*{.ts,.js}")],
    migrations: [path.join(__dirname, "../migration/*{.ts,.js}")],
    subscribers: [path.join(__dirname, "../subscriber/*{.ts,.js}")],
    synchronize: true,
    logging: false
})

export {development, production};