import * as dotenv from "dotenv";
import * as SQLite from "sqlite3";
import 'reflect-metadata';
import fs from "fs";
import path from "path";
import {
    CLEAR_DATABASE,
    DROP_AND_CREATE_DATABASE
} from "../config";
import { DatabaseHelper } from "./DatabaseHelper";
import { LogEvent } from "../Utilities/Logger";

LogEvent.fromString('Loading in .env file');
export const env = dotenv.config();
const db_path = env?.parsed?.DB_PATH as string;

LogEvent.fromString('Opening database');
export const db = new SQLite.Database(db_path);

LogEvent.fromString('Adding models to database');
export function addModels() {
    LogEvent.fromString(`Looking for models in ${path.resolve(__dirname, '.././models')}`)
    const modelsPath = path.resolve(__dirname, '.././models');
    LogEvent.fromString(`Found models: ${fs.readdirSync(modelsPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'))}`)
    const tables = fs.readdirSync(modelsPath)
        .filter(file => file.endsWith('.ts') || file.endsWith('.js'))
        .map(file => {
            //Get model class (there are also interfaces, but the class is default)
            const model = require(path.join(modelsPath, file)).default;
            //Get table name
            const tab = file.replace(path.extname(file), '');
            //Return table
            return DatabaseHelper.TableGenerator(tab, model);
        });


    LogEvent.fromString(`DROP_AND_CREATE_DATABASE: ${DROP_AND_CREATE_DATABASE}`)
    const dbInstance = DatabaseHelper.DatabaseGenerator(tables);
    DROP_AND_CREATE_DATABASE ? dbInstance.dropAndCreateDatabase() : dbInstance.initializeDbContext();


    LogEvent.fromString(`CLEAR_DATABASE: ${CLEAR_DATABASE}`)
    CLEAR_DATABASE ? dbInstance.clearDatabase() : () => { };
}

