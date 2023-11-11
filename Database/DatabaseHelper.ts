import { Database } from "./Database";
import { Column, ColumnType } from "./Column";
import { Table } from "./Table";
import { LogEvent, LogEventDecorator } from "../Utilities/Logger";

export class DatabaseHelper {
  static ColumnGenerator(name: string, type: ColumnType): Column {
    LogEvent.fromObject({
      level: "info",
      message: "DatabaseHelper.ColumnGenerator() called",
      data: {
        name: name,
        type: type,
      },
      timestamp: new Date().toISOString(),
    });
    return new Column(name, type);
  }

  static TableGenerator<T extends { new (...args: any[]): {} }>(
    tableName: string,
    classConstructor: T
  ): Table {
    const instance = new classConstructor();
    const columns = Object.keys(instance).map((key) => {
      const typeMetadata = Reflect.getMetadata("design:type", instance, key);
      const type = typeMetadata ? typeMetadata.name : "undefined";
      return { name: key, type };
    });
    LogEvent.fromObject({
      level: "info",
      message: "DatabaseHelper.TableGenerator() called",
      data: {
        tableName: tableName,
        classConstructor: classConstructor,
      },
      timestamp: new Date().toISOString(),
    });
    return {
      tableName: classConstructor.name,
      columns,
    };
  }

  static DatabaseGenerator(tables: Table[]): Database {
    LogEvent.fromObject({
      level: "info",
      message: "DatabaseHelper.DatabaseGenerator() called",
      data: {
        tables: tables,
      },
      timestamp: new Date().toISOString(),
    });
    return new Database(tables);
  }

  static RecordGenerator<T extends Record<string, unknown>>(object: T): T {
    LogEvent.fromObject({
      level: "info",
      message: "DatabaseHelper.RecordGenerator() called",
      data: {
        object: object,
      },
      timestamp: new Date().toISOString(),
    });
    return object;
  }
}
