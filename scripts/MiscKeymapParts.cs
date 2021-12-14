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
        public MiscKeymapParts(Layout layout) {
            this.settings = layout.features;
            this.programSettings = ProgramSettings.Instance();
        }
        public string ReturnFileFooter()
        {
            if (settings.ble)
            {
                if (programSettings.seven)
                {
                    return "if __name__ == '__main__':\n    if supervisor.runtime.usb_connected:\n       keyboard.go()\n    else:\n        keyboard.go(hid_type = HIDModes.BLE)";
                }
                else
                {
                    return "if __name__ == '__main__': \n    keyboard.go(hid_type = HIDModes.BLE)";
                }
            }
            else
            {
                return "if __name__ == '__main__': \n    keyboard.go()";
            }


        }
        public string ReturnFileHeader() {
            string imports = "from kb import KMKKeyboard\nfrom kmk.keys import KC\nfrom kmk.modules.layers import Layers\nfrom kmk.modules.modtap import ModTap\nfrom kmk.hid import HIDModes\nfrom kmk.handlers.sequences import send_string\n";
            string baseCode = "keyboard = KMKKeyboard()\nmodtap = ModTap()\nlayers_ext = Layers()\nkeyboard.modules = [layers_ext, modtap]\n";
            // you always send closing new line
            if (programSettings.seven)
            {
                imports += "import supervisor\n";
            }
            if (settings.perkey || settings.underglow)
            {

                //todo num of pixels needs to be pulled from the layout;
                imports += "from kmk.extensions.RGB import RGB\n";
                baseCode += $"rgb_ext = RGB(pixel_pin=keyboard.rgb_pixel_pin, num_pixels={settings.perkeyCount+settings.underglowCount})\nkeyboard.extensions.append(rgb_ext)\n";
            }
            return imports + baseCode;
        }
    }
}

