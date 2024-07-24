/*
    Product: 
        S4i IB XAPI JS
    
    Module: 
        XAPI Client

    Copyright (C) 2022 Solutions For Integerators Pty Ltd.
*/

const EventEmitter = require('events');
const codec = require('./codec')
const wstransport = require('./transports/wsclient')
const tcptransport = require('./transports/tcpclient')

class Client extends EventEmitter {
    constructor(options) {
        super();
        console.log("[Client] Client Options:", options)
        let _this = this;
        _this.options = options;
        _this.enableLogging = options.enableLogging;
        _this.autoReconnect = options.autoReconnect;
        _this.running = false;

        //Codec
        _this.codec = codec.create(options.enableLogging);
        _this.codec.on("error", (err) => {
            _this.emit("error", err);
        })

        _this.codec.on("keepalive", () => {
            _this.emit("keepalive");
        });

        _this.codec.on("details", (obj, details) => {
            _this.emit("details", obj, details);
        });
        _this.codec.on("value", (obj, value) => {
            _this.emit("value", obj, value);
        });

        //Transport
        _this.transport = _this.newTransportFromURL(
            options.url,
            options.enableLogging);

        _this.transport.on('message', (data) => {
            _this.codec.parseString(data);
        });

        _this.transport.on('close', () => {
            _this.transport.disable();
            if (_this.autoReconnect && _this.running) {
                setTimeout(() => {
                        _this.transport.enable()
                    },
                    5000);
            }
            _this.emit('close');
        });

        _this.transport.on('connect', () => {
            if (_this.options.enableLogging) console.log("[Client] Connected");
            _this.emit('connect');
        })

        _this.transport.on('error', (err) => {
            console.log("[Client]:", err)
            _this.emit('error', err);
        });
    }

    newTransportFromURL(url, enableLogging) {
        let u = new URL(url);
        if (u.protocol == "tcp:") {
            return tcptransport.create({
                hostname: u.hostname,
                port: u.port,
                enableLogging: enableLogging
            });
        }
        if (u.protocol == "ws:" || u.protocol == "wss:") {
            return wstransport.create({
                url: url,
                enableLogging: enableLogging,
                bin: true
            });
        }
    }

    isConnected() {
        let _this = this;
        return _this.running && _this.transport && !_this.transport.isClosed();
    }

    start() {
        let _this = this;
        _this.running = true;
        _this.transport.enable();
    }

    stop() {
        let _this = this;
        _this.running = false;
        _this.transport.disable();
    }

    send(msg) {
        let _this = this;
        if (_this.transport.isClosed()) {
            console.log("[Client] ERROR: Transport closed, cannot send.");
            return;
        }
        if (_this.options.enableLogging) console.log("[Client] C->S: ", msg);
        _this.transport.send(msg);
    }

    queryDetails(objId, start, num) {
        this.send(this.codec.cmdQueryDetails(objId, start, num));
    }

    queryValue(objId) {
        this.send(this.codec.cmdQueryValue(objId));
    }

    set(obj, p) {
        this.send(this.codec.cmdSetValue(obj, `${p}`))
    }

    inc(obj, delta) {
        this.send(this.codec.cmdInc(obj, `${delta}`))
    }

    dec(obj, delta) {
        this.send(this.codec.cmdDec(obj, `${delta}`))
    }

    toggle(obj, durationMs = 0) {
        this.send(this.codec.cmdToggle(obj, `${durationMs}`))
    }

    pulse(obj, durationMs = 0) {
        this.send(this.codec.cmdPulse(obj, `${durationMs}`))
    }

    setRGBWP(obj, r, g, b, w, p) {
        this.set(obj,
            `${r?r:""}:${g?g:""}:${b?b:""}:${w?w:""}:${p?p:""}`)
    }
}

function create(options) {
    return new Client(options);
}

exports.create = create;