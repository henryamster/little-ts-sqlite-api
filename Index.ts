// Models
import TestMessage from "./Models/TestMessage";
import { controller } from "./API/Controller";

// Database
import { addModels } from "./Database/DataLayer";

// Server
import { configurePort, startListening } from "./Utilities/ServerHelpers";
import { customRoutes } from "./customRoutes";
import express from "express";

// Logging
import { addLogging } from "./Utilities/Logger";
import { LogEvent } from "./Utilities/Logger";
import Controller from "./API/Controller";

addLogging();
LogEvent.fromString("Starting server and logging agent");

LogEvent.fromString("Adding models to database");
addModels();

LogEvent.fromString("Creating express app");
export const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

export const testMessageController = controller(TestMessage);

LogEvent.fromString("Adding routes and controllers");
const routeControllerMap = new Map<string, Controller<any>>([
    ["/test/", testMessageController],
]);

LogEvent.fromString("Adding forms to controllers");
for (let [route, controller] of routeControllerMap) {
    app.use(route, controller.getRouter());
    app.get(`/client/${controller.getTypeName()}/test`, (req, res) => {
        let html = '';
        res.send(html);
    });
}

LogEvent.fromString("Adding custom routes");
customRoutes();

LogEvent.fromString("Creating server");
const app_port = configurePort();
export const port = app_port ?? 3000;
startListening();