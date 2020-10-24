﻿import "./numberField.ts.less";
import { EventListener } from "../utils/eventListener";
import { InputFieldBase } from "./inputFieldBase";
import { Label } from "./label";

export class NumberField extends InputFieldBase {
    private _input: HTMLInputElement;

    constructor(property?: string, header?: string | Label) {
        super(property, header);

        this._input = document.createElement('input');
        this._input.id = this._label.htmlFor;
        this._input.type = 'number';
        this._fieldBody.insertBefore(this._input, this._error);
    }

    get value(): number {
        return this._input.valueAsNumber;
    }
    set value(value: number) {
        this._input.valueAsNumber = value;
    }

    get enabled(): boolean {
        return !this._input.disabled;
    }
    set enabled(value: boolean) {
        this._input.disabled = !value;
    }

    onChange(handler: (value: number) => void): () => void {
        let callback = () => handler(this.value)

        return EventListener.onChange(this._input, callback);
    }

    onInput(handler: (value: number) => void): () => void {
        let callback = () => handler(this.value)

        return EventListener.onInput(this._input, callback);
    }
}

customElements.define('a-number-field', NumberField);