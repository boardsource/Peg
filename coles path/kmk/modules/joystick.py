import digitalio
import analogio

from kmk.kmktime import PeriodicTimer
from kmk.keys import make_argumented_key
from kmk.modules import Module
from kmk.modules.mouse_keys import PointingDevice
from adafruit_hid.mouse import Mouse
import usb_hid








class JoyStick(Module):
    def __init__(self,x_pin,y_pin):
        self.y_axis = analogio.AnalogIn(y_pin)
        self.x_axis = analogio.AnalogIn(x_pin)
        self.pot_min = 0.00
        self.pot_max = 3.29
        self.step = (self.pot_max - self.pot_min) / 20.0
        self.pointing_device = PointingDevice()
        self.polling_interval = 20
        self.mouse = Mouse(usb_hid.devices)

        self.move_step = 1
        self.big_step = 1
        print("starting")


    def get_voltage(self, pin):
        return (pin.value * 3.3) / 65536    
       
    def steps(self, axis):
        return round((axis - self.pot_min) / self.step)

    def during_bootup(self, keyboard):
        self._timer = PeriodicTimer(self.polling_interval)

    def before_matrix_scan(self, keyboard):
      
        if not self._timer.tick():
            # print("returniing")
            return
        # print("loop")
        x = self.get_voltage(self.x_axis)
        y = self.get_voltage(self.y_axis)
        # print("x",x,"y",y)

        if self.steps(x) > 11.0:
            self.pointing_device.report_x[0] = 0xFF & (0 - self.move_step)
        else:
            self.pointing_device.report_x[0] = 0

        if self.steps(x) < 9.0
            self.pointing_device.report_x[0] = 0xFF & (0 - self.move_step)
        else:
            self.pointing_device.report_x[0] = 0

        if self.steps(x) > 19.0:
            self.pointing_device.report_x[0] = self.move_step
        else:
            self.pointing_device.report_x[0] = 0

        if self.steps(x) < 1.0:
            self.pointing_device.report_x[0] = self.move_step
        else:
            self.pointing_device.report_x[0] = 0

        if self.steps(y) > 11.0:
            print("y",self.steps(y))
            # self.mouse.move(y=-1)
        if self.steps(y) < 9.0:
            print("y",self.steps(y))
            # self.mouse.move(y=1)

        if self.steps(y) > 19.0:
            print("y",self.steps(y))
            # self.mouse.move(y=-8)
        if self.steps(y) < 1.0:
            print("y",self.steps(y))
            # self.mouse.move(y=8)
        self.pointing_device.hid_pending = True


    def after_matrix_scan(self, keyboard):
        return None

    def before_hid_send(self, keyboard):
        return None
    def _clear_pending_hid(self):
        self.pointing_device.hid_pending = False


    def after_hid_send(self, keyboard):
        if self.pointing_device.hid_pending:
            keyboard._hid_helper.hid_send(self.pointing_device._evt)
            self._clear_pending_hid()
        return


    def on_powersave_enable(self, keyboard):
        return None

    def on_powersave_disable(self, keyboard):
        return None
