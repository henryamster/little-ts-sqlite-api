import { repo } from "../Database/Repository";
import { Repository } from "../Database/Repository";
import { Router, Request, Response } from "express";
import { LogEvent } from "../Utilities/Logger";

// We want to modify this class so that it wraps the responses in an HTTP response
export default class Controller<T extends { [key: string]: any }> {
  repository: Repository<T>;
  router: Router;
  constructor(model: new () => T) {
    this.repository = repo(model);
    this.router = Router();
    this.initializeRoutes();
  }
  initializeRoutes(): void {
    LogEvent.fromString("Initializing routes");
    this.router.post("/", this.create.bind(this));
    this.router.get("/", this.all.bind(this));
    this.router.get("/query", this.query.bind(this));
    this.router.get("/:id", this.find.bind(this));
    this.router.put("/:id", this.update.bind(this));
    this.router.delete("/:id", this.delete.bind(this));
  }
  create(req: Request, res: Response): void {
    LogEvent.fromString("Creating item");
    this.repository.create(req.body).then((id: number) => {
      LogEvent.fromString(`Item created with id ${id}`);
      this.repository.find(id).then((item: T) => {
        res.status(201).json(item);
      });
    });
  }
  all(req: Request, res: Response): void {
    LogEvent.fromString("Getting all items");
    this.repository.all().then((items: T[]) => {
      res.status(200).json(items);
    });
  }
  find(req: Request, res: Response): void {
    LogEvent.fromString("Finding item " + req.params.id);
    const id = parseInt(req.params.id);
    this.repository.find(id).then((item: T) => {
      if (item) {
        LogEvent.fromString("Item found");
        res.status(200).json(item);
      } else {
        LogEvent.fromString("Item not found");
        res.status(404).send();
      }
    });
  }
  update(req: Request, res: Response): void {
    LogEvent.fromString("Updating item " + req.params.id);
    const id = parseInt(req.params.id);
    this.repository.update(id, req.body).then(() => {
      this.repository.find(id).then((item: T) => {
        if (item) {
          LogEvent.fromString("Item updated");
          res.status(200).json(item);
        } else {
          LogEvent.fromString("Item not found");
          res.status(404).send();
        }
      });
    });
  }
  delete(req: Request, res: Response): void {
    LogEvent.fromString("Deleting item " + req.params.id);
    const id = parseInt(req.params.id);
    this.repository
      .delete(id)
      .then(() => {
        LogEvent.fromString("Item deleted");
        res.status(204).send();
      })
      .catch((error: Error) => {
        LogEvent.fromString("Item not found");
        res.status(404).send();
      });
  }
  query(req: Request, res: Response): void {
    const q = req.query.q as string;
    LogEvent.fromString("Querying items with query " + q);
    this.repository
      .customQuery(q)
      .then((items: T[]) => {
        res.status(200).json(items);
        LogEvent.fromString("Items found");
      })
      .catch((error: Error) => {
        LogEvent.fromString("Items not found");
        res.status(404).send();
      });
  }

  getRouter(): Router {
    return this.router;
  }

  addCustomRoute(
    method: "get" | "post" | "put" | "delete",
    path: string,
    handler: (
      req: Request,
      res: Response,
      repository: Repository<T>
    ) => Promise<void>
  ) {
    this.router[method](path, async (req, res) => {
      try {
        LogEvent.fromString(
          `Custom route ${method.toUpperCase()} ${path} called`
        );
        await handler(req, res, this.repository);
      } catch (error) {
        LogEvent.fromString(
          `Custom route ${method.toUpperCase()} ${path} failed`
        );
        res.status(500).json({ error: `${error}` });
      }
    });
    // put this route at the top of the stack
    LogEvent.fromString(`Custom route ${method.toUpperCase()} ${path} added`);
    this.router.stack.unshift(this.router.stack.pop());
  }
}

export const controller = <T extends { [key: string]: any }>(
  t: new (...args: any[]) => T
) => new Controller<T>(t);
