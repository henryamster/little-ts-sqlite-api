import TestMessage from "../Models/TestMessage";
import { LogEvent } from "./Logger";
import http from "http";
import dotenv from "dotenv";
import { testMessageController, app, port } from "../Index";

export function customRoutes() {
  testMessageController.addCustomRoute("get", "/hello", async (req, res) => {
    const messages = await testMessageController.repository.typedQuery<number>(
      "SELECT MAX(id) FROM TestMessage"
    );
    const id = await testMessageController.repository.create({
      message: `Hello ${req.query.name ?? "World!"}`,
      id: messages[0] + 1,
    });
    LogEvent.fromString(`Created message with id ${id}`);
    const message = { message: `Hello ${req.query.name ?? "World!"}` };
    LogEvent.fromString(`Sending message ${JSON.stringify(message)}`);
    res.status(200).json(message);
  });

  // Webhook pool
  testMessageController.addCustomRoute("post", "/webhook", async (req, res) => {
    const message = req.body;
    LogEvent.fromString(`Received message ${JSON.stringify(message)} from ${req.ip}: ${req.ips}: ${req.hostname}: ${req.subdomains}: ${req.originalUrl}: ${req.path}: ${req.protocol}: ${req.method}: ${req.query}: ${req.params}: ${req.body}`);
    const id = await testMessageController.repository.create(new TestMessage(0, JSON.stringify(message)));
    LogEvent.fromString(`Created message with id ${id}`);
    res.status(200).json(message);
  });
}
export function configurePort() {
  LogEvent.fromString("Loading in port number from .env file");
  const env = dotenv.config();
  const app_port = env?.parsed?.APP_PORT as string;

  if (app_port === undefined) {
    LogEvent.fromObject({
      level: "error",
      message: "Could not load in port number from .env file",
      data: {
        env: env.error,
      },
      timestamp: new Date().toISOString(),
    });
    LogEvent.fromString("Using default port number 3000");
  }
  return app_port;
}
export function startListening() {
  const server = http.createServer(app);

  function surveil(server: http.Server) {
    server.on("request", (req, res) => {
      LogEvent.fromString(`Request: ${req.method} ${req.url}`);
    });
  }

  // now let's add it to our listen:
  LogEvent.fromString("Starting server");
  server.listen(port, () => {
    LogEvent.fromString("Beginning server surveillance");
    surveil(server);
  });
}
