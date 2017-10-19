# homebridge-http-programmableswitch
[Homebridge](https://github.com/nfarina/homebridge) programmables switches that can be triggered by calling HTTP handler

# Installation
1. Install Homebridge using: ‘npm install -g homebridge‘
2. Install this plugin using npm install -g homebridge-http-programmableswitch‘
3. Edit your configuration file like the example below and restart Homebridge.

# Configuration

  {
    "accessory": "HttpProgrammableSwitch",
    "name": "My switches",
    "port": 3001,
    "switches": [
      {"name": "Switch A", "path": "/swa"},
      {"name": "An other switch", "path": "/anotherswitch", "maxValue": 0},
      ...
    ]
  }

## port
Web server port

## name
Name of your accessory

## switches
Array of all your switches with the following properties :
* ‘name‘: Name of your switch
* ‘path‘: the switch path you want to use
* ‘maxValue‘: can have 3 differents values: ‘0‘ for only simple press, ‘1‘ for simple press and double press, ‘2‘ (default) for simple, double and long press.

# Trigger event
Trigger an event by calling the url ‘http://yourHomebridgeIp:port/switchPath[/X]‘. X can have the following values:
* ‘0‘ or no value: Simple press
* ‘1‘: double press
* ‘2‘: double press

Exemple: ‘http://192.168.0.100:3001/swa/1‘ to trigger a double click on the switch 'Switch A' in the example.


# Known issues
* Sometime, the configuration in Home app takes 1 or 2 minutes to appear.
* The name of your switch does not appear in Home app but appear in Eve app
