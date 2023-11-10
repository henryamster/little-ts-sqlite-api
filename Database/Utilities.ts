export function inferTableFromConstructor(constructor: { new (): any }) {
    const instance = new constructor();
    const columns = Object.keys(instance).map(key => {
        const type = Reflect.getMetadata('design:type', instance, key).name;
        return { name: key, type };
    });
    return {
        tableName: constructor.name,
        columns
    };
}