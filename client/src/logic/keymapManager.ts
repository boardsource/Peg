import { KeyCodes } from "./keycodes";
import { ElectronEvents, KeyCode, Layout, OledDisplayType, OledReactionType } from "../types/types";
import { MiscKeymapParts } from "./miscKeyMapParts";
import { Subscribable } from "./subscribable";
import { Color } from "./color";
import { Oled } from "./oled";
import { ClientManager } from "./clientManager";
import { Toast } from "./toast";

export class KeyMap extends Subscribable {
    private static instance: KeyMap;

    codes: KeyCodes
    keymap: KeyCode[][] = [];
    encoderMap: KeyCode[][] = [];
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
        if (this.keyLayout.features.oled && this.oled === undefined) {
            this.oled = new Oled();
        }
        Toast.Info(`${this.keyLayout.features.name} connected`)
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
        //RGB MATRIX
        const ledMap = baseMap.split("# ledmap");
        if (ledMap.length == 3) {
            const ledHeadderCharacterCount = 48;
            let ledFooterCharacterCount = 9;
            if (ledMap[1].includes("split")) {
                ledFooterCharacterCount = 62
                console.log(" its a split")
            }
            const tempLedMap = ledMap[1]
                .replace(/(?:\r\n|\r|\n)/g, '')
                .replace(" ", '')
                .substring(0, ledMap[1].length - ledFooterCharacterCount)
                .substring(ledHeadderCharacterCount)
                .replace(/\s+/g, '')
                .split("],[")
            const colorLeds = tempLedMap.map(led => {
                const singleLed = led.split(',')
                return new Color(singleLed[0], singleLed[1], singleLed[2])
            })
            this.ledMap = colorLeds

        }
        //OLEDS
        const oledMap = baseMap.split("# oled")
        if (oledMap.length == 3) {
            const currentDisplayType: OledDisplayType = Object.keys(OledDisplayType).filter((key) => {
                //@ts-ignore
                const typeInUse = oledMap[1].includes(OledDisplayType[key])
                return typeInUse
            }).map(key => {
                //@ts-ignore
                return OledDisplayType[key]
            })[0]

            const flipValue = oledMap[1].includes("flip=True") ? true : oledMap[1].includes("flip=False") ? false : false
            const oledHeadderCharacterCount = 24;
            const oledFooterCharacterCount = 32
            const tempOledMap = oledMap[1]
                .replace(/(?:\r\n|\r|\n)/g, '')
                .replace(" ", '')
                .substring(0, oledMap[1].length - oledFooterCharacterCount)
                .substring(oledHeadderCharacterCount)
            if (this.oled === undefined) {
                this.oled = new Oled();
            }
            this.oled.displayType = currentDisplayType
            this.oled.flip = flipValue
            // this.oled.FromString(tempOledMap) to be used for strings not imgs
            if (currentDisplayType === OledDisplayType.image) {
                try {
                    const tempData = JSON.parse(tempOledMap.replace("0:", '"0":').replace("1:", '"1":'))
                    if (tempData[0][0] === OledReactionType.layer) {
                        this.oled.imgReactionType = OledReactionType.layer
                        const currentClientManager = ClientManager.getInstance()
                        currentClientManager.sendToBackend(ElectronEvents.ReadOled, 1)
                        currentClientManager.sendToBackend(ElectronEvents.ReadOled, 2)
                        currentClientManager.sendToBackend(ElectronEvents.ReadOled, 3)
                        currentClientManager.sendToBackend(ElectronEvents.ReadOled, 4)
                    }
                } catch (error) {
                    console.log("error parsing oled map", error)
                }
            } else {
                this.oled.FromString(tempOledMap)
            }

        }
        //ENCODERS
        const encoderMap = baseMap.split("# encodermap")
        if (encoderMap.length == 3) {
            const encoderHeadderCharacterCount = 24;
            const encoderFooterCharacterCount = 25
            const encoderRemvedFooters = encoderMap[1].substring(0, encoderMap[1].length - encoderFooterCharacterCount);
            const encoderRawLayers = encoderRemvedFooters.substring(encoderHeadderCharacterCount);
            const encoderLayers = encoderRawLayers.replaceAll(/(?:\r\n|\r|\n)/g, '')
                .replaceAll("(", "[")
                .replaceAll("),", "]")
                .split("]]")
                .map(encoderLayer => encoderLayer.replaceAll("[", "").trim())
                .filter(encoderLayer => encoderLayer.length > 0)
            this.encoderMap = encoderLayers.map(layer => layer.split(",").map(keyCode => this.codes.KeyCodeForString(keyCode)))
        }

        Toast.Success(`Found your keyboard`)
        console.log("just parsed keymap", this)

        // check if there is an oled and if not make it
        this.updateSubScribers()


    }

    public ChangeKey(layer: number, pos: number, newKey: KeyCode, isEncoder: boolean) {
        // todo add in saving old changes for ctrl z 
        if (isEncoder) {
            console.log("changed kkkey", this)
            this.encoderMap[layer][pos] = newKey;
        } else if (this.keymap[layer][pos].canHaveSub && newKey.code != "KC.NO") {
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
        return `# keymap\nkeyboard.keymap = [ ${keymapString.join(", \n")} ] \n# keymap\n`;
    }

    public toString(): string {

        const newLayers: string = this.keymapBackToString();
        let newHeader: string = ``
        let newfooter: string = ``
        if (this.miscKeymapParts) {
            newHeader = this.miscKeymapParts.ReturnFileHeader();
            newfooter = this.miscKeymapParts.ReturnFileFooter();
        }
        return newHeader + newLayers + newfooter;
    }
}


