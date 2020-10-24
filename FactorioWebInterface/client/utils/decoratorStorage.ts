export class DecoratorStorage {
    private static _map = new Map<Object, Map<any, Map<string, any>>>();

    static set(target: Object, key: any, property: string, value: any): void {
        let keyMap = DecoratorStorage.getPropertyMap(target, key);
        keyMap.set(property, value);
    }

    static get(target: Object, key: any, property: string): any {
        let keyMap = DecoratorStorage.getPropertyMap(target, key);
        return keyMap.get(property);
    }

    static getPropertyMap(target: Object, key: any): Map<string, any> {
        let map = DecoratorStorage._map;

        let keyMap = map.get(target);
        if (keyMap == null) {
            keyMap = new Map<any, Map<string, any>>();
            map.set(target, keyMap);
        }

        let propertyMap = keyMap.get(key);
        if (propertyMap == null) {
            propertyMap = new Map<string, any>();
            keyMap.set(key, propertyMap);
        }

        return propertyMap;
    }
}