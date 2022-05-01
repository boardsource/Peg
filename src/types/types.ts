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
    rightSide: boolean;
    encoders: boolean;
    encoderCount: number;
    rx_tx: boolean
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
    underglow: LayoutKey[];
}
export type OledPixel = { x: number, y: number }
export type ToastMessage = { message: string, toastLevel: ToastLevel, id: string }
export interface OledTextSection {
    0: OledReactionType,
    1: string[]
}
export interface FeatureResponse {
    _id: string;
    description: string;
    featureType: ShareableFeatureType
    keyboard: string;
    path: string;
    title: string;
    universal: boolean
    version: string
    code?: string
    downloads: number

}
export enum OledDisplayType {
    image = "IMG",
    text = "TXT"
}
export enum OledReactionType {
    static = "STATIC",
    layer = "LAYER"
}


export enum FileName {
    main = "main.py",
    kb = "kb.py",
    layout = "layout.json",
    settings = "settings.json",
    customCodes = "customCodes.json"
}
export enum ShareableFeatureType {
    keyCodes = "keycodes",
    keyMaps = "keyMaps",
    ledMaps = "ledMaps",
    oleds = "oleds",
    codeBlocks = "codeBlocks"
}

export enum ElectronEvents {
    UpdateLayout = "UpdateLayout",
    UpdateKeyMap = "UpdateKeyMap",
    UpdateOled = "UpdateOled",
    Scan = "Scan",
    SaveMap = "SaveMap",
    Savefile = "Savefile",
    SaveOled = "SaveOled",
    ReadOled = "ReadOled",
    MapSaved = "MapSaved",
    FilePicker = "FilePicker",
    FilePickerClose = "FilePickerClose",
    ScanAgain = "ScanAgain",
    FreshDriveScan = "FreshDriveScan",
    ReadSettings = "ReadSettings",
    ReadCustomCodes = "ReadCustomCodes",
    SaveSettings = "SaveSettings",
    SaveCustomCodes = "SaveCustomCodes",
    SetProPlan = "SetProPlan",
    IsProPlan = "IsProPlan",
    WindowClose = "WindowClose",
    WindowFullScreen = "WindowFullScreen",
    WindowMinimize = "WindowMinimize",
}
export enum SplitFlashStage {
    MainSide,
    Unplugged,
    OffSide,
    Finished
}
export enum ModalDefault {
    None,
    SplitFlashManager
}
export enum ToastLevel {
    info,
    error,
    warn,
    success,
    debug,
}


export enum NotificationColor {
    Green = 'green',
    Yellow = 'yellow',
    Red = 'red',
    Blue = 'blue',
}