// Models
import TestMessage from './Models/TestMessage';
import YoutubeVideo, { YoutubeHelper } from './Models/YoutubeVideo';

// Database
import { controller } from './API/Controller';
import { addModels } from './Database/DataLayer';
import express, { Router } from 'express';
import test from 'node:test';
import { CustomRoute, RouteHandler } from './API/RouteHandler';
import http from 'http';
import { info } from 'console';

// Add models to database
addModels();

// Create controllers
const youtubeController = controller(YoutubeVideo);
const testMessageController = controller(TestMessage);


// Create express app
const app = express();
app.use(express.json());

testMessageController.addCustomRoute('get', '/hello', async (req, res) => {
        const messages = await testMessageController.repository.customQuery('SELECT MAX(id) FROM TestMessage');
        const id = await testMessageController.repository.create({
                message: `Hello ${req.query.name ?? 'World!'}`,
                id: messages[0].id + 1
            });
        console.log(id);
        const message = { message: `Hello ${req.query.name ?? 'World!'}` }
        console.log(`Response body: ${message}`);
        res.status(200).json(message);
});



// .get('/hello', async (req, res) => {
//         const messages = await testMessageController.repository.customQuery('SELECT MAX(id) FROM test_message');
//         const id = testMessageController.repository.create({
//                 message: `Hello ${req.query.name ?? 'World!'}`,
//                 id: messages[0].id + 1
//         });
//         res.json({ message: `Hello ${req.query.name ?? 'World!'}` });
// });
// Add controllers
app.use('/test', testMessageController.router);
app.use('/youtube', youtubeController.router);




// Start server
const port = 3000;

const server = http.createServer(app);

function surveil(server: http.Server) {
        server.on('request', (req, res) => {
                console.log(`Request: ${req.method} ${req.url} ::`);
        });
}

// now let's add it to our listen:

server.listen(port, () => {
        surveil(server);
        console.log(`Server listening on port ${port}`);
});

// type LogEventType = 'request' | 'response' | 'error' | 'info' | 'warning' | 'debug' | 'critical';
// type LogEventLevel = 'info' | 'warning' | 'debug' | 'critical';
// interface ILogEvent{
//         type: LogEventType;
//         level: LogEventLevel;
//         message?: string;
//         timestamp: Date;
//         context?: any;
//         stackTrace?: string;
// }

// class LogEvent{
//         type: LogEventType;
//         level: LogEventLevel;
//         message?: string;
//         timestamp: Date;
//         context?: any;
//         stackTrace?: string;

//         constructor(type: LogEventType, level: LogEventLevel, message?: string, context?: any, stackTrace?: string){
//                 this.type = type;
//                 this.level = level;
//                 this.message = message;
//                 this.timestamp = new Date();
//                 this.context = context;
//                 this.stackTrace = stackTrace;
//         }

//         toString(){
//                 return JSON.stringify(this);
//         }

//         static fromString(str: string){
//                 return JSON.parse(str) as LogEvent;
//         }

//         static fromError(err: Error, context?: any){
//                 return new LogEvent('error', 'critical', err.message, context, err.stack);
//         }

//         static fromObject(obj: any){
//                 return new LogEvent(obj.type, obj.level, obj.message, obj.context, obj.stackTrace);
//         }

// }

// interface iLogger{
//         log(event: LogEvent): void;
//         log(type: LogEventType, level: LogEventLevel, message?: string, context?: any, stackTrace?: string): void;

//         info(message?: string, context?: any): void;
//         warning(message?: string, context?: any): void;
//         debug(message?: string, context?: any): void;
//         critical(message?: string, context?: any): void;

//         on(event: LogEventType, callback: (event: LogEvent) => void): void;
// }

// class Logger{

//         public static readonly instance = new Logger();

//         private constructor(){
//                 this.on('error', (event) => {
//                         console.error(event);
//                 });
//         }

//         private listeners: { [key: string]: ((event: LogEvent) => void)[] } = {};

//         log(event: LogEvent): void;
//         log(type: LogEventType, level: LogEventLevel, message?: string, context?: any, stackTrace?: string): void;
//         log(eventOrType: LogEvent | LogEventType, level?: LogEventLevel, message?: string, context?: any, stackTrace?: string): void{
//                 if(eventOrType instanceof LogEvent){
//                         this.emit(eventOrType.type, eventOrType);
//                 }else{
//                         this.emit(eventOrType, new LogEvent(eventOrType, level!, message, context, stackTrace));
//                 }
//         }

//         public emit(event: LogEventType, logEvent: LogEvent){
//                 if(this.listeners[event]){
//                         this.listeners[event].forEach(listener => {
//                                 listener(logEvent);
//                         });
//                 }
//         }

//         public on(event: LogEventType, callback: (event: LogEvent) => void){
//                 if(!this.listeners[event]){
//                         this.listeners[event] = [];
//                 }
//                 this.listeners[event].push(callback);
//         }

//         public info(message?: string, context?: any){

//         }
//         public warning(message?: string, context?: any){}
//         public debug(message?: string, context?: any){}
//         public critical(message?: string, context?: any){}

// }