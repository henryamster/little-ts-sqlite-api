import 'reflect-metadata'
export type ColumnType = 'INTEGER' | 'TEXT' | 'REAL' | 'BLOB';
export class Column {
    name: string;
    type: ColumnType;

    constructor(name: string, type: ColumnType) {
        this.name = name;
        this.type = type;
    }
}
export function ColumnType(type: string) {
    return Reflect.metadata('design:type', { name: type });
}

