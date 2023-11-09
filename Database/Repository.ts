import { db } from "./DataLayer";

export class Repository<T extends { [key: string]: any; }> {
    table: string;
    constructor(table: string) {
        this.table = table;
    }
    public async all(): Promise<T[]> {
        const query = `SELECT * FROM ${this.table}`;
        return await new Promise<T[]>((resolve, reject) => {
            db.all(query, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows as T[]);
                }
            });
        });
    }
    public async find(id: number): Promise<T> {
        const query = `SELECT * FROM ${this.table} WHERE id = ?`;
        return await new Promise<T>((resolve, reject) => {
            db.get(query, [id], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row as T);
                }
            });
        });
    }
    public async create(item: T): Promise<number> {
        const columns = Object.keys(item).join(',');
        const placeholders = Object.keys(item).map(key => '?').join(',');
        const values = Object.values(item);
        const query = `INSERT INTO ${this.table} (${columns}) VALUES (${placeholders})`;
        return await new Promise<number>((resolve, reject) => {
            db.run(query, values, function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.lastID);
                }
            });
        });
    }
    public async update(id: number, item: T): Promise<void> {
        const columns = Object.keys(item).map(key => `${key} = ?`).join(',');
        const values = Object.values(item);
        const query = `UPDATE ${this.table} SET ${columns} WHERE id = ?`;
        return await new Promise<void>((resolve, reject) => {
            db.run(query, [...values, id], function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    public async delete(id: number): Promise<void> {
        const query = `DELETE FROM ${this.table} WHERE id = ?`;
        await db.run(query, [id]);
    }

    public async customQuery(query: string, params?: any[]): Promise<T[]> {
        return await new Promise<T[]>((resolve, reject) => {
            db.all(query, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows as T[]);
                }
            });
        });
    }
}

export const repo = <T extends { [key: string]: any; }>(t: new (...args: any[]) => T) => new Repository<T>(t.name);

