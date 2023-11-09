export const SQLITE_TYPE_KEY = Symbol('sqliteType');
export type ColumnType = 'INTEGER' | 'TEXT' | 'REAL' | 'BLOB';
type TypescriptTypes = 'number' | 'string' | 'boolean' | 'object' | 'undefined' | 'symbol' | 'bigint' | 'function' | 'any' | 'unknown' | 'never' | 'void' | 'null' | 'array' | 'tuple' | 'enum' | 'interface' | 'class' | 'type' | 'union' | 'intersection' | 'literal' | 'conditional' | 'intrinsic' | 'reference' | 'nonPrimitive' | 'stringLiteral' | 'numberLiteral' | 'booleanLiteral';

export function SqliteType(sqliteType: ColumnType) {
    return Reflect.metadata(SQLITE_TYPE_KEY, sqliteType);
}
export const typemap = [
    { typescriptType: 'number', sqliteType: 'INTEGER' },
    { typescriptType: 'string', sqliteType: 'TEXT' },
    { typescriptType: 'boolean', sqliteType: 'INTEGER' },
    { typescriptType: 'object', sqliteType: 'BLOB' },
    { typescriptType: 'undefined', sqliteType: 'NULL' },
    { typescriptType: 'symbol', sqliteType: 'TEXT' },
    { typescriptType: 'bigint', sqliteType: 'INTEGER' },
    { typescriptType: 'function', sqliteType: 'TEXT' },
    { typescriptType: 'any', sqliteType: 'BLOB' },
    { typescriptType: 'unknown', sqliteType: 'BLOB' },
    { typescriptType: 'never', sqliteType: 'NULL' },
    { typescriptType: 'void', sqliteType: 'NULL' },
    { typescriptType: 'null', sqliteType: 'NULL' },
    { typescriptType: 'array', sqliteType: 'BLOB' },
    { typescriptType: 'tuple', sqliteType: 'BLOB' },
    { typescriptType: 'enum', sqliteType: 'TEXT' },
    { typescriptType: 'interface', sqliteType: 'TEXT' },
    { typescriptType: 'class', sqliteType: 'TEXT' },
    { typescriptType: 'type', sqliteType: 'TEXT' },
    { typescriptType: 'union', sqliteType: 'TEXT' },
    { typescriptType: 'intersection', sqliteType: 'TEXT' },
    { typescriptType: 'literal', sqliteType: 'TEXT' },
    { typescriptType: 'conditional', sqliteType: 'TEXT' },
    { typescriptType: 'intrinsic', sqliteType: 'TEXT' },
    { typescriptType: 'reference', sqliteType: 'TEXT' },
    { typescriptType: 'nonPrimitive', sqliteType: 'TEXT' },
    { typescriptType: 'stringLiteral', sqliteType: 'TEXT' },
    { typescriptType: 'numberLiteral', sqliteType: 'TEXT' },
    { typescriptType: 'booleanLiteral', sqliteType: 'TEXT' },
];
