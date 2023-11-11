import { ColumnType } from "../Database/Column";

export interface ITestMessage {
  id: number;
  message: string;
}

export default class TestMessage implements ITestMessage {
  @ColumnType("number")
  id: number = 0;
  @ColumnType("string")
  message: string = "";
  constructor(id: number, message: string) {
    this.id = id;
    this.message = message;
  }
}
