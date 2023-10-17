import { ConnectionType, Theme } from "../types/types";
import { Subscribable } from "./subscribable";

export class ProgramSettings extends Subscribable {
    private static instance: ProgramSettings;
    private _autoConnect: boolean = true;
    private _autoFileTree: boolean = false;

    private _connectionType: ConnectionType = ConnectionType.FileApi;
    private _seven: boolean = true
    private _tooltips: boolean = true;
    private _debug: boolean = false;
    private _dev: boolean = false;
    //used to test off line mode
    // private _apiUrl: string = "http://159.89.159.24:300/api/"
    // " real server "
    private _apiUrl: string = "https://getpeg.xyz/api/"
    // localhost for dev work
    // private _apiUrl: string = "http://localhost:8080/api/"
    private _PPP: boolean = false
    PppBuyLink: string = "https://boardsource.xyz/store/5f2efc462902de7151495057"

    private saveState = () => {
        const isBrowser = typeof window !== "undefined";

        this.updateSubScribers();
        if (isBrowser) {
            localStorage.setItem(
                "cpy_toolbox_settings",
                JSON.stringify({
                    connectionType: this._connectionType,
                    autoConnect: this._autoConnect,
                    debug: this._debug,
                })
            );
        }
    };

    private _theme: Theme = Theme.light;
    public version: string = "v0.1";
    private constructor() {
        super();
        // const isBrowser = typeof window !== "undefined";
        // if (isBrowser) {
        //     const pastStateStr = localStorage.getItem("cpy_toolbox_settings");

        //     const pastState = JSON.parse(pastStateStr ? pastStateStr : "{}");
        //     if (pastState) {
        //         this._connectionType = pastState.connectionType;
        //         this._debug = pastState.debug;
        //         this._autoConnect = pastState.autoConnect;
        //     }
        // }
    }

    public get connectionType() {
        return this._connectionType;
    }
    public set connectionType(newValue: ConnectionType) {
        this._connectionType = newValue;
        this.saveState();
    }
    public get autoConnect() {
        return this._autoConnect;
    }
    public set autoConnect(newValue: boolean) {
        this._autoConnect = newValue;
        this.saveState();
    }
    public get autoFileTree() {
        return this._autoFileTree;
    }
    public set autoFileTree(newValue: boolean) {
        this._autoFileTree = newValue;
        this.saveState();
    }
    public get debug() {
        return this._debug;
    }
    public set debug(newValue: boolean) {
        this._debug = newValue
        this.updateSubScribers()
    }
    public get dev() {
        return this._dev;
    }
    public set dev(newValue: boolean) {
        this._dev = newValue
        this.updateSubScribers()
    }
    public get seven() {
        return this._seven;
    }
    public set seven(newValue: boolean) {
        this._seven = newValue
        this.updateSubScribers()
    }
    public get tooltips() {
        return this._tooltips;
    }
    public set tooltips(newValue: boolean) {
        this._tooltips = newValue
        this.updateSubScribers()
    }
    public get apiUrl() {
        return this._apiUrl;
    }
    public set PPP(newValue: boolean) {
        if (this._PPP !== newValue) {
            this._PPP = newValue
            this.updateSubScribers()
        }

    }
    public get PPP() {
        return this._PPP;
    }
    public set apiUrl(newValue: string) {
        this._apiUrl = newValue
        this.updateSubScribers()
    }
    public get theme() {
        return this._theme;
    }
    public set theme(newValue: Theme) {
        console.log("update theme", newValue)
        if (this._theme !== newValue) {
            document.documentElement.dataset.theme = newValue
            this._theme = newValue
            this.updateSubScribers()
        } else {

        }

    }

    public static getInstance(): ProgramSettings {
        if (!ProgramSettings.instance) {
            ProgramSettings.instance = new ProgramSettings();
        }
        return ProgramSettings.instance;
    }
}