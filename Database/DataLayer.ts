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

// Load .env file
export const env = dotenv.config();
const db_path = env?.parsed?.DB_PATH as string;
// Open sqlite database
export const db = new SQLite.Database(db_path);
export function addModels() {
    const modelsPath = path.resolve(__dirname, '.././models');
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

    // Initialize database
    const dbInstance = DatabaseHelper.DatabaseGenerator(tables);
    DROP_AND_CREATE_DATABASE ? dbInstance.dropAndCreateDatabase() : dbInstance.initializeDbContext();

    //Clear database
    CLEAR_DATABASE ? dbInstance.clearDatabase() : () => { };
}

