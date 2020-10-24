import { ObservableObject } from "../utils/observableObject";
import { FieldBase } from "./fieldBase";
import { ObservableErrors } from "../utils/observableErrors";
import { BaseElement, Lifecycle } from "./baseElement";
import { VirtualComponent } from "./virtualComponent";
import { FlexPanel } from "./flexPanel";
import { NodeHelper } from "../utils/nodeHelper";
import { Observable } from "../utils/observable";
import { FormModel, SetOptions, TouchMode, ValidationMode } from "../utils/form/formModel";

export class VirtualForm extends VirtualComponent {
    private static _quickSetOptions: SetOptions = {
        touch: TouchMode.touch,
        validate: ValidationMode.validate,
        sanitize: false
    };

    private static _setOptions: SetOptions = {
        touch: TouchMode.touch,
        validate: ValidationMode.validate,
        sanitize: true
    };

    private _subscriptions: (() => void)[] = [];
    private _fields: FieldBase[];

    constructor(private dataContext: ObservableObject, fieldsOrBaseElement?: FieldBase[] | BaseElement) {
        super();

        let parent: BaseElement;

        if (fieldsOrBaseElement == null) {
            parent = new FlexPanel(FlexPanel.classes.vertical);
        } else if (Array.isArray(fieldsOrBaseElement)) {
            parent = new FlexPanel(FlexPanel.classes.vertical);
            this._fields = fieldsOrBaseElement;
            parent.append(...this._fields);
        } else {
            parent = fieldsOrBaseElement;
            this._fields = NodeHelper.getByInstanceOf(parent, FieldBase);
        }

        parent.onLifecycle(event => this.lifecycle(event));
        this._root = parent;
    }

    set isHorizontal(value: boolean) {
        if (value) {
            for (let field of this._fields) {
                field.classList.add('is-horizontal');
            }
        } else {
            for (let field of this._fields) {
                field.classList.remove('is-horizontal');
            }
        }
    }

    set hideErrors(value: boolean) {
        if (value) {
            for (let field of this._fields) {
                field.classList.add('hide-error');
            }
        }
        else {
            for (let field of this._fields) {
                field.classList.remove('hide-error');
            }
        }
    }

    private lifecycle(event: Lifecycle) {
        switch (event) {
            case 'connectedCallback':
                this.connected();
                return;
            case 'disconnectedCallback':
                this.disconnected();
                return;
            default:
        }
    }

    private connected() {
        let dataContext = this.dataContext;


        for (let field of this._fields) {
            let property = field.property;
            if (property == null) {
                continue;
            }

            dataContext.bind(property, event => field.value = event, this._subscriptions);

            if (dataContext instanceof FormModel) {
                let formModel = dataContext as FormModel;

                let quickFieldSub = field.onInput(value => formModel.set(property, value, VirtualForm._quickSetOptions));
                this._subscriptions.push(quickFieldSub);

                let fieldSub = field.onChange(value => formModel.set(property, value, VirtualForm._setOptions));
                this._subscriptions.push(fieldSub);
            } else {
                let fieldSub = field.onChange(value => dataContext[property] = value);
                this._subscriptions.push(fieldSub);
            }
        }

        if (ObservableErrors.isType(this.dataContext)) {
            let errors = this.dataContext.errors;
            for (let field of this._fields) {
                let property = field.property;
                if (property == null) {
                    continue;
                }

                field.error = errors.getError(property).error;

                let subscription = errors.errorChanged(property, event => field.error = event.error);
                this._subscriptions.push(subscription);
            }
        }
    }

    private disconnected() {
        Observable.unSubscribeAll(this._subscriptions);
    }
}