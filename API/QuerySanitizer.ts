import { Router, Request, Response } from "express";
import { Form, ControllerMethodForms } from "../Client/FormBuilder";
import { Repository, repo } from "../Database/Repository";
import {  LogEvent } from "../Utilities/Logger";



export class QuerySanitizer{
  public static santizieQuery(q: string) {
    LogEvent.fromString("Sanitizing query: " + q);
      // Sanitize the query string q here
  // First, split the query string into an array of words
  const words = q.split(" ");
  // Next, sanitize each word
  const sanitizedWords = words.map((word) => this.sanitize(word));
  // Finally, join the words back together
  const sanitizedQuery = sanitizedWords.join(" ");
  LogEvent.fromString("Query sanitized: " + sanitizedQuery);
  return sanitizedQuery;
  }

  public static sanitize(word: string) {  
    const banned_words = ["drop", "delete", "update", "insert", "create", "alter",
      "grant", "revoke", "truncate", "backup", "restore", "use", "exec", "execute",
      "xp_", "sp_"];
    const banned_characters = [";", "'", '"', "`", "{", "}", "[", "]",];
    // Remove banned characters
    for (const character of banned_characters) {
      //alert if found
      if (word.includes(character)) {
        LogEvent.fromString("Banned character found: " + character);
      }
      word = word.replace(character, "");
    }
    // Remove banned words
    for (const banned_word of banned_words) {
      //alert if found
      if (word.includes(banned_word)) {
        LogEvent.fromString("Banned word found: " + banned_word);
      }
      word = word.replace(banned_word, "");
    }
    return word;
  }
}

// We want to modify this class so that it wraps the responses in an HTTP response

// export default class Controller<T extends { [key: string]: any; }> {
//   repository: Repository<T>;
//   router: Router;
//   instance: T;
//   constructor(model: new () => T) {
//     this.repository = repo(model);
//     this.router = Router();
//     this.initializeRoutes();
//     this.instance = new model();
//   }
//   initializeRoutes(): void {
//     LogEvent.fromString("Initializing routes");
//     this.router.get("/forms", this.forms.bind(this));
//     this.router.post("/Create", this.create.bind(this));
//     this.router.get("/All", this.all.bind(this));
//     this.router.get("/Query", this.query.bind(this));
//     this.router.get("Find/:id", this.find.bind(this));
//     this.router.put("Update/:id", this.update.bind(this));
//     this.router.delete("Delete/:id", this.delete.bind(this));
//   }
//   forms(req: Request, res: Response): void {
//     LogEvent.fromString("Getting forms");
//     const forms: Form[] = [
//       ControllerMethodForms.AllForm(this.instance, this),
//       ControllerMethodForms.CreateForm(this.instance, this),
//       ControllerMethodForms.DeleteForm(this.instance, this),
//       ControllerMethodForms.FindForm(this.instance, this),
//       ControllerMethodForms.QueryForm(this.instance, this),
//       ControllerMethodForms.UpdateForm(this.instance, this),
//       ControllerMethodForms.DeleteForm(this.instance, this)
//     ];

//     // now the forms have actions attached but need to be typed
//     let html = "";
//     // Let's render each form and add it to the html
//     const renderList: string[] = [];
//     for (const form of forms) {
//       const renderedForm = form.render();
//       renderList.push(renderedForm);
//     }
//     html += renderList.join("\n");
//     res.send(html);
//     // res.status(200).json(renderList);
//   }
//   // .getCustomRouteAction(form.name)
//   getCustomRouteAction(name: string) {
//     //just get the first /controller name/ route
//     LogEvent.fromString(`Getting custom route action for ${name}`);
//     const route = this.router.stack.find((r) => r.route.path === name)?.route;
//     LogEvent.fromString(`Getting custom route action for ${route}`);
//     console.log(route);
//     return route;
//   }

//   create(req: Request, res: Response): void {
//     LogEvent.fromString("Creating item");
//     this.repository.create(req.body).then((id: number) => {
//       LogEvent.fromString(`Item created with id ${id}`);
//       this.repository.find(id).then((item: T) => {
//         res.status(201).json(item);
//       });
//     });
//   }
//   all(req: Request, res: Response): void {
//     LogEvent.fromString("Getting all items");
//     this.repository.all().then((items: T[]) => {
//       res.status(200).json(items);
//     });
//   }
//   find(req: Request, res: Response): void {
//     LogEvent.fromString("Finding item " + req.params.id);
//     const id = parseInt(req.params.id);
//     this.repository.find(id).then((item: T) => {
//       if (item) {
//         LogEvent.fromString("Item found");
//         res.status(200).json(item);
//       } else {
//         LogEvent.fromString("Item not found");
//         res.status(404).send();
//       }
//     });
//   }
//   update(req: Request, res: Response): void {
//     LogEvent.fromString("Updating item " + req.params.id);
//     const id = parseInt(req.params.id);
//     this.repository.update(id, req.body).then(() => {
//       this.repository.find(id).then((item: T) => {
//         if (item) {
//           LogEvent.fromString("Item updated");
//           res.status(200).json(item);
//         } else {
//           LogEvent.fromString("Item not found");
//           res.status(404).send();
//         }
//       });
//     });
//   }
//   delete(req: Request, res: Response): void {
//     LogEvent.fromString("Deleting item " + req.params.id);
//     const id = parseInt(req.params.id);
//     this.repository
//       .delete(id)
//       .then(() => {
//         LogEvent.fromString("Item deleted");
//         res.status(204).send();
//       })
//       .catch((error: Error) => {
//         LogEvent.fromString("Item not found");
//         res.status(404).send();
//       });
//   }
//   query(req: Request, res: Response): void {
//     const q = req.query.query as string;
//     const sanitizer = (q: string) => QuerySanitizer.santizieQuery(q);


//     this.repository
//       .customQuery(sanitizer(q))
//       .then((items: T[]) => {
//         res.status(200).json(items);
//       })
//       .catch((error: Error) => {
//         // Log the error message, not the query
//         LogEvent.fromString(`Error occurred: ${error.message}`);
//         res.status(500).send();
//       });
//   }
//   getRouter(): Router {
//     return this.router;
//   }

//   addCustomRoute(
//     method: "get" | "post" | "put" | "delete",
//     path: string,
//     handler: (
//       req: Request,
//       res: Response,
//       repository: Repository<T>
//     ) => Promise<void>
//   ) {
//     this.router[method](path, async (req, res) => {
//       try {
//         LogEvent.fromString(
//           `Custom route ${method.toUpperCase()} ${path} called`
//         );
//         await handler(req, res, this.repository);
//       } catch (error) {
//         LogEvent.fromString(
//           `Custom route ${method.toUpperCase()} ${path} failed`
//         );
//         res.status(500).json({ error: `${error}` });
//       }
//     });
//     // put this route at the top of the stack
//     LogEvent.fromString(`Custom route ${method.toUpperCase()} ${path} added`);
//     this.router.stack.unshift(this.router.stack.pop());
//   }

//   getTypeName(): string {
//     return this.repository.getTypeName();
//   }
// }
