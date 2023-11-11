import { repo } from "../Database/Repository";
import { Repository } from "../Database/Repository";
import { Router, Request, Response } from "express";
import { LogEvent } from "../Utilities/Logger";
import { ControllerMethodForms } from "../Client/FormBuilder";
import { Form } from "../Client/FormBuilder";
import { QuerySanitizer } from "./QuerySanitizer";

// We want to modify this class so that it wraps the responses in an HTTP response
export default class Controller<T extends { [key: string]: any }> {
  repository: Repository<T>;
  router: Router;
  instance: T;
  constructor(model: new () => T) {
    this.repository = repo(model);
    this.router = Router();
    this.initializeRoutes();
    this.instance = new model();
  }
  initializeRoutes(): void {
    LogEvent.fromString("Initializing routes");
    this.router.get('/forms', this.forms.bind(this));
    this.router.post("/Create", this.create.bind(this));
    this.router.get("/All", this.all.bind(this));
    this.router.get("/Query", this.query.bind(this));
    this.router.get("Find/:id", this.find.bind(this));
    this.router.put("/Update/:id", this.update.bind(this));
    this.router.delete("/Delete/:id", this.delete.bind(this));
    
  }
  forms(req: Request, res: Response): void {
          LogEvent.fromString("Getting forms");
          const forms: Form[] =[
            ControllerMethodForms.AllForm(this.instance, this),
            ControllerMethodForms.CreateForm(this.instance, this),
            ControllerMethodForms.DeleteForm(this.instance, this),
            ControllerMethodForms.FindForm(this.instance, this),
            ControllerMethodForms.QueryForm(this.instance , this),
            ControllerMethodForms.UpdateForm(this.instance, this),
          ]

         // now the forms have actions attached but need to be typed
        let html = "";
        // Let's render each form and add it to the html
        const renderList: string[] = [];
      for (const form of forms) {
        const renderedForm = form.render();
        renderList.push(renderedForm);
      }
      html += renderList.join("\n");
      res.send(html);
    // res.status(200).json(renderList);
  }
  // .getCustomRouteAction(form.name)
  getCustomRouteAction(name: string) {
    //just get the first /controller name/ route
    LogEvent.fromString(`Getting custom route action for ${name}`);
    const route = this.router.stack.find((r) => r.route.path === name)?.route;
    LogEvent.fromString(`Getting custom route action for ${route}`);
    console.log(route);
    return route;
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
    const id = parseInt(req.query.id as string);
    LogEvent.fromString("Finding item " + id);
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
    const id = parseInt(req.query.id as string);
    LogEvent.fromString("Updating item " + id);
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
    const id = parseInt(req.query.id as string);
    LogEvent.fromString("Deleting item " + id);
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
    let q = req.query.query as string;
    q= QuerySanitizer.santizieQuery(q);
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

  getTypeName(): string {
    return this.repository.getTypeName();
  }

}

export const controller = <T extends { [key: string]: any }>(
  t: new (...args: any[]) => T
) => new Controller<T>(t);
