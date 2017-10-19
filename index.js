const express = require("express");
const path = require("path");
const fs = require("fs");

var Service;
var Characteristic;
var UUIDGen;

var expressApp;
var pluginName = "homebridge-http-programmableswitch";
var accessoryName = "HttpProgrammableSwitch";

module.exports = function(homebridge)
{

  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  UUIDGen = homebridge.hap.uuid;
  
  homebridge.registerAccessory(pluginName, accessoryName, HttpProgrammableSwitch);
}

function HttpProgrammableSwitch(log, config)
{
  var self = this;
  this.config = config;
  this.log = log;
  this.name = config.name;
  var port = config.port;
  
  console.log(`Starting HTTP listener on port ${port}...`);
  expressApp = express();
  expressApp.listen(port, (err) =>
  {
    if (err)
    {
      console.error(`Failed to start Express on port ${port}!`, err);
    }
    else
    {
      this.log(`Express is running on port ${port}.`)
    }
  });
  this.log("HTTP listener started.");
  
  config.switches.forEach(function(sw, i) {
    if (sw.maxValue === undefined) sw.maxValue = 2;
    expressApp.get(sw.path, (request, response) => {
      self.triggerSwitch(i, 0);
      response.send(`Switch '${sw.name}' triggered.`);
    });
    expressApp.get(sw.path+"/0", (request, response) => {
      self.triggerSwitch(i, 0);
      response.send(`Switch '${sw.name}' triggered.`);
    });
    if (sw.maxValue >= 1) {
      expressApp.get(sw.path+"/1", (request, response) => {
        self.triggerSwitch(i, 1);
        response.send(`Switch '${sw.name}' triggered.`);
      });
    }
    if (sw.maxValue >= 2) {
      expressApp.get(sw.path+"/2", (request, response) => {
        self.triggerSwitch(i, 2);
        response.send(`Switch '${sw.name}' triggered.`);
      });
    }
  });
}

HttpProgrammableSwitch.prototype.identify = function()
{
  this.log(`identify called for ${this.name}`);
}

HttpProgrammableSwitch.prototype.getServices = function()
{
  var self = this;
  this.log(`getServices called for ${this.name}`);

  this.services = [];
  
  this.config.switches.forEach(function(sw, i) {
    if (sw.maxValue === undefined) sw.maxValue = 2;
    sw.maxValue = Math.max(0, Math.min(2, parseInt(sw.maxValue)));
    var switchService = new Service.StatelessProgrammableSwitch(sw.name, sw.name);
    switchService.getCharacteristic(Characteristic.ProgrammableSwitchEvent)
                      .setProps({ maxValue: sw.maxValue });
    switchService.getCharacteristic(Characteristic.ServiceLabelIndex).setValue(i+1);
  
    self.services.push(switchService);
  });

  return this.services;
}

HttpProgrammableSwitch.prototype.triggerSwitch = function(i, v)
{
  this.log("Triggering switch...");
  var switchService = this.services[i];
  var char = switchService.getCharacteristic(Characteristic.ProgrammableSwitchEvent);
  char.setValue(v);
}