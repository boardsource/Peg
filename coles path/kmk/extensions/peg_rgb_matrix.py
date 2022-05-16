import neopixel
from kmk.extensions import Extension
from kmk.handlers.stock import passthrough as handler_passthrough
from kmk.keys import make_key
import gc


rgb_config = {}


class AnimationModes:
    OFF = 0
    STATIC = 1
    STATIC_STANDBY = 2
    BREATHING = 3
    RAINBOW = 4
    BREATHING_RAINBOW = 5
    KNIGHT = 6
    SWIRL = 7
    USER = 8


class Rgb_matrix(Extension):
    def __init__(
        self,
        board,
        rgb_order = (1, 0, 2),  # GRB WS2812
        disable_auto_write = False,
        ledDisplay = [],
        split = False,
        rightSide = False
    ):
        self.neopixel = neopixel.NeoPixel(
            board.rgb_pixel_pin,
            board.num_pixels,
            brightness=board.brightness_limit,
            pixel_order=rgb_order,
            auto_write=not disable_auto_write,
        )
        self.disable_auto_write=disable_auto_write
        self.num_pixels = board.num_pixels
        self.brightness_limit = board.brightness_limit
        self.split = split
        self.rightSide = rightSide
        self.keyPos = board.ledKeypos
        self.ledDisplay = ledDisplay
        
        make_key(
            names=('RGB_TOG',), on_press=self._rgb_tog, on_release=handler_passthrough
        )
        gc.collect()

    
    def _rgb_tog(self, *args, **kwargs):
        if self.enable:
            self.off()
        else:
            self.on()
        self.enable = not self.enable

    
    def on(self):
        if self.neopixel:
            self.setBasedOffDisplay()
            self.neopixel.show()

    def off(self):
        if self.neopixel:
            self.set_rgb_fill((0, 0, 0)) 
    
    def set_rgb_fill(self, rgb):
        if self.neopixel:
            self.neopixel.fill(rgb)
            if self.disable_auto_write:
                self.neopixel.show()
        gc.collect()

                
    def setBasedOffDisplay(self):
        if self.split:
            for i, val in enumerate(self.ledDisplay):
                if self.rightSide:
                    if self.keyPos[i] >= (self.num_pixels/2):
                        self.neopixel[int(self.keyPos[i]-(self.num_pixels/2))]=(val[0], val[1], val[2])
                else:
                     if self.keyPos[i] <= (self.num_pixels/2):
                        self.neopixel[self.keyPos[i]]=(val[0], val[1], val[2])
        else:    
            for i, val in enumerate(self.ledDisplay):
                self.neopixel[self.keyPos[i]]=(val[0], val[1], val[2])
        gc.collect()

    

    def on_runtime_enable(self, sandbox):
        return

    def on_runtime_disable(self, sandbox):
        return

    def during_bootup(self, sandbox):
        self.on()
        return

    def before_matrix_scan(self, sandbox):
        return

    def after_matrix_scan(self, sandbox):
        return

    def before_hid_send(self, sandbox):
        return

    def after_hid_send(self, sandbox):
        return

    def on_powersave_enable(self, sandbox):
        return

    def on_powersave_disable(self, sandbox):
        return

