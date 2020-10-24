import { propertyOf } from "../types";
import { ObservableObject } from "../observableObject";
import { DecoratorStorage } from "../decoratorStorage";
import { formProperty, propertyDecoratorArgs } from "./decorators";
import { Validator, ValidationResult } from "../validation/module";
import { IObservableErrors, ObservableErrors } from "../observableErrors";
import { ISanitizer } from "../sanitization/module";

export enum TouchMode {
    keep,
    touch,
    clear
}

export enum ValidationMode {
    validate,
    skipIfValid,
    clear
}

export interface SetOptions {
    touch?: TouchMode;
    validate?: ValidationMode;
    sanitize?: boolean;
}

export abstract class FormModel<T = any> extends ObservableObject<T> implements IObservableErrors {
    private _propertyMap = new Map<string, any>();
    private _defaultValueMap = new Map<string, any>();
    private _touchedMap = new Set<string>();
    private _sanitizerMap = new Map<string, ISanitizer<T>[]>();

    private _errors = new ObservableErrors();
    private _validator: Validator<T>;

    get errors(): ObservableErrors {
        return this._errors;
    }

    constructor() {
        super();

        this._validator = new Validator<T>(this as any, []);

        this.init();
    }

    private init(): void {
        const propertyMap = DecoratorStorage.getPropertyMap(Object.getPrototypeOf(this), formProperty);

        for (const entry of propertyMap) {
            let property = entry[0];
            let args = entry[1] as propertyDecoratorArgs<T>;

            if (args.validators != null && args.validators.length != 0) {
                let propertyValidation = this._validator.propertyValidation(property);

                if (args.displayName != null) {
                    propertyValidation.displayName(args.displayName);
                }

                propertyValidation.rules(...args.validators);
            }

            if (args.defaultValue !== undefined) {
                this._defaultValueMap.set(property, args.defaultValue);
                this._propertyMap.set(property, args.defaultValue);
            }

            if (args.sanitizers != null && args.sanitizers.length != 0) {
                this._sanitizerMap.set(property, args.sanitizers);
            }
        }
    }

    isTouched(property: string): boolean {
        return this._touchedMap.has(property);
    }

    setTouched(property: string, touched = true): void {
        if (touched) {
            this._touchedMap.add(property);
        } else {
            this._touchedMap.delete(property);
        }
    }

    clearTouched(): void {
        this._touchedMap.clear();
    }

    validateAll(): boolean {
        let valid = true;

        for (const property of this._propertyMap.keys()) {
            let result = this._validator.validate(property);
            this._errors.setError(property, result);

            valid = valid && result.valid;
        }

        return valid;
    }

    get(property: propertyOf<T>): any {
        let value = this._propertyMap.get(property);
        return this.getOrDefault(property, value);
    }

    set(property: propertyOf<T>, value: any, options?: SetOptions): any {
        value = this.getOrDefault(property, value);

        let sanitizedValue = this.getSanitizedValue(property, value);
        if (options?.sanitize ?? true) {
            value = sanitizedValue;
        }

        let old = this.get(property);
        if (old === value) {
            return;
        }

        this._propertyMap.set(property, value);
        this.raise(property, value);

        let touchMode = options?.touch ?? TouchMode.keep;
        switch (touchMode) {
            case TouchMode.touch: {
                this._touchedMap.add(property);
                break;
            }
            case TouchMode.clear: {
                this._touchedMap.delete(property);
                break;
            }
        }

        let validationMode = options?.validate ?? ValidationMode.validate;
        switch (validationMode) {
            case ValidationMode.validate: {
                let result = this._validator.validate(property, sanitizedValue);
                this._errors.setError(property, result);
                break;
            }
            case ValidationMode.skipIfValid: {
                if (!this._errors.getError(property).valid) {
                    let result = this._validator.validate(property, sanitizedValue);
                    this._errors.setError(property, result);
                }
                break;
            }
            case ValidationMode.clear: {
                this._errors.setError(property, ValidationResult.validResult);
                break;
            }
        }

        return value;
    }

    private getOrDefault(property: propertyOf<T>, value: any): any {
        if (value != null) {
            return value;
        }

        let defaultValue = this._defaultValueMap.get(property);
        if (defaultValue !== undefined) {
            return defaultValue;
        }

        return value;
    }

    private getSanitizedValue(property: propertyOf<T>, value: any): any {
        let sanitizers = this._sanitizerMap.get(property);
        if (sanitizers == null) {
            return value;
        }

        for (const sanitizer of sanitizers) {
            value = sanitizer.sanitize(value, this as any);
        }

        return value;
    }
}
