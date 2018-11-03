var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as signalR from "@aspnet/signalr";
var MessageType;
(function (MessageType) {
    MessageType[MessageType["Output"] = 0] = "Output";
    MessageType[MessageType["Wrapper"] = 1] = "Wrapper";
    MessageType[MessageType["Control"] = 2] = "Control";
    MessageType[MessageType["Status"] = 3] = "Status";
    MessageType[MessageType["Discord"] = 4] = "Discord";
})(MessageType || (MessageType = {}));
const maxMessageCount = 100;
const divMessages = document.querySelector("#divMessages");
const tbMessage = document.querySelector("#tbMessage");
const btnSend = document.querySelector("#btnSend");
const serverName = document.getElementById('serverName');
const serverIdInput = document.getElementById('serverIdInput');
const resumeButton = document.getElementById('resumeButton');
const LoadButton = document.getElementById('loadButton');
const stopButton = document.getElementById('stopButton');
const forceStopButton = document.getElementById('forceStopButton');
const getStatusButton = document.getElementById('getStatusButton');
const statusText = document.getElementById('statusText');
const tempSaveFilesTable = document.getElementById('tempSaveFilesTable');
const localSaveFilesTable = document.getElementById('localSaveFilesTable');
const globalSaveFilesTable = document.getElementById('globalSaveFilesTable');
// XSRF/CSRF token, see https://docs.microsoft.com/en-us/aspnet/core/security/anti-request-forgery?view=aspnetcore-2.1
let requestVerificationToken = document.querySelector('input[name="__RequestVerificationToken"][type="hidden"]').value;
const fileUploadInput = document.getElementById('fileUploadInput');
const fileUplaodButton = document.getElementById('fileUploadButton');
const fileDeleteButton = document.getElementById('fileDeleteButton');
const fileMoveButton = document.getElementById('fileMoveButton');
const fileCopyButton = document.getElementById('fileCopyButton');
const destinationSelect = document.getElementById('destinationSelect');
const fileRenameButton = document.getElementById('fileRenameButton');
const fileRenameInput = document.getElementById('fileRenameInput');
const fileProgress = document.getElementById('fileProgress');
const configNameInput = document.getElementById('configNameInput');
const configDescriptionInput = document.getElementById('configDescriptionInput');
const configTagsInput = document.getElementById('configTagsInput');
const configMaxPlayersInput = document.getElementById('configMaxPlayersInput');
const configPasswordInput = document.getElementById('configPasswordInput');
const configPauseInput = document.getElementById('configPauseInput');
const configAdminInput = document.getElementById('configAdminInput');
const configSaveButton = document.getElementById('configSaveButton');
let messageCount = 0;
const connection = new signalR.HubConnectionBuilder()
    .withUrl("/FactorioControlHub")
    .build();
function getFiles() {
    return __awaiter(this, void 0, void 0, function* () {
        let tempFiles = yield connection.invoke('GetTempSaveFiles');
        buildFileTable(tempSaveFilesTable, tempFiles);
        let localFiles = yield connection.invoke('GetLocalSaveFiles');
        buildFileTable(localSaveFilesTable, localFiles);
        let globalFiles = yield connection.invoke('GetGlobalSaveFiles');
        buildFileTable(globalSaveFilesTable, globalFiles);
    });
}
function MakeTagInput(value) {
    let listItem = document.createElement('li');
    let input = document.createElement('input');
    listItem.appendChild(input);
    input.value = value;
    return listItem;
}
function getSettings() {
    return __awaiter(this, void 0, void 0, function* () {
        let settings = yield connection.invoke('GetServerSettings');
        configNameInput.value = settings.name;
        configDescriptionInput.value = settings.description;
        configTagsInput.innerHTML = '';
        for (let item of settings.tags) {
            let input = MakeTagInput(item);
            configTagsInput.appendChild(input);
        }
        let lastInput = MakeTagInput('');
        configTagsInput.appendChild(lastInput);
        configMaxPlayersInput.value = settings.max_players + "";
        configPasswordInput.value = settings.game_password;
        configPauseInput.checked = settings.auto_pause;
        configAdminInput.value = settings.admins.join(', ');
        serverName.innerText = settings.name;
    });
}
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield connection.start();
            let data = yield connection.invoke('SetServerId', serverIdInput.value);
            getFiles();
            getSettings();
            statusText.value = data.status;
            for (let message of data.messages) {
                writeMessage(message);
            }
        }
        catch (ex) {
            console.log(ex.message);
        }
    });
}
init();
connection.on("SendMessage", writeMessage);
connection.on('FactorioStatusChanged', (newStatus, oldStatus) => {
    console.log(`new: ${newStatus}, old: ${oldStatus}`);
    statusText.value = newStatus;
});
tbMessage.addEventListener("keyup", (e) => {
    if (e.keyCode === 13) {
        send();
    }
});
btnSend.addEventListener("click", send);
function send() {
    connection.send("SendToFactorio", tbMessage.value)
        .then(() => tbMessage.value = "");
}
resumeButton.onclick = () => {
    connection.invoke("Resume")
        .then((result) => console.log("resumed:" + result));
};
LoadButton.onclick = () => {
    let checkboxes = document.querySelectorAll('input[name="fileCheckbox"]:checked');
    if (checkboxes.length != 1) {
        alert('Select one file to load.');
        return;
    }
    let checkbox = checkboxes[0];
    let dir = checkbox.getAttribute('data-directory');
    let name = checkbox.getAttribute('data-name');
    let filePath = `${dir}/${name}`;
    connection.invoke("Load", filePath)
        .then((result) => {
        console.log("loaded:");
        console.log(result);
    });
};
stopButton.onclick = () => {
    connection.invoke("Stop")
        .then(() => console.log("stopped"));
};
forceStopButton.onclick = () => {
    connection.invoke("ForceStop")
        .then(() => console.log("force stopped"));
};
getStatusButton.onclick = () => {
    connection.invoke("GetStatus");
};
function writeMessage(message) {
    let div = document.createElement("div");
    let data;
    switch (message.messageType) {
        case MessageType.Output:
            data = `${message.message}`;
            break;
        case MessageType.Wrapper:
            data = `[Wrapper] ${message.message}`;
            break;
        case MessageType.Control:
            div.classList.add('bg-warning');
            data = `[Control] ${message.message}`;
            break;
        case MessageType.Discord:
            data = message.message;
            break;
        case MessageType.Status:
            div.classList.add('bg-info', 'text-white');
            data = message.message;
            break;
        default:
            data = "";
            break;
    }
    div.innerText = data;
    if (messageCount === 100) {
        let first = divMessages.firstChild;
        divMessages.removeChild(first);
    }
    else {
        messageCount++;
    }
    divMessages.appendChild(div);
    divMessages.scrollTop = divMessages.scrollHeight;
}
function buildFileTable(table, files) {
    let body = table.tBodies[0];
    body.innerHTML = "";
    for (let file of files) {
        let row = document.createElement('tr');
        let cell = document.createElement('td');
        let checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = 'fileCheckbox';
        checkbox.setAttribute('data-directory', file.directory);
        checkbox.setAttribute('data-name', file.name);
        cell.appendChild(checkbox);
        row.appendChild(cell);
        let cell2 = document.createElement('td');
        let link = document.createElement('a');
        link.innerText = file.name;
        link.href = `/admin/servers?handler=file&directory=${file.directory}&name=${file.name}`;
        cell2.appendChild(link);
        row.appendChild(cell2);
        createCell(row, formatDate(file.createdTime));
        createCell(row, formatDate(file.lastModifiedTime));
        createCell(row, file.size.toString());
        body.appendChild(row);
    }
}
function formatDate(dateString) {
    let date = new Date(dateString);
    return date.toUTCString();
}
function createCell(parent, content) {
    let cell = document.createElement('td');
    cell.innerText = content;
    parent.appendChild(cell);
}
fileUplaodButton.onclick = () => {
    fileUploadInput.click();
};
fileUploadInput.onchange = function (ev) {
    if (this.files.length == 0) {
        return;
    }
    let formData = new FormData();
    formData.set('directory', `${serverIdInput.value}/local_saves`);
    let files = fileUploadInput.files;
    for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
    }
    let xhr = new XMLHttpRequest();
    xhr.open('POST', '/admin/servers?handler=fileUpload', true);
    xhr.setRequestHeader('RequestVerificationToken', requestVerificationToken);
    xhr.upload.addEventListener('loadstart', function (event) {
        fileProgress.hidden = false;
        fileProgress.value = 0;
    }, false);
    xhr.upload.addEventListener("progress", function (event) {
        fileProgress.value = event.loaded / event.total;
    }, false);
    xhr.onloadend = function (event) {
        fileProgress.hidden = true;
        getFiles();
    };
    xhr.send(formData);
};
fileDeleteButton.onclick = () => __awaiter(this, void 0, void 0, function* () {
    let checkboxes = document.querySelectorAll('input[name="fileCheckbox"]:checked');
    if (checkboxes.length == 0) {
        alert('Please select saves to delete.');
        return;
    }
    let files = [];
    for (let checkbox of checkboxes) {
        let dir = checkbox.getAttribute('data-directory');
        let name = checkbox.getAttribute('data-name');
        let filePath = `${dir}/${name}`;
        files.push(filePath);
    }
    let result = yield connection.invoke('DeleteFiles', files);
    if (!result.success) {
        alert(JSON.stringify(result.errors));
    }
    getFiles();
});
fileMoveButton.onclick = () => __awaiter(this, void 0, void 0, function* () {
    let checkboxes = document.querySelectorAll('input[name="fileCheckbox"]:checked');
    if (checkboxes.length == 0) {
        alert('Please select saves to move.');
        return;
    }
    let files = [];
    for (let checkbox of checkboxes) {
        let dir = checkbox.getAttribute('data-directory');
        let name = checkbox.getAttribute('data-name');
        let filePath = `${dir}/${name}`;
        files.push(filePath);
    }
    let destination = destinationSelect.options[destinationSelect.selectedIndex].value;
    let result = yield connection.invoke('MoveFiles', destination, files);
    if (!result.success) {
        alert(JSON.stringify(result.errors));
    }
    getFiles();
});
fileCopyButton.onclick = () => __awaiter(this, void 0, void 0, function* () {
    let checkboxes = document.querySelectorAll('input[name="fileCheckbox"]:checked');
    if (checkboxes.length == 0) {
        alert('Please select saves to copy.');
        return;
    }
    let files = [];
    for (let checkbox of checkboxes) {
        let dir = checkbox.getAttribute('data-directory');
        let name = checkbox.getAttribute('data-name');
        let filePath = `${dir}/${name}`;
        files.push(filePath);
    }
    let destination = destinationSelect.options[destinationSelect.selectedIndex].value;
    let result = yield connection.invoke('CopyFiles', destination, files);
    if (!result.success) {
        alert(JSON.stringify(result.errors));
    }
    getFiles();
});
fileRenameButton.onclick = () => __awaiter(this, void 0, void 0, function* () {
    let checkboxes = document.querySelectorAll('input[name="fileCheckbox"]:checked');
    if (checkboxes.length != 1) {
        alert('Please select one file to rename.');
        return;
    }
    let newName = fileRenameInput.value;
    if (newName === "") {
        alert('New name cannot be empty');
        return;
    }
    let checkbox = checkboxes[0];
    let dir = checkbox.getAttribute('data-directory');
    let name = checkbox.getAttribute('data-name');
    let result = yield connection.invoke('RenameFile', dir, name, newName);
    if (!result.success) {
        alert(JSON.stringify(result.errors));
    }
    getFiles();
});
configTagsInput.oninput = function (e) {
    let target = e.target;
    let bottomInput = configTagsInput.lastChild.firstChild;
    if (target === bottomInput) {
        let lastInput = MakeTagInput('');
        configTagsInput.appendChild(lastInput);
    }
};
configSaveButton.onclick = () => __awaiter(this, void 0, void 0, function* () {
    let tags = [];
    for (let child of configTagsInput.children) {
        let input = child.firstChild;
        let value = input.value.trim();
        if (value !== '') {
            tags.push(value);
        }
    }
    let max_players = parseInt(configMaxPlayersInput.value);
    if (isNaN(max_players)) {
        max_players = 0;
    }
    let settings = {
        name: configNameInput.value,
        description: configDescriptionInput.value,
        tags: tags,
        max_players: max_players,
        game_password: configPasswordInput.value,
        auto_pause: configPauseInput.checked,
        admins: configAdminInput.value.split(',')
    };
    let result = yield connection.invoke('SaveServerSettings', settings);
    if (!result.success) {
        alert(JSON.stringify(result.errors));
    }
    yield getSettings();
});
//# sourceMappingURL=servers.js.map