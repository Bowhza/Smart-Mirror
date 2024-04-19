# Imports
from gpiozero import MCP3008, PWMLED, LED
from PiicoDev_VEML6030 import PiicoDev_VEML6030
import grove_gesture_sensor as ggs
import screen_brightness_control as sbc
import monitorcontrol as mc
from time import sleep
from config import os, json
import board
import adafruit_adxl34x
import keyboard

current_directory = os.path.dirname(os.path.realpath(__file__))
file_path = os.path.join(current_directory, "properties.json")

# Initialize devices
# PIR sensor and pot from ADC
def pir_code():
    
    seconds = 0
    
    try:
        PIR = MCP3008(0)
        POT = MCP3008(1)
    except Exception:
        print("ADC could not be initialized!")
        return

    print("ADC initialized!")
    try:
        while True:
            sleep(1)
            properties = read_properties()
            if properties is None:
                print("Properties could not be read!")
                return
            
            # PIR sensor
            if properties["proximity"] is True:
                # print("PIR On")
                pir_voltage = round(PIR.value * 3.30, 3)
                pot_voltage = round(POT.value * 3.3, 3)
                print(f'PIR Voltage: {pir_voltage}V')
                print(f'POT Voltage: {pot_voltage}V')
                if pir_voltage >= pot_voltage:
                    seconds = 0
                    # LED.on()
                    display_on()

                else:
                    seconds += 1
                    if seconds >= 5:
                        print(f"Turning off in {5 - seconds}")
                        # LED.off()
                        display_off()
    except Exception as ex:
        print("PIR or ADC disconnected!")

def ambient_code():
    try:
        # Ambient light sensot
        light = PiicoDev_VEML6030(addr=0x48)
    except Exception as ex:
        print("Ambient Light Sensor could not be initialized!")
        return

    print("Ambient light sensor initialized!")
    try:
        while True:
            sleep(0.5)
            properties = read_properties()
            if properties is None:
                print("Properties could not be read!")
                return
            lightVal = light.read()
            print(str(lightVal) + " lux")
            if properties["ambient"] is True:
                print("Ambient On")
                # Brightness adjustment
                try:
                    if lightVal >= 1500:
                        lightVal = 1500

                    brightness = (100 / 1500) * lightVal
                    sbc.set_brightness(brightness)

                    print(f'Brightness: {sbc.get_brightness()}')
                except Exception as ex:
                    print("Cannot set or read brightness, Monitor is off.")

            else:
                try:
                    sbc.set_brightness(int(properties["displayBrightness"]))
                    print(f'Brightness: {sbc.get_brightness()}')
                except Exception as ex:
                    print("Cannot set or read brightness, Monitor is off.")


    except Exception as ex:
        print("Ambient light sensor disconnected!")
        return


def gesture_code():
    
    try:
        # Gesture sensor
        g_sens = ggs.gesture()
        g_sens.init()
    except:
        print("Gesture Sensor could not be initialized!")
        return

    print("Gesture Sensor initialized!")
    try:
        while True:
            sleep(0.5)
            properties = read_properties()
            if properties is None:
                print("Properties could not be read!")
                return
            if properties["gesture"] is True:
                gesture = g_sens.return_gesture()
                # Toggle display state on wave
                if gesture == 9:
                    # print("wave!")
                    state = display_state()
                    if state == mc.PowerMode.on:
                        display_off()
                    else:
                        display_on()

                if gesture == 5:
                    print("up")
                    keyboard.press_and_release("up")

                if gesture == 6:
                    print("down")
                    keyboard.press_and_release("down")

                if gesture == 4:
                    print("Stop")
                    keyboard.press_and_release("s")

    except Exception as ex:
        print("Gesture Sensor Disconnected!")
        return

def accelerometer_code():
    properties = read_properties()
    if properties is None:
        print("Properties could not be read!")
        return

    try:
        # Accelerometer init
        i2c = board.I2C()
        accelerometer = adafruit_adxl34x.ADXL343(i2c)
        # accelerometer.enable_tap_detection(tap_count=2,threshold=20, duration=50)
        accelerometer.enable_tap_detection(tap_count=2, threshold=50, duration=50, latency=20, window=255)
    except:
        print("Accelerometer could not be initialized!")
        return

    print("Accelerometer initialized!")
    try:
        while True:
            sleep(0.5)
            print("good")
            properties = read_properties()
            if properties is None:
                print("Properties could not be read!")
                return
            
            if properties["accelerometer"]:
                
                # print("%f %f %f" % accelerometer.acceleration)

                if accelerometer.events["tap"]:
                    print("tapped")
                    state = display_state()
                    if state == mc.PowerMode.on:
                        display_off()
                    else:
                        display_on()
                    # print("tapped")
    except Exception as ex:
        print("Accelerometer Disconnected!")
        return


# Monitor
monitor = mc.get_monitors()


# Function that returns monitors current display state
def display_state():
    # Iterate through the monitors bus
    for mon in monitor:
        with mon:
            # Attempt to retrieve the current power mode
            # This will not work if the monitor is off
            try:
                state = mon.get_power_mode()
                print(state)
                return state

            # Print the error if it occurs
            except Exception as ex:
                print("error")
                print(ex)


# Function that turns off the monitor
def display_off():
    global properties
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


def switch_states():
    properties = read_properties()
    message = ""
    try:
        state = display_state()

        if state == mc.PowerMode.on:
            message += "Turned off!"
            display_off()
            properties["powerState"] = False

        else:
            message += "Turned on!"
            display_on()
            properties["powerState"] = True

        with open(file_path, "w") as file:
            json.dump(properties, file, indent=2)

    except Exception as ex:
        message = "error"

    return message


def read_properties():
    try:
        current_directory = os.path.dirname(os.path.realpath(__file__))
        file_path = os.path.join(current_directory, "properties.json")
        # print(current_directory)
        # Construct the relative path to properties.json
        # file_path = os.path.join(current_directory, "properties.json")
        json_file = open(file_path, "r")
        json_data = json_file.read()
        return json.loads(json_data)

    except Exception as ex:
        print("Cannot load JSON file!")
        return None
