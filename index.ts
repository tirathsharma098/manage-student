import express, {Application, Request, Response} from 'express';
import dotenv from "dotenv";
import { development, production} from './src/database/config';
import { DataSource } from 'typeorm';
dotenv.config();

let environment:DataSource;
switch(process.env.NODE_ENV){
    case "development": 
        environment = development;
        break;
    case "production":
        environment = production;
    default:
        break;
}
const PORT = process.env.PORT || 5000;
const app:Application = express();
environment.initialize()
    .then((data)=> {
        app.listen(PORT, ()=>{console.log(">> LISTINING TO PORT: ", PORT)});
    })
    .catch((error) => console.log(">> ERROR OCCURED WHILE INITIALIZING DATASOURCE: ", error));

