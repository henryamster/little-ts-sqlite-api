import { typemap } from "./TypeMap";
import { Table } from "./Table";
import { db } from "./DataLayer";

export class Database {
    public dropAndCreateDatabase() {
        // Drop all tables from database
        for (const table of this.tables) {
            const tableName = table.tableName;
            const query = `DROP TABLE IF EXISTS ${tableName}`;
            this.run(query);
            console.log(query);
        }
        // Create all tables in database
        this.initializeDbContext();
    }
    tables: Table[];
    constructor(tables: Table[]) {
        this.tables = tables;
    }

    typeMap = Object.fromEntries(typemap.map(item => [item.typescriptType, item.sqliteType]));

    public initializeDbContext() {
        for (const table of this.tables) {
            const tableName = table.tableName;
            const columns = table.columns;
            // Use the type map to get the correct type for each column
            const columnDefinitions = columns.map(column => `${column.name} ${this.typeMap[column.type] || column.type}`).join(',');
            const query = `CREATE TABLE IF NOT EXISTS ${tableName} (${columnDefinitions})`;
            this.run(query);
            console.log(query);
        }
    }

    public clearDatabase() {
        for (const table of this.tables) {
            const tableName = table.tableName;
            const query = `DELETE FROM ${tableName}`;
            this.run(query);
            console.log(query);
        }
    }


    protected async run(query: string, params?: any[]) {
        return await db.run(query, params);
    }
}
