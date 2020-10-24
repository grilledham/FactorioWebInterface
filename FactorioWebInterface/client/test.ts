import "./components/component.less";
import { formProperty } from "./utils/form/module";
import { FormModel } from "./utils/form/formModel";
import { ValidationRules as Rules } from "./utils/validation/module";
import { VirtualComponent } from "./components/virtualComponent";
import { VirtualForm } from "./components/virtualForm";
import { TextField } from "./components/textField";
import { Sanitizers } from "./utils/sanitization/module";


let app = document.body;

class ViewModel extends FormModel<ViewModel> {
    @formProperty({
        displayName: 'Name',
        defaultValue: 'Some Name',
        sanitizers: [Sanitizers.trim],
        validators: [Rules.minMaxLengthString(3, 10)]
    })
    name: string;

    @formProperty({
        displayName: 'Age',
        defaultValue: '123',
        sanitizers: [Sanitizers.trim],
        validators: [Rules.notEmptyString]
    })
    age: string;
}

let viewModel = new ViewModel();

class View extends VirtualComponent {
    constructor(vm: ViewModel) {
        super();

        let form = new VirtualForm(vm, [
            new TextField('name', 'Name'),
            new TextField('age', 'Age')
        ]);

        this._root = form.root;
    }
}

let view = new View(viewModel);

app.append(view.root);