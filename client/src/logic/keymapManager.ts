import { KeyCodes } from "./keycodes";
import { KeyCode, Layout } from "../types/types";
import { MiscKeymapParts } from "./miscKeyMapParts";

export class KeyMap {
    private static instance: KeyMap;
    subscribers: Map<string, (keyMap: KeyMap) => void>;
    codes: KeyCodes
    keymap: KeyCode[][] = [];
    keyLayout!: Layout;
    layout!: string;
    haveLayout: boolean = false;
    haveMap: boolean = false;
    ledMap: string[] = [];
    miscKeymapParts: MiscKeymapParts | undefined
    keymapStr: string[][] = []
    private constructor() {
        this.codes = KeyCodes.getInstance();
        this.subscribers = new Map();
        console.log("I am setting up")
    }
    public static getInstance(): KeyMap {
        console.log("I need a instance", KeyMap.instance)
        if (!KeyMap.instance) {
            KeyMap.instance = new KeyMap();
        }

        return KeyMap.instance;
    }
    public Test(map: string) {
        console.log("test", map)
        this.layout = map;
        console.log("lay", this.layout)
    }
    public Subscribe(name: string, updateFuction: (keyMap: KeyMap) => void) {
        this.subscribers.set(name, updateFuction)
    }
    public Unsubscribe(name: string) {
        this.subscribers.delete(name)
    }
    updateSubScribers() {
        this.subscribers.forEach(updateFunction => {
            updateFunction(this);
        });
    }
    public ParceLayout(layoutJson: string) {
        this.keyLayout = JSON.parse(layoutJson)
        this.haveLayout = true;
        this.miscKeymapParts = new MiscKeymapParts(this, this.keyLayout);
        this.layout = layoutJson;
        this.updateSubScribers()
        // EmitSignal(nameof(UpdatedMap), this);
        // OS.SetWindowTitle("Peg-" + this.KeyLayout.features.name + "-" + this.KeyLayout.features.creator);
    }

    public StringToKeymap(baseMap: string) {

        const headderCharacterCount = 20;
        const footerCharacterCount = 3;

        const justLayers = baseMap.split("# keymap")[1];
        const remvedFooters = justLayers.substring(0, justLayers.length - footerCharacterCount);
        const rawLayers = remvedFooters.substring(headderCharacterCount);
        const layers = rawLayers.split("],");

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

            //todo update this to color class
            const ledHeadderCharacterCount = 14;
            const ledFooterCharacterCount = 3;
            const tempLedMap = ledMap[1].substring(0, ledMap[1].length - ledFooterCharacterCount).substring(ledHeadderCharacterCount).split("],[")
            this.ledMap = tempLedMap

        }
        this.updateSubScribers()

        // EmitSignal(nameof(UpdatedMap), this);
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

        // EmitSignal(nameof(UpdatedMap), this);
    }
    keymapBackToString(): string {
        let keymapString: string[] = this.keymap.map(layer => layer.map(keycode => keycode.code).join(","))
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


