# The MIT License (MIT)
# Copyright (c) 2020 Mike Teachman
# https://opensource.org/licenses/MIT

# Platform-specific MicroPython code for the rotary encoder module
# ESP8266/ESP32 implementation

# Documentation:
#   https://github.com/MikeTeachman/micropython-rotary

from machine import Pin
from sys import platform

_esp8266_deny_pins = [16]
_DIR_CW = const(0x10)  # Clockwise step
_DIR_CCW = const(0x20) # Counter-clockwise step

PORTS_DIGITAL = [(18, 19), (4, 5), (13, 14), (39, 36), (32, 33), (25, 26)]

# Rotary Encoder States
_R_START =   const(0x0)
_R_CW_1 =    const(0x1)
_R_CW_2 =    const(0x2)
_R_CW_3 =    const(0x3)
_R_CCW_1 =   const(0x4)
_R_CCW_2 =   const(0x5)
_R_CCW_3 =   const(0x6)
_R_ILLEGAL = const(0x7)

_transition_table = [

  #|------------- NEXT STATE -------------|            |CURRENT STATE|
  # CLK/DT    CLK/DT     CLK/DT    CLK/DT               
  #   00        01         10        11
  [_R_START, _R_CCW_1,  _R_CW_1,  _R_START],            # _R_START
  [_R_CW_2,  _R_START,  _R_CW_1,  _R_START],            # _R_CW_1
  [_R_CW_2,  _R_CW_3,   _R_CW_1,  _R_START],            # _R_CW_2
  [_R_CW_2,  _R_CW_3,   _R_START, _R_START | _DIR_CW],  # _R_CW_3    
  [_R_CCW_2, _R_CCW_1,  _R_START, _R_START],            # _R_CCW_1  
  [_R_CCW_2, _R_CCW_1,  _R_CCW_3, _R_START],            # _R_CCW_2  
  [_R_CCW_2, _R_START,  _R_CCW_3, _R_START | _DIR_CCW], # _R_CCW_3
  [_R_START, _R_START,  _R_START, _R_START]]            # _R_ILLEGAL

_STATE_MASK = const(0x07)
_DIR_MASK = const(0x30)  

def _wrap(value, incr, lower_bound, upper_bound):
    range = upper_bound - lower_bound + 1
    value = value + incr    
    
    if value < lower_bound:
        value += range * ((lower_bound - value) // range + 1)
    
    return lower_bound + (value - lower_bound) % range     

def _bound(value, incr, lower_bound, upper_bound):
    return min(upper_bound, max(lower_bound, value + incr))

class Rotary(object): 
 
    RANGE_UNBOUNDED = const(1)  
    RANGE_WRAP = const(2)
    RANGE_BOUNDED = const(3)
 
    def __init__(self, port, min_val, max_val, reverse, range_mode):
        self._min_val = min_val
        self._max_val = max_val
        self._reverse = -1 if reverse else 1
        self._range_mode = range_mode
        self._value = min_val
        self._old_value = min_val
        self._state = _R_START
        
    def set(self, port, value=None, min_val=None, max_val=None, reverse=None, range_mode=None):
        # disable DT and CLK pin interrupts
        self._hal_disable_irq()
        
        if value != None:
            self._value = value
        if min_val != None:
            self._min_val = min_val
        if max_val != None:
            self._max_val = max_val
        if reverse != None:
            self._reverse = -1 if reverse else 1
        if range_mode != None:
            self._range_mode = range_mode
        self._state = _R_START

        # enable DT and CLK pin interrupts
        self._hal_enable_irq()
    
    def value(self, port):
        return self._value

    def reset(self, port):
        self._value = 0
        
    def close(self, port):
        self._hal_close()
        
    def _process_rotary_pins(self, port, pin):
        clk_dt_pins = (self._hal_get_clk_value() << 1) | self._hal_get_dt_value()
        # Determine next state
        self._state = _transition_table[self._state & _STATE_MASK][clk_dt_pins]
        direction = self._state & _DIR_MASK

        incr = 0        
        if direction == _DIR_CW:
            incr = 1
        elif direction == _DIR_CCW:
            incr  = -1
            
        incr *= self._reverse
            
        if self._range_mode == self.RANGE_WRAP:
            self._value = _wrap(self._value, incr, self._min_val, self._max_val)
        elif self._range_mode == self.RANGE_BOUNDED:
            self._value = _bound(self._value, incr, self._min_val, self._max_val)
        else:
            self._value = self._value + incr

class RotaryIRQ(Rotary): 
    
    def __init__(self, port, min_val=0, max_val=10, reverse=False, range_mode=Rotary.RANGE_UNBOUNDED, pull_up=False):
        self.port = port
        if port < 0 or port > 5:
            print('Port not supported')
        self._reset_port(port)

        super().__init__(min_val, max_val, reverse, range_mode)
        
        if pull_up == True:
            self._pin_clk = Pin(PORTS_DIGITAL[port][0], Pin.IN, Pin.PULL_UP)
            self._pin_dt = Pin(PORTS_DIGITAL[port][1], Pin.IN, Pin.PULL_UP)
        else:
            self._pin_clk = Pin(PORTS_DIGITAL[port][0], Pin.IN)
            self._pin_dt = Pin(PORTS_DIGITAL[port][1], Pin.IN)

        self._enable_clk_irq(self._process_rotary_pins)        
        self._enable_dt_irq(self._process_rotary_pins)   
        
    def _enable_clk_irq(self, port, callback=None):
        self._pin_clk.irq(trigger=Pin.IRQ_RISING | Pin.IRQ_FALLING, handler=callback)
        
    def _enable_dt_irq(self, port, callback=None):
        self._pin_dt.irq(trigger=Pin.IRQ_RISING | Pin.IRQ_FALLING, handler=callback)
        
    def _disable_clk_irq(self, port):
        self._pin_clk.irq(handler=None)
        
    def _disable_dt_irq(self, port):
        self._pin_dt.irq(handler=None)     
    
    def _hal_get_clk_value(self, port):
        return self._pin_clk.value()
        
    def _hal_get_dt_value(self, port):
        return self._pin_dt.value()   
    
    def _hal_enable_irq(self, port):
        self._enable_clk_irq(self._process_rotary_pins)        
        self._enable_dt_irq(self._process_rotary_pins)   

    def _hal_disable_irq(self, port): 
        self._disable_clk_irq()
        self._disable_dt_irq()     

    def _hal_close(self, port):
        self._hal_disable_irq()

    def get_steps(self, port):
        changed_steps = self._value - self._old_value
        self._old_value = self._value
        return changed_steps

rotary_encoder = RotaryIRQ(0, min_val=0, max_val=10, reverse=True, range_mode=RotaryIRQ.RANGE_UNBOUNDED, pull_up=False)