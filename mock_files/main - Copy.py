from kb import KMKKeyboard
from kmk.keys import KC
from kmk.modules.layers import Layers
from kmk.modules.modtap import ModTap
from kmk.hid import HIDModes

keyboard = KMKKeyboard()
# keyboard.debug_enabled = True


modtap = ModTap()
layers_ext = Layers()

keyboard.modules = [layers_ext, modtap]
# Cleaner key names
_______ = KC.TRNS
XXXXXXX = KC.NO

SPACE= KC.LT(2,KC.SPC)
BKSPACE= KC.LT(1,KC.BSPC)
ENTER=KC.LT(2,KC.ENT)
SCLNGUI=KC.MT(KC.SCLN,KC.LGUI)
PALT=KC.MT(KC.P,KC.LALT)
AGUI=KC.MT(KC.A,KC.LGUI)
QALT=KC.MT(KC.Q,KC.LALT)
LOWER = KC.MO(1)
RAISE = KC.MO(2)
ADJUST = KC.LT(3, KC.SPC)
RSFT_ENT = KC.MT(KC.ENT, KC.RSFT)
RSFT_SPC = KC.MT(KC.SPC, KC.RSFT)
KC_Z_SF = KC.LSFT(KC.Z)
KC_SLSF = KC.RSFT(KC.SLSH)

keyboard.keymap = [
    [
        QALT,    KC.W,    KC.E,    KC.R,    KC.T,                         KC.Y,    KC.U,    KC.I,    KC.O,   PALT,
        AGUI,    KC.S,    KC.D,    KC.F,    KC.G,                         KC.H,    KC.J,    KC.K,    KC.L,   SCLNGUI,
        KC_Z_SF, KC.X,    KC.C,    KC.V,    KC.B,                         KC.N,    KC.M,    KC.COMM, KC.DOT, KC_SLSF,
        KC.LALT,            RAISE,       KC.LCTRL,     ENTER,        BKSPACE,     SPACE,      KC.TAB,            KC.MO(3),
    ],
    [
        KC.N1,   KC.N2,   KC.N3,   KC.N4,   KC.N5,                        KC.N6,   KC.N7,  KC.N8,   KC.N9,   KC.N0,
        KC.ESC, _______, _______, _______, _______,                       KC.LEFT, KC.DOWN, KC.UP,   KC.RIGHT, KC.QUOTE,
        _______, KC.GRV, _______, _______, _______,                       KC.MINS, KC.EQL, KC.LCBR, KC.RCBR, KC.BSLS,
        _______, _______, _______, _______,    _______, _______, _______,_______
    ],
    [  
         KC.EXLM,   KC.AT, KC.HASH,  KC.DLR, KC.PERC,                      KC.CIRC, KC.AMPR, KC.ASTR, KC.LPRN, KC.RPRN,
         KC.ESC, _______, _______, _______, _______,                      KC.LEFT, KC.DOWN, KC.UP,   KC.RIGHT, KC.DQT,
         KC.ESC, KC.TILD, _______, _______, _______,                     KC.UNDS, KC.PLUS, KC.LBRC, KC.RBRC, KC.PIPE,
         _______, _______, _______, _______,    _______, _______, _______,_______
    ],
    [  
         KC.F1,    KC.F2,    KC.F3,    KC.F4,    KC.F5,                     XXXXXXX, XXXXXXX, XXXXXXX, XXXXXXX, XXXXXXX,
         KC.F6,    KC.F7,    KC.F8,    KC.F9,   KC.F10,                     XXXXXXX, XXXXXXX, XXXXXXX, XXXXXXX, XXXXXXX,
         KC.F11 ,  KC.F12,   KC.DEL,   _______, _______,                    XXXXXXX, XXXXXXX, XXXXXXX, XXXXXXX, XXXXXXX,
         _______, _______, _______, _______,    _______, _______, _______,_______
    ]
]

if __name__ == '__main__':
    # keyboard.go()
    keyboard.go(hid_type=HIDModes.BLE)
    # keyboard.go(hid_type=HIDModes.BLE, ble_name='KMKeyboard')
