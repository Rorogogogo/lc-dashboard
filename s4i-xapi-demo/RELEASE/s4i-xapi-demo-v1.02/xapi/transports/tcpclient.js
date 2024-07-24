/*
    Product: 
        S4i IB XAPI JS
    
    Module: 
        TCP Client Transport

    Copyright (C) 2022 Solutions For Integerators Pty Ltd.
*/

const EventEmitter = require('events');
const net = require('net');
const util = require('../util');

class TCPClient extends EventEmitter {
    constructor(options) {
        super();
        let _this = this;
        _this.host = options.hostname;
        _this.port = options.port;
        _this.enableLogging = options.enableLogging;
    }

    isClosed() {
        let _this = this;
        return !_this.socket || _this.socket.closed;
    }

    send(msg) {
        let _this = this;
        if (_this.isClosed()) {
            if (_this.enableLogging) {
                console.log("Closed, cannot send.")
            }
        }
        _this.socket.write(msg)
    }

    enable() {
        let _this = this;
        _this.socket = new net.Socket();

        _this.socket.on('data', (data) => {
            let str = util.bin2string(data);
            console.log(str)
            _this.emit('message', str);
        });

        _this.socket.on('close', () => {
            _this.emit('close');
            _this.socket.destroy();
        });

        _this.socket.on('connect', () => {
            _this.emit('connect');
        })

        _this.socket.on('error', (err) => {
            console.log("Error:", err)
        });
        console.log("Connecting to ", _this.host, _this.port)
        _this.socket.connect(_this.port, _this.host);
    }

    disable() {
        let _this = this;
        if (_this.socket) {
            _this.socket.destroy();
        }
    }
}



function create(options) {
    return new TCPClient(options);
}

exports.create = create;