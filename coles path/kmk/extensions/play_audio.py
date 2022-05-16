from kmk.extensions import Extension
from kmk.handlers.stock import passthrough as handler_passthrough
from kmk.keys import make_key
import gc
import time
import array
import math
import board
import digitalio
from audiocore import RawSample
from audiocore import WaveFile
import audiomixer
try:
    from audioio import AudioOut
except ImportError:
    try:
        from audiopwmio import PWMAudioOut as AudioOut
    except ImportError:
        pass  # not always supported by every board!



class Play_audio(Extension):
    def __init__(
        self,
        board, 
        file_count=5
    ):
        self._file_count=file_count
        self._sound_layer=0
        self._audio = AudioOut(board.data_pin)
        make_key(
            names=('UP_LAYER',), on_press=self._up_layer, on_release=handler_passthrough
        )
        make_key(
            names=('DN_LAYER',), on_press=self._down_layer, on_release=handler_passthrough
        )
        make_key(
            names=('HOME_LAYER',), on_press=self._home_layer, on_release=handler_passthrough
        )
        make_key(
            names=('A0',), on_press=self._play_a0, on_release=handler_passthrough
        )
        make_key(
            names=('A1',), on_press=self._play_a1, on_release=handler_passthrough
        )
        make_key(
            names=('A2',), on_press=self._play_a2, on_release=handler_passthrough
        )
        make_key(
            names=('A3',), on_press=self._play_a3, on_release=handler_passthrough
        )
        make_key(
            names=('A4',), on_press=self._play_a4, on_release=handler_passthrough
        )
        make_key(
            names=('A5',), on_press=self._play_a5, on_release=handler_passthrough
        )
        make_key(
            names=('A6',), on_press=self._play_a6, on_release=handler_passthrough
        )
        make_key(
            names=('A7',), on_press=self._play_a7, on_release=handler_passthrough
        )
        make_key(
            names=('A8',), on_press=self._play_a8, on_release=handler_passthrough
        )
        make_key(
            names=('A9',), on_press=self._play_a9, on_release=handler_passthrough
        )
        make_key(
            names=('A10',), on_press=self._play_a10, on_release=handler_passthrough
        )
        make_key(
            names=('A11',), on_press=self._play_a11, on_release=handler_passthrough
        )
        make_key(
            names=('A12',), on_press=self._play_a12, on_release=handler_passthrough
        )
        make_key(
            names=('A13',), on_press=self._play_a13, on_release=handler_passthrough
        )
        make_key(
            names=('A14',), on_press=self._play_a14, on_release=handler_passthrough
        )
        make_key(
            names=('A15',), on_press=self._play_a15, on_release=handler_passthrough
        )
        make_key(
            names=('A16',), on_press=self._play_a16, on_release=handler_passthrough
        )
        make_key(
            names=('A17',), on_press=self._play_a17, on_release=handler_passthrough
        )
        make_key(
            names=('A18',), on_press=self._play_a18, on_release=handler_passthrough
        )
        make_key(
            names=('A19',), on_press=self._play_a19, on_release=handler_passthrough
        )
        make_key(
            names=('A20',), on_press=self._play_a20, on_release=handler_passthrough
        )
        gc.collect()
    def _home_layer(self, *args, **kwargs):
        self._sound_layer=0
        print(self._sound_layer)
    def _up_layer(self, *args, **kwargs):
        self._sound_layer+=1
        print("up")
        print(self._sound_layer)
    def _down_layer(self, *args, **kwargs):
        self._sound_layer-=1
        if self._sound_layer<0:
            sound_layer=0
        print("down")
        print(self._sound_layer)
    def _play_sounds(self,number):
        file_number= number+self._sound_layer
        if file_number>self._file_count:
            file_number=self._file_count
        print(self._sound_layer)
        file_name=""+str(file_number)+".wav"
        wave_file = open(file_name, "rb")
        wave = WaveFile(wave_file)
        self._audio.play(wave)
        gc.collect()

    def _play_a0(self, *args, **kwargs):
       self._play_sounds(0)
    def _play_a1(self, *args, **kwargs):
        self._play_sounds(1)
    def _play_a2(self, *args, **kwargs):
        self._play_sounds(2)
    def _play_a3(self, *args, **kwargs):
        self._play_sounds(3)
    def _play_a4(self, *args, **kwargs):
        self._play_sounds(4)
    def _play_a5(self, *args, **kwargs):
        self._play_sounds(5)
    def _play_a6(self, *args, **kwargs):
        self._play_sounds(6)
    def _play_a7(self, *args, **kwargs):
        self._play_sounds(7)
    def _play_a8(self, *args, **kwargs):
        self._play_sounds(8)
    def _play_a9(self, *args, **kwargs):
        self._play_sounds(9)
    def _play_a10(self, *args, **kwargs):
        self._play_sounds(10)
    def _play_a11(self, *args, **kwargs):
        self._play_sounds(11)
    def _play_a12(self, *args, **kwargs):
        self._play_sounds(12)
    def _play_a13(self, *args, **kwargs):
        self._play_sounds(13)
    def _play_a14(self, *args, **kwargs):
        self._play_sounds(14)
    def _play_a15(self, *args, **kwargs):
        self._play_sounds(15)
    def _play_a16(self, *args, **kwargs):
        self._play_sounds(16)
    def _play_a17(self, *args, **kwargs):
        self._play_sounds(17)
    def _play_a18(self, *args, **kwargs):
        self._play_sounds(18)
    def _play_a19(self, *args, **kwargs):
        self._play_sounds(19)
    def _play_a20(self, *args, **kwargs):
        self._play_sounds(20)








                

    

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

