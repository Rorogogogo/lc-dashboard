/*
    Product: 
        S4i IB XAPI JS
    
    Module: 
        Websockets Client Transport (support both browser and nodejs)

    Copyright (C) 2022 Solutions For Integerators Pty Ltd.
*/

const WebSocketNodeJS = require('ws');
const EventEmitter = require('events');
const util = require('../util');

class WSClient extends EventEmitter {
    constructor(options) {
        super();
        let _this = this;
        _this.url = options.url;
        _this.bin = options.bin;
        _this.enableLogging = options.enableLogging;
        _this.isBrowser = typeof window != 'undefined';
        _this.enabled = false;
    }

    isClosed() {
        let _this = this;
        if (!_this.wsock) {
            return false;
        }
        if (_this.isBrowser) {
            return _this.wsock.readyState != WebSocket.OPEN;
        }
        return _this.wsock.readyState != WebSocketNodeJS.OPEN;
    }

    send(msg) {
        let _this = this;
        console.log("[WS] send: ", msg)
        if (_this.isClosed()) {
            console.log("[WS] ERROR: Closed, cannot send.")
        }
        _this.wsock.send(msg, { binary: _this.isBin })
    }

    enable() {
        let _this = this;
        _this.enabled = true;
        if (_this.isBrowser) {
            _this.initForBrowser();
        } else {
            _this.initForNode();
        }
    }

    initForNode() {
        let _this = this;
        _this.wsock = new WebSocketNodeJS(_this.url);
        _this.wsock.on("open", () => {
            _this.emit("connect");
        });

        _this.wsock.on("close", () => {
            _this.emit("close")
        });

        _this.wsock.on("error", (err) => {
            if (_this.enableLogging) console.log("[WS-Node] Error", err)
            _this.emit("error", err);
        });

        _this.wsock.on("message", (data, isbin) => {
            if (_this.enableLogging) console.log("[WS] RX:", data);
            if (isbin) {
                _this.emit("data", util.bin2string(data));
                return;
            }
            _this.emit("data", data);
        })

        //_this.websocket.conn

    }

    initForBrowser() {
        let _this = this;
        if (_this.enableLogging) console.log("[WS-Browser] ", "Init websocket for browser:", _this.url);
        let sock = new WebSocket(_this.url);

        sock.onopen = function(e) {
            _this.emit("connect");
        };

        sock.onmessage = function(event) {
            _this.emit("message", event.data);
        };

        sock.onclose = function(event) {
            _this.emit("close");
        };

        sock.onerror = function(sender, evt) {
            _this.emit("error", evt);
        };
        _this.wsock = sock;
    }

    disable() {
        let _this = this;
        _this.enabled = false;
        _this.wsock.close();
    }
}

function create(options) {
    return new WSClient(options);
}

exports.create = create;