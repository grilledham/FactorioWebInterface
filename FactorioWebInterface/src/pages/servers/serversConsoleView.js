import { VirtualComponent } from "../../components/virtualComponent";
import { Collapse } from "../../components/collapse";
import { Select } from "../../components/select";
import { FlexPanel } from "../../components/flexPanel";
import { Button, iconButton } from "../../components/button";
import { Icon } from "../../components/icon";
import { ConsoleMessageView } from "./consoleMessageView";
import { TextInput } from "../../components/textInput";
import { ObservableObjectBindingSource } from "../../utils/bindingSource";
import { Label } from "../../components/label";
export class ServersConsoleView extends VirtualComponent {
    constructor(serversConsoleViewModel) {
        super();
        let headerPanel = new FlexPanel(FlexPanel.classes.horizontal, FlexPanel.classes.spacingNone, FlexPanel.classes.childSpacingLarge);
        headerPanel.style.alignItems = 'center';
        let serverIdSelect = new Select(serversConsoleViewModel.serverIds);
        serverIdSelect.icon = new Icon(Icon.classes.server);
        serverIdSelect.style.fontSize = '1rem';
        serverIdSelect.style.fontWeight = 'normal';
        serverIdSelect.style.margin = '-0.3em 1em -0.3em 1em';
        serverIdSelect.onclick = event => event.stopPropagation();
        let labelPanel = new FlexPanel(FlexPanel.classes.horizontal, FlexPanel.classes.spacingNone, FlexPanel.classes.childSpacingLarge, FlexPanel.classes.wrap);
        let nameText = new Label()
            .bindContent(new ObservableObjectBindingSource(serversConsoleViewModel, 'nameText'))
            .addClasses(Label.classes.labelText, 'vertical-margins-small');
        let statusText = new Label()
            .bindContent(new ObservableObjectBindingSource(serversConsoleViewModel, 'statusText'))
            .addClasses(Label.classes.labelText, 'vertical-margins-small');
        let versionText = new Label()
            .bindContent(new ObservableObjectBindingSource(serversConsoleViewModel, 'versionText'))
            .addClasses(Label.classes.labelText, 'vertical-margins-small');
        labelPanel.append(nameText, statusText, versionText);
        headerPanel.append('Console', serverIdSelect, labelPanel);
        let mainPanel = new FlexPanel(FlexPanel.classes.vertical, FlexPanel.classes.childSpacing);
        let topPanel = new FlexPanel(FlexPanel.classes.horizontal, FlexPanel.classes.childSpacingSmall, FlexPanel.classes.wrap, FlexPanel.classes.spacingNone);
        let resumeButton = iconButton(Icon.classes.play, 'Resume', Button.classes.success)
            .setCommand(serversConsoleViewModel.resumeCommand)
            .bindTooltip(new ObservableObjectBindingSource(serversConsoleViewModel, 'resumeTooltip'));
        let loadButton = iconButton(Icon.classes.play, 'Load', Button.classes.success)
            .setCommand(serversConsoleViewModel.loadCommand)
            .bindTooltip(new ObservableObjectBindingSource(serversConsoleViewModel, 'loadTooltip'));
        let startScenarioButton = iconButton(Icon.classes.play, 'Start Scenario', Button.classes.success)
            .setCommand(serversConsoleViewModel.startScenarioCommand)
            .bindTooltip(new ObservableObjectBindingSource(serversConsoleViewModel, 'startScenarioTooltip'));
        let saveButton = iconButton(Icon.classes.save, 'Save', Button.classes.success)
            .setCommand(serversConsoleViewModel.saveCommand)
            .bindTooltip(new ObservableObjectBindingSource(serversConsoleViewModel, 'saveTooltip'));
        let manageVersionButton = iconButton(Icon.classes.download, 'Manage Version', Button.classes.link)
            .setCommand(serversConsoleViewModel.manageVersionCommand)
            .setTooltip(serversConsoleViewModel.manageVersionTooltip);
        let stopButton = iconButton(Icon.classes.stop, 'Stop', Button.classes.danger)
            .setCommand(serversConsoleViewModel.stopCommand)
            .bindTooltip(new ObservableObjectBindingSource(serversConsoleViewModel, 'stopTooltip'));
        let forceStopButton = iconButton(Icon.classes.bomb, 'Force Stop', Button.classes.danger)
            .setCommand(serversConsoleViewModel.forceStopCommand)
            .setTooltip(serversConsoleViewModel.forceStopTooltip);
        topPanel.append(resumeButton, loadButton, saveButton, startScenarioButton, manageVersionButton, stopButton, forceStopButton);
        let messageView = new ConsoleMessageView(serversConsoleViewModel.messages);
        let bottomPanel = new FlexPanel(FlexPanel.classes.horizontal, FlexPanel.classes.childSpacing, FlexPanel.classes.spacingNone);
        let sendInput = new TextInput();
        sendInput.placeholder = 'Message or Command';
        sendInput.onKeyUp(event => serversConsoleViewModel.sendInputKey(event.keyCode));
        sendInput.bindValue(new ObservableObjectBindingSource(serversConsoleViewModel, 'sendText'));
        let sendButton = new Button('Send')
            .setCommand(serversConsoleViewModel.sendCommand);
        bottomPanel.append(sendInput, sendButton);
        mainPanel.append(topPanel, messageView.root, bottomPanel);
        let collapse = new Collapse(headerPanel, mainPanel);
        collapse.open = true;
        collapse.classList.add('is-4', 'border', 'header');
        this._root = collapse;
    }
}
//# sourceMappingURL=serversConsoleView.js.map