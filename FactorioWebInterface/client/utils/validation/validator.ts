import { ValidationResult } from "./ValidationResult";
import { IValidationGroup, PropertyValidation } from "./validationGroup";

export class Validator<T> {
    private _ruleMap = new Map<any, IValidationGroup<T>>();

    constructor(private obj: T, rules: IValidationGroup<T>[]) {
        for (let i = 0; i < rules.length; i++) {
            let rule = rules[i];
            this._ruleMap.set(rule.key, rule);
        }
    }

    validate(key: any, value?: any): ValidationResult {
        let validationGroup = this._ruleMap.get(key);

        if (validationGroup === undefined) {
            return ValidationResult.validResult;
        }

        return validationGroup.validate(this.obj, value);
    }

    propertyValidation(property: string): PropertyValidation<T> {
        let validationGroup = this._ruleMap.get(property);


        if (validationGroup == null) {
            validationGroup = new PropertyValidation<T>(property);
            this._ruleMap.set(property, validationGroup);
        }

        if (!(validationGroup instanceof PropertyValidation)) {
            throw 'property key is already in use for a non PropertyValidation';
        }

        return validationGroup;
    }
}

