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
    codeBlock!: string;
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
        const headerCharacterCount = 20;
        const footerCharacterCount = 3;

        const justLayers = baseMap.split("# keymap")[1];
        const removedFooters = justLayers.substring(0, justLayers.length - footerCharacterCount);
        const rawLayers = removedFooters.substring(headerCharacterCount);
        const layers = rawLayers.replaceAll(/(?:\r\n|\r|\n)/g, '').split("],");
        const encoderMap = baseMap.split("# encodercount")
        const encoderCount = encoderMap.length == 3 ? Number(encoderMap[1].replace("#", "")) : 0


        //todo rework to map
        layers.forEach((match: string) => {
            this.keymapStr.push(match.replaceAll("[", "").replaceAll("]", "").replaceAll(" ", "").split(","));
        });

        this.keymap = [];
        this.encoderMap = []
        // todo can this be done in one loop
        //todo rework to map
        this.keymapStr.forEach(layer => {
            let tempLayer: KeyCode[] = [];
            //todo rework to map
            layer.forEach(code => {
                const tempCode: KeyCode = this.codes.KeyCodeForString(code);
                tempLayer.push(tempCode);
            });
            if (encoderCount) {
                const tempKeymapLayer = tempLayer.slice(0, tempLayer.length - encoderCount * 2)
                const tempEncoderLayer = tempLayer.slice(tempLayer.length - encoderCount * 2, tempLayer.length)
                this.keymap.push(tempKeymapLayer);
                this.encoderMap.push(tempEncoderLayer);
            } else {
                this.keymap.push(tempLayer);
            }

        });
        this.haveMap = true;
        //RGB MATRIX
        const ledMap = baseMap.split("# ledmap");
        if (ledMap.length == 3) {
            const ledHeaderCharacterCount = 32;
            let ledFooterCharacterCount = 9;
            if (ledMap[1].includes("split")) {
                ledFooterCharacterCount = 58
            }
            const tempLedMap = ledMap[1]
                .replaceAll(/(?:\r\n|\r|\n)/g, '')
                .replaceAll(" ", '')
                .substring(0, ledMap[1].length - ledFooterCharacterCount)
                .substring(ledHeaderCharacterCount)
                .replaceAll(/\s+/g, '')
                .split("],[")
            console.log(tempLedMap)
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

            const flipValue = oledMap[1].includes("flip= True") ? true : oledMap[1].includes("flip=False") ? false : false
            const oledHeaderCharacterCount = 15;
            const oledFooterCharacterCount = 46
            const tempOledMap = oledMap[1]
                .replace(/(?:\r\n|\r|\n)/g, '')
                .replace(" ", '')
                .substring(0, oledMap[1].length - oledFooterCharacterCount)
                .substring(oledHeaderCharacterCount)
                .replace("OledData(image=", "")
                .replace("OledData(corner_one=", "")
                .replace("corner_two=", "")
                .replace("corner_three=", "")
                .replace("corner_four=", "")

            if (this.oled === undefined) {
                this.oled = new Oled();
            }
            this.oled.displayType = currentDisplayType
            this.oled.flip = flipValue
            // this.oled.FromString(tempOledMap) to be used for strings not imgs
            if (currentDisplayType === OledDisplayType.image) {
                try {
                    const tempData = JSON.parse(tempOledMap
                        .replace("0:", '"0":')
                        .replace("1:", '"1":')
                        .replaceAll("OledReactionType.STATIC", '"STATIC"')
                        .replaceAll("OledReactionType.LAYER", '"LAYER"')
                    )
                    if (tempData[0] === OledReactionType.layer) {
                        this.oled.imgReactionType = OledReactionType.layer
                        const currentClientManager = ClientManager.getInstance()
                        currentClientManager.sendToBackend(ElectronEvents.ReadOled, 1)
                        currentClientManager.sendToBackend(ElectronEvents.ReadOled, 2)
                        currentClientManager.sendToBackend(ElectronEvents.ReadOled, 3)
                        currentClientManager.sendToBackend(ElectronEvents.ReadOled, 4)
                        currentClientManager.sendToBackend(ElectronEvents.ReadOled, 5)
                        currentClientManager.sendToBackend(ElectronEvents.ReadOled, 6)
                        currentClientManager.sendToBackend(ElectronEvents.ReadOled, 7)
                        currentClientManager.sendToBackend(ElectronEvents.ReadOled, 8)
                    } else {
                        this.oled.imgReactionType = OledReactionType.static
                        const currentClientManager = ClientManager.getInstance()
                        currentClientManager.sendToBackend(ElectronEvents.ReadOled, 1)
                    }
                } catch (error) {
                    Toast.Error(`error parsing oled map try reloading the default oled map and make sure you have the images in root`)

                    console.log("error parsing oled map", error)
                }
            } else {
                this.oled.FromString(tempOledMap)
            }

        }


        //CODEBLOCK
        const codeblock = baseMap.split("# codeblock")
        if (codeblock.length == 3) {
            this.codeBlock = codeblock[1]
            console.log("code ", this.codeBlock)
        }



        Toast.Success(`Found your keyboard`)
        this.updateSubScribers()
        console.log("parsed map", this)



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
    layersToString() {
        let keymapString: string[] = this.keymap.map((layer, index) => {
            const tempLayer = this.encoderMap.length > 0 ? [...layer, ...this.encoderMap[index]] : layer
            const layerToString = tempLayer.map(keycode => this.keycodeToString(keycode)).join(",")
            return `[${layerToString}]`;
        })
        return keymapString
    }


    keymapBackToString(): string {
        const keymapString = this.layersToString()

        // console.log("layers=", keymapString)
        return `${this.keyLayout.features.encoders ? `# encodercount\n# ${this.keyLayout.features.encoderCount}\n# encodercount` : ""}\n# keymap\nkeyboard.keymap = [ ${keymapString.join(", \n")} ] \n# keymap\n`;
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


