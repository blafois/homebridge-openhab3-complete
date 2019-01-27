'use strict';

const Accessory = require('./Accessory');

const CONFIG = {
    item: "item",
    inverted: "inverted",
    stateItem: "stateItem",
    stateItemInverted: "stateItemInverted"
};

// This is intended to be an abstract class to support Accessories that implement `targetPosition` and `currentPosition`
class CurrentTargetPositionActorAccessory extends Accessory.Accessory {

    constructor(platform, config) {
        super(platform, config);

        [this._item, this._itemType] = this._getAndCheckItemType(CONFIG.item, ['Rollershutter', 'Number', 'Switch']);

        this._inverted = Accessory.checkInvertedConf(this._config, CONFIG.inverted);

        if(this._config[CONFIG.stateItem]) {
            [this._stateItem, this._stateItemType] = this._getAndCheckItemType(CONFIG.stateItem, ['Rollershutter', 'Number', 'Switch', 'Contact']);
            this._stateItemInverted = Accessory.checkInvertedConf(this._config, CONFIG.stateItemInverted);
        }

    }

    _configureCurrentPositionCharacteristic(service) {
        if(this._stateItem) {
            service.getCharacteristic(this.Characteristic.CurrentPosition)
                .on('get', Accessory.getState.bind(this, this._stateItem, this._transformation.bind(this, this._stateItemType, this._stateItemInverted)));
        } else {
            service.getCharacteristic(this.Characteristic.CurrentPosition)
                .on('get', Accessory.getState.bind(this, this._item, this._transformation.bind(this, this._itemType, this._inverted)));
        }
    }

    _configureTargetPositionCharacteristic(service) {
        // If HomeKit is curious about the target state, we will just give him the actual state
        if(this._stateItem) {
            service.getCharacteristic(this.Characteristic.TargetPosition)
                .on('get', Accessory.getState.bind(this, this._stateItem, this._transformation.bind(this, this._stateItemType, this._stateItemInverted)));
        } else {
            service.getCharacteristic(this.Characteristic.TargetPosition)
                .on('get', Accessory.getState.bind(this, this._item, this._transformation.bind(this, this._itemType, this._inverted)));
        }

        service.getCharacteristic(this.Characteristic.TargetPosition)
            .on('set', Accessory.setState.bind(this, this._item, this._transformation.bind(this, this._itemType, this._inverted)))
            .on('set', function(value) { // We will use this to set the actual position to the target position, in order to stop showing 'Closing...' or 'Opening...'
                setTimeout(function(value) {
                        service.setCharacteristic(this.Characteristic.CurrentPosition, value);
                    }.bind(this, value),
                    5000
                );
            }.bind(this));
    }

    _configurePostitionStateCharacteristic(service) {
        service.getCharacteristic(this.Characteristic.PositionState) // We will just fake it, since it is not used anyway
            .on('get', function(callback) {
                callback(null, this.Characteristic.PositionState.STOPPED);
            }.bind(this));
    }

    _configureHoldPosition(service) {
        if(this._itemType === 'Rollershutter') {
            service.getCharacteristic(this.Characteristic.HoldPosition) // Never tested, since I don't know how to invoke it
                .on('set', Accessory.setState.bind(this, this._item, {
                    1: "STOP",
                    "_default": ""
                }));
        } else {
            this._log.debug(`Hold position can only be configured for Rollershutter items not for ${this._itemType} items`);
        }
    }

    _transformation(type, inverted, value) {
        let transformedValue;

        let onCommand = type === 'Contact' ? "OPEN": "ON";
        let offCommand = type === 'Contact' ? "CLOSED": "OFF";

        switch(type) {
            case 'Contact':
            case 'Switch':
                if(value === onCommand) {
                    transformedValue = inverted ?
                        0 :
                        100
                } else if (value === offCommand) {
                    transformedValue = inverted ?
                        100 :
                        0
                } else {
                    if(value >= 50 && !(inverted)) {
                       transformedValue = onCommand
                    } else {
                        transformedValue = offCommand
                    }
                }
                break;
            case 'Rollershutter':
            case 'Number':
                if(inverted) {
                    transformedValue = 100 - value;
                } else {
                    transformedValue = value;
                }
                break;
        }

        this._log.debug(`Transformed ${value} with inverted set to ${this._inverted} for ${this.name} to ${transformedValue}`);
        return transformedValue;
    }
}

const ignore = true;

module.exports = {CurrentTargetPositionActorAccessory, ignore};
