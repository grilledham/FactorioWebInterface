﻿import { ObservableObject } from "../../utils/observableObject";
import { FactorioServerExtraSettings, FactorioServerExtraSettingsType } from "./serversTypes";
import { ServerExtraSettingsService } from "./serverExtraSettingsService";
import { CopyToClipboardService } from "../../services/copyToClipboardService";
import { DelegateCommand, ICommand } from "../../utils/command";
import { ServerSettingsViewModel } from "./serverSettingsViewModel";
import { CollectionChangeType, Utils } from "../../ts/utils";
import { ErrorService } from "../../services/errorService";
import { propertyOf } from "../../utils/types";

export class ServerExtraSettingsViewModel extends ObservableObject<ServerExtraSettingsViewModel> {
    static readonly formFieldsDefaultValues: FactorioServerExtraSettings = {
        SyncBans: true,
        BuildBansFromDatabaseOnStart: true,
        SetDiscordChannelName: true,
        SetDiscordChannelTopic: true,
        GameChatToDiscord: true,
        GameShoutToDiscord: true,
        DiscordToGameChat: true,
        PingDiscordCrashRole: true,
    };

    private _suppressUpdate = false;

    private _serverExtraSettingsService: ServerExtraSettingsService;
    private _copyToClipoardService: CopyToClipboardService;
    private _errorService: ErrorService;

    private _formFields: FactorioServerExtraSettings = Object.assign({}, ServerExtraSettingsViewModel.formFieldsDefaultValues);

    private _saved: boolean;

    private _saveCommand: DelegateCommand;
    private _undoCommand: DelegateCommand;
    private _copyCommand: DelegateCommand;

    private _pasteText = ServerSettingsViewModel.normalPasteText;

    get SyncBans(): boolean {
        return this._formFields.SyncBans;
    }
    set SyncBans(value: boolean) {
        this.set('SyncBans', value);
    }

    get BuildBansFromDatabaseOnStart(): boolean {
        return this._formFields.BuildBansFromDatabaseOnStart;
    }
    set BuildBansFromDatabaseOnStart(value: boolean) {
        this.set('BuildBansFromDatabaseOnStart', value);
    }

    get SetDiscordChannelName(): boolean {
        return this._formFields.SetDiscordChannelName;
    }
    set SetDiscordChannelName(value: boolean) {
        this.set('SetDiscordChannelName', value);
    }

    get SetDiscordChannelTopic(): boolean {
        return this._formFields.SetDiscordChannelTopic;
    }
    set SetDiscordChannelTopic(value: boolean) {
        this.set('SetDiscordChannelTopic', value);
    }

    get GameChatToDiscord(): boolean {
        return this._formFields.GameChatToDiscord;
    }
    set GameChatToDiscord(value: boolean) {
        this.set('GameChatToDiscord', value);
    }

    get GameShoutToDiscord(): boolean {
        return this._formFields.GameShoutToDiscord;
    }
    set GameShoutToDiscord(value: boolean) {
        this.set('GameShoutToDiscord', value);
    }

    get DiscordToGameChat(): boolean {
        return this._formFields.DiscordToGameChat;
    }
    set DiscordToGameChat(value: boolean) {
        this.set('DiscordToGameChat', value);
    }

    get PingDiscordCrashRole(): boolean {
        return this._formFields.PingDiscordCrashRole;
    }
    set PingDiscordCrashRole(value: boolean) {
        this.set('PingDiscordCrashRole', value);
    }

    get saved(): boolean {
        return this._saved;
    }
    private setSaved(value: boolean) {
        if (this._saved === value) {
            return;
        }

        this._saved = value;
        this.raise('saved', value);
        this._saveCommand.raiseCanExecuteChanged();
        this._undoCommand.raiseCanExecuteChanged();
    }

    get saveCommand(): ICommand {
        return this._saveCommand;
    }

    get undoCommand(): ICommand {
        return this._undoCommand;
    }

    get copyCommand(): ICommand {
        return this._copyCommand;
    }

    get pasteText(): string {
        return this._pasteText;
    }
    private setPasteText(value: string) {
        if (this._pasteText == value) {
            return;
        }

        this._pasteText = value;
        this.raise('pasteText', value);
    }

    constructor(serverExtraSettingsService: ServerExtraSettingsService, copyToClipoardService: CopyToClipboardService, errorService: ErrorService) {
        super();

        this._serverExtraSettingsService = serverExtraSettingsService;
        this._copyToClipoardService = copyToClipoardService;
        this._errorService = errorService;

        this.update(serverExtraSettingsService.settings);
        serverExtraSettingsService.settingsChanged.subscribe(event => this.update(event.NewItems as FactorioServerExtraSettings));

        this._saved = serverExtraSettingsService.saved;
        serverExtraSettingsService.savedChanged.subscribe(event => this.setSaved(event));

        this._saveCommand = new DelegateCommand(() => this.saveSettings(), () => !this.saved);
        this._undoCommand = new DelegateCommand(() => this._serverExtraSettingsService.undoSettings(), () => !this.saved);
        this._copyCommand = new DelegateCommand(() => this.copySettings());
    }

    private update(settings: FactorioServerExtraSettings) {
        for (let propertyName in settings) {
            let value = ServerExtraSettingsViewModel.getOrDefault(propertyName as FactorioServerExtraSettingsType, settings[propertyName])
            this.setAndRaise(this._formFields, propertyName as propertyOf<ServerExtraSettingsViewModel>, value);
        }
    }

    private set(propertyName: propertyOf<ServerExtraSettingsViewModel>, value: any): boolean {
        if (this.setAndRaise(this._formFields, propertyName, value)) {
            this.setSaved(false);

            if (!this._suppressUpdate) {
                let settingValue = ServerExtraSettingsViewModel.getOrDefault(propertyName as FactorioServerExtraSettingsType, value);
                let settings = {};
                settings[propertyName] = settingValue;
                this._serverExtraSettingsService.updateSettings({ Type: CollectionChangeType.Add, NewItems: settings });
            }

            return true;
        }

        return false;
    }

    private buildFactorioServerSettings(): FactorioServerExtraSettings {
        let settings = {} as FactorioServerExtraSettings;
        let fields = this._formFields;

        for (let propertyName in fields) {
            let key = propertyName as FactorioServerExtraSettingsType;
            let value = ServerExtraSettingsViewModel.getOrDefault(key, fields[propertyName]);
            settings[propertyName] = value;
        }

        return settings;
    }

    private async saveSettings() {
        let settings = this.buildFactorioServerSettings();

        let result = await this._serverExtraSettingsService.saveSettings(settings);
        this._errorService.reportIfError(result);
    }

    private copySettings() {
        let settings = this.buildFactorioServerSettings();
        let text = JSON.stringify(settings);
        this._copyToClipoardService.copy(text);
    }

    pasteSettingsClicked() {
        this.setPasteText(ServerSettingsViewModel.normalPasteText);
    }

    pasteSettings(text: string) {
        let settings;
        try {
            settings = JSON.parse(text);
        }
        catch (ex) {
            this.setPasteText(ServerSettingsViewModel.errorPasteText);
            return;
        }

        if (!Utils.isObject(settings)) {
            this.setPasteText(ServerSettingsViewModel.errorPasteText);
            return;
        }

        let fields = this._formFields;
        let changeData = {};

        try {
            this._suppressUpdate = true;

            let hasChanges = false;
            for (let propertyName in settings) {
                if (!fields.hasOwnProperty(propertyName)) {
                    continue;
                }

                let value = ServerExtraSettingsViewModel.getOrDefault(propertyName as FactorioServerExtraSettingsType, settings[propertyName]);
                if (value == null) {
                    continue;
                }

                hasChanges = this.set(propertyName as propertyOf<ServerExtraSettingsViewModel>, value) || hasChanges;
                changeData[propertyName] = value;
            }

            if (hasChanges) {
                this._serverExtraSettingsService.updateSettings({ Type: CollectionChangeType.Add, NewItems: changeData });
            }

            this.setPasteText(ServerSettingsViewModel.appliedPasteText);
        } finally {
            this._suppressUpdate = false;
        }
    }

    private static getOrDefault(key: FactorioServerExtraSettingsType, fieldValue: any): any {
        if (typeof fieldValue === 'boolean') {
            return fieldValue;
        }

        return ServerExtraSettingsViewModel.formFieldsDefaultValues[key];
    }
}