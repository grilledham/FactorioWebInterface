import { IValidationRule } from "../validation/module";
import { DecoratorStorage } from "../decoratorStorage";
import { FormModel } from "./formModel";
import { ISanitizer } from "../sanitization/module";

export interface propertyDecoratorArgs<T> {
    displayName?: string;
    defaultValue?: any;
    sanitizers?: ISanitizer<T>[];
    validators?: IValidationRule<T>[];
}

export function formProperty(args?: propertyDecoratorArgs<any>) {
    return function (target: Object, property: string) {
        DecoratorStorage.set(target, formProperty, property, args);

        Object.defineProperty(target, property, {
            get() {
                let self = this as FormModel<any>;
                return self.get(property);
            },
            set(value: any) {
                let self = this as FormModel<any>;
                self.set(property, value);
            },
            enumerable: true
        });
    }
}