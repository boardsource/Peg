import { KeyMap } from "./keymapManager";
import { Layout, LayoutFeatures } from "../types/types";
import { ProgramSettings } from "./programSettings";

export class MiscKeymapParts {
    settings: LayoutFeatures;
    programSettings: ProgramSettings;
    keymap: KeyMap;
    constructor(keymap: KeyMap, layout: Layout) {
        this.keymap = keymap;
        this.settings = layout.features
        this.programSettings = ProgramSettings.getInstance();
    }
    returnLedDisplay(): string {
        const ledmap = this.keymap.ledMap.map(color => color.toString()).join(",")
        return `# ledmap\nledDisplay=[${ledmap}]\n# ledmap`;
    }
    public ReturnFileFooter(): string {
        if (this.settings.ble) {
            if (this.programSettings.seven) {
                return `if __name__ == '__main__':\n    if supervisor.runtime.usb_connected:\n       keyboard.go(hid_type=HIDModes.USB)\n    else:\n        keyboard.go(hid_type = HIDModes.BLE)`;
            }
            else {
                return "if __name__ == '__main__': \n    keyboard.go(hid_type = HIDModes.BLE)";
            }
        }
        else {
            return "if __name__ == '__main__': \n    keyboard.go(hid_type=HIDModes.USB)";
        }
    }
    public ReturnFileHeader(): string {
        let imports: string = "from kb import KMKKeyboard\nfrom kmk.keys import KC\nfrom kmk.modules.layers import Layers\nfrom kmk.modules.modtap import ModTap\nfrom kmk.hid import HIDModes\nfrom kmk.handlers.sequences import send_string\n";
        let baseCode: string = "keyboard = KMKKeyboard()\nmodtap = ModTap()\nlayers_ext = Layers()\n";
        // you always send closing new line
        if (this.programSettings.seven) {
            imports += "import supervisor\n";
        }
        if (this.settings.perkey || this.settings.underglow) {
            const ledMap = this.returnLedDisplay();
            imports += "from kmk.extensions.rgb_matrix import Rgb_matrix\n";
            baseCode += `${ledMap}\nrgb_ext = RGB(pixel_pin=keyboard.rgb_pixel_pin, num_pixels=${this.settings.perkeyCount + this.settings.underglowCount},brightness_limit=keyboard.brightness_limit,keyPos=keyboard.ledKeypos,ledDisplay=ledDisplay)\nkeyboard.extensions.append(rgb_ext)\n`;
        }
        if (this.settings.split) {
            imports += "from kmk.modules.split import Split, SplitSide, SplitType\n";
            baseCode += "# TODO Comment one of these on each side\nsplit_side = SplitSide.LEFT\n#split_side = SplitSide.RIGHT\n";
            if (this.settings.ble) {
                if (this.programSettings.seven && false) {
                    // this does not work the board other board never has a usb pluged into it
                    baseCode += "if supervisor.runtime.usb_connected:\n       split = Split(split_side = split_side)\nelse:\n        split = Split(split_type=Split.BLE,split_side = split_side)\n";
                }
                else {
                    baseCode += "split = Split(split_type=Split.BLE,split_side = split_side)\n";
                }
            }
            else {
                baseCode += "split = Split(split_side = split_side)\n";

            }
            baseCode += "keyboard.modules = [layers_ext, modtap,split]\n";
        }
        else {
            baseCode += "keyboard.modules = [layers_ext, modtap]\n";
        }
        return imports + baseCode;
    }
}

