import { LogEvent } from "./Logger";
import http from "http";
import dotenv from "dotenv";
import { app, port } from "../Index";

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
