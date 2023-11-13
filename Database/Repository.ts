import { db } from "./DataLayer";
import { LogEvent, LogEventDecorator } from "../Utilities/Logger";
import { QuerySanitizer } from "../API/QuerySanitizer";

export class Repository<
  T extends {
    id?: number;
    [key: string]: any;
  }
> {
  table: string;
  constructor(table: string) {
    this.table = table;
  }

  public async all(): Promise<T[]> {
    const query = `SELECT * FROM ${this.table}`;
    LogEvent.fromObject({
      level: "info",
      message: "Repository.all() called",
      data: {
        query: query,
      },
      timestamp: new Date().toISOString(),
    });

    return await new Promise<T[]>((resolve, reject) => {
      db.all(query, (err, rows) => {
        if (err) {
          LogEvent.fromObject({
            level: "error",
            message: "Repository.all() called",
            data: {
              query: query,
              error: err,
            },
            timestamp: new Date().toISOString(),
          });

          reject(err);
        } else {
          LogEvent.fromObject({
            level: "info",
            message: "Repository.all() called",
            data: {
              query: query,
              rows: rows,
            },
            timestamp: new Date().toISOString(),
          });
          resolve(rows as T[]);
        }
      });
    });
  }

  public async find(id: number): Promise<T> {
    const query = `SELECT * FROM ${this.table} WHERE id = ?`;
    LogEvent.fromObject({
      level: "info",
      message: "Repository.find() called",
      data: {
        query: query,
        id: id,
      },
      timestamp: new Date().toISOString(),
    });
    return await new Promise<T>((resolve, reject) => {
      db.get(query, [id], (err, row) => {
        if (err) {
          LogEvent.fromObject({
            level: "error",
            message: "Repository.find() called",
            data: {
              query: query,
              id: id,
              error: err,
            },
            timestamp: new Date().toISOString(),
          });

          reject(err);
        } else {
          LogEvent.fromObject({
            level: "info",
            message: "Repository.find() called",
            data: {
              query: query,
              id: id,
              row: row,
            },
            timestamp: new Date().toISOString(),
          });
          resolve(row as T);
        }
      });
    });
  }

  /** const messages = await testMessageController.repository.customQuery(
    "SELECT MAX(id) FROM TestMessage"
  ); */

  public async create(item: T): Promise<number> {
    // check if item has id property
    let autoIncId = 0;
    LogEvent.fromObject({
      level: "info",
      message: "Repository.create() called",
      data: {
        item: JSON.stringify(item),
      },
      timestamp: new Date().toISOString(),
    });
    const id = await this.customQuery(`SELECT MAX(id) FROM ${this.table}`);
    // Set the id
    autoIncId = id[0]["MAX(id)"] !== null ? id[0]["MAX(id)"] + 1 : 0;
    LogEvent.fromObject({
      level: "info",
      message: "Repository.create() called",
      data: {
        item: item,
        id: autoIncId,
      },
      timestamp: new Date().toISOString(),
    });
    item.id = autoIncId;

    const columns = Object.keys(item).join(",");
    const placeholders = Object.keys(item)
      .map((key) => "?")
      .join(",");
    const values = Object.values(item);
    const query = `INSERT INTO ${this.table} (${columns}) VALUES (${placeholders})`;
    LogEvent.fromObject({
      level: "info",
      message: "Repository.create() called",
      data: {
        query: query,
        item: item,
      },
      timestamp: new Date().toISOString(),
    });

    return await new Promise<number>((resolve, reject) => {
      db.run(query, values, function (err) {
        if (err) {
          LogEvent.fromObject({
            level: "error",
            message: "Repository.create() called",
            data: {
              query: query,
              item: item,
              error: err,
            },
            timestamp: new Date().toISOString(),
          });

          reject(err);
        } else {
          LogEvent.fromObject({
            level: "info",
            message: "Repository.create() called",
            data: {
              query: query,
              item: item,
              id: this.lastID,
            },
            timestamp: new Date().toISOString(),
          });

          item.id = this.lastID;
          resolve(this.lastID);
        }
      });
    });

  }

  public async update(id: number, item: T): Promise<void> {
    const columns = Object.keys(item)
      .map((key) => `${key} = ?`)
      .join(",");
    const values = Object.values(item);
    const query = `UPDATE ${this.table} SET ${columns} WHERE id = ?`;
    LogEvent.fromObject({
      level: "info",
      message: "Repository.update() called",
      data: {
        query: query,
        id: id,
        item: item,
      },
      timestamp: new Date().toISOString(),
    });

    return await new Promise<void>((resolve, reject) => {
      db.run(query, [...values, id], function (err) {
        if (err) {
          LogEvent.fromObject({
            level: "error",
            message: "Repository.update() called",
            data: {
              query: query,
              id: id,
              item: item,
              error: err,
            },
            timestamp: new Date().toISOString(),
          });

          reject(err);
        } else {
          LogEvent.fromObject({
            level: "info",
            message: "Repository.update() called",
            data: {
              query: query,
              id: id,
              item: item,
            },
            timestamp: new Date().toISOString(),
          });
          resolve();
        }
      });
    });
  }

  public async delete(id: number): Promise<void> {
    LogEvent.fromObject({
      level: "info",
      message: "Repository.delete() called",
      data: {
        id: id,
      },
      timestamp: new Date().toISOString(),
    });
    const query = `DELETE FROM ${this.table} WHERE id = ?`;
    return await new Promise<void>((resolve, reject) => {
      db.run(query, [id], function (err) {
        if (err) {
          LogEvent.fromObject({
            level: "error",
            message: "Repository.delete() called",
            data: {
              query: query,
              id: id,
              error: err,
            },
            timestamp: new Date().toISOString(),
          });

          reject(err);
        } else {
          LogEvent.fromObject({
            level: "info",
            message: "Repository.delete() called",
            data: {
              query: query,
              id: id,
            },
            timestamp: new Date().toISOString(),
          });
          resolve();
        }
      });
    });
  }

  public async typedQuery<T>(query: string, params?: any[]): Promise<T[]> {
    LogEvent.fromObject({
      level: "info",
      message: "Repository.typedQuery() called",
      data: {
        query: query,
        params: params,
      },
      timestamp: new Date().toISOString(),
    });
    return await new Promise<T[]>((resolve, reject) => {
      db.all(query, params, (err, rows) => {
        if (err) {
          LogEvent.fromObject({
            level: "error",
            message: "Repository.typedQuery() called",
            data: {
              query: query,
              params: params,
              error: err,
            },
            timestamp: new Date().toISOString(),
          });

          reject(err);
        } else {
          LogEvent.fromObject({
            level: "info",
            message: "Repository.typedQuery() called",
            data: {
              query: query,
              params: params,
              rows: rows,
            },
            timestamp: new Date().toISOString(),
          });

          resolve(rows as T[]);
        }
      });
    });
  }

  public async customQuery(query: string, params?: any[]): Promise<T[]> {
    LogEvent.fromObject({
      level: "info",
      message: "Executing custom query",
      data: {
        query: QuerySanitizer.santizieQuery(query),
        params: params,
      },
      timestamp: new Date().toISOString(),
    });

    return new Promise<T[]>((resolve, reject) => {
      db.all(query, params, (err, rows) => {
        if (err) {
          LogEvent.fromObject({
            level: "error",
            message: "Error executing custom query",
            data: {
              query: query,
              params: params,
              error: err,
            },
            timestamp: new Date().toISOString(),
          });

          reject(err);
          throw new Error(`Error executing query: ${err.message}`);
        } else {
          LogEvent.fromObject({
            level: "info",
            message: "Custom query executed successfully",
            data: {
              query: query,
              params: params,
              rows: rows,
            },
            timestamp: new Date().toISOString(),
          });

          if (Array.isArray(rows)) {
            LogEvent.fromObject({
              level: "info",
              message: "Custom query executed successfully",
              data: {
                query: query,
                params: params,
                rows: rows,
              },
              timestamp: new Date().toISOString(),
            });
            resolve(rows as T[]);
          } else {
            LogEvent.fromObject({
              level: "error",
              message: "Custom query executed successfully",
              data: {
                query: query,
                params: params,
                rows: rows,
              },
              timestamp: new Date().toISOString(),
            });
            reject(new Error("Query result is not an array"));
          }
        }
      });
    });
  }
  getTypeName(): string {
    return this.table;
  }
}

export const repo = <T extends { [key: string]: any }>(
  t: new (...args: any[]) => T
) => new Repository<T>(t.name);
