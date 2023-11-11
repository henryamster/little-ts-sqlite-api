import { Column } from "./Column";

export class Table {
  tableName: string;
  columns: Column[];
  constructor(tableName: string, columns: Column[]) {
    this.tableName = tableName;
    this.columns = columns;
  }
}

export function inferTableFromConstructor(constructor: { new (): any }): Table {
  const instance = new constructor();
  const columns = Object.keys(instance).map((key) => {
    const type = Reflect.getMetadata("design:type", instance, key).name;
    return { name: key, type };
  });
  return {
    tableName: constructor.name,
    columns,
  };
}
