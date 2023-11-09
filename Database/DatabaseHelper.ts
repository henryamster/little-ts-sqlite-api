import { SQLITE_TYPE_KEY, ColumnType } from "./TypeMap";
import { Database } from "./Database";
import { Column } from "./Column";
import { Table } from "./Table";




export class DatabaseHelper {
    static ColumnGenerator<T extends { new(...args: any[]): {}; }>(classConstructor: T) {
        const instance = new classConstructor();
        const keys = Object.keys(instance);
        const columns = keys.map(key => {
            const sqliteType = Reflect.getMetadata(SQLITE_TYPE_KEY, instance, key) as ColumnType;
            return new Column(key, sqliteType);
        });
        return columns;
    }

    static TableGenerator<T extends { new(...args: any[]): {}; }>(tableName: string, classConstructor: T) {
        const columns = this.ColumnGenerator(classConstructor);
        return new Table(tableName, columns);
    }

    static DatabaseGenerator(tables: Table[]) {
        return new Database(tables);
    }

    static RecordGenerator<T extends Record<string, unknown>>(object: T) {
        return object;
    }
}
