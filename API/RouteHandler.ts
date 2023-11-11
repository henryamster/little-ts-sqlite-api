import Controller from './Controller';
import express from 'express';

export class RouteHandler<T extends { [key: string]: any; }> {
        constructor(public controller: Controller<T>, private app: express.Application) { }

        addRoute(method: 'get' | 'post' | 'put' | 'delete', path: string, handler: (req: express.Request, res: express.Response) => Promise<void>) {
                this.app[method](path, async (req, res) => {
                        try {
                                await handler(req, res);
                        } catch (error) {
                                res.status(500).json({ error: `${error}` });
                        }
                });
        }

        addGetRoute(path: string, handler: (req: express.Request, res: express.Response) => Promise<void>) {
                this.addRoute('get', path, handler);
        }

        addPostRoute(path: string, handler: (req: express.Request, res: express.Response) => Promise<void>) {
                this.addRoute('post', path, handler);
        }

        addPutRoute(path: string, handler: (req: express.Request, res: express.Response) => Promise<void>) {
                this.addRoute('put', path, handler);
        }

        addDeleteRoute(path: string, handler: (req: express.Request, res: express.Response) => Promise<void>) {
                this.addRoute('delete', path, handler);
        }

        addGetByIdRoute(path: string) {
                this.addGetRoute(`${path}/:id`, async (req, res) => {
                        const id = parseInt(req.params.id);
                        const item = await this.controller.repository.find(id);
                        res.json(item);
                });
        }

        addCreateRoute(path: string) {
                this.addPostRoute(path, async (req, res) => {
                        const id = await this.controller.repository.create(req.body);
                        const item = await this.controller.repository.find(id);
                        res.status(201).json(item);
                });
        }

        addUpdateRoute(path: string) {
                this.addPutRoute(`${path}/:id`, async (req, res) => {
                        const id = parseInt(req.params.id);
                        await this.controller.repository.update(id, req.body);
                        const item = await this.controller.repository.find(id);
                        res.json(item);
                });
        }

        addDeleteByIdRoute(path: string) {
                this.addDeleteRoute(`${path}/:id`, async (req, res) => {
                        const id = parseInt(req.params.id);
                        await this.controller.repository.delete(id);
                        res.sendStatus(204);
                });
        }
}

// Let's make it into a decorator:

class RouteHandlerDecorator<T extends { [key: string]: any; }> {
        constructor(public controller: Controller<T>, private app: express.Application) { }

        addRoute(method: 'get' | 'post' | 'put' | 'delete', path: string, handler: (req: express.Request, res: express.Response) => Promise<void>) {
                this.app[method](path, async (req, res) => {
                        try {
                                await handler(req, res);
                        } catch (error) {
                                res.status(500).json({ error: `${error}` });
                        }
                });
        }

        addGetRoute(path: string, handler: (req: express.Request, res: express.Response) => Promise<void>) {
                this.addRoute('get', path, handler);
        }

        addPostRoute(path: string, handler: (req: express.Request, res: express.Response) => Promise<void>) {
                this.addRoute('post', path, handler);
        }

        addPutRoute(path: string, handler: (req: express.Request, res: express.Response) => Promise<void>) {
                this.addRoute('put', path, handler);
        }

        addDeleteRoute(path: string, handler: (req: express.Request, res: express.Response) => Promise<void>) {
                this.addRoute('delete', path, handler);
        }

        addGetByIdRoute(path: string) {
                this.addGetRoute(`${path}/:id`, async (req, res) => {
                        const id = parseInt(req.params.id);
                        const item = await this.controller.repository.find(id);
                        res.json(item);
                });
        }

        addCreateRoute(path: string) {
                this.addPostRoute(path, async (req, res) => {
                        const id = await this.controller.repository.create(req.body);
                        const item = await this.controller.repository.find(id);
                        res.status(201).json(item);
                });
        }

        addUpdateRoute(path: string) {
                this.addPutRoute(`${path}/:id`, async (req, res) => {
                        const id = parseInt(req.params.id);
                        await this.controller.repository.update(id, req.body);
                        const item = await this.controller.repository.find(id);
                        res.json(item);
                });
        }

        addDeleteByIdRoute(path: string) {
                this.addDeleteRoute(`${path}/:id`, async (req, res) => {
                        const id = parseInt(req.params.id);
                        await this.controller.repository.delete(id);
                        res.sendStatus(204);
                }
                );
        }
}

export function CustomRoute<T extends { [key: string]: any; }>(controller: Controller<T>, app: express.Application) {
        return new RouteHandlerDecorator(controller, app);
}