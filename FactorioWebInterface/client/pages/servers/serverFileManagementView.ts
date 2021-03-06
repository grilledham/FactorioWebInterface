﻿import { VirtualComponent } from "../../components/virtualComponent";
import { ServerFileManagementViewModel, Destination } from "./serverFileManagementViewModel";
import { FlexPanel } from "../../components/flexPanel";
import { Collapse } from "../../components/collapse";
import { iconButton, Button } from "../../components/button";
import { Icon, leftIconWithContent } from "../../components/icon";
import { Progress } from "../../components/progress";
import { VirtualForm } from "../../components/virtualForm";
import { TextField } from "../../components/textField";
import { Select } from "../../components/select";
import { ObservableObjectBindingSource } from "../../utils/binding/module";

export class ServerFileManagementView extends VirtualComponent {
    constructor(serverFileManagementViewModel: ServerFileManagementViewModel) {
        super();

        let rows = new FlexPanel(FlexPanel.classes.vertical, FlexPanel.classes.childSpacing);
        let row1 = new FlexPanel(FlexPanel.classes.horizontal, FlexPanel.classes.spacingNone, FlexPanel.classes.childSpacingInclusive);
        let row2 = new FlexPanel(FlexPanel.classes.horizontal, FlexPanel.classes.spacingNone, FlexPanel.classes.childSpacingInclusive);
        let row3 = new FlexPanel(FlexPanel.classes.horizontal, FlexPanel.classes.spacingNone, FlexPanel.classes.childSpacingInclusive, FlexPanel.classes.grow);
        rows.append(row1, row2, row3);

        let uploadProgress = new Progress(p => `Uploading (${p.percentText})`);
        uploadProgress.classList.add('overlay');
        serverFileManagementViewModel.uploadProgress.subscribe(progress => uploadProgress.value = progress);

        let uploadIcon = leftIconWithContent(Icon.classes.upload, 'Upload Saves');

        let uploadButtonContent = document.createElement('div');
        uploadButtonContent.classList.add('button-spacing');
        uploadButtonContent.style.alignSelf = 'flex-start';
        uploadButtonContent.append(uploadIcon, uploadProgress);

        let uploadButton = new Button(uploadButtonContent, Button.classes.link, 'no-spacing')
            .setCommand(serverFileManagementViewModel.uploadSavesCommand)
            .bindTooltip(new ObservableObjectBindingSource(serverFileManagementViewModel, 'uploadSavesTooltip'));

        let deleteButton = iconButton(Icon.classes.trash, 'Delete Saves', Button.classes.danger)
            .setCommand(serverFileManagementViewModel.deleteSavesCommand)
            .bindTooltip(new ObservableObjectBindingSource(serverFileManagementViewModel, 'deleteSavesTooltip'));

        row1.append(uploadButton, deleteButton);

        let moveButton = iconButton(Icon.classes.shareSquare, 'Move Saves', Button.classes.link)
            .setCommand(serverFileManagementViewModel.moveSavesCommand)
            .bindTooltip(new ObservableObjectBindingSource(serverFileManagementViewModel, 'moveSavesTooltip'));

        let copyButton = iconButton(Icon.classes.clone, 'Copy Saves', Button.classes.link)
            .setCommand(serverFileManagementViewModel.copySavesCommand)
            .bindTooltip(new ObservableObjectBindingSource(serverFileManagementViewModel, 'copySavesTooltip'));

        let destinationLabel = document.createElement('label');
        destinationLabel.innerText = 'Destination:';
        destinationLabel.classList.add('label-text');
        destinationLabel.style.margin = '0.35em 0.5em';
        let destinationSelect = new Select(serverFileManagementViewModel.destinationsCollectionView, (item: Destination) => item.name);
        destinationSelect.style.fontSize = '1rem';
        row2.append(moveButton, copyButton, destinationLabel, destinationSelect);

        let renameButton = iconButton(Icon.classes.edit, 'Rename Save', Button.classes.link)
            .setCommand(serverFileManagementViewModel.renameSaveCommand)
            .bindTooltip(new ObservableObjectBindingSource(serverFileManagementViewModel, 'renameSavesTooltip'));

        let deflateProgress = new Progress(p => `Deflating`);
        deflateProgress.classList.add('overlay', Progress.classes.indeterminate);

        let deflateIcon = leftIconWithContent(Icon.classes.compressArrowsAlt, 'Deflate Save');

        let deflateButtonContent = document.createElement('div');
        deflateButtonContent.classList.add('button-spacing');
        deflateButtonContent.style.alignSelf = 'flex-start';
        deflateButtonContent.append(deflateIcon, deflateProgress);

        let deflateButton = new Button(deflateButtonContent, Button.classes.link, 'no-spacing')
            .setCommand(serverFileManagementViewModel.deflateSaveCommand)
            .bindTooltip(new ObservableObjectBindingSource(serverFileManagementViewModel, 'deflateSavesTooltip'));

        let nameInput = new TextField('newFileName', 'New Name:');
        nameInput.style.flexGrow = '1';
        let form = new VirtualForm(serverFileManagementViewModel, nameInput);
        form.isHorizontal = true;
        form.hideErrors = true;        

        row3.append(renameButton, deflateButton, form.root);

        let collapse = new Collapse('File Management', rows);
        collapse.open = true;
        collapse.classList.add('section');

        function updateUploadButton(isUploading: boolean) {
            if (isUploading) {
                uploadProgress.style.visibility = '';
                uploadIcon.style.visibility = 'hidden';
            } else {
                uploadProgress.style.visibility = 'hidden';
                uploadIcon.style.visibility = '';
            }
        }

        function updateDeflateButton(isDeflating: boolean) {
            if (isDeflating) {
                deflateProgress.style.visibility = '';
                deflateIcon.style.visibility = 'hidden';
            } else {
                deflateProgress.style.visibility = 'hidden';
                deflateIcon.style.visibility = '';
            }
        }

        serverFileManagementViewModel.isUploading.bind(event => updateUploadButton(event));
        serverFileManagementViewModel.isDeflating.bind(event => updateDeflateButton(event));

        this._root = collapse;
    }
}