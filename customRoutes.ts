import TestMessage from "./Models/TestMessage";
import { LogEvent } from "./Utilities/Logger";
import { testMessageController } from "./Index";
import { ColumnType } from "./Database/Column";
import { controller } from "./API/Controller";
import Controller from "./API/Controller";
import { Request, Response } from "express";
import { Repository } from "./Database/Repository";

export async function customRoutes() {
  testMessageController.addCustomRoute("get", "/hello", async (req:Request, res:Response) => {
    const messages = await testMessageController.repository.typedQuery<number>(
      "SELECT MAX(id) FROM TestMessage"
    );
    const id = await testMessageController.repository.create({
      message: `Hello ${req.query.name ?? "World!"}`,
      id: 0,
    });
    LogEvent.fromString(`Created message with id ${id}`);
    const message = { message: `Hello ${req.query.name ?? "World!"}` };
    LogEvent.fromString(`Sending message ${JSON.stringify(message)}`);
    res.status(200).json(message);
  });

  // Webhook pool
  testMessageController.addCustomRoute("post", "/webhook", async (req:Request, res:Response) => {
    const message = req.body;
    LogEvent.fromString(
      `Received message ${JSON.stringify(message)} from ${req.ip}: ${
        req.ips
      }: ${req.hostname}: ${req.subdomains}: ${req.originalUrl}: ${req.path}: ${
        req.protocol
      }: ${req.method}: ${req.query}: ${req.params}: ${req.body}`
    );
    const id = await testMessageController.repository.create(
      new TestMessage(0, JSON.stringify(message))
    );
    LogEvent.fromString(`Created message with id ${id}`);
    res.status(200).json(message);
  });
}
