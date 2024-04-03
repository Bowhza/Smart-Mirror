# Imports
from gpiozero import MCP3008, PWMLED, LED
from PiicoDev_VEML6030 import PiicoDev_VEML6030
import grove_gesture_sensor as ggs
import screen_brightness_control as sbc
import monitorcontrol as mc
from time import sleep
from config import os, json
from app import read_properties

# Initialize devices
# PIR sensor and pot from ADC
PIR = MCP3008(0)
POT = MCP3008(1)

# LED on pin 17
LED = LED(17)

# Ambient light sensot
light = PiicoDev_VEML6030(addr=0x48)

# Gesture sensor
g_sens = ggs.gesture()
g_sens.init()

# Monitor
monitor = mc.get_monitors()

# Timeout int
seconds = 0

# Function that returns monitors current display state
def display_state():
 # Iterate through the monitors bus
 for mon in monitor:
    with mon:
        # Attempt to retrieve the current power mode
        # This will not work if the monitor is off 
        try:
            state = mon.get_power_mode()
            return state
        
        # Print the error if it occurs
        except Exception as ex:
            print(ex)

# Function that turns off the monitor
def display_off():
    # Iterate through the monitors bus
    for mon in monitor:
        with mon:
            # Attempt to turn the monitor off
            # This will not work if the monitor is already off
            try:
                mon.set_power_mode("off_soft")
                print("Turned OFF")

            # Print the error if it occurs
            except Exception as ex:
                print(ex)

# Function that turns on the monitor
def display_on():
    # Iterate through the monitors bus
    for mon in monitor:
        with mon:
            # Attempt to turn the monitor on
            try:
                mon.set_power_mode("on")
                print("Turned ON.")
            # Print the error if it occurs
            except Exception as ex:
                print(ex)

def main_sensor_loop():
    while True:
        properties = read_properties()

        sleep(1)
        pir_voltage = round(PIR.value * 3.30, 3)
        pot_voltage = round(POT.value * 3.3, 3)
        lightVal = light.read()
        gesture = g_sens.return_gesture()

        print(str(lightVal) + " lux")
        print(f'PIR Voltage: {pir_voltage}V')
        print(f'POT Voltage: {pot_voltage}V')

        # PIR sensor 
        if properties["proximity"] is True:
            if pir_voltage >= pot_voltage:
                seconds = 0
                LED.on()
                display_on()
            
            else:
                seconds+=1
                if seconds >= 5:
                    LED.off()
                    display_off()

        if properties["ambient"] is True:
            # Brightness adjustment
            try:
                if lightVal >= 1500:
                    lightVal = 1500

                brightness = (100/1500) * lightVal
                sbc.set_brightness(brightness)
                
                print(f'Brightness: {sbc.get_brightness()}')
            except Exception as ex:
                print("Cannot set or read brightness, Monitor is off.")

        if properties["gesture"] is True:
            # Toggle display state on wave
            if gesture == 9:
                if display_state():
                    display_off()
                else:
                    display_on()
