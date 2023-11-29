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
        // return `# ledmap\nledDisplay=[${ledmap}]\n# ledmap`;
        return ledmap
    }
    returnEncoderMap(): string {
        let endoderMapString: string[] = this.keymap.encoderMap.map(layer => {

            const layerToString = layer.map(keycode => this.keymap.keycodeToString(keycode)).join(",")

            return `((${layerToString}),)`;
        })
        return `# encodermap\nencoder_handler.map = ( ${endoderMapString.join(", \n")} ) \n# encodermap\n`;
    }

    public ReturnFileFooter(): string {
        if (this.settings.ble) {
            if (this.programSettings.seven) {
                return `if __name__ == '__main__':\n    if supervisor.runtime.usb_connected:\n       keyboard.go(hid_type=HIDModes.USB)\n    else:\n        keyboard.go(hid_type = HIDModes.BLE)`;
            }
            else {
                return `if __name__ == '__main__': \n    keyboard.go(hid_type = HIDModes.BLE)`;
            }
        }
        else {
            return `if __name__ == '__main__': \n    keyboard.go(hid_type=HIDModes.USB)`;
        }
    }
    public ReturnFileHeader(): string {
        let imports: string = "from kb import KMKKeyboard\nfrom kmk.keys import KC\nfrom kmk.modules.layers import Layers\nfrom kmk.modules.modtap import ModTap\nfrom kmk.hid import HIDModes\nfrom kmk.handlers.sequences import send_string\n";
        let baseCode: string = "keyboard = KMKKeyboard()\nmodtap = ModTap()\nlayers_ext = Layers()\nkeyboard.modules.append(layers_ext)\nkeyboard.modules.append(modtap)\n";
        // you always send closing new line
        if (this.programSettings.seven) {
            imports += "import supervisor\n";
        }
        if (this.keymap.codeBlock !== undefined) {
            this.keymap.codeBlock.forEach(codeBlock => {
                baseCode += `# codeblock${codeBlock}# codeblock\n`
            })
        }
        if (this.settings.oled && this.keymap.oled !== undefined) {
            imports += "from kmk.extensions.peg_oled_display import Oled,OledDisplayMode,OledReactionType,OledData\n";
            baseCode += `${this.keymap.oled.ToString()}\nkeyboard.extensions.append(oled_ext)\n`
        }

        if (this.settings.perkey || this.settings.underglow) {
            const ledMap = this.returnLedDisplay();
            imports += "from kmk.extensions.peg_rgb_matrix import Rgb_matrix\n";
            if (this.settings.split) {
                if (this.settings.rightSide) {
                    baseCode += `# ledmap\nrgb_ext = Rgb_matrix(ledDisplay=[${ledMap}],split=True,rightSide=True,disable_auto_write=True)\n# ledmap\n`
                } else {
                    baseCode += `# ledmap\nrgb_ext = Rgb_matrix(ledDisplay=[${ledMap}],split=True,rightSide=False,disable_auto_write=True)\n# ledmap\n`
                }
            } else {
                baseCode += `# ledmap\nrgb_ext = Rgb_matrix(ledDisplay=[${ledMap}],disable_auto_write=True)\n# ledmap\n`
            }
            baseCode += `keyboard.extensions.append(rgb_ext)\n`;
        }
        if (this.settings.split) {
            imports += "from kmk.modules.split import Split, SplitSide, SplitType\n";
            if (this.settings.rightSide) {
                baseCode += "# TODO Comment one of these on each side\n#split_side = SplitSide.LEFT\n#split_side = SplitSide.RIGHT\n";
            } else {
                baseCode += "# TODO Comment one of these on each side\n#split_side = SplitSide.LEFT\n#split_side = SplitSide.RIGHT\n";
            }
            if (this.settings.ble) {
                if (this.programSettings.seven && false) {
                    // this does not work the board other board never has a usb pluged into it
                    baseCode += "if supervisor.runtime.usb_connected:\n       split = Split(split_side = split_side)\nelse:\n        split = Split(split_type=Split.BLE,split_side = split_side)\n";
                }
                else {
                    baseCode += "split = Split(split_type=Split.BLE,split_side = split_side)\n";
                }
            } else if (this.settings.rx_tx) {
                baseCode += `split = Split(data_pin=keyboard.rx, data_pin2=keyboard.tx, uart_flip=${this.settings.uartFlip ? "True" : "False"})\n`;
            }
            else {
                baseCode += `split = Split(${this.settings.splitPico ? "use_pio=True" : ""})\n`;

            }

            baseCode += "keyboard.modules.append(split)\n";
        }
        else {
            baseCode += "keyboard.modules = [layers_ext, modtap]\n";
        }
        return imports + baseCode;
    }

    public static MakeBootPy(name: string, split: boolean, side: boolean, size?: number) {
        let bootImports = `import storage\n`
        let bootPy = `storage.remount("/", readonly=True)\nm = storage.getmount("/")\n`
        if (split) {
            bootPy += `m.label = "${name.toUpperCase()}${side ? "R" : "L"}"\n`
        } else {
            bootPy += `m.label = "${name.toUpperCase()}"\n`
        }
        bootPy += `storage.remount("/", readonly=False)\nstorage.enable_usb_drive()\n`
        if (size && size > 0) {
            bootImports += `import supervisor\n`
            bootPy += `supervisor.set_next_stack_limit(${size} + ${size})`
        }
        return `${bootImports}${bootPy}`
    }
}

