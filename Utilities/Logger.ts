

export type LogEventType = 'request' | 'response' | 'error' | 'info' | 'warning' | 'debug' | 'critical';
export type LogEventLevel = 'info' | 'warning' | 'debug' | 'critical';

export interface ILogEvent {
        type: LogEventType;
        level: LogEventLevel;
        message?: string;
        timestamp: Date;
        context?: any;
        stackTrace?: string;
}

export class LogEvent {
        type: LogEventType;
        level: LogEventLevel;
        message?: string;
        timestamp: Date;
        context?: any;
        stackTrace?: string;

        constructor(type: LogEventType, level: LogEventLevel, message?: string, context?: any, stackTrace?: string) {
                this.type = type;
                this.level = level;
                this.message = message;
                this.timestamp = new Date();
                this.context = context;
                this.stackTrace = stackTrace;
        }
  
        toString() {
                return JSON.stringify(this);
        }

        static fromString(str: string) {
                try{
                        Logger.instance.log('info', 'info', `Log: ${str}`);
                        // return JSON.parse(str) as LogEvent;
                } catch (err: any) {
                        Logger.instance.log('error', 'critical', err.message, err.stack);
                        return null;
                }
        }

        static fromError(err: Error, context?: any) {
                return new LogEvent('error', 'critical', err.message, context, err.stack);
        }

        static fromObject(obj: any) {
                return new LogEvent(obj.type, obj.level, obj.message, obj.context, obj.stackTrace);
        }

}
export interface iLogger {
        log(event: LogEvent): void;
        log(type: LogEventType, level: LogEventLevel, message?: string, context?: any, stackTrace?: string): void;

        info(message?: string, context?: any): void;
        warning(message?: string, context?: any): void;
        debug(message?: string, context?: any): void;
        critical(message?: string, context?: any): void;

        on(event: LogEventType, callback: (event: LogEvent) => void): void;
}
export class Logger {

        public static readonly instance = new Logger();

        private constructor() {
                this.on('error', (event) => {
                        console.error(event);
                });
                this.addConsoleListener('info');
        }

        private listeners: { [key: string]: ((event: LogEvent) => void)[]; } = {};

        log(event: LogEvent): void;
        log(type: LogEventType, level: LogEventLevel, message?: string, context?: any, stackTrace?: string): void;
        log(eventOrType: LogEvent | LogEventType, level?: LogEventLevel, message?: string, context?: any, stackTrace?: string): void {
                if (eventOrType instanceof LogEvent) {
                        this.emit(eventOrType.type, eventOrType);
                } else {
                        this.emit(eventOrType, new LogEvent(eventOrType, level!, message, context, stackTrace));
                }
        }

        public emit(event: LogEventType, logEvent: LogEvent) {
                if (this.listeners[event]) {
                        this.listeners[event].forEach(listener => {
                                listener(logEvent);
                        });
                }
        }

        public on(event: LogEventType, callback: (event: LogEvent) => void) {
                if (!this.listeners[event]) {
                        this.listeners[event] = [];
                }
                this.listeners[event].push(callback);
        }

        addListener(event: LogEventType, callback: (event: LogEvent) => void) {
                this.on(event, callback);
        }

        addConsoleListener(event: LogEventType) {
                this.on(event, (event) => {
                        LogEventPrettyPrinter.consolePrint(event);
                });
        }
}

// Let's write a decorator 
export function LogEventDecorator(type: LogEventType, level: LogEventLevel, message?: string, context?: any, stackTrace?: string) {
        return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
                const originalMethod = descriptor.value;
                descriptor.value = function (...args: any[]) {
                        const logEvent = new LogEvent(type, level, message, context, stackTrace);
                        Logger.instance.log(logEvent);
                        return originalMethod.apply(this, args);
                };
                return descriptor;
        };
}

// Usage:       
// class Example {
//         @LogEventDecorator('request', 'info', 'Doing something', { some: 'context' }, 'stacktrace')
//         public doSomething() {
//                 console.log('Doing something');
//         }
// }


class LogEventPrettyPrinter{
        static print(event: LogEvent) {
                const type = event.type;
                const level = event.level;
                const message = event.message;
                const timestamp = event.timestamp;
                const context = event.context;
                const stackTrace = event.stackTrace;
                const prettyMessage = `${timestamp.toISOString()} [${type}] [${level}] ${message} ${context??""} ${stackTrace??""}`;
                return prettyMessage;
        }
        static consolePrint(event: LogEvent) {
                console.log(this.print(event));
        }
}

export function addLogging() {
        const logger = Logger.instance;
        logger.addConsoleListener('info');
}
