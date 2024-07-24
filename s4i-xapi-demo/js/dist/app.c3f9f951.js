// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../../../../../../../../opt/homebrew/lib/node_modules/parcel-bundler/node_modules/events/events.js":[function(require,module,exports) {
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

var R = typeof Reflect === 'object' ? Reflect : null;
var ReflectApply = R && typeof R.apply === 'function' ? R.apply : function ReflectApply(target, receiver, args) {
  return Function.prototype.apply.call(target, receiver, args);
};
var ReflectOwnKeys;
if (R && typeof R.ownKeys === 'function') {
  ReflectOwnKeys = R.ownKeys;
} else if (Object.getOwnPropertySymbols) {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target));
  };
} else {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target);
  };
}
function ProcessEmitWarning(warning) {
  if (console && console.warn) console.warn(warning);
}
var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
  return value !== value;
};
function EventEmitter() {
  EventEmitter.init.call(this);
}
module.exports = EventEmitter;
module.exports.once = once;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;
EventEmitter.prototype._events = undefined;
EventEmitter.prototype._eventsCount = 0;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
var defaultMaxListeners = 10;
function checkListener(listener) {
  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }
}
Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
  enumerable: true,
  get: function () {
    return defaultMaxListeners;
  },
  set: function (arg) {
    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
    }
    defaultMaxListeners = arg;
  }
});
EventEmitter.init = function () {
  if (this._events === undefined || this._events === Object.getPrototypeOf(this)._events) {
    this._events = Object.create(null);
    this._eventsCount = 0;
  }
  this._maxListeners = this._maxListeners || undefined;
};

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
  }
  this._maxListeners = n;
  return this;
};
function _getMaxListeners(that) {
  if (that._maxListeners === undefined) return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}
EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return _getMaxListeners(this);
};
EventEmitter.prototype.emit = function emit(type) {
  var args = [];
  for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
  var doError = type === 'error';
  var events = this._events;
  if (events !== undefined) doError = doError && events.error === undefined;else if (!doError) return false;

  // If there is no 'error' event listener then throw.
  if (doError) {
    var er;
    if (args.length > 0) er = args[0];
    if (er instanceof Error) {
      // Note: The comments on the `throw` lines are intentional, they show
      // up in Node's output if this results in an unhandled exception.
      throw er; // Unhandled 'error' event
    }
    // At least give some kind of context to the user
    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
    err.context = er;
    throw err; // Unhandled 'error' event
  }
  var handler = events[type];
  if (handler === undefined) return false;
  if (typeof handler === 'function') {
    ReflectApply(handler, this, args);
  } else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i) ReflectApply(listeners[i], this, args);
  }
  return true;
};
function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;
  checkListener(listener);
  events = target._events;
  if (events === undefined) {
    events = target._events = Object.create(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener !== undefined) {
      target.emit('newListener', type, listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }
  if (existing === undefined) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] = prepend ? [listener, existing] : [existing, listener];
      // If we've already got an array, just append.
    } else if (prepend) {
      existing.unshift(listener);
    } else {
      existing.push(listener);
    }

    // Check for listener leak
    m = _getMaxListeners(target);
    if (m > 0 && existing.length > m && !existing.warned) {
      existing.warned = true;
      // No error code for this since it is a Warning
      // eslint-disable-next-line no-restricted-syntax
      var w = new Error('Possible EventEmitter memory leak detected. ' + existing.length + ' ' + String(type) + ' listeners ' + 'added. Use emitter.setMaxListeners() to ' + 'increase limit');
      w.name = 'MaxListenersExceededWarning';
      w.emitter = target;
      w.type = type;
      w.count = existing.length;
      ProcessEmitWarning(w);
    }
  }
  return target;
}
EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};
EventEmitter.prototype.on = EventEmitter.prototype.addListener;
EventEmitter.prototype.prependListener = function prependListener(type, listener) {
  return _addListener(this, type, listener, true);
};
function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    if (arguments.length === 0) return this.listener.call(this.target);
    return this.listener.apply(this.target, arguments);
  }
}
function _onceWrap(target, type, listener) {
  var state = {
    fired: false,
    wrapFn: undefined,
    target: target,
    type: type,
    listener: listener
  };
  var wrapped = onceWrapper.bind(state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}
EventEmitter.prototype.once = function once(type, listener) {
  checkListener(listener);
  this.on(type, _onceWrap(this, type, listener));
  return this;
};
EventEmitter.prototype.prependOnceListener = function prependOnceListener(type, listener) {
  checkListener(listener);
  this.prependListener(type, _onceWrap(this, type, listener));
  return this;
};

// Emits a 'removeListener' event if and only if the listener was removed.
EventEmitter.prototype.removeListener = function removeListener(type, listener) {
  var list, events, position, i, originalListener;
  checkListener(listener);
  events = this._events;
  if (events === undefined) return this;
  list = events[type];
  if (list === undefined) return this;
  if (list === listener || list.listener === listener) {
    if (--this._eventsCount === 0) this._events = Object.create(null);else {
      delete events[type];
      if (events.removeListener) this.emit('removeListener', type, list.listener || listener);
    }
  } else if (typeof list !== 'function') {
    position = -1;
    for (i = list.length - 1; i >= 0; i--) {
      if (list[i] === listener || list[i].listener === listener) {
        originalListener = list[i].listener;
        position = i;
        break;
      }
    }
    if (position < 0) return this;
    if (position === 0) list.shift();else {
      spliceOne(list, position);
    }
    if (list.length === 1) events[type] = list[0];
    if (events.removeListener !== undefined) this.emit('removeListener', type, originalListener || listener);
  }
  return this;
};
EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
EventEmitter.prototype.removeAllListeners = function removeAllListeners(type) {
  var listeners, events, i;
  events = this._events;
  if (events === undefined) return this;

  // not listening for removeListener, no need to emit
  if (events.removeListener === undefined) {
    if (arguments.length === 0) {
      this._events = Object.create(null);
      this._eventsCount = 0;
    } else if (events[type] !== undefined) {
      if (--this._eventsCount === 0) this._events = Object.create(null);else delete events[type];
    }
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    var keys = Object.keys(events);
    var key;
    for (i = 0; i < keys.length; ++i) {
      key = keys[i];
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = Object.create(null);
    this._eventsCount = 0;
    return this;
  }
  listeners = events[type];
  if (typeof listeners === 'function') {
    this.removeListener(type, listeners);
  } else if (listeners !== undefined) {
    // LIFO order
    for (i = listeners.length - 1; i >= 0; i--) {
      this.removeListener(type, listeners[i]);
    }
  }
  return this;
};
function _listeners(target, type, unwrap) {
  var events = target._events;
  if (events === undefined) return [];
  var evlistener = events[type];
  if (evlistener === undefined) return [];
  if (typeof evlistener === 'function') return unwrap ? [evlistener.listener || evlistener] : [evlistener];
  return unwrap ? unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}
EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};
EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};
EventEmitter.listenerCount = function (emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};
EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;
  if (events !== undefined) {
    var evlistener = events[type];
    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener !== undefined) {
      return evlistener.length;
    }
  }
  return 0;
}
EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
};
function arrayClone(arr, n) {
  var copy = new Array(n);
  for (var i = 0; i < n; ++i) copy[i] = arr[i];
  return copy;
}
function spliceOne(list, index) {
  for (; index + 1 < list.length; index++) list[index] = list[index + 1];
  list.pop();
}
function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}
function once(emitter, name) {
  return new Promise(function (resolve, reject) {
    function errorListener(err) {
      emitter.removeListener(name, resolver);
      reject(err);
    }
    function resolver() {
      if (typeof emitter.removeListener === 'function') {
        emitter.removeListener('error', errorListener);
      }
      resolve([].slice.call(arguments));
    }
    ;
    eventTargetAgnosticAddListener(emitter, name, resolver, {
      once: true
    });
    if (name !== 'error') {
      addErrorHandlerIfEventEmitter(emitter, errorListener, {
        once: true
      });
    }
  });
}
function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
  if (typeof emitter.on === 'function') {
    eventTargetAgnosticAddListener(emitter, 'error', handler, flags);
  }
}
function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
  if (typeof emitter.on === 'function') {
    if (flags.once) {
      emitter.once(name, listener);
    } else {
      emitter.on(name, listener);
    }
  } else if (typeof emitter.addEventListener === 'function') {
    // EventTarget does not have `error` event semantics like Node
    // EventEmitters, we do not listen for `error` events here.
    emitter.addEventListener(name, function wrapListener(arg) {
      // IE does not have builtin `{ once: true }` support so we
      // have to do it manually.
      if (flags.once) {
        emitter.removeEventListener(name, wrapListener);
      }
      listener(arg);
    });
  } else {
    throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
  }
}
},{}],"../xapi/codec.js":[function(require,module,exports) {
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function (_e) { function e(_x) { return _e.apply(this, arguments); } e.toString = function () { return _e.toString(); }; return e; }(function (e) { throw e; }), f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function (_e2) { function e(_x2) { return _e2.apply(this, arguments); } e.toString = function () { return _e2.toString(); }; return e; }(function (e) { didErr = true; err = e; }), f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
/*
    Product: 
        S4i IB XAPI JS
    
    Module: 
        XAPI ASCII Codec

    Copyright (C) 2022 Solutions For Integerators Pty Ltd.
*/

var EventEmitter = require('events');
var VERSION = "1.00";
var ErrorMissingArgs = "ERR_MISSING_ARGS";
var ErrorException = "ERR_EXECPTION";
var ETX = "\r\n";
var OpKeepAlive = ".";
var OpQueryDetails = "#";
var OpQueryValue = "?";
var OpSetValue = "=";
var OpInc = "+";
var OpDec = "-";
var OpToggle = "!";
var OpPulse = "~";
var Codec = /*#__PURE__*/function (_EventEmitter) {
  function Codec(enLogging) {
    var _this2;
    _classCallCheck(this, Codec);
    _this2 = _callSuper(this, Codec);
    _this2.enableLogging = enLogging;
    return _this2;
  }
  _inherits(Codec, _EventEmitter);
  return _createClass(Codec, [{
    key: "command",
    value: function command(cmd) {
      return cmd + ETX;
    }
  }, {
    key: "cmdOp",
    value: function cmdOp(objID, op) {
      var args = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var cmd = "".concat(objID, ",").concat(op);
      if (args != null && args.length > 0) {
        var c = 0;
        for (var i = 0; i < args.length; i++) {
          if (args[i] != null) {
            cmd = "".concat(cmd, ",").concat(args[i]);
            c++;
          }
        }
      }
      return this.command(cmd);
    }
  }, {
    key: "cmdQueryValue",
    value: function cmdQueryValue(objID) {
      return this.cmdOp(objID, OpQueryValue);
    }
  }, {
    key: "cmdSetValue",
    value: function cmdSetValue(objID, value) {
      var durationMs = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      return this.cmdOp(objID, OpSetValue, [value, durationMs]);
    }
  }, {
    key: "cmdQueryDetails",
    value: function cmdQueryDetails() {
      var objID = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.Wildcard;
      var start = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var maxNumOfObjects = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 65535;
      if (!objID) {
        objID = this.Wildcard;
      }
      return this.cmdOp(objID, OpQueryDetails, [start, maxNumOfObjects]);
    }
  }, {
    key: "cmdRespondDetails",
    value: function cmdRespondDetails(objID, details) {
      return this.cmdOp(objID, OpQueryDetails, [details]);
    }
  }, {
    key: "cmdPulse",
    value: function cmdPulse(objID, durationMs) {
      return this.cmdOp(objID, OpPulse, [durationMs]);
    }
  }, {
    key: "cmdToggle",
    value: function cmdToggle(objID, durationMs) {
      return this.cmdOp(objID, OpToggle, [durationMs]);
    }
  }, {
    key: "cmdInc",
    value: function cmdInc(objID, delta) {
      return this.cmdOp(objID, OpInc, [delta]);
    }
  }, {
    key: "cmdDec",
    value: function cmdDec(objID, delta) {
      return this.cmdOp(objID, OpDec, [delta]);
    }
  }, {
    key: "parseMessage",
    value: function parseMessage(msg) {
      var _this = this;
      try {
        var values = msg.split(",");
        if (values.length < 2) {
          console.log("[Codec] Invalid length:", values);
          return;
        }
        var obj = values[0];
        var op = values[1];
        //Parse parameters
        switch (op) {
          case OpKeepAlive:
            {
              _this.emit('keepalive');
            }
            break;
          case OpQueryDetails:
            {
              var details = {};
              if (values.length >= 3) {
                for (var i = 2; i < values.length; i++) {
                  var kv = values[i];
                  var fields = kv.split("=");
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
  }, {
    key: "parseString",
    value: function parseString(rx) {
      //Read a byte
      var _this = this;
      var lines = rx.split(ETX);
      var _iterator = _createForOfIteratorHelper(lines),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var l = _step.value;
          if (l.length <= 0) continue;
          _this.parseMessage(l);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  }]);
}(EventEmitter);
function create(enableLogging) {
  return new Codec(enableLogging);
}
exports.create = create;
},{"events":"../../../../../../../../opt/homebrew/lib/node_modules/parcel-bundler/node_modules/events/events.js"}],"../node_modules/ws/browser.js":[function(require,module,exports) {
'use strict';

module.exports = function () {
  throw new Error('ws does not work in the browser. Browser clients must use the native ' + 'WebSocket object');
};
},{}],"../xapi/util.js":[function(require,module,exports) {
/*
S4i IB XAPI Utility module
Copyright (C) 2022 Solutions For Integerators Pty Ltd.
*/

function bin2string(array) {
  var result = "";
  for (var i = 0; i < array.length; ++i) {
    result += String.fromCharCode(array[i]);
  }
  return result;
}
exports.bin2string = bin2string;
},{}],"../xapi/transports/wsclient.js":[function(require,module,exports) {
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
/*
    Product: 
        S4i IB XAPI JS
    
    Module: 
        Websockets Client Transport (support both browser and nodejs)

    Copyright (C) 2022 Solutions For Integerators Pty Ltd.
*/

var WebSocketNodeJS = require('ws');
var EventEmitter = require('events');
var util = require('../util');
var WSClient = /*#__PURE__*/function (_EventEmitter) {
  function WSClient(options) {
    var _this2;
    _classCallCheck(this, WSClient);
    _this2 = _callSuper(this, WSClient);
    var _this = _this2;
    _this.url = options.url;
    _this.bin = options.bin;
    _this.enableLogging = options.enableLogging;
    _this.isBrowser = typeof window != 'undefined';
    _this.enabled = false;
    return _this2;
  }
  _inherits(WSClient, _EventEmitter);
  return _createClass(WSClient, [{
    key: "isClosed",
    value: function isClosed() {
      var _this = this;
      if (!_this.wsock) {
        return false;
      }
      if (_this.isBrowser) {
        return _this.wsock.readyState != WebSocket.OPEN;
      }
      return _this.wsock.readyState != WebSocketNodeJS.OPEN;
    }
  }, {
    key: "send",
    value: function send(msg) {
      var _this = this;
      console.log("[WS] send: ", msg);
      if (_this.isClosed()) {
        console.log("[WS] ERROR: Closed, cannot send.");
      }
      _this.wsock.send(msg, {
        binary: _this.isBin
      });
    }
  }, {
    key: "enable",
    value: function enable() {
      var _this = this;
      _this.enabled = true;
      if (_this.isBrowser) {
        _this.initForBrowser();
      } else {
        _this.initForNode();
      }
    }
  }, {
    key: "initForNode",
    value: function initForNode() {
      var _this = this;
      _this.wsock = new WebSocketNodeJS(_this.url);
      _this.wsock.on("open", function () {
        _this.emit("connect");
      });
      _this.wsock.on("close", function () {
        _this.emit("close");
      });
      _this.wsock.on("error", function (err) {
        if (_this.enableLogging) console.log("[WS-Node] Error", err);
        _this.emit("error", err);
      });
      _this.wsock.on("message", function (data, isbin) {
        if (_this.enableLogging) console.log("[WS] RX:", data);
        if (isbin) {
          _this.emit("data", util.bin2string(data));
          return;
        }
        _this.emit("data", data);
      });

      //_this.websocket.conn
    }
  }, {
    key: "initForBrowser",
    value: function initForBrowser() {
      var _this = this;
      if (_this.enableLogging) console.log("[WS-Browser] ", "Init websocket for browser:", _this.url);
      var sock = new WebSocket(_this.url);
      sock.onopen = function (e) {
        _this.emit("connect");
      };
      sock.onmessage = function (event) {
        _this.emit("message", event.data);
      };
      sock.onclose = function (event) {
        _this.emit("close");
      };
      sock.onerror = function (sender, evt) {
        _this.emit("error", evt);
      };
      _this.wsock = sock;
    }
  }, {
    key: "disable",
    value: function disable() {
      var _this = this;
      _this.enabled = false;
      _this.wsock.close();
    }
  }]);
}(EventEmitter);
function create(options) {
  return new WSClient(options);
}
exports.create = create;
},{"ws":"../node_modules/ws/browser.js","events":"../../../../../../../../opt/homebrew/lib/node_modules/parcel-bundler/node_modules/events/events.js","../util":"../xapi/util.js"}],"../../../../../../../../opt/homebrew/lib/node_modules/parcel-bundler/src/builtins/_empty.js":[function(require,module,exports) {

},{}],"../xapi/transports/tcpclient.js":[function(require,module,exports) {
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
/*
    Product: 
        S4i IB XAPI JS
    
    Module: 
        TCP Client Transport

    Copyright (C) 2022 Solutions For Integerators Pty Ltd.
*/

var EventEmitter = require('events');
var net = require('net');
var util = require('../util');
var TCPClient = /*#__PURE__*/function (_EventEmitter) {
  function TCPClient(options) {
    var _this2;
    _classCallCheck(this, TCPClient);
    _this2 = _callSuper(this, TCPClient);
    var _this = _this2;
    _this.host = options.hostname;
    _this.port = options.port;
    _this.enableLogging = options.enableLogging;
    return _this2;
  }
  _inherits(TCPClient, _EventEmitter);
  return _createClass(TCPClient, [{
    key: "isClosed",
    value: function isClosed() {
      var _this = this;
      return !_this.socket || _this.socket.closed;
    }
  }, {
    key: "send",
    value: function send(msg) {
      var _this = this;
      if (_this.isClosed()) {
        if (_this.enableLogging) {
          console.log("Closed, cannot send.");
        }
      }
      _this.socket.write(msg);
    }
  }, {
    key: "enable",
    value: function enable() {
      var _this = this;
      _this.socket = new net.Socket();
      _this.socket.on('data', function (data) {
        var str = util.bin2string(data);
        console.log(str);
        _this.emit('message', str);
      });
      _this.socket.on('close', function () {
        _this.emit('close');
        _this.socket.destroy();
      });
      _this.socket.on('connect', function () {
        _this.emit('connect');
      });
      _this.socket.on('error', function (err) {
        console.log("Error:", err);
      });
      console.log("Connecting to ", _this.host, _this.port);
      _this.socket.connect(_this.port, _this.host);
    }
  }, {
    key: "disable",
    value: function disable() {
      var _this = this;
      if (_this.socket) {
        _this.socket.destroy();
      }
    }
  }]);
}(EventEmitter);
function create(options) {
  return new TCPClient(options);
}
exports.create = create;
},{"events":"../../../../../../../../opt/homebrew/lib/node_modules/parcel-bundler/node_modules/events/events.js","net":"../../../../../../../../opt/homebrew/lib/node_modules/parcel-bundler/src/builtins/_empty.js","../util":"../xapi/util.js"}],"../xapi/client.js":[function(require,module,exports) {
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
/*
    Product: 
        S4i IB XAPI JS
    
    Module: 
        XAPI Client

    Copyright (C) 2022 Solutions For Integerators Pty Ltd.
*/

var EventEmitter = require('events');
var codec = require('./codec');
var wstransport = require('./transports/wsclient');
var tcptransport = require('./transports/tcpclient');
var Client = /*#__PURE__*/function (_EventEmitter) {
  function Client(options) {
    var _this2;
    _classCallCheck(this, Client);
    _this2 = _callSuper(this, Client);
    console.log("[Client] Client Options:", options);
    var _this = _this2;
    _this.options = options;
    _this.enableLogging = options.enableLogging;
    _this.autoReconnect = options.autoReconnect;
    _this.running = false;

    //Codec
    _this.codec = codec.create(options.enableLogging);
    _this.codec.on("error", function (err) {
      _this.emit("error", err);
    });
    _this.codec.on("keepalive", function () {
      _this.emit("keepalive");
    });
    _this.codec.on("details", function (obj, details) {
      _this.emit("details", obj, details);
    });
    _this.codec.on("value", function (obj, value) {
      _this.emit("value", obj, value);
    });

    //Transport
    _this.transport = _this.newTransportFromURL(options.url, options.enableLogging);
    _this.transport.on('message', function (data) {
      _this.codec.parseString(data);
    });
    _this.transport.on('close', function () {
      _this.transport.disable();
      if (_this.autoReconnect && _this.running) {
        setTimeout(function () {
          _this.transport.enable();
        }, 5000);
      }
      _this.emit('close');
    });
    _this.transport.on('connect', function () {
      if (_this.options.enableLogging) console.log("[Client] Connected");
      _this.emit('connect');
    });
    _this.transport.on('error', function (err) {
      console.log("[Client]:", err);
      _this.emit('error', err);
    });
    return _this2;
  }
  _inherits(Client, _EventEmitter);
  return _createClass(Client, [{
    key: "newTransportFromURL",
    value: function newTransportFromURL(url, enableLogging) {
      var u = new URL(url);
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
  }, {
    key: "isConnected",
    value: function isConnected() {
      var _this = this;
      return _this.running && _this.transport && !_this.transport.isClosed();
    }
  }, {
    key: "start",
    value: function start() {
      var _this = this;
      _this.running = true;
      _this.transport.enable();
    }
  }, {
    key: "stop",
    value: function stop() {
      var _this = this;
      _this.running = false;
      _this.transport.disable();
    }
  }, {
    key: "send",
    value: function send(msg) {
      var _this = this;
      if (_this.transport.isClosed()) {
        console.log("[Client] ERROR: Transport closed, cannot send.");
        return;
      }
      if (_this.options.enableLogging) console.log("[Client] C->S: ", msg);
      _this.transport.send(msg);
    }
  }, {
    key: "queryDetails",
    value: function queryDetails(objId, start, num) {
      this.send(this.codec.cmdQueryDetails(objId, start, num));
    }
  }, {
    key: "queryValue",
    value: function queryValue(objId) {
      this.send(this.codec.cmdQueryValue(objId));
    }
  }, {
    key: "set",
    value: function set(obj, p) {
      this.send(this.codec.cmdSetValue(obj, "".concat(p)));
    }
  }, {
    key: "inc",
    value: function inc(obj, delta) {
      this.send(this.codec.cmdInc(obj, "".concat(delta)));
    }
  }, {
    key: "dec",
    value: function dec(obj, delta) {
      this.send(this.codec.cmdDec(obj, "".concat(delta)));
    }
  }, {
    key: "toggle",
    value: function toggle(obj) {
      var durationMs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      this.send(this.codec.cmdToggle(obj, "".concat(durationMs)));
    }
  }, {
    key: "pulse",
    value: function pulse(obj) {
      var durationMs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      this.send(this.codec.cmdPulse(obj, "".concat(durationMs)));
    }
  }, {
    key: "setRGBWP",
    value: function setRGBWP(obj, r, g, b, w, p) {
      this.set(obj, "".concat(r ? r : "", ":").concat(g ? g : "", ":").concat(b ? b : "", ":").concat(w ? w : "", ":").concat(p ? p : ""));
    }
  }]);
}(EventEmitter);
function create(options) {
  return new Client(options);
}
exports.create = create;
},{"events":"../../../../../../../../opt/homebrew/lib/node_modules/parcel-bundler/node_modules/events/events.js","./codec":"../xapi/codec.js","./transports/wsclient":"../xapi/transports/wsclient.js","./transports/tcpclient":"../xapi/transports/tcpclient.js"}],"js/app.js":[function(require,module,exports) {
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var client = require('../../xapi/client');
var UIAuto = "Auto";
var UISwitch = "Switch";
var UISlider = "Slider";
var UIRGBW = "RGBW";
var UITunableWhite = "TW";
var UITrigger = "Trigger";
var UILabel = "Label";
var MaxVAL = 65534;
var VALNoChange = 65535;
var MaxByte = 255;
var RGBWDim = "rgbw-dim";
var RGBWWhite = "rgbw-white";
var TWDim = "tw-dim";
var Dim = "dim";
var TWTC = "tw-tc";
var delay = function delay(delayInms) {
  return new Promise(function (resolve) {
    return setTimeout(resolve, delayInms);
  });
};
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
  var v = parseInt(val);
  return Math.round(v * MaxByte / MaxVAL);
}
String.prototype.htmlColourToRGB = function () {
  var value = this.replace("#", "");
  var aRgbHex = value.match(/.{1,2}/g);
  var rgb = {
    R: byte2val(parseInt(aRgbHex[0], 16)),
    G: byte2val(parseInt(aRgbHex[1], 16)),
    B: byte2val(parseInt(aRgbHex[2], 16))
  };
  return rgb;
};
String.prototype.toRGBWP = function () {
  var values = this.split(":");
  var rgbw = {
    R: values[0],
    G: values[1],
    B: values[2],
    W: values[3],
    P: values[4]
  };
  rgbw.Colour = "#" + d2h(val2byte(rgbw.R)) + d2h(val2byte(rgbw.G)) + d2h(val2byte(rgbw.B));
  //console.log("toRGBWP:", rgbw);
  return rgbw;
};
String.prototype.toTW = function () {
  var values = this.split(":");
  var tw = {
    TC: values[0],
    P: values[1]
  };
  //console.log("toTW:", tw);
  return tw;
};
String.prototype.formatPercentage = function () {
  if (this == "") {
    return "...";
  }
  var v = Math.round(parseInt(this, 10));
  if (v == VALNoChange) {
    return "";
  }
  var res = Math.round(v * 100 / MaxVAL).toString() + "%";
  return res;
};
String.prototype.formatByte = function () {
  var v = Math.round(parseInt(this, 10));
  if (v == VALNoChange) {
    return "";
  }
  var res = Math.round(v * 255 / MaxVAL).toString();
  return res;
};
String.prototype.formatRGBW = function () {
  var values = this.split(":");
  if (values.length == 5) {
    var res = "R=" + values[0].formatByte() + ", G=" + values[1].formatByte() + ", B=" + values[2].formatByte() + ", W=" + values[3].formatByte() + ", Dim=" + values[4].formatPercentage();
    return res;
  }
  return str;
};
String.prototype.formatTW = function () {
  var values = this.split(":");
  if (values.length == 2) {
    var res = "CCT=" + values[0].formatPercentage() + ", Dim=" + values[1].formatPercentage();
    return res;
  }
  return this;
};
String.prototype.formatOnOff = function () {
  //console.log("formatOnOff:", this)
  return this == "0" || this == "" ? "Off" : "On";
};
var App = /*#__PURE__*/function () {
  function App(enableLogging) {
    _classCallCheck(this, App);
    this.client = null;
    this.tbObjects = document.getElementById("objects");
    this.numOfObjectsExpected = 0;
    this.objects = [];
    this.enableLogging = enableLogging;
    this.pagination = {
      numPerPage: 50,
      curPage: 0,
      numOfPages: 1
    };
    this.summary = null;
  }
  return _createClass(App, [{
    key: "getUrl",
    value: function getUrl() {
      return document.getElementById("url").value;
    }
  }, {
    key: "getNumPerPage",
    value: function getNumPerPage() {
      var num = document.getElementById("num-obj-per-page").value;
      if (num == "All") {
        num = 10000;
      }
      return num;
    }
  }, {
    key: "updatePagination",
    value: function updatePagination() {
      var _this = this;
      var numPerPage = _this.getNumPerPage();
      var numOfPages = Math.round(_this.summary.TOTAL / numPerPage);
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
      document.getElementById("page_summary").innerText = _this.pagination.curPage + 1 + "/" + this.pagination.numOfPages;
    }
  }, {
    key: "updateSummary",
    value: function updateSummary(summary) {
      var _this = this;
      console.log("Update Summary:", summary);
      _this.summary = summary;
      document.getElementById("summary").innerText = summary.NUM + " objects loaded.";
      _this.numOfObjectsExpected = parseInt(summary.NUM);
      _this.clearObjects();
      _this.updatePagination();
    }
  }, {
    key: "updateValue",
    value: function updateValue(obj, value) {
      var filter = '[s4i-id="' + obj + '"]';
      var elements = document.querySelectorAll(filter);
      var rgbwp = null;
      var tw = null;
      if (obj.endsWith("/RGBW")) {
        rgbwp = value.toRGBWP();
      }
      if (obj.endsWith("/TW")) {
        tw = value.toTW();
      }
      if (this.enableLogging) console.log("[App]updateValue:", obj, value, rgbwp, filter, elements, _typeof(value));
      var _iterator = _createForOfIteratorHelper(elements),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var el = _step.value;
          var ui = el.getAttribute("s4i-ui");
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
              case UITrigger:
                el.innerText = "No Value";
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
                var sliderClass = el.getAttribute("s4i-slider");
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
                var colour = value.toRGBWP().Colour;
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
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  }, {
    key: "getObjectUI",
    value: function getObjectUI(id, details) {
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
      if (id.endsWith("/TRIG")) {
        return UITrigger;
      }
      if (id.endsWith("/TW")) {
        return UITunableWhite;
      }
      if (id.endsWith("/STATUS")) {
        return UILabel;
      }
      return UISlider;
    }
  }, {
    key: "addObject",
    value: function addObject(id, details) {
      var _this = this;
      var index = parseInt(details.I);
      var obj = {
        id: id,
        index: index,
        label: details.LBL,
        percentage: details.P,
        value: details.V
      };
      obj.ui = _this.getObjectUI(id, details);
      this.objects.push(obj);
      if (index >= _this.numOfObjectsExpected - 1) {
        //console.log("loadObjects");
        _this.loadObjects(_this.objects);
      }
    }
  }, {
    key: "isConnected",
    value: function isConnected() {
      return this.client && this.client.isConnected();
    }
  }, {
    key: "setAllValue",
    value: function setAllValue(val) {
      var _this = this;
      var cnt = 0;
      var _iterator2 = _createForOfIteratorHelper(_this.objects),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var o = _step2.value;
          cnt++;
          if (cnt >= 50) {
            cnt = 0;
            console.log("Begin Delay....");
            console.log("End Delay....");
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
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }
  }, {
    key: "allOn",
    value: function allOn() {
      var _this = this;
      _this.setAllValue(MaxVAL);
    }
  }, {
    key: "allOff",
    value: function allOff() {
      var _this = this;
      _this.setAllValue(0);
    }
  }, {
    key: "connect",
    value: function connect() {
      var _this2 = this;
      var _this = this;
      if (_this.client) {
        if (this.enableLogging) console.log("[App]Stopping previous connection...");
        _this.client.stop();
      }
      var url = _this.getUrl();
      var clt = client.create({
        url: url,
        autoReconnect: true,
        enableLogging: true
      });
      if (this.enableLogging) console.log("[App]Connecting...");
      clt.on("keepalive", function () {
        if (_this2.enableLogging) console.log("[App]S->C keepalive");
      });
      clt.on("error", function (err, msg) {
        if (_this2.enableLogging) console.log("[App]Connection error:", err, msg);
        document.getElementById("status").innerText = err;
      });
      clt.on("details", function (obj, details) {
        if (_this2.enableLogging) console.log("[App]S->C details: " + obj + ",#," + JSON.stringify(details));
        //summary
        if (obj.includes("*")) {
          _this2.updateSummary(details);
        } else {
          _this2.addObject(obj, details);
        }
      });
      clt.on("value", function (obj, value) {
        if (_this2.enableLogging) console.log("[App]S->C value: " + obj + ",=," + value);
        _this2.updateValue(obj, value);
      });
      clt.on("connect", function () {
        if (_this2.enableLogging) console.log("[App]XAPI client connected");
        var el = document.getElementById("status");
        el.classList.add("connected");
        el.classList.remove("disconnected");
        el.innerText = "Connected";
      });
      clt.on("close", function () {
        if (_this2.enableLogging) console.log("[App]XAPI client closed");
        var el = document.getElementById("status");
        el.classList.remove("connected");
        el.classList.add("disconnected");
        el.innerText = "Disconnected";
      });
      _this.client = clt;
      _this.client.start();
    }
  }, {
    key: "disconnect",
    value: function disconnect() {
      if (this.enableLogging) console.log("[App]Disconnect");
      if (this.client) {
        this.client.stop();
      }
    }
  }, {
    key: "query",
    value: function query() {
      var _this = this;
      if (!_this.isConnected()) {
        alert("Not connected");
        return;
      }
      _this.clearObjects();
      var n = _this.getNumPerPage();
      if (_this.pagination.numPerPage != n) {
        _this.pagination.curPage = 0;
      }
      _this.pagination.numPerPage = n;
      if (_this.pagination.curPage >= _this.pagination.numOfPages) {
        _this.pagination.curPage = 0;
      }
      _this.client.queryDetails(document.getElementById("query").value, _this.pagination.curPage * _this.pagination.numPerPage, _this.pagination.numPerPage);
    }
  }, {
    key: "rgbwToColour",
    value: function rgbwToColour(itemValue) {
      return "#00FF00";
    }
  }, {
    key: "sliderHtml",
    value: function sliderHtml(item, label) {
      var sliderClass = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "dim";
      var cls = "";
      if (sliderClass) {
        cls = "s4i-slider=\"".concat(sliderClass, "\"");
      }
      return "<label align=\"center\">".concat(label, "</label>\n                <input type=\"range\"                \n                 s4i-id=\"").concat(item.id, "\" \n                 ").concat(cls, "\n                 s4i-ui=\"").concat(UISlider, "\"\n                 min=\"0\" max=\"").concat(MaxVAL, "\"/>");
    }
  }, {
    key: "colourHtml",
    value: function colourHtml(item, label) {
      var colour = this.rgbwToColour(item.value);
      return "<label align=\"center\">".concat(label, "</label>\n                <input class=\"rgbw\" type=\"color\" \n                s4i-id=\"").concat(item.id, "\" \n                value=\"").concat(colour, "\" \n                s4i-ui=\"").concat(UIRGBW, "\"/>");
    }
  }, {
    key: "rgbwHtml",
    value: function rgbwHtml(item) {
      return "<div>\n            ".concat(this.sliderHtml(item, "Dim", RGBWDim), "                        \n            ").concat(this.sliderHtml(item, "White", RGBWWhite), "                        \n            ").concat(this.colourHtml(item, "Colour"), "\n                 </div>");
    }
  }, {
    key: "tcHtml",
    value: function tcHtml(item) {
      var tc = item.value;
      return "<input type=\"range\"\n                 s4i-id=\"".concat(item.id, "\" \n                 value=\"").concat(item.value, "\" \n                 s4i-ui=\"").concat(item.ui, " \n                 min=\"0\" max=\"").concat(MaxVAL, "\"/>");
    }
  }, {
    key: "twHtml",
    value: function twHtml(item) {
      return "<div>\n        ".concat(this.sliderHtml(item, "Dim", TWDim), "                        \n        ").concat(this.sliderHtml(item, "Colour Temp", TWTC), "\n        </div>");
    }
  }, {
    key: "swHtml",
    value: function swHtml(item) {
      var p = parseInt(item.percentage);
      var on = p > 0;
      var checked = on ? "checked" : "";
      //console.log("swHtml: ", item, p, on, checked)
      return "<input type=\"checkbox\" \n            role=\"switch\" \n            s4i-id=\"".concat(item.id, "\" \n            s4i-ui=\"").concat(item.ui, "\"/>");
    }
  }, {
    key: "trigHtml",
    value: function trigHtml(item) {
      //console.log("swHtml: ", item, p, on, checked)
      return "<input type=\"button\" \n            role=\"button\" \n            s4i-id=\"".concat(item.id, "\" \n            s4i-ui=\"").concat(item.ui, "\"\n            value=\"Activate\"/>");
    }
  }, {
    key: "labelHtml",
    value: function labelHtml(item) {
      return "<label \n            s4i-id=\"".concat(item.id, "\"\n            s4i-ui=\"").concat(item.ui, "\">").concat(item.value, "</label>");
    }
  }, {
    key: "handleSwitchClick",
    value: function handleSwitchClick(evt) {
      var _this = app;
      if (!_this.isConnected()) {
        console.log("Not connected");
        return;
      }
      var sender = evt.srcElement;
      if (this.enableLogging) console.log("handleSwitchClick:", evt);
      //sender.checked = !sender.checked;
      console.log("handleSwitchClick:", sender, sender.checked);
      var id = sender.getAttribute("s4i-id");
      switch (sender.getAttribute("s4i-ui")) {
        case UISwitch:
          _this.client.toggle(id);
          break;
        default:
          break;
      }
    }
  }, {
    key: "handleTriggerClick",
    value: function handleTriggerClick(evt) {
      var _this = app;
      if (!_this.isConnected()) {
        console.log("Not connected");
        return;
      }
      var sender = evt.srcElement;
      if (this.enableLogging) console.log("handleTriggerClick:", evt);
      //sender.checked = !sender.checked;
      console.log("handleTriggerClick:", sender, sender.checked);
      var id = sender.getAttribute("s4i-id");
      switch (sender.getAttribute("s4i-ui")) {
        case UITrigger:
          _this.client.pulse(id);
          break;
        default:
          break;
      }
    }
  }, {
    key: "handleSliderChange",
    value: function handleSliderChange(evt) {
      var _this = app;
      if (!_this.isConnected()) {
        console.log("Not connected");
        return;
      }
      var sender = evt.srcElement;
      if (this.enableLogging) console.log("handleSliderChange:", sender);
      var id = sender.getAttribute("s4i-id");
      var sliderClass = sender.getAttribute("s4i-slider");
      if (id.endsWith("/RGBW")) {
        if (sliderClass == RGBWWhite) {
          _this.client.set(id, ":::".concat(sender.value, ":"));
          return;
        }
        if (sliderClass == RGBWDim) {
          _this.client.set(id, "::::".concat(sender.value));
          return;
        }
        return;
      }
      if (id.endsWith("/TW")) {
        if (sliderClass == TWTC) {
          _this.client.set(id, "".concat(sender.value, ":"));
          return;
        }
        if (sliderClass == TWDim) {
          _this.client.set(id, ":".concat(sender.value));
          return;
        }
      }
      if (sliderClass == Dim) {
        _this.client.set(id, "".concat(sender.value));
        return;
      }
    }
  }, {
    key: "handleRGBWColourChange",
    value: function handleRGBWColourChange(evt) {
      var _this = app;
      if (!_this.isConnected()) {
        console.log("Not connected");
        return;
      }
      var sender = evt.srcElement;
      if (this.enableLogging) console.log("handleRGBWColourChange:", evt, sender, sender.value);
      var id = sender.getAttribute("s4i-id");
      var value = sender.value;
      var rgb = value.htmlColourToRGB();
      if (_this.client) {
        _this.client.setRGBWP(id, "".concat(rgb.R), "".concat(rgb.G), "".concat(rgb.B));
      }
    }
  }, {
    key: "objectHtml",
    value: function objectHtml(item) {
      var control = "N/A";
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
        case UITrigger:
          control = this.trigHtml(item);
          break;
        case UISlider:
          control = this.sliderHtml(item, "Dim", "dim");
          break;
        default:
          //control = this.labelHtml(item);
          break;
      }
      var res = "<tr>\n                <td>".concat(item.index, "</td>\n                <td>").concat(item.id, "</td>\n                <td>").concat(item.label, "</td>\n                <td>").concat(this.labelHtml(item), "</td>\n                <td>").concat(control, "</td>\n            </tr>");
      //console.log("Res:", res);

      return res;
    }
  }, {
    key: "clearObjects",
    value: function clearObjects() {
      this.objects = [];
      this.tbObjects.innerHTML = "";
    }
  }, {
    key: "loadObjects",
    value: function loadObjects(objects) {
      var html = "\n        <thead>\n            <tr>\n                <th>Index</th>\n                <th>ID</th>\n                <th>Label</th>\n                <th>Value</th>\n                <th>Control</th>\n            </tr>\n        <thead>\n        <tbody>";
      for (var i = 0; i < objects.length; i++) {
        var o = objects[i];
        var objhtml = this.objectHtml(o);
        //console.log("objhtml:", objhtml);
        html = html + objhtml;
      }
      html += "</tbody>";
      this.tbObjects.innerHTML = html;
      var _iterator3 = _createForOfIteratorHelper(objects),
        _step3;
      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var obj = _step3.value;
          this.updateValue(obj.id, obj.value);
        }

        //Sliders
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
      var elements = document.querySelectorAll("[s4i-ui=".concat(UISlider, "]"));
      var _iterator4 = _createForOfIteratorHelper(elements),
        _step4;
      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var el = _step4.value;
          if (el.nodeName == "INPUT") {
            this.on(el, "change", this.handleSliderChange);
          }
        }
        //Switches
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }
      elements = document.querySelectorAll("[s4i-ui=".concat(UISwitch, "]"));
      var _iterator5 = _createForOfIteratorHelper(elements),
        _step5;
      try {
        for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
          var _el = _step5.value;
          if (_el.nodeName == "INPUT") {
            this.on(_el, "click", this.handleSwitchClick);
          }
        }
        //Triggers
      } catch (err) {
        _iterator5.e(err);
      } finally {
        _iterator5.f();
      }
      elements = document.querySelectorAll("[s4i-ui=".concat(UITrigger, "]"));
      var _iterator6 = _createForOfIteratorHelper(elements),
        _step6;
      try {
        for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
          var _el2 = _step6.value;
          if (_el2.nodeName == "INPUT") {
            this.on(_el2, "click", this.handleTriggerClick);
          }
        }
        //Colour
      } catch (err) {
        _iterator6.e(err);
      } finally {
        _iterator6.f();
      }
      elements = document.querySelectorAll("[s4i-ui=".concat(UIRGBW, "]"));
      var _iterator7 = _createForOfIteratorHelper(elements),
        _step7;
      try {
        for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
          var _el3 = _step7.value;
          if (_el3.nodeName == "INPUT") {
            this.on(_el3, "change", this.handleRGBWColourChange);
          }
        }
      } catch (err) {
        _iterator7.e(err);
      } finally {
        _iterator7.f();
      }
    }
  }, {
    key: "setPage",
    value: function setPage(pg) {
      console.log("setPage:", pg);
      var _this = this;
      if (pg >= _this.pagination.numOfPages - 1) {
        pg = _this.pagination.numOfPages - 1;
      }
      if (pg < 0) {
        pg = 0;
      }
      _this.pagination.curPage = pg;
      _this.query();
    }
  }, {
    key: "on",
    value: function on(id, event, action) {
      var el = id;
      if (typeof id == "string") {
        el = document.getElementById(id);
        if (!el) {
          return;
        }
      }
      el.addEventListener(event, action);
    }
  }, {
    key: "init",
    value: function init() {
      var _this = this;
      document.getElementById("url").value = "ws://" + window.location.hostname + ":15001";
      _this.on("btn-start", "click", function () {
        _this.connect();
      });
      _this.on("btn-prev", "click", function (evt) {
        evt.preventDefault();
        _this.setPage(_this.pagination.curPage - 1);
      });
      _this.on("btn-next", "click", function (evt) {
        evt.preventDefault();
        _this.setPage(_this.pagination.curPage + 1);
      });
      _this.on("btn-stop", "click", function () {
        _this.disconnect();
      });
      _this.on("btn-query", "click", function () {
        _this.query();
      });
      _this.on("btn-all-on", "click", function () {
        _this.allOn();
      });
      _this.on("btn-all-off", "click", function () {
        _this.allOff();
      });
    }
  }, {
    key: "start",
    value: function start() {
      this.client.start();
    }
  }, {
    key: "demo",
    value: function demo() {
      var objects = [{
        id: "1/xapi/1/RGBW",
        index: 0,
        label: "Demo/RGBW",
        value: "0:65534:0:0:0",
        ui: "RGBW"
      }, {
        id: "1/xapi/2/TW",
        index: 1,
        label: "Demo/TW",
        value: "0:32768",
        ui: "TW"
      }, {
        id: "1/xapi/3",
        index: 2,
        label: "Demo/Beamer",
        percentage: 100,
        value: "65534",
        ui: "Slider"
      }, {
        id: "1/xapi/4",
        index: 3,
        label: "Demo/Sphere",
        percentage: 100,
        value: "65534",
        ui: "Slider"
      }];
      this.loadObjects(objects);
    }
  }]);
}();
window.app = new App();
window.app.init();
//window.app.demo();
},{"../../xapi/client":"../xapi/client.js"}],"../../../../../../../../opt/homebrew/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;
function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}
module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "51922" + '/');
  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);
    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);
          if (didAccept) {
            handled = true;
          }
        }
      });

      // Enable HMR for CSS by default.
      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });
      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }
    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }
    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }
    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}
function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}
function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}
function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }
  var parents = [];
  var k, d, dep;
  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }
  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }
  return parents;
}
function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}
function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }
  if (checkedAssets[id]) {
    return;
  }
  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }
  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}
function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }
  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }
  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }
}
},{}]},{},["../../../../../../../../opt/homebrew/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/app.js"], null)
//# sourceMappingURL=/app.c3f9f951.js.map