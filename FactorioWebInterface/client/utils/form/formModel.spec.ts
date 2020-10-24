import { formProperty } from "./decorators";
import { strict } from "assert";
import { FormModel, TouchMode } from "./formModel";
import { ValidationRules, ValidationResult } from "../validation/module";
import { assertValidationResultEqual } from "../../testUtils/utils/validation";

describe('FormModel', function () {
    describe('get', function () {
        const unsetTestCases = [
            { name: 'undefined', value: undefined },
            { name: 'null', value: null },
        ];
        for (const testCase of unsetTestCases) {
            it(`${testCase.name} uses default value`, function () {
                // Arrange.
                class TestViewModel extends FormModel {
                    @formProperty({
                        defaultValue: 'default'
                    })
                    property: string = testCase.value;
                }

                // Act.
                let form = new TestViewModel();

                // Assert.
                strict.deepEqual(form.property, 'default');
                strict.deepEqual(form.get('property'), 'default');
            });
        }
    });

    describe('set', function () {
        it('when touch property to invalid report error', function () {
            // Arrange.
            class TestViewModel extends FormModel {
                @formProperty({
                    validators: [ValidationRules.maxLengthString(1)]
                })
                property: string;
            }

            let form = new TestViewModel();
            assertValidationResultEqual(form.errors.getError('property'), ValidationResult.validResult);

            let actualResult: ValidationResult;
            form.errors.errorChanged('property', event => actualResult = event);

            // Act.
            form.set('property', '123', { touch: TouchMode.touch });

            // Assert.
            const expectedResult = ValidationResult.error('property must not be longer than 1 characters but is 3.');
            assertValidationResultEqual(form.errors.getError('property'), expectedResult);
            assertValidationResultEqual(actualResult, expectedResult);
        });

        it('when first touch then set property to invalid report error', function () {
            // Arrange.
            class TestViewModel extends FormModel {
                @formProperty({
                    validators: [ValidationRules.maxLengthString(1)]
                })
                property: string;
            }

            let form = new TestViewModel();
            form.setTouched('property', true);

            assertValidationResultEqual(form.errors.getError('property'), ValidationResult.validResult);

            let actualResult: ValidationResult;
            form.errors.errorChanged('property', event => actualResult = event);            

            // Act.
            form.set('property', '123');

            // Assert.
            const expectedResult = ValidationResult.error('property must not be longer than 1 characters but is 3.');
            assertValidationResultEqual(form.errors.getError('property'), expectedResult);
            assertValidationResultEqual(actualResult, expectedResult);
        });

        it('when set untouched property to invalid without touching do not report error', function () {
            // Arrange.
            class TestViewModel extends FormModel {
                @formProperty({
                    validators: [ValidationRules.maxLengthString(1)]
                })
                property: string;
            }

            let form = new TestViewModel();
            form.setTouched('property', true);

            assertValidationResultEqual(form.errors.getError('property'), ValidationResult.validResult);

            let actualResult: ValidationResult;
            form.errors.errorChanged('property', event => actualResult = event);

            // Act.
            form.set('property', '123');

            // Assert.
            const expectedResult = ValidationResult.error('property must not be longer than 1 characters but is 3.');
            assertValidationResultEqual(form.errors.getError('property'), expectedResult);
            assertValidationResultEqual(actualResult, expectedResult);
        });
    });
});