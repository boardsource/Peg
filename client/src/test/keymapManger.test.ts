import { KeyMap } from "../logic/keymapManager";
const mainPy = `
from kb import KMKKeyboard
from kmk.keys import KC
from kmk.modules.layers import Layers
from kmk.modules.modtap import ModTap
from kmk.hid import HIDModes
from kmk.handlers.sequences import send_string
import supervisor
from kmk.extensions.RGB import RGB
from kmk.modules.split import Split, SplitSide, SplitType
keyboard = KMKKeyboard()
modtap = ModTap()
layers_ext = Layers()
rgb_ext = RGB(pixel_pin=keyboard.rgb_pixel_pin, num_pixels=54)
keyboard.extensions.append(rgb_ext)
# TODO Comment one of these on each side
split_side = SplitSide.LEFT
#split_side = SplitSide.RIGHT
if supervisor.runtime.usb_connected:
       split = Split(split_side = split_side)
else:
        split = Split(split_type=SplitType.BLE,split_side = split_side)
keyboard.modules = [layers_ext, modtap,split]
# keymap
keyboard.keymap = [[KC.ESCAPE, KC.Q, KC.W, KC.E, KC.R, KC.T, KC.Y, KC.U, KC.I, KC.O, KC.P, KC.BSPC, KC.ENTER, KC.A, KC.S, KC.D, KC.F, KC.G, KC.H, KC.J, KC.K, KC.L, KC.NO, KC.NO, KC.NO, KC.Z, KC.X, KC.C, KC.V, KC.B, KC.N, KC.M, KC.NO, KC.DOT, KC.NO, KC.NO, KC.NO, KC.NO, KC.NO, KC.NO, KC.NO, KC.NO, KC.RALT, KC.NO], 
[KC.NO, KC.N1, KC.N2, KC.N3, KC.N4, KC.N5, KC.N6, KC.N7, KC.N8, KC.N9, KC.N0, KC.BSPC, KC.NO, KC.NO, KC.NO, KC.NO, KC.NO, KC.NO, KC.LEFT, KC.DOWN, KC.UP, KC.RIGHT, KC.NO, KC.NO, KC.NO, KC.NO, KC.NO, KC.NO, KC.NO, KC.NO, KC.NO, KC.NO, KC.NO, KC.NO, KC.NO, KC.NO, KC.NO, KC.NO, KC.NO, KC.NO, KC.NO, KC.NO, KC.RALT, KC.NO], 
[KC.NO, KC.NO, KC.AT, KC.HASH, KC.NO, KC.NO, KC.NO, KC.NO, KC.NO, KC.NO, KC.NO, KC.BSPC, KC.NO, KC.NO, KC.NO, KC.NO, KC.NO, KC.NO, KC.NO, KC.NO, KC.NO, KC.NO, KC.PIPE, KC.NO, KC.NO, KC.NO, KC.NO, KC.NO, KC.NO, KC.NO, KC.NO, KC.PLUS, KC.NO, KC.NO, KC.NO, KC.NO, KC.NO, KC.NO, KC.NO, KC.NO, KC.NO, KC.NO, KC.RALT, KC.NO], 
[KC.NO, KC.NO, KC.NO, KC.NO, KC.NO, KC.NO, KC.NO, KC.NO, KC.NO, KC.NO, KC.NO, KC.NO, KC.NO, KC.NO, KC.NO, KC.NO, KC.NO, KC.NO, KC.NO, KC.NO, KC.NO, KC.NO, KC.NO, KC.NO, KC.NO, KC.NO, KC.NO, KC.NO, KC.NO, KC.NO, KC.NO, KC.NO, KC.NO, KC.NO, KC.NO, KC.NO, KC.NO, KC.NO, KC.NO, KC.NO, KC.NO, KC.NO, KC.NO, KC.RALT, KC.NO]] 
# keymap
if __name__ == '__main__':
    if supervisor.runtime.usb_connected:
       keyboard.go(hid_type=HIDModes.USB)
    else:
        keyboard.go(hid_type = HIDModes.BLE)
`
const layoutJson = `
{
    "features": {
        "perkey": true,
        "oled": true,
        "ble": false,
        "underglow": true,
        "name": "CRKBDLs",
        "creator": "Foostan",
        "perkeyCount": 42,
        "underglowCount": 12,
        "split": true
    },
    "layout": [
        {
            "x": 0,
            "y": 0.3,
            "w": 1
        },
        {
            "x": 1,
            "y": 0.3,
            "w": 1
        },
        {
            "x": 2,
            "y": 0.1,
            "w": 1
        },
        {
            "x": 3,
            "y": 0,
            "w": 1
        },
        {
            "x": 4,
            "y": 0.1,
            "w": 1
        },
        {
            "x": 5,
            "y": 0.2,
            "w": 1
        },
        {
            "x": 9,
            "y": 0.2,
            "w": 1
        },
        {
            "x": 10,
            "y": 0.1,
            "w": 1
        },
        {
            "x": 11,
            "y": 0,
            "w": 1
        },
        {
            "x": 12,
            "y": 0.1,
            "w": 1
        },
        {
            "x": 13,
            "y": 0.3,
            "w": 1
        },
        {
            "x": 14,
            "y": 0.3,
            "w": 1
        },
        {
            "x": 0,
            "y": 1.3,
            "w": 1
        },
        {
            "x": 1,
            "y": 1.3,
            "w": 1
        },
        {
            "x": 2,
            "y": 1.1,
            "w": 1
        },
        {
            "x": 3,
            "y": 1,
            "w": 1
        },
        {
            "x": 4,
            "y": 1.1,
            "w": 1
        },
        {
            "x": 5,
            "y": 1.2,
            "w": 1
        },
        {
            "x": 9,
            "y": 1.2,
            "w": 1
        },
        {
            "x": 10,
            "y": 1.1,
            "w": 1
        },
        {
            "x": 11,
            "y": 1,
            "w": 1
        },
        {
            "x": 12,
            "y": 1.1,
            "w": 1
        },
        {
            "x": 13,
            "y": 1.3,
            "w": 1
        },
        {
            "x": 14,
            "y": 1.3,
            "w": 1
        },
        {
            "x": 0,
            "y": 2.3,
            "w": 1
        },
        {
            "x": 1,
            "y": 2.3,
            "w": 1
        },
        {
            "x": 2,
            "y": 2.1,
            "w": 1
        },
        {
            "x": 3,
            "y": 2,
            "w": 1
        },
        {
            "x": 4,
            "y": 2.1,
            "w": 1
        },
        {
            "x": 5,
            "y": 2.2,
            "w": 1
        },
        {
            "x": 9,
            "y": 2.2,
            "w": 1
        },
        {
            "x": 10,
            "y": 2.1,
            "w": 1
        },
        {
            "x": 11,
            "y": 2,
            "w": 1
        },
        {
            "x": 12,
            "y": 2.1,
            "w": 1
        },
        {
            "x": 13,
            "y": 2.3,
            "w": 1
        },
        {
            "x": 14,
            "y": 2.3,
            "w": 1
        },
        {
            "x": 4,
            "y": 3.7,
            "w": 1
        },
        {
            "x": 5,
            "y": 3.7,
            "w": 1
        },
        {
            "x": 6,
            "y": 3.2,
            "h": 1.5,
            "w": 1
        },
        {
            "x": 8,
            "y": 3.2,
            "h": 1.5,
            "w": 1
        },
        {
            "x": 9,
            "y": 3.7,
            "w": 1
        },
        {
            "x": 10,
            "y": 3.7,
            "w": 1
        }
    ]
}`



describe("tests for keycodes", () => {
    let keymap: KeyMap

    beforeEach(() => {
        keymap = KeyMap.getInstance()
    });
    afterEach(() => {

    });

    it("will parce a string to layout", () => {
        keymap.ParceLayout(layoutJson)
        expect(keymap.keyLayout).toBeDefined();
    });
    it("will parce a keymap", () => {
        keymap.StringToKeymap(mainPy)
        expect(keymap.keymap.length).toBe(4);
        expect(keymap.keymap[0].length).toBe(44);
    });

    it("you can change any key", () => {
        const newCode = "KC.Q"
        keymap.StringToKeymap(mainPy)
        expect(keymap.keymap[0][0].code).not.toBe(newCode);
        keymap.ChangeKey(0, 0, keymap.codes.KeyCodeForString(newCode))
        expect(keymap.keymap[0][0].code).toBe(newCode);
    });

    it("can go back to a string", () => {
        keymap.StringToKeymap(mainPy)
        const newMainPy = keymap.keymapBackToString()
        expect(newMainPy).toMatch(/# keymap/)
    });


});