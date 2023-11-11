// Models
import TestMessage from "./Models/TestMessage";

// Database
import { controller } from "./API/Controller";
import { addModels } from "./Database/DataLayer";
import { addLogging } from "./Utilities/Logger";
import { LogEvent } from "./Utilities/Logger";
import { customRoutes, configurePort, startListening } from "./Utilities/ServerHelpers";

// Express, HTTP, and .env
import express from "express";

addLogging();
LogEvent.fromString("Starting server and logging agent");

LogEvent.fromString("Adding models to database");
addModels();

LogEvent.fromString("Creating controllers");
export const testMessageController = controller(TestMessage);

LogEvent.fromString("Creating express app");
export const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

LogEvent.fromString("Adding custom routes");
customRoutes();

LogEvent.fromString("Adding routes");
app.use("/test", testMessageController.router);

LogEvent.fromString("Creating server");
const app_port = configurePort();
export const port = app_port ?? 3000;
startListening();



