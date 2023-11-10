import { repo } from './Repository';
import { Repository } from './Repository';
import { Router, Request, Response } from 'express';






// We want to modify this class so that it wraps the responses in an HTTP response
export default class Controller<T extends { [key: string]: any; }> {
    repository: Repository<T>;
    router: Router;
    constructor(model: new () => T) {
        this.repository = repo(model);
        this.router = Router();
        this.initializeRoutes();
    }
    initializeRoutes(): void {
        this.router.post('/', this.create.bind(this));
        this.router.get('/', this.all.bind(this));
        this.router.get('/query', this.query.bind(this));
        this.router.get('/:id', this.find.bind(this));
        this.router.put('/:id', this.update.bind(this));
        this.router.delete('/:id', this.delete.bind(this));
    }
    create(req: Request, res: Response): void {
        this.repository.create(req.body).then((id: number) => {
            this.repository.find(id).then((item: T) => {
                res.status(201).json(item);
            });
        });
    }
    all(req: Request, res: Response): void {
        this.repository.all().then((items: T[]) => {
            res.status(200).json(items);
        });
    }
    find(req: Request, res: Response): void {
        const id = parseInt(req.params.id);
        this.repository.find(id).then((item: T) => {
            if (item) {
                res.status(200).json(item);
            } else {
                res.status(404).send();
            }
        });
    }
    update(req: Request, res: Response): void {
        const id = parseInt(req.params.id);
        this.repository.update(id, req.body).then(() => {
            this.repository.find(id).then((item: T) => {
                if (item) {
                    res.status(200).json(item);
                } else {
                    res.status(404).send();
                }
            });
        });
    }
    delete(req: Request, res: Response): void {
        const id = parseInt(req.params.id);
        this.repository.delete(id).then(() => {
            res.status(204).send();
        });
    }
    query(req: Request, res: Response): void {
        const q = req.query.q as string;
        this.repository.customQuery(q).then((items: T[]) => {
            res.status(200).json(items);
        });
    }

    getRouter(): Router {
        return this.router;
    }
}

export const controller = <T extends { [key: string]: any; }>(t: new (...args: any[]) => T) => new Controller<T>(t);