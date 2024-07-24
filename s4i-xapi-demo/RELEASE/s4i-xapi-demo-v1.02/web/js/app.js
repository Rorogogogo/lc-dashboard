const client = require('../../xapi/client');

const UIAuto = "Auto";
const UISwitch = "Switch";
const UISlider = "Slider";
const UIRGBW = "RGBW";
const UITunableWhite = "TW";
const UILabel = "Label";

const MaxVAL = 65534;
const VALNoChange = 65535;
const MaxByte = 255;

const RGBWDim = "rgbw-dim";
const RGBWWhite = "rgbw-white";
const TWDim = "tw-dim";
const Dim = "dim";
const TWTC = "tw-tc";

const delay = (delayInms) => {
    return new Promise(resolve => setTimeout(resolve, delayInms));
}

function d2h(d) {
    return (d / 256 + 1 / 512).toString(16).substring(2, 4);
}

function byte2val(byte) {
    return Math.round(byte * MaxVAL / MaxByte);
}

function val2byte(val) {
    if (!val) {
        return null;
    }
    let v = parseInt(val);
    return Math.round(v * MaxByte / MaxVAL);
}

String.prototype.htmlColourToRGB = function() {
    let value = this.replace("#", "");
    let aRgbHex = value.match(/.{1,2}/g);
    let rgb = {
        R: byte2val(parseInt(aRgbHex[0], 16)),
        G: byte2val(parseInt(aRgbHex[1], 16)),
        B: byte2val(parseInt(aRgbHex[2], 16))
    }
    return rgb;
}

String.prototype.toRGBWP = function() {
    let values = this.split(":");
    let rgbw = {
        R: values[0],
        G: values[1],
        B: values[2],
        W: values[3],
        P: values[4]
    }
    rgbw.Colour = "#" + d2h(val2byte(rgbw.R)) + d2h(val2byte(rgbw.G)) + d2h(val2byte(rgbw.B));
    //console.log("toRGBWP:", rgbw);
    return rgbw;
}

String.prototype.toTW = function() {
    let values = this.split(":");
    let tw = {
            TC: values[0],
            P: values[1]
        }
        //console.log("toTW:", tw);
    return tw;
}

String.prototype.formatPercentage = function() {
    if (this == "") {
        return "...";
    }
    let v = Math.round(parseInt(this, 10));
    if (v == VALNoChange) {
        return "";
    }
    let res = Math.round(v * 100 / MaxVAL).toString() + "%";
    return res;
}

String.prototype.formatByte = function() {
    let v = Math.round(parseInt(this, 10));
    if (v == VALNoChange) {
        return "";
    }
    let res = Math.round(v * 255 / MaxVAL).toString();
    return res;
}

String.prototype.formatRGBW = function() {
    let values = this.split(":");
    if (values.length == 5) {
        let res =
            "R=" + values[0].formatByte() +
            ", G=" + values[1].formatByte() +
            ", B=" + values[2].formatByte() +
            ", W=" + values[3].formatByte() +
            ", Dim=" + values[4].formatPercentage();
        return res;
    }
    return str;
}

String.prototype.formatTW = function() {
    let values = this.split(":");
    if (values.length == 2) {
        let res =
            "CCT=" + values[0].formatPercentage() +
            ", Dim=" + values[1].formatPercentage();
        return res;
    }
    return this;
}

String.prototype.formatOnOff = function() {
    //console.log("formatOnOff:", this)
    return (this == "0" || this == "") ? "Off" : "On";
}


class App {
    constructor(enableLogging) {
        this.client = null;
        this.tbObjects = document.getElementById("objects");
        this.numOfObjectsExpected = 0;
        this.objects = [];
        this.enableLogging = enableLogging;
        this.pagination = { numPerPage: 50, curPage: 0, numOfPages: 1 };
        this.summary = null;
    }



    getUrl() {
        return document.getElementById("url").value;
    }


    getNumPerPage() {
        let num = document.getElementById("num-obj-per-page").value;
        if (num == "All") {
            num = 10000;
        }
        return num;
    }

    updatePagination() {
        let _this = this;
        let numPerPage = _this.getNumPerPage();
        let numOfPages = Math.round(_this.summary.TOTAL / numPerPage);

        if (numOfPages <= 1) {
            numOfPages = 1;
        }

        if (numPerPage <= 1) {
            numPerPage = 1;
        }

        _this.pagination.numOfPages = numOfPages;
        _this.pagination.numPerPage = numPerPage;
        if (_this.pagination.curPage >= _this.pagination.numOfPages) {
            _this.pagination.curPage = 0;
        }

        console.log("Pagination:", this.pagination);
        document.getElementById("page_summary").innerText =
            (_this.pagination.curPage + 1) + "/" + (this.pagination.numOfPages)
    }

    updateSummary(summary) {
        let _this = this;
        console.log("Update Summary:", summary)
        _this.summary = summary;

        document.getElementById("summary").innerText =
            summary.NUM + " objects loaded."

        _this.numOfObjectsExpected = parseInt(summary.NUM);

        _this.clearObjects();

        _this.updatePagination();
    }

    updateValue(obj, value) {
        let filter = '[s4i-id="' + obj + '"]';
        let elements = document.querySelectorAll(filter);
        let rgbwp = null;
        let tw = null;
        if (obj.endsWith("/RGBW")) {
            rgbwp = value.toRGBWP();
        }
        if (obj.endsWith("/TW")) {
            tw = value.toTW();
        }
        if (this.enableLogging) console.log("[App]updateValue:", obj, value, rgbwp, filter, elements, typeof(value));
        for (let el of elements) {
            let ui = el.getAttribute("s4i-ui");
            if (el.nodeName == "LABEL") {
                switch (ui) {
                    case UISlider:
                        el.innerText = value.formatPercentage();
                        break;
                    case UIRGBW:
                        el.innerText = value.formatRGBW();
                        break;
                    case UISwitch:
                        el.innerText = value.formatOnOff();
                        break;
                    case UITunableWhite:
                        el.innerText = value.formatTW();
                        break;
                    default:
                        el.innerText = value;
                        break;
                }
            } else {
                switch (ui) {
                    case UISlider:
                        let sliderClass = el.getAttribute("s4i-slider");
                        switch (sliderClass) {
                            case RGBWDim:
                                //console.log("RGBWDim=", rgbwp.P);
                                el.value = rgbwp.P;
                                break;
                            case RGBWWhite:
                                el.value = rgbwp.W;
                                break;
                            case TWDim:
                                el.value = tw.P;
                                break;
                            case TWTC:
                                el.value = tw.TC;
                                break;
                            case Dim:
                                //console.log("Dim=", value);
                                el.value = parseInt(value);
                                break;
                        }
                        break;
                    case UIRGBW:
                        let colour = value.toRGBWP().Colour;
                        if (colour) {
                            el.value = colour;
                        }
                        break;
                    case UISwitch:
                        el.checked = value.formatOnOff() == "On";
                        break;
                    default:
                        el.innerText = value;
                        break;
                }
            }
        }

    }


    getObjectUI(id, details) {
        if (details.UI != UIAuto) {
            return details.UI;
        }
        if (id.endsWith("/RGBW")) {
            return UIRGBW;
        }
        if (id.endsWith("/VAL")) {
            return UISlider;
        }
        if (id.endsWith("/SW")) {
            return UISwitch;
        }
        if (id.endsWith("/TW")) {
            return UITunableWhite;
        }
        if (id.endsWith("/STATUS")) {
            return UILabel;
        }
        return UISlider;
    }

    addObject(id, details) {
        let _this = this;
        let index = parseInt(details.I);
        let obj = {
            id: id,
            index: index,
            label: details.LBL,
            percentage: details.P,
            value: details.V,
        };

        obj.ui = _this.getObjectUI(id, details);
        this.objects.push(obj);
        if (index >= _this.numOfObjectsExpected - 1) {
            //console.log("loadObjects");
            _this.loadObjects(_this.objects);
        }
    }


    isConnected() {
        return this.client && this.client.isConnected();
    }


    setAllValue(val) {
        let _this = this;
        let cnt = 0;
        for (let o of _this.objects) {
            cnt++;
            if (cnt >= 50) {
                cnt = 0;
                console.log("Begin Delay....");
                console.log("End Delay....")
            }
            if (o.id.endsWith("/VAL")) {
                _this.client.set(o.id, val);
            }
            if (o.id.endsWith("/RGBW")) {
                _this.client.set(o.id, "::::" + val);
            }
            if (o.id.endsWith("/TW")) {
                _this.client.set(o.id, ":" + val);
            }
        }
    }

    allOn() {
        let _this = this;
        _this.setAllValue(MaxVAL);
    }

    allOff() {
        let _this = this;
        _this.setAllValue(0);
    }

    connect() {
        let _this = this;

        if (_this.client) {
            if (this.enableLogging) console.log("[App]Stopping previous connection...")
            _this.client.stop();
        }
        let url = _this.getUrl();
        let clt = client.create({
            url: url,
            autoReconnect: true,
            enableLogging: true
        })

        if (this.enableLogging) console.log("[App]Connecting...")

        clt.on("keepalive", () => {
            if (this.enableLogging) console.log("[App]S->C keepalive")
        })

        clt.on("error", (err, msg) => {
            if (this.enableLogging) console.log("[App]Connection error:", err, msg)
            document.getElementById("status").innerText = err;
        })

        clt.on("details", (obj, details) => {
            if (this.enableLogging) console.log("[App]S->C details: " + obj + ",#," + JSON.stringify(details));
            //summary
            if (obj.includes("*")) {
                this.updateSummary(details);
            } else {
                this.addObject(obj, details);
            }
        });
        clt.on("value", (obj, value) => {
            if (this.enableLogging) console.log("[App]S->C value: " + obj + ",=," + value);
            this.updateValue(obj, value);
        });

        clt.on("connect", () => {
            if (this.enableLogging) console.log("[App]XAPI client connected");
            let el = document.getElementById("status");
            el.classList.add("connected");
            el.classList.remove("disconnected");
            el.innerText = "Connected";
        });

        clt.on("close", () => {
            if (this.enableLogging) console.log("[App]XAPI client closed");
            let el = document.getElementById("status");
            el.classList.remove("connected");
            el.classList.add("disconnected");
            el.innerText = "Disconnected";
        });

        _this.client = clt;
        _this.client.start();
    }

    disconnect() {
        if (this.enableLogging) console.log("[App]Disconnect");
        if (this.client) {
            this.client.stop();
        }
    }


    query() {
        let _this = this;

        if (!_this.isConnected()) {
            alert("Not connected");
            return;
        }
        _this.clearObjects();
        let n = _this.getNumPerPage();
        if (_this.pagination.numPerPage != n) {
            _this.pagination.curPage = 0;
        }
        _this.pagination.numPerPage = n;
        if (_this.pagination.curPage >= _this.pagination.numOfPages) {
            _this.pagination.curPage = 0;
        }

        _this.client.queryDetails(
            document.getElementById("query").value,
            _this.pagination.curPage * _this.pagination.numPerPage,
            _this.pagination.numPerPage,
        );
    }

    rgbwToColour(itemValue) {
        return "#00FF00";
    }

    sliderHtml(item, label, sliderClass = "dim") {
        let cls = ``
        if (sliderClass) {
            cls = `s4i-slider="${sliderClass}"`
        }
        return `<label align="center">${label}</label>
                <input type="range"                
                 s4i-id="${item.id}" 
                 ${cls}
                 s4i-ui="${UISlider}"
                 min="0" max="${MaxVAL}"/>`;
    }

    colourHtml(item, label) {
        let colour = this.rgbwToColour(item.value);
        return `<label align="center">${label}</label>
                <input class="rgbw" type="color" 
                s4i-id="${item.id}" 
                value="${colour}" 
                s4i-ui="${UIRGBW}"/>`;
    }

    rgbwHtml(item) {
        return `<div>
            ${this.sliderHtml(item, "Dim", RGBWDim)}                        
            ${this.sliderHtml(item, "White", RGBWWhite)}                        
            ${this.colourHtml(item, "Colour")}
                 </div>`
    }

    tcHtml(item) {
        let tc = item.value;
        return `<input type="range"
                 s4i-id="${item.id}" 
                 value="${item.value}" 
                 s4i-ui="${item.ui} 
                 min="0" max="${MaxVAL}"/>`;
    }

    twHtml(item) {
        return `<div>
        ${this.sliderHtml(item, "Dim", TWDim)}                        
        ${this.sliderHtml(item, "Colour Temp", TWTC)}
        </div>`
    }

    swHtml(item) {
        let p = parseInt(item.percentage);
        let on = p > 0;
        let checked = on ? "checked" : "";
        //console.log("swHtml: ", item, p, on, checked)
        return `<input type="checkbox" 
            role="switch" 
            s4i-id="${item.id}" 
            s4i-ui="${item.ui}"/>`
    }

    labelHtml(item) {
        return `<label 
            s4i-id="${item.id}"
            s4i-ui="${item.ui}">${item.value}</label>`;
    }

    handleSwitchClick(evt) {
        let _this = app;
        if (!_this.isConnected()) {
            console.log("Not connected");
            return;
        }
        let sender = evt.srcElement;
        if (this.enableLogging) console.log("handleSwitchClick:", evt);
        //sender.checked = !sender.checked;
        console.log("handleSwitchClick:", sender, sender.checked);
        let id = sender.getAttribute("s4i-id");
        switch (sender.getAttribute("s4i-ui")) {
            case UISwitch:
                _this.client.toggle(id);
                break;
            default:
                break;
        }
    }

    handleSliderChange(evt) {
        let _this = app;
        if (!_this.isConnected()) {
            console.log("Not connected");
            return;
        }
        let sender = evt.srcElement;
        if (this.enableLogging) console.log("handleSliderChange:", sender);
        let id = sender.getAttribute("s4i-id");
        let sliderClass = sender.getAttribute("s4i-slider");

        if (id.endsWith("/RGBW")) {
            if (sliderClass == RGBWWhite) {
                _this.client.set(id, `:::${sender.value}:`);
                return;
            }
            if (sliderClass == RGBWDim) {
                _this.client.set(id, `::::${sender.value}`);
                return;
            }
            return;
        }
        if (id.endsWith("/TW")) {
            if (sliderClass == TWTC) {
                _this.client.set(id, `${sender.value}:`);
                return;
            }
            if (sliderClass == TWDim) {
                _this.client.set(id, `:${sender.value}`);
                return;
            }
        }
        if (sliderClass == Dim) {
            _this.client.set(id, `${sender.value}`);
            return;
        }
    }

    handleRGBWColourChange(evt) {
        let _this = app;
        if (!_this.isConnected()) {
            console.log("Not connected");
            return;
        }

        let sender = evt.srcElement;
        if (this.enableLogging) console.log("handleRGBWColourChange:", evt, sender, sender.value);
        let id = sender.getAttribute("s4i-id");
        let value = sender.value;
        let rgb = value.htmlColourToRGB();

        if (_this.client) {
            _this.client.setRGBWP(id, `${rgb.R}`, `${rgb.G}`, `${rgb.B}`);
        }
    }


    objectHtml(item) {
        let control = "N/A";
        switch (item.ui) {
            case UIRGBW:
                control = this.rgbwHtml(item);
                break;
            case UITunableWhite:
                control = this.twHtml(item);
                break;
            case UISwitch:
                control = this.swHtml(item);
                break;
            case UISlider:
                control = this.sliderHtml(item, "Dim", "dim");
                break;
            default:
                //control = this.labelHtml(item);
                break;
        }


        let res =
            `<tr>
                <td>${item.index}</td>
                <td>${item.id}</td>
                <td>${item.label}</td>
                <td>${this.labelHtml(item)}</td>
                <td>${control}</td>
            </tr>`
            //console.log("Res:", res);

        return res
    }

    clearObjects() {
        this.objects = [];
        this.tbObjects.innerHTML = "";
    }

    loadObjects(objects) {
        let html = `
        <thead>
            <tr>
                <th>Index</th>
                <th>ID</th>
                <th>Label</th>
                <th>Value</th>
                <th>Control</th>
            </tr>
        <thead>
        <tbody>`

        for (let i = 0; i < objects.length; i++) {
            let o = objects[i];
            let objhtml = this.objectHtml(o);
            //console.log("objhtml:", objhtml);
            html = html + objhtml;
        }
        html += "</tbody>";

        this.tbObjects.innerHTML = html;

        for (let obj of objects) {
            this.updateValue(obj.id, obj.value);
        }

        //Sliders
        let elements = document.querySelectorAll(`[s4i-ui=${UISlider}]`);
        for (let el of elements) {
            if (el.nodeName == "INPUT") {
                this.on(el, "change", this.handleSliderChange);
            }
        }
        //Switches
        elements = document.querySelectorAll(`[s4i-ui=${UISwitch}]`);
        for (let el of elements) {
            if (el.nodeName == "INPUT") {
                this.on(el, "click", this.handleSwitchClick);
            }
        }
        //Colour
        elements = document.querySelectorAll(`[s4i-ui=${UIRGBW}]`);
        for (let el of elements) {
            if (el.nodeName == "INPUT") {
                this.on(el, "change", this.handleRGBWColourChange);
            }
        }
    }


    setPage(pg) {
        console.log("setPage:", pg);
        let _this = this;
        if (pg >= _this.pagination.numOfPages - 1) {
            pg = _this.pagination.numOfPages - 1;
        }
        if (pg < 0) {
            pg = 0;
        }
        _this.pagination.curPage = pg;
        _this.query();
    }

    on(id, event, action) {
        let el = id;
        if (typeof(id) == "string") {
            el = document.getElementById(id);
            if (!el) {
                return;
            }
        }
        el.addEventListener(event, action);
    }

    init() {
        let _this = this;

        document.getElementById("url").value = "ws://" + window.location.hostname + ":15001";

        _this.on("btn-start", "click", () => {
            _this.connect();
        });

        _this.on("btn-prev", "click", (evt) => {
            evt.preventDefault();
            _this.setPage(_this.pagination.curPage - 1)
        });

        _this.on("btn-next", "click", (evt) => {
            evt.preventDefault();
            _this.setPage(_this.pagination.curPage + 1)
        });

        _this.on("btn-stop", "click", () => {
            _this.disconnect();
        });

        _this.on("btn-query", "click", () => {
            _this.query();
        });

        _this.on("btn-all-on", "click", () => {
            _this.allOn();
        });

        _this.on("btn-all-off", "click", () => {
            _this.allOff();
        });

    }

    start() {
        this.client.start();
    }

    demo() {
        let objects = [{
                id: "1/xapi/1/RGBW",
                index: 0,
                label: "Demo/RGBW",
                value: "0:65534:0:0:0",
                ui: "RGBW"
            },
            {
                id: "1/xapi/2/TW",
                index: 1,
                label: "Demo/TW",
                value: "0:32768",
                ui: "TW"
            },
            {
                id: "1/xapi/3",
                index: 2,
                label: "Demo/Beamer",
                percentage: 100,
                value: "65534",
                ui: "Slider"
            },
            {
                id: "1/xapi/4",
                index: 3,
                label: "Demo/Sphere",
                percentage: 100,
                value: "65534",
                ui: "Slider"
            }
        ]
        this.loadObjects(objects)
    }
}

window.app = new App();
window.app.init();
//window.app.demo();