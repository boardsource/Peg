import { KeyCode } from "../types/types";
import _basic from "../jsonKeycodes/basic-keycodes.json"
import _bluetooth from "../jsonKeycodes/bluetooth-keycodes.json"
import _custom from "../jsonKeycodes/custom-keycodes.json"
import _internal from "../jsonKeycodes/internal-keycodes.json"
import _international from "../jsonKeycodes/international-keycodes.json"
import _layers from "../jsonKeycodes/layers-keycodes.json"
import _led from "../jsonKeycodes/led-keycodes.json"
import _lessused from "../jsonKeycodes/lessused-keycodes.json"
import _modifiers from "../jsonKeycodes/modifiers-keycodes.json"
import _shifted from "../jsonKeycodes/shifted-keycodes.json"

export class KeyCodes {
    private static instance: KeyCodes;
    basic: Map<string, KeyCode>;
    lessUsed: Map<string, KeyCode>;
    bluetooth: Map<string, KeyCode>;
    internalCodes: Map<string, KeyCode>;
    international: Map<string, KeyCode>;
    modifiers: Map<string, KeyCode>;
    shifted: Map<string, KeyCode>;
    layers: Map<string, KeyCode>;
    led: Map<string, KeyCode>;
    customCodes: Map<string, KeyCode>;
    private constructor() {
        //@ts-ignore
        const basicKeycodes = _basic as KeyCode[]
        this.basic = new Map(basicKeycodes.map(i => [i.code, i]));
        //@ts-ignore
        const bluetoothKeycodes = _bluetooth as KeyCode[]
        this.bluetooth = new Map(bluetoothKeycodes.map(i => [i.code, i]));
        //@ts-ignore
        const customKeycodes = _custom as KeyCode[]
        this.customCodes = new Map(customKeycodes.map(i => [i.code, i]));
        //@ts-ignore
        const internalKeycodes = _internal as KeyCode[]
        this.internalCodes = new Map(internalKeycodes.map(i => [i.code, i]));
        //@ts-ignore
        const internationalKeycodes = _international as KeyCode[]
        this.international = new Map(internationalKeycodes.map(i => [i.code, i]));
        //@ts-ignore
        const layersKeycodes = _layers as KeyCode[]
        this.layers = new Map(layersKeycodes.map(i => [i.code, i]));
        //@ts-ignore
        const ledKeycodes = _led as KeyCode[]
        this.led = new Map(ledKeycodes.map(i => [i.code, i]));
        //@ts-ignore
        const lessusedKeycodes = _lessused as KeyCode[]
        this.lessUsed = new Map(lessusedKeycodes.map(i => [i.code, i]));
        //@ts-ignore
        const modifiersKeycodes = _modifiers as KeyCode[]
        this.modifiers = new Map(modifiersKeycodes.map(i => [i.code, i]));
        //@ts-ignore
        const shiftedKeycodes = _shifted as KeyCode[]
        this.shifted = new Map(shiftedKeycodes.map(i => [i.code, i]));
        this.addBlankSubKeys();
    }

    public static getInstance(): KeyCodes {
        if (!KeyCodes.instance) {
            KeyCodes.instance = new KeyCodes();
        }
        return KeyCodes.instance;
    }
    addBlankSubKeys() {
        const noKey = this.CodeForStringAndSet("KC.NO", this.basic);
        this.modifiers.forEach(keycode => {
            if (keycode.canHaveSub) {
                keycode.subOne = noKey;
            }
        });
    }
    public CodeForStringAndSet(code: string, searchingSet: Map<string, KeyCode>): KeyCode | undefined {
        const tempCode = searchingSet.get(code)
        if (tempCode !== undefined) {
            return { ...tempCode }
        } else {
            return undefined
        }
    }

    public KeyCodeForString(dirtycode: string): KeyCode {
        const code: string = dirtycode.trim();

        let tempCode: KeyCode | undefined;
        tempCode = this.CodeForStringAndSet(code, this.basic);
        if (tempCode != undefined) {
            return tempCode;
        }
        tempCode = this.CodeForStringAndSet(code, this.shifted);
        if (tempCode != undefined) {
            return tempCode;
        }
        tempCode = this.CodeForStringAndSet(code, this.modifiers);
        if (tempCode != undefined) {
            return tempCode;
        }
        tempCode = this.CodeForStringAndSet(code, this.lessUsed);
        if (tempCode != undefined) {
            return tempCode;
        }
        tempCode = this.CodeForStringAndSet(code, this.international);
        if (tempCode != undefined) {
            return tempCode;
        }
        tempCode = this.CodeForStringAndSet(code, this.internalCodes);
        if (tempCode != undefined) {
            return tempCode;
        }
        tempCode = this.CodeForStringAndSet(code, this.layers);
        if (tempCode != undefined) {
            return tempCode;
        }
        tempCode = this.CodeForStringAndSet(code, this.led);
        if (tempCode != undefined) {
            return tempCode;
        }
        tempCode = this.CodeForStringAndSet(code, this.customCodes);
        if (tempCode != undefined) {
            return tempCode;
        }
        else {
            const errorCode: KeyCode = {
                code: "KC.NO",
                display: "ERR",
                keybinding: "",
                canHaveSub: false,
                canHaveSubNumber: false,
                subNumber: 0,
                description: "error no key code '" + code + "' from imported map"
            }
            console.log("returning a shit code")
            return errorCode;
        }
    }
    public RemoveCustomCode(code: string) {
        this.customCodes.delete(code);
        this.saveCustomCodes();

    }
    public AddCustomCode(newCode: KeyCode) {
        this.customCodes.set(newCode.code, newCode);
        this.saveCustomCodes();
    }
    saveCustomCodes() {
        //todo
        // Godot.File file = new Godot.File();
        // file.Open("res://jsonKeycodes/custom-keycodes.json", Godot.File.ModeFlags.Write);
        // string customText = JsonConvert.SerializeObject(new List<KeyCode>(this.CustomCodes.Values), Formatting.Indented);
        // file.StoreString(customText);
        // file.Close();
    }
}