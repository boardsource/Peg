export type SingleUsableKey = {

}

export interface KeyCode {
    code: string;
    display: string;
    keybinding: string;
    canHaveSub: boolean;
    canHaveSubNumber: boolean;
    subNumber: number;
    Description: string;
    subOne?: KeyCode;
    subTwo?: KeyCode;
}
export interface LayoutFeatures {
    perkey: boolean;
    oled: boolean;
    ble: boolean;
    underglow: boolean;
    name: string;
    creator: string;
    perkeyCount: number;
    underglowCount: number;
    split: boolean;
}
export interface LayoutKey {
    x: number;
    y: number;
    w: number;
    h: number;
}
export interface Layout {
    features: LayoutFeatures;
    layout: LayoutKey[];
}
export type OledPixel = { x: number, y: number }

export enum FileName {
    main = "main.py",
    kb = "kb.py",
    layout = "layout.json",
    settings = "settings.json",
    customCodes = "customCodes.json"
}

export enum ElectronEvents {
    UpdateLayout = "UpdateLayout",
    UpdateKeyMap = "UpdateKeyMap",
    Scan = "Scan",
    SaveMap = "SaveMap",
    Savefile = "Savefile",
    FilePicker = "FilePicker",
    FilePickerClose = "FilePickerClose",
    ScanAgain = "ScanAgain",
    ReadSettings = "ReadSettings",
    ReadCustomCodes = "ReadCustomCodes",
    SaveSettings = "SaveSettings",
    SaveCustomCodes = "SaveCustomCodes",
    WindowClose = "WindowClose",
    WindowFullScreen = "WindowFullScreen",
    WindowMinimize = "WindowMinimize",
}