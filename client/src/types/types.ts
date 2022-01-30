export type SingleUsableKey = {

}

export interface KeyCode {
    code: string;
    display: string;
    keybinding: string;
    canHaveSub: boolean;
    canHaveSubNumber: boolean;
    subNumber: number;
    description: string;
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
