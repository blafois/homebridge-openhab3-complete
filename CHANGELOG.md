# Changelog of homebridge-openhab2-complete

## V0.4.0 (unreleased)
* Support for Binary Sensors (Motion Sensor Service , ...) (Supported openHAB items: `Switch` and `Contact`):
    * Motion Sensor Service (with optional Battery Warning Characteristic)
    * Leak Sensor Service (with optional Battery Warning Characteristic)
    * Carbon Monoxide Sensor (with optional Battery Warning & Level Characteristic)
    * Carbon Dioxide Sensor (with optional Battery Warning & Level Characteristic)
* Supporting `Contact` and `Switch` type for Battery Warning Service

Breaking Changes:
* Renamed `habItem` key in configuration for `battery` type to `item`
* Renamed `habBatteryItemStateWarning` key in configuration for `battery` type to `inverted: "false" | "true"`

## V0.3.0
* Support for Window Covering Service (Supported openHAB item: `Rollershutter`)

## V0.2.0
* Support for Humidity Sensor Service (Supported openHAB item: `Number`)
* Support for Temperature Sensor Service (Supported openHAB item: `Number`)
* Added Battery Warning Characteristic to Humidity & Temperature Sensor Services (Supported openHAB item: `Switch`)
* Support for Thermostat Service (Supported openHAB item: Compound service of `Number` and `Switch`)

Breaking changes:

* Renamed `habItem` key in configuration to `item`


## V0.1.0
* Initial release
* Support for Lightbulb Service (Supported openHAB items: `Switch`, `Dimmer` and `Color`)
* Support for Switch Service (Supported openHAB item: `Switch`)