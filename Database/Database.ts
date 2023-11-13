import { Table } from "./Table";
import { db } from "./DataLayer";
import { LogEvent } from "../Utilities/Logger";

export class Database {
    public dropAndCreateDatabase() {
        // Drop all tables from database
        for (const table of this.tables) {
            const tableName = table.tableName;
            const query = `DROP TABLE IF EXISTS ${tableName}`;
            this.run(query);

            LogEvent.fromObject({
                level: 'info',
                message: 'Database.dropAndCreateDatabase() called',
                data: {
                    query: query
                },
                timestamp: new Date().toISOString()
            });
        }
        // Create all tables in database
        this.initializeDbContext();
    }
    tables: Table[];
    constructor(tables: Table[]) {
        this.tables = tables;
    }

    // typeMap = Object.fromEntries(typemap.map(item => [item.typescriptType, item.sqliteType]));

    typeMap = {
        'number': 'INTEGER',
        'string': 'TEXT',
        'boolean': 'INTEGER',
        'Date': 'TEXT',
        // Add other type mappings as needed
    };

    public initializeDbContext() {
        for (const table of this.tables) {
            const tableName = `"${table.tableName}"`; // Wrap table name in double quotes
            const columns = table.columns;
            const columnDefinitions = columns.map(column => {
                const columnType = this.typeMap[column.type as keyof typeof this.typeMap];
                if (!columnType) {
                    throw new Error(`Unsupported column type '${column.type}' for column '${column.name}' in table '${table.tableName}'`);
                }
                return `${column.name} ${columnType}`;
            }).join(',');
            const query = `CREATE TABLE IF NOT EXISTS ${tableName} (${columnDefinitions})`;
            this.run(query);

            LogEvent.fromObject({
                level: 'info',
                message: 'Database.initializeDbContext() called',
                data: {
                    query: query
                },
                timestamp: new Date().toISOString()
            });
        
        }
    }

    public clearDatabase() {
        for (const table of this.tables) {
            const tableName = `"${table.tableName}"`; // Wrap table name in double quotes
            const query = `DELETE FROM ${tableName}`;
            this.run(query);

            LogEvent.fromObject({
                level: 'info',
                message: 'Database.clearDatabase() called',
                data: {
                    query: query
                },
                timestamp: new Date().toISOString()
            });
           
        }
    }

    protected async run(query: string, params?: any[]) {

        LogEvent.fromObject({
            level: 'info',
            message: 'Database.run() called',
            data: {
                query: query,
                params: params
            },
            timestamp: new Date().toISOString()
        });
        return await db.run(query, params);
    }
}
