//
//To run this demo:
//  * Go to command line
//  * node demo-cli.js
//
var readline = require('readline');
var client = require('../xapi/client');

class CLI {
    constructor(client) {
        let _this = this;
        _this.client = client;
        _this.commands = [{
                cmd: "help",
                desc: "List available commands",
                usage: "",
                handler: () => {
                    console.log("");
                    console.log("Available commands")
                    console.log("------------------------------------------------------------")
                    for (let c of _this.commands) {
                        console.log(c.cmd.padEnd(16), c.desc.padEnd(), c.usage.padStart(16));
                    }
                }
            },
            {
                cmd: "details",
                desc: "Query details",
                usage: "details <obj ID>",
                handler: (values) => {
                    _this.client.queryDetails("*")
                }
            },
            {
                cmd: "set",
                desc: "Set object value",
                usage: "set <obj ID> <Value>",
                handler: (values) => {
                    _this.client.set(values[1], values[2])
                }
            },
            {
                cmd: "query",
                desc: "Query object Value",
                usage: "query <obj ID> <Value>",
                handler: (values) => {
                    _this.client.query(values[1])
                }
            },
            {
                cmd: "inc",
                desc: "Increase Value",
                usage: "inc <obj ID> <Delta>",
                handler: (values) => {
                    _this.client.inc(values[1], values[2])
                }
            },
            {
                cmd: "dec",
                desc: "Increase Value",
                usage: "dec <obj ID> <Delta>",
                handler: (values) => {
                    _this.client.dec(values[1], values[2])
                }
            },
            {
                cmd: "toggle",
                desc: "Toggle Value",
                usage: "toggle <obj ID> <Delta>",
                handler: (values) => {
                    _this.client.toggle(values[1], values[2])
                }
            },
            {
                cmd: "pulse",
                desc: "Pulse",
                usage: "pulse <obj ID> <Duration ms>",
                handler: (values) => {
                    _this.client.pulse(values[1], values[2])
                }
            },
            {
                cmd: "tx",
                desc: "Send raw command",
                usage: "tx <XAPI command>",
                handler: (values) => {
                    _this.client.send(values[1]);
                }
            }

        ];
    }

    tx(msg) {
        this.client.send(tx + ETX);
    }

    rgbw(obj, r, g, b, w) {
        this.client.setRGBW(obj, r, g, b, w);
    }

    set(obj, value) {
        this.client.set(obj, value);
    }

    process(line) {
        let _this = this;
        let values = line.split(" ");
        if (values.length > 0) {
            for (let c of _this.commands) {
                if (c.cmd == values[0]) {
                    c.handler(values)
                    break;
                }
            }
        }
    }

    start() {
        let _this = this;
        let rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            terminal: false
        });

        rl.on('line', function(line) {
            _this.process(line);
        })
    }
}

const defaultUrl = "ws://127.0.0.1:15001"

function usage() {
    console.log("==========================================================")
    console.log("S4i XAPI CLI test")
    console.log("----------------------------------------------------------")
    console.log("Usage: node cli.js <url>")
    console.log("Url scheme can be tcp:// or ws://")
    console.log("----------------------------------------------------------")
    console.log("")
    console.log("")
    console.log("")
}
//Test 
// * Connect to 127.0.0.1:15001
// * Query details of all objects when first time connected.
// * Display "details" and "value" response/events
// * Send raw message captured from stdin
let url = process.argv[2]

if (process.argv.length < 3) {
    usage();
    url = defaultUrl;
    console.log("Using default url: ", url);
} else {
    url = process.argv[2]
}

let clt = client.create({
    url: url,
    autoReconnect: true,
    enableLogging: true
})

clt.on("keepalive", () => {
    console.log("[CLI] S->C keepalive")
})

clt.on("error", (err) => {
    console.log("[CLI]S->C error:", err)
})

clt.on("details", (obj, details) => {
    console.log("[CLI]S->C details: " + obj + ",#," + JSON.stringify(details))
});
clt.on("value", (obj, value) => {
    console.log("[CLI]S->C value: " + obj + ",=," + value)
});

clt.on("connect", () => {
    clt.queryDetails("*");
});

clt.start();

let cli = new CLI(clt);
cli.start();