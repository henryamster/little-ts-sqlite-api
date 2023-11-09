import { ColumnType } from "./TypeMap";

export class Column {
    name: string;
    type: ColumnType;
    constructor(name: string, type: ColumnType) {
        this.name = name;
        this.type = type;
    }
}
