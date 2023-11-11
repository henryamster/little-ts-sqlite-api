// Models
import TestMessage from './Models/TestMessage';

// Database
import { controller } from './API/Controller';
import { addModels } from './Database/DataLayer';
import {LogEvent} from './Utilities/Logger';

// Express, HTTP, and .env
import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import { addLogging } from './Utilities/Logger';


addLogging(); 
LogEvent.fromString('Starting server and logging agent');

LogEvent.fromString('Adding models to database');
addModels();

LogEvent.fromString('Creating controllers');
const testMessageController = controller(TestMessage);

LogEvent.fromString('Creating express app');
export const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

LogEvent.fromString('Adding custom routes');
testMessageController.addCustomRoute('get', '/hello', async (req, res) => {
        const messages = await testMessageController.repository.customQuery('SELECT MAX(id) FROM TestMessage');
        const id = await testMessageController.repository.create({
                message: `Hello ${req.query.name ?? 'World!'}`,
                id: messages[0].id + 1
            });
            LogEvent.fromString(`Created message with id ${id}`);
        const message = { message: `Hello ${req.query.name ?? 'World!'}` }
        LogEvent.fromString(`Sending message ${JSON.stringify(message)}`);
        res.status(200).json(message);
});

LogEvent.fromString('Adding routes');
app.use('/test', testMessageController.router);


// Start server
LogEvent.fromString('Loading in port number from .env file');
const env = dotenv.config();
const app_port = env?.parsed?.APP_PORT as string;

if (app_port === undefined) {
        LogEvent.fromObject({
                level: 'error',
                message: 'Could not load in port number from .env file',
                data: {
                        env: env.error
                },
                timestamp: new Date().toISOString()
        });
        LogEvent.fromString('Using default port number 3000');
}

const port = app_port ?? 3000;

LogEvent.fromString('Creating server');
const server = http.createServer(app);

function surveil(server: http.Server) {
        server.on('request', (req, res) => {
            LogEvent.fromString(`Request: ${req.method} ${req.url}`);
        });
}

// now let's add it to our listen:

LogEvent.fromString('Starting server');
server.listen(port, () => {
        LogEvent.fromString('Beginning server surveillance');
        surveil(server);
});

