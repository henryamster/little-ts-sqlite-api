import { Column } from "./Column";

export class Table {
    tableName: string;
    columns: Column[];
    constructor(tableName: string, columns: Column[]) {
        this.tableName = tableName;
        this.columns = columns;
    }
}
