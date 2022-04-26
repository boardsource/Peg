import { Subscribable } from "./subscribable";

export class ProgramSettings extends Subscribable {
    private static instance: ProgramSettings;
    private _seven: boolean = true
    private _tooltips: boolean = true;
    private _apiUrl: string = "http://159.89.159.24:3000/api/"
    // private _apiUrl: string = "http://localhost:8080/api/"

    private _darkmode: boolean = true;
    version: string = "v0.1"
    private constructor() {
        super();
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
    public set apiUrl(newValue: string) {
        this._apiUrl = newValue
        this.updateSubScribers()
    }
    public get darkmode() {
        return this._darkmode;
    }
    public set darkmode(newValue: boolean) {
        if (newValue) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
        this._darkmode = newValue
        this.updateSubScribers()
    }

    public static getInstance(): ProgramSettings {
        if (!ProgramSettings.instance) {
            ProgramSettings.instance = new ProgramSettings();
        }
        return ProgramSettings.instance;
    }
}