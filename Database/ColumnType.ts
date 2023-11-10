export function ColumnType(type: string) {
    return Reflect.metadata('design:type', { name: type });
}
