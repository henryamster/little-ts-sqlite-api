export interface ITestMessage {
    id: number;
    message: string;
}

export default class TestMessage implements ITestMessage{
    id: number;
    message: string;
    constructor(id: number, message: string) {
        this.id = id;
        this.message = message;
    }   
}