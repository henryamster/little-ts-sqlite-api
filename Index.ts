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
import { FormBuilder } from "./FormBuilder";

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
// Add a routeName property to your controller

const controllers = [testMessageController];

const formBuilder = new FormBuilder();

for (const controller of controllers) {
        app.get(`/client/${controller.getTypeName()}/test`, (req, res) => {
            let html = '';

            for (const method of Object.getOwnPropertyNames(Object.getPrototypeOf(controller))) {
                if (typeof controller[method as keyof typeof controller] === 'function') {
                    html += `<h1>${method}</h1>`;
                    const form = formBuilder.createForm(controller.repository); // replace this with the actual repository
                    LogEvent.fromString(`Form: ${form}`);
                    LogEvent.fromString(`Form: ${form.render()}`);
                    LogEvent.fromString(`Repository ${controller.repository}`);
                    html += form.render();
                }
            }

            res.send(html);
        });
};

LogEvent.fromString("Creating server");
const app_port = configurePort();
export const port = app_port ?? 3000;
startListening();
