import { KeyCodes } from "./keycodes";
import { KeyCode, Layout } from "../types/types";
import { MiscKeymapParts } from "./miscKeyMapParts";
import { Subscribable } from "./subscribable";
import { Color } from "./color";
import { Oled } from "./oled";

export class KeyMap extends Subscribable {
    private static instance: KeyMap;

    codes: KeyCodes
    keymap: KeyCode[][] = [];
    keyLayout!: Layout;
    layout!: string;
    haveLayout: boolean = false;
    haveMap: boolean = false;
    ledMap: Color[] = [];
    oled: Oled | undefined
    miscKeymapParts: MiscKeymapParts | undefined
    keymapStr: string[][] = []
    // parsing: boolean = false
    private constructor() {
        super();
        this.codes = KeyCodes.getInstance();
        this.subscribers = new Map();
    }
    public static getInstance(): KeyMap {
        if (!KeyMap.instance) {
            KeyMap.instance = new KeyMap();
        }

        return KeyMap.instance;
    }


    public ParceLayout(layoutJson: string) {
        this.keyLayout = JSON.parse(layoutJson)
        this.haveLayout = true;
        this.miscKeymapParts = new MiscKeymapParts(this, this.keyLayout);
        this.layout = layoutJson;
        if (this.keyLayout.features.oled) {
            this.oled = new Oled();
        }
        this.updateSubScribers()
        // EmitSignal(nameof(UpdatedMap), this);
        // OS.SetWindowTitle("Peg-" + this.KeyLayout.features.name + "-" + this.KeyLayout.features.creator);
    }

    public StringToKeymap(baseMap: string) {
        // if (!this.parsing) {
        //     this.parsing = true
        const headderCharacterCount = 20;
        const footerCharacterCount = 3;

        const justLayers = baseMap.split("# keymap")[1];
        const remvedFooters = justLayers.substring(0, justLayers.length - footerCharacterCount);
        const rawLayers = remvedFooters.substring(headderCharacterCount);
        const layers = rawLayers.replace(/(?:\r\n|\r|\n)/g, '').split("],");

        //todo rework to map
        layers.forEach((match: string) => {
            this.keymapStr.push(match.replace("[", "").replace("]", "").replace(" ", "").split(","));
        });

        this.keymap = [];
        // todo can this be done in one loop
        //todo rework to map
        this.keymapStr.forEach(layer => {
            let tempLayer: KeyCode[] = [];
            //todo rework to map
            layer.forEach(code => {
                const tempCode: KeyCode = this.codes.KeyCodeForString(code);
                tempLayer.push(tempCode);
            });

            this.keymap.push(tempLayer);
        });
        this.haveMap = true;
        const ledMap = baseMap.split("# ledmap");
        if (ledMap.length == 3) {
            const ledHeadderCharacterCount = 13;
            const ledFooterCharacterCount = 9;
            const tempLedMap = ledMap[1]
                .replace(/(?:\r\n|\r|\n)/g, '')
                .replace(" ", '')
                .substring(0, ledMap[1].length - ledFooterCharacterCount)
                .substring(ledHeadderCharacterCount)
                .split("],[")
            const colorLeds = tempLedMap.map(led => {
                const singleLed = led.split(',')
                return new Color(singleLed[0], singleLed[1], singleLed[2])
            })
            this.ledMap = colorLeds

        }
        console.log("just parsed keymap", this)

        // check if there is an oled and if not make it
        this.updateSubScribers()


    }

    public ChangeKey(layer: number, pos: number, newKey: KeyCode) {
        // todo add in saving old changes for ctrl z 
        if (this.keymap[layer][pos].canHaveSub && newKey.code != "KC.NO") {
            this.keymap[layer][pos].subOne = newKey;
        }
        else {
            this.keymap[layer][pos] = newKey;
        }
        this.updateSubScribers()
    }

    public ChangeLed(_layer: number, pos: number, newColor: Color) {
        // todo add in saving old changes for ctrl z 
        this.ledMap[pos] = newColor;
        this.updateSubScribers()
    }


    keycodeToString(code: KeyCode) {
        if (code.canHaveSub) {
            return code.code.split("kc")[0] + code.subOne?.code + ")";
        } else {
            return code.code
        }
    }

    keymapBackToString(): string {
        let keymapString: string[] = this.keymap.map(layer => {

            const layerToString = layer.map(keycode => this.keycodeToString(keycode)).join(",")
            console.log("layerToString", layerToString)
            return `[${layerToString}]`;
        })
        // console.log("layers=", keymapString)
        return `# keymap\nkeyboard.keymap = [ ${keymapString.join(", \n")} ] \n# keymap\n"`;
    }

    public toString(): string {

        const newLayers: string = this.keymapBackToString();
        let newHeader: string = ""
        let newfooter: string = ""
        if (this.miscKeymapParts) {
            newHeader = this.miscKeymapParts.ReturnFileHeader();
            newfooter = this.miscKeymapParts.ReturnFileFooter();
        }
        return newHeader + newLayers + newfooter;
    }
}


