/*
    Product: 
        S4i IB XAPI JS
    
    Module: 
        XAPI ASCII Codec

    Copyright (C) 2022 Solutions For Integerators Pty Ltd.
*/

const EventEmitter = require('events');
const VERSION = "1.00"
const ErrorMissingArgs = "ERR_MISSING_ARGS";
const ErrorException = "ERR_EXECPTION";
const ETX = "\r\n";

const OpKeepAlive = ".";
const OpQueryDetails = "#";
const OpQueryValue = "?";
const OpSetValue = "=";
const OpInc = "+";
const OpDec = "-";
const OpToggle = "!";
const OpPulse = "~";

class Codec extends EventEmitter {
    constructor(enLogging) {
        super();
        this.enableLogging = enLogging;


    }

    command(cmd) {
        return cmd + ETX;
    }

    cmdOp(objID, op, args = null) {
        let cmd = `${objID},${op}`;
        if (args != null && args.length > 0) {
            let c = 0;
            for (let i = 0; i < args.length; i++) {
                if (args[i] != null) {
                    cmd = `${cmd},${args[i]}`;
                    c++;
                }
            }
        }
        return this.command(cmd);
    }

    cmdQueryValue(objID) {
        return this.cmdOp(objID, OpQueryValue);
    }

    cmdSetValue(objID, value, durationMs = null) {
        return this.cmdOp(objID, OpSetValue, [value, durationMs]);
    }

    cmdQueryDetails(objID = this.Wildcard, start = 0, maxNumOfObjects = 65535) {
        if (!objID) {
            objID = this.Wildcard;
        }
        return this.cmdOp(objID, OpQueryDetails, [start, maxNumOfObjects]);
    }

    cmdRespondDetails(objID, details) {
        return this.cmdOp(objID, OpQueryDetails, [details]);
    }


    cmdPulse(objID, durationMs) {
        return this.cmdOp(objID, OpPulse, [durationMs]);
    }

    cmdToggle(objID, durationMs) {
        return this.cmdOp(objID, OpToggle, [durationMs]);
    }

    cmdInc(objID, delta) {
        return this.cmdOp(objID, OpInc, [delta]);
    }

    cmdDec(objID, delta) {
        return this.cmdOp(objID, OpDec, [delta]);
    }

    parseMessage(msg) {
        let _this = this;
        try {
            const values = msg.split(",");
            if (values.length < 2) {
                console.log("[Codec] Invalid length:", values)
                return;
            }
            let obj = values[0];
            let op = values[1];
            //Parse parameters
            switch (op) {
                case OpKeepAlive:
                    {
                        _this.emit('keepalive');
                    }
                    break;
                case OpQueryDetails:
                    {
                        let details = {}
                        if (values.length >= 3) {
                            for (let i = 2; i < values.length; i++) {
                                let kv = values[i];
                                const fields = kv.split("=")
                                if (fields.length >= 2) {
                                    details[fields[0]] = fields[1];
                                }
                            }
                        }
                        _this.emit('details', obj, details);
                    }
                    break;
                case OpSetValue:
                    {
                        if (values.length >= 3) {
                            _this.emit('value', obj, values[2]);
                        } else {
                            _this.emit('error', ErrorMissingArgs, e);
                        }
                    }
                    break;
                default:
                    break;
            }
        } catch (e) {
            if (_this._OnError) this._OnError(ErrorException, e);
        }

    }

    parseString(rx) {
        //Read a byte
        let _this = this;
        const lines = rx.split(ETX);
        for (let l of lines) {
            if (l.length <= 0) continue;
            _this.parseMessage(l);
        }
    }
}

function create(enableLogging) {
    return new Codec(enableLogging);
}

exports.create = create;