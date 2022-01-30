using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Peg
{
    class MiscKeymapParts
    {
        LayoutFeatures settings;
        ProgramSettings programSettings;
        Keymap keymap;
        public MiscKeymapParts(Layout layout,Keymap keymap) {
            this.settings = layout.features;
            this.programSettings = ProgramSettings.Instance();
            this.keymap = keymap;
        }
        string returnLedDisplay()
        {
            var tempLedMap = new List<string>();
            foreach (var color in keymap.ledMap)
            {
                var templeds = new List<string>();
                templeds.Add((color.h*255).ToString());
                templeds.Add((color.s * 255).ToString());
                templeds.Add((color.v * 255).ToString());
                var combinedColors = String.Join(String.Empty, templeds.ToArray());
                tempLedMap.Add($"[{combinedColors}],");
            }
            return $"ledDisplay=[{ String.Join(String.Empty, tempLedMap.ToArray())}]";
        }
        public string ReturnFileFooter()
        {
            if (settings.ble)
            {
                if (programSettings.seven)
                {
                    return "if __name__ == '__main__':\n    if supervisor.runtime.usb_connected:\n       keyboard.go(hid_type=HIDModes.USB)\n    else:\n        keyboard.go(hid_type = HIDModes.BLE)";
                }
                else
                {
                    return "if __name__ == '__main__': \n    keyboard.go(hid_type = HIDModes.BLE)";
                }
            }
            else
            {
                return "if __name__ == '__main__': \n    keyboard.go(hid_type=HIDModes.USB)";
            }


        }
        public string ReturnFileHeader() {
            string imports = "from kb import KMKKeyboard\nfrom kmk.keys import KC\nfrom kmk.modules.layers import Layers\nfrom kmk.modules.modtap import ModTap\nfrom kmk.hid import HIDModes\nfrom kmk.handlers.sequences import send_string\n";
            string baseCode = "keyboard = KMKKeyboard()\nmodtap = ModTap()\nlayers_ext = Layers()\n";
            // you always send closing new line
            if (programSettings.seven)
            {
                imports += "import supervisor\n";
            }
            if (settings.perkey || settings.underglow)
            {
                var ledMap = returnLedDisplay();

                //todo num of pixels needs to be pulled from the layout;
                imports += "from kmk.extensions.rgb_matrix import Rgb_matrix\n";
                baseCode += $"{ledMap}\nsrgb_ext = RGB(pixel_pin=keyboard.rgb_pixel_pin, num_pixels={settings.perkeyCount+settings.underglowCount},keyPos=keyboard.ledKeypos,ledDisplay=ledDisplay)\nkeyboard.extensions.append(rgb_ext)\n";
            }
            if (settings.split)
            {
                imports += "from kmk.modules.split import Split, SplitSide, SplitType\n";
                baseCode += "# TODO Comment one of these on each side\nsplit_side = SplitSide.LEFT\n#split_side = SplitSide.RIGHT\n";
                if (settings.ble)
                {
                    if (programSettings.seven&&false)
                    {
                        // this does not work the board other board never has a usb pluged into it
                        baseCode += "if supervisor.runtime.usb_connected:\n       split = Split(split_side = split_side)\nelse:\n        split = Split(split_type=Split.BLE,split_side = split_side)\n";
                    }
                    else {
                        baseCode += "split = Split(split_type=Split.BLE,split_side = split_side)\n";
                    }
                }
                else
                {
                    baseCode += "split = Split(split_side = split_side)\n";

                }
                baseCode += "keyboard.modules = [layers_ext, modtap,split]\n";
            }
            else
            {
                baseCode += "keyboard.modules = [layers_ext, modtap]\n";
            }
            return imports + baseCode;
        }
    }
}

