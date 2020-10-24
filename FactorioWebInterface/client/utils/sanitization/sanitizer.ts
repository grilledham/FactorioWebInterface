export interface ISanitizer<T> {
    sanitize(value: any, obj?: T): any;
}

export class Trim implements ISanitizer<void>{
    sanitize(value: string) {
        return value?.trim();
    }
}

