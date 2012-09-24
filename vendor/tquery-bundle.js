// tquery.js - https://github.com/jeromeetienne/tquery - MIT License
// vim: ts=4 sts=4 sw=4 expandtab
// -- kriskowal Kris Kowal Copyright (C) 2009-2011 MIT License
// -- tlrobinson Tom Robinson Copyright (C) 2009-2010 MIT License (Narwhal Project)
// -- dantman Daniel Friesen Copyright (C) 2010 XXX TODO License or CLA
// -- fschaefer Florian Schäfer Copyright (C) 2010 MIT License
// -- Gozala Irakli Gozalishvili Copyright (C) 2010 MIT License
// -- kitcambridge Kit Cambridge Copyright (C) 2011 MIT License
// -- kossnocorp Sasha Koss XXX TODO License or CLA
// -- bryanforbes Bryan Forbes XXX TODO License or CLA
// -- killdream Quildreen Motta Copyright (C) 2011 MIT Licence
// -- michaelficarra Michael Ficarra Copyright (C) 2011 3-clause BSD License
// -- sharkbrainguy Gerard Paapu Copyright (C) 2011 MIT License
// -- bbqsrc Brendan Molloy (C) 2011 Creative Commons Zero (public domain)
// -- iwyg XXX TODO License or CLA
// -- DomenicDenicola Domenic Denicola Copyright (C) 2011 MIT License
// -- xavierm02 Montillet Xavier Copyright (C) 2011 MIT License
// -- Raynos Jake Verbaten Copyright (C) 2011 MIT Licence
// -- samsonjs Sami Samhuri Copyright (C) 2010 MIT License
// -- rwldrn Rick Waldron Copyright (C) 2011 MIT License
// -- lexer Alexey Zakharov XXX TODO License or CLA

/*!
    Copyright (c) 2009, 280 North Inc. http://280north.com/
    MIT License. http://github.com/280north/narwhal/blob/master/README.md
*/

// Module systems magic dance
(function (definition) {
    // RequireJS
    if (typeof define == "function") {
        define(definition);
    // CommonJS and <script>
    } else {
        definition();
    }
})(function () {

/**
 * Brings an environment as close to ECMAScript 5 compliance
 * as is possible with the facilities of erstwhile engines.
 *
 * Annotated ES5: http://es5.github.com/ (specific links below)
 * ES5 Spec: http://www.ecma-international.org/publications/files/ECMA-ST/Ecma-262.pdf
 * Required reading: http://javascriptweblog.wordpress.com/2011/12/05/extending-javascript-natives/
 */

//
// Function
// ========
//

// ES-5 15.3.4.5
// http://es5.github.com/#x15.3.4.5

if (!Function.prototype.bind) {
    Function.prototype.bind = function bind(that) { // .length is 1
        // 1. Let Target be the this value.
        var target = this;
        // 2. If IsCallable(Target) is false, throw a TypeError exception.
        if (typeof target != "function") {
            throw new TypeError("Function.prototype.bind called on incompatible " + target);
        }
        // 3. Let A be a new (possibly empty) internal list of all of the
        //   argument values provided after thisArg (arg1, arg2 etc), in order.
        // XXX slicedArgs will stand in for "A" if used
        var args = slice.call(arguments, 1); // for normal call
        // 4. Let F be a new native ECMAScript object.
        // 11. Set the [[Prototype]] internal property of F to the standard
        //   built-in Function prototype object as specified in 15.3.3.1.
        // 12. Set the [[Call]] internal property of F as described in
        //   15.3.4.5.1.
        // 13. Set the [[Construct]] internal property of F as described in
        //   15.3.4.5.2.
        // 14. Set the [[HasInstance]] internal property of F as described in
        //   15.3.4.5.3.
        var bound = function () {

            if (this instanceof bound) {
                // 15.3.4.5.2 [[Construct]]
                // When the [[Construct]] internal method of a function object,
                // F that was created using the bind function is called with a
                // list of arguments ExtraArgs, the following steps are taken:
                // 1. Let target be the value of F's [[TargetFunction]]
                //   internal property.
                // 2. If target has no [[Construct]] internal method, a
                //   TypeError exception is thrown.
                // 3. Let boundArgs be the value of F's [[BoundArgs]] internal
                //   property.
                // 4. Let args be a new list containing the same values as the
                //   list boundArgs in the same order followed by the same
                //   values as the list ExtraArgs in the same order.
                // 5. Return the result of calling the [[Construct]] internal
                //   method of target providing args as the arguments.

                var F = function(){};
                F.prototype = target.prototype;
                var self = new F;

                var result = target.apply(
                    self,
                    args.concat(slice.call(arguments))
                );
                if (Object(result) === result) {
                    return result;
                }
                return self;

            } else {
                // 15.3.4.5.1 [[Call]]
                // When the [[Call]] internal method of a function object, F,
                // which was created using the bind function is called with a
                // this value and a list of arguments ExtraArgs, the following
                // steps are taken:
                // 1. Let boundArgs be the value of F's [[BoundArgs]] internal
                //   property.
                // 2. Let boundThis be the value of F's [[BoundThis]] internal
                //   property.
                // 3. Let target be the value of F's [[TargetFunction]] internal
                //   property.
                // 4. Let args be a new list containing the same values as the
                //   list boundArgs in the same order followed by the same
                //   values as the list ExtraArgs in the same order.
                // 5. Return the result of calling the [[Call]] internal method
                //   of target providing boundThis as the this value and
                //   providing args as the arguments.

                // equiv: target.call(this, ...boundArgs, ...args)
                return target.apply(
                    that,
                    args.concat(slice.call(arguments))
                );

            }

        };
        // XXX bound.length is never writable, so don't even try
        //
        // 15. If the [[Class]] internal property of Target is "Function", then
        //     a. Let L be the length property of Target minus the length of A.
        //     b. Set the length own property of F to either 0 or L, whichever is
        //       larger.
        // 16. Else set the length own property of F to 0.
        // 17. Set the attributes of the length own property of F to the values
        //   specified in 15.3.5.1.

        // TODO
        // 18. Set the [[Extensible]] internal property of F to true.

        // TODO
        // 19. Let thrower be the [[ThrowTypeError]] function Object (13.2.3).
        // 20. Call the [[DefineOwnProperty]] internal method of F with
        //   arguments "caller", PropertyDescriptor {[[Get]]: thrower, [[Set]]:
        //   thrower, [[Enumerable]]: false, [[Configurable]]: false}, and
        //   false.
        // 21. Call the [[DefineOwnProperty]] internal method of F with
        //   arguments "arguments", PropertyDescriptor {[[Get]]: thrower,
        //   [[Set]]: thrower, [[Enumerable]]: false, [[Configurable]]: false},
        //   and false.

        // TODO
        // NOTE Function objects created using Function.prototype.bind do not
        // have a prototype property or the [[Code]], [[FormalParameters]], and
        // [[Scope]] internal properties.
        // XXX can't delete prototype in pure-js.

        // 22. Return F.
        return bound;
    };
}

// Shortcut to an often accessed properties, in order to avoid multiple
// dereference that costs universally.
// _Please note: Shortcuts are defined after `Function.prototype.bind` as we
// us it in defining shortcuts.
var call = Function.prototype.call;
var prototypeOfArray = Array.prototype;
var prototypeOfObject = Object.prototype;
var slice = prototypeOfArray.slice;
// Having a toString local variable name breaks in Opera so use _toString.
var _toString = call.bind(prototypeOfObject.toString);
var owns = call.bind(prototypeOfObject.hasOwnProperty);

// If JS engine supports accessors creating shortcuts.
var defineGetter;
var defineSetter;
var lookupGetter;
var lookupSetter;
var supportsAccessors;
if ((supportsAccessors = owns(prototypeOfObject, "__defineGetter__"))) {
    defineGetter = call.bind(prototypeOfObject.__defineGetter__);
    defineSetter = call.bind(prototypeOfObject.__defineSetter__);
    lookupGetter = call.bind(prototypeOfObject.__lookupGetter__);
    lookupSetter = call.bind(prototypeOfObject.__lookupSetter__);
}

//
// Array
// =====
//

// ES5 15.4.3.2
// http://es5.github.com/#x15.4.3.2
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/isArray
if (!Array.isArray) {
    Array.isArray = function isArray(obj) {
        return _toString(obj) == "[object Array]";
    };
}

// The IsCallable() check in the Array functions
// has been replaced with a strict check on the
// internal class of the object to trap cases where
// the provided function was actually a regular
// expression literal, which in V8 and
// JavaScriptCore is a typeof "function".  Only in
// V8 are regular expression literals permitted as
// reduce parameters, so it is desirable in the
// general case for the shim to match the more
// strict and common behavior of rejecting regular
// expressions.

// ES5 15.4.4.18
// http://es5.github.com/#x15.4.4.18
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/array/forEach
if (!Array.prototype.forEach) {
    Array.prototype.forEach = function forEach(fun /*, thisp*/) {
        var self = toObject(this),
            thisp = arguments[1],
            i = -1,
            length = self.length >>> 0;

        // If no callback function or if callback is not a callable function
        if (_toString(fun) != "[object Function]") {
            throw new TypeError(); // TODO message
        }

        while (++i < length) {
            if (i in self) {
                // Invoke the callback function with call, passing arguments:
                // context, property value, property key, thisArg object context
                fun.call(thisp, self[i], i, self);
            }
        }
    };
}

// ES5 15.4.4.19
// http://es5.github.com/#x15.4.4.19
// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/map
if (!Array.prototype.map) {
    Array.prototype.map = function map(fun /*, thisp*/) {
        var self = toObject(this),
            length = self.length >>> 0,
            result = Array(length),
            thisp = arguments[1];

        // If no callback function or if callback is not a callable function
        if (_toString(fun) != "[object Function]") {
            throw new TypeError(fun + " is not a function");
        }

        for (var i = 0; i < length; i++) {
            if (i in self)
                result[i] = fun.call(thisp, self[i], i, self);
        }
        return result;
    };
}

// ES5 15.4.4.20
// http://es5.github.com/#x15.4.4.20
// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/filter
if (!Array.prototype.filter) {
    Array.prototype.filter = function filter(fun /*, thisp */) {
        var self = toObject(this),
            length = self.length >>> 0,
            result = [],
            value,
            thisp = arguments[1];

        // If no callback function or if callback is not a callable function
        if (_toString(fun) != "[object Function]") {
            throw new TypeError(fun + " is not a function");
        }

        for (var i = 0; i < length; i++) {
            if (i in self) {
                value = self[i];
                if (fun.call(thisp, value, i, self)) {
                    result.push(value);
                }
            }
        }
        return result;
    };
}

// ES5 15.4.4.16
// http://es5.github.com/#x15.4.4.16
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/every
if (!Array.prototype.every) {
    Array.prototype.every = function every(fun /*, thisp */) {
        var self = toObject(this),
            length = self.length >>> 0,
            thisp = arguments[1];

        // If no callback function or if callback is not a callable function
        if (_toString(fun) != "[object Function]") {
            throw new TypeError(fun + " is not a function");
        }

        for (var i = 0; i < length; i++) {
            if (i in self && !fun.call(thisp, self[i], i, self)) {
                return false;
            }
        }
        return true;
    };
}

// ES5 15.4.4.17
// http://es5.github.com/#x15.4.4.17
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/some
if (!Array.prototype.some) {
    Array.prototype.some = function some(fun /*, thisp */) {
        var self = toObject(this),
            length = self.length >>> 0,
            thisp = arguments[1];

        // If no callback function or if callback is not a callable function
        if (_toString(fun) != "[object Function]") {
            throw new TypeError(fun + " is not a function");
        }

        for (var i = 0; i < length; i++) {
            if (i in self && fun.call(thisp, self[i], i, self)) {
                return true;
            }
        }
        return false;
    };
}

// ES5 15.4.4.21
// http://es5.github.com/#x15.4.4.21
// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/reduce
if (!Array.prototype.reduce) {
    Array.prototype.reduce = function reduce(fun /*, initial*/) {
        var self = toObject(this),
            length = self.length >>> 0;

        // If no callback function or if callback is not a callable function
        if (_toString(fun) != "[object Function]") {
            throw new TypeError(fun + " is not a function");
        }

        // no value to return if no initial value and an empty array
        if (!length && arguments.length == 1) {
            throw new TypeError('reduce of empty array with no initial value');
        }

        var i = 0;
        var result;
        if (arguments.length >= 2) {
            result = arguments[1];
        } else {
            do {
                if (i in self) {
                    result = self[i++];
                    break;
                }

                // if array contains no values, no initial value to return
                if (++i >= length) {
                    throw new TypeError('reduce of empty array with no initial value');
                }
            } while (true);
        }

        for (; i < length; i++) {
            if (i in self) {
                result = fun.call(void 0, result, self[i], i, self);
            }
        }

        return result;
    };
}

// ES5 15.4.4.22
// http://es5.github.com/#x15.4.4.22
// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/reduceRight
if (!Array.prototype.reduceRight) {
    Array.prototype.reduceRight = function reduceRight(fun /*, initial*/) {
        var self = toObject(this),
            length = self.length >>> 0;

        // If no callback function or if callback is not a callable function
        if (_toString(fun) != "[object Function]") {
            throw new TypeError(fun + " is not a function");
        }

        // no value to return if no initial value, empty array
        if (!length && arguments.length == 1) {
            throw new TypeError('reduceRight of empty array with no initial value');
        }

        var result, i = length - 1;
        if (arguments.length >= 2) {
            result = arguments[1];
        } else {
            do {
                if (i in self) {
                    result = self[i--];
                    break;
                }

                // if array contains no values, no initial value to return
                if (--i < 0) {
                    throw new TypeError('reduceRight of empty array with no initial value');
                }
            } while (true);
        }

        do {
            if (i in this) {
                result = fun.call(void 0, result, self[i], i, self);
            }
        } while (i--);

        return result;
    };
}

// ES5 15.4.4.14
// http://es5.github.com/#x15.4.4.14
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/indexOf
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function indexOf(sought /*, fromIndex */ ) {
        var self = toObject(this),
            length = self.length >>> 0;

        if (!length) {
            return -1;
        }

        var i = 0;
        if (arguments.length > 1) {
            i = toInteger(arguments[1]);
        }

        // handle negative indices
        i = i >= 0 ? i : Math.max(0, length + i);
        for (; i < length; i++) {
            if (i in self && self[i] === sought) {
                return i;
            }
        }
        return -1;
    };
}

// ES5 15.4.4.15
// http://es5.github.com/#x15.4.4.15
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/lastIndexOf
if (!Array.prototype.lastIndexOf) {
    Array.prototype.lastIndexOf = function lastIndexOf(sought /*, fromIndex */) {
        var self = toObject(this),
            length = self.length >>> 0;

        if (!length) {
            return -1;
        }
        var i = length - 1;
        if (arguments.length > 1) {
            i = Math.min(i, toInteger(arguments[1]));
        }
        // handle negative indices
        i = i >= 0 ? i : length - Math.abs(i);
        for (; i >= 0; i--) {
            if (i in self && sought === self[i]) {
                return i;
            }
        }
        return -1;
    };
}

//
// Object
// ======
//

// ES5 15.2.3.2
// http://es5.github.com/#x15.2.3.2
if (!Object.getPrototypeOf) {
    // https://github.com/kriskowal/es5-shim/issues#issue/2
    // http://ejohn.org/blog/objectgetprototypeof/
    // recommended by fschaefer on github
    Object.getPrototypeOf = function getPrototypeOf(object) {
        return object.__proto__ || (
            object.constructor
                ? object.constructor.prototype
                : prototypeOfObject
        );
    };
}

// ES5 15.2.3.3
// http://es5.github.com/#x15.2.3.3
if (!Object.getOwnPropertyDescriptor) {
    var ERR_NON_OBJECT = "Object.getOwnPropertyDescriptor called on a non-object: ";

    Object.getOwnPropertyDescriptor = function getOwnPropertyDescriptor(object, property) {
        if ((typeof object != "object" && typeof object != "function") || object === null) {
            throw new TypeError(ERR_NON_OBJECT + object);
        }
        // If object does not owns property return undefined immediately.
        if (!owns(object, property)) {
            return;
        }

        // If object has a property then it's for sure both `enumerable` and
        // `configurable`.
        var descriptor =  { enumerable: true, configurable: true };

        // If JS engine supports accessor properties then property may be a
        // getter or setter.
        if (supportsAccessors) {
            // Unfortunately `__lookupGetter__` will return a getter even
            // if object has own non getter property along with a same named
            // inherited getter. To avoid misbehavior we temporary remove
            // `__proto__` so that `__lookupGetter__` will return getter only
            // if it's owned by an object.
            var prototype = object.__proto__;
            object.__proto__ = prototypeOfObject;

            var getter = lookupGetter(object, property);
            var setter = lookupSetter(object, property);

            // Once we have getter and setter we can put values back.
            object.__proto__ = prototype;

            if (getter || setter) {
                if (getter) {
                    descriptor.get = getter;
                }
                if (setter) {
                    descriptor.set = setter;
                }
                // If it was accessor property we're done and return here
                // in order to avoid adding `value` to the descriptor.
                return descriptor;
            }
        }

        // If we got this far we know that object has an own property that is
        // not an accessor so we set it as a value and return descriptor.
        descriptor.value = object[property];
        return descriptor;
    };
}

// ES5 15.2.3.4
// http://es5.github.com/#x15.2.3.4
if (!Object.getOwnPropertyNames) {
    Object.getOwnPropertyNames = function getOwnPropertyNames(object) {
        return Object.keys(object);
    };
}

// ES5 15.2.3.5
// http://es5.github.com/#x15.2.3.5
if (!Object.create) {
    Object.create = function create(prototype, properties) {
        var object;
        if (prototype === null) {
            object = { "__proto__": null };
        } else {
            if (typeof prototype != "object") {
                throw new TypeError("typeof prototype["+(typeof prototype)+"] != 'object'");
            }
            var Type = function () {};
            Type.prototype = prototype;
            object = new Type();
            // IE has no built-in implementation of `Object.getPrototypeOf`
            // neither `__proto__`, but this manually setting `__proto__` will
            // guarantee that `Object.getPrototypeOf` will work as expected with
            // objects created using `Object.create`
            object.__proto__ = prototype;
        }
        if (properties !== void 0) {
            Object.defineProperties(object, properties);
        }
        return object;
    };
}

// ES5 15.2.3.6
// http://es5.github.com/#x15.2.3.6

// Patch for WebKit and IE8 standard mode
// Designed by hax <hax.github.com>
// related issue: https://github.com/kriskowal/es5-shim/issues#issue/5
// IE8 Reference:
//     http://msdn.microsoft.com/en-us/library/dd282900.aspx
//     http://msdn.microsoft.com/en-us/library/dd229916.aspx
// WebKit Bugs:
//     https://bugs.webkit.org/show_bug.cgi?id=36423

function doesDefinePropertyWork(object) {
    try {
        Object.defineProperty(object, "sentinel", {});
        return "sentinel" in object;
    } catch (exception) {
        // returns falsy
    }
}

// check whether defineProperty works if it's given. Otherwise,
// shim partially.
if (Object.defineProperty) {
    var definePropertyWorksOnObject = doesDefinePropertyWork({});
    var definePropertyWorksOnDom = typeof document == "undefined" ||
        doesDefinePropertyWork(document.createElement("div"));
    if (!definePropertyWorksOnObject || !definePropertyWorksOnDom) {
        var definePropertyFallback = Object.defineProperty;
    }
}

if (!Object.defineProperty || definePropertyFallback) {
    var ERR_NON_OBJECT_DESCRIPTOR = "Property description must be an object: ";
    var ERR_NON_OBJECT_TARGET = "Object.defineProperty called on non-object: "
    var ERR_ACCESSORS_NOT_SUPPORTED = "getters & setters can not be defined " +
                                      "on this javascript engine";

    Object.defineProperty = function defineProperty(object, property, descriptor) {
        if ((typeof object != "object" && typeof object != "function") || object === null) {
            throw new TypeError(ERR_NON_OBJECT_TARGET + object);
        }
        if ((typeof descriptor != "object" && typeof descriptor != "function") || descriptor === null) {
            throw new TypeError(ERR_NON_OBJECT_DESCRIPTOR + descriptor);
        }
        // make a valiant attempt to use the real defineProperty
        // for I8's DOM elements.
        if (definePropertyFallback) {
            try {
                return definePropertyFallback.call(Object, object, property, descriptor);
            } catch (exception) {
                // try the shim if the real one doesn't work
            }
        }

        // If it's a data property.
        if (owns(descriptor, "value")) {
            // fail silently if "writable", "enumerable", or "configurable"
            // are requested but not supported
            /*
            // alternate approach:
            if ( // can't implement these features; allow false but not true
                !(owns(descriptor, "writable") ? descriptor.writable : true) ||
                !(owns(descriptor, "enumerable") ? descriptor.enumerable : true) ||
                !(owns(descriptor, "configurable") ? descriptor.configurable : true)
            )
                throw new RangeError(
                    "This implementation of Object.defineProperty does not " +
                    "support configurable, enumerable, or writable."
                );
            */

            if (supportsAccessors && (lookupGetter(object, property) ||
                                      lookupSetter(object, property)))
            {
                // As accessors are supported only on engines implementing
                // `__proto__` we can safely override `__proto__` while defining
                // a property to make sure that we don't hit an inherited
                // accessor.
                var prototype = object.__proto__;
                object.__proto__ = prototypeOfObject;
                // Deleting a property anyway since getter / setter may be
                // defined on object itself.
                delete object[property];
                object[property] = descriptor.value;
                // Setting original `__proto__` back now.
                object.__proto__ = prototype;
            } else {
                object[property] = descriptor.value;
            }
        } else {
            if (!supportsAccessors) {
                throw new TypeError(ERR_ACCESSORS_NOT_SUPPORTED);
            }
            // If we got that far then getters and setters can be defined !!
            if (owns(descriptor, "get")) {
                defineGetter(object, property, descriptor.get);
            }
            if (owns(descriptor, "set")) {
                defineSetter(object, property, descriptor.set);
            }
        }
        return object;
    };
}

// ES5 15.2.3.7
// http://es5.github.com/#x15.2.3.7
if (!Object.defineProperties) {
    Object.defineProperties = function defineProperties(object, properties) {
        for (var property in properties) {
            if (owns(properties, property) && property != "__proto__") {
                Object.defineProperty(object, property, properties[property]);
            }
        }
        return object;
    };
}

// ES5 15.2.3.8
// http://es5.github.com/#x15.2.3.8
if (!Object.seal) {
    Object.seal = function seal(object) {
        // this is misleading and breaks feature-detection, but
        // allows "securable" code to "gracefully" degrade to working
        // but insecure code.
        return object;
    };
}

// ES5 15.2.3.9
// http://es5.github.com/#x15.2.3.9
if (!Object.freeze) {
    Object.freeze = function freeze(object) {
        // this is misleading and breaks feature-detection, but
        // allows "securable" code to "gracefully" degrade to working
        // but insecure code.
        return object;
    };
}

// detect a Rhino bug and patch it
try {
    Object.freeze(function () {});
} catch (exception) {
    Object.freeze = (function freeze(freezeObject) {
        return function freeze(object) {
            if (typeof object == "function") {
                return object;
            } else {
                return freezeObject(object);
            }
        };
    })(Object.freeze);
}

// ES5 15.2.3.10
// http://es5.github.com/#x15.2.3.10
if (!Object.preventExtensions) {
    Object.preventExtensions = function preventExtensions(object) {
        // this is misleading and breaks feature-detection, but
        // allows "securable" code to "gracefully" degrade to working
        // but insecure code.
        return object;
    };
}

// ES5 15.2.3.11
// http://es5.github.com/#x15.2.3.11
if (!Object.isSealed) {
    Object.isSealed = function isSealed(object) {
        return false;
    };
}

// ES5 15.2.3.12
// http://es5.github.com/#x15.2.3.12
if (!Object.isFrozen) {
    Object.isFrozen = function isFrozen(object) {
        return false;
    };
}

// ES5 15.2.3.13
// http://es5.github.com/#x15.2.3.13
if (!Object.isExtensible) {
    Object.isExtensible = function isExtensible(object) {
        // 1. If Type(O) is not Object throw a TypeError exception.
        if (Object(object) !== object) {
            throw new TypeError(); // TODO message
        }
        // 2. Return the Boolean value of the [[Extensible]] internal property of O.
        var name = '';
        while (owns(object, name)) {
            name += '?';
        }
        object[name] = true;
        var returnValue = owns(object, name);
        delete object[name];
        return returnValue;
    };
}

// ES5 15.2.3.14
// http://es5.github.com/#x15.2.3.14
if (!Object.keys) {
    // http://whattheheadsaid.com/2010/10/a-safer-object-keys-compatibility-implementation
    var hasDontEnumBug = true,
        dontEnums = [
            "toString",
            "toLocaleString",
            "valueOf",
            "hasOwnProperty",
            "isPrototypeOf",
            "propertyIsEnumerable",
            "constructor"
        ],
        dontEnumsLength = dontEnums.length;

    for (var key in {"toString": null}) {
        hasDontEnumBug = false;
    }

    Object.keys = function keys(object) {

        if ((typeof object != "object" && typeof object != "function") || object === null) {
            throw new TypeError("Object.keys called on a non-object");
        }

        var keys = [];
        for (var name in object) {
            if (owns(object, name)) {
                keys.push(name);
            }
        }

        if (hasDontEnumBug) {
            for (var i = 0, ii = dontEnumsLength; i < ii; i++) {
                var dontEnum = dontEnums[i];
                if (owns(object, dontEnum)) {
                    keys.push(dontEnum);
                }
            }
        }
        return keys;
    };

}

//
// Date
// ====
//

// ES5 15.9.5.43
// http://es5.github.com/#x15.9.5.43
// This function returns a String value represent the instance in time
// represented by this Date object. The format of the String is the Date Time
// string format defined in 15.9.1.15. All fields are present in the String.
// The time zone is always UTC, denoted by the suffix Z. If the time value of
// this object is not a finite Number a RangeError exception is thrown.
if (!Date.prototype.toISOString || (new Date(-62198755200000).toISOString().indexOf('-000001') === -1)) {
    Date.prototype.toISOString = function toISOString() {
        var result, length, value, year;
        if (!isFinite(this)) {
            throw new RangeError("Date.prototype.toISOString called on non-finite value.");
        }

        // the date time string format is specified in 15.9.1.15.
        result = [this.getUTCMonth() + 1, this.getUTCDate(),
            this.getUTCHours(), this.getUTCMinutes(), this.getUTCSeconds()];
        year = this.getUTCFullYear();
        year = (year < 0 ? '-' : (year > 9999 ? '+' : '')) + ('00000' + Math.abs(year)).slice(0 <= year && year <= 9999 ? -4 : -6);

        length = result.length;
        while (length--) {
            value = result[length];
            // pad months, days, hours, minutes, and seconds to have two digits.
            if (value < 10) {
                result[length] = "0" + value;
            }
        }
        // pad milliseconds to have three digits.
        return year + "-" + result.slice(0, 2).join("-") + "T" + result.slice(2).join(":") + "." +
            ("000" + this.getUTCMilliseconds()).slice(-3) + "Z";
    }
}

// ES5 15.9.4.4
// http://es5.github.com/#x15.9.4.4
if (!Date.now) {
    Date.now = function now() {
        return new Date().getTime();
    };
}

// ES5 15.9.5.44
// http://es5.github.com/#x15.9.5.44
// This function provides a String representation of a Date object for use by
// JSON.stringify (15.12.3).
if (!Date.prototype.toJSON) {
    Date.prototype.toJSON = function toJSON(key) {
        // When the toJSON method is called with argument key, the following
        // steps are taken:

        // 1.  Let O be the result of calling ToObject, giving it the this
        // value as its argument.
        // 2. Let tv be ToPrimitive(O, hint Number).
        // 3. If tv is a Number and is not finite, return null.
        // XXX
        // 4. Let toISO be the result of calling the [[Get]] internal method of
        // O with argument "toISOString".
        // 5. If IsCallable(toISO) is false, throw a TypeError exception.
        if (typeof this.toISOString != "function") {
            throw new TypeError('toISOString property is not callable');
        }
        // 6. Return the result of calling the [[Call]] internal method of
        //  toISO with O as the this value and an empty argument list.
        return this.toISOString();

        // NOTE 1 The argument is ignored.

        // NOTE 2 The toJSON function is intentionally generic; it does not
        // require that its this value be a Date object. Therefore, it can be
        // transferred to other kinds of objects for use as a method. However,
        // it does require that any such object have a toISOString method. An
        // object is free to use the argument key to filter its
        // stringification.
    };
}

// ES5 15.9.4.2
// http://es5.github.com/#x15.9.4.2
// based on work shared by Daniel Friesen (dantman)
// http://gist.github.com/303249
if (!Date.parse || Date.parse("+275760-09-13T00:00:00.000Z") !== 8.64e15) {
    // XXX global assignment won't work in embeddings that use
    // an alternate object for the context.
    Date = (function(NativeDate) {

        // Date.length === 7
        var Date = function Date(Y, M, D, h, m, s, ms) {
            var length = arguments.length;
            if (this instanceof NativeDate) {
                var date = length == 1 && String(Y) === Y ? // isString(Y)
                    // We explicitly pass it through parse:
                    new NativeDate(Date.parse(Y)) :
                    // We have to manually make calls depending on argument
                    // length here
                    length >= 7 ? new NativeDate(Y, M, D, h, m, s, ms) :
                    length >= 6 ? new NativeDate(Y, M, D, h, m, s) :
                    length >= 5 ? new NativeDate(Y, M, D, h, m) :
                    length >= 4 ? new NativeDate(Y, M, D, h) :
                    length >= 3 ? new NativeDate(Y, M, D) :
                    length >= 2 ? new NativeDate(Y, M) :
                    length >= 1 ? new NativeDate(Y) :
                                  new NativeDate();
                // Prevent mixups with unfixed Date object
                date.constructor = Date;
                return date;
            }
            return NativeDate.apply(this, arguments);
        };

        // 15.9.1.15 Date Time String Format.
        var isoDateExpression = new RegExp("^" +
            "(\\d{4}|[\+\-]\\d{6})" + // four-digit year capture or sign + 6-digit extended year
            "(?:-(\\d{2})" + // optional month capture
            "(?:-(\\d{2})" + // optional day capture
            "(?:" + // capture hours:minutes:seconds.milliseconds
                "T(\\d{2})" + // hours capture
                ":(\\d{2})" + // minutes capture
                "(?:" + // optional :seconds.milliseconds
                    ":(\\d{2})" + // seconds capture
                    "(?:\\.(\\d{3}))?" + // milliseconds capture
                ")?" +
            "(?:" + // capture UTC offset component
                "Z|" + // UTC capture
                "(?:" + // offset specifier +/-hours:minutes
                    "([-+])" + // sign capture
                    "(\\d{2})" + // hours offset capture
                    ":(\\d{2})" + // minutes offset capture
                ")" +
            ")?)?)?)?" +
        "$");

        // Copy any custom methods a 3rd party library may have added
        for (var key in NativeDate) {
            Date[key] = NativeDate[key];
        }

        // Copy "native" methods explicitly; they may be non-enumerable
        Date.now = NativeDate.now;
        Date.UTC = NativeDate.UTC;
        Date.prototype = NativeDate.prototype;
        Date.prototype.constructor = Date;

        // Upgrade Date.parse to handle simplified ISO 8601 strings
        Date.parse = function parse(string) {
            var match = isoDateExpression.exec(string);
            if (match) {
                match.shift(); // kill match[0], the full match
                // parse months, days, hours, minutes, seconds, and milliseconds
                for (var i = 1; i < 7; i++) {
                    // provide default values if necessary
                    match[i] = +(match[i] || (i < 3 ? 1 : 0));
                    // match[1] is the month. Months are 0-11 in JavaScript
                    // `Date` objects, but 1-12 in ISO notation, so we
                    // decrement.
                    if (i == 1) {
                        match[i]--;
                    }
                }

                // parse the UTC offset component
                var minuteOffset = +match.pop(), hourOffset = +match.pop(), sign = match.pop();

                // compute the explicit time zone offset if specified
                var offset = 0;
                if (sign) {
                    // detect invalid offsets and return early
                    if (hourOffset > 23 || minuteOffset > 59) {
                        return NaN;
                    }

                    // express the provided time zone offset in minutes. The offset is
                    // negative for time zones west of UTC; positive otherwise.
                    offset = (hourOffset * 60 + minuteOffset) * 6e4 * (sign == "+" ? -1 : 1);
                }

                // Date.UTC for years between 0 and 99 converts year to 1900 + year
                // The Gregorian calendar has a 400-year cycle, so
                // to Date.UTC(year + 400, .... ) - 12622780800000 == Date.UTC(year, ...),
                // where 12622780800000 - number of milliseconds in Gregorian calendar 400 years
                var year = +match[0];
                if (0 <= year && year <= 99) {
                    match[0] = year + 400;
                    return NativeDate.UTC.apply(this, match) + offset - 12622780800000;
                }

                // compute a new UTC date value, accounting for the optional offset
                return NativeDate.UTC.apply(this, match) + offset;
            }
            return NativeDate.parse.apply(this, arguments);
        };

        return Date;
    })(Date);
}

//
// String
// ======
//

// ES5 15.5.4.20
// http://es5.github.com/#x15.5.4.20
var ws = "\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003" +
    "\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028" +
    "\u2029\uFEFF";
if (!String.prototype.trim || ws.trim()) {
    // http://blog.stevenlevithan.com/archives/faster-trim-javascript
    // http://perfectionkills.com/whitespace-deviations/
    ws = "[" + ws + "]";
    var trimBeginRegexp = new RegExp("^" + ws + ws + "*"),
        trimEndRegexp = new RegExp(ws + ws + "*$");
    String.prototype.trim = function trim() {
        if (this === undefined || this === null) {
            throw new TypeError("can't convert "+this+" to object");
        }
        return String(this).replace(trimBeginRegexp, "").replace(trimEndRegexp, "");
    };
}

//
// Util
// ======
//

// ES5 9.4
// http://es5.github.com/#x9.4
// http://jsperf.com/to-integer
var toInteger = function (n) {
    n = +n;
    if (n !== n) { // isNaN
        n = 0;
    } else if (n !== 0 && n !== (1/0) && n !== -(1/0)) {
        n = (n > 0 || -1) * Math.floor(Math.abs(n));
    }
    return n;
};

var prepareString = "a"[0] != "a";
    // ES5 9.9
    // http://es5.github.com/#x9.9
var toObject = function (o) {
    if (o == null) { // this matches both null and undefined
        throw new TypeError("can't convert "+o+" to object");
    }
    // If the implementation doesn't support by-index access of
    // string characters (ex. IE < 9), split the string
    if (prepareString && typeof o == "string" && o) {
        return o.split("");
    }
    return Object(o);
};
});
// three.min.js - http://github.com/mrdoob/three.js
'use strict';var THREE=THREE||{REVISION:"50"};void 0===self.console&&(self.console={info:function(){},log:function(){},debug:function(){},warn:function(){},error:function(){}});void 0===self.Int32Array&&(self.Int32Array=Array,self.Float32Array=Array);
(function(){for(var a=0,b=["ms","moz","webkit","o"],c=0;c<b.length&&!window.requestAnimationFrame;++c){window.requestAnimationFrame=window[b[c]+"RequestAnimationFrame"];window.cancelAnimationFrame=window[b[c]+"CancelAnimationFrame"]||window[b[c]+"CancelRequestAnimationFrame"]}if(window.requestAnimationFrame===void 0)window.requestAnimationFrame=function(b){var c=Date.now(),e=Math.max(0,16-(c-a)),g=window.setTimeout(function(){b(c+e)},e);a=c+e;return g};if(window.cancelAnimationFrame===void 0)window.cancelAnimationFrame=
function(a){clearTimeout(a)}})();THREE.FrontSide=0;THREE.BackSide=1;THREE.DoubleSide=2;THREE.NoShading=0;THREE.FlatShading=1;THREE.SmoothShading=2;THREE.NoColors=0;THREE.FaceColors=1;THREE.VertexColors=2;THREE.NoBlending=0;THREE.NormalBlending=1;THREE.AdditiveBlending=2;THREE.SubtractiveBlending=3;THREE.MultiplyBlending=4;THREE.CustomBlending=5;THREE.AddEquation=100;THREE.SubtractEquation=101;THREE.ReverseSubtractEquation=102;THREE.ZeroFactor=200;THREE.OneFactor=201;THREE.SrcColorFactor=202;
THREE.OneMinusSrcColorFactor=203;THREE.SrcAlphaFactor=204;THREE.OneMinusSrcAlphaFactor=205;THREE.DstAlphaFactor=206;THREE.OneMinusDstAlphaFactor=207;THREE.DstColorFactor=208;THREE.OneMinusDstColorFactor=209;THREE.SrcAlphaSaturateFactor=210;THREE.MultiplyOperation=0;THREE.MixOperation=1;THREE.UVMapping=function(){};THREE.CubeReflectionMapping=function(){};THREE.CubeRefractionMapping=function(){};THREE.SphericalReflectionMapping=function(){};THREE.SphericalRefractionMapping=function(){};
THREE.RepeatWrapping=1E3;THREE.ClampToEdgeWrapping=1001;THREE.MirroredRepeatWrapping=1002;THREE.NearestFilter=1003;THREE.NearestMipMapNearestFilter=1004;THREE.NearestMipMapLinearFilter=1005;THREE.LinearFilter=1006;THREE.LinearMipMapNearestFilter=1007;THREE.LinearMipMapLinearFilter=1008;THREE.UnsignedByteType=1009;THREE.ByteType=1010;THREE.ShortType=1011;THREE.UnsignedShortType=1012;THREE.IntType=1013;THREE.UnsignedIntType=1014;THREE.FloatType=1015;THREE.UnsignedShort4444Type=1016;
THREE.UnsignedShort5551Type=1017;THREE.UnsignedShort565Type=1018;THREE.AlphaFormat=1019;THREE.RGBFormat=1020;THREE.RGBAFormat=1021;THREE.LuminanceFormat=1022;THREE.LuminanceAlphaFormat=1023;THREE.Clock=function(a){this.autoStart=a!==void 0?a:true;this.elapsedTime=this.oldTime=this.startTime=0;this.running=false};THREE.Clock.prototype.start=function(){this.oldTime=this.startTime=Date.now();this.running=true};THREE.Clock.prototype.stop=function(){this.getElapsedTime();this.running=false};
THREE.Clock.prototype.getElapsedTime=function(){return this.elapsedTime=this.elapsedTime+this.getDelta()};THREE.Clock.prototype.getDelta=function(){var a=0;this.autoStart&&!this.running&&this.start();if(this.running){var b=Date.now(),a=0.001*(b-this.oldTime);this.oldTime=b;this.elapsedTime=this.elapsedTime+a}return a};THREE.Color=function(a){a!==void 0&&this.setHex(a);return this};
THREE.Color.prototype={constructor:THREE.Color,r:1,g:1,b:1,copy:function(a){this.r=a.r;this.g=a.g;this.b=a.b;return this},copyGammaToLinear:function(a){this.r=a.r*a.r;this.g=a.g*a.g;this.b=a.b*a.b;return this},copyLinearToGamma:function(a){this.r=Math.sqrt(a.r);this.g=Math.sqrt(a.g);this.b=Math.sqrt(a.b);return this},convertGammaToLinear:function(){var a=this.r,b=this.g,c=this.b;this.r=a*a;this.g=b*b;this.b=c*c;return this},convertLinearToGamma:function(){this.r=Math.sqrt(this.r);this.g=Math.sqrt(this.g);
this.b=Math.sqrt(this.b);return this},setRGB:function(a,b,c){this.r=a;this.g=b;this.b=c;return this},setHSV:function(a,b,c){var d,f,e;if(c===0)this.r=this.g=this.b=0;else{d=Math.floor(a*6);f=a*6-d;a=c*(1-b);e=c*(1-b*f);b=c*(1-b*(1-f));if(d===0){this.r=c;this.g=b;this.b=a}else if(d===1){this.r=e;this.g=c;this.b=a}else if(d===2){this.r=a;this.g=c;this.b=b}else if(d===3){this.r=a;this.g=e;this.b=c}else if(d===4){this.r=b;this.g=a;this.b=c}else if(d===5){this.r=c;this.g=a;this.b=e}}return this},setHex:function(a){a=
Math.floor(a);this.r=(a>>16&255)/255;this.g=(a>>8&255)/255;this.b=(a&255)/255;return this},lerpSelf:function(a,b){this.r=this.r+(a.r-this.r)*b;this.g=this.g+(a.g-this.g)*b;this.b=this.b+(a.b-this.b)*b;return this},getHex:function(){return Math.floor(this.r*255)<<16^Math.floor(this.g*255)<<8^Math.floor(this.b*255)},getContextStyle:function(){return"rgb("+Math.floor(this.r*255)+","+Math.floor(this.g*255)+","+Math.floor(this.b*255)+")"},clone:function(){return(new THREE.Color).setRGB(this.r,this.g,this.b)}};
THREE.Vector2=function(a,b){this.x=a||0;this.y=b||0};
THREE.Vector2.prototype={constructor:THREE.Vector2,set:function(a,b){this.x=a;this.y=b;return this},copy:function(a){this.x=a.x;this.y=a.y;return this},add:function(a,b){this.x=a.x+b.x;this.y=a.y+b.y;return this},addSelf:function(a){this.x=this.x+a.x;this.y=this.y+a.y;return this},sub:function(a,b){this.x=a.x-b.x;this.y=a.y-b.y;return this},subSelf:function(a){this.x=this.x-a.x;this.y=this.y-a.y;return this},multiplyScalar:function(a){this.x=this.x*a;this.y=this.y*a;return this},divideScalar:function(a){if(a){this.x=
this.x/a;this.y=this.y/a}else this.set(0,0);return this},negate:function(){return this.multiplyScalar(-1)},dot:function(a){return this.x*a.x+this.y*a.y},lengthSq:function(){return this.x*this.x+this.y*this.y},length:function(){return Math.sqrt(this.lengthSq())},normalize:function(){return this.divideScalar(this.length())},distanceTo:function(a){return Math.sqrt(this.distanceToSquared(a))},distanceToSquared:function(a){var b=this.x-a.x,a=this.y-a.y;return b*b+a*a},setLength:function(a){return this.normalize().multiplyScalar(a)},
lerpSelf:function(a,b){this.x=this.x+(a.x-this.x)*b;this.y=this.y+(a.y-this.y)*b;return this},equals:function(a){return a.x===this.x&&a.y===this.y},isZero:function(){return this.lengthSq()<1E-4},clone:function(){return new THREE.Vector2(this.x,this.y)}};THREE.Vector3=function(a,b,c){this.x=a||0;this.y=b||0;this.z=c||0};
THREE.Vector3.prototype={constructor:THREE.Vector3,set:function(a,b,c){this.x=a;this.y=b;this.z=c;return this},setX:function(a){this.x=a;return this},setY:function(a){this.y=a;return this},setZ:function(a){this.z=a;return this},copy:function(a){this.x=a.x;this.y=a.y;this.z=a.z;return this},add:function(a,b){this.x=a.x+b.x;this.y=a.y+b.y;this.z=a.z+b.z;return this},addSelf:function(a){this.x=this.x+a.x;this.y=this.y+a.y;this.z=this.z+a.z;return this},addScalar:function(a){this.x=this.x+a;this.y=this.y+
a;this.z=this.z+a;return this},sub:function(a,b){this.x=a.x-b.x;this.y=a.y-b.y;this.z=a.z-b.z;return this},subSelf:function(a){this.x=this.x-a.x;this.y=this.y-a.y;this.z=this.z-a.z;return this},multiply:function(a,b){this.x=a.x*b.x;this.y=a.y*b.y;this.z=a.z*b.z;return this},multiplySelf:function(a){this.x=this.x*a.x;this.y=this.y*a.y;this.z=this.z*a.z;return this},multiplyScalar:function(a){this.x=this.x*a;this.y=this.y*a;this.z=this.z*a;return this},divideSelf:function(a){this.x=this.x/a.x;this.y=
this.y/a.y;this.z=this.z/a.z;return this},divideScalar:function(a){if(a){this.x=this.x/a;this.y=this.y/a;this.z=this.z/a}else this.z=this.y=this.x=0;return this},negate:function(){return this.multiplyScalar(-1)},dot:function(a){return this.x*a.x+this.y*a.y+this.z*a.z},lengthSq:function(){return this.x*this.x+this.y*this.y+this.z*this.z},length:function(){return Math.sqrt(this.lengthSq())},lengthManhattan:function(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)},normalize:function(){return this.divideScalar(this.length())},
setLength:function(a){return this.normalize().multiplyScalar(a)},lerpSelf:function(a,b){this.x=this.x+(a.x-this.x)*b;this.y=this.y+(a.y-this.y)*b;this.z=this.z+(a.z-this.z)*b;return this},cross:function(a,b){this.x=a.y*b.z-a.z*b.y;this.y=a.z*b.x-a.x*b.z;this.z=a.x*b.y-a.y*b.x;return this},crossSelf:function(a){var b=this.x,c=this.y,d=this.z;this.x=c*a.z-d*a.y;this.y=d*a.x-b*a.z;this.z=b*a.y-c*a.x;return this},distanceTo:function(a){return Math.sqrt(this.distanceToSquared(a))},distanceToSquared:function(a){return(new THREE.Vector3).sub(this,
a).lengthSq()},getPositionFromMatrix:function(a){this.x=a.elements[12];this.y=a.elements[13];this.z=a.elements[14];return this},setEulerFromRotationMatrix:function(a,b){function c(a){return Math.min(Math.max(a,-1),1)}var d=a.elements,f=d[0],e=d[4],g=d[8],h=d[1],i=d[5],j=d[9],l=d[2],o=d[6],d=d[10];if(b===void 0||b==="XYZ"){this.y=Math.asin(c(g));if(Math.abs(g)<0.99999){this.x=Math.atan2(-j,d);this.z=Math.atan2(-e,f)}else{this.x=Math.atan2(h,i);this.z=0}}else if(b==="YXZ"){this.x=Math.asin(-c(j));if(Math.abs(j)<
0.99999){this.y=Math.atan2(g,d);this.z=Math.atan2(h,i)}else{this.y=Math.atan2(-l,f);this.z=0}}else if(b==="ZXY"){this.x=Math.asin(c(o));if(Math.abs(o)<0.99999){this.y=Math.atan2(-l,d);this.z=Math.atan2(-e,i)}else{this.y=0;this.z=Math.atan2(g,f)}}else if(b==="ZYX"){this.y=Math.asin(-c(l));if(Math.abs(l)<0.99999){this.x=Math.atan2(o,d);this.z=Math.atan2(h,f)}else{this.x=0;this.z=Math.atan2(-e,i)}}else if(b==="YZX"){this.z=Math.asin(c(h));if(Math.abs(h)<0.99999){this.x=Math.atan2(-j,i);this.y=Math.atan2(-l,
f)}else{this.x=0;this.y=Math.atan2(l,d)}}else if(b==="XZY"){this.z=Math.asin(-c(e));if(Math.abs(e)<0.99999){this.x=Math.atan2(o,i);this.y=Math.atan2(g,f)}else{this.x=Math.atan2(-g,d);this.y=0}}return this},setEulerFromQuaternion:function(a,b){function c(a){return Math.min(Math.max(a,-1),1)}var d=a.x*a.x,f=a.y*a.y,e=a.z*a.z,g=a.w*a.w;if(b===void 0||b==="XYZ"){this.x=Math.atan2(2*(a.x*a.w-a.y*a.z),g-d-f+e);this.y=Math.asin(c(2*(a.x*a.z+a.y*a.w)));this.z=Math.atan2(2*(a.z*a.w-a.x*a.y),g+d-f-e)}else if(b===
"YXZ"){this.x=Math.asin(c(2*(a.x*a.w-a.y*a.z)));this.y=Math.atan2(2*(a.x*a.z+a.y*a.w),g-d-f+e);this.z=Math.atan2(2*(a.x*a.y+a.z*a.w),g-d+f-e)}else if(b==="ZXY"){this.x=Math.asin(c(2*(a.x*a.w+a.y*a.z)));this.y=Math.atan2(2*(a.y*a.w-a.z*a.x),g-d-f+e);this.z=Math.atan2(2*(a.z*a.w-a.x*a.y),g-d+f-e)}else if(b==="ZYX"){this.x=Math.atan2(2*(a.x*a.w+a.z*a.y),g-d-f+e);this.y=Math.asin(c(2*(a.y*a.w-a.x*a.z)));this.z=Math.atan2(2*(a.x*a.y+a.z*a.w),g+d-f-e)}else if(b==="YZX"){this.x=Math.atan2(2*(a.x*a.w-a.z*
a.y),g-d+f-e);this.y=Math.atan2(2*(a.y*a.w-a.x*a.z),g+d-f-e);this.z=Math.asin(c(2*(a.x*a.y+a.z*a.w)))}else if(b==="XZY"){this.x=Math.atan2(2*(a.x*a.w+a.y*a.z),g-d+f-e);this.y=Math.atan2(2*(a.x*a.z+a.y*a.w),g+d-f-e);this.z=Math.asin(c(2*(a.z*a.w-a.x*a.y)))}return this},getScaleFromMatrix:function(a){var b=this.set(a.elements[0],a.elements[1],a.elements[2]).length(),c=this.set(a.elements[4],a.elements[5],a.elements[6]).length(),a=this.set(a.elements[8],a.elements[9],a.elements[10]).length();this.x=
b;this.y=c;this.z=a;return this},equals:function(a){return a.x===this.x&&a.y===this.y&&a.z===this.z},isZero:function(){return this.lengthSq()<1E-4},clone:function(){return new THREE.Vector3(this.x,this.y,this.z)}};THREE.Vector4=function(a,b,c,d){this.x=a||0;this.y=b||0;this.z=c||0;this.w=d!==void 0?d:1};
THREE.Vector4.prototype={constructor:THREE.Vector4,set:function(a,b,c,d){this.x=a;this.y=b;this.z=c;this.w=d;return this},copy:function(a){this.x=a.x;this.y=a.y;this.z=a.z;this.w=a.w!==void 0?a.w:1;return this},add:function(a,b){this.x=a.x+b.x;this.y=a.y+b.y;this.z=a.z+b.z;this.w=a.w+b.w;return this},addSelf:function(a){this.x=this.x+a.x;this.y=this.y+a.y;this.z=this.z+a.z;this.w=this.w+a.w;return this},sub:function(a,b){this.x=a.x-b.x;this.y=a.y-b.y;this.z=a.z-b.z;this.w=a.w-b.w;return this},subSelf:function(a){this.x=
this.x-a.x;this.y=this.y-a.y;this.z=this.z-a.z;this.w=this.w-a.w;return this},multiplyScalar:function(a){this.x=this.x*a;this.y=this.y*a;this.z=this.z*a;this.w=this.w*a;return this},divideScalar:function(a){if(a){this.x=this.x/a;this.y=this.y/a;this.z=this.z/a;this.w=this.w/a}else{this.z=this.y=this.x=0;this.w=1}return this},negate:function(){return this.multiplyScalar(-1)},dot:function(a){return this.x*a.x+this.y*a.y+this.z*a.z+this.w*a.w},lengthSq:function(){return this.dot(this)},length:function(){return Math.sqrt(this.lengthSq())},
normalize:function(){return this.divideScalar(this.length())},setLength:function(a){return this.normalize().multiplyScalar(a)},lerpSelf:function(a,b){this.x=this.x+(a.x-this.x)*b;this.y=this.y+(a.y-this.y)*b;this.z=this.z+(a.z-this.z)*b;this.w=this.w+(a.w-this.w)*b;return this},clone:function(){return new THREE.Vector4(this.x,this.y,this.z,this.w)},setAxisAngleFromQuaternion:function(a){this.w=2*Math.acos(a.w);var b=Math.sqrt(1-a.w*a.w);if(b<1E-4){this.x=1;this.z=this.y=0}else{this.x=a.x/b;this.y=
a.y/b;this.z=a.z/b}return this},setAxisAngleFromRotationMatrix:function(a){var b,c,d,a=a.elements,f=a[0];d=a[4];var e=a[8],g=a[1],h=a[5],i=a[9];c=a[2];b=a[6];var j=a[10];if(Math.abs(d-g)<0.01&&Math.abs(e-c)<0.01&&Math.abs(i-b)<0.01){if(Math.abs(d+g)<0.1&&Math.abs(e+c)<0.1&&Math.abs(i+b)<0.1&&Math.abs(f+h+j-3)<0.1){this.set(1,0,0,0);return this}a=Math.PI;f=(f+1)/2;h=(h+1)/2;j=(j+1)/2;d=(d+g)/4;e=(e+c)/4;i=(i+b)/4;if(f>h&&f>j)if(f<0.01){b=0;d=c=0.707106781}else{b=Math.sqrt(f);c=d/b;d=e/b}else if(h>
j)if(h<0.01){b=0.707106781;c=0;d=0.707106781}else{c=Math.sqrt(h);b=d/c;d=i/c}else if(j<0.01){c=b=0.707106781;d=0}else{d=Math.sqrt(j);b=e/d;c=i/d}this.set(b,c,d,a);return this}a=Math.sqrt((b-i)*(b-i)+(e-c)*(e-c)+(g-d)*(g-d));Math.abs(a)<0.001&&(a=1);this.x=(b-i)/a;this.y=(e-c)/a;this.z=(g-d)/a;this.w=Math.acos((f+h+j-1)/2);return this}};
THREE.EventTarget=function(){var a={};this.addEventListener=function(b,c){a[b]===void 0&&(a[b]=[]);a[b].indexOf(c)===-1&&a[b].push(c)};this.dispatchEvent=function(b){for(var c in a[b.type])a[b.type][c](b)};this.removeEventListener=function(b,c){var d=a[b].indexOf(c);d!==-1&&a[b].splice(d,1)}};THREE.Frustum=function(){this.planes=[new THREE.Vector4,new THREE.Vector4,new THREE.Vector4,new THREE.Vector4,new THREE.Vector4,new THREE.Vector4]};
THREE.Frustum.prototype.setFromMatrix=function(a){var b=this.planes,c=a.elements,a=c[0],d=c[1],f=c[2],e=c[3],g=c[4],h=c[5],i=c[6],j=c[7],l=c[8],o=c[9],m=c[10],p=c[11],q=c[12],n=c[13],r=c[14],c=c[15];b[0].set(e-a,j-g,p-l,c-q);b[1].set(e+a,j+g,p+l,c+q);b[2].set(e+d,j+h,p+o,c+n);b[3].set(e-d,j-h,p-o,c-n);b[4].set(e-f,j-i,p-m,c-r);b[5].set(e+f,j+i,p+m,c+r);for(d=0;d<6;d++){a=b[d];a.divideScalar(Math.sqrt(a.x*a.x+a.y*a.y+a.z*a.z))}};
THREE.Frustum.prototype.contains=function(a){for(var b=0,c=this.planes,b=a.matrixWorld,d=b.elements,a=-a.geometry.boundingSphere.radius*b.getMaxScaleOnAxis(),f=0;f<6;f++){b=c[f].x*d[12]+c[f].y*d[13]+c[f].z*d[14]+c[f].w;if(b<=a)return false}return true};THREE.Frustum.__v1=new THREE.Vector3;
THREE.Ray=function(a,b,c,d){this.origin=a||new THREE.Vector3;this.direction=b||new THREE.Vector3;this.near=c||0;this.far=d||Infinity;var f=new THREE.Vector3,e=new THREE.Vector3,g=new THREE.Vector3,h=new THREE.Vector3,i=new THREE.Vector3,j=new THREE.Vector3,l=new THREE.Vector3,o=new THREE.Vector3,m=new THREE.Vector3,p=function(a,b){return a.distance-b.distance},q=new THREE.Vector3,n=new THREE.Vector3,r=new THREE.Vector3,s,t,u,z=function(a,b,c){q.sub(c,a);s=q.dot(b);t=n.add(a,r.copy(b).multiplyScalar(s));
return u=c.distanceTo(t)},x,A,B,C,v,J,F,O,P=function(a,b,c,d){q.sub(d,b);n.sub(c,b);r.sub(a,b);x=q.dot(q);A=q.dot(n);B=q.dot(r);C=n.dot(n);v=n.dot(r);J=1/(x*C-A*A);F=(C*B-A*v)*J;O=(x*v-A*B)*J;return F>=0&&O>=0&&F+O<1},G=1E-4;this.setPrecision=function(a){G=a};this.intersectObject=function(a,b){var c,d=[];if(b===true)for(var n=0,q=a.children.length;n<q;n++)Array.prototype.push.apply(d,this.intersectObject(a.children[n],b));if(a instanceof THREE.Particle){u=z(this.origin,this.direction,a.matrixWorld.getPosition());
if(u>a.scale.x)return[];c={distance:u,point:a.position,face:null,object:a};d.push(c)}else if(a instanceof THREE.Mesh){n=THREE.Frustum.__v1.set(a.matrixWorld.getColumnX().length(),a.matrixWorld.getColumnY().length(),a.matrixWorld.getColumnZ().length());n=a.geometry.boundingSphere.radius*Math.max(n.x,Math.max(n.y,n.z));u=z(this.origin,this.direction,a.matrixWorld.getPosition());if(u>n)return d;var r,s,t=a.geometry,v=t.vertices,x,A,C,B;A=a.geometry.materials;C=a.material instanceof THREE.MeshFaceMaterial;
a.matrixRotationWorld.extractRotation(a.matrixWorld);n=0;for(q=t.faces.length;n<q;n++){c=t.faces[n];r=C===true?A[c.materialIndex]:a.material;if(r!==void 0){B=r.side;i.copy(this.origin);j.copy(this.direction);x=a.matrixWorld;l=x.multiplyVector3(l.copy(c.centroid)).subSelf(i);o=a.matrixRotationWorld.multiplyVector3(o.copy(c.normal));r=j.dot(o);if(!(Math.abs(r)<G)){s=o.dot(l)/r;if(!(s<0)&&(B===THREE.DoubleSide||(B===THREE.FrontSide?r<0:r>0))){m.add(i,j.multiplyScalar(s));u=i.distanceTo(m);if(!(u<this.near)&&
!(u>this.far))if(c instanceof THREE.Face3){f=x.multiplyVector3(f.copy(v[c.a]));e=x.multiplyVector3(e.copy(v[c.b]));g=x.multiplyVector3(g.copy(v[c.c]));if(P(m,f,e,g)){c={distance:u,point:m.clone(),face:c,faceIndex:n,object:a};d.push(c)}}else if(c instanceof THREE.Face4){f=x.multiplyVector3(f.copy(v[c.a]));e=x.multiplyVector3(e.copy(v[c.b]));g=x.multiplyVector3(g.copy(v[c.c]));h=x.multiplyVector3(h.copy(v[c.d]));if(P(m,f,e,h)||P(m,e,g,h)){c={distance:u,point:m.clone(),face:c,faceIndex:n,object:a};d.push(c)}}}}}}}d.sort(p);
return d};this.intersectObjects=function(a,b){for(var c=[],d=0,f=a.length;d<f;d++)Array.prototype.push.apply(c,this.intersectObject(a[d],b));c.sort(p);return c}};
THREE.Rectangle=function(){function a(){e=d-b;g=f-c}var b=0,c=0,d=0,f=0,e=0,g=0,h=true;this.getX=function(){return b};this.getY=function(){return c};this.getWidth=function(){return e};this.getHeight=function(){return g};this.getLeft=function(){return b};this.getTop=function(){return c};this.getRight=function(){return d};this.getBottom=function(){return f};this.set=function(e,g,l,o){h=false;b=e;c=g;d=l;f=o;a()};this.addPoint=function(e,g){if(h===true){h=false;b=e;c=g;d=e;f=g}else{b=b<e?b:e;c=c<g?c:
g;d=d>e?d:e;f=f>g?f:g}a()};this.add3Points=function(e,g,l,o,m,p){if(h===true){h=false;b=e<l?e<m?e:m:l<m?l:m;c=g<o?g<p?g:p:o<p?o:p;d=e>l?e>m?e:m:l>m?l:m;f=g>o?g>p?g:p:o>p?o:p}else{b=e<l?e<m?e<b?e:b:m<b?m:b:l<m?l<b?l:b:m<b?m:b;c=g<o?g<p?g<c?g:c:p<c?p:c:o<p?o<c?o:c:p<c?p:c;d=e>l?e>m?e>d?e:d:m>d?m:d:l>m?l>d?l:d:m>d?m:d;f=g>o?g>p?g>f?g:f:p>f?p:f:o>p?o>f?o:f:p>f?p:f}a()};this.addRectangle=function(e){if(h===true){h=false;b=e.getLeft();c=e.getTop();d=e.getRight();f=e.getBottom()}else{b=b<e.getLeft()?b:e.getLeft();
c=c<e.getTop()?c:e.getTop();d=d>e.getRight()?d:e.getRight();f=f>e.getBottom()?f:e.getBottom()}a()};this.inflate=function(e){b=b-e;c=c-e;d=d+e;f=f+e;a()};this.minSelf=function(e){b=b>e.getLeft()?b:e.getLeft();c=c>e.getTop()?c:e.getTop();d=d<e.getRight()?d:e.getRight();f=f<e.getBottom()?f:e.getBottom();a()};this.intersects=function(a){return d<a.getLeft()||b>a.getRight()||f<a.getTop()||c>a.getBottom()?false:true};this.empty=function(){h=true;f=d=c=b=0;a()};this.isEmpty=function(){return h}};
THREE.Math={clamp:function(a,b,c){return a<b?b:a>c?c:a},clampBottom:function(a,b){return a<b?b:a},mapLinear:function(a,b,c,d,f){return d+(a-b)*(f-d)/(c-b)},random16:function(){return(65280*Math.random()+255*Math.random())/65535},randInt:function(a,b){return a+Math.floor(Math.random()*(b-a+1))},randFloat:function(a,b){return a+Math.random()*(b-a)},randFloatSpread:function(a){return a*(0.5-Math.random())},sign:function(a){return a<0?-1:a>0?1:0}};THREE.Matrix3=function(){this.elements=new Float32Array(9)};
THREE.Matrix3.prototype={constructor:THREE.Matrix3,getInverse:function(a){var b=a.elements,a=b[10]*b[5]-b[6]*b[9],c=-b[10]*b[1]+b[2]*b[9],d=b[6]*b[1]-b[2]*b[5],f=-b[10]*b[4]+b[6]*b[8],e=b[10]*b[0]-b[2]*b[8],g=-b[6]*b[0]+b[2]*b[4],h=b[9]*b[4]-b[5]*b[8],i=-b[9]*b[0]+b[1]*b[8],j=b[5]*b[0]-b[1]*b[4],b=b[0]*a+b[1]*f+b[2]*h;b===0&&console.warn("Matrix3.getInverse(): determinant == 0");var b=1/b,l=this.elements;l[0]=b*a;l[1]=b*c;l[2]=b*d;l[3]=b*f;l[4]=b*e;l[5]=b*g;l[6]=b*h;l[7]=b*i;l[8]=b*j;return this},
transpose:function(){var a,b=this.elements;a=b[1];b[1]=b[3];b[3]=a;a=b[2];b[2]=b[6];b[6]=a;a=b[5];b[5]=b[7];b[7]=a;return this},transposeIntoArray:function(a){var b=this.m;a[0]=b[0];a[1]=b[3];a[2]=b[6];a[3]=b[1];a[4]=b[4];a[5]=b[7];a[6]=b[2];a[7]=b[5];a[8]=b[8];return this}};THREE.Matrix4=function(a,b,c,d,f,e,g,h,i,j,l,o,m,p,q,n){this.elements=new Float32Array(16);this.set(a!==void 0?a:1,b||0,c||0,d||0,f||0,e!==void 0?e:1,g||0,h||0,i||0,j||0,l!==void 0?l:1,o||0,m||0,p||0,q||0,n!==void 0?n:1)};
THREE.Matrix4.prototype={constructor:THREE.Matrix4,set:function(a,b,c,d,f,e,g,h,i,j,l,o,m,p,q,n){var r=this.elements;r[0]=a;r[4]=b;r[8]=c;r[12]=d;r[1]=f;r[5]=e;r[9]=g;r[13]=h;r[2]=i;r[6]=j;r[10]=l;r[14]=o;r[3]=m;r[7]=p;r[11]=q;r[15]=n;return this},identity:function(){this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1);return this},copy:function(a){a=a.elements;this.set(a[0],a[4],a[8],a[12],a[1],a[5],a[9],a[13],a[2],a[6],a[10],a[14],a[3],a[7],a[11],a[15]);return this},lookAt:function(a,b,c){var d=this.elements,
f=THREE.Matrix4.__v1,e=THREE.Matrix4.__v2,g=THREE.Matrix4.__v3;g.sub(a,b).normalize();if(g.length()===0)g.z=1;f.cross(c,g).normalize();if(f.length()===0){g.x=g.x+1E-4;f.cross(c,g).normalize()}e.cross(g,f);d[0]=f.x;d[4]=e.x;d[8]=g.x;d[1]=f.y;d[5]=e.y;d[9]=g.y;d[2]=f.z;d[6]=e.z;d[10]=g.z;return this},multiply:function(a,b){var c=a.elements,d=b.elements,f=this.elements,e=c[0],g=c[4],h=c[8],i=c[12],j=c[1],l=c[5],o=c[9],m=c[13],p=c[2],q=c[6],n=c[10],r=c[14],s=c[3],t=c[7],u=c[11],c=c[15],z=d[0],x=d[4],
A=d[8],B=d[12],C=d[1],v=d[5],J=d[9],F=d[13],O=d[2],P=d[6],G=d[10],E=d[14],I=d[3],R=d[7],M=d[11],d=d[15];f[0]=e*z+g*C+h*O+i*I;f[4]=e*x+g*v+h*P+i*R;f[8]=e*A+g*J+h*G+i*M;f[12]=e*B+g*F+h*E+i*d;f[1]=j*z+l*C+o*O+m*I;f[5]=j*x+l*v+o*P+m*R;f[9]=j*A+l*J+o*G+m*M;f[13]=j*B+l*F+o*E+m*d;f[2]=p*z+q*C+n*O+r*I;f[6]=p*x+q*v+n*P+r*R;f[10]=p*A+q*J+n*G+r*M;f[14]=p*B+q*F+n*E+r*d;f[3]=s*z+t*C+u*O+c*I;f[7]=s*x+t*v+u*P+c*R;f[11]=s*A+t*J+u*G+c*M;f[15]=s*B+t*F+u*E+c*d;return this},multiplySelf:function(a){return this.multiply(this,
a)},multiplyToArray:function(a,b,c){var d=this.elements;this.multiply(a,b);c[0]=d[0];c[1]=d[1];c[2]=d[2];c[3]=d[3];c[4]=d[4];c[5]=d[5];c[6]=d[6];c[7]=d[7];c[8]=d[8];c[9]=d[9];c[10]=d[10];c[11]=d[11];c[12]=d[12];c[13]=d[13];c[14]=d[14];c[15]=d[15];return this},multiplyScalar:function(a){var b=this.elements;b[0]=b[0]*a;b[4]=b[4]*a;b[8]=b[8]*a;b[12]=b[12]*a;b[1]=b[1]*a;b[5]=b[5]*a;b[9]=b[9]*a;b[13]=b[13]*a;b[2]=b[2]*a;b[6]=b[6]*a;b[10]=b[10]*a;b[14]=b[14]*a;b[3]=b[3]*a;b[7]=b[7]*a;b[11]=b[11]*a;b[15]=
b[15]*a;return this},multiplyVector3:function(a){var b=this.elements,c=a.x,d=a.y,f=a.z,e=1/(b[3]*c+b[7]*d+b[11]*f+b[15]);a.x=(b[0]*c+b[4]*d+b[8]*f+b[12])*e;a.y=(b[1]*c+b[5]*d+b[9]*f+b[13])*e;a.z=(b[2]*c+b[6]*d+b[10]*f+b[14])*e;return a},multiplyVector4:function(a){var b=this.elements,c=a.x,d=a.y,f=a.z,e=a.w;a.x=b[0]*c+b[4]*d+b[8]*f+b[12]*e;a.y=b[1]*c+b[5]*d+b[9]*f+b[13]*e;a.z=b[2]*c+b[6]*d+b[10]*f+b[14]*e;a.w=b[3]*c+b[7]*d+b[11]*f+b[15]*e;return a},multiplyVector3Array:function(a){for(var b=THREE.Matrix4.__v1,
c=0,d=a.length;c<d;c=c+3){b.x=a[c];b.y=a[c+1];b.z=a[c+2];this.multiplyVector3(b);a[c]=b.x;a[c+1]=b.y;a[c+2]=b.z}return a},rotateAxis:function(a){var b=this.elements,c=a.x,d=a.y,f=a.z;a.x=c*b[0]+d*b[4]+f*b[8];a.y=c*b[1]+d*b[5]+f*b[9];a.z=c*b[2]+d*b[6]+f*b[10];a.normalize();return a},crossVector:function(a){var b=this.elements,c=new THREE.Vector4;c.x=b[0]*a.x+b[4]*a.y+b[8]*a.z+b[12]*a.w;c.y=b[1]*a.x+b[5]*a.y+b[9]*a.z+b[13]*a.w;c.z=b[2]*a.x+b[6]*a.y+b[10]*a.z+b[14]*a.w;c.w=a.w?b[3]*a.x+b[7]*a.y+b[11]*
a.z+b[15]*a.w:1;return c},determinant:function(){var a=this.elements,b=a[0],c=a[4],d=a[8],f=a[12],e=a[1],g=a[5],h=a[9],i=a[13],j=a[2],l=a[6],o=a[10],m=a[14],p=a[3],q=a[7],n=a[11],a=a[15];return f*h*l*p-d*i*l*p-f*g*o*p+c*i*o*p+d*g*m*p-c*h*m*p-f*h*j*q+d*i*j*q+f*e*o*q-b*i*o*q-d*e*m*q+b*h*m*q+f*g*j*n-c*i*j*n-f*e*l*n+b*i*l*n+c*e*m*n-b*g*m*n-d*g*j*a+c*h*j*a+d*e*l*a-b*h*l*a-c*e*o*a+b*g*o*a},transpose:function(){var a=this.elements,b;b=a[1];a[1]=a[4];a[4]=b;b=a[2];a[2]=a[8];a[8]=b;b=a[6];a[6]=a[9];a[9]=b;
b=a[3];a[3]=a[12];a[12]=b;b=a[7];a[7]=a[13];a[13]=b;b=a[11];a[11]=a[14];a[14]=b;return this},flattenToArray:function(a){var b=this.elements;a[0]=b[0];a[1]=b[1];a[2]=b[2];a[3]=b[3];a[4]=b[4];a[5]=b[5];a[6]=b[6];a[7]=b[7];a[8]=b[8];a[9]=b[9];a[10]=b[10];a[11]=b[11];a[12]=b[12];a[13]=b[13];a[14]=b[14];a[15]=b[15];return a},flattenToArrayOffset:function(a,b){var c=this.elements;a[b]=c[0];a[b+1]=c[1];a[b+2]=c[2];a[b+3]=c[3];a[b+4]=c[4];a[b+5]=c[5];a[b+6]=c[6];a[b+7]=c[7];a[b+8]=c[8];a[b+9]=c[9];a[b+10]=
c[10];a[b+11]=c[11];a[b+12]=c[12];a[b+13]=c[13];a[b+14]=c[14];a[b+15]=c[15];return a},getPosition:function(){var a=this.elements;return THREE.Matrix4.__v1.set(a[12],a[13],a[14])},setPosition:function(a){var b=this.elements;b[12]=a.x;b[13]=a.y;b[14]=a.z;return this},getColumnX:function(){var a=this.elements;return THREE.Matrix4.__v1.set(a[0],a[1],a[2])},getColumnY:function(){var a=this.elements;return THREE.Matrix4.__v1.set(a[4],a[5],a[6])},getColumnZ:function(){var a=this.elements;return THREE.Matrix4.__v1.set(a[8],
a[9],a[10])},getInverse:function(a){var b=this.elements,c=a.elements,d=c[0],f=c[4],e=c[8],g=c[12],h=c[1],i=c[5],j=c[9],l=c[13],o=c[2],m=c[6],p=c[10],q=c[14],n=c[3],r=c[7],s=c[11],c=c[15];b[0]=j*q*r-l*p*r+l*m*s-i*q*s-j*m*c+i*p*c;b[4]=g*p*r-e*q*r-g*m*s+f*q*s+e*m*c-f*p*c;b[8]=e*l*r-g*j*r+g*i*s-f*l*s-e*i*c+f*j*c;b[12]=g*j*m-e*l*m-g*i*p+f*l*p+e*i*q-f*j*q;b[1]=l*p*n-j*q*n-l*o*s+h*q*s+j*o*c-h*p*c;b[5]=e*q*n-g*p*n+g*o*s-d*q*s-e*o*c+d*p*c;b[9]=g*j*n-e*l*n-g*h*s+d*l*s+e*h*c-d*j*c;b[13]=e*l*o-g*j*o+g*h*p-d*
l*p-e*h*q+d*j*q;b[2]=i*q*n-l*m*n+l*o*r-h*q*r-i*o*c+h*m*c;b[6]=g*m*n-f*q*n-g*o*r+d*q*r+f*o*c-d*m*c;b[10]=f*l*n-g*i*n+g*h*r-d*l*r-f*h*c+d*i*c;b[14]=g*i*o-f*l*o-g*h*m+d*l*m+f*h*q-d*i*q;b[3]=j*m*n-i*p*n-j*o*r+h*p*r+i*o*s-h*m*s;b[7]=f*p*n-e*m*n+e*o*r-d*p*r-f*o*s+d*m*s;b[11]=e*i*n-f*j*n-e*h*r+d*j*r+f*h*s-d*i*s;b[15]=f*j*o-e*i*o+e*h*m-d*j*m-f*h*p+d*i*p;this.multiplyScalar(1/a.determinant());return this},setRotationFromEuler:function(a,b){var c=this.elements,d=a.x,f=a.y,e=a.z,g=Math.cos(d),d=Math.sin(d),
h=Math.cos(f),f=Math.sin(f),i=Math.cos(e),e=Math.sin(e);if(b===void 0||b==="XYZ"){var j=g*i,l=g*e,o=d*i,m=d*e;c[0]=h*i;c[4]=-h*e;c[8]=f;c[1]=l+o*f;c[5]=j-m*f;c[9]=-d*h;c[2]=m-j*f;c[6]=o+l*f;c[10]=g*h}else if(b==="YXZ"){j=h*i;l=h*e;o=f*i;m=f*e;c[0]=j+m*d;c[4]=o*d-l;c[8]=g*f;c[1]=g*e;c[5]=g*i;c[9]=-d;c[2]=l*d-o;c[6]=m+j*d;c[10]=g*h}else if(b==="ZXY"){j=h*i;l=h*e;o=f*i;m=f*e;c[0]=j-m*d;c[4]=-g*e;c[8]=o+l*d;c[1]=l+o*d;c[5]=g*i;c[9]=m-j*d;c[2]=-g*f;c[6]=d;c[10]=g*h}else if(b==="ZYX"){j=g*i;l=g*e;o=d*i;
m=d*e;c[0]=h*i;c[4]=o*f-l;c[8]=j*f+m;c[1]=h*e;c[5]=m*f+j;c[9]=l*f-o;c[2]=-f;c[6]=d*h;c[10]=g*h}else if(b==="YZX"){j=g*h;l=g*f;o=d*h;m=d*f;c[0]=h*i;c[4]=m-j*e;c[8]=o*e+l;c[1]=e;c[5]=g*i;c[9]=-d*i;c[2]=-f*i;c[6]=l*e+o;c[10]=j-m*e}else if(b==="XZY"){j=g*h;l=g*f;o=d*h;m=d*f;c[0]=h*i;c[4]=-e;c[8]=f*i;c[1]=j*e+m;c[5]=g*i;c[9]=l*e-o;c[2]=o*e-l;c[6]=d*i;c[10]=m*e+j}return this},setRotationFromQuaternion:function(a){var b=this.elements,c=a.x,d=a.y,f=a.z,e=a.w,g=c+c,h=d+d,i=f+f,a=c*g,j=c*h,c=c*i,l=d*h,d=d*
i,f=f*i,g=e*g,h=e*h,e=e*i;b[0]=1-(l+f);b[4]=j-e;b[8]=c+h;b[1]=j+e;b[5]=1-(a+f);b[9]=d-g;b[2]=c-h;b[6]=d+g;b[10]=1-(a+l);return this},compose:function(a,b,c){var d=this.elements,f=THREE.Matrix4.__m1,e=THREE.Matrix4.__m2;f.identity();f.setRotationFromQuaternion(b);e.makeScale(c.x,c.y,c.z);this.multiply(f,e);d[12]=a.x;d[13]=a.y;d[14]=a.z;return this},decompose:function(a,b,c){var d=this.elements,f=THREE.Matrix4.__v1,e=THREE.Matrix4.__v2,g=THREE.Matrix4.__v3;f.set(d[0],d[1],d[2]);e.set(d[4],d[5],d[6]);
g.set(d[8],d[9],d[10]);a=a instanceof THREE.Vector3?a:new THREE.Vector3;b=b instanceof THREE.Quaternion?b:new THREE.Quaternion;c=c instanceof THREE.Vector3?c:new THREE.Vector3;c.x=f.length();c.y=e.length();c.z=g.length();a.x=d[12];a.y=d[13];a.z=d[14];d=THREE.Matrix4.__m1;d.copy(this);d.elements[0]=d.elements[0]/c.x;d.elements[1]=d.elements[1]/c.x;d.elements[2]=d.elements[2]/c.x;d.elements[4]=d.elements[4]/c.y;d.elements[5]=d.elements[5]/c.y;d.elements[6]=d.elements[6]/c.y;d.elements[8]=d.elements[8]/
c.z;d.elements[9]=d.elements[9]/c.z;d.elements[10]=d.elements[10]/c.z;b.setFromRotationMatrix(d);return[a,b,c]},extractPosition:function(a){var b=this.elements,a=a.elements;b[12]=a[12];b[13]=a[13];b[14]=a[14];return this},extractRotation:function(a){var b=this.elements,a=a.elements,c=THREE.Matrix4.__v1,d=1/c.set(a[0],a[1],a[2]).length(),f=1/c.set(a[4],a[5],a[6]).length(),c=1/c.set(a[8],a[9],a[10]).length();b[0]=a[0]*d;b[1]=a[1]*d;b[2]=a[2]*d;b[4]=a[4]*f;b[5]=a[5]*f;b[6]=a[6]*f;b[8]=a[8]*c;b[9]=a[9]*
c;b[10]=a[10]*c;return this},translate:function(a){var b=this.elements,c=a.x,d=a.y,a=a.z;b[12]=b[0]*c+b[4]*d+b[8]*a+b[12];b[13]=b[1]*c+b[5]*d+b[9]*a+b[13];b[14]=b[2]*c+b[6]*d+b[10]*a+b[14];b[15]=b[3]*c+b[7]*d+b[11]*a+b[15];return this},rotateX:function(a){var b=this.elements,c=b[4],d=b[5],f=b[6],e=b[7],g=b[8],h=b[9],i=b[10],j=b[11],l=Math.cos(a),a=Math.sin(a);b[4]=l*c+a*g;b[5]=l*d+a*h;b[6]=l*f+a*i;b[7]=l*e+a*j;b[8]=l*g-a*c;b[9]=l*h-a*d;b[10]=l*i-a*f;b[11]=l*j-a*e;return this},rotateY:function(a){var b=
this.elements,c=b[0],d=b[1],f=b[2],e=b[3],g=b[8],h=b[9],i=b[10],j=b[11],l=Math.cos(a),a=Math.sin(a);b[0]=l*c-a*g;b[1]=l*d-a*h;b[2]=l*f-a*i;b[3]=l*e-a*j;b[8]=l*g+a*c;b[9]=l*h+a*d;b[10]=l*i+a*f;b[11]=l*j+a*e;return this},rotateZ:function(a){var b=this.elements,c=b[0],d=b[1],f=b[2],e=b[3],g=b[4],h=b[5],i=b[6],j=b[7],l=Math.cos(a),a=Math.sin(a);b[0]=l*c+a*g;b[1]=l*d+a*h;b[2]=l*f+a*i;b[3]=l*e+a*j;b[4]=l*g-a*c;b[5]=l*h-a*d;b[6]=l*i-a*f;b[7]=l*j-a*e;return this},rotateByAxis:function(a,b){var c=this.elements;
if(a.x===1&&a.y===0&&a.z===0)return this.rotateX(b);if(a.x===0&&a.y===1&&a.z===0)return this.rotateY(b);if(a.x===0&&a.y===0&&a.z===1)return this.rotateZ(b);var d=a.x,f=a.y,e=a.z,g=Math.sqrt(d*d+f*f+e*e),d=d/g,f=f/g,e=e/g,g=d*d,h=f*f,i=e*e,j=Math.cos(b),l=Math.sin(b),o=1-j,m=d*f*o,p=d*e*o,o=f*e*o,d=d*l,q=f*l,l=e*l,e=g+(1-g)*j,g=m+l,f=p-q,m=m-l,h=h+(1-h)*j,l=o+d,p=p+q,o=o-d,i=i+(1-i)*j,j=c[0],d=c[1],q=c[2],n=c[3],r=c[4],s=c[5],t=c[6],u=c[7],z=c[8],x=c[9],A=c[10],B=c[11];c[0]=e*j+g*r+f*z;c[1]=e*d+g*
s+f*x;c[2]=e*q+g*t+f*A;c[3]=e*n+g*u+f*B;c[4]=m*j+h*r+l*z;c[5]=m*d+h*s+l*x;c[6]=m*q+h*t+l*A;c[7]=m*n+h*u+l*B;c[8]=p*j+o*r+i*z;c[9]=p*d+o*s+i*x;c[10]=p*q+o*t+i*A;c[11]=p*n+o*u+i*B;return this},scale:function(a){var b=this.elements,c=a.x,d=a.y,a=a.z;b[0]=b[0]*c;b[4]=b[4]*d;b[8]=b[8]*a;b[1]=b[1]*c;b[5]=b[5]*d;b[9]=b[9]*a;b[2]=b[2]*c;b[6]=b[6]*d;b[10]=b[10]*a;b[3]=b[3]*c;b[7]=b[7]*d;b[11]=b[11]*a;return this},getMaxScaleOnAxis:function(){var a=this.elements;return Math.sqrt(Math.max(a[0]*a[0]+a[1]*a[1]+
a[2]*a[2],Math.max(a[4]*a[4]+a[5]*a[5]+a[6]*a[6],a[8]*a[8]+a[9]*a[9]+a[10]*a[10])))},makeTranslation:function(a,b,c){this.set(1,0,0,a,0,1,0,b,0,0,1,c,0,0,0,1);return this},makeRotationX:function(a){var b=Math.cos(a),a=Math.sin(a);this.set(1,0,0,0,0,b,-a,0,0,a,b,0,0,0,0,1);return this},makeRotationY:function(a){var b=Math.cos(a),a=Math.sin(a);this.set(b,0,a,0,0,1,0,0,-a,0,b,0,0,0,0,1);return this},makeRotationZ:function(a){var b=Math.cos(a),a=Math.sin(a);this.set(b,-a,0,0,a,b,0,0,0,0,1,0,0,0,0,1);
return this},makeRotationAxis:function(a,b){var c=Math.cos(b),d=Math.sin(b),f=1-c,e=a.x,g=a.y,h=a.z,i=f*e,j=f*g;this.set(i*e+c,i*g-d*h,i*h+d*g,0,i*g+d*h,j*g+c,j*h-d*e,0,i*h-d*g,j*h+d*e,f*h*h+c,0,0,0,0,1);return this},makeScale:function(a,b,c){this.set(a,0,0,0,0,b,0,0,0,0,c,0,0,0,0,1);return this},makeFrustum:function(a,b,c,d,f,e){var g=this.elements;g[0]=2*f/(b-a);g[4]=0;g[8]=(b+a)/(b-a);g[12]=0;g[1]=0;g[5]=2*f/(d-c);g[9]=(d+c)/(d-c);g[13]=0;g[2]=0;g[6]=0;g[10]=-(e+f)/(e-f);g[14]=-2*e*f/(e-f);g[3]=
0;g[7]=0;g[11]=-1;g[15]=0;return this},makePerspective:function(a,b,c,d){var a=c*Math.tan(a*Math.PI/360),f=-a;return this.makeFrustum(f*b,a*b,f,a,c,d)},makeOrthographic:function(a,b,c,d,f,e){var g=this.elements,h=b-a,i=c-d,j=e-f;g[0]=2/h;g[4]=0;g[8]=0;g[12]=-((b+a)/h);g[1]=0;g[5]=2/i;g[9]=0;g[13]=-((c+d)/i);g[2]=0;g[6]=0;g[10]=-2/j;g[14]=-((e+f)/j);g[3]=0;g[7]=0;g[11]=0;g[15]=1;return this},clone:function(){var a=this.elements;return new THREE.Matrix4(a[0],a[4],a[8],a[12],a[1],a[5],a[9],a[13],a[2],
a[6],a[10],a[14],a[3],a[7],a[11],a[15])}};THREE.Matrix4.__v1=new THREE.Vector3;THREE.Matrix4.__v2=new THREE.Vector3;THREE.Matrix4.__v3=new THREE.Vector3;THREE.Matrix4.__m1=new THREE.Matrix4;THREE.Matrix4.__m2=new THREE.Matrix4;
THREE.Object3D=function(){this.id=THREE.Object3DCount++;this.name="";this.properties={};this.parent=void 0;this.children=[];this.up=new THREE.Vector3(0,1,0);this.position=new THREE.Vector3;this.rotation=new THREE.Vector3;this.eulerOrder="XYZ";this.scale=new THREE.Vector3(1,1,1);this.renderDepth=null;this.rotationAutoUpdate=true;this.matrix=new THREE.Matrix4;this.matrixWorld=new THREE.Matrix4;this.matrixRotationWorld=new THREE.Matrix4;this.matrixWorldNeedsUpdate=this.matrixAutoUpdate=true;this.quaternion=
new THREE.Quaternion;this.useQuaternion=false;this.boundRadius=0;this.boundRadiusScale=1;this.visible=true;this.receiveShadow=this.castShadow=false;this.frustumCulled=true;this._vector=new THREE.Vector3};
THREE.Object3D.prototype={constructor:THREE.Object3D,applyMatrix:function(a){this.matrix.multiply(a,this.matrix);this.scale.getScaleFromMatrix(this.matrix);a=(new THREE.Matrix4).extractRotation(this.matrix);this.rotation.setEulerFromRotationMatrix(a,this.eulerOrder);this.position.getPositionFromMatrix(this.matrix)},translate:function(a,b){this.matrix.rotateAxis(b);this.position.addSelf(b.multiplyScalar(a))},translateX:function(a){this.translate(a,this._vector.set(1,0,0))},translateY:function(a){this.translate(a,
this._vector.set(0,1,0))},translateZ:function(a){this.translate(a,this._vector.set(0,0,1))},lookAt:function(a){this.matrix.lookAt(a,this.position,this.up);this.rotationAutoUpdate&&this.rotation.setEulerFromRotationMatrix(this.matrix,this.eulerOrder)},add:function(a){if(a===this)console.warn("THREE.Object3D.add: An object can't be added as a child of itself.");else if(a instanceof THREE.Object3D){a.parent!==void 0&&a.parent.remove(a);a.parent=this;this.children.push(a);for(var b=this;b.parent!==void 0;)b=
b.parent;b!==void 0&&b instanceof THREE.Scene&&b.__addObject(a)}},remove:function(a){var b=this.children.indexOf(a);if(b!==-1){a.parent=void 0;this.children.splice(b,1);for(b=this;b.parent!==void 0;)b=b.parent;b!==void 0&&b instanceof THREE.Scene&&b.__removeObject(a)}},getChildByName:function(a,b){var c,d,f;c=0;for(d=this.children.length;c<d;c++){f=this.children[c];if(f.name===a)return f;if(b){f=f.getChildByName(a,b);if(f!==void 0)return f}}},updateMatrix:function(){this.matrix.setPosition(this.position);
this.useQuaternion===true?this.matrix.setRotationFromQuaternion(this.quaternion):this.matrix.setRotationFromEuler(this.rotation,this.eulerOrder);if(this.scale.x!==1||this.scale.y!==1||this.scale.z!==1){this.matrix.scale(this.scale);this.boundRadiusScale=Math.max(this.scale.x,Math.max(this.scale.y,this.scale.z))}this.matrixWorldNeedsUpdate=true},updateMatrixWorld:function(a){this.matrixAutoUpdate===true&&this.updateMatrix();if(this.matrixWorldNeedsUpdate===true||a===true){this.parent!==void 0?this.matrixWorld.multiply(this.parent.matrixWorld,
this.matrix):this.matrixWorld.copy(this.matrix);this.matrixWorldNeedsUpdate=false;a=true}for(var b=0,c=this.children.length;b<c;b++)this.children[b].updateMatrixWorld(a)},worldToLocal:function(a){return THREE.Object3D.__m1.getInverse(this.matrixWorld).multiplyVector3(a)},localToWorld:function(a){return this.matrixWorld.multiplyVector3(a)},clone:function(){}};THREE.Object3D.__m1=new THREE.Matrix4;THREE.Object3DCount=0;
THREE.Projector=function(){function a(){var a;if(e===g.length){a=new THREE.RenderableObject;g.push(a)}else a=g[e];e++;return a}function b(){var a;if(i===j.length){a=new THREE.RenderableVertex;j.push(a)}else a=j[i];i++;return a}function c(a,b){return b.z-a.z}function d(a,b){var c=0,d=1,f=a.z+a.w,e=b.z+b.w,g=-a.z+a.w,h=-b.z+b.w;if(f>=0&&e>=0&&g>=0&&h>=0)return true;if(f<0&&e<0||g<0&&h<0)return false;f<0?c=Math.max(c,f/(f-e)):e<0&&(d=Math.min(d,f/(f-e)));g<0?c=Math.max(c,g/(g-h)):h<0&&(d=Math.min(d,
g/(g-h)));if(d<c)return false;a.lerpSelf(b,c);b.lerpSelf(a,1-d);return true}var f,e,g=[],h,i,j=[],l,o,m=[],p,q=[],n,r,s=[],t,u,z=[],x={objects:[],sprites:[],lights:[],elements:[]},A=new THREE.Vector3,B=new THREE.Vector4,C=new THREE.Matrix4,v=new THREE.Matrix4,J=new THREE.Frustum,F=new THREE.Vector4,O=new THREE.Vector4;this.projectVector=function(a,b){b.matrixWorldInverse.getInverse(b.matrixWorld);C.multiply(b.projectionMatrix,b.matrixWorldInverse);C.multiplyVector3(a);return a};this.unprojectVector=
function(a,b){b.projectionMatrixInverse.getInverse(b.projectionMatrix);C.multiply(b.matrixWorld,b.projectionMatrixInverse);C.multiplyVector3(a);return a};this.pickingRay=function(a,b){var c;a.z=-1;c=new THREE.Vector3(a.x,a.y,1);this.unprojectVector(a,b);this.unprojectVector(c,b);c.subSelf(a).normalize();return new THREE.Ray(a,c)};this.projectScene=function(g,G,E){var I=G.near,R=G.far,M=false,H,V,Q,L,W,ha,ia,da,Z,ba,$,ca,ma,sa,bb,qa,Ia;u=r=p=o=0;x.elements.length=0;g.updateMatrixWorld();G.parent===
void 0&&G.updateMatrixWorld();G.matrixWorldInverse.getInverse(G.matrixWorld);C.multiply(G.projectionMatrix,G.matrixWorldInverse);J.setFromMatrix(C);e=0;x.objects.length=0;x.sprites.length=0;x.lights.length=0;var Sa=function(b){if(b.visible!==false){if((b instanceof THREE.Mesh||b instanceof THREE.Line)&&(b.frustumCulled===false||J.contains(b)===true)){A.copy(b.matrixWorld.getPosition());C.multiplyVector3(A);f=a();f.object=b;f.z=A.z;x.objects.push(f)}else if(b instanceof THREE.Sprite||b instanceof THREE.Particle){A.copy(b.matrixWorld.getPosition());
C.multiplyVector3(A);f=a();f.object=b;f.z=A.z;x.sprites.push(f)}else b instanceof THREE.Light&&x.lights.push(b);for(var c=0,d=b.children.length;c<d;c++)Sa(b.children[c])}};Sa(g);g=0;for(H=x.objects.length;g<H;g++){Z=x.objects[g].object;ba=Z.matrixWorld;i=0;if(Z instanceof THREE.Mesh){$=Z.geometry;ca=Z.geometry.materials;L=$.vertices;ma=$.faces;bb=$.faceVertexUvs;$=Z.matrixRotationWorld.extractRotation(ba);Ia=Z.material instanceof THREE.MeshFaceMaterial;V=0;for(Q=L.length;V<Q;V++){h=b();h.positionWorld.copy(L[V]);
ba.multiplyVector3(h.positionWorld);h.positionScreen.copy(h.positionWorld);C.multiplyVector4(h.positionScreen);h.positionScreen.x=h.positionScreen.x/h.positionScreen.w;h.positionScreen.y=h.positionScreen.y/h.positionScreen.w;h.visible=h.positionScreen.z>I&&h.positionScreen.z<R}L=0;for(V=ma.length;L<V;L++){da=ma[L];Q=Ia===true?ca[da.materialIndex]:Z.material;if(Q!==void 0){ia=Q.side;if(da instanceof THREE.Face3){W=j[da.a];ha=j[da.b];sa=j[da.c];if(W.visible===true&&ha.visible===true&&sa.visible===true){M=
(sa.positionScreen.x-W.positionScreen.x)*(ha.positionScreen.y-W.positionScreen.y)-(sa.positionScreen.y-W.positionScreen.y)*(ha.positionScreen.x-W.positionScreen.x)<0;if(ia===THREE.DoubleSide||M===(ia===THREE.FrontSide)){qa=void 0;if(o===m.length){qa=new THREE.RenderableFace3;m.push(qa)}else qa=m[o];o++;l=qa;l.v1.copy(W);l.v2.copy(ha);l.v3.copy(sa)}else continue}else continue}else if(da instanceof THREE.Face4){W=j[da.a];ha=j[da.b];sa=j[da.c];qa=j[da.d];if(W.visible===true&&ha.visible===true&&sa.visible===
true&&qa.visible===true){M=(qa.positionScreen.x-W.positionScreen.x)*(ha.positionScreen.y-W.positionScreen.y)-(qa.positionScreen.y-W.positionScreen.y)*(ha.positionScreen.x-W.positionScreen.x)<0||(ha.positionScreen.x-sa.positionScreen.x)*(qa.positionScreen.y-sa.positionScreen.y)-(ha.positionScreen.y-sa.positionScreen.y)*(qa.positionScreen.x-sa.positionScreen.x)<0;if(ia===THREE.DoubleSide||M===(ia===THREE.FrontSide)){var Va=void 0;if(p===q.length){Va=new THREE.RenderableFace4;q.push(Va)}else Va=q[p];
p++;l=Va;l.v1.copy(W);l.v2.copy(ha);l.v3.copy(sa);l.v4.copy(qa)}else continue}else continue}l.normalWorld.copy(da.normal);M===false&&(ia===THREE.BackSide||ia===THREE.DoubleSide)&&l.normalWorld.negate();$.multiplyVector3(l.normalWorld);l.centroidWorld.copy(da.centroid);ba.multiplyVector3(l.centroidWorld);l.centroidScreen.copy(l.centroidWorld);C.multiplyVector3(l.centroidScreen);da=da.vertexNormals;W=0;for(ha=da.length;W<ha;W++){sa=l.vertexNormalsWorld[W];sa.copy(da[W]);M===false&&(ia===THREE.BackSide||
ia===THREE.DoubleSide)&&sa.negate();$.multiplyVector3(sa)}W=0;for(ha=bb.length;W<ha;W++){sa=bb[W][L];if(sa!==void 0){ia=0;for(da=sa.length;ia<da;ia++)l.uvs[W][ia]=sa[ia]}}l.material=Q;l.z=l.centroidScreen.z;x.elements.push(l)}}}else if(Z instanceof THREE.Line){v.multiply(C,ba);L=Z.geometry.vertices;W=b();W.positionScreen.copy(L[0]);v.multiplyVector4(W.positionScreen);ba=Z.type===THREE.LinePieces?2:1;V=1;for(Q=L.length;V<Q;V++){W=b();W.positionScreen.copy(L[V]);v.multiplyVector4(W.positionScreen);
if(!((V+1)%ba>0)){ha=j[i-2];F.copy(W.positionScreen);O.copy(ha.positionScreen);if(d(F,O)===true){F.multiplyScalar(1/F.w);O.multiplyScalar(1/O.w);ca=void 0;if(r===s.length){ca=new THREE.RenderableLine;s.push(ca)}else ca=s[r];r++;n=ca;n.v1.positionScreen.copy(F);n.v2.positionScreen.copy(O);n.z=Math.max(F.z,O.z);n.material=Z.material;x.elements.push(n)}}}}}g=0;for(H=x.sprites.length;g<H;g++){Z=x.sprites[g].object;ba=Z.matrixWorld;if(Z instanceof THREE.Particle){B.set(ba.elements[12],ba.elements[13],
ba.elements[14],1);C.multiplyVector4(B);B.z=B.z/B.w;if(B.z>0&&B.z<1){I=void 0;if(u===z.length){I=new THREE.RenderableParticle;z.push(I)}else I=z[u];u++;t=I;t.object=Z;t.x=B.x/B.w;t.y=B.y/B.w;t.z=B.z;t.rotation=Z.rotation.z;t.scale.x=Z.scale.x*Math.abs(t.x-(B.x+G.projectionMatrix.elements[0])/(B.w+G.projectionMatrix.elements[12]));t.scale.y=Z.scale.y*Math.abs(t.y-(B.y+G.projectionMatrix.elements[5])/(B.w+G.projectionMatrix.elements[13]));t.material=Z.material;x.elements.push(t)}}}E&&x.elements.sort(c);
return x}};THREE.Quaternion=function(a,b,c,d){this.x=a||0;this.y=b||0;this.z=c||0;this.w=d!==void 0?d:1};
THREE.Quaternion.prototype={constructor:THREE.Quaternion,set:function(a,b,c,d){this.x=a;this.y=b;this.z=c;this.w=d;return this},copy:function(a){this.x=a.x;this.y=a.y;this.z=a.z;this.w=a.w;return this},setFromEuler:function(a,b){var c=Math.cos(a.x/2),d=Math.cos(a.y/2),f=Math.cos(a.z/2),e=Math.sin(a.x/2),g=Math.sin(a.y/2),h=Math.sin(a.z/2);if(b===void 0||b==="XYZ"){this.x=e*d*f+c*g*h;this.y=c*g*f-e*d*h;this.z=c*d*h+e*g*f;this.w=c*d*f-e*g*h}else if(b==="YXZ"){this.x=e*d*f+c*g*h;this.y=c*g*f-e*d*h;this.z=
c*d*h-e*g*f;this.w=c*d*f+e*g*h}else if(b==="ZXY"){this.x=e*d*f-c*g*h;this.y=c*g*f+e*d*h;this.z=c*d*h+e*g*f;this.w=c*d*f-e*g*h}else if(b==="ZYX"){this.x=e*d*f-c*g*h;this.y=c*g*f+e*d*h;this.z=c*d*h-e*g*f;this.w=c*d*f+e*g*h}else if(b==="YZX"){this.x=e*d*f+c*g*h;this.y=c*g*f+e*d*h;this.z=c*d*h-e*g*f;this.w=c*d*f-e*g*h}else if(b==="XZY"){this.x=e*d*f-c*g*h;this.y=c*g*f-e*d*h;this.z=c*d*h+e*g*f;this.w=c*d*f+e*g*h}return this},setFromAxisAngle:function(a,b){var c=b/2,d=Math.sin(c);this.x=a.x*d;this.y=a.y*
d;this.z=a.z*d;this.w=Math.cos(c);return this},setFromRotationMatrix:function(a){var b=a.elements,c=b[0],a=b[4],d=b[8],f=b[1],e=b[5],g=b[9],h=b[2],i=b[6],b=b[10],j=c+e+b;if(j>0){c=0.5/Math.sqrt(j+1);this.w=0.25/c;this.x=(i-g)*c;this.y=(d-h)*c;this.z=(f-a)*c}else if(c>e&&c>b){c=2*Math.sqrt(1+c-e-b);this.w=(i-g)/c;this.x=0.25*c;this.y=(a+f)/c;this.z=(d+h)/c}else if(e>b){c=2*Math.sqrt(1+e-c-b);this.w=(d-h)/c;this.x=(a+f)/c;this.y=0.25*c;this.z=(g+i)/c}else{c=2*Math.sqrt(1+b-c-e);this.w=(f-a)/c;this.x=
(d+h)/c;this.y=(g+i)/c;this.z=0.25*c}return this},calculateW:function(){this.w=-Math.sqrt(Math.abs(1-this.x*this.x-this.y*this.y-this.z*this.z));return this},inverse:function(){this.x=this.x*-1;this.y=this.y*-1;this.z=this.z*-1;return this},length:function(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)},normalize:function(){var a=Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w);if(a===0)this.w=this.z=this.y=this.x=0;else{a=1/a;this.x=this.x*a;this.y=
this.y*a;this.z=this.z*a;this.w=this.w*a}return this},multiply:function(a,b){var c=a.x,d=a.y,f=a.z,e=a.w,g=b.x,h=b.y,i=b.z,j=b.w;this.x=c*j+d*i-f*h+e*g;this.y=-c*i+d*j+f*g+e*h;this.z=c*h-d*g+f*j+e*i;this.w=-c*g-d*h-f*i+e*j;return this},multiplySelf:function(a){var b=this.x,c=this.y,d=this.z,f=this.w,e=a.x,g=a.y,h=a.z,a=a.w;this.x=b*a+f*e+c*h-d*g;this.y=c*a+f*g+d*e-b*h;this.z=d*a+f*h+b*g-c*e;this.w=f*a-b*e-c*g-d*h;return this},multiplyVector3:function(a,b){b||(b=a);var c=a.x,d=a.y,f=a.z,e=this.x,g=
this.y,h=this.z,i=this.w,j=i*c+g*f-h*d,l=i*d+h*c-e*f,o=i*f+e*d-g*c,c=-e*c-g*d-h*f;b.x=j*i+c*-e+l*-h-o*-g;b.y=l*i+c*-g+o*-e-j*-h;b.z=o*i+c*-h+j*-g-l*-e;return b},slerpSelf:function(a,b){var c=this.x,d=this.y,f=this.z,e=this.w,g=e*a.w+c*a.x+d*a.y+f*a.z;if(g<0){this.w=-a.w;this.x=-a.x;this.y=-a.y;this.z=-a.z;g=-g}else this.copy(a);if(g>=1){this.w=e;this.x=c;this.y=d;this.z=f;return this}var h=Math.acos(g),i=Math.sqrt(1-g*g);if(Math.abs(i)<0.001){this.w=0.5*(e+this.w);this.x=0.5*(c+this.x);this.y=0.5*
(d+this.y);this.z=0.5*(f+this.z);return this}g=Math.sin((1-b)*h)/i;h=Math.sin(b*h)/i;this.w=e*g+this.w*h;this.x=c*g+this.x*h;this.y=d*g+this.y*h;this.z=f*g+this.z*h;return this},clone:function(){return new THREE.Quaternion(this.x,this.y,this.z,this.w)}};
THREE.Quaternion.slerp=function(a,b,c,d){var f=a.w*b.w+a.x*b.x+a.y*b.y+a.z*b.z;if(f<0){c.w=-b.w;c.x=-b.x;c.y=-b.y;c.z=-b.z;f=-f}else c.copy(b);if(Math.abs(f)>=1){c.w=a.w;c.x=a.x;c.y=a.y;c.z=a.z;return c}var b=Math.acos(f),e=Math.sqrt(1-f*f);if(Math.abs(e)<0.001){c.w=0.5*(a.w+c.w);c.x=0.5*(a.x+c.x);c.y=0.5*(a.y+c.y);c.z=0.5*(a.z+c.z);return c}f=Math.sin((1-d)*b)/e;d=Math.sin(d*b)/e;c.w=a.w*f+c.w*d;c.x=a.x*f+c.x*d;c.y=a.y*f+c.y*d;c.z=a.z*f+c.z*d;return c};
THREE.Vertex=function(a){console.warn("THREE.Vertex has been DEPRECATED. Use THREE.Vector3 instead.");return a};THREE.Face3=function(a,b,c,d,f,e){this.a=a;this.b=b;this.c=c;this.normal=d instanceof THREE.Vector3?d:new THREE.Vector3;this.vertexNormals=d instanceof Array?d:[];this.color=f instanceof THREE.Color?f:new THREE.Color;this.vertexColors=f instanceof Array?f:[];this.vertexTangents=[];this.materialIndex=e;this.centroid=new THREE.Vector3};
THREE.Face3.prototype={constructor:THREE.Face3,clone:function(){var a=new THREE.Face3(this.a,this.b,this.c);a.normal.copy(this.normal);a.color.copy(this.color);a.centroid.copy(this.centroid);a.materialIndex=this.materialIndex;var b,c;b=0;for(c=this.vertexNormals.length;b<c;b++)a.vertexNormals[b]=this.vertexNormals[b].clone();b=0;for(c=this.vertexColors.length;b<c;b++)a.vertexColors[b]=this.vertexColors[b].clone();b=0;for(c=this.vertexTangents.length;b<c;b++)a.vertexTangents[b]=this.vertexTangents[b].clone();
return a}};THREE.Face4=function(a,b,c,d,f,e,g){this.a=a;this.b=b;this.c=c;this.d=d;this.normal=f instanceof THREE.Vector3?f:new THREE.Vector3;this.vertexNormals=f instanceof Array?f:[];this.color=e instanceof THREE.Color?e:new THREE.Color;this.vertexColors=e instanceof Array?e:[];this.vertexTangents=[];this.materialIndex=g;this.centroid=new THREE.Vector3};
THREE.Face4.prototype={constructor:THREE.Face4,clone:function(){var a=new THREE.Face4(this.a,this.b,this.c,this.d);a.normal.copy(this.normal);a.color.copy(this.color);a.centroid.copy(this.centroid);a.materialIndex=this.materialIndex;var b,c;b=0;for(c=this.vertexNormals.length;b<c;b++)a.vertexNormals[b]=this.vertexNormals[b].clone();b=0;for(c=this.vertexColors.length;b<c;b++)a.vertexColors[b]=this.vertexColors[b].clone();b=0;for(c=this.vertexTangents.length;b<c;b++)a.vertexTangents[b]=this.vertexTangents[b].clone();
return a}};THREE.UV=function(a,b){this.u=a||0;this.v=b||0};THREE.UV.prototype={constructor:THREE.UV,set:function(a,b){this.u=a;this.v=b;return this},copy:function(a){this.u=a.u;this.v=a.v;return this},lerpSelf:function(a,b){this.u=this.u+(a.u-this.u)*b;this.v=this.v+(a.v-this.v)*b;return this},clone:function(){return new THREE.UV(this.u,this.v)}};
THREE.Geometry=function(){this.id=THREE.GeometryCount++;this.name="";this.vertices=[];this.colors=[];this.materials=[];this.faces=[];this.faceUvs=[[]];this.faceVertexUvs=[[]];this.morphTargets=[];this.morphColors=[];this.morphNormals=[];this.skinWeights=[];this.skinIndices=[];this.boundingSphere=this.boundingBox=null;this.hasTangents=false;this.dynamic=true};
THREE.Geometry.prototype={constructor:THREE.Geometry,applyMatrix:function(a){var b=new THREE.Matrix4;b.extractRotation(a);for(var c=0,d=this.vertices.length;c<d;c++)a.multiplyVector3(this.vertices[c]);c=0;for(d=this.faces.length;c<d;c++){var f=this.faces[c];b.multiplyVector3(f.normal);for(var e=0,g=f.vertexNormals.length;e<g;e++)b.multiplyVector3(f.vertexNormals[e]);a.multiplyVector3(f.centroid)}},computeCentroids:function(){var a,b,c;a=0;for(b=this.faces.length;a<b;a++){c=this.faces[a];c.centroid.set(0,
0,0);if(c instanceof THREE.Face3){c.centroid.addSelf(this.vertices[c.a]);c.centroid.addSelf(this.vertices[c.b]);c.centroid.addSelf(this.vertices[c.c]);c.centroid.divideScalar(3)}else if(c instanceof THREE.Face4){c.centroid.addSelf(this.vertices[c.a]);c.centroid.addSelf(this.vertices[c.b]);c.centroid.addSelf(this.vertices[c.c]);c.centroid.addSelf(this.vertices[c.d]);c.centroid.divideScalar(4)}}},computeFaceNormals:function(){var a,b,c,d,f,e,g=new THREE.Vector3,h=new THREE.Vector3;a=0;for(b=this.faces.length;a<
b;a++){c=this.faces[a];d=this.vertices[c.a];f=this.vertices[c.b];e=this.vertices[c.c];g.sub(e,f);h.sub(d,f);g.crossSelf(h);g.isZero()||g.normalize();c.normal.copy(g)}},computeVertexNormals:function(){var a,b,c,d;if(this.__tmpVertices===void 0){d=this.__tmpVertices=Array(this.vertices.length);a=0;for(b=this.vertices.length;a<b;a++)d[a]=new THREE.Vector3;a=0;for(b=this.faces.length;a<b;a++){c=this.faces[a];if(c instanceof THREE.Face3)c.vertexNormals=[new THREE.Vector3,new THREE.Vector3,new THREE.Vector3];
else if(c instanceof THREE.Face4)c.vertexNormals=[new THREE.Vector3,new THREE.Vector3,new THREE.Vector3,new THREE.Vector3]}}else{d=this.__tmpVertices;a=0;for(b=this.vertices.length;a<b;a++)d[a].set(0,0,0)}a=0;for(b=this.faces.length;a<b;a++){c=this.faces[a];if(c instanceof THREE.Face3){d[c.a].addSelf(c.normal);d[c.b].addSelf(c.normal);d[c.c].addSelf(c.normal)}else if(c instanceof THREE.Face4){d[c.a].addSelf(c.normal);d[c.b].addSelf(c.normal);d[c.c].addSelf(c.normal);d[c.d].addSelf(c.normal)}}a=0;
for(b=this.vertices.length;a<b;a++)d[a].normalize();a=0;for(b=this.faces.length;a<b;a++){c=this.faces[a];if(c instanceof THREE.Face3){c.vertexNormals[0].copy(d[c.a]);c.vertexNormals[1].copy(d[c.b]);c.vertexNormals[2].copy(d[c.c])}else if(c instanceof THREE.Face4){c.vertexNormals[0].copy(d[c.a]);c.vertexNormals[1].copy(d[c.b]);c.vertexNormals[2].copy(d[c.c]);c.vertexNormals[3].copy(d[c.d])}}},computeMorphNormals:function(){var a,b,c,d,f;c=0;for(d=this.faces.length;c<d;c++){f=this.faces[c];f.__originalFaceNormal?
f.__originalFaceNormal.copy(f.normal):f.__originalFaceNormal=f.normal.clone();if(!f.__originalVertexNormals)f.__originalVertexNormals=[];a=0;for(b=f.vertexNormals.length;a<b;a++)f.__originalVertexNormals[a]?f.__originalVertexNormals[a].copy(f.vertexNormals[a]):f.__originalVertexNormals[a]=f.vertexNormals[a].clone()}var e=new THREE.Geometry;e.faces=this.faces;a=0;for(b=this.morphTargets.length;a<b;a++){if(!this.morphNormals[a]){this.morphNormals[a]={};this.morphNormals[a].faceNormals=[];this.morphNormals[a].vertexNormals=
[];var g=this.morphNormals[a].faceNormals,h=this.morphNormals[a].vertexNormals,i,j;c=0;for(d=this.faces.length;c<d;c++){f=this.faces[c];i=new THREE.Vector3;j=f instanceof THREE.Face3?{a:new THREE.Vector3,b:new THREE.Vector3,c:new THREE.Vector3}:{a:new THREE.Vector3,b:new THREE.Vector3,c:new THREE.Vector3,d:new THREE.Vector3};g.push(i);h.push(j)}}g=this.morphNormals[a];e.vertices=this.morphTargets[a].vertices;e.computeFaceNormals();e.computeVertexNormals();c=0;for(d=this.faces.length;c<d;c++){f=this.faces[c];
i=g.faceNormals[c];j=g.vertexNormals[c];i.copy(f.normal);if(f instanceof THREE.Face3){j.a.copy(f.vertexNormals[0]);j.b.copy(f.vertexNormals[1]);j.c.copy(f.vertexNormals[2])}else{j.a.copy(f.vertexNormals[0]);j.b.copy(f.vertexNormals[1]);j.c.copy(f.vertexNormals[2]);j.d.copy(f.vertexNormals[3])}}}c=0;for(d=this.faces.length;c<d;c++){f=this.faces[c];f.normal=f.__originalFaceNormal;f.vertexNormals=f.__originalVertexNormals}},computeTangents:function(){function a(a,b,c,d,f,e,C){h=a.vertices[b];i=a.vertices[c];
j=a.vertices[d];l=g[f];o=g[e];m=g[C];p=i.x-h.x;q=j.x-h.x;n=i.y-h.y;r=j.y-h.y;s=i.z-h.z;t=j.z-h.z;u=o.u-l.u;z=m.u-l.u;x=o.v-l.v;A=m.v-l.v;B=1/(u*A-z*x);F.set((A*p-x*q)*B,(A*n-x*r)*B,(A*s-x*t)*B);O.set((u*q-z*p)*B,(u*r-z*n)*B,(u*t-z*s)*B);v[b].addSelf(F);v[c].addSelf(F);v[d].addSelf(F);J[b].addSelf(O);J[c].addSelf(O);J[d].addSelf(O)}var b,c,d,f,e,g,h,i,j,l,o,m,p,q,n,r,s,t,u,z,x,A,B,C,v=[],J=[],F=new THREE.Vector3,O=new THREE.Vector3,P=new THREE.Vector3,G=new THREE.Vector3,E=new THREE.Vector3;b=0;for(c=
this.vertices.length;b<c;b++){v[b]=new THREE.Vector3;J[b]=new THREE.Vector3}b=0;for(c=this.faces.length;b<c;b++){e=this.faces[b];g=this.faceVertexUvs[0][b];if(e instanceof THREE.Face3)a(this,e.a,e.b,e.c,0,1,2);else if(e instanceof THREE.Face4){a(this,e.a,e.b,e.d,0,1,3);a(this,e.b,e.c,e.d,1,2,3)}}var I=["a","b","c","d"];b=0;for(c=this.faces.length;b<c;b++){e=this.faces[b];for(d=0;d<e.vertexNormals.length;d++){E.copy(e.vertexNormals[d]);f=e[I[d]];C=v[f];P.copy(C);P.subSelf(E.multiplyScalar(E.dot(C))).normalize();
G.cross(e.vertexNormals[d],C);f=G.dot(J[f]);f=f<0?-1:1;e.vertexTangents[d]=new THREE.Vector4(P.x,P.y,P.z,f)}}this.hasTangents=true},computeBoundingBox:function(){if(!this.boundingBox)this.boundingBox={min:new THREE.Vector3,max:new THREE.Vector3};if(this.vertices.length>0){var a;a=this.vertices[0];this.boundingBox.min.copy(a);this.boundingBox.max.copy(a);for(var b=this.boundingBox.min,c=this.boundingBox.max,d=1,f=this.vertices.length;d<f;d++){a=this.vertices[d];if(a.x<b.x)b.x=a.x;else if(a.x>c.x)c.x=
a.x;if(a.y<b.y)b.y=a.y;else if(a.y>c.y)c.y=a.y;if(a.z<b.z)b.z=a.z;else if(a.z>c.z)c.z=a.z}}else{this.boundingBox.min.set(0,0,0);this.boundingBox.max.set(0,0,0)}},computeBoundingSphere:function(){var a=0;if(this.boundingSphere===null)this.boundingSphere={radius:0};for(var b=0,c=this.vertices.length;b<c;b++){var d=this.vertices[b].lengthSq();d>a&&(a=d)}this.boundingSphere.radius=Math.sqrt(a)},mergeVertices:function(){var a={},b=[],c=[],d,f=Math.pow(10,4),e,g,h,i;e=0;for(g=this.vertices.length;e<g;e++){d=
this.vertices[e];d=[Math.round(d.x*f),Math.round(d.y*f),Math.round(d.z*f)].join("_");if(a[d]===void 0){a[d]=e;b.push(this.vertices[e]);c[e]=b.length-1}else c[e]=c[a[d]]}e=0;for(g=this.faces.length;e<g;e++){a=this.faces[e];if(a instanceof THREE.Face3){a.a=c[a.a];a.b=c[a.b];a.c=c[a.c]}else if(a instanceof THREE.Face4){a.a=c[a.a];a.b=c[a.b];a.c=c[a.c];a.d=c[a.d];d=[a.a,a.b,a.c,a.d];for(f=3;f>0;f--)if(d.indexOf(a["abcd"[f]])!==f){d.splice(f,1);this.faces[e]=new THREE.Face3(d[0],d[1],d[2],a.normal,a.color,
a.materialIndex);d=0;for(h=this.faceVertexUvs.length;d<h;d++)(i=this.faceVertexUvs[d][e])&&i.splice(f,1);this.faces[e].vertexColors=a.vertexColors;break}}}c=this.vertices.length-b.length;this.vertices=b;return c},clone:function(){}};THREE.GeometryCount=0;THREE.BufferGeometry=function(){this.id=THREE.GeometryCount++;this.attributes={};this.dynamic=false;this.boundingSphere=this.boundingBox=null;this.hasTangents=false;this.morphTargets=[]};
THREE.BufferGeometry.prototype={constructor:THREE.BufferGeometry,applyMatrix:function(a){var b,c;if(this.attributes.position)b=this.attributes.position.array;if(this.attributes.normal)c=this.attributes.normal.array;if(b!==void 0){a.multiplyVector3Array(b);this.verticesNeedUpdate=true}if(c!==void 0){b=new THREE.Matrix4;b.extractRotation(a);b.multiplyVector3Array(c);this.normalsNeedUpdate=true}},computeBoundingBox:function(){if(!this.boundingBox)this.boundingBox={min:new THREE.Vector3(Infinity,Infinity,
Infinity),max:new THREE.Vector3(-Infinity,-Infinity,-Infinity)};var a=this.attributes.position.array;if(a)for(var b=this.boundingBox,c,d,f,e=0,g=a.length;e<g;e=e+3){c=a[e];d=a[e+1];f=a[e+2];if(c<b.min.x)b.min.x=c;else if(c>b.max.x)b.max.x=c;if(d<b.min.y)b.min.y=d;else if(d>b.max.y)b.max.y=d;if(f<b.min.z)b.min.z=f;else if(f>b.max.z)b.max.z=f}if(a===void 0||a.length===0){this.boundingBox.min.set(0,0,0);this.boundingBox.max.set(0,0,0)}},computeBoundingSphere:function(){if(!this.boundingSphere)this.boundingSphere=
{radius:0};var a=this.attributes.position.array;if(a){for(var b,c=0,d,f,e=0,g=a.length;e<g;e=e+3){b=a[e];d=a[e+1];f=a[e+2];b=b*b+d*d+f*f;b>c&&(c=b)}this.boundingSphere.radius=Math.sqrt(c)}},computeVertexNormals:function(){if(this.attributes.position&&this.attributes.index){var a,b,c,d;a=this.attributes.position.array.length;if(this.attributes.normal===void 0)this.attributes.normal={itemSize:3,array:new Float32Array(a),numItems:a};else{a=0;for(b=this.attributes.normal.array.length;a<b;a++)this.attributes.normal.array[a]=
0}var f=this.offsets,e=this.attributes.index.array,g=this.attributes.position.array,h=this.attributes.normal.array,i,j,l,o,m,p,q=new THREE.Vector3,n=new THREE.Vector3,r=new THREE.Vector3,s=new THREE.Vector3,t=new THREE.Vector3;c=0;for(d=f.length;c<d;++c){b=f[c].start;i=f[c].count;var u=f[c].index;a=b;for(b=b+i;a<b;a=a+3){i=u+e[a];j=u+e[a+1];l=u+e[a+2];o=g[i*3];m=g[i*3+1];p=g[i*3+2];q.set(o,m,p);o=g[j*3];m=g[j*3+1];p=g[j*3+2];n.set(o,m,p);o=g[l*3];m=g[l*3+1];p=g[l*3+2];r.set(o,m,p);s.sub(r,n);t.sub(q,
n);s.crossSelf(t);h[i*3]=h[i*3]+s.x;h[i*3+1]=h[i*3+1]+s.y;h[i*3+2]=h[i*3+2]+s.z;h[j*3]=h[j*3]+s.x;h[j*3+1]=h[j*3+1]+s.y;h[j*3+2]=h[j*3+2]+s.z;h[l*3]=h[l*3]+s.x;h[l*3+1]=h[l*3+1]+s.y;h[l*3+2]=h[l*3+2]+s.z}}a=0;for(b=h.length;a<b;a=a+3){o=h[a];m=h[a+1];p=h[a+2];c=1/Math.sqrt(o*o+m*m+p*p);h[a]=h[a]*c;h[a+1]=h[a+1]*c;h[a+2]=h[a+2]*c}this.normalsNeedUpdate=true}},computeTangents:function(){function a(a){V.x=d[a*3];V.y=d[a*3+1];V.z=d[a*3+2];Q.copy(V);W=i[a];M.copy(W);M.subSelf(V.multiplyScalar(V.dot(W))).normalize();
H.cross(Q,W);ha=H.dot(j[a]);L=ha<0?-1:1;h[a*4]=M.x;h[a*4+1]=M.y;h[a*4+2]=M.z;h[a*4+3]=L}if(this.attributes.index===void 0||this.attributes.position===void 0||this.attributes.normal===void 0||this.attributes.uv===void 0)console.warn("Missing required attributes (index, position, normal or uv) in BufferGeometry.computeTangents()");else{var b=this.attributes.index.array,c=this.attributes.position.array,d=this.attributes.normal.array,f=this.attributes.uv.array,e=c.length/3;if(this.attributes.tangent===
void 0){var g=4*e;this.attributes.tangent={itemSize:4,array:new Float32Array(g),numItems:g}}for(var h=this.attributes.tangent.array,i=[],j=[],g=0;g<e;g++){i[g]=new THREE.Vector3;j[g]=new THREE.Vector3}var l,o,m,p,q,n,r,s,t,u,z,x,A,B,C,e=new THREE.Vector3,g=new THREE.Vector3,v,J,F,O,P,G,E,I=this.offsets;F=0;for(O=I.length;F<O;++F){J=I[F].start;P=I[F].count;var R=I[F].index;v=J;for(J=J+P;v<J;v=v+3){P=R+b[v];G=R+b[v+1];E=R+b[v+2];l=c[P*3];o=c[P*3+1];m=c[P*3+2];p=c[G*3];q=c[G*3+1];n=c[G*3+2];r=c[E*3];
s=c[E*3+1];t=c[E*3+2];u=f[P*2];z=f[P*2+1];x=f[G*2];A=f[G*2+1];B=f[E*2];C=f[E*2+1];p=p-l;l=r-l;q=q-o;o=s-o;n=n-m;m=t-m;x=x-u;u=B-u;A=A-z;z=C-z;C=1/(x*z-u*A);e.set((z*p-A*l)*C,(z*q-A*o)*C,(z*n-A*m)*C);g.set((x*l-u*p)*C,(x*o-u*q)*C,(x*m-u*n)*C);i[P].addSelf(e);i[G].addSelf(e);i[E].addSelf(e);j[P].addSelf(g);j[G].addSelf(g);j[E].addSelf(g)}}var M=new THREE.Vector3,H=new THREE.Vector3,V=new THREE.Vector3,Q=new THREE.Vector3,L,W,ha;F=0;for(O=I.length;F<O;++F){J=I[F].start;P=I[F].count;R=I[F].index;v=J;
for(J=J+P;v<J;v=v+3){P=R+b[v];G=R+b[v+1];E=R+b[v+2];a(P);a(G);a(E)}}this.tangentsNeedUpdate=this.hasTangents=true}}};
THREE.Spline=function(a){function b(a,b,c,d,f,e,g){a=(c-a)*0.5;d=(d-b)*0.5;return(2*(b-c)+a+d)*g+(-3*(b-c)-2*a-d)*e+a*f+b}this.points=a;var c=[],d={x:0,y:0,z:0},f,e,g,h,i,j,l,o,m;this.initFromArray=function(a){this.points=[];for(var b=0;b<a.length;b++)this.points[b]={x:a[b][0],y:a[b][1],z:a[b][2]}};this.getPoint=function(a){f=(this.points.length-1)*a;e=Math.floor(f);g=f-e;c[0]=e===0?e:e-1;c[1]=e;c[2]=e>this.points.length-2?this.points.length-1:e+1;c[3]=e>this.points.length-3?this.points.length-1:
e+2;j=this.points[c[0]];l=this.points[c[1]];o=this.points[c[2]];m=this.points[c[3]];h=g*g;i=g*h;d.x=b(j.x,l.x,o.x,m.x,g,h,i);d.y=b(j.y,l.y,o.y,m.y,g,h,i);d.z=b(j.z,l.z,o.z,m.z,g,h,i);return d};this.getControlPointsArray=function(){var a,b,c=this.points.length,d=[];for(a=0;a<c;a++){b=this.points[a];d[a]=[b.x,b.y,b.z]}return d};this.getLength=function(a){var b,c,d,f=b=b=0,e=new THREE.Vector3,g=new THREE.Vector3,h=[],i=0;h[0]=0;a||(a=100);c=this.points.length*a;e.copy(this.points[0]);for(a=1;a<c;a++){b=
a/c;d=this.getPoint(b);g.copy(d);i=i+g.distanceTo(e);e.copy(d);b=(this.points.length-1)*b;b=Math.floor(b);if(b!=f){h[b]=i;f=b}}h[h.length]=i;return{chunks:h,total:i}};this.reparametrizeByArcLength=function(a){var b,c,d,f,e,g,h=[],i=new THREE.Vector3,l=this.getLength();h.push(i.copy(this.points[0]).clone());for(b=1;b<this.points.length;b++){c=l.chunks[b]-l.chunks[b-1];g=Math.ceil(a*c/l.total);f=(b-1)/(this.points.length-1);e=b/(this.points.length-1);for(c=1;c<g-1;c++){d=f+c*(1/g)*(e-f);d=this.getPoint(d);
h.push(i.copy(d).clone())}h.push(i.copy(this.points[b]).clone())}this.points=h}};THREE.Camera=function(){THREE.Object3D.call(this);this.matrixWorldInverse=new THREE.Matrix4;this.projectionMatrix=new THREE.Matrix4;this.projectionMatrixInverse=new THREE.Matrix4};THREE.Camera.prototype=Object.create(THREE.Object3D.prototype);THREE.Camera.prototype.lookAt=function(a){this.matrix.lookAt(this.position,a,this.up);this.rotationAutoUpdate===true&&this.rotation.setEulerFromRotationMatrix(this.matrix,this.eulerOrder)};
THREE.OrthographicCamera=function(a,b,c,d,f,e){THREE.Camera.call(this);this.left=a;this.right=b;this.top=c;this.bottom=d;this.near=f!==void 0?f:0.1;this.far=e!==void 0?e:2E3;this.updateProjectionMatrix()};THREE.OrthographicCamera.prototype=Object.create(THREE.Camera.prototype);THREE.OrthographicCamera.prototype.updateProjectionMatrix=function(){this.projectionMatrix.makeOrthographic(this.left,this.right,this.top,this.bottom,this.near,this.far)};
THREE.PerspectiveCamera=function(a,b,c,d){THREE.Camera.call(this);this.fov=a!==void 0?a:50;this.aspect=b!==void 0?b:1;this.near=c!==void 0?c:0.1;this.far=d!==void 0?d:2E3;this.updateProjectionMatrix()};THREE.PerspectiveCamera.prototype=Object.create(THREE.Camera.prototype);THREE.PerspectiveCamera.prototype.setLens=function(a,b){this.fov=2*Math.atan((b!==void 0?b:24)/(a*2))*(180/Math.PI);this.updateProjectionMatrix()};
THREE.PerspectiveCamera.prototype.setViewOffset=function(a,b,c,d,f,e){this.fullWidth=a;this.fullHeight=b;this.x=c;this.y=d;this.width=f;this.height=e;this.updateProjectionMatrix()};
THREE.PerspectiveCamera.prototype.updateProjectionMatrix=function(){if(this.fullWidth){var a=this.fullWidth/this.fullHeight,b=Math.tan(this.fov*Math.PI/360)*this.near,c=-b,d=a*c,a=Math.abs(a*b-d),c=Math.abs(b-c);this.projectionMatrix.makeFrustum(d+this.x*a/this.fullWidth,d+(this.x+this.width)*a/this.fullWidth,b-(this.y+this.height)*c/this.fullHeight,b-this.y*c/this.fullHeight,this.near,this.far)}else this.projectionMatrix.makePerspective(this.fov,this.aspect,this.near,this.far)};
THREE.Light=function(a){THREE.Object3D.call(this);this.color=new THREE.Color(a)};THREE.Light.prototype=Object.create(THREE.Object3D.prototype);THREE.AmbientLight=function(a){THREE.Light.call(this,a)};THREE.AmbientLight.prototype=Object.create(THREE.Light.prototype);
THREE.DirectionalLight=function(a,b,c){THREE.Light.call(this,a);this.position=new THREE.Vector3(0,1,0);this.target=new THREE.Object3D;this.intensity=b!==void 0?b:1;this.distance=c!==void 0?c:0;this.onlyShadow=this.castShadow=false;this.shadowCameraNear=50;this.shadowCameraFar=5E3;this.shadowCameraLeft=-500;this.shadowCameraTop=this.shadowCameraRight=500;this.shadowCameraBottom=-500;this.shadowCameraVisible=false;this.shadowBias=0;this.shadowDarkness=0.5;this.shadowMapHeight=this.shadowMapWidth=512;
this.shadowCascade=false;this.shadowCascadeOffset=new THREE.Vector3(0,0,-1E3);this.shadowCascadeCount=2;this.shadowCascadeBias=[0,0,0];this.shadowCascadeWidth=[512,512,512];this.shadowCascadeHeight=[512,512,512];this.shadowCascadeNearZ=[-1,0.99,0.998];this.shadowCascadeFarZ=[0.99,0.998,1];this.shadowCascadeArray=[];this.shadowMatrix=this.shadowCamera=this.shadowMapSize=this.shadowMap=null};THREE.DirectionalLight.prototype=Object.create(THREE.Light.prototype);
THREE.PointLight=function(a,b,c){THREE.Light.call(this,a);this.position=new THREE.Vector3(0,0,0);this.intensity=b!==void 0?b:1;this.distance=c!==void 0?c:0};THREE.PointLight.prototype=Object.create(THREE.Light.prototype);
THREE.SpotLight=function(a,b,c,d,f){THREE.Light.call(this,a);this.position=new THREE.Vector3(0,1,0);this.target=new THREE.Object3D;this.intensity=b!==void 0?b:1;this.distance=c!==void 0?c:0;this.angle=d!==void 0?d:Math.PI/2;this.exponent=f!==void 0?f:10;this.onlyShadow=this.castShadow=false;this.shadowCameraNear=50;this.shadowCameraFar=5E3;this.shadowCameraFov=50;this.shadowCameraVisible=false;this.shadowBias=0;this.shadowDarkness=0.5;this.shadowMapHeight=this.shadowMapWidth=512;this.shadowMatrix=
this.shadowCamera=this.shadowMapSize=this.shadowMap=null};THREE.SpotLight.prototype=Object.create(THREE.Light.prototype);THREE.Loader=function(a){this.statusDomElement=(this.showStatus=a)?THREE.Loader.prototype.addStatusElement():null;this.onLoadStart=function(){};this.onLoadProgress=function(){};this.onLoadComplete=function(){}};
THREE.Loader.prototype={constructor:THREE.Loader,crossOrigin:"anonymous",addStatusElement:function(){var a=document.createElement("div");a.style.position="absolute";a.style.right="0px";a.style.top="0px";a.style.fontSize="0.8em";a.style.textAlign="left";a.style.background="rgba(0,0,0,0.25)";a.style.color="#fff";a.style.width="120px";a.style.padding="0.5em 0.5em 0.5em 0.5em";a.style.zIndex=1E3;a.innerHTML="Loading ...";return a},updateProgress:function(a){var b="Loaded ",b=a.total?b+((100*a.loaded/
a.total).toFixed(0)+"%"):b+((a.loaded/1E3).toFixed(2)+" KB");this.statusDomElement.innerHTML=b},extractUrlBase:function(a){a=a.split("/");a.pop();return(a.length<1?".":a.join("/"))+"/"},initMaterials:function(a,b,c){a.materials=[];for(var d=0;d<b.length;++d)a.materials[d]=THREE.Loader.prototype.createMaterial(b[d],c)},hasNormals:function(a){var b,c,d=a.materials.length;for(c=0;c<d;c++){b=a.materials[c];if(b instanceof THREE.ShaderMaterial)return true}return false},createMaterial:function(a,b){function c(a){a=
Math.log(a)/Math.LN2;return Math.floor(a)==a}function d(a){a=Math.log(a)/Math.LN2;return Math.pow(2,Math.round(a))}function f(a,f,e,h,i,j){var r=document.createElement("canvas");a[f]=new THREE.Texture(r);a[f].sourceFile=e;if(h){a[f].repeat.set(h[0],h[1]);if(h[0]!==1)a[f].wrapS=THREE.RepeatWrapping;if(h[1]!==1)a[f].wrapT=THREE.RepeatWrapping}i&&a[f].offset.set(i[0],i[1]);if(j){h={repeat:THREE.RepeatWrapping,mirror:THREE.MirroredRepeatWrapping};if(h[j[0]]!==void 0)a[f].wrapS=h[j[0]];if(h[j[1]]!==void 0)a[f].wrapT=
h[j[1]]}var s=a[f],a=b+"/"+e,f=new Image;f.onload=function(){if(!c(this.width)||!c(this.height)){var a=d(this.width),b=d(this.height);s.image.width=a;s.image.height=b;s.image.getContext("2d").drawImage(this,0,0,a,b)}else s.image=this;s.needsUpdate=true};f.crossOrigin=g.crossOrigin;f.src=a}function e(a){return(a[0]*255<<16)+(a[1]*255<<8)+a[2]*255}var g=this,h="MeshLambertMaterial",i={color:15658734,opacity:1,map:null,lightMap:null,normalMap:null,bumpMap:null,wireframe:false};if(a.shading){var j=a.shading.toLowerCase();
j==="phong"?h="MeshPhongMaterial":j==="basic"&&(h="MeshBasicMaterial")}if(a.blending!==void 0&&THREE[a.blending]!==void 0)i.blending=THREE[a.blending];if(a.transparent!==void 0||a.opacity<1)i.transparent=a.transparent;if(a.depthTest!==void 0)i.depthTest=a.depthTest;if(a.depthWrite!==void 0)i.depthWrite=a.depthWrite;if(a.visible!==void 0)i.visible=a.visible;if(a.flipSided!==void 0)i.side=THREE.BackSide;if(a.doubleSided!==void 0)i.side=THREE.DoubleSide;if(a.wireframe!==void 0)i.wireframe=a.wireframe;
if(a.vertexColors!==void 0)if(a.vertexColors=="face")i.vertexColors=THREE.FaceColors;else if(a.vertexColors)i.vertexColors=THREE.VertexColors;if(a.colorDiffuse)i.color=e(a.colorDiffuse);else if(a.DbgColor)i.color=a.DbgColor;if(a.colorSpecular)i.specular=e(a.colorSpecular);if(a.colorAmbient)i.ambient=e(a.colorAmbient);if(a.transparency)i.opacity=a.transparency;if(a.specularCoef)i.shininess=a.specularCoef;a.mapDiffuse&&b&&f(i,"map",a.mapDiffuse,a.mapDiffuseRepeat,a.mapDiffuseOffset,a.mapDiffuseWrap);
a.mapLight&&b&&f(i,"lightMap",a.mapLight,a.mapLightRepeat,a.mapLightOffset,a.mapLightWrap);a.mapBump&&b&&f(i,"bumpMap",a.mapBump,a.mapBumpRepeat,a.mapBumpOffset,a.mapBumpWrap);a.mapNormal&&b&&f(i,"normalMap",a.mapNormal,a.mapNormalRepeat,a.mapNormalOffset,a.mapNormalWrap);a.mapSpecular&&b&&f(i,"specularMap",a.mapSpecular,a.mapSpecularRepeat,a.mapSpecularOffset,a.mapSpecularWrap);if(a.mapNormal){h=THREE.ShaderUtils.lib.normal;j=THREE.UniformsUtils.clone(h.uniforms);j.tNormal.texture=i.normalMap;if(a.mapNormalFactor)j.uNormalScale.value=
a.mapNormalFactor;if(i.map){j.tDiffuse.texture=i.map;j.enableDiffuse.value=true}if(i.specularMap){j.tSpecular.texture=i.specularMap;j.enableSpecular.value=true}if(i.lightMap){j.tAO.texture=i.lightMap;j.enableAO.value=true}j.uDiffuseColor.value.setHex(i.color);j.uSpecularColor.value.setHex(i.specular);j.uAmbientColor.value.setHex(i.ambient);j.uShininess.value=i.shininess;if(i.opacity!==void 0)j.uOpacity.value=i.opacity;i=new THREE.ShaderMaterial({fragmentShader:h.fragmentShader,vertexShader:h.vertexShader,
uniforms:j,lights:true,fog:true})}else i=new THREE[h](i);if(a.DbgName!==void 0)i.name=a.DbgName;return i}};THREE.BinaryLoader=function(a){THREE.Loader.call(this,a)};THREE.BinaryLoader.prototype=Object.create(THREE.Loader.prototype);THREE.BinaryLoader.prototype.load=function(a,b,c,d){var c=c?c:this.extractUrlBase(a),d=d?d:this.extractUrlBase(a),f=this.showProgress?THREE.Loader.prototype.updateProgress:null;this.onLoadStart();this.loadAjaxJSON(this,a,b,c,d,f)};
THREE.BinaryLoader.prototype.loadAjaxJSON=function(a,b,c,d,f,e){var g=new XMLHttpRequest;g.onreadystatechange=function(){if(g.readyState==4)if(g.status==200||g.status==0){var h=JSON.parse(g.responseText);a.loadAjaxBuffers(h,c,f,d,e)}else console.error("THREE.BinaryLoader: Couldn't load ["+b+"] ["+g.status+"]")};g.open("GET",b,true);g.overrideMimeType&&g.overrideMimeType("text/plain; charset=x-user-defined");g.setRequestHeader("Content-Type","text/plain");g.send(null)};
THREE.BinaryLoader.prototype.loadAjaxBuffers=function(a,b,c,d,f){var e=new XMLHttpRequest,g=c+"/"+a.buffers,h=0;e.onreadystatechange=function(){if(e.readyState==4)if(e.status==200||e.status==0){var c=e.response;if(c===void 0)c=(new Uint8Array(e.responseBody)).buffer;THREE.BinaryLoader.prototype.createBinModel(c,b,d,a.materials)}else console.error("THREE.BinaryLoader: Couldn't load ["+g+"] ["+e.status+"]");else if(e.readyState==3){if(f){h==0&&(h=e.getResponseHeader("Content-Length"));f({total:h,loaded:e.responseText.length})}}else e.readyState==
2&&(h=e.getResponseHeader("Content-Length"))};e.open("GET",g,true);e.responseType="arraybuffer";e.send(null)};
THREE.BinaryLoader.prototype.createBinModel=function(a,b,c,d){var f=function(b){var c,f,i,j,l,o,m,p,q,n,r,s,t,u,z;function x(a){return a%4?4-a%4:0}function A(a,b){return(new Uint8Array(a,b,1))[0]}function B(a,b){return(new Uint32Array(a,b,1))[0]}function C(b,c){var d,f,e,g,h,i,j,l,n=new Uint32Array(a,c,3*b);for(d=0;d<b;d++){f=n[d*3];e=n[d*3+1];g=n[d*3+2];h=R[f*2];f=R[f*2+1];i=R[e*2];j=R[e*2+1];e=R[g*2];l=R[g*2+1];g=G.faceVertexUvs[0];var o=[];o.push(new THREE.UV(h,f));o.push(new THREE.UV(i,j));o.push(new THREE.UV(e,
l));g.push(o)}}function v(b,c){var d,f,e,g,h,i,j,l,n,o,m=new Uint32Array(a,c,4*b);for(d=0;d<b;d++){f=m[d*4];e=m[d*4+1];g=m[d*4+2];h=m[d*4+3];i=R[f*2];f=R[f*2+1];j=R[e*2];n=R[e*2+1];l=R[g*2];o=R[g*2+1];g=R[h*2];e=R[h*2+1];h=G.faceVertexUvs[0];var p=[];p.push(new THREE.UV(i,f));p.push(new THREE.UV(j,n));p.push(new THREE.UV(l,o));p.push(new THREE.UV(g,e));h.push(p)}}function J(b,c,d){for(var f,e,g,h,c=new Uint32Array(a,c,3*b),i=new Uint16Array(a,d,b),d=0;d<b;d++){f=c[d*3];e=c[d*3+1];g=c[d*3+2];h=i[d];
G.faces.push(new THREE.Face3(f,e,g,null,null,h))}}function F(b,c,d){for(var f,e,g,h,i,c=new Uint32Array(a,c,4*b),j=new Uint16Array(a,d,b),d=0;d<b;d++){f=c[d*4];e=c[d*4+1];g=c[d*4+2];h=c[d*4+3];i=j[d];G.faces.push(new THREE.Face4(f,e,g,h,null,null,i))}}function O(b,c,d,f){for(var e,g,h,i,j,l,n,c=new Uint32Array(a,c,3*b),d=new Uint32Array(a,d,3*b),o=new Uint16Array(a,f,b),f=0;f<b;f++){e=c[f*3];g=c[f*3+1];h=c[f*3+2];j=d[f*3];l=d[f*3+1];n=d[f*3+2];i=o[f];var m=I[l*3],p=I[l*3+1];l=I[l*3+2];var q=I[n*3],
r=I[n*3+1];n=I[n*3+2];G.faces.push(new THREE.Face3(e,g,h,[new THREE.Vector3(I[j*3],I[j*3+1],I[j*3+2]),new THREE.Vector3(m,p,l),new THREE.Vector3(q,r,n)],null,i))}}function P(b,c,d,f){for(var e,g,h,i,j,l,n,o,m,c=new Uint32Array(a,c,4*b),d=new Uint32Array(a,d,4*b),p=new Uint16Array(a,f,b),f=0;f<b;f++){e=c[f*4];g=c[f*4+1];h=c[f*4+2];i=c[f*4+3];l=d[f*4];n=d[f*4+1];o=d[f*4+2];m=d[f*4+3];j=p[f];var q=I[n*3],r=I[n*3+1];n=I[n*3+2];var s=I[o*3],t=I[o*3+1];o=I[o*3+2];var u=I[m*3],v=I[m*3+1];m=I[m*3+2];G.faces.push(new THREE.Face4(e,
g,h,i,[new THREE.Vector3(I[l*3],I[l*3+1],I[l*3+2]),new THREE.Vector3(q,r,n),new THREE.Vector3(s,t,o),new THREE.Vector3(u,v,m)],null,j))}}var G=this,E=0,I=[],R=[],M,H,V;THREE.Geometry.call(this);THREE.Loader.prototype.initMaterials(G,d,b);z=a;H=E;b=new Uint8Array(z,H,12);n="";for(t=0;t<12;t++)n=n+String.fromCharCode(b[H+t]);c=A(z,H+12);A(z,H+13);A(z,H+14);A(z,H+15);f=A(z,H+16);i=A(z,H+17);j=A(z,H+18);l=A(z,H+19);o=B(z,H+20);m=B(z,H+20+4);p=B(z,H+20+8);q=B(z,H+20+12);n=B(z,H+20+16);r=B(z,H+20+20);s=
B(z,H+20+24);t=B(z,H+20+28);b=B(z,H+20+32);u=B(z,H+20+36);z=B(z,H+20+40);E=E+c;H=f*3+l;V=f*4+l;M=q*H;c=n*(H+i*3);f=r*(H+j*3);l=s*(H+i*3+j*3);H=t*V;i=b*(V+i*4);j=u*(V+j*4);V=E;var E=new Float32Array(a,E,o*3),Q,L,W,ha;for(Q=0;Q<o;Q++){L=E[Q*3];W=E[Q*3+1];ha=E[Q*3+2];G.vertices.push(new THREE.Vector3(L,W,ha))}o=E=V+o*3*Float32Array.BYTES_PER_ELEMENT;if(m){E=new Int8Array(a,E,m*3);for(V=0;V<m;V++){Q=E[V*3];L=E[V*3+1];W=E[V*3+2];I.push(Q/127,L/127,W/127)}}E=o+m*3*Int8Array.BYTES_PER_ELEMENT;m=E=E+x(m*
3);if(p){E=new Float32Array(a,E,p*2);for(o=0;o<p;o++){V=E[o*2];Q=E[o*2+1];R.push(V,Q)}}p=E=m+p*2*Float32Array.BYTES_PER_ELEMENT;M=p+M+x(q*2);m=M+c+x(n*2);c=m+f+x(r*2);f=c+l+x(s*2);H=f+H+x(t*2);l=H+i+x(b*2);i=l+j+x(u*2);if(r){j=m+r*Uint32Array.BYTES_PER_ELEMENT*3;J(r,m,j+r*Uint32Array.BYTES_PER_ELEMENT*3);C(r,j)}if(s){r=c+s*Uint32Array.BYTES_PER_ELEMENT*3;j=r+s*Uint32Array.BYTES_PER_ELEMENT*3;O(s,c,r,j+s*Uint32Array.BYTES_PER_ELEMENT*3);C(s,j)}if(u){s=l+u*Uint32Array.BYTES_PER_ELEMENT*4;F(u,l,s+u*
Uint32Array.BYTES_PER_ELEMENT*4);v(u,s)}if(z){u=i+z*Uint32Array.BYTES_PER_ELEMENT*4;s=u+z*Uint32Array.BYTES_PER_ELEMENT*4;P(z,i,u,s+z*Uint32Array.BYTES_PER_ELEMENT*4);v(z,s)}q&&J(q,p,p+q*Uint32Array.BYTES_PER_ELEMENT*3);if(n){q=M+n*Uint32Array.BYTES_PER_ELEMENT*3;O(n,M,q,q+n*Uint32Array.BYTES_PER_ELEMENT*3)}t&&F(t,f,f+t*Uint32Array.BYTES_PER_ELEMENT*4);if(b){n=H+b*Uint32Array.BYTES_PER_ELEMENT*4;P(b,H,n,n+b*Uint32Array.BYTES_PER_ELEMENT*4)}this.computeCentroids();this.computeFaceNormals();THREE.Loader.prototype.hasNormals(this)&&
this.computeTangents()};f.prototype=Object.create(THREE.Geometry.prototype);b(new f(c))};THREE.ImageLoader=function(){THREE.EventTarget.call(this);this.crossOrigin=null};
THREE.ImageLoader.prototype={constructor:THREE.ImageLoader,load:function(a,b){var c=this;b===void 0&&(b=new Image);b.addEventListener("load",function(){c.dispatchEvent({type:"load",content:b})},false);b.addEventListener("error",function(){c.dispatchEvent({type:"error",message:"Couldn't load URL ["+a+"]"})},false);if(c.crossOrigin)b.crossOrigin=c.crossOrigin;b.src=a}};THREE.JSONLoader=function(a){THREE.Loader.call(this,a)};THREE.JSONLoader.prototype=Object.create(THREE.Loader.prototype);
THREE.JSONLoader.prototype.load=function(a,b,c){c=c?c:this.extractUrlBase(a);this.onLoadStart();this.loadAjaxJSON(this,a,b,c)};
THREE.JSONLoader.prototype.loadAjaxJSON=function(a,b,c,d,f){var e=new XMLHttpRequest,g=0;e.onreadystatechange=function(){if(e.readyState===e.DONE)if(e.status===200||e.status===0){if(e.responseText){var h=JSON.parse(e.responseText);a.createModel(h,c,d)}else console.warn("THREE.JSONLoader: ["+b+"] seems to be unreachable or file there is empty");a.onLoadComplete()}else console.error("THREE.JSONLoader: Couldn't load ["+b+"] ["+e.status+"]");else if(e.readyState===e.LOADING){if(f){g===0&&(g=e.getResponseHeader("Content-Length"));
f({total:g,loaded:e.responseText.length})}}else e.readyState===e.HEADERS_RECEIVED&&(g=e.getResponseHeader("Content-Length"))};e.open("GET",b,true);e.overrideMimeType&&e.overrideMimeType("text/plain; charset=x-user-defined");e.setRequestHeader("Content-Type","text/plain");e.send(null)};
THREE.JSONLoader.prototype.createModel=function(a,b,c){var d=new THREE.Geometry,f=a.scale!==void 0?1/a.scale:1;this.initMaterials(d,a.materials,c);var e,g,h,i,j,l,o,m,p,q,n,r,s,t,u=a.faces;p=a.vertices;var z=a.normals,x=a.colors,A=0;for(e=0;e<a.uvs.length;e++)a.uvs[e].length&&A++;for(e=0;e<A;e++){d.faceUvs[e]=[];d.faceVertexUvs[e]=[]}c=0;for(i=p.length;c<i;){j=new THREE.Vector3;j.x=p[c++]*f;j.y=p[c++]*f;j.z=p[c++]*f;d.vertices.push(j)}c=0;for(i=u.length;c<i;){p=u[c++];j=p&1;h=p&2;e=p&4;g=p&8;o=p&
16;l=p&32;q=p&64;p=p&128;if(j){n=new THREE.Face4;n.a=u[c++];n.b=u[c++];n.c=u[c++];n.d=u[c++];j=4}else{n=new THREE.Face3;n.a=u[c++];n.b=u[c++];n.c=u[c++];j=3}if(h){h=u[c++];n.materialIndex=h}h=d.faces.length;if(e)for(e=0;e<A;e++){r=a.uvs[e];m=u[c++];t=r[m*2];m=r[m*2+1];d.faceUvs[e][h]=new THREE.UV(t,m)}if(g)for(e=0;e<A;e++){r=a.uvs[e];s=[];for(g=0;g<j;g++){m=u[c++];t=r[m*2];m=r[m*2+1];s[g]=new THREE.UV(t,m)}d.faceVertexUvs[e][h]=s}if(o){o=u[c++]*3;g=new THREE.Vector3;g.x=z[o++];g.y=z[o++];g.z=z[o];
n.normal=g}if(l)for(e=0;e<j;e++){o=u[c++]*3;g=new THREE.Vector3;g.x=z[o++];g.y=z[o++];g.z=z[o];n.vertexNormals.push(g)}if(q){l=u[c++];l=new THREE.Color(x[l]);n.color=l}if(p)for(e=0;e<j;e++){l=u[c++];l=new THREE.Color(x[l]);n.vertexColors.push(l)}d.faces.push(n)}if(a.skinWeights){c=0;for(i=a.skinWeights.length;c<i;c=c+2){u=a.skinWeights[c];z=a.skinWeights[c+1];d.skinWeights.push(new THREE.Vector4(u,z,0,0))}}if(a.skinIndices){c=0;for(i=a.skinIndices.length;c<i;c=c+2){u=a.skinIndices[c];z=a.skinIndices[c+
1];d.skinIndices.push(new THREE.Vector4(u,z,0,0))}}d.bones=a.bones;d.animation=a.animation;if(a.morphTargets!==void 0){c=0;for(i=a.morphTargets.length;c<i;c++){d.morphTargets[c]={};d.morphTargets[c].name=a.morphTargets[c].name;d.morphTargets[c].vertices=[];x=d.morphTargets[c].vertices;A=a.morphTargets[c].vertices;u=0;for(z=A.length;u<z;u=u+3){p=new THREE.Vector3;p.x=A[u]*f;p.y=A[u+1]*f;p.z=A[u+2]*f;x.push(p)}}}if(a.morphColors!==void 0){c=0;for(i=a.morphColors.length;c<i;c++){d.morphColors[c]={};
d.morphColors[c].name=a.morphColors[c].name;d.morphColors[c].colors=[];z=d.morphColors[c].colors;x=a.morphColors[c].colors;f=0;for(u=x.length;f<u;f=f+3){A=new THREE.Color(16755200);A.setRGB(x[f],x[f+1],x[f+2]);z.push(A)}}}d.computeCentroids();d.computeFaceNormals();this.hasNormals(d)&&d.computeTangents();b(d)};THREE.GeometryLoader=function(){THREE.EventTarget.call(this);this.path=this.crossOrigin=null};
THREE.GeometryLoader.prototype={constructor:THREE.GeometryLoader,load:function(a){var b=this,c=null;if(b.path===null){var d=a.split("/");d.pop();b.path=d.length<1?".":d.join("/")}d=new XMLHttpRequest;d.addEventListener("load",function(d){d.target.responseText?c=b.parse(JSON.parse(d.target.responseText),f):b.dispatchEvent({type:"error",message:"Invalid file ["+a+"]"})},false);d.addEventListener("error",function(){b.dispatchEvent({type:"error",message:"Couldn't load URL ["+a+"]"})},false);d.open("GET",
a,true);d.send(null);var f=new THREE.LoadingMonitor;f.addEventListener("load",function(){b.dispatchEvent({type:"load",content:c})});f.add(d)},parse:function(a,b){var c=this,d=new THREE.Geometry,f=a.scale!==void 0?1/a.scale:1;if(a.materials){d.materials=[];for(var e=0;e<a.materials.length;++e){var g=a.materials[e],h=function(a){a=Math.log(a)/Math.LN2;return Math.floor(a)==a},i=function(a){a=Math.log(a)/Math.LN2;return Math.pow(2,Math.round(a))},j=function(a,d,f,e,g,j){a[d]=new THREE.Texture;a[d].sourceFile=
f;if(e){a[d].repeat.set(e[0],e[1]);if(e[0]!==1)a[d].wrapS=THREE.RepeatWrapping;if(e[1]!==1)a[d].wrapT=THREE.RepeatWrapping}g&&a[d].offset.set(g[0],g[1]);if(j){e={repeat:THREE.RepeatWrapping,mirror:THREE.MirroredRepeatWrapping};if(e[j[0]]!==void 0)a[d].wrapS=e[j[0]];if(e[j[1]]!==void 0)a[d].wrapT=e[j[1]]}var l=a[d],a=new THREE.ImageLoader;a.addEventListener("load",function(a){a=a.content;if(!h(a.width)||!h(a.height)){var b=i(a.width),c=i(a.height);l.image=document.createElement("canvas");l.image.width=
b;l.image.height=c;l.image.getContext("2d").drawImage(a,0,0,b,c)}else l.image=a;l.needsUpdate=true});a.crossOrigin=c.crossOrigin;a.load(c.path+"/"+f);b&&b.add(a)},l=function(a){return(a[0]*255<<16)+(a[1]*255<<8)+a[2]*255},o="MeshLambertMaterial",m={color:15658734,opacity:1,map:null,lightMap:null,normalMap:null,bumpMap:null,wireframe:false};if(g.shading){var p=g.shading.toLowerCase();p==="phong"?o="MeshPhongMaterial":p==="basic"&&(o="MeshBasicMaterial")}if(g.blending!==void 0&&THREE[g.blending]!==
void 0)m.blending=THREE[g.blending];if(g.transparent!==void 0||g.opacity<1)m.transparent=g.transparent;if(g.depthTest!==void 0)m.depthTest=g.depthTest;if(g.depthWrite!==void 0)m.depthWrite=g.depthWrite;if(g.vertexColors!==void 0)if(g.vertexColors=="face")m.vertexColors=THREE.FaceColors;else if(g.vertexColors)m.vertexColors=THREE.VertexColors;if(g.colorDiffuse)m.color=l(g.colorDiffuse);else if(g.DbgColor)m.color=g.DbgColor;if(g.colorSpecular)m.specular=l(g.colorSpecular);if(g.colorAmbient)m.ambient=
l(g.colorAmbient);if(g.transparency)m.opacity=g.transparency;if(g.specularCoef)m.shininess=g.specularCoef;if(g.visible!==void 0)m.visible=g.visible;if(g.flipSided!==void 0)m.side=THREE.BackSide;if(g.doubleSided!==void 0)m.side=THREE.DoubleSide;if(g.wireframe!==void 0)m.wireframe=g.wireframe;g.mapDiffuse&&j(m,"map",g.mapDiffuse,g.mapDiffuseRepeat,g.mapDiffuseOffset,g.mapDiffuseWrap);g.mapLight&&j(m,"lightMap",g.mapLight,g.mapLightRepeat,g.mapLightOffset,g.mapLightWrap);g.mapBump&&j(m,"bumpMap",g.mapBump,
g.mapBumpRepeat,g.mapBumpOffset,g.mapBumpWrap);g.mapNormal&&j(m,"normalMap",g.mapNormal,g.mapNormalRepeat,g.mapNormalOffset,g.mapNormalWrap);g.mapSpecular&&j(m,"specularMap",g.mapSpecular,g.mapSpecularRepeat,g.mapSpecularOffset,g.mapSpecularWrap);if(g.mapNormal){j=THREE.ShaderUtils.lib.normal;l=THREE.UniformsUtils.clone(j.uniforms);l.tNormal.texture=m.normalMap;if(g.mapNormalFactor)l.uNormalScale.value=g.mapNormalFactor;if(m.map){l.tDiffuse.texture=m.map;l.enableDiffuse.value=true}if(m.specularMap){l.tSpecular.texture=
m.specularMap;l.enableSpecular.value=true}if(m.lightMap){l.tAO.texture=m.lightMap;l.enableAO.value=true}l.uDiffuseColor.value.setHex(m.color);l.uSpecularColor.value.setHex(m.specular);l.uAmbientColor.value.setHex(m.ambient);l.uShininess.value=m.shininess;if(m.opacity!==void 0)l.uOpacity.value=m.opacity;m=new THREE.ShaderMaterial({fragmentShader:j.fragmentShader,vertexShader:j.vertexShader,uniforms:l,lights:true,fog:true})}else m=new THREE[o](m);if(g.DbgName!==void 0)m.name=g.DbgName;d.materials[e]=
m}}var g=a.faces,q=a.vertices,m=a.normals,j=a.colors,l=0;if(a.uvs)for(e=0;e<a.uvs.length;e++)a.uvs[e].length&&l++;for(e=0;e<l;e++){d.faceUvs[e]=[];d.faceVertexUvs[e]=[]}o=0;for(p=q.length;o<p;){var n=new THREE.Vector3;n.x=q[o++]*f;n.y=q[o++]*f;n.z=q[o++]*f;d.vertices.push(n)}o=0;for(p=g.length;o<p;){var r=g[o++],s=r&2,e=r&4,t=r&8,u=r&16,q=r&32,z=r&64,n=r&128;if(r&1){r=new THREE.Face4;r.a=g[o++];r.b=g[o++];r.c=g[o++];r.d=g[o++];var x=4}else{r=new THREE.Face3;r.a=g[o++];r.b=g[o++];r.c=g[o++];x=3}if(s){s=
g[o++];r.materialIndex=s}var A=d.faces.length;if(e)for(e=0;e<l;e++){var B=a.uvs[e],s=g[o++],C=B[s*2],s=B[s*2+1];d.faceUvs[e][A]=new THREE.UV(C,s)}if(t)for(e=0;e<l;e++){for(var B=a.uvs[e],t=[],v=0;v<x;v++){s=g[o++];C=B[s*2];s=B[s*2+1];t[v]=new THREE.UV(C,s)}d.faceVertexUvs[e][A]=t}if(u){u=g[o++]*3;s=new THREE.Vector3;s.x=m[u++];s.y=m[u++];s.z=m[u];r.normal=s}if(q)for(e=0;e<x;e++){u=g[o++]*3;s=new THREE.Vector3;s.x=m[u++];s.y=m[u++];s.z=m[u];r.vertexNormals.push(s)}if(z){q=g[o++];r.color=new THREE.Color(j[q])}if(n)for(e=
0;e<x;e++){q=g[o++];r.vertexColors.push(new THREE.Color(j[q]))}d.faces.push(r)}if(a.skinWeights){e=0;for(g=a.skinWeights.length;e<g;e=e+2)d.skinWeights.push(new THREE.Vector4(a.skinWeights[e],a.skinWeights[e+1],0,0))}if(a.skinIndices){e=0;for(g=a.skinIndices.length;e<g;e=e+2){m=0;d.skinIndices.push(new THREE.Vector4(a.skinIndices[e],a.skinIndices[e+1],m,0))}}d.bones=a.bones;d.animation=a.animation;if(a.morphTargets){e=0;for(g=a.morphTargets.length;e<g;e++){d.morphTargets[e]={};d.morphTargets[e].name=
a.morphTargets[e].name;d.morphTargets[e].vertices=[];m=d.morphTargets[e].vertices;j=a.morphTargets[e].vertices;s=0;for(l=j.length;s<l;s=s+3){n=new THREE.Vector3;n.x=j[s]*f;n.y=j[s+1]*f;n.z=j[s+2]*f;m.push(n)}}}if(a.morphColors){e=0;for(g=a.morphColors.length;e<g;e++){d.morphColors[e]={};d.morphColors[e].name=a.morphColors[e].name;d.morphColors[e].colors=[];f=d.morphColors[e].colors;j=a.morphColors[e].colors;m=0;for(l=j.length;m<l;m=m+3){o=new THREE.Color(16755200);o.setRGB(j[m],j[m+1],j[m+2]);f.push(o)}}}d.computeCentroids();
d.computeFaceNormals();return d}};THREE.SceneLoader=function(){this.onLoadStart=function(){};this.onLoadProgress=function(){};this.onLoadComplete=function(){};this.callbackSync=function(){};this.callbackProgress=function(){}};THREE.SceneLoader.prototype.constructor=THREE.SceneLoader;
THREE.SceneLoader.prototype.load=function(a,b){var c=this,d=new XMLHttpRequest;d.onreadystatechange=function(){if(d.readyState===4)if(d.status===200||d.status===0){var f=JSON.parse(d.responseText);c.createScene(f,b,a)}else console.error("THREE.SceneLoader: Couldn't load ["+a+"] ["+d.status+"]")};d.open("GET",a,true);d.overrideMimeType&&d.overrideMimeType("text/plain; charset=x-user-defined");d.setRequestHeader("Content-Type","text/plain");d.send(null)};
THREE.SceneLoader.prototype.createScene=function(a,b,c){function d(a,b){return b=="relativeToHTML"?a:j+"/"+a}function f(a,b){var c;for(m in b)if(Q.objects[m]===void 0){s=b[m];if(s.geometry!==void 0){if(F=Q.geometries[s.geometry]){c=false;O=Q.materials[s.materials[0]];(c=O instanceof THREE.ShaderMaterial)&&F.computeTangents();x=s.position;A=s.rotation;B=s.quaternion;C=s.scale;t=s.matrix;B=0;s.materials.length==0&&(O=new THREE.MeshFaceMaterial);s.materials.length>1&&(O=new THREE.MeshFaceMaterial);c=
new THREE.Mesh(F,O);c.name=m;if(t){c.matrixAutoUpdate=false;c.matrix.set(t[0],t[1],t[2],t[3],t[4],t[5],t[6],t[7],t[8],t[9],t[10],t[11],t[12],t[13],t[14],t[15])}else{c.position.set(x[0],x[1],x[2]);if(B){c.quaternion.set(B[0],B[1],B[2],B[3]);c.useQuaternion=true}else c.rotation.set(A[0],A[1],A[2]);c.scale.set(C[0],C[1],C[2])}c.visible=s.visible;c.castShadow=s.castShadow;c.receiveShadow=s.receiveShadow;a.add(c);Q.objects[m]=c}}else{x=s.position;A=s.rotation;B=s.quaternion;C=s.scale;B=0;c=new THREE.Object3D;
c.name=m;c.position.set(x[0],x[1],x[2]);if(B){c.quaternion.set(B[0],B[1],B[2],B[3]);c.useQuaternion=true}else c.rotation.set(A[0],A[1],A[2]);c.scale.set(C[0],C[1],C[2]);c.visible=s.visible!==void 0?s.visible:false;a.add(c);Q.objects[m]=c;Q.empties[m]=c}if(s.properties!==void 0)for(var d in s.properties)c.properties[d]=s.properties[d];s.children!==void 0&&f(c,s.children)}}function e(a){return function(b){Q.geometries[a]=b;f(Q.scene,E.objects);R=R-1;i.onLoadComplete();h()}}function g(a){return function(b){Q.geometries[a]=
b}}function h(){i.callbackProgress({totalModels:H,totalTextures:V,loadedModels:H-R,loadedTextures:V-M},Q);i.onLoadProgress();R===0&&M===0&&b(Q)}var i=this,j=THREE.Loader.prototype.extractUrlBase(c),l,o,m,p,q,n,r,s,t,u,z,x,A,B,C,v,J,F,O,P,G,E,I,R,M,H,V,Q;E=a;c=new THREE.BinaryLoader;I=new THREE.JSONLoader;M=R=0;Q={scene:new THREE.Scene,geometries:{},materials:{},textures:{},objects:{},cameras:{},lights:{},fogs:{},empties:{}};if(E.transform){a=E.transform.position;u=E.transform.rotation;v=E.transform.scale;
a&&Q.scene.position.set(a[0],a[1],a[2]);u&&Q.scene.rotation.set(u[0],u[1],u[2]);v&&Q.scene.scale.set(v[0],v[1],v[2]);if(a||u||v){Q.scene.updateMatrix();Q.scene.updateMatrixWorld()}}a=function(a){return function(){M=M-a;h();i.onLoadComplete()}};for(q in E.cameras){v=E.cameras[q];v.type==="perspective"?P=new THREE.PerspectiveCamera(v.fov,v.aspect,v.near,v.far):v.type==="ortho"&&(P=new THREE.OrthographicCamera(v.left,v.right,v.top,v.bottom,v.near,v.far));x=v.position;u=v.target;v=v.up;P.position.set(x[0],
x[1],x[2]);P.target=new THREE.Vector3(u[0],u[1],u[2]);v&&P.up.set(v[0],v[1],v[2]);Q.cameras[q]=P}for(p in E.lights){u=E.lights[p];q=u.color!==void 0?u.color:16777215;P=u.intensity!==void 0?u.intensity:1;if(u.type==="directional"){x=u.direction;z=new THREE.DirectionalLight(q,P);z.position.set(x[0],x[1],x[2]);z.position.normalize()}else if(u.type==="point"){x=u.position;z=u.distance;z=new THREE.PointLight(q,P,z);z.position.set(x[0],x[1],x[2])}else u.type==="ambient"&&(z=new THREE.AmbientLight(q));Q.scene.add(z);
Q.lights[p]=z}for(n in E.fogs){p=E.fogs[n];p.type==="linear"?G=new THREE.Fog(0,p.near,p.far):p.type==="exp2"&&(G=new THREE.FogExp2(0,p.density));v=p.color;G.color.setRGB(v[0],v[1],v[2]);Q.fogs[n]=G}if(Q.cameras&&E.defaults.camera)Q.currentCamera=Q.cameras[E.defaults.camera];if(Q.fogs&&E.defaults.fog)Q.scene.fog=Q.fogs[E.defaults.fog];v=E.defaults.bgcolor;Q.bgColor=new THREE.Color;Q.bgColor.setRGB(v[0],v[1],v[2]);Q.bgColorAlpha=E.defaults.bgalpha;for(l in E.geometries){n=E.geometries[l];if(n.type==
"bin_mesh"||n.type=="ascii_mesh"){R=R+1;i.onLoadStart()}}H=R;for(l in E.geometries){n=E.geometries[l];if(n.type==="cube"){F=new THREE.CubeGeometry(n.width,n.height,n.depth,n.segmentsWidth,n.segmentsHeight,n.segmentsDepth,null,n.flipped,n.sides);Q.geometries[l]=F}else if(n.type==="plane"){F=new THREE.PlaneGeometry(n.width,n.height,n.segmentsWidth,n.segmentsHeight);Q.geometries[l]=F}else if(n.type==="sphere"){F=new THREE.SphereGeometry(n.radius,n.segmentsWidth,n.segmentsHeight);Q.geometries[l]=F}else if(n.type===
"cylinder"){F=new THREE.CylinderGeometry(n.topRad,n.botRad,n.height,n.radSegs,n.heightSegs);Q.geometries[l]=F}else if(n.type==="torus"){F=new THREE.TorusGeometry(n.radius,n.tube,n.segmentsR,n.segmentsT);Q.geometries[l]=F}else if(n.type==="icosahedron"){F=new THREE.IcosahedronGeometry(n.radius,n.subdivisions);Q.geometries[l]=F}else if(n.type==="bin_mesh")c.load(d(n.url,E.urlBaseType),e(l));else if(n.type==="ascii_mesh")I.load(d(n.url,E.urlBaseType),e(l));else if(n.type==="embedded_mesh"){n=E.embeds[n.id];
n.metadata=E.metadata;n&&I.createModel(n,g(l),"")}}for(r in E.textures){l=E.textures[r];if(l.url instanceof Array){M=M+l.url.length;for(n=0;n<l.url.length;n++)i.onLoadStart()}else{M=M+1;i.onLoadStart()}}V=M;for(r in E.textures){l=E.textures[r];if(l.mapping!==void 0&&THREE[l.mapping]!==void 0)l.mapping=new THREE[l.mapping];if(l.url instanceof Array){n=l.url.length;G=[];for(c=0;c<n;c++)G[c]=d(l.url[c],E.urlBaseType);n=THREE.ImageUtils.loadTextureCube(G,l.mapping,a(n))}else{n=THREE.ImageUtils.loadTexture(d(l.url,
E.urlBaseType),l.mapping,a(1));if(THREE[l.minFilter]!==void 0)n.minFilter=THREE[l.minFilter];if(THREE[l.magFilter]!==void 0)n.magFilter=THREE[l.magFilter];if(l.repeat){n.repeat.set(l.repeat[0],l.repeat[1]);if(l.repeat[0]!==1)n.wrapS=THREE.RepeatWrapping;if(l.repeat[1]!==1)n.wrapT=THREE.RepeatWrapping}l.offset&&n.offset.set(l.offset[0],l.offset[1]);if(l.wrap){G={repeat:THREE.RepeatWrapping,mirror:THREE.MirroredRepeatWrapping};if(G[l.wrap[0]]!==void 0)n.wrapS=G[l.wrap[0]];if(G[l.wrap[1]]!==void 0)n.wrapT=
G[l.wrap[1]]}}Q.textures[r]=n}for(o in E.materials){t=E.materials[o];for(J in t.parameters)if(J==="envMap"||J==="map"||J==="lightMap")t.parameters[J]=Q.textures[t.parameters[J]];else if(J==="shading")t.parameters[J]=t.parameters[J]=="flat"?THREE.FlatShading:THREE.SmoothShading;else if(J==="blending")t.parameters[J]=t.parameters[J]in THREE?THREE[t.parameters[J]]:THREE.NormalBlending;else if(J==="combine")t.parameters[J]=t.parameters[J]=="MixOperation"?THREE.MixOperation:THREE.MultiplyOperation;else if(J===
"vertexColors")if(t.parameters[J]=="face")t.parameters[J]=THREE.FaceColors;else if(t.parameters[J])t.parameters[J]=THREE.VertexColors;if(t.parameters.opacity!==void 0&&t.parameters.opacity<1)t.parameters.transparent=true;if(t.parameters.normalMap){r=THREE.ShaderUtils.lib.normal;a=THREE.UniformsUtils.clone(r.uniforms);l=t.parameters.color;n=t.parameters.specular;G=t.parameters.ambient;c=t.parameters.shininess;a.tNormal.texture=Q.textures[t.parameters.normalMap];if(t.parameters.normalMapFactor)a.uNormalScale.value=
t.parameters.normalMapFactor;if(t.parameters.map){a.tDiffuse.texture=t.parameters.map;a.enableDiffuse.value=true}if(t.parameters.lightMap){a.tAO.texture=t.parameters.lightMap;a.enableAO.value=true}if(t.parameters.specularMap){a.tSpecular.texture=Q.textures[t.parameters.specularMap];a.enableSpecular.value=true}a.uDiffuseColor.value.setHex(l);a.uSpecularColor.value.setHex(n);a.uAmbientColor.value.setHex(G);a.uShininess.value=c;if(t.parameters.opacity)a.uOpacity.value=t.parameters.opacity;O=new THREE.ShaderMaterial({fragmentShader:r.fragmentShader,
vertexShader:r.vertexShader,uniforms:a,lights:true,fog:true})}else O=new THREE[t.type](t.parameters);Q.materials[o]=O}f(Q.scene,E.objects);i.callbackSync(Q);h()};THREE.TextureLoader=function(){THREE.EventTarget.call(this);this.crossOrigin=null};
THREE.TextureLoader.prototype={constructor:THREE.TextureLoader,load:function(a){var b=this,c=new Image;c.addEventListener("load",function(){var a=new THREE.Texture(c);a.needsUpdate=true;b.dispatchEvent({type:"load",content:a})},false);c.addEventListener("error",function(){b.dispatchEvent({type:"error",message:"Couldn't load URL ["+a+"]"})},false);if(b.crossOrigin)c.crossOrigin=b.crossOrigin;c.src=a}};
THREE.Material=function(){this.id=THREE.MaterialCount++;this.name="";this.side=THREE.FrontSide;this.opacity=1;this.transparent=false;this.blending=THREE.NormalBlending;this.blendSrc=THREE.SrcAlphaFactor;this.blendDst=THREE.OneMinusSrcAlphaFactor;this.blendEquation=THREE.AddEquation;this.depthWrite=this.depthTest=true;this.polygonOffset=false;this.alphaTest=this.polygonOffsetUnits=this.polygonOffsetFactor=0;this.overdraw=false;this.needsUpdate=this.visible=true};
THREE.Material.prototype.setValues=function(a){if(a!==void 0)for(var b in a){var c=a[b];if(c===void 0)console.warn("THREE.Material: '"+b+"' parameter is undefined.");else if(b in this){var d=this[b];d instanceof THREE.Color&&c instanceof THREE.Color?d.copy(c):d instanceof THREE.Color&&typeof c==="number"?d.setHex(c):d instanceof THREE.Vector3&&c instanceof THREE.Vector3?d.copy(c):this[b]=c}}};
THREE.Material.prototype.clone=function(a){a===void 0&&(a=new THREE.Material);a.name=this.name;a.side=this.side;a.opacity=this.opacity;a.transparent=this.transparent;a.blending=this.blending;a.blendSrc=this.blendSrc;a.blendDst=this.blendDst;a.blendEquation=this.blendEquation;a.depthTest=this.depthTest;a.depthWrite=this.depthWrite;a.polygonOffset=this.polygonOffset;a.polygonOffsetFactor=this.polygonOffsetFactor;a.polygonOffsetUnits=this.polygonOffsetUnits;a.alphaTest=this.alphaTest;a.overdraw=this.overdraw;
a.visible=this.visible;return a};THREE.MaterialCount=0;THREE.LineBasicMaterial=function(a){THREE.Material.call(this);this.color=new THREE.Color(16777215);this.linewidth=1;this.linejoin=this.linecap="round";this.vertexColors=false;this.fog=true;this.setValues(a)};THREE.LineBasicMaterial.prototype=Object.create(THREE.Material.prototype);
THREE.LineBasicMaterial.prototype.clone=function(){var a=new THREE.LineBasicMaterial;THREE.Material.prototype.clone.call(this,a);a.color.copy(this.color);a.linewidth=this.linewidth;a.linecap=this.linecap;a.linejoin=this.linejoin;a.vertexColors=this.vertexColors;a.fog=this.fog;return a};
THREE.MeshBasicMaterial=function(a){THREE.Material.call(this);this.color=new THREE.Color(16777215);this.envMap=this.specularMap=this.lightMap=this.map=null;this.combine=THREE.MultiplyOperation;this.reflectivity=1;this.refractionRatio=0.98;this.fog=true;this.shading=THREE.SmoothShading;this.wireframe=false;this.wireframeLinewidth=1;this.wireframeLinejoin=this.wireframeLinecap="round";this.vertexColors=THREE.NoColors;this.morphTargets=this.skinning=false;this.setValues(a)};
THREE.MeshBasicMaterial.prototype=Object.create(THREE.Material.prototype);
THREE.MeshBasicMaterial.prototype.clone=function(){var a=new THREE.MeshBasicMaterial;THREE.Material.prototype.clone.call(this,a);a.color.copy(this.color);a.map=this.map;a.lightMap=this.lightMap;a.specularMap=this.specularMap;a.envMap=this.envMap;a.combine=this.combine;a.reflectivity=this.reflectivity;a.refractionRatio=this.refractionRatio;a.fog=this.fog;a.shading=this.shading;a.wireframe=this.wireframe;a.wireframeLinewidth=this.wireframeLinewidth;a.wireframeLinecap=this.wireframeLinecap;a.wireframeLinejoin=
this.wireframeLinejoin;a.vertexColors=this.vertexColors;a.skinning=this.skinning;a.morphTargets=this.morphTargets;return a};
THREE.MeshLambertMaterial=function(a){THREE.Material.call(this);this.color=new THREE.Color(16777215);this.ambient=new THREE.Color(16777215);this.emissive=new THREE.Color(0);this.wrapAround=false;this.wrapRGB=new THREE.Vector3(1,1,1);this.envMap=this.specularMap=this.lightMap=this.map=null;this.combine=THREE.MultiplyOperation;this.reflectivity=1;this.refractionRatio=0.98;this.fog=true;this.shading=THREE.SmoothShading;this.wireframe=false;this.wireframeLinewidth=1;this.wireframeLinejoin=this.wireframeLinecap=
"round";this.vertexColors=THREE.NoColors;this.morphNormals=this.morphTargets=this.skinning=false;this.setValues(a)};THREE.MeshLambertMaterial.prototype=Object.create(THREE.Material.prototype);
THREE.MeshLambertMaterial.prototype.clone=function(){var a=new THREE.MeshLambertMaterial;THREE.Material.prototype.clone.call(this,a);a.color.copy(this.color);a.ambient.copy(this.ambient);a.emissive.copy(this.emissive);a.wrapAround=this.wrapAround;a.wrapRGB.copy(this.wrapRGB);a.map=this.map;a.lightMap=this.lightMap;a.specularMap=this.specularMap;a.envMap=this.envMap;a.combine=this.combine;a.reflectivity=this.reflectivity;a.refractionRatio=this.refractionRatio;a.fog=this.fog;a.shading=this.shading;
a.wireframe=this.wireframe;a.wireframeLinewidth=this.wireframeLinewidth;a.wireframeLinecap=this.wireframeLinecap;a.wireframeLinejoin=this.wireframeLinejoin;a.vertexColors=this.vertexColors;a.skinning=this.skinning;a.morphTargets=this.morphTargets;a.morphNormals=this.morphNormals;return a};
THREE.MeshPhongMaterial=function(a){THREE.Material.call(this);this.color=new THREE.Color(16777215);this.ambient=new THREE.Color(16777215);this.emissive=new THREE.Color(0);this.specular=new THREE.Color(1118481);this.shininess=30;this.wrapAround=this.perPixel=this.metal=false;this.wrapRGB=new THREE.Vector3(1,1,1);this.bumpMap=this.lightMap=this.map=null;this.bumpScale=1;this.envMap=this.specularMap=null;this.combine=THREE.MultiplyOperation;this.reflectivity=1;this.refractionRatio=0.98;this.fog=true;
this.shading=THREE.SmoothShading;this.wireframe=false;this.wireframeLinewidth=1;this.wireframeLinejoin=this.wireframeLinecap="round";this.vertexColors=THREE.NoColors;this.morphNormals=this.morphTargets=this.skinning=false;this.setValues(a)};THREE.MeshPhongMaterial.prototype=Object.create(THREE.Material.prototype);
THREE.MeshPhongMaterial.prototype.clone=function(){var a=new THREE.MeshPhongMaterial;THREE.Material.prototype.clone.call(this,a);a.color.copy(this.color);a.ambient.copy(this.ambient);a.emissive.copy(this.emissive);a.specular.copy(this.specular);a.shininess=this.shininess;a.metal=this.metal;a.perPixel=this.perPixel;a.wrapAround=this.wrapAround;a.wrapRGB.copy(this.wrapRGB);a.map=this.map;a.lightMap=this.lightMap;a.bumpMap=this.bumpMap;a.bumpScale=this.bumpScale;a.specularMap=this.specularMap;a.envMap=
this.envMap;a.combine=this.combine;a.reflectivity=this.reflectivity;a.refractionRatio=this.refractionRatio;a.fog=this.fog;a.shading=this.shading;a.wireframe=this.wireframe;a.wireframeLinewidth=this.wireframeLinewidth;a.wireframeLinecap=this.wireframeLinecap;a.wireframeLinejoin=this.wireframeLinejoin;a.vertexColors=this.vertexColors;a.skinning=this.skinning;a.morphTargets=this.morphTargets;a.morphNormals=this.morphNormals;return a};
THREE.MeshDepthMaterial=function(a){THREE.Material.call(this);this.wireframe=false;this.wireframeLinewidth=1;this.setValues(a)};THREE.MeshDepthMaterial.prototype=Object.create(THREE.Material.prototype);THREE.MeshDepthMaterial.prototype.clone=function(){var a=new THREE.LineBasicMaterial;THREE.Material.prototype.clone.call(this,a);a.wireframe=this.wireframe;a.wireframeLinewidth=this.wireframeLinewidth;return a};
THREE.MeshNormalMaterial=function(a){THREE.Material.call(this,a);this.shading=THREE.FlatShading;this.wireframe=false;this.wireframeLinewidth=1;this.setValues(a)};THREE.MeshNormalMaterial.prototype=Object.create(THREE.Material.prototype);THREE.MeshNormalMaterial.prototype.clone=function(){var a=new THREE.MeshNormalMaterial;THREE.Material.prototype.clone.call(this,a);a.shading=this.shading;a.wireframe=this.wireframe;a.wireframeLinewidth=this.wireframeLinewidth;return a};THREE.MeshFaceMaterial=function(){};
THREE.MeshFaceMaterial.prototype.clone=function(){return new THREE.MeshFaceMaterial};THREE.ParticleBasicMaterial=function(a){THREE.Material.call(this);this.color=new THREE.Color(16777215);this.map=null;this.size=1;this.sizeAttenuation=true;this.vertexColors=false;this.fog=true;this.setValues(a)};THREE.ParticleBasicMaterial.prototype=Object.create(THREE.Material.prototype);
THREE.ParticleBasicMaterial.prototype.clone=function(){var a=new THREE.ParticleBasicMaterial;THREE.Material.prototype.clone.call(this,a);a.color.copy(this.color);a.map=this.map;a.size=this.size;a.sizeAttenuation=this.sizeAttenuation;a.vertexColors=this.vertexColors;a.fog=this.fog;return a};THREE.ParticleCanvasMaterial=function(a){THREE.Material.call(this);this.color=new THREE.Color(16777215);this.program=function(){};this.setValues(a)};THREE.ParticleCanvasMaterial.prototype=Object.create(THREE.Material.prototype);
THREE.ParticleCanvasMaterial.prototype.clone=function(){var a=new THREE.ParticleCanvasMaterial;THREE.Material.prototype.clone.call(this,a);a.color.copy(this.color);a.program=this.program;return a};THREE.ParticleDOMMaterial=function(a){this.domElement=a};THREE.ParticleDOMMaterial.prototype.clone=function(){return new THREE.ParticleDOMMaterial(this.domElement)};
THREE.ShaderMaterial=function(a){THREE.Material.call(this);this.vertexShader=this.fragmentShader="void main() {}";this.uniforms={};this.attributes=null;this.shading=THREE.SmoothShading;this.wireframe=false;this.wireframeLinewidth=1;this.lights=this.fog=false;this.vertexColors=THREE.NoColors;this.morphNormals=this.morphTargets=this.skinning=false;this.setValues(a)};THREE.ShaderMaterial.prototype=Object.create(THREE.Material.prototype);
THREE.ShaderMaterial.prototype.clone=function(){var a=new THREE.ShaderMaterial;THREE.Material.prototype.clone.call(this,a);a.fragmentShader=this.fragmentShader;a.vertexShader=this.vertexShader;a.uniforms=this.uniforms;a.attributes=this.attributes;a.shading=this.shading;a.wireframe=this.wireframe;a.wireframeLinewidth=this.wireframeLinewidth;a.fog=this.fog;a.lights=this.lights;a.vertexColors=this.vertexColors;a.skinning=this.skinning;a.morphTargets=this.morphTargets;a.morphNormals=this.morphNormals;
return a};
THREE.Texture=function(a,b,c,d,f,e,g,h,i){this.id=THREE.TextureCount++;this.image=a;this.mapping=b!==void 0?b:new THREE.UVMapping;this.wrapS=c!==void 0?c:THREE.ClampToEdgeWrapping;this.wrapT=d!==void 0?d:THREE.ClampToEdgeWrapping;this.magFilter=f!==void 0?f:THREE.LinearFilter;this.minFilter=e!==void 0?e:THREE.LinearMipMapLinearFilter;this.anisotropy=i!==void 0?i:1;this.format=g!==void 0?g:THREE.RGBAFormat;this.type=h!==void 0?h:THREE.UnsignedByteType;this.offset=new THREE.Vector2(0,0);this.repeat=new THREE.Vector2(1,
1);this.generateMipmaps=true;this.premultiplyAlpha=false;this.flipY=true;this.needsUpdate=false;this.onUpdate=null};THREE.Texture.prototype={constructor:THREE.Texture,clone:function(){var a=new THREE.Texture(this.image,this.mapping,this.wrapS,this.wrapT,this.magFilter,this.minFilter,this.format,this.type,this.anisotropy);a.offset.copy(this.offset);a.repeat.copy(this.repeat);a.generateMipmaps=this.generateMipmaps;a.premultiplyAlpha=this.premultiplyAlpha;a.flipY=this.flipY;return a}};
THREE.TextureCount=0;THREE.DataTexture=function(a,b,c,d,f,e,g,h,i,j){THREE.Texture.call(this,null,e,g,h,i,j,d,f);this.image={data:a,width:b,height:c}};THREE.DataTexture.prototype=Object.create(THREE.Texture.prototype);THREE.DataTexture.prototype.clone=function(){var a=new THREE.DataTexture(this.image.data,this.image.width,this.image.height,this.format,this.type,this.mapping,this.wrapS,this.wrapT,this.magFilter,this.minFilter);a.offset.copy(this.offset);a.repeat.copy(this.repeat);return a};
THREE.Particle=function(a){THREE.Object3D.call(this);this.material=a};THREE.Particle.prototype=Object.create(THREE.Object3D.prototype);THREE.ParticleSystem=function(a,b){THREE.Object3D.call(this);this.geometry=a;this.material=b!==void 0?b:new THREE.ParticleBasicMaterial({color:Math.random()*16777215});this.sortParticles=false;if(this.geometry){this.geometry.boundingSphere||this.geometry.computeBoundingSphere();this.boundRadius=a.boundingSphere.radius}this.frustumCulled=false};
THREE.ParticleSystem.prototype=Object.create(THREE.Object3D.prototype);THREE.Line=function(a,b,c){THREE.Object3D.call(this);this.geometry=a;this.material=b!==void 0?b:new THREE.LineBasicMaterial({color:Math.random()*16777215});this.type=c!==void 0?c:THREE.LineStrip;this.geometry&&(this.geometry.boundingSphere||this.geometry.computeBoundingSphere())};THREE.LineStrip=0;THREE.LinePieces=1;THREE.Line.prototype=Object.create(THREE.Object3D.prototype);
THREE.Mesh=function(a,b){THREE.Object3D.call(this);this.geometry=a;this.material=b!==void 0?b:new THREE.MeshBasicMaterial({color:Math.random()*16777215,wireframe:true});if(this.geometry){this.geometry.boundingSphere||this.geometry.computeBoundingSphere();this.boundRadius=a.boundingSphere.radius;if(this.geometry.morphTargets.length){this.morphTargetBase=-1;this.morphTargetForcedOrder=[];this.morphTargetInfluences=[];this.morphTargetDictionary={};for(var c=0;c<this.geometry.morphTargets.length;c++){this.morphTargetInfluences.push(0);
this.morphTargetDictionary[this.geometry.morphTargets[c].name]=c}}}};THREE.Mesh.prototype=Object.create(THREE.Object3D.prototype);THREE.Mesh.prototype.getMorphTargetIndexByName=function(a){if(this.morphTargetDictionary[a]!==void 0)return this.morphTargetDictionary[a];console.log("THREE.Mesh.getMorphTargetIndexByName: morph target "+a+" does not exist. Returning 0.");return 0};THREE.Bone=function(a){THREE.Object3D.call(this);this.skin=a;this.skinMatrix=new THREE.Matrix4};THREE.Bone.prototype=Object.create(THREE.Object3D.prototype);
THREE.Bone.prototype.update=function(a,b){this.matrixAutoUpdate&&(b=b|this.updateMatrix());if(b||this.matrixWorldNeedsUpdate){a?this.skinMatrix.multiply(a,this.matrix):this.skinMatrix.copy(this.matrix);this.matrixWorldNeedsUpdate=false;b=true}var c,d=this.children.length;for(c=0;c<d;c++)this.children[c].update(this.skinMatrix,b)};
THREE.SkinnedMesh=function(a,b,c){THREE.Mesh.call(this,a,b);this.useVertexTexture=c!==void 0?c:true;this.identityMatrix=new THREE.Matrix4;this.bones=[];this.boneMatrices=[];var d,f,e;if(this.geometry.bones!==void 0){for(a=0;a<this.geometry.bones.length;a++){c=this.geometry.bones[a];d=c.pos;f=c.rotq;e=c.scl;b=this.addBone();b.name=c.name;b.position.set(d[0],d[1],d[2]);b.quaternion.set(f[0],f[1],f[2],f[3]);b.useQuaternion=true;e!==void 0?b.scale.set(e[0],e[1],e[2]):b.scale.set(1,1,1)}for(a=0;a<this.bones.length;a++){c=
this.geometry.bones[a];b=this.bones[a];c.parent===-1?this.add(b):this.bones[c.parent].add(b)}a=this.bones.length;if(this.useVertexTexture){this.boneTextureHeight=this.boneTextureWidth=a=a>256?64:a>64?32:a>16?16:8;this.boneMatrices=new Float32Array(this.boneTextureWidth*this.boneTextureHeight*4);this.boneTexture=new THREE.DataTexture(this.boneMatrices,this.boneTextureWidth,this.boneTextureHeight,THREE.RGBAFormat,THREE.FloatType);this.boneTexture.minFilter=THREE.NearestFilter;this.boneTexture.magFilter=
THREE.NearestFilter;this.boneTexture.generateMipmaps=false;this.boneTexture.flipY=false}else this.boneMatrices=new Float32Array(16*a);this.pose()}};THREE.SkinnedMesh.prototype=Object.create(THREE.Mesh.prototype);THREE.SkinnedMesh.prototype.addBone=function(a){a===void 0&&(a=new THREE.Bone(this));this.bones.push(a);return a};
THREE.SkinnedMesh.prototype.updateMatrixWorld=function(a){this.matrixAutoUpdate&&this.updateMatrix();if(this.matrixWorldNeedsUpdate||a){this.parent?this.matrixWorld.multiply(this.parent.matrixWorld,this.matrix):this.matrixWorld.copy(this.matrix);this.matrixWorldNeedsUpdate=false}for(var a=0,b=this.children.length;a<b;a++){var c=this.children[a];c instanceof THREE.Bone?c.update(this.identityMatrix,false):c.updateMatrixWorld(true)}for(var b=this.bones.length,c=this.bones,d=this.boneMatrices,a=0;a<b;a++)c[a].skinMatrix.flattenToArrayOffset(d,
a*16);if(this.useVertexTexture)this.boneTexture.needsUpdate=true};
THREE.SkinnedMesh.prototype.pose=function(){this.updateMatrixWorld(true);for(var a,b=[],c=0;c<this.bones.length;c++){a=this.bones[c];var d=new THREE.Matrix4;d.getInverse(a.skinMatrix);b.push(d);a.skinMatrix.flattenToArrayOffset(this.boneMatrices,c*16)}if(this.geometry.skinVerticesA===void 0){this.geometry.skinVerticesA=[];this.geometry.skinVerticesB=[];for(a=0;a<this.geometry.skinIndices.length;a++){var c=this.geometry.vertices[a],f=this.geometry.skinIndices[a].x,e=this.geometry.skinIndices[a].y,
d=new THREE.Vector3(c.x,c.y,c.z);this.geometry.skinVerticesA.push(b[f].multiplyVector3(d));d=new THREE.Vector3(c.x,c.y,c.z);this.geometry.skinVerticesB.push(b[e].multiplyVector3(d));if(this.geometry.skinWeights[a].x+this.geometry.skinWeights[a].y!==1){c=(1-(this.geometry.skinWeights[a].x+this.geometry.skinWeights[a].y))*0.5;this.geometry.skinWeights[a].x=this.geometry.skinWeights[a].x+c;this.geometry.skinWeights[a].y=this.geometry.skinWeights[a].y+c}}}};
THREE.MorphAnimMesh=function(a,b){THREE.Mesh.call(this,a,b);this.duration=1E3;this.mirroredLoop=false;this.currentKeyframe=this.lastKeyframe=this.time=0;this.direction=1;this.directionBackwards=false;this.setFrameRange(0,this.geometry.morphTargets.length-1)};THREE.MorphAnimMesh.prototype=Object.create(THREE.Mesh.prototype);THREE.MorphAnimMesh.prototype.setFrameRange=function(a,b){this.startKeyframe=a;this.endKeyframe=b;this.length=this.endKeyframe-this.startKeyframe+1};
THREE.MorphAnimMesh.prototype.setDirectionForward=function(){this.direction=1;this.directionBackwards=false};THREE.MorphAnimMesh.prototype.setDirectionBackward=function(){this.direction=-1;this.directionBackwards=true};
THREE.MorphAnimMesh.prototype.parseAnimations=function(){var a=this.geometry;if(!a.animations)a.animations={};for(var b,c=a.animations,d=/([a-z]+)(\d+)/,f=0,e=a.morphTargets.length;f<e;f++){var g=a.morphTargets[f].name.match(d);if(g&&g.length>1){g=g[1];c[g]||(c[g]={start:Infinity,end:-Infinity});var h=c[g];if(f<h.start)h.start=f;if(f>h.end)h.end=f;b||(b=g)}}a.firstAnimation=b};
THREE.MorphAnimMesh.prototype.setAnimationLabel=function(a,b,c){if(!this.geometry.animations)this.geometry.animations={};this.geometry.animations[a]={start:b,end:c}};THREE.MorphAnimMesh.prototype.playAnimation=function(a,b){var c=this.geometry.animations[a];if(c){this.setFrameRange(c.start,c.end);this.duration=1E3*((c.end-c.start)/b);this.time=0}else console.warn("animation["+a+"] undefined")};
THREE.MorphAnimMesh.prototype.updateAnimation=function(a){var b=this.duration/this.length;this.time=this.time+this.direction*a;if(this.mirroredLoop){if(this.time>this.duration||this.time<0){this.direction=this.direction*-1;if(this.time>this.duration){this.time=this.duration;this.directionBackwards=true}if(this.time<0){this.time=0;this.directionBackwards=false}}}else{this.time=this.time%this.duration;if(this.time<0)this.time=this.time+this.duration}a=this.startKeyframe+THREE.Math.clamp(Math.floor(this.time/
b),0,this.length-1);if(a!==this.currentKeyframe){this.morphTargetInfluences[this.lastKeyframe]=0;this.morphTargetInfluences[this.currentKeyframe]=1;this.morphTargetInfluences[a]=0;this.lastKeyframe=this.currentKeyframe;this.currentKeyframe=a}b=this.time%b/b;this.directionBackwards&&(b=1-b);this.morphTargetInfluences[this.currentKeyframe]=b;this.morphTargetInfluences[this.lastKeyframe]=1-b};THREE.Ribbon=function(a,b){THREE.Object3D.call(this);this.geometry=a;this.material=b};
THREE.Ribbon.prototype=Object.create(THREE.Object3D.prototype);THREE.LOD=function(){THREE.Object3D.call(this);this.LODs=[]};THREE.LOD.prototype=Object.create(THREE.Object3D.prototype);THREE.LOD.prototype.addLevel=function(a,b){b===void 0&&(b=0);for(var b=Math.abs(b),c=0;c<this.LODs.length;c++)if(b<this.LODs[c].visibleAtDistance)break;this.LODs.splice(c,0,{visibleAtDistance:b,object3D:a});this.add(a)};
THREE.LOD.prototype.update=function(a){if(this.LODs.length>1){a.matrixWorldInverse.getInverse(a.matrixWorld);a=a.matrixWorldInverse;a=-(a.elements[2]*this.matrixWorld.elements[12]+a.elements[6]*this.matrixWorld.elements[13]+a.elements[10]*this.matrixWorld.elements[14]+a.elements[14]);this.LODs[0].object3D.visible=true;for(var b=1;b<this.LODs.length;b++)if(a>=this.LODs[b].visibleAtDistance){this.LODs[b-1].object3D.visible=false;this.LODs[b].object3D.visible=true}else break;for(;b<this.LODs.length;b++)this.LODs[b].object3D.visible=
false}};
THREE.Sprite=function(a){THREE.Object3D.call(this);this.color=a.color!==void 0?new THREE.Color(a.color):new THREE.Color(16777215);this.map=a.map!==void 0?a.map:new THREE.Texture;this.blending=a.blending!==void 0?a.blending:THREE.NormalBlending;this.blendSrc=a.blendSrc!==void 0?a.blendSrc:THREE.SrcAlphaFactor;this.blendDst=a.blendDst!==void 0?a.blendDst:THREE.OneMinusSrcAlphaFactor;this.blendEquation=a.blendEquation!==void 0?a.blendEquation:THREE.AddEquation;this.useScreenCoordinates=a.useScreenCoordinates!==void 0?
a.useScreenCoordinates:true;this.mergeWith3D=a.mergeWith3D!==void 0?a.mergeWith3D:!this.useScreenCoordinates;this.affectedByDistance=a.affectedByDistance!==void 0?a.affectedByDistance:!this.useScreenCoordinates;this.scaleByViewport=a.scaleByViewport!==void 0?a.scaleByViewport:!this.affectedByDistance;this.alignment=a.alignment instanceof THREE.Vector2?a.alignment:THREE.SpriteAlignment.center;this.rotation3d=this.rotation;this.rotation=0;this.opacity=1;this.uvOffset=new THREE.Vector2(0,0);this.uvScale=
new THREE.Vector2(1,1)};THREE.Sprite.prototype=Object.create(THREE.Object3D.prototype);THREE.Sprite.prototype.updateMatrix=function(){this.matrix.setPosition(this.position);this.rotation3d.set(0,0,this.rotation);this.matrix.setRotationFromEuler(this.rotation3d);if(this.scale.x!==1||this.scale.y!==1){this.matrix.scale(this.scale);this.boundRadiusScale=Math.max(this.scale.x,this.scale.y)}this.matrixWorldNeedsUpdate=true};THREE.SpriteAlignment={};THREE.SpriteAlignment.topLeft=new THREE.Vector2(1,-1);
THREE.SpriteAlignment.topCenter=new THREE.Vector2(0,-1);THREE.SpriteAlignment.topRight=new THREE.Vector2(-1,-1);THREE.SpriteAlignment.centerLeft=new THREE.Vector2(1,0);THREE.SpriteAlignment.center=new THREE.Vector2(0,0);THREE.SpriteAlignment.centerRight=new THREE.Vector2(-1,0);THREE.SpriteAlignment.bottomLeft=new THREE.Vector2(1,1);THREE.SpriteAlignment.bottomCenter=new THREE.Vector2(0,1);THREE.SpriteAlignment.bottomRight=new THREE.Vector2(-1,1);
THREE.Scene=function(){THREE.Object3D.call(this);this.overrideMaterial=this.fog=null;this.matrixAutoUpdate=false;this.__objects=[];this.__lights=[];this.__objectsAdded=[];this.__objectsRemoved=[]};THREE.Scene.prototype=Object.create(THREE.Object3D.prototype);
THREE.Scene.prototype.__addObject=function(a){if(a instanceof THREE.Light){this.__lights.indexOf(a)===-1&&this.__lights.push(a);a.target&&a.target.parent===void 0&&this.add(a.target)}else if(!(a instanceof THREE.Camera||a instanceof THREE.Bone)&&this.__objects.indexOf(a)===-1){this.__objects.push(a);this.__objectsAdded.push(a);var b=this.__objectsRemoved.indexOf(a);b!==-1&&this.__objectsRemoved.splice(b,1)}for(b=0;b<a.children.length;b++)this.__addObject(a.children[b])};
THREE.Scene.prototype.__removeObject=function(a){if(a instanceof THREE.Light){var b=this.__lights.indexOf(a);b!==-1&&this.__lights.splice(b,1)}else if(!(a instanceof THREE.Camera)){b=this.__objects.indexOf(a);if(b!==-1){this.__objects.splice(b,1);this.__objectsRemoved.push(a);b=this.__objectsAdded.indexOf(a);b!==-1&&this.__objectsAdded.splice(b,1)}}for(b=0;b<a.children.length;b++)this.__removeObject(a.children[b])};
THREE.Fog=function(a,b,c){this.color=new THREE.Color(a);this.near=b!==void 0?b:1;this.far=c!==void 0?c:1E3};THREE.FogExp2=function(a,b){this.color=new THREE.Color(a);this.density=b!==void 0?b:2.5E-4};
THREE.CanvasRenderer=function(a){function b(a){if(t!==a)t=n.globalAlpha=a}function c(a){if(u!==a){if(a===THREE.NormalBlending)n.globalCompositeOperation="source-over";else if(a===THREE.AdditiveBlending)n.globalCompositeOperation="lighter";else if(a===THREE.SubtractiveBlending)n.globalCompositeOperation="darker";u=a}}function d(a){if(z!==a)z=n.strokeStyle=a}function f(a){if(x!==a)x=n.fillStyle=a}console.log("THREE.CanvasRenderer",THREE.REVISION);var a=a||{},e=this,g,h,i,j=new THREE.Projector,l=a.canvas!==
void 0?a.canvas:document.createElement("canvas"),o,m,p,q,n=l.getContext("2d"),r=new THREE.Color(0),s=0,t=1,u=0,z=null,x=null,A=null,B=null,C=null,v,J,F,O,P=new THREE.RenderableVertex,G=new THREE.RenderableVertex,E,I,R,M,H,V,Q,L,W,ha,ia,da,Z=new THREE.Color,ba=new THREE.Color,$=new THREE.Color,ca=new THREE.Color,ma=new THREE.Color,sa=[],bb=[],qa,Ia,Sa,Va,Mb,ub,Ub,vb,fb,gb,hb=new THREE.Rectangle,Ka=new THREE.Rectangle,Da=new THREE.Rectangle,Za=false,Ea=new THREE.Color,Ta=new THREE.Color,La=new THREE.Color,
ta=new THREE.Vector3,ib,k,eb,Wa,Nb,jb,a=16;ib=document.createElement("canvas");ib.width=ib.height=2;k=ib.getContext("2d");k.fillStyle="rgba(0,0,0,1)";k.fillRect(0,0,2,2);eb=k.getImageData(0,0,2,2);Wa=eb.data;Nb=document.createElement("canvas");Nb.width=Nb.height=a;jb=Nb.getContext("2d");jb.translate(-a/2,-a/2);jb.scale(a,a);a--;this.domElement=l;this.sortElements=this.sortObjects=this.autoClear=true;this.info={render:{vertices:0,faces:0}};this.setSize=function(a,b){o=a;m=b;p=Math.floor(o/2);q=Math.floor(m/
2);l.width=o;l.height=m;hb.set(-p,-q,p,q);Ka.set(-p,-q,p,q);t=1;u=0;C=B=A=x=z=null};this.setClearColor=function(a,b){r.copy(a);s=b!==void 0?b:1;Ka.set(-p,-q,p,q)};this.setClearColorHex=function(a,b){r.setHex(a);s=b!==void 0?b:1;Ka.set(-p,-q,p,q)};this.clear=function(){n.setTransform(1,0,0,-1,p,q);if(Ka.isEmpty()===false){Ka.minSelf(hb);Ka.inflate(2);s<1&&n.clearRect(Math.floor(Ka.getX()),Math.floor(Ka.getY()),Math.floor(Ka.getWidth()),Math.floor(Ka.getHeight()));if(s>0){c(THREE.NormalBlending);b(1);
f("rgba("+Math.floor(r.r*255)+","+Math.floor(r.g*255)+","+Math.floor(r.b*255)+","+s+")");n.fillRect(Math.floor(Ka.getX()),Math.floor(Ka.getY()),Math.floor(Ka.getWidth()),Math.floor(Ka.getHeight()))}Ka.empty()}};this.render=function(a,l){function o(a,b,c,d){var f,e,g,h,k,i;f=0;for(e=a.length;f<e;f++){g=a[f];h=g.color;if(g instanceof THREE.DirectionalLight){k=g.matrixWorld.getPosition().normalize();i=c.dot(k);if(!(i<=0)){i=i*g.intensity;d.r=d.r+h.r*i;d.g=d.g+h.g*i;d.b=d.b+h.b*i}}else if(g instanceof
THREE.PointLight){k=g.matrixWorld.getPosition();i=c.dot(ta.sub(k,b).normalize());if(!(i<=0)){i=i*(g.distance==0?1:1-Math.min(b.distanceTo(k)/g.distance,1));if(i!=0){i=i*g.intensity;d.r=d.r+h.r*i;d.g=d.g+h.g*i;d.b=d.b+h.b*i}}}}}function m(a,d,f,g,h,k,j,n){e.info.render.vertices=e.info.render.vertices+3;e.info.render.faces++;b(n.opacity);c(n.blending);E=a.positionScreen.x;I=a.positionScreen.y;R=d.positionScreen.x;M=d.positionScreen.y;H=f.positionScreen.x;V=f.positionScreen.y;r(E,I,R,M,H,V);if(n instanceof
THREE.MeshBasicMaterial)if(n.map!==null){if(n.map.mapping instanceof THREE.UVMapping){Va=j.uvs[0];u(E,I,R,M,H,V,Va[g].u,Va[g].v,Va[h].u,Va[h].v,Va[k].u,Va[k].v,n.map)}}else if(n.envMap!==null){if(n.envMap.mapping instanceof THREE.SphericalReflectionMapping){a=l.matrixWorldInverse;ta.copy(j.vertexNormalsWorld[g]);Mb=(ta.x*a.elements[0]+ta.y*a.elements[4]+ta.z*a.elements[8])*0.5+0.5;ub=(ta.x*a.elements[1]+ta.y*a.elements[5]+ta.z*a.elements[9])*0.5+0.5;ta.copy(j.vertexNormalsWorld[h]);Ub=(ta.x*a.elements[0]+
ta.y*a.elements[4]+ta.z*a.elements[8])*0.5+0.5;vb=(ta.x*a.elements[1]+ta.y*a.elements[5]+ta.z*a.elements[9])*0.5+0.5;ta.copy(j.vertexNormalsWorld[k]);fb=(ta.x*a.elements[0]+ta.y*a.elements[4]+ta.z*a.elements[8])*0.5+0.5;gb=(ta.x*a.elements[1]+ta.y*a.elements[5]+ta.z*a.elements[9])*0.5+0.5;u(E,I,R,M,H,V,Mb,ub,Ub,vb,fb,gb,n.envMap)}}else n.wireframe===true?s(n.color,n.wireframeLinewidth,n.wireframeLinecap,n.wireframeLinejoin):t(n.color);else if(n instanceof THREE.MeshLambertMaterial)if(Za===true)if(n.wireframe===
false&&n.shading==THREE.SmoothShading&&j.vertexNormalsWorld.length==3){ba.r=$.r=ca.r=Ea.r;ba.g=$.g=ca.g=Ea.g;ba.b=$.b=ca.b=Ea.b;o(i,j.v1.positionWorld,j.vertexNormalsWorld[0],ba);o(i,j.v2.positionWorld,j.vertexNormalsWorld[1],$);o(i,j.v3.positionWorld,j.vertexNormalsWorld[2],ca);ba.r=Math.max(0,Math.min(n.color.r*ba.r,1));ba.g=Math.max(0,Math.min(n.color.g*ba.g,1));ba.b=Math.max(0,Math.min(n.color.b*ba.b,1));$.r=Math.max(0,Math.min(n.color.r*$.r,1));$.g=Math.max(0,Math.min(n.color.g*$.g,1));$.b=Math.max(0,
Math.min(n.color.b*$.b,1));ca.r=Math.max(0,Math.min(n.color.r*ca.r,1));ca.g=Math.max(0,Math.min(n.color.g*ca.g,1));ca.b=Math.max(0,Math.min(n.color.b*ca.b,1));ma.r=($.r+ca.r)*0.5;ma.g=($.g+ca.g)*0.5;ma.b=($.b+ca.b)*0.5;Sa=x(ba,$,ca,ma);z(E,I,R,M,H,V,0,0,1,0,0,1,Sa)}else{Z.r=Ea.r;Z.g=Ea.g;Z.b=Ea.b;o(i,j.centroidWorld,j.normalWorld,Z);Z.r=Math.max(0,Math.min(n.color.r*Z.r,1));Z.g=Math.max(0,Math.min(n.color.g*Z.g,1));Z.b=Math.max(0,Math.min(n.color.b*Z.b,1));n.wireframe===true?s(Z,n.wireframeLinewidth,
n.wireframeLinecap,n.wireframeLinejoin):t(Z)}else n.wireframe===true?s(n.color,n.wireframeLinewidth,n.wireframeLinecap,n.wireframeLinejoin):t(n.color);else if(n instanceof THREE.MeshDepthMaterial){qa=l.near;Ia=l.far;ba.r=ba.g=ba.b=1-lc(a.positionScreen.z,qa,Ia);$.r=$.g=$.b=1-lc(d.positionScreen.z,qa,Ia);ca.r=ca.g=ca.b=1-lc(f.positionScreen.z,qa,Ia);ma.r=($.r+ca.r)*0.5;ma.g=($.g+ca.g)*0.5;ma.b=($.b+ca.b)*0.5;Sa=x(ba,$,ca,ma);z(E,I,R,M,H,V,0,0,1,0,0,1,Sa)}else if(n instanceof THREE.MeshNormalMaterial){Z.r=
sc(j.normalWorld.x);Z.g=sc(j.normalWorld.y);Z.b=sc(j.normalWorld.z);n.wireframe===true?s(Z,n.wireframeLinewidth,n.wireframeLinecap,n.wireframeLinejoin):t(Z)}}function r(a,b,c,d,f,e){n.beginPath();n.moveTo(a,b);n.lineTo(c,d);n.lineTo(f,e);n.lineTo(a,b)}function Vb(a,b,c,d,f,e,g,h){n.beginPath();n.moveTo(a,b);n.lineTo(c,d);n.lineTo(f,e);n.lineTo(g,h);n.lineTo(a,b)}function s(a,b,c,f){if(A!==b)A=n.lineWidth=b;if(B!==c)B=n.lineCap=c;if(C!==f)C=n.lineJoin=f;d(a.getContextStyle());n.stroke();Da.inflate(b*
2)}function t(a){f(a.getContextStyle());n.fill()}function u(a,b,c,d,e,g,h,i,k,j,l,o,m){if(!(m.image===void 0||m.image.width===0)){if(m.needsUpdate===true||sa[m.id]===void 0){var p=m.wrapS==THREE.RepeatWrapping,kc=m.wrapT==THREE.RepeatWrapping;sa[m.id]=n.createPattern(m.image,p===true&&kc===true?"repeat":p===true&&kc===false?"repeat-x":p===false&&kc===true?"repeat-y":"no-repeat");m.needsUpdate=false}f(sa[m.id]);var p=m.offset.x/m.repeat.x,kc=m.offset.y/m.repeat.y,q=m.image.width*m.repeat.x,Vb=m.image.height*
m.repeat.y,h=(h+p)*q,i=(1-i+kc)*Vb,c=c-a,d=d-b,e=e-a,g=g-b,k=(k+p)*q-h,j=(1-j+kc)*Vb-i,l=(l+p)*q-h,o=(1-o+kc)*Vb-i,p=k*o-l*j;if(p===0){if(bb[m.id]===void 0){b=document.createElement("canvas");b.width=m.image.width;b.height=m.image.height;b=b.getContext("2d");b.drawImage(m.image,0,0);bb[m.id]=b.getImageData(0,0,m.image.width,m.image.height).data}b=bb[m.id];h=(Math.floor(h)+Math.floor(i)*m.image.width)*4;Z.setRGB(b[h]/255,b[h+1]/255,b[h+2]/255);t(Z)}else{p=1/p;m=(o*c-j*e)*p;j=(o*d-j*g)*p;c=(k*e-l*c)*
p;d=(k*g-l*d)*p;a=a-m*h-c*i;h=b-j*h-d*i;n.save();n.transform(m,j,c,d,a,h);n.fill();n.restore()}}}function z(a,b,c,d,f,e,g,h,i,k,j,l,m){var o,p;o=m.width-1;p=m.height-1;g=g*o;h=h*p;c=c-a;d=d-b;f=f-a;e=e-b;i=i*o-g;k=k*p-h;j=j*o-g;l=l*p-h;p=1/(i*l-j*k);o=(l*c-k*f)*p;k=(l*d-k*e)*p;c=(i*f-j*c)*p;d=(i*e-j*d)*p;a=a-o*g-c*h;b=b-k*g-d*h;n.save();n.transform(o,k,c,d,a,b);n.clip();n.drawImage(m,0,0);n.restore()}function x(a,b,c,d){var f=~~(a.r*255),e=~~(a.g*255),a=~~(a.b*255),g=~~(b.r*255),h=~~(b.g*255),b=~~(b.b*
255),i=~~(c.r*255),j=~~(c.g*255),c=~~(c.b*255),l=~~(d.r*255),n=~~(d.g*255),d=~~(d.b*255);Wa[0]=f<0?0:f>255?255:f;Wa[1]=e<0?0:e>255?255:e;Wa[2]=a<0?0:a>255?255:a;Wa[4]=g<0?0:g>255?255:g;Wa[5]=h<0?0:h>255?255:h;Wa[6]=b<0?0:b>255?255:b;Wa[8]=i<0?0:i>255?255:i;Wa[9]=j<0?0:j>255?255:j;Wa[10]=c<0?0:c>255?255:c;Wa[12]=l<0?0:l>255?255:l;Wa[13]=n<0?0:n>255?255:n;Wa[14]=d<0?0:d>255?255:d;k.putImageData(eb,0,0);jb.drawImage(ib,0,0);return Nb}function lc(a,b,c){a=(a-b)/(c-b);return a*a*(3-2*a)}function sc(a){a=
(a+1)*0.5;return a<0?0:a>1?1:a}function Wb(a,b){var c=b.x-a.x,d=b.y-a.y,f=c*c+d*d;if(f!==0){f=1/Math.sqrt(f);c=c*f;d=d*f;b.x=b.x+c;b.y=b.y+d;a.x=a.x-c;a.y=a.y-d}}if(l instanceof THREE.Camera===false)console.error("THREE.CanvasRenderer.render: camera is not an instance of THREE.Camera.");else{var mc,tc,la,Y;this.autoClear===true?this.clear():n.setTransform(1,0,0,-1,p,q);e.info.render.vertices=0;e.info.render.faces=0;g=j.projectScene(a,l,this.sortElements);h=g.elements;i=g.lights;Za=i.length>0;if(Za===
true){mc=i;var ja,va;Ea.setRGB(0,0,0);Ta.setRGB(0,0,0);La.setRGB(0,0,0);tc=0;for(Y=mc.length;tc<Y;tc++){ja=mc[tc];va=ja.color;if(ja instanceof THREE.AmbientLight){Ea.r=Ea.r+va.r;Ea.g=Ea.g+va.g;Ea.b=Ea.b+va.b}else if(ja instanceof THREE.DirectionalLight){Ta.r=Ta.r+va.r;Ta.g=Ta.g+va.g;Ta.b=Ta.b+va.b}else if(ja instanceof THREE.PointLight){La.r=La.r+va.r;La.g=La.g+va.g;La.b=La.b+va.b}}}mc=0;for(tc=h.length;mc<tc;mc++){la=h[mc];Y=la.material;if(!(Y===void 0||Y.visible===false)){Da.empty();if(la instanceof
THREE.RenderableParticle){v=la;v.x=v.x*p;v.y=v.y*q;ja=v;va=la;b(Y.opacity);c(Y.blending);var pb=void 0,qb=void 0,kb=void 0,lb=void 0,uc=la=void 0,bd=void 0;if(Y instanceof THREE.ParticleBasicMaterial)if(Y.map===null){kb=va.object.scale.x;lb=va.object.scale.y;kb=kb*va.scale.x*p;lb=lb*va.scale.y*q;Da.set(ja.x-kb,ja.y-lb,ja.x+kb,ja.y+lb);if(hb.intersects(Da)!==false){f(Y.color.getContextStyle());n.save();n.translate(ja.x,ja.y);n.rotate(-va.rotation);n.scale(kb,lb);n.fillRect(-1,-1,2,2);n.restore()}}else{la=
Y.map.image;uc=la.width>>1;bd=la.height>>1;kb=va.scale.x*p;lb=va.scale.y*q;pb=kb*uc;qb=lb*bd;Da.set(ja.x-pb,ja.y-qb,ja.x+pb,ja.y+qb);if(hb.intersects(Da)!==false){n.save();n.translate(ja.x,ja.y);n.rotate(-va.rotation);n.scale(kb,-lb);n.translate(-uc,-bd);n.drawImage(la,0,0);n.restore()}}else if(Y instanceof THREE.ParticleCanvasMaterial){pb=va.scale.x*p;qb=va.scale.y*q;Da.set(ja.x-pb,ja.y-qb,ja.x+pb,ja.y+qb);if(hb.intersects(Da)!==false){d(Y.color.getContextStyle());f(Y.color.getContextStyle());n.save();
n.translate(ja.x,ja.y);n.rotate(-va.rotation);n.scale(pb,qb);Y.program(n);n.restore()}}}else if(la instanceof THREE.RenderableLine){v=la.v1;J=la.v2;v.positionScreen.x=v.positionScreen.x*p;v.positionScreen.y=v.positionScreen.y*q;J.positionScreen.x=J.positionScreen.x*p;J.positionScreen.y=J.positionScreen.y*q;Da.addPoint(v.positionScreen.x,v.positionScreen.y);Da.addPoint(J.positionScreen.x,J.positionScreen.y);if(hb.intersects(Da)===true){ja=v;va=J;b(Y.opacity);c(Y.blending);n.beginPath();n.moveTo(ja.positionScreen.x,
ja.positionScreen.y);n.lineTo(va.positionScreen.x,va.positionScreen.y);n.closePath();if(Y instanceof THREE.LineBasicMaterial){ja=Y.linewidth;if(A!==ja)A=n.lineWidth=ja;ja=Y.linecap;if(B!==ja)B=n.lineCap=ja;ja=Y.linejoin;if(C!==ja)C=n.lineJoin=ja;d(Y.color.getContextStyle());n.stroke();Da.inflate(Y.linewidth*2)}}}else if(la instanceof THREE.RenderableFace3){v=la.v1;J=la.v2;F=la.v3;v.positionScreen.x=v.positionScreen.x*p;v.positionScreen.y=v.positionScreen.y*q;J.positionScreen.x=J.positionScreen.x*
p;J.positionScreen.y=J.positionScreen.y*q;F.positionScreen.x=F.positionScreen.x*p;F.positionScreen.y=F.positionScreen.y*q;if(Y.overdraw===true){Wb(v.positionScreen,J.positionScreen);Wb(J.positionScreen,F.positionScreen);Wb(F.positionScreen,v.positionScreen)}Da.add3Points(v.positionScreen.x,v.positionScreen.y,J.positionScreen.x,J.positionScreen.y,F.positionScreen.x,F.positionScreen.y);hb.intersects(Da)===true&&m(v,J,F,0,1,2,la,Y,a)}else if(la instanceof THREE.RenderableFace4){v=la.v1;J=la.v2;F=la.v3;
O=la.v4;v.positionScreen.x=v.positionScreen.x*p;v.positionScreen.y=v.positionScreen.y*q;J.positionScreen.x=J.positionScreen.x*p;J.positionScreen.y=J.positionScreen.y*q;F.positionScreen.x=F.positionScreen.x*p;F.positionScreen.y=F.positionScreen.y*q;O.positionScreen.x=O.positionScreen.x*p;O.positionScreen.y=O.positionScreen.y*q;P.positionScreen.copy(J.positionScreen);G.positionScreen.copy(O.positionScreen);if(Y.overdraw===true){Wb(v.positionScreen,J.positionScreen);Wb(J.positionScreen,O.positionScreen);
Wb(O.positionScreen,v.positionScreen);Wb(F.positionScreen,P.positionScreen);Wb(F.positionScreen,G.positionScreen)}Da.addPoint(v.positionScreen.x,v.positionScreen.y);Da.addPoint(J.positionScreen.x,J.positionScreen.y);Da.addPoint(F.positionScreen.x,F.positionScreen.y);Da.addPoint(O.positionScreen.x,O.positionScreen.y);if(hb.intersects(Da)===true){ja=v;va=J;pb=F;qb=O;kb=P;lb=G;uc=a;e.info.render.vertices=e.info.render.vertices+4;e.info.render.faces++;b(Y.opacity);c(Y.blending);if(Y.map!==void 0&&Y.map!==
null||Y.envMap!==void 0&&Y.envMap!==null){m(ja,va,qb,0,1,3,la,Y,uc);m(kb,pb,lb,1,2,3,la,Y,uc)}else{E=ja.positionScreen.x;I=ja.positionScreen.y;R=va.positionScreen.x;M=va.positionScreen.y;H=pb.positionScreen.x;V=pb.positionScreen.y;Q=qb.positionScreen.x;L=qb.positionScreen.y;W=kb.positionScreen.x;ha=kb.positionScreen.y;ia=lb.positionScreen.x;da=lb.positionScreen.y;if(Y instanceof THREE.MeshBasicMaterial){Vb(E,I,R,M,H,V,Q,L);Y.wireframe===true?s(Y.color,Y.wireframeLinewidth,Y.wireframeLinecap,Y.wireframeLinejoin):
t(Y.color)}else if(Y instanceof THREE.MeshLambertMaterial)if(Za===true)if(!Y.wireframe&&Y.shading==THREE.SmoothShading&&la.vertexNormalsWorld.length==4){ba.r=$.r=ca.r=ma.r=Ea.r;ba.g=$.g=ca.g=ma.g=Ea.g;ba.b=$.b=ca.b=ma.b=Ea.b;o(i,la.v1.positionWorld,la.vertexNormalsWorld[0],ba);o(i,la.v2.positionWorld,la.vertexNormalsWorld[1],$);o(i,la.v4.positionWorld,la.vertexNormalsWorld[3],ca);o(i,la.v3.positionWorld,la.vertexNormalsWorld[2],ma);ba.r=Math.max(0,Math.min(Y.color.r*ba.r,1));ba.g=Math.max(0,Math.min(Y.color.g*
ba.g,1));ba.b=Math.max(0,Math.min(Y.color.b*ba.b,1));$.r=Math.max(0,Math.min(Y.color.r*$.r,1));$.g=Math.max(0,Math.min(Y.color.g*$.g,1));$.b=Math.max(0,Math.min(Y.color.b*$.b,1));ca.r=Math.max(0,Math.min(Y.color.r*ca.r,1));ca.g=Math.max(0,Math.min(Y.color.g*ca.g,1));ca.b=Math.max(0,Math.min(Y.color.b*ca.b,1));ma.r=Math.max(0,Math.min(Y.color.r*ma.r,1));ma.g=Math.max(0,Math.min(Y.color.g*ma.g,1));ma.b=Math.max(0,Math.min(Y.color.b*ma.b,1));Sa=x(ba,$,ca,ma);r(E,I,R,M,Q,L);z(E,I,R,M,Q,L,0,0,1,0,0,1,
Sa);r(W,ha,H,V,ia,da);z(W,ha,H,V,ia,da,1,0,1,1,0,1,Sa)}else{Z.r=Ea.r;Z.g=Ea.g;Z.b=Ea.b;o(i,la.centroidWorld,la.normalWorld,Z);Z.r=Math.max(0,Math.min(Y.color.r*Z.r,1));Z.g=Math.max(0,Math.min(Y.color.g*Z.g,1));Z.b=Math.max(0,Math.min(Y.color.b*Z.b,1));Vb(E,I,R,M,H,V,Q,L);Y.wireframe===true?s(Z,Y.wireframeLinewidth,Y.wireframeLinecap,Y.wireframeLinejoin):t(Z)}else{Vb(E,I,R,M,H,V,Q,L);Y.wireframe===true?s(Y.color,Y.wireframeLinewidth,Y.wireframeLinecap,Y.wireframeLinejoin):t(Y.color)}else if(Y instanceof
THREE.MeshNormalMaterial){Z.r=sc(la.normalWorld.x);Z.g=sc(la.normalWorld.y);Z.b=sc(la.normalWorld.z);Vb(E,I,R,M,H,V,Q,L);Y.wireframe===true?s(Z,Y.wireframeLinewidth,Y.wireframeLinecap,Y.wireframeLinejoin):t(Z)}else if(Y instanceof THREE.MeshDepthMaterial){qa=l.near;Ia=l.far;ba.r=ba.g=ba.b=1-lc(ja.positionScreen.z,qa,Ia);$.r=$.g=$.b=1-lc(va.positionScreen.z,qa,Ia);ca.r=ca.g=ca.b=1-lc(qb.positionScreen.z,qa,Ia);ma.r=ma.g=ma.b=1-lc(pb.positionScreen.z,qa,Ia);Sa=x(ba,$,ca,ma);r(E,I,R,M,Q,L);z(E,I,R,M,
Q,L,0,0,1,0,0,1,Sa);r(W,ha,H,V,ia,da);z(W,ha,H,V,ia,da,1,0,1,1,0,1,Sa)}}}}Ka.addRectangle(Da)}}n.setTransform(1,0,0,1,0,0)}}};
THREE.ShaderChunk={fog_pars_fragment:"#ifdef USE_FOG\nuniform vec3 fogColor;\n#ifdef FOG_EXP2\nuniform float fogDensity;\n#else\nuniform float fogNear;\nuniform float fogFar;\n#endif\n#endif",fog_fragment:"#ifdef USE_FOG\nfloat depth = gl_FragCoord.z / gl_FragCoord.w;\n#ifdef FOG_EXP2\nconst float LOG2 = 1.442695;\nfloat fogFactor = exp2( - fogDensity * fogDensity * depth * depth * LOG2 );\nfogFactor = 1.0 - clamp( fogFactor, 0.0, 1.0 );\n#else\nfloat fogFactor = smoothstep( fogNear, fogFar, depth );\n#endif\ngl_FragColor = mix( gl_FragColor, vec4( fogColor, gl_FragColor.w ), fogFactor );\n#endif",envmap_pars_fragment:"#ifdef USE_ENVMAP\nuniform float reflectivity;\nuniform samplerCube envMap;\nuniform float flipEnvMap;\nuniform int combine;\n#ifdef USE_BUMPMAP\nuniform bool useRefract;\nuniform float refractionRatio;\n#else\nvarying vec3 vReflect;\n#endif\n#endif",
envmap_fragment:"#ifdef USE_ENVMAP\nvec3 reflectVec;\n#ifdef USE_BUMPMAP\nvec3 cameraToVertex = normalize( vWorldPosition - cameraPosition );\nif ( useRefract ) {\nreflectVec = refract( cameraToVertex, normal, refractionRatio );\n} else { \nreflectVec = reflect( cameraToVertex, normal );\n}\n#else\nreflectVec = vReflect;\n#endif\n#ifdef DOUBLE_SIDED\nfloat flipNormal = ( -1.0 + 2.0 * float( gl_FrontFacing ) );\nvec4 cubeColor = textureCube( envMap, flipNormal * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );\n#else\nvec4 cubeColor = textureCube( envMap, vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );\n#endif\n#ifdef GAMMA_INPUT\ncubeColor.xyz *= cubeColor.xyz;\n#endif\nif ( combine == 1 ) {\ngl_FragColor.xyz = mix( gl_FragColor.xyz, cubeColor.xyz, specularStrength * reflectivity );\n} else {\ngl_FragColor.xyz = mix( gl_FragColor.xyz, gl_FragColor.xyz * cubeColor.xyz, specularStrength * reflectivity );\n}\n#endif",
envmap_pars_vertex:"#if defined( USE_ENVMAP ) && ! defined( USE_BUMPMAP )\nvarying vec3 vReflect;\nuniform float refractionRatio;\nuniform bool useRefract;\n#endif",envmap_vertex:"#ifdef USE_ENVMAP\nvec4 mPosition = modelMatrix * vec4( position, 1.0 );\n#endif\n#if defined( USE_ENVMAP ) && ! defined( USE_BUMPMAP )\nvec3 nWorld = mat3( modelMatrix[ 0 ].xyz, modelMatrix[ 1 ].xyz, modelMatrix[ 2 ].xyz ) * normal;\nif ( useRefract ) {\nvReflect = refract( normalize( mPosition.xyz - cameraPosition ), normalize( nWorld.xyz ), refractionRatio );\n} else {\nvReflect = reflect( normalize( mPosition.xyz - cameraPosition ), normalize( nWorld.xyz ) );\n}\n#endif",
map_particle_pars_fragment:"#ifdef USE_MAP\nuniform sampler2D map;\n#endif",map_particle_fragment:"#ifdef USE_MAP\ngl_FragColor = gl_FragColor * texture2D( map, vec2( gl_PointCoord.x, 1.0 - gl_PointCoord.y ) );\n#endif",map_pars_vertex:"#if defined( USE_MAP ) || defined( USE_BUMPMAP ) || defined( USE_SPECULARMAP )\nvarying vec2 vUv;\nuniform vec4 offsetRepeat;\n#endif",map_pars_fragment:"#if defined( USE_MAP ) || defined( USE_BUMPMAP ) || defined( USE_SPECULARMAP )\nvarying vec2 vUv;\n#endif\n#ifdef USE_MAP\nuniform sampler2D map;\n#endif",
map_vertex:"#if defined( USE_MAP ) || defined( USE_BUMPMAP ) || defined( USE_SPECULARMAP )\nvUv = uv * offsetRepeat.zw + offsetRepeat.xy;\n#endif",map_fragment:"#ifdef USE_MAP\n#ifdef GAMMA_INPUT\nvec4 texelColor = texture2D( map, vUv );\ntexelColor.xyz *= texelColor.xyz;\ngl_FragColor = gl_FragColor * texelColor;\n#else\ngl_FragColor = gl_FragColor * texture2D( map, vUv );\n#endif\n#endif",lightmap_pars_fragment:"#ifdef USE_LIGHTMAP\nvarying vec2 vUv2;\nuniform sampler2D lightMap;\n#endif",lightmap_pars_vertex:"#ifdef USE_LIGHTMAP\nvarying vec2 vUv2;\n#endif",
lightmap_fragment:"#ifdef USE_LIGHTMAP\ngl_FragColor = gl_FragColor * texture2D( lightMap, vUv2 );\n#endif",lightmap_vertex:"#ifdef USE_LIGHTMAP\nvUv2 = uv2;\n#endif",bumpmap_pars_fragment:"#ifdef USE_BUMPMAP\nuniform sampler2D bumpMap;\nuniform float bumpScale;\nvec2 dHdxy_fwd() {\nvec2 dSTdx = dFdx( vUv );\nvec2 dSTdy = dFdy( vUv );\nfloat Hll = bumpScale * texture2D( bumpMap, vUv ).x;\nfloat dBx = bumpScale * texture2D( bumpMap, vUv + dSTdx ).x - Hll;\nfloat dBy = bumpScale * texture2D( bumpMap, vUv + dSTdy ).x - Hll;\nreturn vec2( dBx, dBy );\n}\nvec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy ) {\nvec3 vSigmaX = dFdx( surf_pos );\nvec3 vSigmaY = dFdy( surf_pos );\nvec3 vN = surf_norm;\nvec3 R1 = cross( vSigmaY, vN );\nvec3 R2 = cross( vN, vSigmaX );\nfloat fDet = dot( vSigmaX, R1 );\nvec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );\nreturn normalize( abs( fDet ) * surf_norm - vGrad );\n}\n#endif",
specularmap_pars_fragment:"#ifdef USE_SPECULARMAP\nuniform sampler2D specularMap;\n#endif",specularmap_fragment:"float specularStrength;\n#ifdef USE_SPECULARMAP\nvec4 texelSpecular = texture2D( specularMap, vUv );\nspecularStrength = texelSpecular.r;\n#else\nspecularStrength = 1.0;\n#endif",lights_lambert_pars_vertex:"uniform vec3 ambient;\nuniform vec3 diffuse;\nuniform vec3 emissive;\nuniform vec3 ambientLightColor;\n#if MAX_DIR_LIGHTS > 0\nuniform vec3 directionalLightColor[ MAX_DIR_LIGHTS ];\nuniform vec3 directionalLightDirection[ MAX_DIR_LIGHTS ];\n#endif\n#if MAX_POINT_LIGHTS > 0\nuniform vec3 pointLightColor[ MAX_POINT_LIGHTS ];\nuniform vec3 pointLightPosition[ MAX_POINT_LIGHTS ];\nuniform float pointLightDistance[ MAX_POINT_LIGHTS ];\n#endif\n#if MAX_SPOT_LIGHTS > 0\nuniform vec3 spotLightColor[ MAX_SPOT_LIGHTS ];\nuniform vec3 spotLightPosition[ MAX_SPOT_LIGHTS ];\nuniform vec3 spotLightDirection[ MAX_SPOT_LIGHTS ];\nuniform float spotLightDistance[ MAX_SPOT_LIGHTS ];\nuniform float spotLightAngle[ MAX_SPOT_LIGHTS ];\nuniform float spotLightExponent[ MAX_SPOT_LIGHTS ];\n#endif\n#ifdef WRAP_AROUND\nuniform vec3 wrapRGB;\n#endif",
lights_lambert_vertex:"vLightFront = vec3( 0.0 );\n#ifdef DOUBLE_SIDED\nvLightBack = vec3( 0.0 );\n#endif\ntransformedNormal = normalize( transformedNormal );\n#if MAX_DIR_LIGHTS > 0\nfor( int i = 0; i < MAX_DIR_LIGHTS; i ++ ) {\nvec4 lDirection = viewMatrix * vec4( directionalLightDirection[ i ], 0.0 );\nvec3 dirVector = normalize( lDirection.xyz );\nfloat dotProduct = dot( transformedNormal, dirVector );\nvec3 directionalLightWeighting = vec3( max( dotProduct, 0.0 ) );\n#ifdef DOUBLE_SIDED\nvec3 directionalLightWeightingBack = vec3( max( -dotProduct, 0.0 ) );\n#ifdef WRAP_AROUND\nvec3 directionalLightWeightingHalfBack = vec3( max( -0.5 * dotProduct + 0.5, 0.0 ) );\n#endif\n#endif\n#ifdef WRAP_AROUND\nvec3 directionalLightWeightingHalf = vec3( max( 0.5 * dotProduct + 0.5, 0.0 ) );\ndirectionalLightWeighting = mix( directionalLightWeighting, directionalLightWeightingHalf, wrapRGB );\n#ifdef DOUBLE_SIDED\ndirectionalLightWeightingBack = mix( directionalLightWeightingBack, directionalLightWeightingHalfBack, wrapRGB );\n#endif\n#endif\nvLightFront += directionalLightColor[ i ] * directionalLightWeighting;\n#ifdef DOUBLE_SIDED\nvLightBack += directionalLightColor[ i ] * directionalLightWeightingBack;\n#endif\n}\n#endif\n#if MAX_POINT_LIGHTS > 0\nfor( int i = 0; i < MAX_POINT_LIGHTS; i ++ ) {\nvec4 lPosition = viewMatrix * vec4( pointLightPosition[ i ], 1.0 );\nvec3 lVector = lPosition.xyz - mvPosition.xyz;\nfloat lDistance = 1.0;\nif ( pointLightDistance[ i ] > 0.0 )\nlDistance = 1.0 - min( ( length( lVector ) / pointLightDistance[ i ] ), 1.0 );\nlVector = normalize( lVector );\nfloat dotProduct = dot( transformedNormal, lVector );\nvec3 pointLightWeighting = vec3( max( dotProduct, 0.0 ) );\n#ifdef DOUBLE_SIDED\nvec3 pointLightWeightingBack = vec3( max( -dotProduct, 0.0 ) );\n#ifdef WRAP_AROUND\nvec3 pointLightWeightingHalfBack = vec3( max( -0.5 * dotProduct + 0.5, 0.0 ) );\n#endif\n#endif\n#ifdef WRAP_AROUND\nvec3 pointLightWeightingHalf = vec3( max( 0.5 * dotProduct + 0.5, 0.0 ) );\npointLightWeighting = mix( pointLightWeighting, pointLightWeightingHalf, wrapRGB );\n#ifdef DOUBLE_SIDED\npointLightWeightingBack = mix( pointLightWeightingBack, pointLightWeightingHalfBack, wrapRGB );\n#endif\n#endif\nvLightFront += pointLightColor[ i ] * pointLightWeighting * lDistance;\n#ifdef DOUBLE_SIDED\nvLightBack += pointLightColor[ i ] * pointLightWeightingBack * lDistance;\n#endif\n}\n#endif\n#if MAX_SPOT_LIGHTS > 0\nfor( int i = 0; i < MAX_SPOT_LIGHTS; i ++ ) {\nvec4 lPosition = viewMatrix * vec4( spotLightPosition[ i ], 1.0 );\nvec3 lVector = lPosition.xyz - mvPosition.xyz;\nlVector = normalize( lVector );\nfloat spotEffect = dot( spotLightDirection[ i ], normalize( spotLightPosition[ i ] - mPosition.xyz ) );\nif ( spotEffect > spotLightAngle[ i ] ) {\nspotEffect = pow( spotEffect, spotLightExponent[ i ] );\nfloat lDistance = 1.0;\nif ( spotLightDistance[ i ] > 0.0 )\nlDistance = 1.0 - min( ( length( lVector ) / spotLightDistance[ i ] ), 1.0 );\nfloat dotProduct = dot( transformedNormal, lVector );\nvec3 spotLightWeighting = vec3( max( dotProduct, 0.0 ) );\n#ifdef DOUBLE_SIDED\nvec3 spotLightWeightingBack = vec3( max( -dotProduct, 0.0 ) );\n#ifdef WRAP_AROUND\nvec3 spotLightWeightingHalfBack = vec3( max( -0.5 * dotProduct + 0.5, 0.0 ) );\n#endif\n#endif\n#ifdef WRAP_AROUND\nvec3 spotLightWeightingHalf = vec3( max( 0.5 * dotProduct + 0.5, 0.0 ) );\nspotLightWeighting = mix( spotLightWeighting, spotLightWeightingHalf, wrapRGB );\n#ifdef DOUBLE_SIDED\nspotLightWeightingBack = mix( spotLightWeightingBack, spotLightWeightingHalfBack, wrapRGB );\n#endif\n#endif\nvLightFront += spotLightColor[ i ] * spotLightWeighting * lDistance * spotEffect;\n#ifdef DOUBLE_SIDED\nvLightBack += spotLightColor[ i ] * spotLightWeightingBack * lDistance * spotEffect;\n#endif\n}\n}\n#endif\nvLightFront = vLightFront * diffuse + ambient * ambientLightColor + emissive;\n#ifdef DOUBLE_SIDED\nvLightBack = vLightBack * diffuse + ambient * ambientLightColor + emissive;\n#endif",
lights_phong_pars_vertex:"#ifndef PHONG_PER_PIXEL\n#if MAX_POINT_LIGHTS > 0\nuniform vec3 pointLightPosition[ MAX_POINT_LIGHTS ];\nuniform float pointLightDistance[ MAX_POINT_LIGHTS ];\nvarying vec4 vPointLight[ MAX_POINT_LIGHTS ];\n#endif\n#if MAX_SPOT_LIGHTS > 0\nuniform vec3 spotLightPosition[ MAX_SPOT_LIGHTS ];\nuniform float spotLightDistance[ MAX_SPOT_LIGHTS ];\nvarying vec4 vSpotLight[ MAX_SPOT_LIGHTS ];\n#endif\n#endif\n#if MAX_SPOT_LIGHTS > 0 || defined( USE_BUMPMAP )\nvarying vec3 vWorldPosition;\n#endif",
lights_phong_vertex:"#ifndef PHONG_PER_PIXEL\n#if MAX_POINT_LIGHTS > 0\nfor( int i = 0; i < MAX_POINT_LIGHTS; i ++ ) {\nvec4 lPosition = viewMatrix * vec4( pointLightPosition[ i ], 1.0 );\nvec3 lVector = lPosition.xyz - mvPosition.xyz;\nfloat lDistance = 1.0;\nif ( pointLightDistance[ i ] > 0.0 )\nlDistance = 1.0 - min( ( length( lVector ) / pointLightDistance[ i ] ), 1.0 );\nvPointLight[ i ] = vec4( lVector, lDistance );\n}\n#endif\n#if MAX_SPOT_LIGHTS > 0\nfor( int i = 0; i < MAX_SPOT_LIGHTS; i ++ ) {\nvec4 lPosition = viewMatrix * vec4( spotLightPosition[ i ], 1.0 );\nvec3 lVector = lPosition.xyz - mvPosition.xyz;\nfloat lDistance = 1.0;\nif ( spotLightDistance[ i ] > 0.0 )\nlDistance = 1.0 - min( ( length( lVector ) / spotLightDistance[ i ] ), 1.0 );\nvSpotLight[ i ] = vec4( lVector, lDistance );\n}\n#endif\n#endif\n#if MAX_SPOT_LIGHTS > 0 || defined( USE_BUMPMAP )\nvWorldPosition = mPosition.xyz;\n#endif",
lights_phong_pars_fragment:"uniform vec3 ambientLightColor;\n#if MAX_DIR_LIGHTS > 0\nuniform vec3 directionalLightColor[ MAX_DIR_LIGHTS ];\nuniform vec3 directionalLightDirection[ MAX_DIR_LIGHTS ];\n#endif\n#if MAX_POINT_LIGHTS > 0\nuniform vec3 pointLightColor[ MAX_POINT_LIGHTS ];\n#ifdef PHONG_PER_PIXEL\nuniform vec3 pointLightPosition[ MAX_POINT_LIGHTS ];\nuniform float pointLightDistance[ MAX_POINT_LIGHTS ];\n#else\nvarying vec4 vPointLight[ MAX_POINT_LIGHTS ];\n#endif\n#endif\n#if MAX_SPOT_LIGHTS > 0\nuniform vec3 spotLightColor[ MAX_SPOT_LIGHTS ];\nuniform vec3 spotLightPosition[ MAX_SPOT_LIGHTS ];\nuniform vec3 spotLightDirection[ MAX_SPOT_LIGHTS ];\nuniform float spotLightAngle[ MAX_SPOT_LIGHTS ];\nuniform float spotLightExponent[ MAX_SPOT_LIGHTS ];\n#ifdef PHONG_PER_PIXEL\nuniform float spotLightDistance[ MAX_SPOT_LIGHTS ];\n#else\nvarying vec4 vSpotLight[ MAX_SPOT_LIGHTS ];\n#endif\n#endif\n#if MAX_SPOT_LIGHTS > 0 || defined( USE_BUMPMAP )\nvarying vec3 vWorldPosition;\n#endif\n#ifdef WRAP_AROUND\nuniform vec3 wrapRGB;\n#endif\nvarying vec3 vViewPosition;\nvarying vec3 vNormal;",
lights_phong_fragment:"vec3 normal = normalize( vNormal );\nvec3 viewPosition = normalize( vViewPosition );\n#ifdef DOUBLE_SIDED\nnormal = normal * ( -1.0 + 2.0 * float( gl_FrontFacing ) );\n#endif\n#ifdef USE_BUMPMAP\nnormal = perturbNormalArb( -vViewPosition, normal, dHdxy_fwd() );\n#endif\n#if MAX_POINT_LIGHTS > 0\nvec3 pointDiffuse  = vec3( 0.0 );\nvec3 pointSpecular = vec3( 0.0 );\nfor ( int i = 0; i < MAX_POINT_LIGHTS; i ++ ) {\n#ifdef PHONG_PER_PIXEL\nvec4 lPosition = viewMatrix * vec4( pointLightPosition[ i ], 1.0 );\nvec3 lVector = lPosition.xyz + vViewPosition.xyz;\nfloat lDistance = 1.0;\nif ( pointLightDistance[ i ] > 0.0 )\nlDistance = 1.0 - min( ( length( lVector ) / pointLightDistance[ i ] ), 1.0 );\nlVector = normalize( lVector );\n#else\nvec3 lVector = normalize( vPointLight[ i ].xyz );\nfloat lDistance = vPointLight[ i ].w;\n#endif\nfloat dotProduct = dot( normal, lVector );\n#ifdef WRAP_AROUND\nfloat pointDiffuseWeightFull = max( dotProduct, 0.0 );\nfloat pointDiffuseWeightHalf = max( 0.5 * dotProduct + 0.5, 0.0 );\nvec3 pointDiffuseWeight = mix( vec3 ( pointDiffuseWeightFull ), vec3( pointDiffuseWeightHalf ), wrapRGB );\n#else\nfloat pointDiffuseWeight = max( dotProduct, 0.0 );\n#endif\npointDiffuse  += diffuse * pointLightColor[ i ] * pointDiffuseWeight * lDistance;\nvec3 pointHalfVector = normalize( lVector + viewPosition );\nfloat pointDotNormalHalf = max( dot( normal, pointHalfVector ), 0.0 );\nfloat pointSpecularWeight = specularStrength * max( pow( pointDotNormalHalf, shininess ), 0.0 );\n#ifdef PHYSICALLY_BASED_SHADING\nfloat specularNormalization = ( shininess + 2.0001 ) / 8.0;\nvec3 schlick = specular + vec3( 1.0 - specular ) * pow( 1.0 - dot( lVector, pointHalfVector ), 5.0 );\npointSpecular += schlick * pointLightColor[ i ] * pointSpecularWeight * pointDiffuseWeight * lDistance * specularNormalization;\n#else\npointSpecular += specular * pointLightColor[ i ] * pointSpecularWeight * pointDiffuseWeight * lDistance;\n#endif\n}\n#endif\n#if MAX_SPOT_LIGHTS > 0\nvec3 spotDiffuse  = vec3( 0.0 );\nvec3 spotSpecular = vec3( 0.0 );\nfor ( int i = 0; i < MAX_SPOT_LIGHTS; i ++ ) {\n#ifdef PHONG_PER_PIXEL\nvec4 lPosition = viewMatrix * vec4( spotLightPosition[ i ], 1.0 );\nvec3 lVector = lPosition.xyz + vViewPosition.xyz;\nfloat lDistance = 1.0;\nif ( spotLightDistance[ i ] > 0.0 )\nlDistance = 1.0 - min( ( length( lVector ) / spotLightDistance[ i ] ), 1.0 );\nlVector = normalize( lVector );\n#else\nvec3 lVector = normalize( vSpotLight[ i ].xyz );\nfloat lDistance = vSpotLight[ i ].w;\n#endif\nfloat spotEffect = dot( spotLightDirection[ i ], normalize( spotLightPosition[ i ] - vWorldPosition ) );\nif ( spotEffect > spotLightAngle[ i ] ) {\nspotEffect = pow( spotEffect, spotLightExponent[ i ] );\nfloat dotProduct = dot( normal, lVector );\n#ifdef WRAP_AROUND\nfloat spotDiffuseWeightFull = max( dotProduct, 0.0 );\nfloat spotDiffuseWeightHalf = max( 0.5 * dotProduct + 0.5, 0.0 );\nvec3 spotDiffuseWeight = mix( vec3 ( spotDiffuseWeightFull ), vec3( spotDiffuseWeightHalf ), wrapRGB );\n#else\nfloat spotDiffuseWeight = max( dotProduct, 0.0 );\n#endif\nspotDiffuse += diffuse * spotLightColor[ i ] * spotDiffuseWeight * lDistance * spotEffect;\nvec3 spotHalfVector = normalize( lVector + viewPosition );\nfloat spotDotNormalHalf = max( dot( normal, spotHalfVector ), 0.0 );\nfloat spotSpecularWeight = specularStrength * max( pow( spotDotNormalHalf, shininess ), 0.0 );\n#ifdef PHYSICALLY_BASED_SHADING\nfloat specularNormalization = ( shininess + 2.0001 ) / 8.0;\nvec3 schlick = specular + vec3( 1.0 - specular ) * pow( 1.0 - dot( lVector, spotHalfVector ), 5.0 );\nspotSpecular += schlick * spotLightColor[ i ] * spotSpecularWeight * spotDiffuseWeight * lDistance * specularNormalization * spotEffect;\n#else\nspotSpecular += specular * spotLightColor[ i ] * spotSpecularWeight * spotDiffuseWeight * lDistance * spotEffect;\n#endif\n}\n}\n#endif\n#if MAX_DIR_LIGHTS > 0\nvec3 dirDiffuse  = vec3( 0.0 );\nvec3 dirSpecular = vec3( 0.0 );\nfor( int i = 0; i < MAX_DIR_LIGHTS; i ++ ) {\nvec4 lDirection = viewMatrix * vec4( directionalLightDirection[ i ], 0.0 );\nvec3 dirVector = normalize( lDirection.xyz );\nfloat dotProduct = dot( normal, dirVector );\n#ifdef WRAP_AROUND\nfloat dirDiffuseWeightFull = max( dotProduct, 0.0 );\nfloat dirDiffuseWeightHalf = max( 0.5 * dotProduct + 0.5, 0.0 );\nvec3 dirDiffuseWeight = mix( vec3( dirDiffuseWeightFull ), vec3( dirDiffuseWeightHalf ), wrapRGB );\n#else\nfloat dirDiffuseWeight = max( dotProduct, 0.0 );\n#endif\ndirDiffuse  += diffuse * directionalLightColor[ i ] * dirDiffuseWeight;\nvec3 dirHalfVector = normalize( dirVector + viewPosition );\nfloat dirDotNormalHalf = max( dot( normal, dirHalfVector ), 0.0 );\nfloat dirSpecularWeight = specularStrength * max( pow( dirDotNormalHalf, shininess ), 0.0 );\n#ifdef PHYSICALLY_BASED_SHADING\nfloat specularNormalization = ( shininess + 2.0001 ) / 8.0;\nvec3 schlick = specular + vec3( 1.0 - specular ) * pow( 1.0 - dot( dirVector, dirHalfVector ), 5.0 );\ndirSpecular += schlick * directionalLightColor[ i ] * dirSpecularWeight * dirDiffuseWeight * specularNormalization;\n#else\ndirSpecular += specular * directionalLightColor[ i ] * dirSpecularWeight * dirDiffuseWeight;\n#endif\n}\n#endif\nvec3 totalDiffuse = vec3( 0.0 );\nvec3 totalSpecular = vec3( 0.0 );\n#if MAX_DIR_LIGHTS > 0\ntotalDiffuse += dirDiffuse;\ntotalSpecular += dirSpecular;\n#endif\n#if MAX_POINT_LIGHTS > 0\ntotalDiffuse += pointDiffuse;\ntotalSpecular += pointSpecular;\n#endif\n#if MAX_SPOT_LIGHTS > 0\ntotalDiffuse += spotDiffuse;\ntotalSpecular += spotSpecular;\n#endif\n#ifdef METAL\ngl_FragColor.xyz = gl_FragColor.xyz * ( emissive + totalDiffuse + ambientLightColor * ambient + totalSpecular );\n#else\ngl_FragColor.xyz = gl_FragColor.xyz * ( emissive + totalDiffuse + ambientLightColor * ambient ) + totalSpecular;\n#endif",
color_pars_fragment:"#ifdef USE_COLOR\nvarying vec3 vColor;\n#endif",color_fragment:"#ifdef USE_COLOR\ngl_FragColor = gl_FragColor * vec4( vColor, opacity );\n#endif",color_pars_vertex:"#ifdef USE_COLOR\nvarying vec3 vColor;\n#endif",color_vertex:"#ifdef USE_COLOR\n#ifdef GAMMA_INPUT\nvColor = color * color;\n#else\nvColor = color;\n#endif\n#endif",skinning_pars_vertex:"#ifdef USE_SKINNING\n#ifdef BONE_TEXTURE\nuniform sampler2D boneTexture;\nmat4 getBoneMatrix( const in float i ) {\nfloat j = i * 4.0;\nfloat x = mod( j, N_BONE_PIXEL_X );\nfloat y = floor( j / N_BONE_PIXEL_X );\nconst float dx = 1.0 / N_BONE_PIXEL_X;\nconst float dy = 1.0 / N_BONE_PIXEL_Y;\ny = dy * ( y + 0.5 );\nvec4 v1 = texture2D( boneTexture, vec2( dx * ( x + 0.5 ), y ) );\nvec4 v2 = texture2D( boneTexture, vec2( dx * ( x + 1.5 ), y ) );\nvec4 v3 = texture2D( boneTexture, vec2( dx * ( x + 2.5 ), y ) );\nvec4 v4 = texture2D( boneTexture, vec2( dx * ( x + 3.5 ), y ) );\nmat4 bone = mat4( v1, v2, v3, v4 );\nreturn bone;\n}\n#else\nuniform mat4 boneGlobalMatrices[ MAX_BONES ];\nmat4 getBoneMatrix( const in float i ) {\nmat4 bone = boneGlobalMatrices[ int(i) ];\nreturn bone;\n}\n#endif\n#endif",
skinbase_vertex:"#ifdef USE_SKINNING\nmat4 boneMatX = getBoneMatrix( skinIndex.x );\nmat4 boneMatY = getBoneMatrix( skinIndex.y );\n#endif",skinning_vertex:"#ifdef USE_SKINNING\nvec4 skinned  = boneMatX * skinVertexA * skinWeight.x;\nskinned \t  += boneMatY * skinVertexB * skinWeight.y;\ngl_Position  = projectionMatrix * modelViewMatrix * skinned;\n#endif",morphtarget_pars_vertex:"#ifdef USE_MORPHTARGETS\n#ifndef USE_MORPHNORMALS\nuniform float morphTargetInfluences[ 8 ];\n#else\nuniform float morphTargetInfluences[ 4 ];\n#endif\n#endif",
morphtarget_vertex:"#ifdef USE_MORPHTARGETS\nvec3 morphed = vec3( 0.0 );\nmorphed += ( morphTarget0 - position ) * morphTargetInfluences[ 0 ];\nmorphed += ( morphTarget1 - position ) * morphTargetInfluences[ 1 ];\nmorphed += ( morphTarget2 - position ) * morphTargetInfluences[ 2 ];\nmorphed += ( morphTarget3 - position ) * morphTargetInfluences[ 3 ];\n#ifndef USE_MORPHNORMALS\nmorphed += ( morphTarget4 - position ) * morphTargetInfluences[ 4 ];\nmorphed += ( morphTarget5 - position ) * morphTargetInfluences[ 5 ];\nmorphed += ( morphTarget6 - position ) * morphTargetInfluences[ 6 ];\nmorphed += ( morphTarget7 - position ) * morphTargetInfluences[ 7 ];\n#endif\nmorphed += position;\ngl_Position = projectionMatrix * modelViewMatrix * vec4( morphed, 1.0 );\n#endif",
default_vertex:"#ifndef USE_MORPHTARGETS\n#ifndef USE_SKINNING\ngl_Position = projectionMatrix * mvPosition;\n#endif\n#endif",morphnormal_vertex:"#ifdef USE_MORPHNORMALS\nvec3 morphedNormal = vec3( 0.0 );\nmorphedNormal +=  ( morphNormal0 - normal ) * morphTargetInfluences[ 0 ];\nmorphedNormal +=  ( morphNormal1 - normal ) * morphTargetInfluences[ 1 ];\nmorphedNormal +=  ( morphNormal2 - normal ) * morphTargetInfluences[ 2 ];\nmorphedNormal +=  ( morphNormal3 - normal ) * morphTargetInfluences[ 3 ];\nmorphedNormal += normal;\n#endif",
skinnormal_vertex:"#ifdef USE_SKINNING\nmat4 skinMatrix = skinWeight.x * boneMatX;\nskinMatrix \t+= skinWeight.y * boneMatY;\nvec4 skinnedNormal = skinMatrix * vec4( normal, 0.0 );\n#endif",defaultnormal_vertex:"vec3 transformedNormal;\n#ifdef USE_SKINNING\ntransformedNormal = skinnedNormal.xyz;\n#endif\n#ifdef USE_MORPHNORMALS\ntransformedNormal = morphedNormal;\n#endif\n#ifndef USE_MORPHNORMALS\n#ifndef USE_SKINNING\ntransformedNormal = normal;\n#endif\n#endif\ntransformedNormal = normalMatrix * transformedNormal;",
shadowmap_pars_fragment:"#ifdef USE_SHADOWMAP\nuniform sampler2D shadowMap[ MAX_SHADOWS ];\nuniform vec2 shadowMapSize[ MAX_SHADOWS ];\nuniform float shadowDarkness[ MAX_SHADOWS ];\nuniform float shadowBias[ MAX_SHADOWS ];\nvarying vec4 vShadowCoord[ MAX_SHADOWS ];\nfloat unpackDepth( const in vec4 rgba_depth ) {\nconst vec4 bit_shift = vec4( 1.0 / ( 256.0 * 256.0 * 256.0 ), 1.0 / ( 256.0 * 256.0 ), 1.0 / 256.0, 1.0 );\nfloat depth = dot( rgba_depth, bit_shift );\nreturn depth;\n}\n#endif",shadowmap_fragment:"#ifdef USE_SHADOWMAP\n#ifdef SHADOWMAP_DEBUG\nvec3 frustumColors[3];\nfrustumColors[0] = vec3( 1.0, 0.5, 0.0 );\nfrustumColors[1] = vec3( 0.0, 1.0, 0.8 );\nfrustumColors[2] = vec3( 0.0, 0.5, 1.0 );\n#endif\n#ifdef SHADOWMAP_CASCADE\nint inFrustumCount = 0;\n#endif\nfloat fDepth;\nvec3 shadowColor = vec3( 1.0 );\nfor( int i = 0; i < MAX_SHADOWS; i ++ ) {\nvec3 shadowCoord = vShadowCoord[ i ].xyz / vShadowCoord[ i ].w;\nbvec4 inFrustumVec = bvec4 ( shadowCoord.x >= 0.0, shadowCoord.x <= 1.0, shadowCoord.y >= 0.0, shadowCoord.y <= 1.0 );\nbool inFrustum = all( inFrustumVec );\n#ifdef SHADOWMAP_CASCADE\ninFrustumCount += int( inFrustum );\nbvec3 frustumTestVec = bvec3( inFrustum, inFrustumCount == 1, shadowCoord.z <= 1.0 );\n#else\nbvec2 frustumTestVec = bvec2( inFrustum, shadowCoord.z <= 1.0 );\n#endif\nbool frustumTest = all( frustumTestVec );\nif ( frustumTest ) {\nshadowCoord.z += shadowBias[ i ];\n#ifdef SHADOWMAP_SOFT\nfloat shadow = 0.0;\nconst float shadowDelta = 1.0 / 9.0;\nfloat xPixelOffset = 1.0 / shadowMapSize[ i ].x;\nfloat yPixelOffset = 1.0 / shadowMapSize[ i ].y;\nfloat dx0 = -1.25 * xPixelOffset;\nfloat dy0 = -1.25 * yPixelOffset;\nfloat dx1 = 1.25 * xPixelOffset;\nfloat dy1 = 1.25 * yPixelOffset;\nfDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx0, dy0 ) ) );\nif ( fDepth < shadowCoord.z ) shadow += shadowDelta;\nfDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( 0.0, dy0 ) ) );\nif ( fDepth < shadowCoord.z ) shadow += shadowDelta;\nfDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx1, dy0 ) ) );\nif ( fDepth < shadowCoord.z ) shadow += shadowDelta;\nfDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx0, 0.0 ) ) );\nif ( fDepth < shadowCoord.z ) shadow += shadowDelta;\nfDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy ) );\nif ( fDepth < shadowCoord.z ) shadow += shadowDelta;\nfDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx1, 0.0 ) ) );\nif ( fDepth < shadowCoord.z ) shadow += shadowDelta;\nfDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx0, dy1 ) ) );\nif ( fDepth < shadowCoord.z ) shadow += shadowDelta;\nfDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( 0.0, dy1 ) ) );\nif ( fDepth < shadowCoord.z ) shadow += shadowDelta;\nfDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx1, dy1 ) ) );\nif ( fDepth < shadowCoord.z ) shadow += shadowDelta;\nshadowColor = shadowColor * vec3( ( 1.0 - shadowDarkness[ i ] * shadow ) );\n#else\nvec4 rgbaDepth = texture2D( shadowMap[ i ], shadowCoord.xy );\nfloat fDepth = unpackDepth( rgbaDepth );\nif ( fDepth < shadowCoord.z )\nshadowColor = shadowColor * vec3( 1.0 - shadowDarkness[ i ] );\n#endif\n}\n#ifdef SHADOWMAP_DEBUG\n#ifdef SHADOWMAP_CASCADE\nif ( inFrustum && inFrustumCount == 1 ) gl_FragColor.xyz *= frustumColors[ i ];\n#else\nif ( inFrustum ) gl_FragColor.xyz *= frustumColors[ i ];\n#endif\n#endif\n}\n#ifdef GAMMA_OUTPUT\nshadowColor *= shadowColor;\n#endif\ngl_FragColor.xyz = gl_FragColor.xyz * shadowColor;\n#endif",
shadowmap_pars_vertex:"#ifdef USE_SHADOWMAP\nvarying vec4 vShadowCoord[ MAX_SHADOWS ];\nuniform mat4 shadowMatrix[ MAX_SHADOWS ];\n#endif",shadowmap_vertex:"#ifdef USE_SHADOWMAP\nvec4 transformedPosition;\n#ifdef USE_MORPHTARGETS\ntransformedPosition = modelMatrix * vec4( morphed, 1.0 );\n#else\n#ifdef USE_SKINNING\ntransformedPosition = modelMatrix * skinned;\n#else\ntransformedPosition = modelMatrix * vec4( position, 1.0 );\n#endif\n#endif\nfor( int i = 0; i < MAX_SHADOWS; i ++ ) {\nvShadowCoord[ i ] = shadowMatrix[ i ] * transformedPosition;\n}\n#endif",
alphatest_fragment:"#ifdef ALPHATEST\nif ( gl_FragColor.a < ALPHATEST ) discard;\n#endif",linear_to_gamma_fragment:"#ifdef GAMMA_OUTPUT\ngl_FragColor.xyz = sqrt( gl_FragColor.xyz );\n#endif"};
THREE.UniformsUtils={merge:function(a){var b,c,d,f={};for(b=0;b<a.length;b++){d=this.clone(a[b]);for(c in d)f[c]=d[c]}return f},clone:function(a){var b,c,d,f={};for(b in a){f[b]={};for(c in a[b]){d=a[b][c];f[b][c]=d instanceof THREE.Color||d instanceof THREE.Vector2||d instanceof THREE.Vector3||d instanceof THREE.Vector4||d instanceof THREE.Matrix4||d instanceof THREE.Texture?d.clone():d instanceof Array?d.slice():d}}return f}};
THREE.UniformsLib={common:{diffuse:{type:"c",value:new THREE.Color(15658734)},opacity:{type:"f",value:1},map:{type:"t",value:0,texture:null},offsetRepeat:{type:"v4",value:new THREE.Vector4(0,0,1,1)},lightMap:{type:"t",value:2,texture:null},specularMap:{type:"t",value:3,texture:null},envMap:{type:"t",value:1,texture:null},flipEnvMap:{type:"f",value:-1},useRefract:{type:"i",value:0},reflectivity:{type:"f",value:1},refractionRatio:{type:"f",value:0.98},combine:{type:"i",value:0},morphTargetInfluences:{type:"f",
value:0}},bump:{bumpMap:{type:"t",value:4,texture:null},bumpScale:{type:"f",value:1}},fog:{fogDensity:{type:"f",value:2.5E-4},fogNear:{type:"f",value:1},fogFar:{type:"f",value:2E3},fogColor:{type:"c",value:new THREE.Color(16777215)}},lights:{ambientLightColor:{type:"fv",value:[]},directionalLightDirection:{type:"fv",value:[]},directionalLightColor:{type:"fv",value:[]},pointLightColor:{type:"fv",value:[]},pointLightPosition:{type:"fv",value:[]},pointLightDistance:{type:"fv1",value:[]},spotLightColor:{type:"fv",
value:[]},spotLightPosition:{type:"fv",value:[]},spotLightDirection:{type:"fv",value:[]},spotLightDistance:{type:"fv1",value:[]},spotLightAngle:{type:"fv1",value:[]},spotLightExponent:{type:"fv1",value:[]}},particle:{psColor:{type:"c",value:new THREE.Color(15658734)},opacity:{type:"f",value:1},size:{type:"f",value:1},scale:{type:"f",value:1},map:{type:"t",value:0,texture:null},fogDensity:{type:"f",value:2.5E-4},fogNear:{type:"f",value:1},fogFar:{type:"f",value:2E3},fogColor:{type:"c",value:new THREE.Color(16777215)}},
shadowmap:{shadowMap:{type:"tv",value:6,texture:[]},shadowMapSize:{type:"v2v",value:[]},shadowBias:{type:"fv1",value:[]},shadowDarkness:{type:"fv1",value:[]},shadowMatrix:{type:"m4v",value:[]}}};
THREE.ShaderLib={depth:{uniforms:{mNear:{type:"f",value:1},mFar:{type:"f",value:2E3},opacity:{type:"f",value:1}},vertexShader:"void main() {\ngl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}",fragmentShader:"uniform float mNear;\nuniform float mFar;\nuniform float opacity;\nvoid main() {\nfloat depth = gl_FragCoord.z / gl_FragCoord.w;\nfloat color = 1.0 - smoothstep( mNear, mFar, depth );\ngl_FragColor = vec4( vec3( color ), opacity );\n}"},normal:{uniforms:{opacity:{type:"f",
value:1}},vertexShader:"varying vec3 vNormal;\nvoid main() {\nvec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\nvNormal = normalMatrix * normal;\ngl_Position = projectionMatrix * mvPosition;\n}",fragmentShader:"uniform float opacity;\nvarying vec3 vNormal;\nvoid main() {\ngl_FragColor = vec4( 0.5 * normalize( vNormal ) + 0.5, opacity );\n}"},basic:{uniforms:THREE.UniformsUtils.merge([THREE.UniformsLib.common,THREE.UniformsLib.fog,THREE.UniformsLib.shadowmap]),vertexShader:[THREE.ShaderChunk.map_pars_vertex,
THREE.ShaderChunk.lightmap_pars_vertex,THREE.ShaderChunk.envmap_pars_vertex,THREE.ShaderChunk.color_pars_vertex,THREE.ShaderChunk.skinning_pars_vertex,THREE.ShaderChunk.morphtarget_pars_vertex,THREE.ShaderChunk.shadowmap_pars_vertex,"void main() {\nvec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",THREE.ShaderChunk.map_vertex,THREE.ShaderChunk.lightmap_vertex,THREE.ShaderChunk.envmap_vertex,THREE.ShaderChunk.color_vertex,THREE.ShaderChunk.skinbase_vertex,THREE.ShaderChunk.skinning_vertex,
THREE.ShaderChunk.morphtarget_vertex,THREE.ShaderChunk.default_vertex,THREE.ShaderChunk.shadowmap_vertex,"}"].join("\n"),fragmentShader:["uniform vec3 diffuse;\nuniform float opacity;",THREE.ShaderChunk.color_pars_fragment,THREE.ShaderChunk.map_pars_fragment,THREE.ShaderChunk.lightmap_pars_fragment,THREE.ShaderChunk.envmap_pars_fragment,THREE.ShaderChunk.fog_pars_fragment,THREE.ShaderChunk.shadowmap_pars_fragment,THREE.ShaderChunk.specularmap_pars_fragment,"void main() {\ngl_FragColor = vec4( diffuse, opacity );",
THREE.ShaderChunk.map_fragment,THREE.ShaderChunk.alphatest_fragment,THREE.ShaderChunk.specularmap_fragment,THREE.ShaderChunk.lightmap_fragment,THREE.ShaderChunk.color_fragment,THREE.ShaderChunk.envmap_fragment,THREE.ShaderChunk.shadowmap_fragment,THREE.ShaderChunk.linear_to_gamma_fragment,THREE.ShaderChunk.fog_fragment,"}"].join("\n")},lambert:{uniforms:THREE.UniformsUtils.merge([THREE.UniformsLib.common,THREE.UniformsLib.fog,THREE.UniformsLib.lights,THREE.UniformsLib.shadowmap,{ambient:{type:"c",
value:new THREE.Color(16777215)},emissive:{type:"c",value:new THREE.Color(0)},wrapRGB:{type:"v3",value:new THREE.Vector3(1,1,1)}}]),vertexShader:["varying vec3 vLightFront;\n#ifdef DOUBLE_SIDED\nvarying vec3 vLightBack;\n#endif",THREE.ShaderChunk.map_pars_vertex,THREE.ShaderChunk.lightmap_pars_vertex,THREE.ShaderChunk.envmap_pars_vertex,THREE.ShaderChunk.lights_lambert_pars_vertex,THREE.ShaderChunk.color_pars_vertex,THREE.ShaderChunk.skinning_pars_vertex,THREE.ShaderChunk.morphtarget_pars_vertex,
THREE.ShaderChunk.shadowmap_pars_vertex,"void main() {\nvec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",THREE.ShaderChunk.map_vertex,THREE.ShaderChunk.lightmap_vertex,THREE.ShaderChunk.envmap_vertex,THREE.ShaderChunk.color_vertex,THREE.ShaderChunk.morphnormal_vertex,THREE.ShaderChunk.skinbase_vertex,THREE.ShaderChunk.skinnormal_vertex,THREE.ShaderChunk.defaultnormal_vertex,"#ifndef USE_ENVMAP\nvec4 mPosition = modelMatrix * vec4( position, 1.0 );\n#endif",THREE.ShaderChunk.lights_lambert_vertex,
THREE.ShaderChunk.skinning_vertex,THREE.ShaderChunk.morphtarget_vertex,THREE.ShaderChunk.default_vertex,THREE.ShaderChunk.shadowmap_vertex,"}"].join("\n"),fragmentShader:["uniform float opacity;\nvarying vec3 vLightFront;\n#ifdef DOUBLE_SIDED\nvarying vec3 vLightBack;\n#endif",THREE.ShaderChunk.color_pars_fragment,THREE.ShaderChunk.map_pars_fragment,THREE.ShaderChunk.lightmap_pars_fragment,THREE.ShaderChunk.envmap_pars_fragment,THREE.ShaderChunk.fog_pars_fragment,THREE.ShaderChunk.shadowmap_pars_fragment,
THREE.ShaderChunk.specularmap_pars_fragment,"void main() {\ngl_FragColor = vec4( vec3 ( 1.0 ), opacity );",THREE.ShaderChunk.map_fragment,THREE.ShaderChunk.alphatest_fragment,THREE.ShaderChunk.specularmap_fragment,"#ifdef DOUBLE_SIDED\nif ( gl_FrontFacing )\ngl_FragColor.xyz *= vLightFront;\nelse\ngl_FragColor.xyz *= vLightBack;\n#else\ngl_FragColor.xyz *= vLightFront;\n#endif",THREE.ShaderChunk.lightmap_fragment,THREE.ShaderChunk.color_fragment,THREE.ShaderChunk.envmap_fragment,THREE.ShaderChunk.shadowmap_fragment,
THREE.ShaderChunk.linear_to_gamma_fragment,THREE.ShaderChunk.fog_fragment,"}"].join("\n")},phong:{uniforms:THREE.UniformsUtils.merge([THREE.UniformsLib.common,THREE.UniformsLib.bump,THREE.UniformsLib.fog,THREE.UniformsLib.lights,THREE.UniformsLib.shadowmap,{ambient:{type:"c",value:new THREE.Color(16777215)},emissive:{type:"c",value:new THREE.Color(0)},specular:{type:"c",value:new THREE.Color(1118481)},shininess:{type:"f",value:30},wrapRGB:{type:"v3",value:new THREE.Vector3(1,1,1)}}]),vertexShader:["varying vec3 vViewPosition;\nvarying vec3 vNormal;",
THREE.ShaderChunk.map_pars_vertex,THREE.ShaderChunk.lightmap_pars_vertex,THREE.ShaderChunk.envmap_pars_vertex,THREE.ShaderChunk.lights_phong_pars_vertex,THREE.ShaderChunk.color_pars_vertex,THREE.ShaderChunk.skinning_pars_vertex,THREE.ShaderChunk.morphtarget_pars_vertex,THREE.ShaderChunk.shadowmap_pars_vertex,"void main() {\nvec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",THREE.ShaderChunk.map_vertex,THREE.ShaderChunk.lightmap_vertex,THREE.ShaderChunk.envmap_vertex,THREE.ShaderChunk.color_vertex,
"#ifndef USE_ENVMAP\nvec4 mPosition = modelMatrix * vec4( position, 1.0 );\n#endif\nvViewPosition = -mvPosition.xyz;",THREE.ShaderChunk.morphnormal_vertex,THREE.ShaderChunk.skinbase_vertex,THREE.ShaderChunk.skinnormal_vertex,THREE.ShaderChunk.defaultnormal_vertex,"vNormal = transformedNormal;",THREE.ShaderChunk.lights_phong_vertex,THREE.ShaderChunk.skinning_vertex,THREE.ShaderChunk.morphtarget_vertex,THREE.ShaderChunk.default_vertex,THREE.ShaderChunk.shadowmap_vertex,"}"].join("\n"),fragmentShader:["uniform vec3 diffuse;\nuniform float opacity;\nuniform vec3 ambient;\nuniform vec3 emissive;\nuniform vec3 specular;\nuniform float shininess;",
THREE.ShaderChunk.color_pars_fragment,THREE.ShaderChunk.map_pars_fragment,THREE.ShaderChunk.lightmap_pars_fragment,THREE.ShaderChunk.envmap_pars_fragment,THREE.ShaderChunk.fog_pars_fragment,THREE.ShaderChunk.lights_phong_pars_fragment,THREE.ShaderChunk.shadowmap_pars_fragment,THREE.ShaderChunk.bumpmap_pars_fragment,THREE.ShaderChunk.specularmap_pars_fragment,"void main() {\ngl_FragColor = vec4( vec3 ( 1.0 ), opacity );",THREE.ShaderChunk.map_fragment,THREE.ShaderChunk.alphatest_fragment,THREE.ShaderChunk.specularmap_fragment,
THREE.ShaderChunk.lights_phong_fragment,THREE.ShaderChunk.lightmap_fragment,THREE.ShaderChunk.color_fragment,THREE.ShaderChunk.envmap_fragment,THREE.ShaderChunk.shadowmap_fragment,THREE.ShaderChunk.linear_to_gamma_fragment,THREE.ShaderChunk.fog_fragment,"}"].join("\n")},particle_basic:{uniforms:THREE.UniformsUtils.merge([THREE.UniformsLib.particle,THREE.UniformsLib.shadowmap]),vertexShader:["uniform float size;\nuniform float scale;",THREE.ShaderChunk.color_pars_vertex,THREE.ShaderChunk.shadowmap_pars_vertex,
"void main() {",THREE.ShaderChunk.color_vertex,"vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n#ifdef USE_SIZEATTENUATION\ngl_PointSize = size * ( scale / length( mvPosition.xyz ) );\n#else\ngl_PointSize = size;\n#endif\ngl_Position = projectionMatrix * mvPosition;",THREE.ShaderChunk.shadowmap_vertex,"}"].join("\n"),fragmentShader:["uniform vec3 psColor;\nuniform float opacity;",THREE.ShaderChunk.color_pars_fragment,THREE.ShaderChunk.map_particle_pars_fragment,THREE.ShaderChunk.fog_pars_fragment,
THREE.ShaderChunk.shadowmap_pars_fragment,"void main() {\ngl_FragColor = vec4( psColor, opacity );",THREE.ShaderChunk.map_particle_fragment,THREE.ShaderChunk.alphatest_fragment,THREE.ShaderChunk.color_fragment,THREE.ShaderChunk.shadowmap_fragment,THREE.ShaderChunk.fog_fragment,"}"].join("\n")},depthRGBA:{uniforms:{},vertexShader:[THREE.ShaderChunk.skinning_pars_vertex,THREE.ShaderChunk.morphtarget_pars_vertex,"void main() {\nvec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",THREE.ShaderChunk.skinbase_vertex,
THREE.ShaderChunk.skinning_vertex,THREE.ShaderChunk.morphtarget_vertex,THREE.ShaderChunk.default_vertex,"}"].join("\n"),fragmentShader:"vec4 pack_depth( const in float depth ) {\nconst vec4 bit_shift = vec4( 256.0 * 256.0 * 256.0, 256.0 * 256.0, 256.0, 1.0 );\nconst vec4 bit_mask  = vec4( 0.0, 1.0 / 256.0, 1.0 / 256.0, 1.0 / 256.0 );\nvec4 res = fract( depth * bit_shift );\nres -= res.xxyz * bit_mask;\nreturn res;\n}\nvoid main() {\ngl_FragData[ 0 ] = pack_depth( gl_FragCoord.z );\n}"}};
THREE.WebGLRenderer=function(a){function b(a,b){var c=a.vertices.length,d=b.material;if(d.attributes){if(a.__webglCustomAttributesList===void 0)a.__webglCustomAttributesList=[];for(var f in d.attributes){var e=d.attributes[f];if(!e.__webglInitialized||e.createUniqueBuffers){e.__webglInitialized=true;var g=1;e.type==="v2"?g=2:e.type==="v3"?g=3:e.type==="v4"?g=4:e.type==="c"&&(g=3);e.size=g;e.array=new Float32Array(c*g);e.buffer=k.createBuffer();e.buffer.belongsToAttribute=f;e.needsUpdate=true}a.__webglCustomAttributesList.push(e)}}}
function c(a,b){if(a.material&&!(a.material instanceof THREE.MeshFaceMaterial))return a.material;if(b.materialIndex>=0)return a.geometry.materials[b.materialIndex]}function d(a){return a instanceof THREE.MeshBasicMaterial&&!a.envMap||a instanceof THREE.MeshDepthMaterial?false:a&&a.shading!==void 0&&a.shading===THREE.SmoothShading?THREE.SmoothShading:THREE.FlatShading}function f(a){return a.map||a.lightMap||a.bumpMap||a.specularMap||a instanceof THREE.ShaderMaterial?true:false}function e(a,b,c){var d,
f,e,g,h=a.vertices;g=h.length;var i=a.colors,j=i.length,l=a.__vertexArray,n=a.__colorArray,m=a.__sortArray,o=a.verticesNeedUpdate,p=a.colorsNeedUpdate,q=a.__webglCustomAttributesList;if(c.sortParticles){Ea.copy(Za);Ea.multiplySelf(c.matrixWorld);for(d=0;d<g;d++){f=h[d];Ta.copy(f);Ea.multiplyVector3(Ta);m[d]=[Ta.z,d]}m.sort(function(a,b){return b[0]-a[0]});for(d=0;d<g;d++){f=h[m[d][1]];e=d*3;l[e]=f.x;l[e+1]=f.y;l[e+2]=f.z}for(d=0;d<j;d++){e=d*3;f=i[m[d][1]];n[e]=f.r;n[e+1]=f.g;n[e+2]=f.b}if(q){i=0;
for(j=q.length;i<j;i++){h=q[i];if(h.boundTo===void 0||h.boundTo==="vertices"){e=0;f=h.value.length;if(h.size===1)for(d=0;d<f;d++){g=m[d][1];h.array[d]=h.value[g]}else if(h.size===2)for(d=0;d<f;d++){g=m[d][1];g=h.value[g];h.array[e]=g.x;h.array[e+1]=g.y;e=e+2}else if(h.size===3)if(h.type==="c")for(d=0;d<f;d++){g=m[d][1];g=h.value[g];h.array[e]=g.r;h.array[e+1]=g.g;h.array[e+2]=g.b;e=e+3}else for(d=0;d<f;d++){g=m[d][1];g=h.value[g];h.array[e]=g.x;h.array[e+1]=g.y;h.array[e+2]=g.z;e=e+3}else if(h.size===
4)for(d=0;d<f;d++){g=m[d][1];g=h.value[g];h.array[e]=g.x;h.array[e+1]=g.y;h.array[e+2]=g.z;h.array[e+3]=g.w;e=e+4}}}}}else{if(o)for(d=0;d<g;d++){f=h[d];e=d*3;l[e]=f.x;l[e+1]=f.y;l[e+2]=f.z}if(p)for(d=0;d<j;d++){f=i[d];e=d*3;n[e]=f.r;n[e+1]=f.g;n[e+2]=f.b}if(q){i=0;for(j=q.length;i<j;i++){h=q[i];if(h.needsUpdate&&(h.boundTo===void 0||h.boundTo==="vertices")){f=h.value.length;e=0;if(h.size===1)for(d=0;d<f;d++)h.array[d]=h.value[d];else if(h.size===2)for(d=0;d<f;d++){g=h.value[d];h.array[e]=g.x;h.array[e+
1]=g.y;e=e+2}else if(h.size===3)if(h.type==="c")for(d=0;d<f;d++){g=h.value[d];h.array[e]=g.r;h.array[e+1]=g.g;h.array[e+2]=g.b;e=e+3}else for(d=0;d<f;d++){g=h.value[d];h.array[e]=g.x;h.array[e+1]=g.y;h.array[e+2]=g.z;e=e+3}else if(h.size===4)for(d=0;d<f;d++){g=h.value[d];h.array[e]=g.x;h.array[e+1]=g.y;h.array[e+2]=g.z;h.array[e+3]=g.w;e=e+4}}}}}if(o||c.sortParticles){k.bindBuffer(k.ARRAY_BUFFER,a.__webglVertexBuffer);k.bufferData(k.ARRAY_BUFFER,l,b)}if(p||c.sortParticles){k.bindBuffer(k.ARRAY_BUFFER,
a.__webglColorBuffer);k.bufferData(k.ARRAY_BUFFER,n,b)}if(q){i=0;for(j=q.length;i<j;i++){h=q[i];if(h.needsUpdate||c.sortParticles){k.bindBuffer(k.ARRAY_BUFFER,h.buffer);k.bufferData(k.ARRAY_BUFFER,h.array,b)}}}}function g(a,b){return b.z-a.z}function h(a,b){return b[1]-a[1]}function i(a,b,c){if(a.length)for(var d=0,f=a.length;d<f;d++){da=L=null;ha=ia=$=ba=Ia=qa=ca=-1;ta=true;a[d].render(b,c,hb,Ka);da=L=null;ha=ia=$=ba=Ia=qa=ca=-1;ta=true}}function j(a,b,c,d,f,e,g,h){var i,k,j,l;if(b){k=a.length-1;
l=b=-1}else{k=0;b=a.length;l=1}for(var n=k;n!==b;n=n+l){i=a[n];if(i.render){k=i.object;j=i.buffer;if(h)i=h;else{i=i[c];if(!i)continue;g&&H.setBlending(i.blending,i.blendEquation,i.blendSrc,i.blendDst);H.setDepthTest(i.depthTest);H.setDepthWrite(i.depthWrite);t(i.polygonOffset,i.polygonOffsetFactor,i.polygonOffsetUnits)}H.setMaterialFaces(i);j instanceof THREE.BufferGeometry?H.renderBufferDirect(d,f,e,i,j,k):H.renderBuffer(d,f,e,i,j,k)}}}function l(a,b,c,d,f,e,g){for(var h,i,k=0,j=a.length;k<j;k++){h=
a[k];i=h.object;if(i.visible){if(g)h=g;else{h=h[b];if(!h)continue;e&&H.setBlending(h.blending,h.blendEquation,h.blendSrc,h.blendDst);H.setDepthTest(h.depthTest);H.setDepthWrite(h.depthWrite);t(h.polygonOffset,h.polygonOffsetFactor,h.polygonOffsetUnits)}H.renderImmediateObject(c,d,f,h,i)}}}function o(a,b,c){a.push({buffer:b,object:c,opaque:null,transparent:null})}function m(a){for(var b in a.attributes)if(a.attributes[b].needsUpdate)return true;return false}function p(a){for(var b in a.attributes)a.attributes[b].needsUpdate=
false}function q(a,b){for(var c=a.length-1;c>=0;c--)a[c].object===b&&a.splice(c,1)}function n(a,b){for(var c=a.length-1;c>=0;c--)a[c]===b&&a.splice(c,1)}function r(a,b,c,d,f){if(d.needsUpdate){d.program&&H.deallocateMaterial(d);H.initMaterial(d,b,c,f);d.needsUpdate=false}if(d.morphTargets&&!f.__webglMorphTargetInfluences)f.__webglMorphTargetInfluences=new Float32Array(H.maxMorphTargets);var e=false,g=d.program,h=g.uniforms,i=d.uniforms;if(g!==L){k.useProgram(g);L=g;e=true}if(d.id!==ha){ha=d.id;e=
true}if(e||a!==da){k.uniformMatrix4fv(h.projectionMatrix,false,a._projectionMatrixArray);a!==da&&(da=a)}if(e){if(c&&d.fog){i.fogColor.value=c.color;if(c instanceof THREE.Fog){i.fogNear.value=c.near;i.fogFar.value=c.far}else if(c instanceof THREE.FogExp2)i.fogDensity.value=c.density}if(d instanceof THREE.MeshPhongMaterial||d instanceof THREE.MeshLambertMaterial||d.lights){if(ta){for(var j,l=0,n=0,m=0,o,p,q,r=ib,s=r.directional.colors,t=r.directional.positions,u=r.point.colors,z=r.point.positions,A=
r.point.distances,B=r.spot.colors,E=r.spot.positions,I=r.spot.distances,F=r.spot.directions,J=r.spot.angles,P=r.spot.exponents,Q=0,Z=0,O=0,G=q=0,c=G=0,e=b.length;c<e;c++){j=b[c];if(!j.onlyShadow&&j.visible){o=j.color;p=j.intensity;q=j.distance;if(j instanceof THREE.AmbientLight)if(H.gammaInput){l=l+o.r*o.r;n=n+o.g*o.g;m=m+o.b*o.b}else{l=l+o.r;n=n+o.g;m=m+o.b}else if(j instanceof THREE.DirectionalLight){q=Q*3;if(H.gammaInput){s[q]=o.r*o.r*p*p;s[q+1]=o.g*o.g*p*p;s[q+2]=o.b*o.b*p*p}else{s[q]=o.r*p;s[q+
1]=o.g*p;s[q+2]=o.b*p}La.copy(j.matrixWorld.getPosition());La.subSelf(j.target.matrixWorld.getPosition());La.normalize();t[q]=La.x;t[q+1]=La.y;t[q+2]=La.z;Q=Q+1}else if(j instanceof THREE.PointLight){G=Z*3;if(H.gammaInput){u[G]=o.r*o.r*p*p;u[G+1]=o.g*o.g*p*p;u[G+2]=o.b*o.b*p*p}else{u[G]=o.r*p;u[G+1]=o.g*p;u[G+2]=o.b*p}o=j.matrixWorld.getPosition();z[G]=o.x;z[G+1]=o.y;z[G+2]=o.z;A[Z]=q;Z=Z+1}else if(j instanceof THREE.SpotLight){G=O*3;if(H.gammaInput){B[G]=o.r*o.r*p*p;B[G+1]=o.g*o.g*p*p;B[G+2]=o.b*
o.b*p*p}else{B[G]=o.r*p;B[G+1]=o.g*p;B[G+2]=o.b*p}o=j.matrixWorld.getPosition();E[G]=o.x;E[G+1]=o.y;E[G+2]=o.z;I[O]=q;La.copy(o);La.subSelf(j.target.matrixWorld.getPosition());La.normalize();F[G]=La.x;F[G+1]=La.y;F[G+2]=La.z;J[O]=Math.cos(j.angle);P[O]=j.exponent;O=O+1}}}c=Q*3;for(e=s.length;c<e;c++)s[c]=0;c=Z*3;for(e=u.length;c<e;c++)u[c]=0;c=O*3;for(e=B.length;c<e;c++)B[c]=0;r.directional.length=Q;r.point.length=Z;r.spot.length=O;r.ambient[0]=l;r.ambient[1]=n;r.ambient[2]=m;ta=false}c=ib;i.ambientLightColor.value=
c.ambient;i.directionalLightColor.value=c.directional.colors;i.directionalLightDirection.value=c.directional.positions;i.pointLightColor.value=c.point.colors;i.pointLightPosition.value=c.point.positions;i.pointLightDistance.value=c.point.distances;i.spotLightColor.value=c.spot.colors;i.spotLightPosition.value=c.spot.positions;i.spotLightDistance.value=c.spot.distances;i.spotLightDirection.value=c.spot.directions;i.spotLightAngle.value=c.spot.angles;i.spotLightExponent.value=c.spot.exponents}if(d instanceof
THREE.MeshBasicMaterial||d instanceof THREE.MeshLambertMaterial||d instanceof THREE.MeshPhongMaterial){i.opacity.value=d.opacity;H.gammaInput?i.diffuse.value.copyGammaToLinear(d.color):i.diffuse.value=d.color;i.map.texture=d.map;i.lightMap.texture=d.lightMap;i.specularMap.texture=d.specularMap;if(d.bumpMap){i.bumpMap.texture=d.bumpMap;i.bumpScale.value=d.bumpScale}var M;if(d.map)M=d.map;else if(d.specularMap)M=d.specularMap;else if(d.bumpMap)M=d.bumpMap;if(M!==void 0){c=M.offset;M=M.repeat;i.offsetRepeat.value.set(c.x,
c.y,M.x,M.y)}i.envMap.texture=d.envMap;i.flipEnvMap.value=d.envMap instanceof THREE.WebGLRenderTargetCube?1:-1;i.reflectivity.value=d.reflectivity;i.refractionRatio.value=d.refractionRatio;i.combine.value=d.combine;i.useRefract.value=d.envMap&&d.envMap.mapping instanceof THREE.CubeRefractionMapping}if(d instanceof THREE.LineBasicMaterial){i.diffuse.value=d.color;i.opacity.value=d.opacity}else if(d instanceof THREE.ParticleBasicMaterial){i.psColor.value=d.color;i.opacity.value=d.opacity;i.size.value=
d.size;i.scale.value=v.height/2;i.map.texture=d.map}else if(d instanceof THREE.MeshPhongMaterial){i.shininess.value=d.shininess;if(H.gammaInput){i.ambient.value.copyGammaToLinear(d.ambient);i.emissive.value.copyGammaToLinear(d.emissive);i.specular.value.copyGammaToLinear(d.specular)}else{i.ambient.value=d.ambient;i.emissive.value=d.emissive;i.specular.value=d.specular}d.wrapAround&&i.wrapRGB.value.copy(d.wrapRGB)}else if(d instanceof THREE.MeshLambertMaterial){if(H.gammaInput){i.ambient.value.copyGammaToLinear(d.ambient);
i.emissive.value.copyGammaToLinear(d.emissive)}else{i.ambient.value=d.ambient;i.emissive.value=d.emissive}d.wrapAround&&i.wrapRGB.value.copy(d.wrapRGB)}else if(d instanceof THREE.MeshDepthMaterial){i.mNear.value=a.near;i.mFar.value=a.far;i.opacity.value=d.opacity}else if(d instanceof THREE.MeshNormalMaterial)i.opacity.value=d.opacity;if(f.receiveShadow&&!d._shadowPass&&i.shadowMatrix){c=M=0;for(e=b.length;c<e;c++){j=b[c];if(j.castShadow&&(j instanceof THREE.SpotLight||j instanceof THREE.DirectionalLight&&
!j.shadowCascade)){i.shadowMap.texture[M]=j.shadowMap;i.shadowMapSize.value[M]=j.shadowMapSize;i.shadowMatrix.value[M]=j.shadowMatrix;i.shadowDarkness.value[M]=j.shadowDarkness;i.shadowBias.value[M]=j.shadowBias;M++}}}b=d.uniformsList;i=0;for(M=b.length;i<M;i++)if(j=g.uniforms[b[i][1]]){c=b[i][0];l=c.type;e=c.value;if(l==="i")k.uniform1i(j,e);else if(l==="f")k.uniform1f(j,e);else if(l==="v2")k.uniform2f(j,e.x,e.y);else if(l==="v3")k.uniform3f(j,e.x,e.y,e.z);else if(l==="v4")k.uniform4f(j,e.x,e.y,
e.z,e.w);else if(l==="c")k.uniform3f(j,e.r,e.g,e.b);else if(l==="iv1")k.uniform1iv(j,e);else if(l==="iv")k.uniform3iv(j,e);else if(l==="fv1")k.uniform1fv(j,e);else if(l==="fv")k.uniform3fv(j,e);else if(l==="v2v"){if(c._array===void 0)c._array=new Float32Array(2*e.length);l=0;for(n=e.length;l<n;l++){m=l*2;c._array[m]=e[l].x;c._array[m+1]=e[l].y}k.uniform2fv(j,c._array)}else if(l==="v3v"){if(c._array===void 0)c._array=new Float32Array(3*e.length);l=0;for(n=e.length;l<n;l++){m=l*3;c._array[m]=e[l].x;
c._array[m+1]=e[l].y;c._array[m+2]=e[l].z}k.uniform3fv(j,c._array)}else if(l==="v4v"){if(c._array===void 0)c._array=new Float32Array(4*e.length);l=0;for(n=e.length;l<n;l++){m=l*4;c._array[m]=e[l].x;c._array[m+1]=e[l].y;c._array[m+2]=e[l].z;c._array[m+3]=e[l].w}k.uniform4fv(j,c._array)}else if(l==="m4"){if(c._array===void 0)c._array=new Float32Array(16);e.flattenToArray(c._array);k.uniformMatrix4fv(j,false,c._array)}else if(l==="m4v"){if(c._array===void 0)c._array=new Float32Array(16*e.length);l=0;
for(n=e.length;l<n;l++)e[l].flattenToArrayOffset(c._array,l*16);k.uniformMatrix4fv(j,false,c._array)}else if(l==="t"){k.uniform1i(j,e);if(j=c.texture)if(j.image instanceof Array&&j.image.length===6){c=j;if(c.image.length===6)if(c.needsUpdate){if(!c.image.__webglTextureCube)c.image.__webglTextureCube=k.createTexture();k.activeTexture(k.TEXTURE0+e);k.bindTexture(k.TEXTURE_CUBE_MAP,c.image.__webglTextureCube);k.pixelStorei(k.UNPACK_FLIP_Y_WEBGL,c.flipY);e=[];for(j=0;j<6;j++)if(H.autoScaleCubemaps){l=
e;n=j;m=c.image[j];s=Nb;if(!(m.width<=s&&m.height<=s)){t=Math.max(m.width,m.height);r=Math.floor(m.width*s/t);s=Math.floor(m.height*s/t);t=document.createElement("canvas");t.width=r;t.height=s;t.getContext("2d").drawImage(m,0,0,m.width,m.height,0,0,r,s);m=t}l[n]=m}else e[j]=c.image[j];j=e[0];l=(j.width&j.width-1)===0&&(j.height&j.height-1)===0;n=C(c.format);m=C(c.type);x(k.TEXTURE_CUBE_MAP,c,l);for(j=0;j<6;j++)k.texImage2D(k.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,n,n,m,e[j]);c.generateMipmaps&&l&&k.generateMipmap(k.TEXTURE_CUBE_MAP);
c.needsUpdate=false;if(c.onUpdate)c.onUpdate()}else{k.activeTexture(k.TEXTURE0+e);k.bindTexture(k.TEXTURE_CUBE_MAP,c.image.__webglTextureCube)}}else if(j instanceof THREE.WebGLRenderTargetCube){c=j;k.activeTexture(k.TEXTURE0+e);k.bindTexture(k.TEXTURE_CUBE_MAP,c.__webglTexture)}else H.setTexture(j,e)}else if(l==="tv"){if(c._array===void 0){c._array=[];l=0;for(n=c.texture.length;l<n;l++)c._array[l]=e+l}k.uniform1iv(j,c._array);l=0;for(n=c.texture.length;l<n;l++)(j=c.texture[l])&&H.setTexture(j,c._array[l])}}if((d instanceof
THREE.ShaderMaterial||d instanceof THREE.MeshPhongMaterial||d.envMap)&&h.cameraPosition!==null){b=a.matrixWorld.getPosition();k.uniform3f(h.cameraPosition,b.x,b.y,b.z)}(d instanceof THREE.MeshPhongMaterial||d instanceof THREE.MeshLambertMaterial||d instanceof THREE.ShaderMaterial||d.skinning)&&h.viewMatrix!==null&&k.uniformMatrix4fv(h.viewMatrix,false,a._viewMatrixArray)}if(d.skinning)if(jc&&f.useVertexTexture){if(h.boneTexture!==null){k.uniform1i(h.boneTexture,12);H.setTexture(f.boneTexture,12)}}else h.boneGlobalMatrices!==
null&&k.uniformMatrix4fv(h.boneGlobalMatrices,false,f.boneMatrices);k.uniformMatrix4fv(h.modelViewMatrix,false,f._modelViewMatrix.elements);h.normalMatrix&&k.uniformMatrix3fv(h.normalMatrix,false,f._normalMatrix.elements);h.modelMatrix!==null&&k.uniformMatrix4fv(h.modelMatrix,false,f.matrixWorld.elements);return g}function s(a,b){a._modelViewMatrix.multiply(b.matrixWorldInverse,a.matrixWorld);a._normalMatrix.getInverse(a._modelViewMatrix);a._normalMatrix.transpose()}function t(a,b,c){if(Sa!==a){a?
k.enable(k.POLYGON_OFFSET_FILL):k.disable(k.POLYGON_OFFSET_FILL);Sa=a}if(a&&(Va!==b||Mb!==c)){k.polygonOffset(b,c);Va=b;Mb=c}}function u(a){for(var a=a.split("\n"),b=0,c=a.length;b<c;b++)a[b]=b+1+": "+a[b];return a.join("\n")}function z(a,b){var c;a==="fragment"?c=k.createShader(k.FRAGMENT_SHADER):a==="vertex"&&(c=k.createShader(k.VERTEX_SHADER));k.shaderSource(c,b);k.compileShader(c);if(!k.getShaderParameter(c,k.COMPILE_STATUS)){console.error(k.getShaderInfoLog(c));console.error(u(b));return null}return c}
function x(a,b,c){if(c){k.texParameteri(a,k.TEXTURE_WRAP_S,C(b.wrapS));k.texParameteri(a,k.TEXTURE_WRAP_T,C(b.wrapT));k.texParameteri(a,k.TEXTURE_MAG_FILTER,C(b.magFilter));k.texParameteri(a,k.TEXTURE_MIN_FILTER,C(b.minFilter))}else{k.texParameteri(a,k.TEXTURE_WRAP_S,k.CLAMP_TO_EDGE);k.texParameteri(a,k.TEXTURE_WRAP_T,k.CLAMP_TO_EDGE);k.texParameteri(a,k.TEXTURE_MAG_FILTER,B(b.magFilter));k.texParameteri(a,k.TEXTURE_MIN_FILTER,B(b.minFilter))}if(eb&&b.type!==THREE.FloatType&&(b.anisotropy>1||b.__oldAnisotropy)){k.texParameterf(a,
eb.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(b.anisotropy,jb));b.__oldAnisotropy=b.anisotropy}}function A(a,b){k.bindRenderbuffer(k.RENDERBUFFER,a);if(b.depthBuffer&&!b.stencilBuffer){k.renderbufferStorage(k.RENDERBUFFER,k.DEPTH_COMPONENT16,b.width,b.height);k.framebufferRenderbuffer(k.FRAMEBUFFER,k.DEPTH_ATTACHMENT,k.RENDERBUFFER,a)}else if(b.depthBuffer&&b.stencilBuffer){k.renderbufferStorage(k.RENDERBUFFER,k.DEPTH_STENCIL,b.width,b.height);k.framebufferRenderbuffer(k.FRAMEBUFFER,k.DEPTH_STENCIL_ATTACHMENT,
k.RENDERBUFFER,a)}else k.renderbufferStorage(k.RENDERBUFFER,k.RGBA4,b.width,b.height)}function B(a){return a===THREE.NearestFilter||a===THREE.NearestMipMapNearestFilter||a===THREE.NearestMipMapLinearFilter?k.NEAREST:k.LINEAR}function C(a){return a===THREE.RepeatWrapping?k.REPEAT:a===THREE.ClampToEdgeWrapping?k.CLAMP_TO_EDGE:a===THREE.MirroredRepeatWrapping?k.MIRRORED_REPEAT:a===THREE.NearestFilter?k.NEAREST:a===THREE.NearestMipMapNearestFilter?k.NEAREST_MIPMAP_NEAREST:a===THREE.NearestMipMapLinearFilter?
k.NEAREST_MIPMAP_LINEAR:a===THREE.LinearFilter?k.LINEAR:a===THREE.LinearMipMapNearestFilter?k.LINEAR_MIPMAP_NEAREST:a===THREE.LinearMipMapLinearFilter?k.LINEAR_MIPMAP_LINEAR:a===THREE.UnsignedByteType?k.UNSIGNED_BYTE:a===THREE.UnsignedShort4444Type?k.UNSIGNED_SHORT_4_4_4_4:a===THREE.UnsignedShort5551Type?k.UNSIGNED_SHORT_5_5_5_1:a===THREE.UnsignedShort565Type?k.UNSIGNED_SHORT_5_6_5:a===THREE.ByteType?k.BYTE:a===THREE.ShortType?k.SHORT:a===THREE.UnsignedShortType?k.UNSIGNED_SHORT:a===THREE.IntType?
k.INT:a===THREE.UnsignedIntType?k.UNSIGNED_INT:a===THREE.FloatType?k.FLOAT:a===THREE.AlphaFormat?k.ALPHA:a===THREE.RGBFormat?k.RGB:a===THREE.RGBAFormat?k.RGBA:a===THREE.LuminanceFormat?k.LUMINANCE:a===THREE.LuminanceAlphaFormat?k.LUMINANCE_ALPHA:a===THREE.AddEquation?k.FUNC_ADD:a===THREE.SubtractEquation?k.FUNC_SUBTRACT:a===THREE.ReverseSubtractEquation?k.FUNC_REVERSE_SUBTRACT:a===THREE.ZeroFactor?k.ZERO:a===THREE.OneFactor?k.ONE:a===THREE.SrcColorFactor?k.SRC_COLOR:a===THREE.OneMinusSrcColorFactor?
k.ONE_MINUS_SRC_COLOR:a===THREE.SrcAlphaFactor?k.SRC_ALPHA:a===THREE.OneMinusSrcAlphaFactor?k.ONE_MINUS_SRC_ALPHA:a===THREE.DstAlphaFactor?k.DST_ALPHA:a===THREE.OneMinusDstAlphaFactor?k.ONE_MINUS_DST_ALPHA:a===THREE.DstColorFactor?k.DST_COLOR:a===THREE.OneMinusDstColorFactor?k.ONE_MINUS_DST_COLOR:a===THREE.SrcAlphaSaturateFactor?k.SRC_ALPHA_SATURATE:0}console.log("THREE.WebGLRenderer",THREE.REVISION);var a=a||{},v=a.canvas!==void 0?a.canvas:document.createElement("canvas"),J=a.precision!==void 0?
a.precision:"highp",F=a.alpha!==void 0?a.alpha:true,O=a.premultipliedAlpha!==void 0?a.premultipliedAlpha:true,P=a.antialias!==void 0?a.antialias:false,G=a.stencil!==void 0?a.stencil:true,E=a.preserveDrawingBuffer!==void 0?a.preserveDrawingBuffer:false,I=a.clearColor!==void 0?new THREE.Color(a.clearColor):new THREE.Color(0),R=a.clearAlpha!==void 0?a.clearAlpha:0,M=a.maxLights!==void 0?a.maxLights:4;this.domElement=v;this.context=null;this.autoUpdateScene=this.autoUpdateObjects=this.sortObjects=this.autoClearStencil=
this.autoClearDepth=this.autoClearColor=this.autoClear=true;this.shadowMapEnabled=this.physicallyBasedShading=this.gammaOutput=this.gammaInput=false;this.shadowMapCullFrontFaces=this.shadowMapSoft=this.shadowMapAutoUpdate=true;this.shadowMapCascade=this.shadowMapDebug=false;this.maxMorphTargets=8;this.maxMorphNormals=4;this.autoScaleCubemaps=true;this.renderPluginsPre=[];this.renderPluginsPost=[];this.info={memory:{programs:0,geometries:0,textures:0},render:{calls:0,vertices:0,faces:0,points:0}};
var H=this,V=[],Q=0,L=null,W=null,ha=-1,ia=null,da=null,Z=0,ba=-1,$=-1,ca=-1,ma=-1,sa=-1,bb=-1,qa=-1,Ia=-1,Sa=null,Va=null,Mb=null,ub=null,Ub=0,vb=0,fb=0,gb=0,hb=0,Ka=0,Da=new THREE.Frustum,Za=new THREE.Matrix4,Ea=new THREE.Matrix4,Ta=new THREE.Vector4,La=new THREE.Vector3,ta=true,ib={ambient:[0,0,0],directional:{length:0,colors:[],positions:[]},point:{length:0,colors:[],positions:[],distances:[]},spot:{length:0,colors:[],positions:[],distances:[],directions:[],angles:[],exponents:[]}},k,eb;try{if(!(k=
v.getContext("experimental-webgl",{alpha:F,premultipliedAlpha:O,antialias:P,stencil:G,preserveDrawingBuffer:E})))throw"Error creating WebGL context.";}catch(Wa){console.error(Wa)}a=k.getExtension("OES_texture_float");F=k.getExtension("OES_standard_derivatives");eb=k.getExtension("EXT_texture_filter_anisotropic")||k.getExtension("MOZ_EXT_texture_filter_anisotropic")||k.getExtension("WEBKIT_EXT_texture_filter_anisotropic");a||console.log("THREE.WebGLRenderer: Float textures not supported.");F||console.log("THREE.WebGLRenderer: Standard derivatives not supported.");
eb||console.log("THREE.WebGLRenderer: Anisotropic texture filtering not supported.");k.clearColor(0,0,0,1);k.clearDepth(1);k.clearStencil(0);k.enable(k.DEPTH_TEST);k.depthFunc(k.LEQUAL);k.frontFace(k.CCW);k.cullFace(k.BACK);k.enable(k.CULL_FACE);k.enable(k.BLEND);k.blendEquation(k.FUNC_ADD);k.blendFunc(k.SRC_ALPHA,k.ONE_MINUS_SRC_ALPHA);k.clearColor(I.r,I.g,I.b,R);this.context=k;F=k.getParameter(k.MAX_VERTEX_TEXTURE_IMAGE_UNITS);k.getParameter(k.MAX_TEXTURE_SIZE);var Nb=k.getParameter(k.MAX_CUBE_MAP_TEXTURE_SIZE),
jb=eb?k.getParameter(eb.MAX_TEXTURE_MAX_ANISOTROPY_EXT):0,Cc=F>0,jc=Cc&&a;this.getContext=function(){return k};this.supportsVertexTextures=function(){return Cc};this.getMaxAnisotropy=function(){return jb};this.setSize=function(a,b){v.width=a;v.height=b;this.setViewport(0,0,v.width,v.height)};this.setViewport=function(a,b,c,d){Ub=a!==void 0?a:0;vb=b!==void 0?b:0;fb=c!==void 0?c:v.width;gb=d!==void 0?d:v.height;k.viewport(Ub,vb,fb,gb)};this.setScissor=function(a,b,c,d){k.scissor(a,b,c,d)};this.enableScissorTest=
function(a){a?k.enable(k.SCISSOR_TEST):k.disable(k.SCISSOR_TEST)};this.setClearColorHex=function(a,b){I.setHex(a);R=b;k.clearColor(I.r,I.g,I.b,R)};this.setClearColor=function(a,b){I.copy(a);R=b;k.clearColor(I.r,I.g,I.b,R)};this.getClearColor=function(){return I};this.getClearAlpha=function(){return R};this.clear=function(a,b,c){var d=0;if(a===void 0||a)d=d|k.COLOR_BUFFER_BIT;if(b===void 0||b)d=d|k.DEPTH_BUFFER_BIT;if(c===void 0||c)d=d|k.STENCIL_BUFFER_BIT;k.clear(d)};this.clearTarget=function(a,b,
c,d){this.setRenderTarget(a);this.clear(b,c,d)};this.addPostPlugin=function(a){a.init(this);this.renderPluginsPost.push(a)};this.addPrePlugin=function(a){a.init(this);this.renderPluginsPre.push(a)};this.deallocateObject=function(a){if(a.__webglInit){a.__webglInit=false;delete a._modelViewMatrix;delete a._normalMatrix;delete a._normalMatrixArray;delete a._modelViewMatrixArray;delete a._modelMatrixArray;if(a instanceof THREE.Mesh)for(var b in a.geometry.geometryGroups){var c=a.geometry.geometryGroups[b];
k.deleteBuffer(c.__webglVertexBuffer);k.deleteBuffer(c.__webglNormalBuffer);k.deleteBuffer(c.__webglTangentBuffer);k.deleteBuffer(c.__webglColorBuffer);k.deleteBuffer(c.__webglUVBuffer);k.deleteBuffer(c.__webglUV2Buffer);k.deleteBuffer(c.__webglSkinVertexABuffer);k.deleteBuffer(c.__webglSkinVertexBBuffer);k.deleteBuffer(c.__webglSkinIndicesBuffer);k.deleteBuffer(c.__webglSkinWeightsBuffer);k.deleteBuffer(c.__webglFaceBuffer);k.deleteBuffer(c.__webglLineBuffer);var d=void 0,e=void 0;if(c.numMorphTargets){d=
0;for(e=c.numMorphTargets;d<e;d++)k.deleteBuffer(c.__webglMorphTargetsBuffers[d])}if(c.numMorphNormals){d=0;for(e=c.numMorphNormals;d<e;d++)k.deleteBuffer(c.__webglMorphNormalsBuffers[d])}if(c.__webglCustomAttributesList){d=void 0;for(d in c.__webglCustomAttributesList)k.deleteBuffer(c.__webglCustomAttributesList[d].buffer)}H.info.memory.geometries--}else if(a instanceof THREE.Ribbon){a=a.geometry;k.deleteBuffer(a.__webglVertexBuffer);k.deleteBuffer(a.__webglColorBuffer);H.info.memory.geometries--}else if(a instanceof
THREE.Line){a=a.geometry;k.deleteBuffer(a.__webglVertexBuffer);k.deleteBuffer(a.__webglColorBuffer);H.info.memory.geometries--}else if(a instanceof THREE.ParticleSystem){a=a.geometry;k.deleteBuffer(a.__webglVertexBuffer);k.deleteBuffer(a.__webglColorBuffer);H.info.memory.geometries--}}};this.deallocateTexture=function(a){if(a.__webglInit){a.__webglInit=false;k.deleteTexture(a.__webglTexture);H.info.memory.textures--}};this.deallocateRenderTarget=function(a){if(a&&a.__webglTexture){k.deleteTexture(a.__webglTexture);
if(a instanceof THREE.WebGLRenderTargetCube)for(var b=0;b<6;b++){k.deleteFramebuffer(a.__webglFramebuffer[b]);k.deleteRenderbuffer(a.__webglRenderbuffer[b])}else{k.deleteFramebuffer(a.__webglFramebuffer);k.deleteRenderbuffer(a.__webglRenderbuffer)}}};this.deallocateMaterial=function(a){var b=a.program;if(b){a.program=void 0;var c,d,e=false,a=0;for(c=V.length;a<c;a++){d=V[a];if(d.program===b){d.usedTimes--;d.usedTimes===0&&(e=true);break}}if(e){e=[];a=0;for(c=V.length;a<c;a++){d=V[a];d.program!==b&&
e.push(d)}V=e;k.deleteProgram(b);H.info.memory.programs--}}};this.updateShadowMap=function(a,b){L=null;ha=ia=Ia=qa=ca=-1;ta=true;$=ba=-1;this.shadowMapPlugin.update(a,b)};this.renderBufferImmediate=function(a,b,c){if(a.hasPositions&&!a.__webglVertexBuffer)a.__webglVertexBuffer=k.createBuffer();if(a.hasNormals&&!a.__webglNormalBuffer)a.__webglNormalBuffer=k.createBuffer();if(a.hasUvs&&!a.__webglUvBuffer)a.__webglUvBuffer=k.createBuffer();if(a.hasColors&&!a.__webglColorBuffer)a.__webglColorBuffer=k.createBuffer();
if(a.hasPositions){k.bindBuffer(k.ARRAY_BUFFER,a.__webglVertexBuffer);k.bufferData(k.ARRAY_BUFFER,a.positionArray,k.DYNAMIC_DRAW);k.enableVertexAttribArray(b.attributes.position);k.vertexAttribPointer(b.attributes.position,3,k.FLOAT,false,0,0)}if(a.hasNormals){k.bindBuffer(k.ARRAY_BUFFER,a.__webglNormalBuffer);if(c.shading===THREE.FlatShading){var d,e,f,g,h,i,j,l,n,o,m,p=a.count*3;for(m=0;m<p;m=m+9){o=a.normalArray;d=o[m];e=o[m+1];f=o[m+2];g=o[m+3];i=o[m+4];l=o[m+5];h=o[m+6];j=o[m+7];n=o[m+8];d=(d+
g+h)/3;e=(e+i+j)/3;f=(f+l+n)/3;o[m]=d;o[m+1]=e;o[m+2]=f;o[m+3]=d;o[m+4]=e;o[m+5]=f;o[m+6]=d;o[m+7]=e;o[m+8]=f}}k.bufferData(k.ARRAY_BUFFER,a.normalArray,k.DYNAMIC_DRAW);k.enableVertexAttribArray(b.attributes.normal);k.vertexAttribPointer(b.attributes.normal,3,k.FLOAT,false,0,0)}if(a.hasUvs&&c.map){k.bindBuffer(k.ARRAY_BUFFER,a.__webglUvBuffer);k.bufferData(k.ARRAY_BUFFER,a.uvArray,k.DYNAMIC_DRAW);k.enableVertexAttribArray(b.attributes.uv);k.vertexAttribPointer(b.attributes.uv,2,k.FLOAT,false,0,0)}if(a.hasColors&&
c.vertexColors!==THREE.NoColors){k.bindBuffer(k.ARRAY_BUFFER,a.__webglColorBuffer);k.bufferData(k.ARRAY_BUFFER,a.colorArray,k.DYNAMIC_DRAW);k.enableVertexAttribArray(b.attributes.color);k.vertexAttribPointer(b.attributes.color,3,k.FLOAT,false,0,0)}k.drawArrays(k.TRIANGLES,0,a.count);a.count=0};this.renderBufferDirect=function(a,b,c,d,e,f){if(d.visible!==false){c=r(a,b,c,d,f);a=c.attributes;b=false;d=e.id*16777215+c.id*2+(d.wireframe?1:0);if(d!==ia){ia=d;b=true}if(f instanceof THREE.Mesh){f=e.offsets;
f.length>1&&(b=true);d=0;for(c=f.length;d<c;++d){var g=f[d].index;if(b){var h=e.attributes.position,i=h.itemSize;k.bindBuffer(k.ARRAY_BUFFER,h.buffer);k.vertexAttribPointer(a.position,i,k.FLOAT,false,0,g*i*4);h=e.attributes.normal;if(a.normal>=0&&h){i=h.itemSize;k.bindBuffer(k.ARRAY_BUFFER,h.buffer);k.vertexAttribPointer(a.normal,i,k.FLOAT,false,0,g*i*4)}h=e.attributes.uv;if(a.uv>=0&&h)if(h.buffer){i=h.itemSize;k.bindBuffer(k.ARRAY_BUFFER,h.buffer);k.vertexAttribPointer(a.uv,i,k.FLOAT,false,0,g*i*
4);k.enableVertexAttribArray(a.uv)}else k.disableVertexAttribArray(a.uv);h=e.attributes.color;if(a.color>=0&&h){i=h.itemSize;k.bindBuffer(k.ARRAY_BUFFER,h.buffer);k.vertexAttribPointer(a.color,i,k.FLOAT,false,0,g*i*4)}h=e.attributes.tangent;if(a.tangent>=0&&h){i=h.itemSize;k.bindBuffer(k.ARRAY_BUFFER,h.buffer);k.vertexAttribPointer(a.tangent,i,k.FLOAT,false,0,g*i*4)}k.bindBuffer(k.ELEMENT_ARRAY_BUFFER,e.attributes.index.buffer)}k.drawElements(k.TRIANGLES,f[d].count,k.UNSIGNED_SHORT,f[d].start*2);
H.info.render.calls++;H.info.render.vertices=H.info.render.vertices+f[d].count;H.info.render.faces=H.info.render.faces+f[d].count/3}}}};this.renderBuffer=function(a,b,c,d,e,f){if(d.visible!==false){var g,i,c=r(a,b,c,d,f),b=c.attributes,a=false,c=e.id*16777215+c.id*2+(d.wireframe?1:0);if(c!==ia){ia=c;a=true}if(!d.morphTargets&&b.position>=0){if(a){k.bindBuffer(k.ARRAY_BUFFER,e.__webglVertexBuffer);k.vertexAttribPointer(b.position,3,k.FLOAT,false,0,0)}}else if(f.morphTargetBase){c=d.program.attributes;
if(f.morphTargetBase!==-1){k.bindBuffer(k.ARRAY_BUFFER,e.__webglMorphTargetsBuffers[f.morphTargetBase]);k.vertexAttribPointer(c.position,3,k.FLOAT,false,0,0)}else if(c.position>=0){k.bindBuffer(k.ARRAY_BUFFER,e.__webglVertexBuffer);k.vertexAttribPointer(c.position,3,k.FLOAT,false,0,0)}if(f.morphTargetForcedOrder.length){var j=0;i=f.morphTargetForcedOrder;for(g=f.morphTargetInfluences;j<d.numSupportedMorphTargets&&j<i.length;){k.bindBuffer(k.ARRAY_BUFFER,e.__webglMorphTargetsBuffers[i[j]]);k.vertexAttribPointer(c["morphTarget"+
j],3,k.FLOAT,false,0,0);if(d.morphNormals){k.bindBuffer(k.ARRAY_BUFFER,e.__webglMorphNormalsBuffers[i[j]]);k.vertexAttribPointer(c["morphNormal"+j],3,k.FLOAT,false,0,0)}f.__webglMorphTargetInfluences[j]=g[i[j]];j++}}else{i=[];g=f.morphTargetInfluences;var l,n=g.length;for(l=0;l<n;l++){j=g[l];j>0&&i.push([l,j])}if(i.length>d.numSupportedMorphTargets){i.sort(h);i.length=d.numSupportedMorphTargets}else i.length>d.numSupportedMorphNormals?i.sort(h):i.length===0&&i.push([0,0]);for(j=0;j<d.numSupportedMorphTargets;){if(i[j]){l=
i[j][0];k.bindBuffer(k.ARRAY_BUFFER,e.__webglMorphTargetsBuffers[l]);k.vertexAttribPointer(c["morphTarget"+j],3,k.FLOAT,false,0,0);if(d.morphNormals){k.bindBuffer(k.ARRAY_BUFFER,e.__webglMorphNormalsBuffers[l]);k.vertexAttribPointer(c["morphNormal"+j],3,k.FLOAT,false,0,0)}f.__webglMorphTargetInfluences[j]=g[l]}else{k.vertexAttribPointer(c["morphTarget"+j],3,k.FLOAT,false,0,0);d.morphNormals&&k.vertexAttribPointer(c["morphNormal"+j],3,k.FLOAT,false,0,0);f.__webglMorphTargetInfluences[j]=0}j++}}d.program.uniforms.morphTargetInfluences!==
null&&k.uniform1fv(d.program.uniforms.morphTargetInfluences,f.__webglMorphTargetInfluences)}if(a){if(e.__webglCustomAttributesList){g=0;for(i=e.__webglCustomAttributesList.length;g<i;g++){c=e.__webglCustomAttributesList[g];if(b[c.buffer.belongsToAttribute]>=0){k.bindBuffer(k.ARRAY_BUFFER,c.buffer);k.vertexAttribPointer(b[c.buffer.belongsToAttribute],c.size,k.FLOAT,false,0,0)}}}if(b.color>=0){k.bindBuffer(k.ARRAY_BUFFER,e.__webglColorBuffer);k.vertexAttribPointer(b.color,3,k.FLOAT,false,0,0)}if(b.normal>=
0){k.bindBuffer(k.ARRAY_BUFFER,e.__webglNormalBuffer);k.vertexAttribPointer(b.normal,3,k.FLOAT,false,0,0)}if(b.tangent>=0){k.bindBuffer(k.ARRAY_BUFFER,e.__webglTangentBuffer);k.vertexAttribPointer(b.tangent,4,k.FLOAT,false,0,0)}if(b.uv>=0)if(e.__webglUVBuffer){k.bindBuffer(k.ARRAY_BUFFER,e.__webglUVBuffer);k.vertexAttribPointer(b.uv,2,k.FLOAT,false,0,0);k.enableVertexAttribArray(b.uv)}else k.disableVertexAttribArray(b.uv);if(b.uv2>=0)if(e.__webglUV2Buffer){k.bindBuffer(k.ARRAY_BUFFER,e.__webglUV2Buffer);
k.vertexAttribPointer(b.uv2,2,k.FLOAT,false,0,0);k.enableVertexAttribArray(b.uv2)}else k.disableVertexAttribArray(b.uv2);if(d.skinning&&b.skinVertexA>=0&&b.skinVertexB>=0&&b.skinIndex>=0&&b.skinWeight>=0){k.bindBuffer(k.ARRAY_BUFFER,e.__webglSkinVertexABuffer);k.vertexAttribPointer(b.skinVertexA,4,k.FLOAT,false,0,0);k.bindBuffer(k.ARRAY_BUFFER,e.__webglSkinVertexBBuffer);k.vertexAttribPointer(b.skinVertexB,4,k.FLOAT,false,0,0);k.bindBuffer(k.ARRAY_BUFFER,e.__webglSkinIndicesBuffer);k.vertexAttribPointer(b.skinIndex,
4,k.FLOAT,false,0,0);k.bindBuffer(k.ARRAY_BUFFER,e.__webglSkinWeightsBuffer);k.vertexAttribPointer(b.skinWeight,4,k.FLOAT,false,0,0)}}if(f instanceof THREE.Mesh){if(d.wireframe){d=d.wireframeLinewidth;if(d!==ub){k.lineWidth(d);ub=d}a&&k.bindBuffer(k.ELEMENT_ARRAY_BUFFER,e.__webglLineBuffer);k.drawElements(k.LINES,e.__webglLineCount,k.UNSIGNED_SHORT,0)}else{a&&k.bindBuffer(k.ELEMENT_ARRAY_BUFFER,e.__webglFaceBuffer);k.drawElements(k.TRIANGLES,e.__webglFaceCount,k.UNSIGNED_SHORT,0)}H.info.render.calls++;
H.info.render.vertices=H.info.render.vertices+e.__webglFaceCount;H.info.render.faces=H.info.render.faces+e.__webglFaceCount/3}else if(f instanceof THREE.Line){f=f.type===THREE.LineStrip?k.LINE_STRIP:k.LINES;d=d.linewidth;if(d!==ub){k.lineWidth(d);ub=d}k.drawArrays(f,0,e.__webglLineCount);H.info.render.calls++}else if(f instanceof THREE.ParticleSystem){k.drawArrays(k.POINTS,0,e.__webglParticleCount);H.info.render.calls++;H.info.render.points=H.info.render.points+e.__webglParticleCount}else if(f instanceof
THREE.Ribbon){k.drawArrays(k.TRIANGLE_STRIP,0,e.__webglVertexCount);H.info.render.calls++}}};this.render=function(a,b,c,d){if(b instanceof THREE.Camera===false)console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");else{var e,f,h,n,o=a.__lights,m=a.fog;ha=-1;ta=true;this.autoUpdateScene&&a.updateMatrixWorld();b.parent===void 0&&b.updateMatrixWorld();if(!b._viewMatrixArray)b._viewMatrixArray=new Float32Array(16);if(!b._projectionMatrixArray)b._projectionMatrixArray=
new Float32Array(16);b.matrixWorldInverse.getInverse(b.matrixWorld);b.matrixWorldInverse.flattenToArray(b._viewMatrixArray);b.projectionMatrix.flattenToArray(b._projectionMatrixArray);Za.multiply(b.projectionMatrix,b.matrixWorldInverse);Da.setFromMatrix(Za);this.autoUpdateObjects&&this.initWebGLObjects(a);i(this.renderPluginsPre,a,b);H.info.render.calls=0;H.info.render.vertices=0;H.info.render.faces=0;H.info.render.points=0;this.setRenderTarget(c);(this.autoClear||d)&&this.clear(this.autoClearColor,
this.autoClearDepth,this.autoClearStencil);n=a.__webglObjects;d=0;for(e=n.length;d<e;d++){f=n[d];h=f.object;f.render=false;if(h.visible&&(!(h instanceof THREE.Mesh||h instanceof THREE.ParticleSystem)||!h.frustumCulled||Da.contains(h))){s(h,b);var p=f,q=p.object,r=p.buffer,u=void 0,u=u=void 0,u=q.material;if(u instanceof THREE.MeshFaceMaterial){u=r.materialIndex;if(u>=0){u=q.geometry.materials[u];if(u.transparent){p.transparent=u;p.opaque=null}else{p.opaque=u;p.transparent=null}}}else if(u)if(u.transparent){p.transparent=
u;p.opaque=null}else{p.opaque=u;p.transparent=null}f.render=true;if(this.sortObjects)if(h.renderDepth)f.z=h.renderDepth;else{Ta.copy(h.matrixWorld.getPosition());Za.multiplyVector3(Ta);f.z=Ta.z}}}this.sortObjects&&n.sort(g);n=a.__webglObjectsImmediate;d=0;for(e=n.length;d<e;d++){f=n[d];h=f.object;if(h.visible){s(h,b);h=f.object.material;if(h.transparent){f.transparent=h;f.opaque=null}else{f.opaque=h;f.transparent=null}}}if(a.overrideMaterial){d=a.overrideMaterial;this.setBlending(d.blending,d.blendEquation,
d.blendSrc,d.blendDst);this.setDepthTest(d.depthTest);this.setDepthWrite(d.depthWrite);t(d.polygonOffset,d.polygonOffsetFactor,d.polygonOffsetUnits);j(a.__webglObjects,false,"",b,o,m,true,d);l(a.__webglObjectsImmediate,"",b,o,m,false,d)}else{this.setBlending(THREE.NormalBlending);j(a.__webglObjects,true,"opaque",b,o,m,false);l(a.__webglObjectsImmediate,"opaque",b,o,m,false);j(a.__webglObjects,false,"transparent",b,o,m,true);l(a.__webglObjectsImmediate,"transparent",b,o,m,true)}i(this.renderPluginsPost,
a,b);if(c&&c.generateMipmaps&&c.minFilter!==THREE.NearestFilter&&c.minFilter!==THREE.LinearFilter)if(c instanceof THREE.WebGLRenderTargetCube){k.bindTexture(k.TEXTURE_CUBE_MAP,c.__webglTexture);k.generateMipmap(k.TEXTURE_CUBE_MAP);k.bindTexture(k.TEXTURE_CUBE_MAP,null)}else{k.bindTexture(k.TEXTURE_2D,c.__webglTexture);k.generateMipmap(k.TEXTURE_2D);k.bindTexture(k.TEXTURE_2D,null)}this.setDepthTest(true);this.setDepthWrite(true)}};this.renderImmediateObject=function(a,b,c,d,e){var f=r(a,b,c,d,e);
ia=-1;H.setMaterialFaces(d);e.immediateRenderCallback?e.immediateRenderCallback(f,k,Da):e.render(function(a){H.renderBufferImmediate(a,f,d)})};this.initWebGLObjects=function(a){if(!a.__webglObjects){a.__webglObjects=[];a.__webglObjectsImmediate=[];a.__webglSprites=[];a.__webglFlares=[]}for(;a.__objectsAdded.length;){var g=a.__objectsAdded[0],h=a,i=void 0,j=void 0,l=void 0;if(!g.__webglInit){g.__webglInit=true;g._modelViewMatrix=new THREE.Matrix4;g._normalMatrix=new THREE.Matrix3;if(g instanceof THREE.Mesh){j=
g.geometry;if(j instanceof THREE.Geometry){if(j.geometryGroups===void 0){var r=j,s=void 0,u=void 0,t=void 0,z=void 0,v=void 0,x=void 0,A=void 0,C={},B=r.morphTargets.length,E=r.morphNormals.length;r.geometryGroups={};s=0;for(u=r.faces.length;s<u;s++){t=r.faces[s];z=t.materialIndex;x=z!==void 0?z:-1;C[x]===void 0&&(C[x]={hash:x,counter:0});A=C[x].hash+"_"+C[x].counter;r.geometryGroups[A]===void 0&&(r.geometryGroups[A]={faces3:[],faces4:[],materialIndex:z,vertices:0,numMorphTargets:B,numMorphNormals:E});
v=t instanceof THREE.Face3?3:4;if(r.geometryGroups[A].vertices+v>65535){C[x].counter=C[x].counter+1;A=C[x].hash+"_"+C[x].counter;r.geometryGroups[A]===void 0&&(r.geometryGroups[A]={faces3:[],faces4:[],materialIndex:z,vertices:0,numMorphTargets:B,numMorphNormals:E})}t instanceof THREE.Face3?r.geometryGroups[A].faces3.push(s):r.geometryGroups[A].faces4.push(s);r.geometryGroups[A].vertices=r.geometryGroups[A].vertices+v}r.geometryGroupsList=[];var I=void 0;for(I in r.geometryGroups){r.geometryGroups[I].id=
Z++;r.geometryGroupsList.push(r.geometryGroups[I])}}for(i in j.geometryGroups){l=j.geometryGroups[i];if(!l.__webglVertexBuffer){var F=l;F.__webglVertexBuffer=k.createBuffer();F.__webglNormalBuffer=k.createBuffer();F.__webglTangentBuffer=k.createBuffer();F.__webglColorBuffer=k.createBuffer();F.__webglUVBuffer=k.createBuffer();F.__webglUV2Buffer=k.createBuffer();F.__webglSkinVertexABuffer=k.createBuffer();F.__webglSkinVertexBBuffer=k.createBuffer();F.__webglSkinIndicesBuffer=k.createBuffer();F.__webglSkinWeightsBuffer=
k.createBuffer();F.__webglFaceBuffer=k.createBuffer();F.__webglLineBuffer=k.createBuffer();var J=void 0,L=void 0;if(F.numMorphTargets){F.__webglMorphTargetsBuffers=[];J=0;for(L=F.numMorphTargets;J<L;J++)F.__webglMorphTargetsBuffers.push(k.createBuffer())}if(F.numMorphNormals){F.__webglMorphNormalsBuffers=[];J=0;for(L=F.numMorphNormals;J<L;J++)F.__webglMorphNormalsBuffers.push(k.createBuffer())}H.info.memory.geometries++;var G=l,M=g,Q=M.geometry,P=G.faces3,O=G.faces4,$=P.length*3+O.length*4,R=P.length*
1+O.length*2,W=P.length*3+O.length*4,ba=c(M,G),V=f(ba),ca=d(ba),ha=ba.vertexColors?ba.vertexColors:false;G.__vertexArray=new Float32Array($*3);if(ca)G.__normalArray=new Float32Array($*3);if(Q.hasTangents)G.__tangentArray=new Float32Array($*4);if(ha)G.__colorArray=new Float32Array($*3);if(V){if(Q.faceUvs.length>0||Q.faceVertexUvs.length>0)G.__uvArray=new Float32Array($*2);if(Q.faceUvs.length>1||Q.faceVertexUvs.length>1)G.__uv2Array=new Float32Array($*2)}if(M.geometry.skinWeights.length&&M.geometry.skinIndices.length){G.__skinVertexAArray=
new Float32Array($*4);G.__skinVertexBArray=new Float32Array($*4);G.__skinIndexArray=new Float32Array($*4);G.__skinWeightArray=new Float32Array($*4)}G.__faceArray=new Uint16Array(R*3);G.__lineArray=new Uint16Array(W*2);var ma=void 0,ia=void 0;if(G.numMorphTargets){G.__morphTargetsArrays=[];ma=0;for(ia=G.numMorphTargets;ma<ia;ma++)G.__morphTargetsArrays.push(new Float32Array($*3))}if(G.numMorphNormals){G.__morphNormalsArrays=[];ma=0;for(ia=G.numMorphNormals;ma<ia;ma++)G.__morphNormalsArrays.push(new Float32Array($*
3))}G.__webglFaceCount=R*3;G.__webglLineCount=W*2;if(ba.attributes){if(G.__webglCustomAttributesList===void 0)G.__webglCustomAttributesList=[];var sa=void 0;for(sa in ba.attributes){var qa=ba.attributes[sa],da={},bb;for(bb in qa)da[bb]=qa[bb];if(!da.__webglInitialized||da.createUniqueBuffers){da.__webglInitialized=true;var Ia=1;da.type==="v2"?Ia=2:da.type==="v3"?Ia=3:da.type==="v4"?Ia=4:da.type==="c"&&(Ia=3);da.size=Ia;da.array=new Float32Array($*Ia);da.buffer=k.createBuffer();da.buffer.belongsToAttribute=
sa;qa.needsUpdate=true;da.__original=qa}G.__webglCustomAttributesList.push(da)}}G.__inittedArrays=true;j.verticesNeedUpdate=true;j.morphTargetsNeedUpdate=true;j.elementsNeedUpdate=true;j.uvsNeedUpdate=true;j.normalsNeedUpdate=true;j.tangentsNeedUpdate=true;j.colorsNeedUpdate=true}}}else if(j instanceof THREE.BufferGeometry){var ta=j,Da=void 0,Ea=void 0,Sa=void 0;for(Da in ta.attributes){Sa=Da==="index"?k.ELEMENT_ARRAY_BUFFER:k.ARRAY_BUFFER;Ea=ta.attributes[Da];Ea.buffer=k.createBuffer();k.bindBuffer(Sa,
Ea.buffer);k.bufferData(Sa,Ea.array,k.STATIC_DRAW)}}}else if(g instanceof THREE.Ribbon){j=g.geometry;if(!j.__webglVertexBuffer){var La=j;La.__webglVertexBuffer=k.createBuffer();La.__webglColorBuffer=k.createBuffer();H.info.memory.geometries++;var Ka=j,Va=Ka.vertices.length;Ka.__vertexArray=new Float32Array(Va*3);Ka.__colorArray=new Float32Array(Va*3);Ka.__webglVertexCount=Va;j.verticesNeedUpdate=true;j.colorsNeedUpdate=true}}else if(g instanceof THREE.Line){j=g.geometry;if(!j.__webglVertexBuffer){var Wa=
j;Wa.__webglVertexBuffer=k.createBuffer();Wa.__webglColorBuffer=k.createBuffer();H.info.memory.geometries++;var Ta=j,hb=g,eb=Ta.vertices.length;Ta.__vertexArray=new Float32Array(eb*3);Ta.__colorArray=new Float32Array(eb*3);Ta.__webglLineCount=eb;b(Ta,hb);j.verticesNeedUpdate=true;j.colorsNeedUpdate=true}}else if(g instanceof THREE.ParticleSystem){j=g.geometry;if(!j.__webglVertexBuffer){var ub=j;ub.__webglVertexBuffer=k.createBuffer();ub.__webglColorBuffer=k.createBuffer();H.info.geometries++;var Za=
j,Ub=g,vb=Za.vertices.length;Za.__vertexArray=new Float32Array(vb*3);Za.__colorArray=new Float32Array(vb*3);Za.__sortArray=[];Za.__webglParticleCount=vb;b(Za,Ub);j.verticesNeedUpdate=true;j.colorsNeedUpdate=true}}}if(!g.__webglActive){if(g instanceof THREE.Mesh){j=g.geometry;if(j instanceof THREE.BufferGeometry)o(h.__webglObjects,j,g);else for(i in j.geometryGroups){l=j.geometryGroups[i];o(h.__webglObjects,l,g)}}else if(g instanceof THREE.Ribbon||g instanceof THREE.Line||g instanceof THREE.ParticleSystem){j=
g.geometry;o(h.__webglObjects,j,g)}else g instanceof THREE.ImmediateRenderObject||g.immediateRenderCallback?h.__webglObjectsImmediate.push({object:g,opaque:null,transparent:null}):g instanceof THREE.Sprite?h.__webglSprites.push(g):g instanceof THREE.LensFlare&&h.__webglFlares.push(g);g.__webglActive=true}a.__objectsAdded.splice(0,1)}for(;a.__objectsRemoved.length;){var mb=a.__objectsRemoved[0],ib=a;mb instanceof THREE.Mesh||mb instanceof THREE.ParticleSystem||mb instanceof THREE.Ribbon||mb instanceof
THREE.Line?q(ib.__webglObjects,mb):mb instanceof THREE.Sprite?n(ib.__webglSprites,mb):mb instanceof THREE.LensFlare?n(ib.__webglFlares,mb):(mb instanceof THREE.ImmediateRenderObject||mb.immediateRenderCallback)&&q(ib.__webglObjectsImmediate,mb);mb.__webglActive=false;a.__objectsRemoved.splice(0,1)}for(var Mb=0,Nb=a.__webglObjects.length;Mb<Nb;Mb++){var sb=a.__webglObjects[Mb].object,ea=sb.geometry,jb=void 0,fb=void 0,$a=void 0;if(sb instanceof THREE.Mesh)if(ea instanceof THREE.BufferGeometry){if(ea.verticesNeedUpdate||
ea.elementsNeedUpdate||ea.uvsNeedUpdate||ea.normalsNeedUpdate||ea.colorsNeedUpdate||ea.tangentsNeedUpdate){var Ob=ea,gb=k.DYNAMIC_DRAW,Cc=!ea.dynamic,vc=Ob.attributes,jc=vc.index,cd=vc.position,dd=vc.normal,ed=vc.uv,fd=vc.color,gd=vc.tangent;if(Ob.elementsNeedUpdate&&jc!==void 0){k.bindBuffer(k.ELEMENT_ARRAY_BUFFER,jc.buffer);k.bufferData(k.ELEMENT_ARRAY_BUFFER,jc.array,gb)}if(Ob.verticesNeedUpdate&&cd!==void 0){k.bindBuffer(k.ARRAY_BUFFER,cd.buffer);k.bufferData(k.ARRAY_BUFFER,cd.array,gb)}if(Ob.normalsNeedUpdate&&
dd!==void 0){k.bindBuffer(k.ARRAY_BUFFER,dd.buffer);k.bufferData(k.ARRAY_BUFFER,dd.array,gb)}if(Ob.uvsNeedUpdate&&ed!==void 0){k.bindBuffer(k.ARRAY_BUFFER,ed.buffer);k.bufferData(k.ARRAY_BUFFER,ed.array,gb)}if(Ob.colorsNeedUpdate&&fd!==void 0){k.bindBuffer(k.ARRAY_BUFFER,fd.buffer);k.bufferData(k.ARRAY_BUFFER,fd.array,gb)}if(Ob.tangentsNeedUpdate&&gd!==void 0){k.bindBuffer(k.ARRAY_BUFFER,gd.buffer);k.bufferData(k.ARRAY_BUFFER,gd.array,gb)}if(Cc){var qd=void 0;for(qd in Ob.attributes)delete Ob.attributes[qd].array}}ea.verticesNeedUpdate=
false;ea.elementsNeedUpdate=false;ea.uvsNeedUpdate=false;ea.normalsNeedUpdate=false;ea.colorsNeedUpdate=false;ea.tangentsNeedUpdate=false}else{for(var hd=0,Cd=ea.geometryGroupsList.length;hd<Cd;hd++){jb=ea.geometryGroupsList[hd];$a=c(sb,jb);fb=$a.attributes&&m($a);if(ea.verticesNeedUpdate||ea.morphTargetsNeedUpdate||ea.elementsNeedUpdate||ea.uvsNeedUpdate||ea.normalsNeedUpdate||ea.colorsNeedUpdate||ea.tangentsNeedUpdate||fb){var ga=jb,Dd=sb,cb=k.DYNAMIC_DRAW,Ed=!ea.dynamic,nc=$a;if(ga.__inittedArrays){var rd=
d(nc),id=nc.vertexColors?nc.vertexColors:false,sd=f(nc),Oc=rd===THREE.SmoothShading,D=void 0,X=void 0,rb=void 0,N=void 0,wc=void 0,Xb=void 0,tb=void 0,Pc=void 0,Pb=void 0,xc=void 0,yc=void 0,S=void 0,T=void 0,U=void 0,ka=void 0,wb=void 0,xb=void 0,yb=void 0,Dc=void 0,zb=void 0,Ab=void 0,Bb=void 0,Ec=void 0,Cb=void 0,Db=void 0,Eb=void 0,Fc=void 0,Fb=void 0,Gb=void 0,Hb=void 0,Gc=void 0,Ib=void 0,Jb=void 0,Kb=void 0,Hc=void 0,Yb=void 0,Zb=void 0,$b=void 0,Qc=void 0,ac=void 0,bc=void 0,cc=void 0,Rc=
void 0,pa=void 0,td=void 0,dc=void 0,zc=void 0,Ac=void 0,Oa=void 0,ud=void 0,Ma=void 0,Na=void 0,ec=void 0,Qb=void 0,Fa=0,Ja=0,Rb=0,Sb=0,nb=0,Ua=0,ua=0,Xa=0,Ga=0,K=0,fa=0,y=0,ra=void 0,Pa=ga.__vertexArray,Ic=ga.__uvArray,Jc=ga.__uv2Array,ob=ga.__normalArray,xa=ga.__tangentArray,Qa=ga.__colorArray,ya=ga.__skinVertexAArray,za=ga.__skinVertexBArray,Aa=ga.__skinIndexArray,Ba=ga.__skinWeightArray,jd=ga.__morphTargetsArrays,kd=ga.__morphNormalsArrays,ld=ga.__webglCustomAttributesList,w=void 0,Lb=ga.__faceArray,
db=ga.__lineArray,Ya=Dd.geometry,Fd=Ya.elementsNeedUpdate,vd=Ya.uvsNeedUpdate,Gd=Ya.normalsNeedUpdate,Hd=Ya.tangentsNeedUpdate,Id=Ya.colorsNeedUpdate,Jd=Ya.morphTargetsNeedUpdate,oc=Ya.vertices,na=ga.faces3,oa=ga.faces4,Ha=Ya.faces,md=Ya.faceVertexUvs[0],nd=Ya.faceVertexUvs[1],pc=Ya.skinVerticesA,qc=Ya.skinVerticesB,rc=Ya.skinIndices,fc=Ya.skinWeights,gc=Ya.morphTargets,Sc=Ya.morphNormals;if(Ya.verticesNeedUpdate){D=0;for(X=na.length;D<X;D++){N=Ha[na[D]];S=oc[N.a];T=oc[N.b];U=oc[N.c];Pa[Ja]=S.x;Pa[Ja+
1]=S.y;Pa[Ja+2]=S.z;Pa[Ja+3]=T.x;Pa[Ja+4]=T.y;Pa[Ja+5]=T.z;Pa[Ja+6]=U.x;Pa[Ja+7]=U.y;Pa[Ja+8]=U.z;Ja=Ja+9}D=0;for(X=oa.length;D<X;D++){N=Ha[oa[D]];S=oc[N.a];T=oc[N.b];U=oc[N.c];ka=oc[N.d];Pa[Ja]=S.x;Pa[Ja+1]=S.y;Pa[Ja+2]=S.z;Pa[Ja+3]=T.x;Pa[Ja+4]=T.y;Pa[Ja+5]=T.z;Pa[Ja+6]=U.x;Pa[Ja+7]=U.y;Pa[Ja+8]=U.z;Pa[Ja+9]=ka.x;Pa[Ja+10]=ka.y;Pa[Ja+11]=ka.z;Ja=Ja+12}k.bindBuffer(k.ARRAY_BUFFER,ga.__webglVertexBuffer);k.bufferData(k.ARRAY_BUFFER,Pa,cb)}if(Jd){Oa=0;for(ud=gc.length;Oa<ud;Oa++){D=fa=0;for(X=na.length;D<
X;D++){ec=na[D];N=Ha[ec];S=gc[Oa].vertices[N.a];T=gc[Oa].vertices[N.b];U=gc[Oa].vertices[N.c];Ma=jd[Oa];Ma[fa]=S.x;Ma[fa+1]=S.y;Ma[fa+2]=S.z;Ma[fa+3]=T.x;Ma[fa+4]=T.y;Ma[fa+5]=T.z;Ma[fa+6]=U.x;Ma[fa+7]=U.y;Ma[fa+8]=U.z;if(nc.morphNormals){if(Oc){Qb=Sc[Oa].vertexNormals[ec];zb=Qb.a;Ab=Qb.b;Bb=Qb.c}else Bb=Ab=zb=Sc[Oa].faceNormals[ec];Na=kd[Oa];Na[fa]=zb.x;Na[fa+1]=zb.y;Na[fa+2]=zb.z;Na[fa+3]=Ab.x;Na[fa+4]=Ab.y;Na[fa+5]=Ab.z;Na[fa+6]=Bb.x;Na[fa+7]=Bb.y;Na[fa+8]=Bb.z}fa=fa+9}D=0;for(X=oa.length;D<X;D++){ec=
oa[D];N=Ha[ec];S=gc[Oa].vertices[N.a];T=gc[Oa].vertices[N.b];U=gc[Oa].vertices[N.c];ka=gc[Oa].vertices[N.d];Ma=jd[Oa];Ma[fa]=S.x;Ma[fa+1]=S.y;Ma[fa+2]=S.z;Ma[fa+3]=T.x;Ma[fa+4]=T.y;Ma[fa+5]=T.z;Ma[fa+6]=U.x;Ma[fa+7]=U.y;Ma[fa+8]=U.z;Ma[fa+9]=ka.x;Ma[fa+10]=ka.y;Ma[fa+11]=ka.z;if(nc.morphNormals){if(Oc){Qb=Sc[Oa].vertexNormals[ec];zb=Qb.a;Ab=Qb.b;Bb=Qb.c;Ec=Qb.d}else Ec=Bb=Ab=zb=Sc[Oa].faceNormals[ec];Na=kd[Oa];Na[fa]=zb.x;Na[fa+1]=zb.y;Na[fa+2]=zb.z;Na[fa+3]=Ab.x;Na[fa+4]=Ab.y;Na[fa+5]=Ab.z;Na[fa+
6]=Bb.x;Na[fa+7]=Bb.y;Na[fa+8]=Bb.z;Na[fa+9]=Ec.x;Na[fa+10]=Ec.y;Na[fa+11]=Ec.z}fa=fa+12}k.bindBuffer(k.ARRAY_BUFFER,ga.__webglMorphTargetsBuffers[Oa]);k.bufferData(k.ARRAY_BUFFER,jd[Oa],cb);if(nc.morphNormals){k.bindBuffer(k.ARRAY_BUFFER,ga.__webglMorphNormalsBuffers[Oa]);k.bufferData(k.ARRAY_BUFFER,kd[Oa],cb)}}}if(fc.length){D=0;for(X=na.length;D<X;D++){N=Ha[na[D]];Fb=fc[N.a];Gb=fc[N.b];Hb=fc[N.c];Ba[K]=Fb.x;Ba[K+1]=Fb.y;Ba[K+2]=Fb.z;Ba[K+3]=Fb.w;Ba[K+4]=Gb.x;Ba[K+5]=Gb.y;Ba[K+6]=Gb.z;Ba[K+7]=Gb.w;
Ba[K+8]=Hb.x;Ba[K+9]=Hb.y;Ba[K+10]=Hb.z;Ba[K+11]=Hb.w;Ib=rc[N.a];Jb=rc[N.b];Kb=rc[N.c];Aa[K]=Ib.x;Aa[K+1]=Ib.y;Aa[K+2]=Ib.z;Aa[K+3]=Ib.w;Aa[K+4]=Jb.x;Aa[K+5]=Jb.y;Aa[K+6]=Jb.z;Aa[K+7]=Jb.w;Aa[K+8]=Kb.x;Aa[K+9]=Kb.y;Aa[K+10]=Kb.z;Aa[K+11]=Kb.w;Yb=pc[N.a];Zb=pc[N.b];$b=pc[N.c];ya[K]=Yb.x;ya[K+1]=Yb.y;ya[K+2]=Yb.z;ya[K+3]=1;ya[K+4]=Zb.x;ya[K+5]=Zb.y;ya[K+6]=Zb.z;ya[K+7]=1;ya[K+8]=$b.x;ya[K+9]=$b.y;ya[K+10]=$b.z;ya[K+11]=1;ac=qc[N.a];bc=qc[N.b];cc=qc[N.c];za[K]=ac.x;za[K+1]=ac.y;za[K+2]=ac.z;za[K+3]=
1;za[K+4]=bc.x;za[K+5]=bc.y;za[K+6]=bc.z;za[K+7]=1;za[K+8]=cc.x;za[K+9]=cc.y;za[K+10]=cc.z;za[K+11]=1;K=K+12}D=0;for(X=oa.length;D<X;D++){N=Ha[oa[D]];Fb=fc[N.a];Gb=fc[N.b];Hb=fc[N.c];Gc=fc[N.d];Ba[K]=Fb.x;Ba[K+1]=Fb.y;Ba[K+2]=Fb.z;Ba[K+3]=Fb.w;Ba[K+4]=Gb.x;Ba[K+5]=Gb.y;Ba[K+6]=Gb.z;Ba[K+7]=Gb.w;Ba[K+8]=Hb.x;Ba[K+9]=Hb.y;Ba[K+10]=Hb.z;Ba[K+11]=Hb.w;Ba[K+12]=Gc.x;Ba[K+13]=Gc.y;Ba[K+14]=Gc.z;Ba[K+15]=Gc.w;Ib=rc[N.a];Jb=rc[N.b];Kb=rc[N.c];Hc=rc[N.d];Aa[K]=Ib.x;Aa[K+1]=Ib.y;Aa[K+2]=Ib.z;Aa[K+3]=Ib.w;Aa[K+
4]=Jb.x;Aa[K+5]=Jb.y;Aa[K+6]=Jb.z;Aa[K+7]=Jb.w;Aa[K+8]=Kb.x;Aa[K+9]=Kb.y;Aa[K+10]=Kb.z;Aa[K+11]=Kb.w;Aa[K+12]=Hc.x;Aa[K+13]=Hc.y;Aa[K+14]=Hc.z;Aa[K+15]=Hc.w;Yb=pc[N.a];Zb=pc[N.b];$b=pc[N.c];Qc=pc[N.d];ya[K]=Yb.x;ya[K+1]=Yb.y;ya[K+2]=Yb.z;ya[K+3]=1;ya[K+4]=Zb.x;ya[K+5]=Zb.y;ya[K+6]=Zb.z;ya[K+7]=1;ya[K+8]=$b.x;ya[K+9]=$b.y;ya[K+10]=$b.z;ya[K+11]=1;ya[K+12]=Qc.x;ya[K+13]=Qc.y;ya[K+14]=Qc.z;ya[K+15]=1;ac=qc[N.a];bc=qc[N.b];cc=qc[N.c];Rc=qc[N.d];za[K]=ac.x;za[K+1]=ac.y;za[K+2]=ac.z;za[K+3]=1;za[K+4]=bc.x;
za[K+5]=bc.y;za[K+6]=bc.z;za[K+7]=1;za[K+8]=cc.x;za[K+9]=cc.y;za[K+10]=cc.z;za[K+11]=1;za[K+12]=Rc.x;za[K+13]=Rc.y;za[K+14]=Rc.z;za[K+15]=1;K=K+16}if(K>0){k.bindBuffer(k.ARRAY_BUFFER,ga.__webglSkinVertexABuffer);k.bufferData(k.ARRAY_BUFFER,ya,cb);k.bindBuffer(k.ARRAY_BUFFER,ga.__webglSkinVertexBBuffer);k.bufferData(k.ARRAY_BUFFER,za,cb);k.bindBuffer(k.ARRAY_BUFFER,ga.__webglSkinIndicesBuffer);k.bufferData(k.ARRAY_BUFFER,Aa,cb);k.bindBuffer(k.ARRAY_BUFFER,ga.__webglSkinWeightsBuffer);k.bufferData(k.ARRAY_BUFFER,
Ba,cb)}}if(Id&&id){D=0;for(X=na.length;D<X;D++){N=Ha[na[D]];tb=N.vertexColors;Pc=N.color;if(tb.length===3&&id===THREE.VertexColors){Cb=tb[0];Db=tb[1];Eb=tb[2]}else Eb=Db=Cb=Pc;Qa[Ga]=Cb.r;Qa[Ga+1]=Cb.g;Qa[Ga+2]=Cb.b;Qa[Ga+3]=Db.r;Qa[Ga+4]=Db.g;Qa[Ga+5]=Db.b;Qa[Ga+6]=Eb.r;Qa[Ga+7]=Eb.g;Qa[Ga+8]=Eb.b;Ga=Ga+9}D=0;for(X=oa.length;D<X;D++){N=Ha[oa[D]];tb=N.vertexColors;Pc=N.color;if(tb.length===4&&id===THREE.VertexColors){Cb=tb[0];Db=tb[1];Eb=tb[2];Fc=tb[3]}else Fc=Eb=Db=Cb=Pc;Qa[Ga]=Cb.r;Qa[Ga+1]=Cb.g;
Qa[Ga+2]=Cb.b;Qa[Ga+3]=Db.r;Qa[Ga+4]=Db.g;Qa[Ga+5]=Db.b;Qa[Ga+6]=Eb.r;Qa[Ga+7]=Eb.g;Qa[Ga+8]=Eb.b;Qa[Ga+9]=Fc.r;Qa[Ga+10]=Fc.g;Qa[Ga+11]=Fc.b;Ga=Ga+12}if(Ga>0){k.bindBuffer(k.ARRAY_BUFFER,ga.__webglColorBuffer);k.bufferData(k.ARRAY_BUFFER,Qa,cb)}}if(Hd&&Ya.hasTangents){D=0;for(X=na.length;D<X;D++){N=Ha[na[D]];Pb=N.vertexTangents;wb=Pb[0];xb=Pb[1];yb=Pb[2];xa[ua]=wb.x;xa[ua+1]=wb.y;xa[ua+2]=wb.z;xa[ua+3]=wb.w;xa[ua+4]=xb.x;xa[ua+5]=xb.y;xa[ua+6]=xb.z;xa[ua+7]=xb.w;xa[ua+8]=yb.x;xa[ua+9]=yb.y;xa[ua+
10]=yb.z;xa[ua+11]=yb.w;ua=ua+12}D=0;for(X=oa.length;D<X;D++){N=Ha[oa[D]];Pb=N.vertexTangents;wb=Pb[0];xb=Pb[1];yb=Pb[2];Dc=Pb[3];xa[ua]=wb.x;xa[ua+1]=wb.y;xa[ua+2]=wb.z;xa[ua+3]=wb.w;xa[ua+4]=xb.x;xa[ua+5]=xb.y;xa[ua+6]=xb.z;xa[ua+7]=xb.w;xa[ua+8]=yb.x;xa[ua+9]=yb.y;xa[ua+10]=yb.z;xa[ua+11]=yb.w;xa[ua+12]=Dc.x;xa[ua+13]=Dc.y;xa[ua+14]=Dc.z;xa[ua+15]=Dc.w;ua=ua+16}k.bindBuffer(k.ARRAY_BUFFER,ga.__webglTangentBuffer);k.bufferData(k.ARRAY_BUFFER,xa,cb)}if(Gd&&rd){D=0;for(X=na.length;D<X;D++){N=Ha[na[D]];
wc=N.vertexNormals;Xb=N.normal;if(wc.length===3&&Oc)for(pa=0;pa<3;pa++){dc=wc[pa];ob[Ua]=dc.x;ob[Ua+1]=dc.y;ob[Ua+2]=dc.z;Ua=Ua+3}else for(pa=0;pa<3;pa++){ob[Ua]=Xb.x;ob[Ua+1]=Xb.y;ob[Ua+2]=Xb.z;Ua=Ua+3}}D=0;for(X=oa.length;D<X;D++){N=Ha[oa[D]];wc=N.vertexNormals;Xb=N.normal;if(wc.length===4&&Oc)for(pa=0;pa<4;pa++){dc=wc[pa];ob[Ua]=dc.x;ob[Ua+1]=dc.y;ob[Ua+2]=dc.z;Ua=Ua+3}else for(pa=0;pa<4;pa++){ob[Ua]=Xb.x;ob[Ua+1]=Xb.y;ob[Ua+2]=Xb.z;Ua=Ua+3}}k.bindBuffer(k.ARRAY_BUFFER,ga.__webglNormalBuffer);
k.bufferData(k.ARRAY_BUFFER,ob,cb)}if(vd&&md&&sd){D=0;for(X=na.length;D<X;D++){rb=na[D];N=Ha[rb];xc=md[rb];if(xc!==void 0)for(pa=0;pa<3;pa++){zc=xc[pa];Ic[Rb]=zc.u;Ic[Rb+1]=zc.v;Rb=Rb+2}}D=0;for(X=oa.length;D<X;D++){rb=oa[D];N=Ha[rb];xc=md[rb];if(xc!==void 0)for(pa=0;pa<4;pa++){zc=xc[pa];Ic[Rb]=zc.u;Ic[Rb+1]=zc.v;Rb=Rb+2}}if(Rb>0){k.bindBuffer(k.ARRAY_BUFFER,ga.__webglUVBuffer);k.bufferData(k.ARRAY_BUFFER,Ic,cb)}}if(vd&&nd&&sd){D=0;for(X=na.length;D<X;D++){rb=na[D];N=Ha[rb];yc=nd[rb];if(yc!==void 0)for(pa=
0;pa<3;pa++){Ac=yc[pa];Jc[Sb]=Ac.u;Jc[Sb+1]=Ac.v;Sb=Sb+2}}D=0;for(X=oa.length;D<X;D++){rb=oa[D];N=Ha[rb];yc=nd[rb];if(yc!==void 0)for(pa=0;pa<4;pa++){Ac=yc[pa];Jc[Sb]=Ac.u;Jc[Sb+1]=Ac.v;Sb=Sb+2}}if(Sb>0){k.bindBuffer(k.ARRAY_BUFFER,ga.__webglUV2Buffer);k.bufferData(k.ARRAY_BUFFER,Jc,cb)}}if(Fd){D=0;for(X=na.length;D<X;D++){N=Ha[na[D]];Lb[nb]=Fa;Lb[nb+1]=Fa+1;Lb[nb+2]=Fa+2;nb=nb+3;db[Xa]=Fa;db[Xa+1]=Fa+1;db[Xa+2]=Fa;db[Xa+3]=Fa+2;db[Xa+4]=Fa+1;db[Xa+5]=Fa+2;Xa=Xa+6;Fa=Fa+3}D=0;for(X=oa.length;D<X;D++){N=
Ha[oa[D]];Lb[nb]=Fa;Lb[nb+1]=Fa+1;Lb[nb+2]=Fa+3;Lb[nb+3]=Fa+1;Lb[nb+4]=Fa+2;Lb[nb+5]=Fa+3;nb=nb+6;db[Xa]=Fa;db[Xa+1]=Fa+1;db[Xa+2]=Fa;db[Xa+3]=Fa+3;db[Xa+4]=Fa+1;db[Xa+5]=Fa+2;db[Xa+6]=Fa+2;db[Xa+7]=Fa+3;Xa=Xa+8;Fa=Fa+4}k.bindBuffer(k.ELEMENT_ARRAY_BUFFER,ga.__webglFaceBuffer);k.bufferData(k.ELEMENT_ARRAY_BUFFER,Lb,cb);k.bindBuffer(k.ELEMENT_ARRAY_BUFFER,ga.__webglLineBuffer);k.bufferData(k.ELEMENT_ARRAY_BUFFER,db,cb)}if(ld){pa=0;for(td=ld.length;pa<td;pa++){w=ld[pa];if(w.__original.needsUpdate){y=
0;if(w.size===1)if(w.boundTo===void 0||w.boundTo==="vertices"){D=0;for(X=na.length;D<X;D++){N=Ha[na[D]];w.array[y]=w.value[N.a];w.array[y+1]=w.value[N.b];w.array[y+2]=w.value[N.c];y=y+3}D=0;for(X=oa.length;D<X;D++){N=Ha[oa[D]];w.array[y]=w.value[N.a];w.array[y+1]=w.value[N.b];w.array[y+2]=w.value[N.c];w.array[y+3]=w.value[N.d];y=y+4}}else{if(w.boundTo==="faces"){D=0;for(X=na.length;D<X;D++){ra=w.value[na[D]];w.array[y]=ra;w.array[y+1]=ra;w.array[y+2]=ra;y=y+3}D=0;for(X=oa.length;D<X;D++){ra=w.value[oa[D]];
w.array[y]=ra;w.array[y+1]=ra;w.array[y+2]=ra;w.array[y+3]=ra;y=y+4}}}else if(w.size===2)if(w.boundTo===void 0||w.boundTo==="vertices"){D=0;for(X=na.length;D<X;D++){N=Ha[na[D]];S=w.value[N.a];T=w.value[N.b];U=w.value[N.c];w.array[y]=S.x;w.array[y+1]=S.y;w.array[y+2]=T.x;w.array[y+3]=T.y;w.array[y+4]=U.x;w.array[y+5]=U.y;y=y+6}D=0;for(X=oa.length;D<X;D++){N=Ha[oa[D]];S=w.value[N.a];T=w.value[N.b];U=w.value[N.c];ka=w.value[N.d];w.array[y]=S.x;w.array[y+1]=S.y;w.array[y+2]=T.x;w.array[y+3]=T.y;w.array[y+
4]=U.x;w.array[y+5]=U.y;w.array[y+6]=ka.x;w.array[y+7]=ka.y;y=y+8}}else{if(w.boundTo==="faces"){D=0;for(X=na.length;D<X;D++){U=T=S=ra=w.value[na[D]];w.array[y]=S.x;w.array[y+1]=S.y;w.array[y+2]=T.x;w.array[y+3]=T.y;w.array[y+4]=U.x;w.array[y+5]=U.y;y=y+6}D=0;for(X=oa.length;D<X;D++){ka=U=T=S=ra=w.value[oa[D]];w.array[y]=S.x;w.array[y+1]=S.y;w.array[y+2]=T.x;w.array[y+3]=T.y;w.array[y+4]=U.x;w.array[y+5]=U.y;w.array[y+6]=ka.x;w.array[y+7]=ka.y;y=y+8}}}else if(w.size===3){var aa;aa=w.type==="c"?["r",
"g","b"]:["x","y","z"];if(w.boundTo===void 0||w.boundTo==="vertices"){D=0;for(X=na.length;D<X;D++){N=Ha[na[D]];S=w.value[N.a];T=w.value[N.b];U=w.value[N.c];w.array[y]=S[aa[0]];w.array[y+1]=S[aa[1]];w.array[y+2]=S[aa[2]];w.array[y+3]=T[aa[0]];w.array[y+4]=T[aa[1]];w.array[y+5]=T[aa[2]];w.array[y+6]=U[aa[0]];w.array[y+7]=U[aa[1]];w.array[y+8]=U[aa[2]];y=y+9}D=0;for(X=oa.length;D<X;D++){N=Ha[oa[D]];S=w.value[N.a];T=w.value[N.b];U=w.value[N.c];ka=w.value[N.d];w.array[y]=S[aa[0]];w.array[y+1]=S[aa[1]];
w.array[y+2]=S[aa[2]];w.array[y+3]=T[aa[0]];w.array[y+4]=T[aa[1]];w.array[y+5]=T[aa[2]];w.array[y+6]=U[aa[0]];w.array[y+7]=U[aa[1]];w.array[y+8]=U[aa[2]];w.array[y+9]=ka[aa[0]];w.array[y+10]=ka[aa[1]];w.array[y+11]=ka[aa[2]];y=y+12}}else if(w.boundTo==="faces"){D=0;for(X=na.length;D<X;D++){U=T=S=ra=w.value[na[D]];w.array[y]=S[aa[0]];w.array[y+1]=S[aa[1]];w.array[y+2]=S[aa[2]];w.array[y+3]=T[aa[0]];w.array[y+4]=T[aa[1]];w.array[y+5]=T[aa[2]];w.array[y+6]=U[aa[0]];w.array[y+7]=U[aa[1]];w.array[y+8]=
U[aa[2]];y=y+9}D=0;for(X=oa.length;D<X;D++){ka=U=T=S=ra=w.value[oa[D]];w.array[y]=S[aa[0]];w.array[y+1]=S[aa[1]];w.array[y+2]=S[aa[2]];w.array[y+3]=T[aa[0]];w.array[y+4]=T[aa[1]];w.array[y+5]=T[aa[2]];w.array[y+6]=U[aa[0]];w.array[y+7]=U[aa[1]];w.array[y+8]=U[aa[2]];w.array[y+9]=ka[aa[0]];w.array[y+10]=ka[aa[1]];w.array[y+11]=ka[aa[2]];y=y+12}}else if(w.boundTo==="faceVertices"){D=0;for(X=na.length;D<X;D++){ra=w.value[na[D]];S=ra[0];T=ra[1];U=ra[2];w.array[y]=S[aa[0]];w.array[y+1]=S[aa[1]];w.array[y+
2]=S[aa[2]];w.array[y+3]=T[aa[0]];w.array[y+4]=T[aa[1]];w.array[y+5]=T[aa[2]];w.array[y+6]=U[aa[0]];w.array[y+7]=U[aa[1]];w.array[y+8]=U[aa[2]];y=y+9}D=0;for(X=oa.length;D<X;D++){ra=w.value[oa[D]];S=ra[0];T=ra[1];U=ra[2];ka=ra[3];w.array[y]=S[aa[0]];w.array[y+1]=S[aa[1]];w.array[y+2]=S[aa[2]];w.array[y+3]=T[aa[0]];w.array[y+4]=T[aa[1]];w.array[y+5]=T[aa[2]];w.array[y+6]=U[aa[0]];w.array[y+7]=U[aa[1]];w.array[y+8]=U[aa[2]];w.array[y+9]=ka[aa[0]];w.array[y+10]=ka[aa[1]];w.array[y+11]=ka[aa[2]];y=y+
12}}}else if(w.size===4)if(w.boundTo===void 0||w.boundTo==="vertices"){D=0;for(X=na.length;D<X;D++){N=Ha[na[D]];S=w.value[N.a];T=w.value[N.b];U=w.value[N.c];w.array[y]=S.x;w.array[y+1]=S.y;w.array[y+2]=S.z;w.array[y+3]=S.w;w.array[y+4]=T.x;w.array[y+5]=T.y;w.array[y+6]=T.z;w.array[y+7]=T.w;w.array[y+8]=U.x;w.array[y+9]=U.y;w.array[y+10]=U.z;w.array[y+11]=U.w;y=y+12}D=0;for(X=oa.length;D<X;D++){N=Ha[oa[D]];S=w.value[N.a];T=w.value[N.b];U=w.value[N.c];ka=w.value[N.d];w.array[y]=S.x;w.array[y+1]=S.y;
w.array[y+2]=S.z;w.array[y+3]=S.w;w.array[y+4]=T.x;w.array[y+5]=T.y;w.array[y+6]=T.z;w.array[y+7]=T.w;w.array[y+8]=U.x;w.array[y+9]=U.y;w.array[y+10]=U.z;w.array[y+11]=U.w;w.array[y+12]=ka.x;w.array[y+13]=ka.y;w.array[y+14]=ka.z;w.array[y+15]=ka.w;y=y+16}}else if(w.boundTo==="faces"){D=0;for(X=na.length;D<X;D++){U=T=S=ra=w.value[na[D]];w.array[y]=S.x;w.array[y+1]=S.y;w.array[y+2]=S.z;w.array[y+3]=S.w;w.array[y+4]=T.x;w.array[y+5]=T.y;w.array[y+6]=T.z;w.array[y+7]=T.w;w.array[y+8]=U.x;w.array[y+9]=
U.y;w.array[y+10]=U.z;w.array[y+11]=U.w;y=y+12}D=0;for(X=oa.length;D<X;D++){ka=U=T=S=ra=w.value[oa[D]];w.array[y]=S.x;w.array[y+1]=S.y;w.array[y+2]=S.z;w.array[y+3]=S.w;w.array[y+4]=T.x;w.array[y+5]=T.y;w.array[y+6]=T.z;w.array[y+7]=T.w;w.array[y+8]=U.x;w.array[y+9]=U.y;w.array[y+10]=U.z;w.array[y+11]=U.w;w.array[y+12]=ka.x;w.array[y+13]=ka.y;w.array[y+14]=ka.z;w.array[y+15]=ka.w;y=y+16}}else if(w.boundTo==="faceVertices"){D=0;for(X=na.length;D<X;D++){ra=w.value[na[D]];S=ra[0];T=ra[1];U=ra[2];w.array[y]=
S.x;w.array[y+1]=S.y;w.array[y+2]=S.z;w.array[y+3]=S.w;w.array[y+4]=T.x;w.array[y+5]=T.y;w.array[y+6]=T.z;w.array[y+7]=T.w;w.array[y+8]=U.x;w.array[y+9]=U.y;w.array[y+10]=U.z;w.array[y+11]=U.w;y=y+12}D=0;for(X=oa.length;D<X;D++){ra=w.value[oa[D]];S=ra[0];T=ra[1];U=ra[2];ka=ra[3];w.array[y]=S.x;w.array[y+1]=S.y;w.array[y+2]=S.z;w.array[y+3]=S.w;w.array[y+4]=T.x;w.array[y+5]=T.y;w.array[y+6]=T.z;w.array[y+7]=T.w;w.array[y+8]=U.x;w.array[y+9]=U.y;w.array[y+10]=U.z;w.array[y+11]=U.w;w.array[y+12]=ka.x;
w.array[y+13]=ka.y;w.array[y+14]=ka.z;w.array[y+15]=ka.w;y=y+16}}k.bindBuffer(k.ARRAY_BUFFER,w.buffer);k.bufferData(k.ARRAY_BUFFER,w.array,cb)}}}if(Ed){delete ga.__inittedArrays;delete ga.__colorArray;delete ga.__normalArray;delete ga.__tangentArray;delete ga.__uvArray;delete ga.__uv2Array;delete ga.__faceArray;delete ga.__vertexArray;delete ga.__lineArray;delete ga.__skinVertexAArray;delete ga.__skinVertexBArray;delete ga.__skinIndexArray;delete ga.__skinWeightArray}}}}ea.verticesNeedUpdate=false;
ea.morphTargetsNeedUpdate=false;ea.elementsNeedUpdate=false;ea.uvsNeedUpdate=false;ea.normalsNeedUpdate=false;ea.colorsNeedUpdate=false;ea.tangentsNeedUpdate=false;$a.attributes&&p($a)}else if(sb instanceof THREE.Ribbon){if(ea.verticesNeedUpdate||ea.colorsNeedUpdate){var hc=ea,wd=k.DYNAMIC_DRAW,Kc=void 0,Lc=void 0,Tc=void 0,ic=void 0,Uc=void 0,xd=hc.vertices,yd=hc.colors,Kd=xd.length,Ld=yd.length,Vc=hc.__vertexArray,Wc=hc.__colorArray,Md=hc.colorsNeedUpdate;if(hc.verticesNeedUpdate){for(Kc=0;Kc<Kd;Kc++){Tc=
xd[Kc];ic=Kc*3;Vc[ic]=Tc.x;Vc[ic+1]=Tc.y;Vc[ic+2]=Tc.z}k.bindBuffer(k.ARRAY_BUFFER,hc.__webglVertexBuffer);k.bufferData(k.ARRAY_BUFFER,Vc,wd)}if(Md){for(Lc=0;Lc<Ld;Lc++){Uc=yd[Lc];ic=Lc*3;Wc[ic]=Uc.r;Wc[ic+1]=Uc.g;Wc[ic+2]=Uc.b}k.bindBuffer(k.ARRAY_BUFFER,hc.__webglColorBuffer);k.bufferData(k.ARRAY_BUFFER,Wc,wd)}}ea.verticesNeedUpdate=false;ea.colorsNeedUpdate=false}else if(sb instanceof THREE.Line){$a=c(sb,jb);fb=$a.attributes&&m($a);if(ea.verticesNeedUpdate||ea.colorsNeedUpdate||fb){var Tb=ea,od=
k.DYNAMIC_DRAW,Mc=void 0,Nc=void 0,Xc=void 0,Ca=void 0,Yc=void 0,zd=Tb.vertices,Ad=Tb.colors,Nd=zd.length,Od=Ad.length,Zc=Tb.__vertexArray,$c=Tb.__colorArray,Pd=Tb.colorsNeedUpdate,pd=Tb.__webglCustomAttributesList,ad=void 0,Bd=void 0,Ra=void 0,Bc=void 0,ab=void 0,wa=void 0;if(Tb.verticesNeedUpdate){for(Mc=0;Mc<Nd;Mc++){Xc=zd[Mc];Ca=Mc*3;Zc[Ca]=Xc.x;Zc[Ca+1]=Xc.y;Zc[Ca+2]=Xc.z}k.bindBuffer(k.ARRAY_BUFFER,Tb.__webglVertexBuffer);k.bufferData(k.ARRAY_BUFFER,Zc,od)}if(Pd){for(Nc=0;Nc<Od;Nc++){Yc=Ad[Nc];
Ca=Nc*3;$c[Ca]=Yc.r;$c[Ca+1]=Yc.g;$c[Ca+2]=Yc.b}k.bindBuffer(k.ARRAY_BUFFER,Tb.__webglColorBuffer);k.bufferData(k.ARRAY_BUFFER,$c,od)}if(pd){ad=0;for(Bd=pd.length;ad<Bd;ad++){wa=pd[ad];if(wa.needsUpdate&&(wa.boundTo===void 0||wa.boundTo==="vertices")){Ca=0;Bc=wa.value.length;if(wa.size===1)for(Ra=0;Ra<Bc;Ra++)wa.array[Ra]=wa.value[Ra];else if(wa.size===2)for(Ra=0;Ra<Bc;Ra++){ab=wa.value[Ra];wa.array[Ca]=ab.x;wa.array[Ca+1]=ab.y;Ca=Ca+2}else if(wa.size===3)if(wa.type==="c")for(Ra=0;Ra<Bc;Ra++){ab=
wa.value[Ra];wa.array[Ca]=ab.r;wa.array[Ca+1]=ab.g;wa.array[Ca+2]=ab.b;Ca=Ca+3}else for(Ra=0;Ra<Bc;Ra++){ab=wa.value[Ra];wa.array[Ca]=ab.x;wa.array[Ca+1]=ab.y;wa.array[Ca+2]=ab.z;Ca=Ca+3}else if(wa.size===4)for(Ra=0;Ra<Bc;Ra++){ab=wa.value[Ra];wa.array[Ca]=ab.x;wa.array[Ca+1]=ab.y;wa.array[Ca+2]=ab.z;wa.array[Ca+3]=ab.w;Ca=Ca+4}k.bindBuffer(k.ARRAY_BUFFER,wa.buffer);k.bufferData(k.ARRAY_BUFFER,wa.array,od)}}}}ea.verticesNeedUpdate=false;ea.colorsNeedUpdate=false;$a.attributes&&p($a)}else if(sb instanceof
THREE.ParticleSystem){$a=c(sb,jb);fb=$a.attributes&&m($a);(ea.verticesNeedUpdate||ea.colorsNeedUpdate||sb.sortParticles||fb)&&e(ea,k.DYNAMIC_DRAW,sb);ea.verticesNeedUpdate=false;ea.colorsNeedUpdate=false;$a.attributes&&p($a)}}};this.initMaterial=function(a,b,c,d){var e,f,g,h,i,j,l,n;a instanceof THREE.MeshDepthMaterial?n="depth":a instanceof THREE.MeshNormalMaterial?n="normal":a instanceof THREE.MeshBasicMaterial?n="basic":a instanceof THREE.MeshLambertMaterial?n="lambert":a instanceof THREE.MeshPhongMaterial?
n="phong":a instanceof THREE.LineBasicMaterial?n="basic":a instanceof THREE.ParticleBasicMaterial&&(n="particle_basic");if(n){var o=THREE.ShaderLib[n];a.uniforms=THREE.UniformsUtils.clone(o.uniforms);a.vertexShader=o.vertexShader;a.fragmentShader=o.fragmentShader}var m,p;m=g=e=o=0;for(f=b.length;m<f;m++){p=b[m];if(!p.onlyShadow){p instanceof THREE.DirectionalLight&&g++;p instanceof THREE.PointLight&&e++;p instanceof THREE.SpotLight&&o++}}if(e+o+g<=M){m=g;f=e}else{m=Math.ceil(M*g/(e+g));o=f=M-m}e=
m;g=o;o=l=0;for(m=b.length;o<m;o++){p=b[o];if(p.castShadow){p instanceof THREE.SpotLight&&l++;p instanceof THREE.DirectionalLight&&!p.shadowCascade&&l++}}if(jc&&d&&d.useVertexTexture)j=1024;else{b=k.getParameter(k.MAX_VERTEX_UNIFORM_VECTORS);b=Math.floor((b-20)/4);if(d!==void 0&&d instanceof THREE.SkinnedMesh){b=Math.min(d.bones.length,b);b<d.bones.length&&console.warn("WebGLRenderer: too many bones - "+d.bones.length+", this GPU supports just "+b+" (try OpenGL instead of ANGLE)")}j=b}var q;a:{p=
a.fragmentShader;m=a.vertexShader;var o=a.uniforms,b=a.attributes,c={map:!!a.map,envMap:!!a.envMap,lightMap:!!a.lightMap,bumpMap:!!a.bumpMap,specularMap:!!a.specularMap,vertexColors:a.vertexColors,fog:c,useFog:a.fog,sizeAttenuation:a.sizeAttenuation,skinning:a.skinning,maxBones:j,useVertexTexture:jc&&d&&d.useVertexTexture,boneTextureWidth:d&&d.boneTextureWidth,boneTextureHeight:d&&d.boneTextureHeight,morphTargets:a.morphTargets,morphNormals:a.morphNormals,maxMorphTargets:this.maxMorphTargets,maxMorphNormals:this.maxMorphNormals,
maxDirLights:e,maxPointLights:f,maxSpotLights:g,maxShadows:l,shadowMapEnabled:this.shadowMapEnabled&&d.receiveShadow,shadowMapSoft:this.shadowMapSoft,shadowMapDebug:this.shadowMapDebug,shadowMapCascade:this.shadowMapCascade,alphaTest:a.alphaTest,metal:a.metal,perPixel:a.perPixel,wrapAround:a.wrapAround,doubleSided:a.side===THREE.DoubleSide},r,d=[];if(n)d.push(n);else{d.push(p);d.push(m)}for(r in c){d.push(r);d.push(c[r])}n=d.join();r=0;for(d=V.length;r<d;r++){e=V[r];if(e.code===n){e.usedTimes++;q=
e.program;break a}}r=k.createProgram();d=["precision "+J+" float;",Cc?"#define VERTEX_TEXTURES":"",H.gammaInput?"#define GAMMA_INPUT":"",H.gammaOutput?"#define GAMMA_OUTPUT":"",H.physicallyBasedShading?"#define PHYSICALLY_BASED_SHADING":"","#define MAX_DIR_LIGHTS "+c.maxDirLights,"#define MAX_POINT_LIGHTS "+c.maxPointLights,"#define MAX_SPOT_LIGHTS "+c.maxSpotLights,"#define MAX_SHADOWS "+c.maxShadows,"#define MAX_BONES "+c.maxBones,c.map?"#define USE_MAP":"",c.envMap?"#define USE_ENVMAP":"",c.lightMap?
"#define USE_LIGHTMAP":"",c.bumpMap?"#define USE_BUMPMAP":"",c.specularMap?"#define USE_SPECULARMAP":"",c.vertexColors?"#define USE_COLOR":"",c.skinning?"#define USE_SKINNING":"",c.useVertexTexture?"#define BONE_TEXTURE":"",c.boneTextureWidth?"#define N_BONE_PIXEL_X "+c.boneTextureWidth.toFixed(1):"",c.boneTextureHeight?"#define N_BONE_PIXEL_Y "+c.boneTextureHeight.toFixed(1):"",c.morphTargets?"#define USE_MORPHTARGETS":"",c.morphNormals?"#define USE_MORPHNORMALS":"",c.perPixel?"#define PHONG_PER_PIXEL":
"",c.wrapAround?"#define WRAP_AROUND":"",c.doubleSided?"#define DOUBLE_SIDED":"",c.shadowMapEnabled?"#define USE_SHADOWMAP":"",c.shadowMapSoft?"#define SHADOWMAP_SOFT":"",c.shadowMapDebug?"#define SHADOWMAP_DEBUG":"",c.shadowMapCascade?"#define SHADOWMAP_CASCADE":"",c.sizeAttenuation?"#define USE_SIZEATTENUATION":"","uniform mat4 modelMatrix;\nuniform mat4 modelViewMatrix;\nuniform mat4 projectionMatrix;\nuniform mat4 viewMatrix;\nuniform mat3 normalMatrix;\nuniform vec3 cameraPosition;\nattribute vec3 position;\nattribute vec3 normal;\nattribute vec2 uv;\nattribute vec2 uv2;\n#ifdef USE_COLOR\nattribute vec3 color;\n#endif\n#ifdef USE_MORPHTARGETS\nattribute vec3 morphTarget0;\nattribute vec3 morphTarget1;\nattribute vec3 morphTarget2;\nattribute vec3 morphTarget3;\n#ifdef USE_MORPHNORMALS\nattribute vec3 morphNormal0;\nattribute vec3 morphNormal1;\nattribute vec3 morphNormal2;\nattribute vec3 morphNormal3;\n#else\nattribute vec3 morphTarget4;\nattribute vec3 morphTarget5;\nattribute vec3 morphTarget6;\nattribute vec3 morphTarget7;\n#endif\n#endif\n#ifdef USE_SKINNING\nattribute vec4 skinVertexA;\nattribute vec4 skinVertexB;\nattribute vec4 skinIndex;\nattribute vec4 skinWeight;\n#endif\n"].join("\n");
e=["precision "+J+" float;",c.bumpMap?"#extension GL_OES_standard_derivatives : enable":"","#define MAX_DIR_LIGHTS "+c.maxDirLights,"#define MAX_POINT_LIGHTS "+c.maxPointLights,"#define MAX_SPOT_LIGHTS "+c.maxSpotLights,"#define MAX_SHADOWS "+c.maxShadows,c.alphaTest?"#define ALPHATEST "+c.alphaTest:"",H.gammaInput?"#define GAMMA_INPUT":"",H.gammaOutput?"#define GAMMA_OUTPUT":"",H.physicallyBasedShading?"#define PHYSICALLY_BASED_SHADING":"",c.useFog&&c.fog?"#define USE_FOG":"",c.useFog&&c.fog instanceof
THREE.FogExp2?"#define FOG_EXP2":"",c.map?"#define USE_MAP":"",c.envMap?"#define USE_ENVMAP":"",c.lightMap?"#define USE_LIGHTMAP":"",c.bumpMap?"#define USE_BUMPMAP":"",c.specularMap?"#define USE_SPECULARMAP":"",c.vertexColors?"#define USE_COLOR":"",c.metal?"#define METAL":"",c.perPixel?"#define PHONG_PER_PIXEL":"",c.wrapAround?"#define WRAP_AROUND":"",c.doubleSided?"#define DOUBLE_SIDED":"",c.shadowMapEnabled?"#define USE_SHADOWMAP":"",c.shadowMapSoft?"#define SHADOWMAP_SOFT":"",c.shadowMapDebug?
"#define SHADOWMAP_DEBUG":"",c.shadowMapCascade?"#define SHADOWMAP_CASCADE":"","uniform mat4 viewMatrix;\nuniform vec3 cameraPosition;\n"].join("\n");e=z("fragment",e+p);d=z("vertex",d+m);k.attachShader(r,d);k.attachShader(r,e);k.linkProgram(r);k.getProgramParameter(r,k.LINK_STATUS)||console.error("Could not initialise shader\nVALIDATE_STATUS: "+k.getProgramParameter(r,k.VALIDATE_STATUS)+", gl error ["+k.getError()+"]");k.deleteShader(e);k.deleteShader(d);r.uniforms={};r.attributes={};var s,d=["viewMatrix",
"modelViewMatrix","projectionMatrix","normalMatrix","modelMatrix","cameraPosition","morphTargetInfluences"];c.useVertexTexture?d.push("boneTexture"):d.push("boneGlobalMatrices");for(s in o)d.push(s);s=d;d=0;for(o=s.length;d<o;d++){e=s[d];r.uniforms[e]=k.getUniformLocation(r,e)}d=["position","normal","uv","uv2","tangent","color","skinVertexA","skinVertexB","skinIndex","skinWeight"];for(s=0;s<c.maxMorphTargets;s++)d.push("morphTarget"+s);for(s=0;s<c.maxMorphNormals;s++)d.push("morphNormal"+s);for(q in b)d.push(q);
q=d;s=0;for(c=q.length;s<c;s++){d=q[s];r.attributes[d]=k.getAttribLocation(r,d)}r.id=Q++;V.push({program:r,code:n,usedTimes:1});H.info.memory.programs=V.length;q=r}a.program=q;q=a.program.attributes;q.position>=0&&k.enableVertexAttribArray(q.position);q.color>=0&&k.enableVertexAttribArray(q.color);q.normal>=0&&k.enableVertexAttribArray(q.normal);q.tangent>=0&&k.enableVertexAttribArray(q.tangent);if(a.skinning&&q.skinVertexA>=0&&q.skinVertexB>=0&&q.skinIndex>=0&&q.skinWeight>=0){k.enableVertexAttribArray(q.skinVertexA);
k.enableVertexAttribArray(q.skinVertexB);k.enableVertexAttribArray(q.skinIndex);k.enableVertexAttribArray(q.skinWeight)}if(a.attributes)for(i in a.attributes)q[i]!==void 0&&q[i]>=0&&k.enableVertexAttribArray(q[i]);if(a.morphTargets){a.numSupportedMorphTargets=0;r="morphTarget";for(i=0;i<this.maxMorphTargets;i++){s=r+i;if(q[s]>=0){k.enableVertexAttribArray(q[s]);a.numSupportedMorphTargets++}}}if(a.morphNormals){a.numSupportedMorphNormals=0;r="morphNormal";for(i=0;i<this.maxMorphNormals;i++){s=r+i;
if(q[s]>=0){k.enableVertexAttribArray(q[s]);a.numSupportedMorphNormals++}}}a.uniformsList=[];for(h in a.uniforms)a.uniformsList.push([a.uniforms[h],h])};this.setFaceCulling=function(a,b){if(a){!b||b==="ccw"?k.frontFace(k.CCW):k.frontFace(k.CW);a==="back"?k.cullFace(k.BACK):a==="front"?k.cullFace(k.FRONT):k.cullFace(k.FRONT_AND_BACK);k.enable(k.CULL_FACE)}else k.disable(k.CULL_FACE)};this.setMaterialFaces=function(a){var b=a.side===THREE.DoubleSide,a=a.side===THREE.BackSide;if(ba!==b){b?k.disable(k.CULL_FACE):
k.enable(k.CULL_FACE);ba=b}if($!==a){a?k.frontFace(k.CW):k.frontFace(k.CCW);$=a}};this.setDepthTest=function(a){if(qa!==a){a?k.enable(k.DEPTH_TEST):k.disable(k.DEPTH_TEST);qa=a}};this.setDepthWrite=function(a){if(Ia!==a){k.depthMask(a);Ia=a}};this.setBlending=function(a,b,c,d){if(a!==ca){if(a===THREE.NoBlending)k.disable(k.BLEND);else if(a===THREE.AdditiveBlending){k.enable(k.BLEND);k.blendEquation(k.FUNC_ADD);k.blendFunc(k.SRC_ALPHA,k.ONE)}else if(a===THREE.SubtractiveBlending){k.enable(k.BLEND);
k.blendEquation(k.FUNC_ADD);k.blendFunc(k.ZERO,k.ONE_MINUS_SRC_COLOR)}else if(a===THREE.MultiplyBlending){k.enable(k.BLEND);k.blendEquation(k.FUNC_ADD);k.blendFunc(k.ZERO,k.SRC_COLOR)}else if(a===THREE.CustomBlending)k.enable(k.BLEND);else{k.enable(k.BLEND);k.blendEquationSeparate(k.FUNC_ADD,k.FUNC_ADD);k.blendFuncSeparate(k.SRC_ALPHA,k.ONE_MINUS_SRC_ALPHA,k.ONE,k.ONE_MINUS_SRC_ALPHA)}ca=a}if(a===THREE.CustomBlending){if(b!==ma){k.blendEquation(C(b));ma=b}if(c!==sa||d!==bb){k.blendFunc(C(c),C(d));
sa=c;bb=d}}else bb=sa=ma=null};this.setTexture=function(a,b){if(a.needsUpdate){if(!a.__webglInit){a.__webglInit=true;a.__webglTexture=k.createTexture();H.info.memory.textures++}k.activeTexture(k.TEXTURE0+b);k.bindTexture(k.TEXTURE_2D,a.__webglTexture);k.pixelStorei(k.UNPACK_FLIP_Y_WEBGL,a.flipY);k.pixelStorei(k.UNPACK_PREMULTIPLY_ALPHA_WEBGL,a.premultiplyAlpha);var c=a.image,d=(c.width&c.width-1)===0&&(c.height&c.height-1)===0,e=C(a.format),f=C(a.type);x(k.TEXTURE_2D,a,d);a instanceof THREE.DataTexture?
k.texImage2D(k.TEXTURE_2D,0,e,c.width,c.height,0,e,f,c.data):k.texImage2D(k.TEXTURE_2D,0,e,e,f,a.image);a.generateMipmaps&&d&&k.generateMipmap(k.TEXTURE_2D);a.needsUpdate=false;if(a.onUpdate)a.onUpdate()}else{k.activeTexture(k.TEXTURE0+b);k.bindTexture(k.TEXTURE_2D,a.__webglTexture)}};this.setRenderTarget=function(a){var b=a instanceof THREE.WebGLRenderTargetCube;if(a&&!a.__webglFramebuffer){if(a.depthBuffer===void 0)a.depthBuffer=true;if(a.stencilBuffer===void 0)a.stencilBuffer=true;a.__webglTexture=
k.createTexture();var c=(a.width&a.width-1)===0&&(a.height&a.height-1)===0,d=C(a.format),e=C(a.type);if(b){a.__webglFramebuffer=[];a.__webglRenderbuffer=[];k.bindTexture(k.TEXTURE_CUBE_MAP,a.__webglTexture);x(k.TEXTURE_CUBE_MAP,a,c);for(var f=0;f<6;f++){a.__webglFramebuffer[f]=k.createFramebuffer();a.__webglRenderbuffer[f]=k.createRenderbuffer();k.texImage2D(k.TEXTURE_CUBE_MAP_POSITIVE_X+f,0,d,a.width,a.height,0,d,e,null);var g=a,h=k.TEXTURE_CUBE_MAP_POSITIVE_X+f;k.bindFramebuffer(k.FRAMEBUFFER,a.__webglFramebuffer[f]);
k.framebufferTexture2D(k.FRAMEBUFFER,k.COLOR_ATTACHMENT0,h,g.__webglTexture,0);A(a.__webglRenderbuffer[f],a)}c&&k.generateMipmap(k.TEXTURE_CUBE_MAP)}else{a.__webglFramebuffer=k.createFramebuffer();a.__webglRenderbuffer=k.createRenderbuffer();k.bindTexture(k.TEXTURE_2D,a.__webglTexture);x(k.TEXTURE_2D,a,c);k.texImage2D(k.TEXTURE_2D,0,d,a.width,a.height,0,d,e,null);d=k.TEXTURE_2D;k.bindFramebuffer(k.FRAMEBUFFER,a.__webglFramebuffer);k.framebufferTexture2D(k.FRAMEBUFFER,k.COLOR_ATTACHMENT0,d,a.__webglTexture,
0);A(a.__webglRenderbuffer,a);c&&k.generateMipmap(k.TEXTURE_2D)}b?k.bindTexture(k.TEXTURE_CUBE_MAP,null):k.bindTexture(k.TEXTURE_2D,null);k.bindRenderbuffer(k.RENDERBUFFER,null);k.bindFramebuffer(k.FRAMEBUFFER,null)}if(a){b=b?a.__webglFramebuffer[a.activeCubeFace]:a.__webglFramebuffer;c=a.width;a=a.height;e=d=0}else{b=null;c=fb;a=gb;d=Ub;e=vb}if(b!==W){k.bindFramebuffer(k.FRAMEBUFFER,b);k.viewport(d,e,c,a);W=b}hb=c;Ka=a};this.shadowMapPlugin=new THREE.ShadowMapPlugin;this.addPrePlugin(this.shadowMapPlugin);
this.addPostPlugin(new THREE.SpritePlugin);this.addPostPlugin(new THREE.LensFlarePlugin)};
THREE.WebGLRenderTarget=function(a,b,c){this.width=a;this.height=b;c=c||{};this.wrapS=c.wrapS!==void 0?c.wrapS:THREE.ClampToEdgeWrapping;this.wrapT=c.wrapT!==void 0?c.wrapT:THREE.ClampToEdgeWrapping;this.magFilter=c.magFilter!==void 0?c.magFilter:THREE.LinearFilter;this.minFilter=c.minFilter!==void 0?c.minFilter:THREE.LinearMipMapLinearFilter;this.anisotropy=c.anisotropy!==void 0?c.anisotropy:1;this.offset=new THREE.Vector2(0,0);this.repeat=new THREE.Vector2(1,1);this.format=c.format!==void 0?c.format:
THREE.RGBAFormat;this.type=c.type!==void 0?c.type:THREE.UnsignedByteType;this.depthBuffer=c.depthBuffer!==void 0?c.depthBuffer:true;this.stencilBuffer=c.stencilBuffer!==void 0?c.stencilBuffer:true;this.generateMipmaps=true};
THREE.WebGLRenderTarget.prototype.clone=function(){var a=new THREE.WebGLRenderTarget(this.width,this.height);a.wrapS=this.wrapS;a.wrapT=this.wrapT;a.magFilter=this.magFilter;a.anisotropy=this.anisotropy;a.minFilter=this.minFilter;a.offset.copy(this.offset);a.repeat.copy(this.repeat);a.format=this.format;a.type=this.type;a.depthBuffer=this.depthBuffer;a.stencilBuffer=this.stencilBuffer;a.generateMipmaps=this.generateMipmaps;return a};
THREE.WebGLRenderTargetCube=function(a,b,c){THREE.WebGLRenderTarget.call(this,a,b,c);this.activeCubeFace=0};THREE.WebGLRenderTargetCube.prototype=Object.create(THREE.WebGLRenderTarget.prototype);THREE.RenderableVertex=function(){this.positionWorld=new THREE.Vector3;this.positionScreen=new THREE.Vector4;this.visible=true};THREE.RenderableVertex.prototype.copy=function(a){this.positionWorld.copy(a.positionWorld);this.positionScreen.copy(a.positionScreen)};
THREE.RenderableFace3=function(){this.v1=new THREE.RenderableVertex;this.v2=new THREE.RenderableVertex;this.v3=new THREE.RenderableVertex;this.centroidWorld=new THREE.Vector3;this.centroidScreen=new THREE.Vector3;this.normalWorld=new THREE.Vector3;this.vertexNormalsWorld=[new THREE.Vector3,new THREE.Vector3,new THREE.Vector3];this.material=null;this.uvs=[[]];this.z=null};
THREE.RenderableFace4=function(){this.v1=new THREE.RenderableVertex;this.v2=new THREE.RenderableVertex;this.v3=new THREE.RenderableVertex;this.v4=new THREE.RenderableVertex;this.centroidWorld=new THREE.Vector3;this.centroidScreen=new THREE.Vector3;this.normalWorld=new THREE.Vector3;this.vertexNormalsWorld=[new THREE.Vector3,new THREE.Vector3,new THREE.Vector3,new THREE.Vector3];this.material=null;this.uvs=[[]];this.z=null};THREE.RenderableObject=function(){this.z=this.object=null};
THREE.RenderableParticle=function(){this.rotation=this.z=this.y=this.x=this.object=null;this.scale=new THREE.Vector2;this.material=null};THREE.RenderableLine=function(){this.z=null;this.v1=new THREE.RenderableVertex;this.v2=new THREE.RenderableVertex;this.material=null};
THREE.ColorUtils={adjustHSV:function(a,b,c,d){var f=THREE.ColorUtils.__hsv;THREE.ColorUtils.rgbToHsv(a,f);f.h=THREE.Math.clamp(f.h+b,0,1);f.s=THREE.Math.clamp(f.s+c,0,1);f.v=THREE.Math.clamp(f.v+d,0,1);a.setHSV(f.h,f.s,f.v)},rgbToHsv:function(a,b){var c=a.r,d=a.g,f=a.b,e=Math.max(Math.max(c,d),f),g=Math.min(Math.min(c,d),f);if(g===e)g=c=0;else{var h=e-g,g=h/e,c=(c===e?(d-f)/h:d===e?2+(f-c)/h:4+(c-d)/h)/6;c<0&&(c=c+1);c>1&&(c=c-1)}b===void 0&&(b={h:0,s:0,v:0});b.h=c;b.s=g;b.v=e;return b}};
THREE.ColorUtils.__hsv={h:0,s:0,v:0};
THREE.GeometryUtils={merge:function(a,b){for(var c,d,f=a.vertices.length,e=b instanceof THREE.Mesh?b.geometry:b,g=a.vertices,h=e.vertices,i=a.faces,j=e.faces,l=a.faceVertexUvs[0],o=e.faceVertexUvs[0],m={},p=0;p<a.materials.length;p++)m[a.materials[p].id]=p;if(b instanceof THREE.Mesh){b.matrixAutoUpdate&&b.updateMatrix();c=b.matrix;d=new THREE.Matrix4;d.extractRotation(c,b.scale)}for(var p=0,q=h.length;p<q;p++){var n=h[p].clone();c&&c.multiplyVector3(n);g.push(n)}p=0;for(q=j.length;p<q;p++){var g=
j[p],r,s,t=g.vertexNormals,u=g.vertexColors;g instanceof THREE.Face3?r=new THREE.Face3(g.a+f,g.b+f,g.c+f):g instanceof THREE.Face4&&(r=new THREE.Face4(g.a+f,g.b+f,g.c+f,g.d+f));r.normal.copy(g.normal);d&&d.multiplyVector3(r.normal);h=0;for(n=t.length;h<n;h++){s=t[h].clone();d&&d.multiplyVector3(s);r.vertexNormals.push(s)}r.color.copy(g.color);h=0;for(n=u.length;h<n;h++){s=u[h];r.vertexColors.push(s.clone())}if(g.materialIndex!==void 0){h=e.materials[g.materialIndex];n=h.id;u=m[n];if(u===void 0){u=
a.materials.length;m[n]=u;a.materials.push(h)}r.materialIndex=u}r.centroid.copy(g.centroid);c&&c.multiplyVector3(r.centroid);i.push(r)}p=0;for(q=o.length;p<q;p++){c=o[p];d=[];h=0;for(n=c.length;h<n;h++)d.push(new THREE.UV(c[h].u,c[h].v));l.push(d)}},clone:function(a){var b=new THREE.Geometry,c,d=a.vertices,f=a.faces,e=a.faceVertexUvs[0];if(a.materials)b.materials=a.materials.slice();a=0;for(c=d.length;a<c;a++)b.vertices.push(d[a].clone());a=0;for(c=f.length;a<c;a++)b.faces.push(f[a].clone());a=0;
for(c=e.length;a<c;a++){for(var d=e[a],f=[],g=0,h=d.length;g<h;g++)f.push(new THREE.UV(d[g].u,d[g].v));b.faceVertexUvs[0].push(f)}return b},randomPointInTriangle:function(a,b,c){var d,f,e,g=new THREE.Vector3,h=THREE.GeometryUtils.__v1;d=THREE.GeometryUtils.random();f=THREE.GeometryUtils.random();if(d+f>1){d=1-d;f=1-f}e=1-d-f;g.copy(a);g.multiplyScalar(d);h.copy(b);h.multiplyScalar(f);g.addSelf(h);h.copy(c);h.multiplyScalar(e);g.addSelf(h);return g},randomPointInFace:function(a,b,c){var d,f,e;if(a instanceof
THREE.Face3){d=b.vertices[a.a];f=b.vertices[a.b];e=b.vertices[a.c];return THREE.GeometryUtils.randomPointInTriangle(d,f,e)}if(a instanceof THREE.Face4){d=b.vertices[a.a];f=b.vertices[a.b];e=b.vertices[a.c];var b=b.vertices[a.d],g;if(c)if(a._area1&&a._area2){c=a._area1;g=a._area2}else{c=THREE.GeometryUtils.triangleArea(d,f,b);g=THREE.GeometryUtils.triangleArea(f,e,b);a._area1=c;a._area2=g}else{c=THREE.GeometryUtils.triangleArea(d,f,b);g=THREE.GeometryUtils.triangleArea(f,e,b)}return THREE.GeometryUtils.random()*
(c+g)<c?THREE.GeometryUtils.randomPointInTriangle(d,f,b):THREE.GeometryUtils.randomPointInTriangle(f,e,b)}},randomPointsInGeometry:function(a,b){function c(a){function b(c,d){if(d<c)return c;var e=c+Math.floor((d-c)/2);return j[e]>a?b(c,e-1):j[e]<a?b(e+1,d):e}return b(0,j.length-1)}var d,f,e=a.faces,g=a.vertices,h=e.length,i=0,j=[],l,o,m,p;for(f=0;f<h;f++){d=e[f];if(d instanceof THREE.Face3){l=g[d.a];o=g[d.b];m=g[d.c];d._area=THREE.GeometryUtils.triangleArea(l,o,m)}else if(d instanceof THREE.Face4){l=
g[d.a];o=g[d.b];m=g[d.c];p=g[d.d];d._area1=THREE.GeometryUtils.triangleArea(l,o,p);d._area2=THREE.GeometryUtils.triangleArea(o,m,p);d._area=d._area1+d._area2}i=i+d._area;j[f]=i}d=[];for(f=0;f<b;f++){g=THREE.GeometryUtils.random()*i;g=c(g);d[f]=THREE.GeometryUtils.randomPointInFace(e[g],a,true)}return d},triangleArea:function(a,b,c){var d,f=THREE.GeometryUtils.__v1;f.sub(a,b);d=f.length();f.sub(a,c);a=f.length();f.sub(b,c);c=f.length();b=0.5*(d+a+c);return Math.sqrt(b*(b-d)*(b-a)*(b-c))},center:function(a){a.computeBoundingBox();
var b=a.boundingBox,c=new THREE.Vector3;c.add(b.min,b.max);c.multiplyScalar(-0.5);a.applyMatrix((new THREE.Matrix4).makeTranslation(c.x,c.y,c.z));a.computeBoundingBox();return c},normalizeUVs:function(a){for(var a=a.faceVertexUvs[0],b=0,c=a.length;b<c;b++)for(var d=a[b],f=0,e=d.length;f<e;f++){if(d[f].u!==1)d[f].u=d[f].u-Math.floor(d[f].u);if(d[f].v!==1)d[f].v=d[f].v-Math.floor(d[f].v)}},triangulateQuads:function(a){var b,c,d,f,e=[],g=[],h=[];b=0;for(c=a.faceUvs.length;b<c;b++)g[b]=[];b=0;for(c=a.faceVertexUvs.length;b<
c;b++)h[b]=[];b=0;for(c=a.faces.length;b<c;b++){d=a.faces[b];if(d instanceof THREE.Face4){f=d.a;var i=d.b,j=d.c,l=d.d,o=new THREE.Face3,m=new THREE.Face3;o.color.copy(d.color);m.color.copy(d.color);o.materialIndex=d.materialIndex;m.materialIndex=d.materialIndex;o.a=f;o.b=i;o.c=l;m.a=i;m.b=j;m.c=l;if(d.vertexColors.length===4){o.vertexColors[0]=d.vertexColors[0].clone();o.vertexColors[1]=d.vertexColors[1].clone();o.vertexColors[2]=d.vertexColors[3].clone();m.vertexColors[0]=d.vertexColors[1].clone();
m.vertexColors[1]=d.vertexColors[2].clone();m.vertexColors[2]=d.vertexColors[3].clone()}e.push(o,m);d=0;for(f=a.faceVertexUvs.length;d<f;d++)if(a.faceVertexUvs[d].length){o=a.faceVertexUvs[d][b];i=o[1];j=o[2];l=o[3];o=[o[0].clone(),i.clone(),l.clone()];i=[i.clone(),j.clone(),l.clone()];h[d].push(o,i)}d=0;for(f=a.faceUvs.length;d<f;d++)if(a.faceUvs[d].length){i=a.faceUvs[d][b];g[d].push(i,i)}}else{e.push(d);d=0;for(f=a.faceUvs.length;d<f;d++)g[d].push(a.faceUvs[d]);d=0;for(f=a.faceVertexUvs.length;d<
f;d++)h[d].push(a.faceVertexUvs[d])}}a.faces=e;a.faceUvs=g;a.faceVertexUvs=h;a.computeCentroids();a.computeFaceNormals();a.computeVertexNormals();a.hasTangents&&a.computeTangents()},explode:function(a){for(var b=[],c=0,d=a.faces.length;c<d;c++){var f=b.length,e=a.faces[c];if(e instanceof THREE.Face4){var g=e.a,h=e.b,i=e.c,g=a.vertices[g],h=a.vertices[h],i=a.vertices[i],j=a.vertices[e.d];b.push(g.clone());b.push(h.clone());b.push(i.clone());b.push(j.clone());e.a=f;e.b=f+1;e.c=f+2;e.d=f+3}else{g=e.a;
h=e.b;i=e.c;g=a.vertices[g];h=a.vertices[h];i=a.vertices[i];b.push(g.clone());b.push(h.clone());b.push(i.clone());e.a=f;e.b=f+1;e.c=f+2}}a.vertices=b;delete a.__tmpVertices},tessellate:function(a,b){var c,d,f,e,g,h,i,j,l,o,m,p,q,n,r,s,t,u,z,x=[],A=[];c=0;for(d=a.faceVertexUvs.length;c<d;c++)A[c]=[];c=0;for(d=a.faces.length;c<d;c++){f=a.faces[c];if(f instanceof THREE.Face3){e=f.a;g=f.b;h=f.c;j=a.vertices[e];l=a.vertices[g];o=a.vertices[h];p=j.distanceTo(l);q=l.distanceTo(o);m=j.distanceTo(o);if(p>
b||q>b||m>b){i=a.vertices.length;u=f.clone();z=f.clone();if(p>=q&&p>=m){j=j.clone();j.lerpSelf(l,0.5);u.a=e;u.b=i;u.c=h;z.a=i;z.b=g;z.c=h;if(f.vertexNormals.length===3){e=f.vertexNormals[0].clone();e.lerpSelf(f.vertexNormals[1],0.5);u.vertexNormals[1].copy(e);z.vertexNormals[0].copy(e)}if(f.vertexColors.length===3){e=f.vertexColors[0].clone();e.lerpSelf(f.vertexColors[1],0.5);u.vertexColors[1].copy(e);z.vertexColors[0].copy(e)}f=0}else if(q>=p&&q>=m){j=l.clone();j.lerpSelf(o,0.5);u.a=e;u.b=g;u.c=
i;z.a=i;z.b=h;z.c=e;if(f.vertexNormals.length===3){e=f.vertexNormals[1].clone();e.lerpSelf(f.vertexNormals[2],0.5);u.vertexNormals[2].copy(e);z.vertexNormals[0].copy(e);z.vertexNormals[1].copy(f.vertexNormals[2]);z.vertexNormals[2].copy(f.vertexNormals[0])}if(f.vertexColors.length===3){e=f.vertexColors[1].clone();e.lerpSelf(f.vertexColors[2],0.5);u.vertexColors[2].copy(e);z.vertexColors[0].copy(e);z.vertexColors[1].copy(f.vertexColors[2]);z.vertexColors[2].copy(f.vertexColors[0])}f=1}else{j=j.clone();
j.lerpSelf(o,0.5);u.a=e;u.b=g;u.c=i;z.a=i;z.b=g;z.c=h;if(f.vertexNormals.length===3){e=f.vertexNormals[0].clone();e.lerpSelf(f.vertexNormals[2],0.5);u.vertexNormals[2].copy(e);z.vertexNormals[0].copy(e)}if(f.vertexColors.length===3){e=f.vertexColors[0].clone();e.lerpSelf(f.vertexColors[2],0.5);u.vertexColors[2].copy(e);z.vertexColors[0].copy(e)}f=2}x.push(u,z);a.vertices.push(j);e=0;for(g=a.faceVertexUvs.length;e<g;e++)if(a.faceVertexUvs[e].length){j=a.faceVertexUvs[e][c];z=j[0];h=j[1];u=j[2];if(f===
0){l=z.clone();l.lerpSelf(h,0.5);j=[z.clone(),l.clone(),u.clone()];h=[l.clone(),h.clone(),u.clone()]}else if(f===1){l=h.clone();l.lerpSelf(u,0.5);j=[z.clone(),h.clone(),l.clone()];h=[l.clone(),u.clone(),z.clone()]}else{l=z.clone();l.lerpSelf(u,0.5);j=[z.clone(),h.clone(),l.clone()];h=[l.clone(),h.clone(),u.clone()]}A[e].push(j,h)}}else{x.push(f);e=0;for(g=a.faceVertexUvs.length;e<g;e++)A[e].push(a.faceVertexUvs[e][c])}}else{e=f.a;g=f.b;h=f.c;i=f.d;j=a.vertices[e];l=a.vertices[g];o=a.vertices[h];m=
a.vertices[i];p=j.distanceTo(l);q=l.distanceTo(o);n=o.distanceTo(m);r=j.distanceTo(m);if(p>b||q>b||n>b||r>b){s=a.vertices.length;t=a.vertices.length+1;u=f.clone();z=f.clone();if(p>=q&&p>=n&&p>=r||n>=q&&n>=p&&n>=r){p=j.clone();p.lerpSelf(l,0.5);l=o.clone();l.lerpSelf(m,0.5);u.a=e;u.b=s;u.c=t;u.d=i;z.a=s;z.b=g;z.c=h;z.d=t;if(f.vertexNormals.length===4){e=f.vertexNormals[0].clone();e.lerpSelf(f.vertexNormals[1],0.5);g=f.vertexNormals[2].clone();g.lerpSelf(f.vertexNormals[3],0.5);u.vertexNormals[1].copy(e);
u.vertexNormals[2].copy(g);z.vertexNormals[0].copy(e);z.vertexNormals[3].copy(g)}if(f.vertexColors.length===4){e=f.vertexColors[0].clone();e.lerpSelf(f.vertexColors[1],0.5);g=f.vertexColors[2].clone();g.lerpSelf(f.vertexColors[3],0.5);u.vertexColors[1].copy(e);u.vertexColors[2].copy(g);z.vertexColors[0].copy(e);z.vertexColors[3].copy(g)}f=0}else{p=l.clone();p.lerpSelf(o,0.5);l=m.clone();l.lerpSelf(j,0.5);u.a=e;u.b=g;u.c=s;u.d=t;z.a=t;z.b=s;z.c=h;z.d=i;if(f.vertexNormals.length===4){e=f.vertexNormals[1].clone();
e.lerpSelf(f.vertexNormals[2],0.5);g=f.vertexNormals[3].clone();g.lerpSelf(f.vertexNormals[0],0.5);u.vertexNormals[2].copy(e);u.vertexNormals[3].copy(g);z.vertexNormals[0].copy(g);z.vertexNormals[1].copy(e)}if(f.vertexColors.length===4){e=f.vertexColors[1].clone();e.lerpSelf(f.vertexColors[2],0.5);g=f.vertexColors[3].clone();g.lerpSelf(f.vertexColors[0],0.5);u.vertexColors[2].copy(e);u.vertexColors[3].copy(g);z.vertexColors[0].copy(g);z.vertexColors[1].copy(e)}f=1}x.push(u,z);a.vertices.push(p,l);
e=0;for(g=a.faceVertexUvs.length;e<g;e++)if(a.faceVertexUvs[e].length){j=a.faceVertexUvs[e][c];z=j[0];h=j[1];u=j[2];j=j[3];if(f===0){l=z.clone();l.lerpSelf(h,0.5);o=u.clone();o.lerpSelf(j,0.5);z=[z.clone(),l.clone(),o.clone(),j.clone()];h=[l.clone(),h.clone(),u.clone(),o.clone()]}else{l=h.clone();l.lerpSelf(u,0.5);o=j.clone();o.lerpSelf(z,0.5);z=[z.clone(),h.clone(),l.clone(),o.clone()];h=[o.clone(),l.clone(),u.clone(),j.clone()]}A[e].push(z,h)}}else{x.push(f);e=0;for(g=a.faceVertexUvs.length;e<g;e++)A[e].push(a.faceVertexUvs[e][c])}}}a.faces=
x;a.faceVertexUvs=A}};THREE.GeometryUtils.random=THREE.Math.random16;THREE.GeometryUtils.__v1=new THREE.Vector3;
THREE.ImageUtils={crossOrigin:"anonymous",loadTexture:function(a,b,c,d){var f=new Image,e=new THREE.Texture(f,b),b=new THREE.ImageLoader;b.addEventListener("load",function(a){e.image=a.content;e.needsUpdate=true;c&&c(e)});b.addEventListener("error",function(a){d&&d(a.message)});b.crossOrigin=this.crossOrigin;b.load(a,f);return e},loadTextureCube:function(a,b,c){var d,f=[],e=new THREE.Texture(f,b);e.flipY=false;b=f.loadCount=0;for(d=a.length;b<d;++b){f[b]=new Image;f[b].onload=function(){f.loadCount=
f.loadCount+1;if(f.loadCount===6){e.needsUpdate=true;c&&c()}};f[b].crossOrigin=this.crossOrigin;f[b].src=a[b]}return e},getNormalMap:function(a,b){var c=function(a){var b=Math.sqrt(a[0]*a[0]+a[1]*a[1]+a[2]*a[2]);return[a[0]/b,a[1]/b,a[2]/b]},b=b|1,d=a.width,f=a.height,e=document.createElement("canvas");e.width=d;e.height=f;var g=e.getContext("2d");g.drawImage(a,0,0);for(var h=g.getImageData(0,0,d,f).data,i=g.createImageData(d,f),j=i.data,l=0;l<d;l++)for(var o=0;o<f;o++){var m=o-1<0?0:o-1,p=o+1>f-
1?f-1:o+1,q=l-1<0?0:l-1,n=l+1>d-1?d-1:l+1,r=[],s=[0,0,h[(o*d+l)*4]/255*b];r.push([-1,0,h[(o*d+q)*4]/255*b]);r.push([-1,-1,h[(m*d+q)*4]/255*b]);r.push([0,-1,h[(m*d+l)*4]/255*b]);r.push([1,-1,h[(m*d+n)*4]/255*b]);r.push([1,0,h[(o*d+n)*4]/255*b]);r.push([1,1,h[(p*d+n)*4]/255*b]);r.push([0,1,h[(p*d+l)*4]/255*b]);r.push([-1,1,h[(p*d+q)*4]/255*b]);m=[];q=r.length;for(p=0;p<q;p++){var n=r[p],t=r[(p+1)%q],n=[n[0]-s[0],n[1]-s[1],n[2]-s[2]],t=[t[0]-s[0],t[1]-s[1],t[2]-s[2]];m.push(c([n[1]*t[2]-n[2]*t[1],n[2]*
t[0]-n[0]*t[2],n[0]*t[1]-n[1]*t[0]]))}r=[0,0,0];for(p=0;p<m.length;p++){r[0]=r[0]+m[p][0];r[1]=r[1]+m[p][1];r[2]=r[2]+m[p][2]}r[0]=r[0]/m.length;r[1]=r[1]/m.length;r[2]=r[2]/m.length;s=(o*d+l)*4;j[s]=(r[0]+1)/2*255|0;j[s+1]=(r[1]+1)/2*255|0;j[s+2]=r[2]*255|0;j[s+3]=255}g.putImageData(i,0,0);return e},generateDataTexture:function(a,b,c){for(var d=a*b,f=new Uint8Array(3*d),e=Math.floor(c.r*255),g=Math.floor(c.g*255),c=Math.floor(c.b*255),h=0;h<d;h++){f[h*3]=e;f[h*3+1]=g;f[h*3+2]=c}a=new THREE.DataTexture(f,
a,b,THREE.RGBFormat);a.needsUpdate=true;return a}};
THREE.SceneUtils={showHierarchy:function(a,b){THREE.SceneUtils.traverseHierarchy(a,function(a){a.visible=b})},traverseHierarchy:function(a,b){var c,d,f=a.children.length;for(d=0;d<f;d++){c=a.children[d];b(c);THREE.SceneUtils.traverseHierarchy(c,b)}},createMultiMaterialObject:function(a,b){var c,d=b.length,f=new THREE.Object3D;for(c=0;c<d;c++){var e=new THREE.Mesh(a,b[c]);f.add(e)}return f},cloneObject:function(a){var b;if(a instanceof THREE.MorphAnimMesh){b=new THREE.MorphAnimMesh(a.geometry,a.material);
b.duration=a.duration;b.mirroredLoop=a.mirroredLoop;b.time=a.time;b.lastKeyframe=a.lastKeyframe;b.currentKeyframe=a.currentKeyframe;b.direction=a.direction;b.directionBackwards=a.directionBackwards}else if(a instanceof THREE.SkinnedMesh)b=new THREE.SkinnedMesh(a.geometry,a.material);else if(a instanceof THREE.Mesh)b=new THREE.Mesh(a.geometry,a.material);else if(a instanceof THREE.Line)b=new THREE.Line(a.geometry,a.material,a.type);else if(a instanceof THREE.Ribbon)b=new THREE.Ribbon(a.geometry,a.material);
else if(a instanceof THREE.ParticleSystem){b=new THREE.ParticleSystem(a.geometry,a.material);b.sortParticles=a.sortParticles}else if(a instanceof THREE.Particle)b=new THREE.Particle(a.material);else if(a instanceof THREE.Sprite){b=new THREE.Sprite({});b.color.copy(a.color);b.map=a.map;b.blending=a.blending;b.useScreenCoordinates=a.useScreenCoordinates;b.mergeWith3D=a.mergeWith3D;b.affectedByDistance=a.affectedByDistance;b.scaleByViewport=a.scaleByViewport;b.alignment=a.alignment;b.rotation3d.copy(a.rotation3d);
b.rotation=a.rotation;b.opacity=a.opacity;b.uvOffset.copy(a.uvOffset);b.uvScale.copy(a.uvScale)}else a instanceof THREE.LOD?b=new THREE.LOD:a instanceof THREE.Object3D&&(b=new THREE.Object3D);b.name=a.name;b.parent=a.parent;b.up.copy(a.up);b.position.copy(a.position);b.rotation instanceof THREE.Vector3&&b.rotation.copy(a.rotation);b.eulerOrder=a.eulerOrder;b.scale.copy(a.scale);b.dynamic=a.dynamic;b.renderDepth=a.renderDepth;b.rotationAutoUpdate=a.rotationAutoUpdate;b.matrix.copy(a.matrix);b.matrixWorld.copy(a.matrixWorld);
b.matrixRotationWorld.copy(a.matrixRotationWorld);b.matrixAutoUpdate=a.matrixAutoUpdate;b.matrixWorldNeedsUpdate=a.matrixWorldNeedsUpdate;b.quaternion.copy(a.quaternion);b.useQuaternion=a.useQuaternion;b.boundRadius=a.boundRadius;b.boundRadiusScale=a.boundRadiusScale;b.visible=a.visible;b.castShadow=a.castShadow;b.receiveShadow=a.receiveShadow;b.frustumCulled=a.frustumCulled;for(var c=0;c<a.children.length;c++){var d=THREE.SceneUtils.cloneObject(a.children[c]);b.children[c]=d;d.parent=b}if(a instanceof
THREE.LOD)for(c=0;c<a.LODs.length;c++)b.LODs[c]={visibleAtDistance:a.LODs[c].visibleAtDistance,object3D:b.children[c]};return b},detach:function(a,b,c){a.applyMatrix(b.matrixWorld);b.remove(a);c.add(a)},attach:function(a,b,c){var d=new THREE.Matrix4;d.getInverse(c.matrixWorld);a.applyMatrix(d);b.remove(a);c.add(a)}};
THREE.WebGLRenderer&&(THREE.ShaderUtils={lib:{fresnel:{uniforms:{mRefractionRatio:{type:"f",value:1.02},mFresnelBias:{type:"f",value:0.1},mFresnelPower:{type:"f",value:2},mFresnelScale:{type:"f",value:1},tCube:{type:"t",value:1,texture:null}},fragmentShader:"uniform samplerCube tCube;\nvarying vec3 vReflect;\nvarying vec3 vRefract[3];\nvarying float vReflectionFactor;\nvoid main() {\nvec4 reflectedColor = textureCube( tCube, vec3( -vReflect.x, vReflect.yz ) );\nvec4 refractedColor = vec4( 1.0, 1.0, 1.0, 1.0 );\nrefractedColor.r = textureCube( tCube, vec3( -vRefract[0].x, vRefract[0].yz ) ).r;\nrefractedColor.g = textureCube( tCube, vec3( -vRefract[1].x, vRefract[1].yz ) ).g;\nrefractedColor.b = textureCube( tCube, vec3( -vRefract[2].x, vRefract[2].yz ) ).b;\nrefractedColor.a = 1.0;\ngl_FragColor = mix( refractedColor, reflectedColor, clamp( vReflectionFactor, 0.0, 1.0 ) );\n}",
vertexShader:"uniform float mRefractionRatio;\nuniform float mFresnelBias;\nuniform float mFresnelScale;\nuniform float mFresnelPower;\nvarying vec3 vReflect;\nvarying vec3 vRefract[3];\nvarying float vReflectionFactor;\nvoid main() {\nvec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\nvec4 mPosition = modelMatrix * vec4( position, 1.0 );\nvec3 nWorld = normalize( mat3( modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz ) * normal );\nvec3 I = mPosition.xyz - cameraPosition;\nvReflect = reflect( I, nWorld );\nvRefract[0] = refract( normalize( I ), nWorld, mRefractionRatio );\nvRefract[1] = refract( normalize( I ), nWorld, mRefractionRatio * 0.99 );\nvRefract[2] = refract( normalize( I ), nWorld, mRefractionRatio * 0.98 );\nvReflectionFactor = mFresnelBias + mFresnelScale * pow( 1.0 + dot( normalize( I ), nWorld ), mFresnelPower );\ngl_Position = projectionMatrix * mvPosition;\n}"},
normal:{uniforms:THREE.UniformsUtils.merge([THREE.UniformsLib.fog,THREE.UniformsLib.lights,THREE.UniformsLib.shadowmap,{enableAO:{type:"i",value:0},enableDiffuse:{type:"i",value:0},enableSpecular:{type:"i",value:0},enableReflection:{type:"i",value:0},enableDisplacement:{type:"i",value:0},tDiffuse:{type:"t",value:0,texture:null},tCube:{type:"t",value:1,texture:null},tNormal:{type:"t",value:2,texture:null},tSpecular:{type:"t",value:3,texture:null},tAO:{type:"t",value:4,texture:null},tDisplacement:{type:"t",
value:5,texture:null},uNormalScale:{type:"f",value:1},uDisplacementBias:{type:"f",value:0},uDisplacementScale:{type:"f",value:1},uDiffuseColor:{type:"c",value:new THREE.Color(16777215)},uSpecularColor:{type:"c",value:new THREE.Color(1118481)},uAmbientColor:{type:"c",value:new THREE.Color(16777215)},uShininess:{type:"f",value:30},uOpacity:{type:"f",value:1},useRefract:{type:"i",value:0},uRefractionRatio:{type:"f",value:0.98},uReflectivity:{type:"f",value:0.5},uOffset:{type:"v2",value:new THREE.Vector2(0,
0)},uRepeat:{type:"v2",value:new THREE.Vector2(1,1)},wrapRGB:{type:"v3",value:new THREE.Vector3(1,1,1)}}]),fragmentShader:["uniform vec3 uAmbientColor;\nuniform vec3 uDiffuseColor;\nuniform vec3 uSpecularColor;\nuniform float uShininess;\nuniform float uOpacity;\nuniform bool enableDiffuse;\nuniform bool enableSpecular;\nuniform bool enableAO;\nuniform bool enableReflection;\nuniform sampler2D tDiffuse;\nuniform sampler2D tNormal;\nuniform sampler2D tSpecular;\nuniform sampler2D tAO;\nuniform samplerCube tCube;\nuniform float uNormalScale;\nuniform bool useRefract;\nuniform float uRefractionRatio;\nuniform float uReflectivity;\nvarying vec3 vTangent;\nvarying vec3 vBinormal;\nvarying vec3 vNormal;\nvarying vec2 vUv;\nuniform vec3 ambientLightColor;\n#if MAX_DIR_LIGHTS > 0\nuniform vec3 directionalLightColor[ MAX_DIR_LIGHTS ];\nuniform vec3 directionalLightDirection[ MAX_DIR_LIGHTS ];\n#endif\n#if MAX_POINT_LIGHTS > 0\nuniform vec3 pointLightColor[ MAX_POINT_LIGHTS ];\nuniform vec3 pointLightPosition[ MAX_POINT_LIGHTS ];\nuniform float pointLightDistance[ MAX_POINT_LIGHTS ];\n#endif\n#if MAX_SPOT_LIGHTS > 0\nuniform vec3 spotLightColor[ MAX_SPOT_LIGHTS ];\nuniform vec3 spotLightPosition[ MAX_SPOT_LIGHTS ];\nuniform vec3 spotLightDirection[ MAX_SPOT_LIGHTS ];\nuniform float spotLightAngle[ MAX_SPOT_LIGHTS ];\nuniform float spotLightExponent[ MAX_SPOT_LIGHTS ];\nuniform float spotLightDistance[ MAX_SPOT_LIGHTS ];\n#endif\n#ifdef WRAP_AROUND\nuniform vec3 wrapRGB;\n#endif\nvarying vec3 vWorldPosition;",
THREE.ShaderChunk.shadowmap_pars_fragment,THREE.ShaderChunk.fog_pars_fragment,"void main() {\nvec3 vViewPosition = cameraPosition - vWorldPosition;\ngl_FragColor = vec4( vec3( 1.0 ), uOpacity );\nvec3 specularTex = vec3( 1.0 );\nvec3 normalTex = texture2D( tNormal, vUv ).xyz * 2.0 - 1.0;\nnormalTex.xy *= uNormalScale;\nnormalTex = normalize( normalTex );\nif( enableDiffuse ) {\n#ifdef GAMMA_INPUT\nvec4 texelColor = texture2D( tDiffuse, vUv );\ntexelColor.xyz *= texelColor.xyz;\ngl_FragColor = gl_FragColor * texelColor;\n#else\ngl_FragColor = gl_FragColor * texture2D( tDiffuse, vUv );\n#endif\n}\nif( enableAO ) {\n#ifdef GAMMA_INPUT\nvec4 aoColor = texture2D( tAO, vUv );\naoColor.xyz *= aoColor.xyz;\ngl_FragColor.xyz = gl_FragColor.xyz * aoColor.xyz;\n#else\ngl_FragColor.xyz = gl_FragColor.xyz * texture2D( tAO, vUv ).xyz;\n#endif\n}\nif( enableSpecular )\nspecularTex = texture2D( tSpecular, vUv ).xyz;\nmat3 tsb = mat3( normalize( vTangent ), normalize( vBinormal ), normalize( vNormal ) );\nvec3 finalNormal = tsb * normalTex;\nvec3 normal = normalize( finalNormal );\nvec3 viewPosition = normalize( vViewPosition );\n#if MAX_POINT_LIGHTS > 0\nvec3 pointDiffuse = vec3( 0.0 );\nvec3 pointSpecular = vec3( 0.0 );\nfor ( int i = 0; i < MAX_POINT_LIGHTS; i ++ ) {\nvec4 lPosition = viewMatrix * vec4( pointLightPosition[ i ], 1.0 );\nvec3 pointVector = lPosition.xyz + vViewPosition.xyz;\nfloat pointDistance = 1.0;\nif ( pointLightDistance[ i ] > 0.0 )\npointDistance = 1.0 - min( ( length( pointVector ) / pointLightDistance[ i ] ), 1.0 );\npointVector = normalize( pointVector );\n#ifdef WRAP_AROUND\nfloat pointDiffuseWeightFull = max( dot( normal, pointVector ), 0.0 );\nfloat pointDiffuseWeightHalf = max( 0.5 * dot( normal, pointVector ) + 0.5, 0.0 );\nvec3 pointDiffuseWeight = mix( vec3 ( pointDiffuseWeightFull ), vec3( pointDiffuseWeightHalf ), wrapRGB );\n#else\nfloat pointDiffuseWeight = max( dot( normal, pointVector ), 0.0 );\n#endif\npointDiffuse += pointDistance * pointLightColor[ i ] * uDiffuseColor * pointDiffuseWeight;\nvec3 pointHalfVector = normalize( pointVector + viewPosition );\nfloat pointDotNormalHalf = max( dot( normal, pointHalfVector ), 0.0 );\nfloat pointSpecularWeight = specularTex.r * max( pow( pointDotNormalHalf, uShininess ), 0.0 );\n#ifdef PHYSICALLY_BASED_SHADING\nfloat specularNormalization = ( uShininess + 2.0001 ) / 8.0;\nvec3 schlick = uSpecularColor + vec3( 1.0 - uSpecularColor ) * pow( 1.0 - dot( pointVector, pointHalfVector ), 5.0 );\npointSpecular += schlick * pointLightColor[ i ] * pointSpecularWeight * pointDiffuseWeight * pointDistance * specularNormalization;\n#else\npointSpecular += pointDistance * pointLightColor[ i ] * uSpecularColor * pointSpecularWeight * pointDiffuseWeight;\n#endif\n}\n#endif\n#if MAX_SPOT_LIGHTS > 0\nvec3 spotDiffuse = vec3( 0.0 );\nvec3 spotSpecular = vec3( 0.0 );\nfor ( int i = 0; i < MAX_SPOT_LIGHTS; i ++ ) {\nvec4 lPosition = viewMatrix * vec4( spotLightPosition[ i ], 1.0 );\nvec3 spotVector = lPosition.xyz + vViewPosition.xyz;\nfloat spotDistance = 1.0;\nif ( spotLightDistance[ i ] > 0.0 )\nspotDistance = 1.0 - min( ( length( spotVector ) / spotLightDistance[ i ] ), 1.0 );\nspotVector = normalize( spotVector );\nfloat spotEffect = dot( spotLightDirection[ i ], normalize( spotLightPosition[ i ] - vWorldPosition ) );\nif ( spotEffect > spotLightAngle[ i ] ) {\nspotEffect = pow( spotEffect, spotLightExponent[ i ] );\n#ifdef WRAP_AROUND\nfloat spotDiffuseWeightFull = max( dot( normal, spotVector ), 0.0 );\nfloat spotDiffuseWeightHalf = max( 0.5 * dot( normal, spotVector ) + 0.5, 0.0 );\nvec3 spotDiffuseWeight = mix( vec3 ( spotDiffuseWeightFull ), vec3( spotDiffuseWeightHalf ), wrapRGB );\n#else\nfloat spotDiffuseWeight = max( dot( normal, spotVector ), 0.0 );\n#endif\nspotDiffuse += spotDistance * spotLightColor[ i ] * uDiffuseColor * spotDiffuseWeight * spotEffect;\nvec3 spotHalfVector = normalize( spotVector + viewPosition );\nfloat spotDotNormalHalf = max( dot( normal, spotHalfVector ), 0.0 );\nfloat spotSpecularWeight = specularTex.r * max( pow( spotDotNormalHalf, uShininess ), 0.0 );\n#ifdef PHYSICALLY_BASED_SHADING\nfloat specularNormalization = ( uShininess + 2.0001 ) / 8.0;\nvec3 schlick = uSpecularColor + vec3( 1.0 - uSpecularColor ) * pow( 1.0 - dot( spotVector, spotHalfVector ), 5.0 );\nspotSpecular += schlick * spotLightColor[ i ] * spotSpecularWeight * spotDiffuseWeight * spotDistance * specularNormalization * spotEffect;\n#else\nspotSpecular += spotDistance * spotLightColor[ i ] * uSpecularColor * spotSpecularWeight * spotDiffuseWeight * spotEffect;\n#endif\n}\n}\n#endif\n#if MAX_DIR_LIGHTS > 0\nvec3 dirDiffuse = vec3( 0.0 );\nvec3 dirSpecular = vec3( 0.0 );\nfor( int i = 0; i < MAX_DIR_LIGHTS; i++ ) {\nvec4 lDirection = viewMatrix * vec4( directionalLightDirection[ i ], 0.0 );\nvec3 dirVector = normalize( lDirection.xyz );\n#ifdef WRAP_AROUND\nfloat directionalLightWeightingFull = max( dot( normal, dirVector ), 0.0 );\nfloat directionalLightWeightingHalf = max( 0.5 * dot( normal, dirVector ) + 0.5, 0.0 );\nvec3 dirDiffuseWeight = mix( vec3( directionalLightWeightingFull ), vec3( directionalLightWeightingHalf ), wrapRGB );\n#else\nfloat dirDiffuseWeight = max( dot( normal, dirVector ), 0.0 );\n#endif\ndirDiffuse += directionalLightColor[ i ] * uDiffuseColor * dirDiffuseWeight;\nvec3 dirHalfVector = normalize( dirVector + viewPosition );\nfloat dirDotNormalHalf = max( dot( normal, dirHalfVector ), 0.0 );\nfloat dirSpecularWeight = specularTex.r * max( pow( dirDotNormalHalf, uShininess ), 0.0 );\n#ifdef PHYSICALLY_BASED_SHADING\nfloat specularNormalization = ( uShininess + 2.0001 ) / 8.0;\nvec3 schlick = uSpecularColor + vec3( 1.0 - uSpecularColor ) * pow( 1.0 - dot( dirVector, dirHalfVector ), 5.0 );\ndirSpecular += schlick * directionalLightColor[ i ] * dirSpecularWeight * dirDiffuseWeight * specularNormalization;\n#else\ndirSpecular += directionalLightColor[ i ] * uSpecularColor * dirSpecularWeight * dirDiffuseWeight;\n#endif\n}\n#endif\nvec3 totalDiffuse = vec3( 0.0 );\nvec3 totalSpecular = vec3( 0.0 );\n#if MAX_DIR_LIGHTS > 0\ntotalDiffuse += dirDiffuse;\ntotalSpecular += dirSpecular;\n#endif\n#if MAX_POINT_LIGHTS > 0\ntotalDiffuse += pointDiffuse;\ntotalSpecular += pointSpecular;\n#endif\n#if MAX_SPOT_LIGHTS > 0\ntotalDiffuse += spotDiffuse;\ntotalSpecular += spotSpecular;\n#endif\n#ifdef METAL\ngl_FragColor.xyz = gl_FragColor.xyz * ( totalDiffuse + ambientLightColor * uAmbientColor + totalSpecular );\n#else\ngl_FragColor.xyz = gl_FragColor.xyz * ( totalDiffuse + ambientLightColor * uAmbientColor ) + totalSpecular;\n#endif\nif ( enableReflection ) {\nvec3 vReflect;\nvec3 cameraToVertex = normalize( vWorldPosition - cameraPosition );\nif ( useRefract ) {\nvReflect = refract( cameraToVertex, normal, uRefractionRatio );\n} else {\nvReflect = reflect( cameraToVertex, normal );\n}\nvec4 cubeColor = textureCube( tCube, vec3( -vReflect.x, vReflect.yz ) );\n#ifdef GAMMA_INPUT\ncubeColor.xyz *= cubeColor.xyz;\n#endif\ngl_FragColor.xyz = mix( gl_FragColor.xyz, cubeColor.xyz, specularTex.r * uReflectivity );\n}",
THREE.ShaderChunk.shadowmap_fragment,THREE.ShaderChunk.linear_to_gamma_fragment,THREE.ShaderChunk.fog_fragment,"}"].join("\n"),vertexShader:["attribute vec4 tangent;\nuniform vec2 uOffset;\nuniform vec2 uRepeat;\nuniform bool enableDisplacement;\n#ifdef VERTEX_TEXTURES\nuniform sampler2D tDisplacement;\nuniform float uDisplacementScale;\nuniform float uDisplacementBias;\n#endif\nvarying vec3 vTangent;\nvarying vec3 vBinormal;\nvarying vec3 vNormal;\nvarying vec2 vUv;\nvarying vec3 vWorldPosition;",
THREE.ShaderChunk.skinning_pars_vertex,THREE.ShaderChunk.shadowmap_pars_vertex,"void main() {",THREE.ShaderChunk.skinbase_vertex,THREE.ShaderChunk.skinnormal_vertex,"#ifdef USE_SKINNING\nvNormal = normalMatrix * skinnedNormal.xyz;\nvec4 skinnedTangent = skinMatrix * vec4( tangent.xyz, 0.0 );\nvTangent = normalMatrix * skinnedTangent.xyz;\n#else\nvNormal = normalMatrix * normal;\nvTangent = normalMatrix * tangent.xyz;\n#endif\nvBinormal = cross( vNormal, vTangent ) * tangent.w;\nvUv = uv * uRepeat + uOffset;\nvec3 displacedPosition;\n#ifdef VERTEX_TEXTURES\nif ( enableDisplacement ) {\nvec3 dv = texture2D( tDisplacement, uv ).xyz;\nfloat df = uDisplacementScale * dv.x + uDisplacementBias;\ndisplacedPosition = position + normalize( normal ) * df;\n} else {\n#ifdef USE_SKINNING\nvec4 skinned  = boneMatX * skinVertexA * skinWeight.x;\nskinned \t  += boneMatY * skinVertexB * skinWeight.y;\ndisplacedPosition  = skinned.xyz;\n#else\ndisplacedPosition = position;\n#endif\n}\n#else\n#ifdef USE_SKINNING\nvec4 skinned  = boneMatX * skinVertexA * skinWeight.x;\nskinned \t  += boneMatY * skinVertexB * skinWeight.y;\ndisplacedPosition  = skinned.xyz;\n#else\ndisplacedPosition = position;\n#endif\n#endif\nvec4 mvPosition = modelViewMatrix * vec4( displacedPosition, 1.0 );\nvec4 wPosition = modelMatrix * vec4( displacedPosition, 1.0 );\ngl_Position = projectionMatrix * mvPosition;\nvWorldPosition = wPosition.xyz;\n#ifdef USE_SHADOWMAP\nfor( int i = 0; i < MAX_SHADOWS; i ++ ) {\nvShadowCoord[ i ] = shadowMatrix[ i ] * wPosition;\n}\n#endif\n}"].join("\n")},
cube:{uniforms:{tCube:{type:"t",value:1,texture:null},tFlip:{type:"f",value:-1}},vertexShader:"varying vec3 vViewPosition;\nvoid main() {\nvec4 mPosition = modelMatrix * vec4( position, 1.0 );\nvViewPosition = cameraPosition - mPosition.xyz;\ngl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}",fragmentShader:"uniform samplerCube tCube;\nuniform float tFlip;\nvarying vec3 vViewPosition;\nvoid main() {\nvec3 wPos = cameraPosition - vViewPosition;\ngl_FragColor = textureCube( tCube, vec3( tFlip * wPos.x, wPos.yz ) );\n}"}}});
THREE.FontUtils={faces:{},face:"helvetiker",weight:"normal",style:"normal",size:150,divisions:10,getFace:function(){return this.faces[this.face][this.weight][this.style]},loadFace:function(a){var b=a.familyName.toLowerCase();this.faces[b]=this.faces[b]||{};this.faces[b][a.cssFontWeight]=this.faces[b][a.cssFontWeight]||{};this.faces[b][a.cssFontWeight][a.cssFontStyle]=a;return this.faces[b][a.cssFontWeight][a.cssFontStyle]=a},drawText:function(a){for(var b=this.getFace(),c=this.size/b.resolution,d=
0,f=String(a).split(""),e=f.length,g=[],a=0;a<e;a++){var h=new THREE.Path,h=this.extractGlyphPoints(f[a],b,c,d,h),d=d+h.offset;g.push(h.path)}return{paths:g,offset:d/2}},extractGlyphPoints:function(a,b,c,d,f){var e=[],g,h,i,j,l,o,m,p,q,n,r,s=b.glyphs[a]||b.glyphs["?"];if(s){if(s.o){b=s._cachedOutline||(s._cachedOutline=s.o.split(" "));j=b.length;for(a=0;a<j;){i=b[a++];switch(i){case "m":i=b[a++]*c+d;l=b[a++]*c;f.moveTo(i,l);break;case "l":i=b[a++]*c+d;l=b[a++]*c;f.lineTo(i,l);break;case "q":i=b[a++]*
c+d;l=b[a++]*c;p=b[a++]*c+d;q=b[a++]*c;f.quadraticCurveTo(p,q,i,l);if(g=e[e.length-1]){o=g.x;m=g.y;g=1;for(h=this.divisions;g<=h;g++){var t=g/h;THREE.Shape.Utils.b2(t,o,p,i);THREE.Shape.Utils.b2(t,m,q,l)}}break;case "b":i=b[a++]*c+d;l=b[a++]*c;p=b[a++]*c+d;q=b[a++]*-c;n=b[a++]*c+d;r=b[a++]*-c;f.bezierCurveTo(i,l,p,q,n,r);if(g=e[e.length-1]){o=g.x;m=g.y;g=1;for(h=this.divisions;g<=h;g++){t=g/h;THREE.Shape.Utils.b3(t,o,p,n,i);THREE.Shape.Utils.b3(t,m,q,r,l)}}}}}return{offset:s.ha*c,path:f}}}};
THREE.FontUtils.generateShapes=function(a,b){var b=b||{},c=b.curveSegments!==void 0?b.curveSegments:4,d=b.font!==void 0?b.font:"helvetiker",f=b.weight!==void 0?b.weight:"normal",e=b.style!==void 0?b.style:"normal";THREE.FontUtils.size=b.size!==void 0?b.size:100;THREE.FontUtils.divisions=c;THREE.FontUtils.face=d;THREE.FontUtils.weight=f;THREE.FontUtils.style=e;c=THREE.FontUtils.drawText(a).paths;d=[];f=0;for(e=c.length;f<e;f++)Array.prototype.push.apply(d,c[f].toShapes());return d};
(function(a){var b=function(a){for(var b=a.length,f=0,e=b-1,g=0;g<b;e=g++)f=f+(a[e].x*a[g].y-a[g].x*a[e].y);return f*0.5};a.Triangulate=function(a,d){var f=a.length;if(f<3)return null;var e=[],g=[],h=[],i,j,l;if(b(a)>0)for(j=0;j<f;j++)g[j]=j;else for(j=0;j<f;j++)g[j]=f-1-j;var o=2*f;for(j=f-1;f>2;){if(o--<=0){console.log("Warning, unable to triangulate polygon!");break}i=j;f<=i&&(i=0);j=i+1;f<=j&&(j=0);l=j+1;f<=l&&(l=0);var m;a:{m=a;var p=i,q=j,n=l,r=f,s=g,t=void 0,u=void 0,z=void 0,x=void 0,A=void 0,
B=void 0,C=void 0,v=void 0,J=void 0,u=m[s[p]].x,z=m[s[p]].y,x=m[s[q]].x,A=m[s[q]].y,B=m[s[n]].x,C=m[s[n]].y;if(1E-10>(x-u)*(C-z)-(A-z)*(B-u))m=false;else{for(t=0;t<r;t++)if(!(t==p||t==q||t==n)){var v=m[s[t]].x,J=m[s[t]].y,F=void 0,O=void 0,P=void 0,G=void 0,E=void 0,I=void 0,R=void 0,M=void 0,H=void 0,V=void 0,Q=void 0,L=void 0,F=P=E=void 0,F=B-x,O=C-A,P=u-B,G=z-C,E=x-u,I=A-z,R=v-u,M=J-z,H=v-x,V=J-A,Q=v-B,L=J-C,F=F*V-O*H,E=E*M-I*R,P=P*L-G*Q;if(F>=0&&P>=0&&E>=0){m=false;break a}}m=true}}if(m){e.push([a[g[i]],
a[g[j]],a[g[l]]]);h.push([g[i],g[j],g[l]]);i=j;for(l=j+1;l<f;i++,l++)g[i]=g[l];f--;o=2*f}}return d?h:e};a.Triangulate.area=b;return a})(THREE.FontUtils);self._typeface_js={faces:THREE.FontUtils.faces,loadFace:THREE.FontUtils.loadFace};THREE.Curve=function(){};THREE.Curve.prototype.getPoint=function(){console.log("Warning, getPoint() not implemented!");return null};THREE.Curve.prototype.getPointAt=function(a){a=this.getUtoTmapping(a);return this.getPoint(a)};
THREE.Curve.prototype.getPoints=function(a){a||(a=5);var b,c=[];for(b=0;b<=a;b++)c.push(this.getPoint(b/a));return c};THREE.Curve.prototype.getSpacedPoints=function(a){a||(a=5);var b,c=[];for(b=0;b<=a;b++)c.push(this.getPointAt(b/a));return c};THREE.Curve.prototype.getLength=function(){var a=this.getLengths();return a[a.length-1]};
THREE.Curve.prototype.getLengths=function(a){a||(a=this.__arcLengthDivisions?this.__arcLengthDivisions:200);if(this.cacheArcLengths&&this.cacheArcLengths.length==a+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=false;var b=[],c,d=this.getPoint(0),f,e=0;b.push(0);for(f=1;f<=a;f++){c=this.getPoint(f/a);e=e+c.distanceTo(d);b.push(e);d=c}return this.cacheArcLengths=b};THREE.Curve.prototype.updateArcLengths=function(){this.needsUpdate=true;this.getLengths()};
THREE.Curve.prototype.getUtoTmapping=function(a,b){var c=this.getLengths(),d=0,f=c.length,e;e=b?b:a*c[f-1];for(var g=0,h=f-1,i;g<=h;){d=Math.floor(g+(h-g)/2);i=c[d]-e;if(i<0)g=d+1;else if(i>0)h=d-1;else{h=d;break}}d=h;if(c[d]==e)return d/(f-1);g=c[d];return c=(d+(e-g)/(c[d+1]-g))/(f-1)};THREE.Curve.prototype.getNormalVector=function(a){a=this.getTangent(a);return new THREE.Vector2(-a.y,a.x)};
THREE.Curve.prototype.getTangent=function(a){var b=a-1E-4,a=a+1E-4;b<0&&(b=0);a>1&&(a=1);b=this.getPoint(b);return this.getPoint(a).clone().subSelf(b).normalize()};THREE.Curve.prototype.getTangentAt=function(a){a=this.getUtoTmapping(a);return this.getTangent(a)};THREE.LineCurve=function(a,b){this.v1=a;this.v2=b};THREE.LineCurve.prototype=Object.create(THREE.Curve.prototype);THREE.LineCurve.prototype.getPoint=function(a){var b=this.v2.clone().subSelf(this.v1);b.multiplyScalar(a).addSelf(this.v1);return b};
THREE.LineCurve.prototype.getPointAt=function(a){return this.getPoint(a)};THREE.LineCurve.prototype.getTangent=function(){return this.v2.clone().subSelf(this.v1).normalize()};THREE.QuadraticBezierCurve=function(a,b,c){this.v0=a;this.v1=b;this.v2=c};THREE.QuadraticBezierCurve.prototype=Object.create(THREE.Curve.prototype);
THREE.QuadraticBezierCurve.prototype.getPoint=function(a){var b;b=THREE.Shape.Utils.b2(a,this.v0.x,this.v1.x,this.v2.x);a=THREE.Shape.Utils.b2(a,this.v0.y,this.v1.y,this.v2.y);return new THREE.Vector2(b,a)};THREE.QuadraticBezierCurve.prototype.getTangent=function(a){var b;b=THREE.Curve.Utils.tangentQuadraticBezier(a,this.v0.x,this.v1.x,this.v2.x);a=THREE.Curve.Utils.tangentQuadraticBezier(a,this.v0.y,this.v1.y,this.v2.y);b=new THREE.Vector2(b,a);b.normalize();return b};
THREE.CubicBezierCurve=function(a,b,c,d){this.v0=a;this.v1=b;this.v2=c;this.v3=d};THREE.CubicBezierCurve.prototype=Object.create(THREE.Curve.prototype);THREE.CubicBezierCurve.prototype.getPoint=function(a){var b;b=THREE.Shape.Utils.b3(a,this.v0.x,this.v1.x,this.v2.x,this.v3.x);a=THREE.Shape.Utils.b3(a,this.v0.y,this.v1.y,this.v2.y,this.v3.y);return new THREE.Vector2(b,a)};
THREE.CubicBezierCurve.prototype.getTangent=function(a){var b;b=THREE.Curve.Utils.tangentCubicBezier(a,this.v0.x,this.v1.x,this.v2.x,this.v3.x);a=THREE.Curve.Utils.tangentCubicBezier(a,this.v0.y,this.v1.y,this.v2.y,this.v3.y);b=new THREE.Vector2(b,a);b.normalize();return b};THREE.SplineCurve=function(a){this.points=a==void 0?[]:a};THREE.SplineCurve.prototype=Object.create(THREE.Curve.prototype);
THREE.SplineCurve.prototype.getPoint=function(a){var b=new THREE.Vector2,c=[],d=this.points,f;f=(d.length-1)*a;a=Math.floor(f);f=f-a;c[0]=a==0?a:a-1;c[1]=a;c[2]=a>d.length-2?d.length-1:a+1;c[3]=a>d.length-3?d.length-1:a+2;b.x=THREE.Curve.Utils.interpolate(d[c[0]].x,d[c[1]].x,d[c[2]].x,d[c[3]].x,f);b.y=THREE.Curve.Utils.interpolate(d[c[0]].y,d[c[1]].y,d[c[2]].y,d[c[3]].y,f);return b};
THREE.EllipseCurve=function(a,b,c,d,f,e,g){this.aX=a;this.aY=b;this.xRadius=c;this.yRadius=d;this.aStartAngle=f;this.aEndAngle=e;this.aClockwise=g};THREE.EllipseCurve.prototype=Object.create(THREE.Curve.prototype);THREE.EllipseCurve.prototype.getPoint=function(a){var b=this.aEndAngle-this.aStartAngle;this.aClockwise||(a=1-a);b=this.aStartAngle+a*b;a=this.aX+this.xRadius*Math.cos(b);b=this.aY+this.yRadius*Math.sin(b);return new THREE.Vector2(a,b)};
THREE.ArcCurve=function(a,b,c,d,f,e){THREE.EllipseCurve.call(this,a,b,c,c,d,f,e)};THREE.ArcCurve.prototype=Object.create(THREE.EllipseCurve.prototype);
THREE.Curve.Utils={tangentQuadraticBezier:function(a,b,c,d){return 2*(1-a)*(c-b)+2*a*(d-c)},tangentCubicBezier:function(a,b,c,d,f){return-3*b*(1-a)*(1-a)+3*c*(1-a)*(1-a)-6*a*c*(1-a)+6*a*d*(1-a)-3*a*a*d+3*a*a*f},tangentSpline:function(a){return 6*a*a-6*a+(3*a*a-4*a+1)+(-6*a*a+6*a)+(3*a*a-2*a)},interpolate:function(a,b,c,d,f){var a=(c-a)*0.5,d=(d-b)*0.5,e=f*f;return(2*b-2*c+a+d)*f*e+(-3*b+3*c-2*a-d)*e+a*f+b}};
THREE.Curve.create=function(a,b){a.prototype=Object.create(THREE.Curve.prototype);a.prototype.getPoint=b;return a};THREE.LineCurve3=THREE.Curve.create(function(a,b){this.v1=a;this.v2=b},function(a){var b=new THREE.Vector3;b.sub(this.v2,this.v1);b.multiplyScalar(a);b.addSelf(this.v1);return b});
THREE.QuadraticBezierCurve3=THREE.Curve.create(function(a,b,c){this.v0=a;this.v1=b;this.v2=c},function(a){var b,c;b=THREE.Shape.Utils.b2(a,this.v0.x,this.v1.x,this.v2.x);c=THREE.Shape.Utils.b2(a,this.v0.y,this.v1.y,this.v2.y);a=THREE.Shape.Utils.b2(a,this.v0.z,this.v1.z,this.v2.z);return new THREE.Vector3(b,c,a)});
THREE.CubicBezierCurve3=THREE.Curve.create(function(a,b,c,d){this.v0=a;this.v1=b;this.v2=c;this.v3=d},function(a){var b,c;b=THREE.Shape.Utils.b3(a,this.v0.x,this.v1.x,this.v2.x,this.v3.x);c=THREE.Shape.Utils.b3(a,this.v0.y,this.v1.y,this.v2.y,this.v3.y);a=THREE.Shape.Utils.b3(a,this.v0.z,this.v1.z,this.v2.z,this.v3.z);return new THREE.Vector3(b,c,a)});
THREE.SplineCurve3=THREE.Curve.create(function(a){this.points=a==void 0?[]:a},function(a){var b=new THREE.Vector3,c=[],d=this.points,f,a=(d.length-1)*a;f=Math.floor(a);a=a-f;c[0]=f==0?f:f-1;c[1]=f;c[2]=f>d.length-2?d.length-1:f+1;c[3]=f>d.length-3?d.length-1:f+2;f=d[c[0]];var e=d[c[1]],g=d[c[2]],c=d[c[3]];b.x=THREE.Curve.Utils.interpolate(f.x,e.x,g.x,c.x,a);b.y=THREE.Curve.Utils.interpolate(f.y,e.y,g.y,c.y,a);b.z=THREE.Curve.Utils.interpolate(f.z,e.z,g.z,c.z,a);return b});
THREE.ClosedSplineCurve3=THREE.Curve.create(function(a){this.points=a==void 0?[]:a},function(a){var b=new THREE.Vector3,c=[],d=this.points,f;f=(d.length-0)*a;a=Math.floor(f);f=f-a;a=a+(a>0?0:(Math.floor(Math.abs(a)/d.length)+1)*d.length);c[0]=(a-1)%d.length;c[1]=a%d.length;c[2]=(a+1)%d.length;c[3]=(a+2)%d.length;b.x=THREE.Curve.Utils.interpolate(d[c[0]].x,d[c[1]].x,d[c[2]].x,d[c[3]].x,f);b.y=THREE.Curve.Utils.interpolate(d[c[0]].y,d[c[1]].y,d[c[2]].y,d[c[3]].y,f);b.z=THREE.Curve.Utils.interpolate(d[c[0]].z,
d[c[1]].z,d[c[2]].z,d[c[3]].z,f);return b});THREE.CurvePath=function(){this.curves=[];this.bends=[];this.autoClose=false};THREE.CurvePath.prototype=Object.create(THREE.Curve.prototype);THREE.CurvePath.prototype.add=function(a){this.curves.push(a)};THREE.CurvePath.prototype.checkConnection=function(){};THREE.CurvePath.prototype.closePath=function(){var a=this.curves[0].getPoint(0),b=this.curves[this.curves.length-1].getPoint(1);a.equals(b)||this.curves.push(new THREE.LineCurve(b,a))};
THREE.CurvePath.prototype.getPoint=function(a){for(var b=a*this.getLength(),c=this.getCurveLengths(),a=0;a<c.length;){if(c[a]>=b){b=c[a]-b;a=this.curves[a];b=1-b/a.getLength();return a.getPointAt(b)}a++}return null};THREE.CurvePath.prototype.getLength=function(){var a=this.getCurveLengths();return a[a.length-1]};
THREE.CurvePath.prototype.getCurveLengths=function(){if(this.cacheLengths&&this.cacheLengths.length==this.curves.length)return this.cacheLengths;var a=[],b=0,c,d=this.curves.length;for(c=0;c<d;c++){b=b+this.curves[c].getLength();a.push(b)}return this.cacheLengths=a};
THREE.CurvePath.prototype.getBoundingBox=function(){var a=this.getPoints(),b,c,d,f,e,g;b=c=Number.NEGATIVE_INFINITY;f=e=Number.POSITIVE_INFINITY;var h,i,j,l,o=a[0]instanceof THREE.Vector3;l=o?new THREE.Vector3:new THREE.Vector2;i=0;for(j=a.length;i<j;i++){h=a[i];if(h.x>b)b=h.x;else if(h.x<f)f=h.x;if(h.y>c)c=h.y;else if(h.y<e)e=h.y;if(o)if(h.z>d)d=h.z;else if(h.z<g)g=h.z;l.addSelf(h)}a={minX:f,minY:e,maxX:b,maxY:c,centroid:l.divideScalar(j)};if(o){a.maxZ=d;a.minZ=g}return a};
THREE.CurvePath.prototype.createPointsGeometry=function(a){a=this.getPoints(a,true);return this.createGeometry(a)};THREE.CurvePath.prototype.createSpacedPointsGeometry=function(a){a=this.getSpacedPoints(a,true);return this.createGeometry(a)};THREE.CurvePath.prototype.createGeometry=function(a){for(var b=new THREE.Geometry,c=0;c<a.length;c++)b.vertices.push(new THREE.Vector3(a[c].x,a[c].y,a[c].z||0));return b};THREE.CurvePath.prototype.addWrapPath=function(a){this.bends.push(a)};
THREE.CurvePath.prototype.getTransformedPoints=function(a,b){var c=this.getPoints(a),d,f;if(!b)b=this.bends;d=0;for(f=b.length;d<f;d++)c=this.getWrapPoints(c,b[d]);return c};THREE.CurvePath.prototype.getTransformedSpacedPoints=function(a,b){var c=this.getSpacedPoints(a),d,f;if(!b)b=this.bends;d=0;for(f=b.length;d<f;d++)c=this.getWrapPoints(c,b[d]);return c};
THREE.CurvePath.prototype.getWrapPoints=function(a,b){var c=this.getBoundingBox(),d,f,e,g,h,i;d=0;for(f=a.length;d<f;d++){e=a[d];g=e.x;h=e.y;i=g/c.maxX;i=b.getUtoTmapping(i,g);g=b.getPoint(i);h=b.getNormalVector(i).multiplyScalar(h);e.x=g.x+h.x;e.y=g.y+h.y}return a};THREE.Gyroscope=function(){THREE.Object3D.call(this)};THREE.Gyroscope.prototype=Object.create(THREE.Object3D.prototype);
THREE.Gyroscope.prototype.updateMatrixWorld=function(a){this.matrixAutoUpdate&&this.updateMatrix();if(this.matrixWorldNeedsUpdate||a){if(this.parent){this.matrixWorld.multiply(this.parent.matrixWorld,this.matrix);this.matrixWorld.decompose(this.translationWorld,this.rotationWorld,this.scaleWorld);this.matrix.decompose(this.translationObject,this.rotationObject,this.scaleObject);this.matrixWorld.compose(this.translationWorld,this.rotationObject,this.scaleWorld)}else this.matrixWorld.copy(this.matrix);
this.matrixWorldNeedsUpdate=false;a=true}for(var b=0,c=this.children.length;b<c;b++)this.children[b].updateMatrixWorld(a)};THREE.Gyroscope.prototype.translationWorld=new THREE.Vector3;THREE.Gyroscope.prototype.translationObject=new THREE.Vector3;THREE.Gyroscope.prototype.rotationWorld=new THREE.Quaternion;THREE.Gyroscope.prototype.rotationObject=new THREE.Quaternion;THREE.Gyroscope.prototype.scaleWorld=new THREE.Vector3;THREE.Gyroscope.prototype.scaleObject=new THREE.Vector3;
THREE.Path=function(a){THREE.CurvePath.call(this);this.actions=[];a&&this.fromPoints(a)};THREE.Path.prototype=Object.create(THREE.CurvePath.prototype);THREE.PathActions={MOVE_TO:"moveTo",LINE_TO:"lineTo",QUADRATIC_CURVE_TO:"quadraticCurveTo",BEZIER_CURVE_TO:"bezierCurveTo",CSPLINE_THRU:"splineThru",ARC:"arc",ELLIPSE:"ellipse"};THREE.Path.prototype.fromPoints=function(a){this.moveTo(a[0].x,a[0].y);for(var b=1,c=a.length;b<c;b++)this.lineTo(a[b].x,a[b].y)};
THREE.Path.prototype.moveTo=function(a,b){var c=Array.prototype.slice.call(arguments);this.actions.push({action:THREE.PathActions.MOVE_TO,args:c})};THREE.Path.prototype.lineTo=function(a,b){var c=Array.prototype.slice.call(arguments),d=this.actions[this.actions.length-1].args,d=new THREE.LineCurve(new THREE.Vector2(d[d.length-2],d[d.length-1]),new THREE.Vector2(a,b));this.curves.push(d);this.actions.push({action:THREE.PathActions.LINE_TO,args:c})};
THREE.Path.prototype.quadraticCurveTo=function(a,b,c,d){var f=Array.prototype.slice.call(arguments),e=this.actions[this.actions.length-1].args,e=new THREE.QuadraticBezierCurve(new THREE.Vector2(e[e.length-2],e[e.length-1]),new THREE.Vector2(a,b),new THREE.Vector2(c,d));this.curves.push(e);this.actions.push({action:THREE.PathActions.QUADRATIC_CURVE_TO,args:f})};
THREE.Path.prototype.bezierCurveTo=function(a,b,c,d,f,e){var g=Array.prototype.slice.call(arguments),h=this.actions[this.actions.length-1].args,h=new THREE.CubicBezierCurve(new THREE.Vector2(h[h.length-2],h[h.length-1]),new THREE.Vector2(a,b),new THREE.Vector2(c,d),new THREE.Vector2(f,e));this.curves.push(h);this.actions.push({action:THREE.PathActions.BEZIER_CURVE_TO,args:g})};
THREE.Path.prototype.splineThru=function(a){var b=Array.prototype.slice.call(arguments),c=this.actions[this.actions.length-1].args,c=[new THREE.Vector2(c[c.length-2],c[c.length-1])];Array.prototype.push.apply(c,a);c=new THREE.SplineCurve(c);this.curves.push(c);this.actions.push({action:THREE.PathActions.CSPLINE_THRU,args:b})};THREE.Path.prototype.arc=function(a,b,c,d,f,e){var g=this.actions[this.actions.length-1].args;this.absarc(a+g[g.length-2],b+g[g.length-1],c,d,f,e)};
THREE.Path.prototype.absarc=function(a,b,c,d,f,e){this.absellipse(a,b,c,c,d,f,e)};THREE.Path.prototype.ellipse=function(a,b,c,d,f,e,g){var h=this.actions[this.actions.length-1].args;this.absellipse(a+h[h.length-2],b+h[h.length-1],c,d,f,e,g)};THREE.Path.prototype.absellipse=function(a,b,c,d,f,e,g){var h=Array.prototype.slice.call(arguments),i=new THREE.EllipseCurve(a,b,c,d,f,e,g);this.curves.push(i);i=i.getPoint(g?1:0);h.push(i.x);h.push(i.y);this.actions.push({action:THREE.PathActions.ELLIPSE,args:h})};
THREE.Path.prototype.getSpacedPoints=function(a){a||(a=40);for(var b=[],c=0;c<a;c++)b.push(this.getPoint(c/a));return b};
THREE.Path.prototype.getPoints=function(a,b){if(this.useSpacedPoints){console.log("tata");return this.getSpacedPoints(a,b)}var a=a||12,c=[],d,f,e,g,h,i,j,l,o,m,p,q,n;d=0;for(f=this.actions.length;d<f;d++){e=this.actions[d];g=e.action;e=e.args;switch(g){case THREE.PathActions.MOVE_TO:c.push(new THREE.Vector2(e[0],e[1]));break;case THREE.PathActions.LINE_TO:c.push(new THREE.Vector2(e[0],e[1]));break;case THREE.PathActions.QUADRATIC_CURVE_TO:h=e[2];i=e[3];o=e[0];m=e[1];if(c.length>0){g=c[c.length-1];
p=g.x;q=g.y}else{g=this.actions[d-1].args;p=g[g.length-2];q=g[g.length-1]}for(e=1;e<=a;e++){n=e/a;g=THREE.Shape.Utils.b2(n,p,o,h);n=THREE.Shape.Utils.b2(n,q,m,i);c.push(new THREE.Vector2(g,n))}break;case THREE.PathActions.BEZIER_CURVE_TO:h=e[4];i=e[5];o=e[0];m=e[1];j=e[2];l=e[3];if(c.length>0){g=c[c.length-1];p=g.x;q=g.y}else{g=this.actions[d-1].args;p=g[g.length-2];q=g[g.length-1]}for(e=1;e<=a;e++){n=e/a;g=THREE.Shape.Utils.b3(n,p,o,j,h);n=THREE.Shape.Utils.b3(n,q,m,l,i);c.push(new THREE.Vector2(g,
n))}break;case THREE.PathActions.CSPLINE_THRU:g=this.actions[d-1].args;n=[new THREE.Vector2(g[g.length-2],g[g.length-1])];g=a*e[0].length;n=n.concat(e[0]);n=new THREE.SplineCurve(n);for(e=1;e<=g;e++)c.push(n.getPointAt(e/g));break;case THREE.PathActions.ARC:h=e[0];i=e[1];m=e[2];j=e[3];g=e[4];o=!!e[5];p=g-j;q=a*2;for(e=1;e<=q;e++){n=e/q;o||(n=1-n);n=j+n*p;g=h+m*Math.cos(n);n=i+m*Math.sin(n);c.push(new THREE.Vector2(g,n))}break;case THREE.PathActions.ELLIPSE:h=e[0];i=e[1];m=e[2];l=e[3];j=e[4];g=e[5];
o=!!e[6];p=g-j;q=a*2;for(e=1;e<=q;e++){n=e/q;o||(n=1-n);n=j+n*p;g=h+m*Math.cos(n);n=i+l*Math.sin(n);c.push(new THREE.Vector2(g,n))}}}d=c[c.length-1];Math.abs(d.x-c[0].x)<1E-10&&Math.abs(d.y-c[0].y)<1E-10&&c.splice(c.length-1,1);b&&c.push(c[0]);return c};
THREE.Path.prototype.toShapes=function(){var a,b,c,d,f=[],e=new THREE.Path;a=0;for(b=this.actions.length;a<b;a++){c=this.actions[a];d=c.args;c=c.action;if(c==THREE.PathActions.MOVE_TO&&e.actions.length!=0){f.push(e);e=new THREE.Path}e[c].apply(e,d)}e.actions.length!=0&&f.push(e);if(f.length==0)return[];var g;d=[];a=!THREE.Shape.Utils.isClockWise(f[0].getPoints());if(f.length==1){e=f[0];g=new THREE.Shape;g.actions=e.actions;g.curves=e.curves;d.push(g);return d}if(a){g=new THREE.Shape;a=0;for(b=f.length;a<
b;a++){e=f[a];if(THREE.Shape.Utils.isClockWise(e.getPoints())){g.actions=e.actions;g.curves=e.curves;d.push(g);g=new THREE.Shape}else g.holes.push(e)}}else{a=0;for(b=f.length;a<b;a++){e=f[a];if(THREE.Shape.Utils.isClockWise(e.getPoints())){g&&d.push(g);g=new THREE.Shape;g.actions=e.actions;g.curves=e.curves}else g.holes.push(e)}d.push(g)}return d};THREE.Shape=function(){THREE.Path.apply(this,arguments);this.holes=[]};THREE.Shape.prototype=Object.create(THREE.Path.prototype);
THREE.Shape.prototype.extrude=function(a){return new THREE.ExtrudeGeometry(this,a)};THREE.Shape.prototype.getPointsHoles=function(a){var b,c=this.holes.length,d=[];for(b=0;b<c;b++)d[b]=this.holes[b].getTransformedPoints(a,this.bends);return d};THREE.Shape.prototype.getSpacedPointsHoles=function(a){var b,c=this.holes.length,d=[];for(b=0;b<c;b++)d[b]=this.holes[b].getTransformedSpacedPoints(a,this.bends);return d};
THREE.Shape.prototype.extractAllPoints=function(a){return{shape:this.getTransformedPoints(a),holes:this.getPointsHoles(a)}};THREE.Shape.prototype.extractPoints=function(a){return this.useSpacedPoints?this.extractAllSpacedPoints(a):this.extractAllPoints(a)};THREE.Shape.prototype.extractAllSpacedPoints=function(a){return{shape:this.getTransformedSpacedPoints(a),holes:this.getSpacedPointsHoles(a)}};
THREE.Shape.Utils={removeHoles:function(a,b){var c=a.concat(),d=c.concat(),f,e,g,h,i,j,l,o,m,p,q=[];for(i=0;i<b.length;i++){j=b[i];Array.prototype.push.apply(d,j);e=Number.POSITIVE_INFINITY;for(f=0;f<j.length;f++){m=j[f];p=[];for(o=0;o<c.length;o++){l=c[o];l=m.distanceToSquared(l);p.push(l);if(l<e){e=l;g=f;h=o}}}f=h-1>=0?h-1:c.length-1;e=g-1>=0?g-1:j.length-1;var n=[j[g],c[h],c[f]];o=THREE.FontUtils.Triangulate.area(n);var r=[j[g],j[e],c[h]];m=THREE.FontUtils.Triangulate.area(r);p=h;l=g;h=h+1;g=g+
-1;h<0&&(h=h+c.length);h=h%c.length;g<0&&(g=g+j.length);g=g%j.length;f=h-1>=0?h-1:c.length-1;e=g-1>=0?g-1:j.length-1;n=[j[g],c[h],c[f]];n=THREE.FontUtils.Triangulate.area(n);r=[j[g],j[e],c[h]];r=THREE.FontUtils.Triangulate.area(r);if(o+m>n+r){h=p;g=l;h<0&&(h=h+c.length);h=h%c.length;g<0&&(g=g+j.length);g=g%j.length;f=h-1>=0?h-1:c.length-1;e=g-1>=0?g-1:j.length-1}o=c.slice(0,h);m=c.slice(h);p=j.slice(g);l=j.slice(0,g);e=[j[g],j[e],c[h]];q.push([j[g],c[h],c[f]]);q.push(e);c=o.concat(p).concat(l).concat(m)}return{shape:c,
isolatedPts:q,allpoints:d}},triangulateShape:function(a,b){var c=THREE.Shape.Utils.removeHoles(a,b),d=c.allpoints,f=c.isolatedPts,c=THREE.FontUtils.Triangulate(c.shape,false),e,g,h,i,j={};e=0;for(g=d.length;e<g;e++){i=d[e].x+":"+d[e].y;j[i]!==void 0&&console.log("Duplicate point",i);j[i]=e}e=0;for(g=c.length;e<g;e++){h=c[e];for(d=0;d<3;d++){i=h[d].x+":"+h[d].y;i=j[i];i!==void 0&&(h[d]=i)}}e=0;for(g=f.length;e<g;e++){h=f[e];for(d=0;d<3;d++){i=h[d].x+":"+h[d].y;i=j[i];i!==void 0&&(h[d]=i)}}return c.concat(f)},
isClockWise:function(a){return THREE.FontUtils.Triangulate.area(a)<0},b2p0:function(a,b){var c=1-a;return c*c*b},b2p1:function(a,b){return 2*(1-a)*a*b},b2p2:function(a,b){return a*a*b},b2:function(a,b,c,d){return this.b2p0(a,b)+this.b2p1(a,c)+this.b2p2(a,d)},b3p0:function(a,b){var c=1-a;return c*c*c*b},b3p1:function(a,b){var c=1-a;return 3*c*c*a*b},b3p2:function(a,b){return 3*(1-a)*a*a*b},b3p3:function(a,b){return a*a*a*b},b3:function(a,b,c,d,f){return this.b3p0(a,b)+this.b3p1(a,c)+this.b3p2(a,d)+
this.b3p3(a,f)}};
THREE.AnimationHandler=function(){var a=[],b={},c={update:function(b){for(var c=0;c<a.length;c++)a[c].update(b)},addToUpdate:function(b){a.indexOf(b)===-1&&a.push(b)},removeFromUpdate:function(b){b=a.indexOf(b);b!==-1&&a.splice(b,1)},add:function(a){b[a.name]!==void 0&&console.log("THREE.AnimationHandler.add: Warning! "+a.name+" already exists in library. Overwriting.");b[a.name]=a;if(a.initialized!==true){for(var c=0;c<a.hierarchy.length;c++){for(var d=0;d<a.hierarchy[c].keys.length;d++){if(a.hierarchy[c].keys[d].time<0)a.hierarchy[c].keys[d].time=
0;if(a.hierarchy[c].keys[d].rot!==void 0&&!(a.hierarchy[c].keys[d].rot instanceof THREE.Quaternion)){var h=a.hierarchy[c].keys[d].rot;a.hierarchy[c].keys[d].rot=new THREE.Quaternion(h[0],h[1],h[2],h[3])}}if(a.hierarchy[c].keys.length&&a.hierarchy[c].keys[0].morphTargets!==void 0){h={};for(d=0;d<a.hierarchy[c].keys.length;d++)for(var i=0;i<a.hierarchy[c].keys[d].morphTargets.length;i++){var j=a.hierarchy[c].keys[d].morphTargets[i];h[j]=-1}a.hierarchy[c].usedMorphTargets=h;for(d=0;d<a.hierarchy[c].keys.length;d++){var l=
{};for(j in h){for(i=0;i<a.hierarchy[c].keys[d].morphTargets.length;i++)if(a.hierarchy[c].keys[d].morphTargets[i]===j){l[j]=a.hierarchy[c].keys[d].morphTargetsInfluences[i];break}i===a.hierarchy[c].keys[d].morphTargets.length&&(l[j]=0)}a.hierarchy[c].keys[d].morphTargetsInfluences=l}}for(d=1;d<a.hierarchy[c].keys.length;d++)if(a.hierarchy[c].keys[d].time===a.hierarchy[c].keys[d-1].time){a.hierarchy[c].keys.splice(d,1);d--}for(d=0;d<a.hierarchy[c].keys.length;d++)a.hierarchy[c].keys[d].index=d}d=parseInt(a.length*
a.fps,10);a.JIT={};a.JIT.hierarchy=[];for(c=0;c<a.hierarchy.length;c++)a.JIT.hierarchy.push(Array(d));a.initialized=true}},get:function(a){if(typeof a==="string"){if(b[a])return b[a];console.log("THREE.AnimationHandler.get: Couldn't find animation "+a);return null}},parse:function(a){var b=[];if(a instanceof THREE.SkinnedMesh)for(var c=0;c<a.bones.length;c++)b.push(a.bones[c]);else d(a,b);return b}},d=function(a,b){b.push(a);for(var c=0;c<a.children.length;c++)d(a.children[c],b)};c.LINEAR=0;c.CATMULLROM=
1;c.CATMULLROM_FORWARD=2;return c}();THREE.Animation=function(a,b,c){this.root=a;this.data=THREE.AnimationHandler.get(b);this.hierarchy=THREE.AnimationHandler.parse(a);this.currentTime=0;this.timeScale=1;this.isPlaying=false;this.loop=this.isPaused=true;this.interpolationType=c!==void 0?c:THREE.AnimationHandler.LINEAR;this.points=[];this.target=new THREE.Vector3};
THREE.Animation.prototype.play=function(a,b){if(this.isPlaying===false){this.isPlaying=true;this.loop=a!==void 0?a:true;this.currentTime=b!==void 0?b:0;var c,d=this.hierarchy.length,f;for(c=0;c<d;c++){f=this.hierarchy[c];if(this.interpolationType!==THREE.AnimationHandler.CATMULLROM_FORWARD)f.useQuaternion=true;f.matrixAutoUpdate=true;if(f.animationCache===void 0){f.animationCache={};f.animationCache.prevKey={pos:0,rot:0,scl:0};f.animationCache.nextKey={pos:0,rot:0,scl:0};f.animationCache.originalMatrix=
f instanceof THREE.Bone?f.skinMatrix:f.matrix}var e=f.animationCache.prevKey;f=f.animationCache.nextKey;e.pos=this.data.hierarchy[c].keys[0];e.rot=this.data.hierarchy[c].keys[0];e.scl=this.data.hierarchy[c].keys[0];f.pos=this.getNextKeyWith("pos",c,1);f.rot=this.getNextKeyWith("rot",c,1);f.scl=this.getNextKeyWith("scl",c,1)}this.update(0)}this.isPaused=false;THREE.AnimationHandler.addToUpdate(this)};
THREE.Animation.prototype.pause=function(){this.isPaused===true?THREE.AnimationHandler.addToUpdate(this):THREE.AnimationHandler.removeFromUpdate(this);this.isPaused=!this.isPaused};THREE.Animation.prototype.stop=function(){this.isPaused=this.isPlaying=false;THREE.AnimationHandler.removeFromUpdate(this)};
THREE.Animation.prototype.update=function(a){if(this.isPlaying!==false){var b=["pos","rot","scl"],c,d,f,e,g,h,i,j,l;l=this.currentTime=this.currentTime+a*this.timeScale;j=this.currentTime=this.currentTime%this.data.length;parseInt(Math.min(j*this.data.fps,this.data.length*this.data.fps),10);for(var o=0,m=this.hierarchy.length;o<m;o++){a=this.hierarchy[o];i=a.animationCache;for(var p=0;p<3;p++){c=b[p];g=i.prevKey[c];h=i.nextKey[c];if(h.time<=l){if(j<l)if(this.loop){g=this.data.hierarchy[o].keys[0];
for(h=this.getNextKeyWith(c,o,1);h.time<j;){g=h;h=this.getNextKeyWith(c,o,h.index+1)}}else{this.stop();return}else{do{g=h;h=this.getNextKeyWith(c,o,h.index+1)}while(h.time<j)}i.prevKey[c]=g;i.nextKey[c]=h}a.matrixAutoUpdate=true;a.matrixWorldNeedsUpdate=true;d=(j-g.time)/(h.time-g.time);f=g[c];e=h[c];if(d<0||d>1){console.log("THREE.Animation.update: Warning! Scale out of bounds:"+d+" on bone "+o);d=d<0?0:1}if(c==="pos"){c=a.position;if(this.interpolationType===THREE.AnimationHandler.LINEAR){c.x=f[0]+
(e[0]-f[0])*d;c.y=f[1]+(e[1]-f[1])*d;c.z=f[2]+(e[2]-f[2])*d}else if(this.interpolationType===THREE.AnimationHandler.CATMULLROM||this.interpolationType===THREE.AnimationHandler.CATMULLROM_FORWARD){this.points[0]=this.getPrevKeyWith("pos",o,g.index-1).pos;this.points[1]=f;this.points[2]=e;this.points[3]=this.getNextKeyWith("pos",o,h.index+1).pos;d=d*0.33+0.33;f=this.interpolateCatmullRom(this.points,d);c.x=f[0];c.y=f[1];c.z=f[2];if(this.interpolationType===THREE.AnimationHandler.CATMULLROM_FORWARD){d=
this.interpolateCatmullRom(this.points,d*1.01);this.target.set(d[0],d[1],d[2]);this.target.subSelf(c);this.target.y=0;this.target.normalize();d=Math.atan2(this.target.x,this.target.z);a.rotation.set(0,d,0)}}}else if(c==="rot")THREE.Quaternion.slerp(f,e,a.quaternion,d);else if(c==="scl"){c=a.scale;c.x=f[0]+(e[0]-f[0])*d;c.y=f[1]+(e[1]-f[1])*d;c.z=f[2]+(e[2]-f[2])*d}}}}};
THREE.Animation.prototype.interpolateCatmullRom=function(a,b){var c=[],d=[],f,e,g,h,i,j;f=(a.length-1)*b;e=Math.floor(f);f=f-e;c[0]=e===0?e:e-1;c[1]=e;c[2]=e>a.length-2?e:e+1;c[3]=e>a.length-3?e:e+2;e=a[c[0]];h=a[c[1]];i=a[c[2]];j=a[c[3]];c=f*f;g=f*c;d[0]=this.interpolate(e[0],h[0],i[0],j[0],f,c,g);d[1]=this.interpolate(e[1],h[1],i[1],j[1],f,c,g);d[2]=this.interpolate(e[2],h[2],i[2],j[2],f,c,g);return d};
THREE.Animation.prototype.interpolate=function(a,b,c,d,f,e,g){a=(c-a)*0.5;d=(d-b)*0.5;return(2*(b-c)+a+d)*g+(-3*(b-c)-2*a-d)*e+a*f+b};THREE.Animation.prototype.getNextKeyWith=function(a,b,c){for(var d=this.data.hierarchy[b].keys,c=this.interpolationType===THREE.AnimationHandler.CATMULLROM||this.interpolationType===THREE.AnimationHandler.CATMULLROM_FORWARD?c<d.length-1?c:d.length-1:c%d.length;c<d.length;c++)if(d[c][a]!==void 0)return d[c];return this.data.hierarchy[b].keys[0]};
THREE.Animation.prototype.getPrevKeyWith=function(a,b,c){for(var d=this.data.hierarchy[b].keys,c=this.interpolationType===THREE.AnimationHandler.CATMULLROM||this.interpolationType===THREE.AnimationHandler.CATMULLROM_FORWARD?c>0?c:0:c>=0?c:c+d.length;c>=0;c--)if(d[c][a]!==void 0)return d[c];return this.data.hierarchy[b].keys[d.length-1]};
THREE.KeyFrameAnimation=function(a,b,c){this.root=a;this.data=THREE.AnimationHandler.get(b);this.hierarchy=THREE.AnimationHandler.parse(a);this.currentTime=0;this.timeScale=0.001;this.isPlaying=false;this.loop=this.isPaused=true;this.JITCompile=c!==void 0?c:true;a=0;for(b=this.hierarchy.length;a<b;a++){var c=this.data.hierarchy[a].sids,d=this.hierarchy[a];if(this.data.hierarchy[a].keys.length&&c){for(var f=0;f<c.length;f++){var e=c[f],g=this.getNextKeyWith(e,a,0);g&&g.apply(e)}d.matrixAutoUpdate=
false;this.data.hierarchy[a].node.updateMatrix();d.matrixWorldNeedsUpdate=true}}};
THREE.KeyFrameAnimation.prototype.play=function(a,b){if(!this.isPlaying){this.isPlaying=true;this.loop=a!==void 0?a:true;this.currentTime=b!==void 0?b:0;this.startTimeMs=b;this.startTime=1E7;this.endTime=-this.startTime;var c,d=this.hierarchy.length,f,e;for(c=0;c<d;c++){f=this.hierarchy[c];e=this.data.hierarchy[c];f.useQuaternion=true;if(e.animationCache===void 0){e.animationCache={};e.animationCache.prevKey=null;e.animationCache.nextKey=null;e.animationCache.originalMatrix=f instanceof THREE.Bone?
f.skinMatrix:f.matrix}f=this.data.hierarchy[c].keys;if(f.length){e.animationCache.prevKey=f[0];e.animationCache.nextKey=f[1];this.startTime=Math.min(f[0].time,this.startTime);this.endTime=Math.max(f[f.length-1].time,this.endTime)}}this.update(0)}this.isPaused=false;THREE.AnimationHandler.addToUpdate(this)};THREE.KeyFrameAnimation.prototype.pause=function(){this.isPaused?THREE.AnimationHandler.addToUpdate(this):THREE.AnimationHandler.removeFromUpdate(this);this.isPaused=!this.isPaused};
THREE.KeyFrameAnimation.prototype.stop=function(){this.isPaused=this.isPlaying=false;THREE.AnimationHandler.removeFromUpdate(this);for(var a=0;a<this.data.hierarchy.length;a++){var b=this.hierarchy[a],c=this.data.hierarchy[a];if(c.animationCache!==void 0){var d=c.animationCache.originalMatrix;if(b instanceof THREE.Bone){d.copy(b.skinMatrix);b.skinMatrix=d}else{d.copy(b.matrix);b.matrix=d}delete c.animationCache}}};
THREE.KeyFrameAnimation.prototype.update=function(a){if(this.isPlaying){var b,c,d,f,e=this.data.JIT.hierarchy,g,h,i;h=this.currentTime=this.currentTime+a*this.timeScale;g=this.currentTime=this.currentTime%this.data.length;if(g<this.startTimeMs)g=this.currentTime=this.startTimeMs+g;f=parseInt(Math.min(g*this.data.fps,this.data.length*this.data.fps),10);if((i=g<h)&&!this.loop){for(var a=0,j=this.hierarchy.length;a<j;a++){var l=this.data.hierarchy[a].keys,e=this.data.hierarchy[a].sids;d=l.length-1;f=
this.hierarchy[a];if(l.length){for(l=0;l<e.length;l++){g=e[l];(h=this.getPrevKeyWith(g,a,d))&&h.apply(g)}this.data.hierarchy[a].node.updateMatrix();f.matrixWorldNeedsUpdate=true}}this.stop()}else if(!(g<this.startTime)){a=0;for(j=this.hierarchy.length;a<j;a++){d=this.hierarchy[a];b=this.data.hierarchy[a];var l=b.keys,o=b.animationCache;if(this.JITCompile&&e[a][f]!==void 0)if(d instanceof THREE.Bone){d.skinMatrix=e[a][f];d.matrixWorldNeedsUpdate=false}else{d.matrix=e[a][f];d.matrixWorldNeedsUpdate=
true}else if(l.length){if(this.JITCompile&&o)d instanceof THREE.Bone?d.skinMatrix=o.originalMatrix:d.matrix=o.originalMatrix;b=o.prevKey;c=o.nextKey;if(b&&c){if(c.time<=h){if(i&&this.loop){b=l[0];for(c=l[1];c.time<g;){b=c;c=l[b.index+1]}}else if(!i)for(var m=l.length-1;c.time<g&&c.index!==m;){b=c;c=l[b.index+1]}o.prevKey=b;o.nextKey=c}c.time>=g?b.interpolate(c,g):b.interpolate(c,c.time)}this.data.hierarchy[a].node.updateMatrix();d.matrixWorldNeedsUpdate=true}}if(this.JITCompile&&e[0][f]===void 0){this.hierarchy[0].updateMatrixWorld(true);
for(a=0;a<this.hierarchy.length;a++)e[a][f]=this.hierarchy[a]instanceof THREE.Bone?this.hierarchy[a].skinMatrix.clone():this.hierarchy[a].matrix.clone()}}}};THREE.KeyFrameAnimation.prototype.getNextKeyWith=function(a,b,c){b=this.data.hierarchy[b].keys;for(c=c%b.length;c<b.length;c++)if(b[c].hasTarget(a))return b[c];return b[0]};
THREE.KeyFrameAnimation.prototype.getPrevKeyWith=function(a,b,c){b=this.data.hierarchy[b].keys;for(c=c>=0?c:c+b.length;c>=0;c--)if(b[c].hasTarget(a))return b[c];return b[b.length-1]};
THREE.CubeCamera=function(a,b,c){THREE.Object3D.call(this);var d=new THREE.PerspectiveCamera(90,1,a,b);d.up.set(0,-1,0);d.lookAt(new THREE.Vector3(1,0,0));this.add(d);var f=new THREE.PerspectiveCamera(90,1,a,b);f.up.set(0,-1,0);f.lookAt(new THREE.Vector3(-1,0,0));this.add(f);var e=new THREE.PerspectiveCamera(90,1,a,b);e.up.set(0,0,1);e.lookAt(new THREE.Vector3(0,1,0));this.add(e);var g=new THREE.PerspectiveCamera(90,1,a,b);g.up.set(0,0,-1);g.lookAt(new THREE.Vector3(0,-1,0));this.add(g);var h=new THREE.PerspectiveCamera(90,
1,a,b);h.up.set(0,-1,0);h.lookAt(new THREE.Vector3(0,0,1));this.add(h);var i=new THREE.PerspectiveCamera(90,1,a,b);i.up.set(0,-1,0);i.lookAt(new THREE.Vector3(0,0,-1));this.add(i);this.renderTarget=new THREE.WebGLRenderTargetCube(c,c,{format:THREE.RGBFormat,magFilter:THREE.LinearFilter,minFilter:THREE.LinearFilter});this.updateCubeMap=function(a,b){var c=this.renderTarget,m=c.generateMipmaps;c.generateMipmaps=false;c.activeCubeFace=0;a.render(b,d,c);c.activeCubeFace=1;a.render(b,f,c);c.activeCubeFace=
2;a.render(b,e,c);c.activeCubeFace=3;a.render(b,g,c);c.activeCubeFace=4;a.render(b,h,c);c.generateMipmaps=m;c.activeCubeFace=5;a.render(b,i,c)}};THREE.CubeCamera.prototype=Object.create(THREE.Object3D.prototype);THREE.CombinedCamera=function(a,b,c,d,f,e,g){THREE.Camera.call(this);this.fov=c;this.left=-a/2;this.right=a/2;this.top=b/2;this.bottom=-b/2;this.cameraO=new THREE.OrthographicCamera(a/-2,a/2,b/2,b/-2,e,g);this.cameraP=new THREE.PerspectiveCamera(c,a/b,d,f);this.zoom=1;this.toPerspective()};
THREE.CombinedCamera.prototype=Object.create(THREE.Camera.prototype);THREE.CombinedCamera.prototype.toPerspective=function(){this.near=this.cameraP.near;this.far=this.cameraP.far;this.cameraP.fov=this.fov/this.zoom;this.cameraP.updateProjectionMatrix();this.projectionMatrix=this.cameraP.projectionMatrix;this.inPerspectiveMode=true;this.inOrthographicMode=false};
THREE.CombinedCamera.prototype.toOrthographic=function(){var a=this.cameraP.aspect,b=(this.cameraP.near+this.cameraP.far)/2,b=Math.tan(this.fov/2)*b,a=2*b*a/2,b=b/this.zoom,a=a/this.zoom;this.cameraO.left=-a;this.cameraO.right=a;this.cameraO.top=b;this.cameraO.bottom=-b;this.cameraO.updateProjectionMatrix();this.near=this.cameraO.near;this.far=this.cameraO.far;this.projectionMatrix=this.cameraO.projectionMatrix;this.inPerspectiveMode=false;this.inOrthographicMode=true};
THREE.CombinedCamera.prototype.setSize=function(a,b){this.cameraP.aspect=a/b;this.left=-a/2;this.right=a/2;this.top=b/2;this.bottom=-b/2};THREE.CombinedCamera.prototype.setFov=function(a){this.fov=a;this.inPerspectiveMode?this.toPerspective():this.toOrthographic()};THREE.CombinedCamera.prototype.updateProjectionMatrix=function(){if(this.inPerspectiveMode)this.toPerspective();else{this.toPerspective();this.toOrthographic()}};
THREE.CombinedCamera.prototype.setLens=function(a,b){var c=2*Math.atan((b!==void 0?b:24)/(a*2))*(180/Math.PI);this.setFov(c);return c};THREE.CombinedCamera.prototype.setZoom=function(a){this.zoom=a;this.inPerspectiveMode?this.toPerspective():this.toOrthographic()};THREE.CombinedCamera.prototype.toFrontView=function(){this.rotation.x=0;this.rotation.y=0;this.rotation.z=0;this.rotationAutoUpdate=false};
THREE.CombinedCamera.prototype.toBackView=function(){this.rotation.x=0;this.rotation.y=Math.PI;this.rotation.z=0;this.rotationAutoUpdate=false};THREE.CombinedCamera.prototype.toLeftView=function(){this.rotation.x=0;this.rotation.y=-Math.PI/2;this.rotation.z=0;this.rotationAutoUpdate=false};THREE.CombinedCamera.prototype.toRightView=function(){this.rotation.x=0;this.rotation.y=Math.PI/2;this.rotation.z=0;this.rotationAutoUpdate=false};
THREE.CombinedCamera.prototype.toTopView=function(){this.rotation.x=-Math.PI/2;this.rotation.y=0;this.rotation.z=0;this.rotationAutoUpdate=false};THREE.CombinedCamera.prototype.toBottomView=function(){this.rotation.x=Math.PI/2;this.rotation.y=0;this.rotation.z=0;this.rotationAutoUpdate=false};
THREE.FirstPersonControls=function(a,b){function c(a,b){return function(){b.apply(a,arguments)}}this.object=a;this.target=new THREE.Vector3(0,0,0);this.domElement=b!==void 0?b:document;this.movementSpeed=1;this.lookSpeed=0.005;this.lookVertical=true;this.autoForward=false;this.activeLook=true;this.heightSpeed=false;this.heightCoef=1;this.heightMin=0;this.heightMax=1;this.constrainVertical=false;this.verticalMin=0;this.verticalMax=Math.PI;this.theta=this.phi=this.lon=this.lat=this.mouseY=this.mouseX=
this.autoSpeedFactor=0;this.mouseDragOn=this.freeze=this.moveRight=this.moveLeft=this.moveBackward=this.moveForward=false;this.viewHalfY=this.viewHalfX=0;this.domElement!==document&&this.domElement.setAttribute("tabindex",-1);this.handleResize=function(){if(this.domElement===document){this.viewHalfX=window.innerWidth/2;this.viewHalfY=window.innerHeight/2}else{this.viewHalfX=this.domElement.offsetWidth/2;this.viewHalfY=this.domElement.offsetHeight/2}};this.onMouseDown=function(a){this.domElement!==
document&&this.domElement.focus();a.preventDefault();a.stopPropagation();if(this.activeLook)switch(a.button){case 0:this.moveForward=true;break;case 2:this.moveBackward=true}this.mouseDragOn=true};this.onMouseUp=function(a){a.preventDefault();a.stopPropagation();if(this.activeLook)switch(a.button){case 0:this.moveForward=false;break;case 2:this.moveBackward=false}this.mouseDragOn=false};this.onMouseMove=function(a){if(this.domElement===document){this.mouseX=a.pageX-this.viewHalfX;this.mouseY=a.pageY-
this.viewHalfY}else{this.mouseX=a.pageX-this.domElement.offsetLeft-this.viewHalfX;this.mouseY=a.pageY-this.domElement.offsetTop-this.viewHalfY}};this.onKeyDown=function(a){switch(a.keyCode){case 38:case 87:this.moveForward=true;break;case 37:case 65:this.moveLeft=true;break;case 40:case 83:this.moveBackward=true;break;case 39:case 68:this.moveRight=true;break;case 82:this.moveUp=true;break;case 70:this.moveDown=true;break;case 81:this.freeze=!this.freeze}};this.onKeyUp=function(a){switch(a.keyCode){case 38:case 87:this.moveForward=
false;break;case 37:case 65:this.moveLeft=false;break;case 40:case 83:this.moveBackward=false;break;case 39:case 68:this.moveRight=false;break;case 82:this.moveUp=false;break;case 70:this.moveDown=false}};this.update=function(a){var b=0;if(!this.freeze){if(this.heightSpeed){b=THREE.Math.clamp(this.object.position.y,this.heightMin,this.heightMax)-this.heightMin;this.autoSpeedFactor=a*b*this.heightCoef}else this.autoSpeedFactor=0;b=a*this.movementSpeed;(this.moveForward||this.autoForward&&!this.moveBackward)&&
this.object.translateZ(-(b+this.autoSpeedFactor));this.moveBackward&&this.object.translateZ(b);this.moveLeft&&this.object.translateX(-b);this.moveRight&&this.object.translateX(b);this.moveUp&&this.object.translateY(b);this.moveDown&&this.object.translateY(-b);a=a*this.lookSpeed;this.activeLook||(a=0);this.lon=this.lon+this.mouseX*a;if(this.lookVertical)this.lat=this.lat-this.mouseY*a;this.lat=Math.max(-85,Math.min(85,this.lat));this.phi=(90-this.lat)*Math.PI/180;this.theta=this.lon*Math.PI/180;var b=
this.target,c=this.object.position;b.x=c.x+100*Math.sin(this.phi)*Math.cos(this.theta);b.y=c.y+100*Math.cos(this.phi);b.z=c.z+100*Math.sin(this.phi)*Math.sin(this.theta);b=1;this.constrainVertical&&(b=Math.PI/(this.verticalMax-this.verticalMin));this.lon=this.lon+this.mouseX*a;if(this.lookVertical)this.lat=this.lat-this.mouseY*a*b;this.lat=Math.max(-85,Math.min(85,this.lat));this.phi=(90-this.lat)*Math.PI/180;this.theta=this.lon*Math.PI/180;if(this.constrainVertical)this.phi=THREE.Math.mapLinear(this.phi,
0,Math.PI,this.verticalMin,this.verticalMax);b=this.target;c=this.object.position;b.x=c.x+100*Math.sin(this.phi)*Math.cos(this.theta);b.y=c.y+100*Math.cos(this.phi);b.z=c.z+100*Math.sin(this.phi)*Math.sin(this.theta);this.object.lookAt(b)}};this.domElement.addEventListener("contextmenu",function(a){a.preventDefault()},false);this.domElement.addEventListener("mousemove",c(this,this.onMouseMove),false);this.domElement.addEventListener("mousedown",c(this,this.onMouseDown),false);this.domElement.addEventListener("mouseup",
c(this,this.onMouseUp),false);this.domElement.addEventListener("keydown",c(this,this.onKeyDown),false);this.domElement.addEventListener("keyup",c(this,this.onKeyUp),false);this.handleResize()};
THREE.PathControls=function(a,b){function c(a){return(a=a*2)<1?0.5*a*a:-0.5*(--a*(a-2)-1)}function d(a,b){return function(){b.apply(a,arguments)}}function f(a,b,c,d){var e={name:c,fps:0.6,length:d,hierarchy:[]},f,g=b.getControlPointsArray(),h=b.getLength(),r=g.length,s=0;f=r-1;b={parent:-1,keys:[]};b.keys[0]={time:0,pos:g[0],rot:[0,0,0,1],scl:[1,1,1]};b.keys[f]={time:d,pos:g[f],rot:[0,0,0,1],scl:[1,1,1]};for(f=1;f<r-1;f++){s=d*h.chunks[f]/h.total;b.keys[f]={time:s,pos:g[f]}}e.hierarchy[0]=b;THREE.AnimationHandler.add(e);
return new THREE.Animation(a,c,THREE.AnimationHandler.CATMULLROM_FORWARD,false)}function e(a,b){var c,d,e=new THREE.Geometry;for(c=0;c<a.points.length*b;c++){d=c/(a.points.length*b);d=a.getPoint(d);e.vertices[c]=new THREE.Vector3(d.x,d.y,d.z)}return e}this.object=a;this.domElement=b!==void 0?b:document;this.id="PathControls"+THREE.PathControlsIdCounter++;this.duration=1E4;this.waypoints=[];this.useConstantSpeed=true;this.resamplingCoef=50;this.debugPath=new THREE.Object3D;this.debugDummy=new THREE.Object3D;
this.animationParent=new THREE.Object3D;this.lookSpeed=0.005;this.lookHorizontal=this.lookVertical=true;this.verticalAngleMap={srcRange:[0,2*Math.PI],dstRange:[0,2*Math.PI]};this.horizontalAngleMap={srcRange:[0,2*Math.PI],dstRange:[0,2*Math.PI]};this.target=new THREE.Object3D;this.theta=this.phi=this.lon=this.lat=this.mouseY=this.mouseX=0;var g=Math.PI*2,h=Math.PI/180;this.viewHalfY=this.viewHalfX=0;this.domElement!==document&&this.domElement.setAttribute("tabindex",-1);this.handleResize=function(){if(this.domElement===
document){this.viewHalfX=window.innerWidth/2;this.viewHalfY=window.innerHeight/2}else{this.viewHalfX=this.domElement.offsetWidth/2;this.viewHalfY=this.domElement.offsetHeight/2}};this.update=function(a){var b;if(this.lookHorizontal)this.lon=this.lon+this.mouseX*this.lookSpeed*a;if(this.lookVertical)this.lat=this.lat-this.mouseY*this.lookSpeed*a;this.lon=Math.max(0,Math.min(360,this.lon));this.lat=Math.max(-85,Math.min(85,this.lat));this.phi=(90-this.lat)*h;this.theta=this.lon*h;a=this.phi%g;this.phi=
a>=0?a:a+g;b=this.verticalAngleMap.srcRange;a=this.verticalAngleMap.dstRange;b=THREE.Math.mapLinear(this.phi,b[0],b[1],a[0],a[1]);var d=a[1]-a[0];this.phi=c((b-a[0])/d)*d+a[0];b=this.horizontalAngleMap.srcRange;a=this.horizontalAngleMap.dstRange;b=THREE.Math.mapLinear(this.theta,b[0],b[1],a[0],a[1]);d=a[1]-a[0];this.theta=c((b-a[0])/d)*d+a[0];a=this.target.position;a.x=100*Math.sin(this.phi)*Math.cos(this.theta);a.y=100*Math.cos(this.phi);a.z=100*Math.sin(this.phi)*Math.sin(this.theta);this.object.lookAt(this.target.position)};
this.onMouseMove=function(a){if(this.domElement===document){this.mouseX=a.pageX-this.viewHalfX;this.mouseY=a.pageY-this.viewHalfY}else{this.mouseX=a.pageX-this.domElement.offsetLeft-this.viewHalfX;this.mouseY=a.pageY-this.domElement.offsetTop-this.viewHalfY}};this.init=function(){this.spline=new THREE.Spline;this.spline.initFromArray(this.waypoints);this.useConstantSpeed&&this.spline.reparametrizeByArcLength(this.resamplingCoef);if(this.createDebugDummy){var a=new THREE.MeshLambertMaterial({color:30719}),
b=new THREE.MeshLambertMaterial({color:65280}),c=new THREE.CubeGeometry(10,10,20),g=new THREE.CubeGeometry(2,2,10);this.animationParent=new THREE.Mesh(c,a);a=new THREE.Mesh(g,b);a.position.set(0,10,0);this.animation=f(this.animationParent,this.spline,this.id,this.duration);this.animationParent.add(this.object);this.animationParent.add(this.target);this.animationParent.add(a)}else{this.animation=f(this.animationParent,this.spline,this.id,this.duration);this.animationParent.add(this.target);this.animationParent.add(this.object)}if(this.createDebugPath){var a=
this.debugPath,b=this.spline,g=e(b,10),c=e(b,10),h=new THREE.LineBasicMaterial({color:16711680,linewidth:3}),g=new THREE.Line(g,h),c=new THREE.ParticleSystem(c,new THREE.ParticleBasicMaterial({color:16755200,size:3}));g.scale.set(1,1,1);a.add(g);c.scale.set(1,1,1);a.add(c);for(var g=new THREE.SphereGeometry(1,16,8),h=new THREE.MeshBasicMaterial({color:65280}),p=0;p<b.points.length;p++){c=new THREE.Mesh(g,h);c.position.copy(b.points[p]);a.add(c)}}this.domElement.addEventListener("mousemove",d(this,
this.onMouseMove),false)};this.handleResize()};THREE.PathControlsIdCounter=0;
THREE.FlyControls=function(a,b){function c(a,b){return function(){b.apply(a,arguments)}}this.object=a;this.domElement=b!==void 0?b:document;b&&this.domElement.setAttribute("tabindex",-1);this.movementSpeed=1;this.rollSpeed=0.005;this.autoForward=this.dragToLook=false;this.object.useQuaternion=true;this.tmpQuaternion=new THREE.Quaternion;this.mouseStatus=0;this.moveState={up:0,down:0,left:0,right:0,forward:0,back:0,pitchUp:0,pitchDown:0,yawLeft:0,yawRight:0,rollLeft:0,rollRight:0};this.moveVector=
new THREE.Vector3(0,0,0);this.rotationVector=new THREE.Vector3(0,0,0);this.handleEvent=function(a){if(typeof this[a.type]=="function")this[a.type](a)};this.keydown=function(a){if(!a.altKey){switch(a.keyCode){case 16:this.movementSpeedMultiplier=0.1;break;case 87:this.moveState.forward=1;break;case 83:this.moveState.back=1;break;case 65:this.moveState.left=1;break;case 68:this.moveState.right=1;break;case 82:this.moveState.up=1;break;case 70:this.moveState.down=1;break;case 38:this.moveState.pitchUp=
1;break;case 40:this.moveState.pitchDown=1;break;case 37:this.moveState.yawLeft=1;break;case 39:this.moveState.yawRight=1;break;case 81:this.moveState.rollLeft=1;break;case 69:this.moveState.rollRight=1}this.updateMovementVector();this.updateRotationVector()}};this.keyup=function(a){switch(a.keyCode){case 16:this.movementSpeedMultiplier=1;break;case 87:this.moveState.forward=0;break;case 83:this.moveState.back=0;break;case 65:this.moveState.left=0;break;case 68:this.moveState.right=0;break;case 82:this.moveState.up=
0;break;case 70:this.moveState.down=0;break;case 38:this.moveState.pitchUp=0;break;case 40:this.moveState.pitchDown=0;break;case 37:this.moveState.yawLeft=0;break;case 39:this.moveState.yawRight=0;break;case 81:this.moveState.rollLeft=0;break;case 69:this.moveState.rollRight=0}this.updateMovementVector();this.updateRotationVector()};this.mousedown=function(a){this.domElement!==document&&this.domElement.focus();a.preventDefault();a.stopPropagation();if(this.dragToLook)this.mouseStatus++;else switch(a.button){case 0:this.object.moveForward=
true;break;case 2:this.object.moveBackward=true}};this.mousemove=function(a){if(!this.dragToLook||this.mouseStatus>0){var b=this.getContainerDimensions(),c=b.size[0]/2,g=b.size[1]/2;this.moveState.yawLeft=-(a.pageX-b.offset[0]-c)/c;this.moveState.pitchDown=(a.pageY-b.offset[1]-g)/g;this.updateRotationVector()}};this.mouseup=function(a){a.preventDefault();a.stopPropagation();if(this.dragToLook){this.mouseStatus--;this.moveState.yawLeft=this.moveState.pitchDown=0}else switch(a.button){case 0:this.moveForward=
false;break;case 2:this.moveBackward=false}this.updateRotationVector()};this.update=function(a){var b=a*this.movementSpeed,a=a*this.rollSpeed;this.object.translateX(this.moveVector.x*b);this.object.translateY(this.moveVector.y*b);this.object.translateZ(this.moveVector.z*b);this.tmpQuaternion.set(this.rotationVector.x*a,this.rotationVector.y*a,this.rotationVector.z*a,1).normalize();this.object.quaternion.multiplySelf(this.tmpQuaternion);this.object.matrix.setPosition(this.object.position);this.object.matrix.setRotationFromQuaternion(this.object.quaternion);
this.object.matrixWorldNeedsUpdate=true};this.updateMovementVector=function(){var a=this.moveState.forward||this.autoForward&&!this.moveState.back?1:0;this.moveVector.x=-this.moveState.left+this.moveState.right;this.moveVector.y=-this.moveState.down+this.moveState.up;this.moveVector.z=-a+this.moveState.back};this.updateRotationVector=function(){this.rotationVector.x=-this.moveState.pitchDown+this.moveState.pitchUp;this.rotationVector.y=-this.moveState.yawRight+this.moveState.yawLeft;this.rotationVector.z=
-this.moveState.rollRight+this.moveState.rollLeft};this.getContainerDimensions=function(){return this.domElement!=document?{size:[this.domElement.offsetWidth,this.domElement.offsetHeight],offset:[this.domElement.offsetLeft,this.domElement.offsetTop]}:{size:[window.innerWidth,window.innerHeight],offset:[0,0]}};this.domElement.addEventListener("mousemove",c(this,this.mousemove),false);this.domElement.addEventListener("mousedown",c(this,this.mousedown),false);this.domElement.addEventListener("mouseup",
c(this,this.mouseup),false);this.domElement.addEventListener("keydown",c(this,this.keydown),false);this.domElement.addEventListener("keyup",c(this,this.keyup),false);this.updateMovementVector();this.updateRotationVector()};
THREE.RollControls=function(a,b){this.object=a;this.domElement=b!==void 0?b:document;this.mouseLook=true;this.autoForward=false;this.rollSpeed=this.movementSpeed=this.lookSpeed=1;this.constrainVertical=[-0.9,0.9];this.object.matrixAutoUpdate=false;this.forward=new THREE.Vector3(0,0,1);this.roll=0;var c=new THREE.Vector3,d=new THREE.Vector3,f=new THREE.Vector3,e=new THREE.Matrix4,g=false,h=1,i=0,j=0,l=0,o=0,m=0,p=0,q=0;this.handleResize=function(){p=window.innerWidth/2;q=window.innerHeight/2};this.update=
function(a){if(this.mouseLook){var b=a*this.lookSpeed;this.rotateHorizontally(b*o);this.rotateVertically(b*m)}b=a*this.movementSpeed;this.object.translateZ(-b*(i>0||this.autoForward&&!(i<0)?1:i));this.object.translateX(b*j);this.object.translateY(b*l);if(g)this.roll=this.roll+this.rollSpeed*a*h;if(this.forward.y>this.constrainVertical[1]){this.forward.y=this.constrainVertical[1];this.forward.normalize()}else if(this.forward.y<this.constrainVertical[0]){this.forward.y=this.constrainVertical[0];this.forward.normalize()}f.copy(this.forward);
d.set(0,1,0);c.cross(d,f).normalize();d.cross(f,c).normalize();this.object.matrix.elements[0]=c.x;this.object.matrix.elements[4]=d.x;this.object.matrix.elements[8]=f.x;this.object.matrix.elements[1]=c.y;this.object.matrix.elements[5]=d.y;this.object.matrix.elements[9]=f.y;this.object.matrix.elements[2]=c.z;this.object.matrix.elements[6]=d.z;this.object.matrix.elements[10]=f.z;e.identity();e.elements[0]=Math.cos(this.roll);e.elements[4]=-Math.sin(this.roll);e.elements[1]=Math.sin(this.roll);e.elements[5]=
Math.cos(this.roll);this.object.matrix.multiplySelf(e);this.object.matrixWorldNeedsUpdate=true;this.object.matrix.elements[12]=this.object.position.x;this.object.matrix.elements[13]=this.object.position.y;this.object.matrix.elements[14]=this.object.position.z};this.translateX=function(a){this.object.position.x=this.object.position.x+this.object.matrix.elements[0]*a;this.object.position.y=this.object.position.y+this.object.matrix.elements[1]*a;this.object.position.z=this.object.position.z+this.object.matrix.elements[2]*
a};this.translateY=function(a){this.object.position.x=this.object.position.x+this.object.matrix.elements[4]*a;this.object.position.y=this.object.position.y+this.object.matrix.elements[5]*a;this.object.position.z=this.object.position.z+this.object.matrix.elements[6]*a};this.translateZ=function(a){this.object.position.x=this.object.position.x-this.object.matrix.elements[8]*a;this.object.position.y=this.object.position.y-this.object.matrix.elements[9]*a;this.object.position.z=this.object.position.z-
this.object.matrix.elements[10]*a};this.rotateHorizontally=function(a){c.set(this.object.matrix.elements[0],this.object.matrix.elements[1],this.object.matrix.elements[2]);c.multiplyScalar(a);this.forward.subSelf(c);this.forward.normalize()};this.rotateVertically=function(a){d.set(this.object.matrix.elements[4],this.object.matrix.elements[5],this.object.matrix.elements[6]);d.multiplyScalar(a);this.forward.addSelf(d);this.forward.normalize()};this.domElement.addEventListener("contextmenu",function(a){a.preventDefault()},
false);this.domElement.addEventListener("mousemove",function(a){o=(a.clientX-p)/window.innerWidth;m=(a.clientY-q)/window.innerHeight},false);this.domElement.addEventListener("mousedown",function(a){a.preventDefault();a.stopPropagation();switch(a.button){case 0:i=1;break;case 2:i=-1}},false);this.domElement.addEventListener("mouseup",function(a){a.preventDefault();a.stopPropagation();switch(a.button){case 0:i=0;break;case 2:i=0}},false);this.domElement.addEventListener("keydown",function(a){switch(a.keyCode){case 38:case 87:i=
1;break;case 37:case 65:j=-1;break;case 40:case 83:i=-1;break;case 39:case 68:j=1;break;case 81:g=true;h=1;break;case 69:g=true;h=-1;break;case 82:l=1;break;case 70:l=-1}},false);this.domElement.addEventListener("keyup",function(a){switch(a.keyCode){case 38:case 87:i=0;break;case 37:case 65:j=0;break;case 40:case 83:i=0;break;case 39:case 68:j=0;break;case 81:g=false;break;case 69:g=false;break;case 82:l=0;break;case 70:l=0}},false);this.handleResize()};
THREE.TrackballControls=function(a,b){THREE.EventTarget.call(this);var c=this;this.object=a;this.domElement=b!==void 0?b:document;this.enabled=true;this.screen={width:0,height:0,offsetLeft:0,offsetTop:0};this.radius=(this.screen.width+this.screen.height)/4;this.rotateSpeed=1;this.zoomSpeed=1.2;this.panSpeed=0.3;this.staticMoving=this.noPan=this.noZoom=this.noRotate=false;this.dynamicDampingFactor=0.2;this.minDistance=0;this.maxDistance=Infinity;this.keys=[65,83,68];this.target=new THREE.Vector3;var d=
new THREE.Vector3,f=false,e=-1,g=new THREE.Vector3,h=new THREE.Vector3,i=new THREE.Vector3,j=new THREE.Vector2,l=new THREE.Vector2,o=new THREE.Vector2,m=new THREE.Vector2,p={type:"change"};this.handleResize=function(){this.screen.width=window.innerWidth;this.screen.height=window.innerHeight;this.screen.offsetLeft=0;this.screen.offsetTop=0;this.radius=(this.screen.width+this.screen.height)/4};this.handleEvent=function(a){if(typeof this[a.type]=="function")this[a.type](a)};this.getMouseOnScreen=function(a,
b){return new THREE.Vector2((a-c.screen.offsetLeft)/c.radius*0.5,(b-c.screen.offsetTop)/c.radius*0.5)};this.getMouseProjectionOnBall=function(a,b){var d=new THREE.Vector3((a-c.screen.width*0.5-c.screen.offsetLeft)/c.radius,(c.screen.height*0.5+c.screen.offsetTop-b)/c.radius,0),e=d.length();e>1?d.normalize():d.z=Math.sqrt(1-e*e);g.copy(c.object.position).subSelf(c.target);e=c.object.up.clone().setLength(d.y);e.addSelf(c.object.up.clone().crossSelf(g).setLength(d.x));e.addSelf(g.setLength(d.z));return e};
this.rotateCamera=function(){var a=Math.acos(h.dot(i)/h.length()/i.length());if(a){var b=(new THREE.Vector3).cross(h,i).normalize(),d=new THREE.Quaternion,a=a*c.rotateSpeed;d.setFromAxisAngle(b,-a);d.multiplyVector3(g);d.multiplyVector3(c.object.up);d.multiplyVector3(i);if(c.staticMoving)h=i;else{d.setFromAxisAngle(b,a*(c.dynamicDampingFactor-1));d.multiplyVector3(h)}}};this.zoomCamera=function(){var a=1+(l.y-j.y)*c.zoomSpeed;if(a!==1&&a>0){g.multiplyScalar(a);c.staticMoving?j=l:j.y=j.y+(l.y-j.y)*
this.dynamicDampingFactor}};this.panCamera=function(){var a=m.clone().subSelf(o);if(a.lengthSq()){a.multiplyScalar(g.length()*c.panSpeed);var b=g.clone().crossSelf(c.object.up).setLength(a.x);b.addSelf(c.object.up.clone().setLength(a.y));c.object.position.addSelf(b);c.target.addSelf(b);c.staticMoving?o=m:o.addSelf(a.sub(m,o).multiplyScalar(c.dynamicDampingFactor))}};this.checkDistances=function(){if(!c.noZoom||!c.noPan){c.object.position.lengthSq()>c.maxDistance*c.maxDistance&&c.object.position.setLength(c.maxDistance);
g.lengthSq()<c.minDistance*c.minDistance&&c.object.position.add(c.target,g.setLength(c.minDistance))}};this.update=function(){g.copy(c.object.position).subSelf(c.target);c.noRotate||c.rotateCamera();c.noZoom||c.zoomCamera();c.noPan||c.panCamera();c.object.position.add(c.target,g);c.checkDistances();c.object.lookAt(c.target);if(d.distanceToSquared(c.object.position)>0){c.dispatchEvent(p);d.copy(c.object.position)}};this.domElement.addEventListener("contextmenu",function(a){a.preventDefault()},false);
this.domElement.addEventListener("mousemove",function(a){if(c.enabled){if(f){h=i=c.getMouseProjectionOnBall(a.clientX,a.clientY);j=l=c.getMouseOnScreen(a.clientX,a.clientY);o=m=c.getMouseOnScreen(a.clientX,a.clientY);f=false}e!==-1&&(e===0&&!c.noRotate?i=c.getMouseProjectionOnBall(a.clientX,a.clientY):e===1&&!c.noZoom?l=c.getMouseOnScreen(a.clientX,a.clientY):e===2&&!c.noPan&&(m=c.getMouseOnScreen(a.clientX,a.clientY)))}},false);this.domElement.addEventListener("mousedown",function(a){if(c.enabled){a.preventDefault();
a.stopPropagation();if(e===-1){e=a.button;e===0&&!c.noRotate?h=i=c.getMouseProjectionOnBall(a.clientX,a.clientY):e===1&&!c.noZoom?j=l=c.getMouseOnScreen(a.clientX,a.clientY):this.noPan||(o=m=c.getMouseOnScreen(a.clientX,a.clientY))}}},false);this.domElement.addEventListener("mouseup",function(a){if(c.enabled){a.preventDefault();a.stopPropagation();e=-1}},false);window.addEventListener("keydown",function(a){if(c.enabled&&e===-1){a.keyCode===c.keys[0]&&!c.noRotate?e=0:a.keyCode===c.keys[1]&&!c.noZoom?
e=1:a.keyCode===c.keys[2]&&!c.noPan&&(e=2);e!==-1&&(f=true)}},false);window.addEventListener("keyup",function(){c.enabled&&e!==-1&&(e=-1)},false);this.handleResize()};
THREE.OrbitControls=function(a,b){function c(){return 2*Math.PI/60/60*e.autoRotateSpeed}function d(a){a.preventDefault();if(t===s.ROTATE){i.set(a.clientX,a.clientY);j.sub(i,h);e.rotateLeft(2*Math.PI*j.x/g*e.userRotateSpeed);e.rotateUp(2*Math.PI*j.y/g*e.userRotateSpeed);h.copy(i)}else if(t===s.ZOOM){o.set(a.clientX,a.clientY);m.sub(o,l);m.y>0?e.zoomIn():e.zoomOut();l.copy(o)}}function f(){if(e.userRotate){document.removeEventListener("mousemove",d,false);document.removeEventListener("mouseup",f,false);
t=s.NONE}}THREE.EventTarget.call(this);this.object=a;this.domElement=b!==void 0?b:document;this.center=new THREE.Vector3;this.userZoom=true;this.userZoomSpeed=1;this.userRotate=true;this.userRotateSpeed=1;this.autoRotate=false;this.autoRotateSpeed=2;var e=this,g=1800,h=new THREE.Vector2,i=new THREE.Vector2,j=new THREE.Vector2,l=new THREE.Vector2,o=new THREE.Vector2,m=new THREE.Vector2,p=0,q=0,n=1,r=new THREE.Vector3,s={NONE:-1,ROTATE:0,ZOOM:1},t=s.NONE,u={type:"change"};this.rotateLeft=function(a){a===
void 0&&(a=c());q=q-a};this.rotateRight=function(a){a===void 0&&(a=c());q=q+a};this.rotateUp=function(a){a===void 0&&(a=c());p=p-a};this.rotateDown=function(a){a===void 0&&(a=c());p=p+a};this.zoomIn=function(a){a===void 0&&(a=Math.pow(0.95,e.userZoomSpeed));n=n/a};this.zoomOut=function(a){a===void 0&&(a=Math.pow(0.95,e.userZoomSpeed));n=n*a};this.update=function(){var a=this.object.position,b=a.clone().subSelf(this.center),d=Math.atan2(b.x,b.z),e=Math.atan2(Math.sqrt(b.x*b.x+b.z*b.z),b.y);this.autoRotate&&
this.rotateLeft(c());var d=d+q,e=e+p,e=Math.max(1E-6,Math.min(Math.PI-1E-6,e)),f=b.length();b.x=f*Math.sin(e)*Math.sin(d);b.y=f*Math.cos(e);b.z=f*Math.sin(e)*Math.cos(d);b.multiplyScalar(n);a.copy(this.center).addSelf(b);this.object.lookAt(this.center);p=q=0;n=1;if(r.distanceTo(this.object.position)>0){this.dispatchEvent(u);r.copy(this.object.position)}};this.domElement.addEventListener("contextmenu",function(a){a.preventDefault()},false);this.domElement.addEventListener("mousedown",function(a){if(e.userRotate){a.preventDefault();
if(a.button===0||a.button===2){t=s.ROTATE;h.set(a.clientX,a.clientY)}else if(a.button===1){t=s.ZOOM;l.set(a.clientX,a.clientY)}document.addEventListener("mousemove",d,false);document.addEventListener("mouseup",f,false)}},false);this.domElement.addEventListener("mousewheel",function(a){e.userZoom&&(a.wheelDelta>0?e.zoomOut():e.zoomIn())},false)};
THREE.CircleGeometry=function(a,b,c,d){THREE.Geometry.call(this);var a=a||50,c=c!==void 0?c:0,d=d!==void 0?d:Math.PI*2,b=b!==void 0?Math.max(3,b):8,f,e=[];f=new THREE.Vector3;var g=new THREE.UV(0.5,0.5);this.vertices.push(f);e.push(g);for(f=0;f<=b;f++){var h=new THREE.Vector3;h.x=a*Math.cos(c+f/b*d);h.y=a*Math.sin(c+f/b*d);this.vertices.push(h);e.push(new THREE.UV((h.x/a+1)/2,-(h.y/a+1)/2+1))}c=new THREE.Vector3(0,0,-1);for(f=1;f<=b;f++){this.faces.push(new THREE.Face3(f,f+1,0,[c,c,c]));this.faceVertexUvs[0].push([e[f],
e[f+1],g])}this.computeCentroids();this.computeFaceNormals();this.boundingSphere={radius:a}};THREE.CircleGeometry.prototype=Object.create(THREE.Geometry.prototype);
THREE.CubeGeometry=function(a,b,c,d,f,e,g,h){function i(a,b,c,g,h,i,l,m){var n,o=d||1,p=f||1,q=h/2,r=i/2,s=j.vertices.length;if(a==="x"&&b==="y"||a==="y"&&b==="x")n="z";else if(a==="x"&&b==="z"||a==="z"&&b==="x"){n="y";p=e||1}else if(a==="z"&&b==="y"||a==="y"&&b==="z"){n="x";o=e||1}var t=o+1,u=p+1,V=h/o,Q=i/p,L=new THREE.Vector3;L[n]=l>0?1:-1;for(h=0;h<u;h++)for(i=0;i<t;i++){var W=new THREE.Vector3;W[a]=(i*V-q)*c;W[b]=(h*Q-r)*g;W[n]=l;j.vertices.push(W)}for(h=0;h<p;h++)for(i=0;i<o;i++){a=new THREE.Face4(i+
t*h+s,i+t*(h+1)+s,i+1+t*(h+1)+s,i+1+t*h+s);a.normal.copy(L);a.vertexNormals.push(L.clone(),L.clone(),L.clone(),L.clone());a.materialIndex=m;j.faces.push(a);j.faceVertexUvs[0].push([new THREE.UV(i/o,1-h/p),new THREE.UV(i/o,1-(h+1)/p),new THREE.UV((i+1)/o,1-(h+1)/p),new THREE.UV((i+1)/o,1-h/p)])}}THREE.Geometry.call(this);var j=this,l=a/2,o=b/2,m=c/2,p,q,n,r,s,t;if(g!==void 0){if(g instanceof Array)this.materials=g;else{this.materials=[];for(p=0;p<6;p++)this.materials.push(g)}p=0;r=1;q=2;s=3;n=4;t=
5}else this.materials=[];this.sides={px:true,nx:true,py:true,ny:true,pz:true,nz:true};if(h!=void 0)for(var u in h)this.sides[u]!==void 0&&(this.sides[u]=h[u]);this.sides.px&&i("z","y",-1,-1,c,b,l,p);this.sides.nx&&i("z","y",1,-1,c,b,-l,r);this.sides.py&&i("x","z",1,1,a,c,o,q);this.sides.ny&&i("x","z",1,-1,a,c,-o,s);this.sides.pz&&i("x","y",1,-1,a,b,m,n);this.sides.nz&&i("x","y",-1,-1,a,b,-m,t);this.computeCentroids();this.mergeVertices()};THREE.CubeGeometry.prototype=Object.create(THREE.Geometry.prototype);
THREE.CylinderGeometry=function(a,b,c,d,f,e){THREE.Geometry.call(this);var a=a!==void 0?a:20,b=b!==void 0?b:20,c=c!==void 0?c:100,g=c/2,d=d||8,f=f||1,h,i,j=[],l=[];for(i=0;i<=f;i++){var o=[],m=[],p=i/f,q=p*(b-a)+a;for(h=0;h<=d;h++){var n=h/d,r=new THREE.Vector3;r.x=q*Math.sin(n*Math.PI*2);r.y=-p*c+g;r.z=q*Math.cos(n*Math.PI*2);this.vertices.push(r);o.push(this.vertices.length-1);m.push(new THREE.UV(n,1-p))}j.push(o);l.push(m)}c=(b-a)/c;for(h=0;h<d;h++){if(a!==0){o=this.vertices[j[0][h]].clone();m=
this.vertices[j[0][h+1]].clone()}else{o=this.vertices[j[1][h]].clone();m=this.vertices[j[1][h+1]].clone()}o.setY(Math.sqrt(o.x*o.x+o.z*o.z)*c).normalize();m.setY(Math.sqrt(m.x*m.x+m.z*m.z)*c).normalize();for(i=0;i<f;i++){var p=j[i][h],q=j[i+1][h],n=j[i+1][h+1],r=j[i][h+1],s=o.clone(),t=o.clone(),u=m.clone(),z=m.clone(),x=l[i][h].clone(),A=l[i+1][h].clone(),B=l[i+1][h+1].clone(),C=l[i][h+1].clone();this.faces.push(new THREE.Face4(p,q,n,r,[s,t,u,z]));this.faceVertexUvs[0].push([x,A,B,C])}}if(!e&&a>
0){this.vertices.push(new THREE.Vector3(0,g,0));for(h=0;h<d;h++){p=j[0][h];q=j[0][h+1];n=this.vertices.length-1;s=new THREE.Vector3(0,1,0);t=new THREE.Vector3(0,1,0);u=new THREE.Vector3(0,1,0);x=l[0][h].clone();A=l[0][h+1].clone();B=new THREE.UV(A.u,0);this.faces.push(new THREE.Face3(p,q,n,[s,t,u]));this.faceVertexUvs[0].push([x,A,B])}}if(!e&&b>0){this.vertices.push(new THREE.Vector3(0,-g,0));for(h=0;h<d;h++){p=j[i][h+1];q=j[i][h];n=this.vertices.length-1;s=new THREE.Vector3(0,-1,0);t=new THREE.Vector3(0,
-1,0);u=new THREE.Vector3(0,-1,0);x=l[i][h+1].clone();A=l[i][h].clone();B=new THREE.UV(A.u,1);this.faces.push(new THREE.Face3(p,q,n,[s,t,u]));this.faceVertexUvs[0].push([x,A,B])}}this.computeCentroids();this.computeFaceNormals()};THREE.CylinderGeometry.prototype=Object.create(THREE.Geometry.prototype);
THREE.ExtrudeGeometry=function(a,b){if(typeof a!=="undefined"){THREE.Geometry.call(this);a=a instanceof Array?a:[a];this.shapebb=a[a.length-1].getBoundingBox();this.addShapeList(a,b);this.computeCentroids();this.computeFaceNormals()}};THREE.ExtrudeGeometry.prototype=Object.create(THREE.Geometry.prototype);THREE.ExtrudeGeometry.prototype.addShapeList=function(a,b){for(var c=a.length,d=0;d<c;d++)this.addShape(a[d],b)};
THREE.ExtrudeGeometry.prototype.addShape=function(a,b){function c(a,b,c){b||console.log("die");return b.clone().multiplyScalar(c).addSelf(a)}function d(a,b,c){var d=THREE.ExtrudeGeometry.__v1,e=THREE.ExtrudeGeometry.__v2,f=THREE.ExtrudeGeometry.__v3,g=THREE.ExtrudeGeometry.__v4,h=THREE.ExtrudeGeometry.__v5,i=THREE.ExtrudeGeometry.__v6;d.set(a.x-b.x,a.y-b.y);e.set(a.x-c.x,a.y-c.y);d=d.normalize();e=e.normalize();f.set(-d.y,d.x);g.set(e.y,-e.x);h.copy(a).addSelf(f);i.copy(a).addSelf(g);if(h.equals(i))return g.clone();
h.copy(b).addSelf(f);i.copy(c).addSelf(g);f=d.dot(g);g=i.subSelf(h).dot(g);if(f===0){console.log("Either infinite or no solutions!");g===0?console.log("Its finite solutions."):console.log("Too bad, no solutions.")}g=g/f;if(g<0){b=Math.atan2(b.y-a.y,b.x-a.x);a=Math.atan2(c.y-a.y,c.x-a.x);b>a&&(a=a+Math.PI*2);c=(b+a)/2;a=-Math.cos(c);c=-Math.sin(c);return new THREE.Vector2(a,c)}return d.multiplyScalar(g).addSelf(h).subSelf(a).clone()}function f(c,d){var e,f;for(L=c.length;--L>=0;){e=L;f=L-1;f<0&&(f=
c.length-1);for(var g=0,h=m+l*2,g=0;g<h;g++){var i=H*g,j=H*(g+1),o=d+e+i,i=d+f+i,n=d+f+j,j=d+e+j,p=c,q=g,r=h,s=e,v=f,o=o+O,i=i+O,n=n+O,j=j+O;F.faces.push(new THREE.Face4(o,i,n,j,null,null,t));o=u.generateSideWallUV(F,a,p,b,o,i,n,j,q,r,s,v);F.faceVertexUvs[0].push(o)}}}function e(a,b,c){F.vertices.push(new THREE.Vector3(a,b,c))}function g(c,d,e,f){c=c+O;d=d+O;e=e+O;F.faces.push(new THREE.Face3(c,d,e,null,null,s));c=f?u.generateBottomUV(F,a,b,c,d,e):u.generateTopUV(F,a,b,c,d,e);F.faceVertexUvs[0].push(c)}
var h=b.amount!==void 0?b.amount:100,i=b.bevelThickness!==void 0?b.bevelThickness:6,j=b.bevelSize!==void 0?b.bevelSize:i-2,l=b.bevelSegments!==void 0?b.bevelSegments:3,o=b.bevelEnabled!==void 0?b.bevelEnabled:true,m=b.steps!==void 0?b.steps:1,p=b.bendPath,q=b.extrudePath,n,r=false,s=b.material,t=b.extrudeMaterial,u=b.UVGenerator!==void 0?b.UVGenerator:THREE.ExtrudeGeometry.WorldUVGenerator,z,x,A,B;if(q){n=q.getSpacedPoints(m);r=true;o=false;z=b.frames!==void 0?b.frames:new THREE.TubeGeometry.FrenetFrames(q,
m,false);x=new THREE.Vector3;A=new THREE.Vector3;B=new THREE.Vector3}if(!o)j=i=l=0;var C,v,J,F=this,O=this.vertices.length;p&&a.addWrapPath(p);var p=a.extractPoints(),P=p.shape,p=p.holes;if(q=!THREE.Shape.Utils.isClockWise(P)){P=P.reverse();v=0;for(J=p.length;v<J;v++){C=p[v];THREE.Shape.Utils.isClockWise(C)&&(p[v]=C.reverse())}q=false}var G=THREE.Shape.Utils.triangulateShape(P,p),q=P;v=0;for(J=p.length;v<J;v++){C=p[v];P=P.concat(C)}var E,I,R,M,H=P.length,V=G.length,Q=[],L=0,W=q.length;E=W-1;for(I=
L+1;L<W;L++,E++,I++){E===W&&(E=0);I===W&&(I=0);Q[L]=d(q[L],q[E],q[I])}var ha=[],ia,da=Q.concat();v=0;for(J=p.length;v<J;v++){C=p[v];ia=[];L=0;W=C.length;E=W-1;for(I=L+1;L<W;L++,E++,I++){E===W&&(E=0);I===W&&(I=0);ia[L]=d(C[L],C[E],C[I])}ha.push(ia);da=da.concat(ia)}for(E=0;E<l;E++){C=E/l;R=i*(1-C);I=j*Math.sin(C*Math.PI/2);L=0;for(W=q.length;L<W;L++){M=c(q[L],Q[L],I);e(M.x,M.y,-R)}v=0;for(J=p.length;v<J;v++){C=p[v];ia=ha[v];L=0;for(W=C.length;L<W;L++){M=c(C[L],ia[L],I);e(M.x,M.y,-R)}}}I=j;for(L=0;L<
H;L++){M=o?c(P[L],da[L],I):P[L];if(r){A.copy(z.normals[0]).multiplyScalar(M.x);x.copy(z.binormals[0]).multiplyScalar(M.y);B.copy(n[0]).addSelf(A).addSelf(x);e(B.x,B.y,B.z)}else e(M.x,M.y,0)}for(C=1;C<=m;C++)for(L=0;L<H;L++){M=o?c(P[L],da[L],I):P[L];if(r){A.copy(z.normals[C]).multiplyScalar(M.x);x.copy(z.binormals[C]).multiplyScalar(M.y);B.copy(n[C]).addSelf(A).addSelf(x);e(B.x,B.y,B.z)}else e(M.x,M.y,h/m*C)}for(E=l-1;E>=0;E--){C=E/l;R=i*(1-C);I=j*Math.sin(C*Math.PI/2);L=0;for(W=q.length;L<W;L++){M=
c(q[L],Q[L],I);e(M.x,M.y,h+R)}v=0;for(J=p.length;v<J;v++){C=p[v];ia=ha[v];L=0;for(W=C.length;L<W;L++){M=c(C[L],ia[L],I);r?e(M.x,M.y+n[m-1].y,n[m-1].x+R):e(M.x,M.y,h+R)}}}if(o){i=H*0;for(L=0;L<V;L++){h=G[L];g(h[2]+i,h[1]+i,h[0]+i,true)}i=H*(m+l*2);for(L=0;L<V;L++){h=G[L];g(h[0]+i,h[1]+i,h[2]+i,false)}}else{for(L=0;L<V;L++){h=G[L];g(h[2],h[1],h[0],true)}for(L=0;L<V;L++){h=G[L];g(h[0]+H*m,h[1]+H*m,h[2]+H*m,false)}}h=0;f(q,h);h=h+q.length;v=0;for(J=p.length;v<J;v++){C=p[v];f(C,h);h=h+C.length}};
THREE.ExtrudeGeometry.WorldUVGenerator={generateTopUV:function(a,b,c,d,f,e){b=a.vertices[f].x;f=a.vertices[f].y;c=a.vertices[e].x;e=a.vertices[e].y;return[new THREE.UV(a.vertices[d].x,a.vertices[d].y),new THREE.UV(b,f),new THREE.UV(c,e)]},generateBottomUV:function(a,b,c,d,f,e){return this.generateTopUV(a,b,c,d,f,e)},generateSideWallUV:function(a,b,c,d,f,e,g,h){var b=a.vertices[f].x,c=a.vertices[f].y,f=a.vertices[f].z,d=a.vertices[e].x,i=a.vertices[e].y,e=a.vertices[e].z,j=a.vertices[g].x,l=a.vertices[g].y,
g=a.vertices[g].z,o=a.vertices[h].x,m=a.vertices[h].y,a=a.vertices[h].z;return Math.abs(c-i)<0.01?[new THREE.UV(b,1-f),new THREE.UV(d,1-e),new THREE.UV(j,1-g),new THREE.UV(o,1-a)]:[new THREE.UV(c,1-f),new THREE.UV(i,1-e),new THREE.UV(l,1-g),new THREE.UV(m,1-a)]}};THREE.ExtrudeGeometry.__v1=new THREE.Vector2;THREE.ExtrudeGeometry.__v2=new THREE.Vector2;THREE.ExtrudeGeometry.__v3=new THREE.Vector2;THREE.ExtrudeGeometry.__v4=new THREE.Vector2;THREE.ExtrudeGeometry.__v5=new THREE.Vector2;
THREE.ExtrudeGeometry.__v6=new THREE.Vector2;
THREE.LatheGeometry=function(a,b,c){THREE.Geometry.call(this);for(var b=b||12,c=c||2*Math.PI,d=[],f=(new THREE.Matrix4).makeRotationZ(c/b),e=0;e<a.length;e++){d[e]=a[e].clone();this.vertices.push(d[e])}for(var g=b+1,c=0;c<g;c++)for(e=0;e<d.length;e++){d[e]=f.multiplyVector3(d[e].clone());this.vertices.push(d[e])}for(c=0;c<b;c++){d=0;for(f=a.length;d<f-1;d++){this.faces.push(new THREE.Face4(c*f+d,(c+1)%g*f+d,(c+1)%g*f+(d+1)%f,c*f+(d+1)%f));this.faceVertexUvs[0].push([new THREE.UV(1-c/b,d/f),new THREE.UV(1-
(c+1)/b,d/f),new THREE.UV(1-(c+1)/b,(d+1)/f),new THREE.UV(1-c/b,(d+1)/f)])}}this.computeCentroids();this.computeFaceNormals();this.computeVertexNormals()};THREE.LatheGeometry.prototype=Object.create(THREE.Geometry.prototype);
THREE.PlaneGeometry=function(a,b,c,d){THREE.Geometry.call(this);for(var f=a/2,e=b/2,c=c||1,d=d||1,g=c+1,h=d+1,i=a/c,j=b/d,l=new THREE.Vector3(0,0,1),a=0;a<h;a++)for(b=0;b<g;b++)this.vertices.push(new THREE.Vector3(b*i-f,-(a*j-e),0));for(a=0;a<d;a++)for(b=0;b<c;b++){f=new THREE.Face4(b+g*a,b+g*(a+1),b+1+g*(a+1),b+1+g*a);f.normal.copy(l);f.vertexNormals.push(l.clone(),l.clone(),l.clone(),l.clone());this.faces.push(f);this.faceVertexUvs[0].push([new THREE.UV(b/c,1-a/d),new THREE.UV(b/c,1-(a+1)/d),new THREE.UV((b+
1)/c,1-(a+1)/d),new THREE.UV((b+1)/c,1-a/d)])}this.computeCentroids()};THREE.PlaneGeometry.prototype=Object.create(THREE.Geometry.prototype);
THREE.SphereGeometry=function(a,b,c,d,f,e,g){THREE.Geometry.call(this);var a=a||50,d=d!==void 0?d:0,f=f!==void 0?f:Math.PI*2,e=e!==void 0?e:0,g=g!==void 0?g:Math.PI,b=Math.max(3,Math.floor(b)||8),c=Math.max(2,Math.floor(c)||6),h,i,j=[],l=[];for(i=0;i<=c;i++){var o=[],m=[];for(h=0;h<=b;h++){var p=h/b,q=i/c,n=new THREE.Vector3;n.x=-a*Math.cos(d+p*f)*Math.sin(e+q*g);n.y=a*Math.cos(e+q*g);n.z=a*Math.sin(d+p*f)*Math.sin(e+q*g);this.vertices.push(n);o.push(this.vertices.length-1);m.push(new THREE.UV(p,
1-q))}j.push(o);l.push(m)}for(i=0;i<c;i++)for(h=0;h<b;h++){var d=j[i][h+1],f=j[i][h],e=j[i+1][h],g=j[i+1][h+1],o=this.vertices[d].clone().normalize(),m=this.vertices[f].clone().normalize(),p=this.vertices[e].clone().normalize(),q=this.vertices[g].clone().normalize(),n=l[i][h+1].clone(),r=l[i][h].clone(),s=l[i+1][h].clone(),t=l[i+1][h+1].clone();if(Math.abs(this.vertices[d].y)==a){this.faces.push(new THREE.Face3(d,e,g,[o,p,q]));this.faceVertexUvs[0].push([n,s,t])}else if(Math.abs(this.vertices[e].y)==
a){this.faces.push(new THREE.Face3(d,f,e,[o,m,p]));this.faceVertexUvs[0].push([n,r,s])}else{this.faces.push(new THREE.Face4(d,f,e,g,[o,m,p,q]));this.faceVertexUvs[0].push([n,r,s,t])}}this.computeCentroids();this.computeFaceNormals();this.boundingSphere={radius:a}};THREE.SphereGeometry.prototype=Object.create(THREE.Geometry.prototype);
THREE.TextGeometry=function(a,b){var c=THREE.FontUtils.generateShapes(a,b);b.amount=b.height!==void 0?b.height:50;if(b.bevelThickness===void 0)b.bevelThickness=10;if(b.bevelSize===void 0)b.bevelSize=8;if(b.bevelEnabled===void 0)b.bevelEnabled=false;if(b.bend){var d=c[c.length-1].getBoundingBox().maxX;b.bendPath=new THREE.QuadraticBezierCurve(new THREE.Vector2(0,0),new THREE.Vector2(d/2,120),new THREE.Vector2(d,0))}THREE.ExtrudeGeometry.call(this,c,b)};THREE.TextGeometry.prototype=Object.create(THREE.ExtrudeGeometry.prototype);
THREE.TorusGeometry=function(a,b,c,d,f){THREE.Geometry.call(this);this.radius=a||100;this.tube=b||40;this.segmentsR=c||8;this.segmentsT=d||6;this.arc=f||Math.PI*2;f=new THREE.Vector3;a=[];b=[];for(c=0;c<=this.segmentsR;c++)for(d=0;d<=this.segmentsT;d++){var e=d/this.segmentsT*this.arc,g=c/this.segmentsR*Math.PI*2;f.x=this.radius*Math.cos(e);f.y=this.radius*Math.sin(e);var h=new THREE.Vector3;h.x=(this.radius+this.tube*Math.cos(g))*Math.cos(e);h.y=(this.radius+this.tube*Math.cos(g))*Math.sin(e);h.z=
this.tube*Math.sin(g);this.vertices.push(h);a.push(new THREE.UV(d/this.segmentsT,c/this.segmentsR));b.push(h.clone().subSelf(f).normalize())}for(c=1;c<=this.segmentsR;c++)for(d=1;d<=this.segmentsT;d++){var f=(this.segmentsT+1)*c+d-1,e=(this.segmentsT+1)*(c-1)+d-1,g=(this.segmentsT+1)*(c-1)+d,h=(this.segmentsT+1)*c+d,i=new THREE.Face4(f,e,g,h,[b[f],b[e],b[g],b[h]]);i.normal.addSelf(b[f]);i.normal.addSelf(b[e]);i.normal.addSelf(b[g]);i.normal.addSelf(b[h]);i.normal.normalize();this.faces.push(i);this.faceVertexUvs[0].push([a[f].clone(),
a[e].clone(),a[g].clone(),a[h].clone()])}this.computeCentroids()};THREE.TorusGeometry.prototype=Object.create(THREE.Geometry.prototype);
THREE.TorusKnotGeometry=function(a,b,c,d,f,e,g){function h(a,b,c,d,e,f){var g=Math.cos(a);Math.cos(b);b=Math.sin(a);a=c/d*a;c=Math.cos(a);g=e*(2+c)*0.5*g;b=e*(2+c)*b*0.5;e=f*e*Math.sin(a)*0.5;return new THREE.Vector3(g,b,e)}THREE.Geometry.call(this);this.radius=a||200;this.tube=b||40;this.segmentsR=c||64;this.segmentsT=d||8;this.p=f||2;this.q=e||3;this.heightScale=g||1;this.grid=Array(this.segmentsR);c=new THREE.Vector3;d=new THREE.Vector3;f=new THREE.Vector3;for(a=0;a<this.segmentsR;++a){this.grid[a]=
Array(this.segmentsT);for(b=0;b<this.segmentsT;++b){var i=a/this.segmentsR*2*this.p*Math.PI,g=b/this.segmentsT*2*Math.PI,e=h(i,g,this.q,this.p,this.radius,this.heightScale),i=h(i+0.01,g,this.q,this.p,this.radius,this.heightScale);c.sub(i,e);d.add(i,e);f.cross(c,d);d.cross(f,c);f.normalize();d.normalize();i=-this.tube*Math.cos(g);g=this.tube*Math.sin(g);e.x=e.x+(i*d.x+g*f.x);e.y=e.y+(i*d.y+g*f.y);e.z=e.z+(i*d.z+g*f.z);this.grid[a][b]=this.vertices.push(new THREE.Vector3(e.x,e.y,e.z))-1}}for(a=0;a<
this.segmentsR;++a)for(b=0;b<this.segmentsT;++b){var f=(a+1)%this.segmentsR,e=(b+1)%this.segmentsT,c=this.grid[a][b],d=this.grid[f][b],f=this.grid[f][e],e=this.grid[a][e],g=new THREE.UV(a/this.segmentsR,b/this.segmentsT),i=new THREE.UV((a+1)/this.segmentsR,b/this.segmentsT),j=new THREE.UV((a+1)/this.segmentsR,(b+1)/this.segmentsT),l=new THREE.UV(a/this.segmentsR,(b+1)/this.segmentsT);this.faces.push(new THREE.Face4(c,d,f,e));this.faceVertexUvs[0].push([g,i,j,l])}this.computeCentroids();this.computeFaceNormals();
this.computeVertexNormals()};THREE.TorusKnotGeometry.prototype=Object.create(THREE.Geometry.prototype);
THREE.TubeGeometry=function(a,b,c,d,f,e){THREE.Geometry.call(this);this.path=a;this.segments=b||64;this.radius=c||1;this.segmentsRadius=d||8;this.closed=f||false;if(e)this.debug=new THREE.Object3D;this.grid=[];var g,h,e=this.segments+1,i,j,l,o=new THREE.Vector3,m,p,q,b=new THREE.TubeGeometry.FrenetFrames(a,b,f);m=b.tangents;p=b.normals;q=b.binormals;this.tangents=m;this.normals=p;this.binormals=q;for(b=0;b<e;b++){this.grid[b]=[];d=b/(e-1);l=a.getPointAt(d);d=m[b];g=p[b];h=q[b];if(this.debug){this.debug.add(new THREE.ArrowHelper(d,
l,c,255));this.debug.add(new THREE.ArrowHelper(g,l,c,16711680));this.debug.add(new THREE.ArrowHelper(h,l,c,65280))}for(d=0;d<this.segmentsRadius;d++){i=d/this.segmentsRadius*2*Math.PI;j=-this.radius*Math.cos(i);i=this.radius*Math.sin(i);o.copy(l);o.x=o.x+(j*g.x+i*h.x);o.y=o.y+(j*g.y+i*h.y);o.z=o.z+(j*g.z+i*h.z);this.grid[b][d]=this.vertices.push(new THREE.Vector3(o.x,o.y,o.z))-1}}for(b=0;b<this.segments;b++)for(d=0;d<this.segmentsRadius;d++){e=f?(b+1)%this.segments:b+1;o=(d+1)%this.segmentsRadius;
a=this.grid[b][d];c=this.grid[e][d];e=this.grid[e][o];o=this.grid[b][o];m=new THREE.UV(b/this.segments,d/this.segmentsRadius);p=new THREE.UV((b+1)/this.segments,d/this.segmentsRadius);q=new THREE.UV((b+1)/this.segments,(d+1)/this.segmentsRadius);g=new THREE.UV(b/this.segments,(d+1)/this.segmentsRadius);this.faces.push(new THREE.Face4(a,c,e,o));this.faceVertexUvs[0].push([m,p,q,g])}this.computeCentroids();this.computeFaceNormals();this.computeVertexNormals()};THREE.TubeGeometry.prototype=Object.create(THREE.Geometry.prototype);
THREE.TubeGeometry.FrenetFrames=function(a,b,c){new THREE.Vector3;var d=new THREE.Vector3;new THREE.Vector3;var f=[],e=[],g=[],h=new THREE.Vector3,i=new THREE.Matrix4,b=b+1,j,l,o;this.tangents=f;this.normals=e;this.binormals=g;for(j=0;j<b;j++){l=j/(b-1);f[j]=a.getTangentAt(l);f[j].normalize()}e[0]=new THREE.Vector3;g[0]=new THREE.Vector3;a=Number.MAX_VALUE;j=Math.abs(f[0].x);l=Math.abs(f[0].y);o=Math.abs(f[0].z);if(j<=a){a=j;d.set(1,0,0)}if(l<=a){a=l;d.set(0,1,0)}o<=a&&d.set(0,0,1);h.cross(f[0],d).normalize();
e[0].cross(f[0],h);g[0].cross(f[0],e[0]);for(j=1;j<b;j++){e[j]=e[j-1].clone();g[j]=g[j-1].clone();h.cross(f[j-1],f[j]);if(h.length()>1E-4){h.normalize();d=Math.acos(f[j-1].dot(f[j]));i.makeRotationAxis(h,d).multiplyVector3(e[j])}g[j].cross(f[j],e[j])}if(c){d=Math.acos(e[0].dot(e[b-1]));d=d/(b-1);f[0].dot(h.cross(e[0],e[b-1]))>0&&(d=-d);for(j=1;j<b;j++){i.makeRotationAxis(f[j],d*j).multiplyVector3(e[j]);g[j].cross(f[j],e[j])}}};
THREE.PolyhedronGeometry=function(a,b,c,d){function f(a){var b=a.normalize().clone();b.index=i.vertices.push(b)-1;var c=Math.atan2(a.z,-a.x)/2/Math.PI+0.5,a=Math.atan2(-a.y,Math.sqrt(a.x*a.x+a.z*a.z))/Math.PI+0.5;b.uv=new THREE.UV(c,1-a);return b}function e(a,b,c,d){if(d<1){d=new THREE.Face3(a.index,b.index,c.index,[a.clone(),b.clone(),c.clone()]);d.centroid.addSelf(a).addSelf(b).addSelf(c).divideScalar(3);d.normal=d.centroid.clone().normalize();i.faces.push(d);d=Math.atan2(d.centroid.z,-d.centroid.x);
i.faceVertexUvs[0].push([h(a.uv,a,d),h(b.uv,b,d),h(c.uv,c,d)])}else{d=d-1;e(a,g(a,b),g(a,c),d);e(g(a,b),b,g(b,c),d);e(g(a,c),g(b,c),c,d);e(g(a,b),g(b,c),g(a,c),d)}}function g(a,b){o[a.index]||(o[a.index]=[]);o[b.index]||(o[b.index]=[]);var c=o[a.index][b.index];c===void 0&&(o[a.index][b.index]=o[b.index][a.index]=c=f((new THREE.Vector3).add(a,b).divideScalar(2)));return c}function h(a,b,c){c<0&&a.u===1&&(a=new THREE.UV(a.u-1,a.v));b.x===0&&b.z===0&&(a=new THREE.UV(c/2/Math.PI+0.5,a.v));return a}THREE.Geometry.call(this);
for(var c=c||1,d=d||0,i=this,j=0,l=a.length;j<l;j++)f(new THREE.Vector3(a[j][0],a[j][1],a[j][2]));for(var o=[],a=this.vertices,j=0,l=b.length;j<l;j++)e(a[b[j][0]],a[b[j][1]],a[b[j][2]],d);this.mergeVertices();j=0;for(l=this.vertices.length;j<l;j++)this.vertices[j].multiplyScalar(c);this.computeCentroids();this.boundingSphere={radius:c}};THREE.PolyhedronGeometry.prototype=Object.create(THREE.Geometry.prototype);
THREE.IcosahedronGeometry=function(a,b){var c=(1+Math.sqrt(5))/2;THREE.PolyhedronGeometry.call(this,[[-1,c,0],[1,c,0],[-1,-c,0],[1,-c,0],[0,-1,c],[0,1,c],[0,-1,-c],[0,1,-c],[c,0,-1],[c,0,1],[-c,0,-1],[-c,0,1]],[[0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],[1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],[3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],[4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1]],a,b)};THREE.IcosahedronGeometry.prototype=Object.create(THREE.Geometry.prototype);
THREE.OctahedronGeometry=function(a,b){THREE.PolyhedronGeometry.call(this,[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]],[[0,2,4],[0,4,3],[0,3,5],[0,5,2],[1,2,5],[1,5,3],[1,3,4],[1,4,2]],a,b)};THREE.OctahedronGeometry.prototype=Object.create(THREE.Geometry.prototype);THREE.TetrahedronGeometry=function(a,b){THREE.PolyhedronGeometry.call(this,[[1,1,1],[-1,-1,1],[-1,1,-1],[1,-1,-1]],[[2,1,0],[0,3,2],[1,3,0],[2,3,1]],a,b)};THREE.TetrahedronGeometry.prototype=Object.create(THREE.Geometry.prototype);
THREE.ParametricGeometry=function(a,b,c,d){THREE.Geometry.call(this);var f=this.vertices,e=this.faces,g=this.faceVertexUvs[0],d=d===void 0?false:d,h,i,j,l,o=b+1;for(h=0;h<=c;h++){l=h/c;for(i=0;i<=b;i++){j=i/b;j=a(j,l);f.push(j)}}var m,p,q,n;for(h=0;h<c;h++)for(i=0;i<b;i++){a=h*o+i;f=h*o+i+1;l=(h+1)*o+i;j=(h+1)*o+i+1;m=new THREE.UV(i/b,h/c);p=new THREE.UV((i+1)/b,h/c);q=new THREE.UV(i/b,(h+1)/c);n=new THREE.UV((i+1)/b,(h+1)/c);if(d){e.push(new THREE.Face3(a,f,l));e.push(new THREE.Face3(f,j,l));g.push([m,
p,q]);g.push([p,n,q])}else{e.push(new THREE.Face4(a,f,j,l));g.push([m,p,n,q])}}this.computeCentroids();this.computeFaceNormals();this.computeVertexNormals()};THREE.ParametricGeometry.prototype=Object.create(THREE.Geometry.prototype);
THREE.ConvexGeometry=function(a){function b(a){var b=a.length();return new THREE.UV(a.x/b,a.y/b)}THREE.Geometry.call(this);for(var c=[[0,1,2],[0,2,1]],d=3;d<a.length;d++){var f=d,e=a[f].clone(),g=e.length();e.x=e.x+g*(Math.random()-0.5)*2E-6;e.y=e.y+g*(Math.random()-0.5)*2E-6;e.z=e.z+g*(Math.random()-0.5)*2E-6;for(var g=[],h=0;h<c.length;){var i=c[h],j=e,l=a[i[0]],o;o=l;var m=a[i[1]],p=a[i[2]],q=new THREE.Vector3,n=new THREE.Vector3;q.sub(p,m);n.sub(o,m);q.crossSelf(n);q.isZero()||q.normalize();o=
q;l=o.dot(l);if(o.dot(j)>=l){for(j=0;j<3;j++){l=[i[j],i[(j+1)%3]];o=true;for(m=0;m<g.length;m++)if(g[m][0]===l[1]&&g[m][1]===l[0]){g[m]=g[g.length-1];g.pop();o=false;break}o&&g.push(l)}c[h]=c[c.length-1];c.pop()}else h++}for(m=0;m<g.length;m++)c.push([g[m][0],g[m][1],f])}f=0;e=Array(a.length);for(d=0;d<c.length;d++){g=c[d];for(h=0;h<3;h++){if(e[g[h]]===void 0){e[g[h]]=f++;this.vertices.push(a[g[h]])}g[h]=e[g[h]]}}for(d=0;d<c.length;d++)this.faces.push(new THREE.Face3(c[d][0],c[d][1],c[d][2]));for(d=
0;d<this.faces.length;d++){g=this.faces[d];this.faceVertexUvs[0].push([b(this.vertices[g.a]),b(this.vertices[g.b]),b(this.vertices[g.c])])}this.computeCentroids();this.computeFaceNormals();this.computeVertexNormals()};THREE.ConvexGeometry.prototype=Object.create(THREE.Geometry.prototype);
THREE.AxisHelper=function(){THREE.Object3D.call(this);var a=new THREE.Geometry;a.vertices.push(new THREE.Vector3);a.vertices.push(new THREE.Vector3(0,100,0));var b=new THREE.CylinderGeometry(0,5,25,5,1),c;c=new THREE.Line(a,new THREE.LineBasicMaterial({color:16711680}));c.rotation.z=-Math.PI/2;this.add(c);c=new THREE.Mesh(b,new THREE.MeshBasicMaterial({color:16711680}));c.position.x=100;c.rotation.z=-Math.PI/2;this.add(c);c=new THREE.Line(a,new THREE.LineBasicMaterial({color:65280}));this.add(c);
c=new THREE.Mesh(b,new THREE.MeshBasicMaterial({color:65280}));c.position.y=100;this.add(c);c=new THREE.Line(a,new THREE.LineBasicMaterial({color:255}));c.rotation.x=Math.PI/2;this.add(c);c=new THREE.Mesh(b,new THREE.MeshBasicMaterial({color:255}));c.position.z=100;c.rotation.x=Math.PI/2;this.add(c)};THREE.AxisHelper.prototype=Object.create(THREE.Object3D.prototype);
THREE.ArrowHelper=function(a,b,c,d){THREE.Object3D.call(this);d===void 0&&(d=16776960);c===void 0&&(c=20);var f=new THREE.Geometry;f.vertices.push(new THREE.Vector3(0,0,0));f.vertices.push(new THREE.Vector3(0,1,0));this.line=new THREE.Line(f,new THREE.LineBasicMaterial({color:d}));this.add(this.line);f=new THREE.CylinderGeometry(0,0.05,0.25,5,1);this.cone=new THREE.Mesh(f,new THREE.MeshBasicMaterial({color:d}));this.cone.position.set(0,1,0);this.add(this.cone);if(b instanceof THREE.Vector3)this.position=
b;this.setDirection(a);this.setLength(c)};THREE.ArrowHelper.prototype=Object.create(THREE.Object3D.prototype);THREE.ArrowHelper.prototype.setDirection=function(a){var b=(new THREE.Vector3(0,1,0)).crossSelf(a),a=Math.acos((new THREE.Vector3(0,1,0)).dot(a.clone().normalize()));this.matrix=(new THREE.Matrix4).makeRotationAxis(b.normalize(),a);this.rotation.setEulerFromRotationMatrix(this.matrix,this.eulerOrder)};THREE.ArrowHelper.prototype.setLength=function(a){this.scale.set(a,a,a)};
THREE.ArrowHelper.prototype.setColor=function(a){this.line.material.color.setHex(a);this.cone.material.color.setHex(a)};
THREE.CameraHelper=function(a){function b(a,b,d){c(a,d);c(b,d)}function c(a,b){d.lineGeometry.vertices.push(new THREE.Vector3);d.lineGeometry.colors.push(new THREE.Color(b));d.pointMap[a]===void 0&&(d.pointMap[a]=[]);d.pointMap[a].push(d.lineGeometry.vertices.length-1)}THREE.Object3D.call(this);var d=this;this.lineGeometry=new THREE.Geometry;this.lineMaterial=new THREE.LineBasicMaterial({color:16777215,vertexColors:THREE.FaceColors});this.pointMap={};b("n1","n2",16755200);b("n2","n4",16755200);b("n4",
"n3",16755200);b("n3","n1",16755200);b("f1","f2",16755200);b("f2","f4",16755200);b("f4","f3",16755200);b("f3","f1",16755200);b("n1","f1",16755200);b("n2","f2",16755200);b("n3","f3",16755200);b("n4","f4",16755200);b("p","n1",16711680);b("p","n2",16711680);b("p","n3",16711680);b("p","n4",16711680);b("u1","u2",43775);b("u2","u3",43775);b("u3","u1",43775);b("c","t",16777215);b("p","c",3355443);b("cn1","cn2",3355443);b("cn3","cn4",3355443);b("cf1","cf2",3355443);b("cf3","cf4",3355443);this.camera=a;this.update(a);
this.lines=new THREE.Line(this.lineGeometry,this.lineMaterial,THREE.LinePieces);this.add(this.lines)};THREE.CameraHelper.prototype=Object.create(THREE.Object3D.prototype);
THREE.CameraHelper.prototype.update=function(){function a(a,d,f,e){THREE.CameraHelper.__v.set(d,f,e);THREE.CameraHelper.__projector.unprojectVector(THREE.CameraHelper.__v,THREE.CameraHelper.__c);a=b.pointMap[a];if(a!==void 0){d=0;for(f=a.length;d<f;d++)b.lineGeometry.vertices[a[d]].copy(THREE.CameraHelper.__v)}}var b=this;THREE.CameraHelper.__c.projectionMatrix.copy(this.camera.projectionMatrix);a("c",0,0,-1);a("t",0,0,1);a("n1",-1,-1,-1);a("n2",1,-1,-1);a("n3",-1,1,-1);a("n4",1,1,-1);a("f1",-1,-1,
1);a("f2",1,-1,1);a("f3",-1,1,1);a("f4",1,1,1);a("u1",0.7,1.1,-1);a("u2",-0.7,1.1,-1);a("u3",0,2,-1);a("cf1",-1,0,1);a("cf2",1,0,1);a("cf3",0,-1,1);a("cf4",0,1,1);a("cn1",-1,0,-1);a("cn2",1,0,-1);a("cn3",0,-1,-1);a("cn4",0,1,-1);this.lineGeometry.verticesNeedUpdate=true};THREE.CameraHelper.__projector=new THREE.Projector;THREE.CameraHelper.__v=new THREE.Vector3;THREE.CameraHelper.__c=new THREE.Camera;
THREE.SubdivisionModifier=function(a){this.subdivisions=a===void 0?1:a;this.useOldVertexColors=false;this.supportUVs=true;this.debug=false};THREE.SubdivisionModifier.prototype.modify=function(a){for(var b=this.subdivisions;b-- >0;)this.smooth(a)};
THREE.SubdivisionModifier.prototype.smooth=function(a){function b(){l.debug&&console.log.apply(console,arguments)}function c(){console&&console.log.apply(console,arguments)}function d(a,c,d,f,g,h,o){var n=new THREE.Face4(a,c,d,f,null,g.color,g.materialIndex);if(l.useOldVertexColors){n.vertexColors=[];for(var m,p,q,r=0;r<4;r++){q=h[r];m=new THREE.Color;m.setRGB(0,0,0);for(var s=0;s<q.length;s++){p=g.vertexColors[q[s]-1];m.r=m.r+p.r;m.g=m.g+p.g;m.b=m.b+p.b}m.r=m.r/q.length;m.g=m.g/q.length;m.b=m.b/
q.length;n.vertexColors[r]=m}}i.push(n);if(l.supportUVs){g=[e(a,""),e(c,o),e(d,o),e(f,o)];g[0]?g[1]?g[2]?g[3]?j.push(g):b("d :( ",f+":"+o):b("c :( ",d+":"+o):b("b :( ",c+":"+o):b("a :( ",a+":"+o)}}function f(a,b){return Math.min(a,b)+"_"+Math.max(a,b)}function e(a,d){var e=a+":"+d,f=r[e];if(!f){a>=s&&a<s+m.length?b("face pt"):b("edge pt");c("warning, UV not found for",e);return null}return f}function g(a,b,d){var e=a+":"+b;e in r?c("dup vertexNo",a,"oldFaceNo",b,"value",d,"key",e,r[e]):r[e]=d}var h=
[],i=[],j=[],l=this,o=a.vertices,m=a.faces,h=o.concat(),p=[],q={},n={},r={},s=o.length,t,u,z,x,A,B=a.faceVertexUvs[0];b("originalFaces, uvs, originalVerticesLength",m.length,B.length,s);if(l.supportUVs){t=0;for(u=B.length;t<u;t++){z=0;for(x=B[t].length;z<x;z++){A=m[t]["abcd".charAt(z)];g(A,t,B[t][z])}}}if(B.length==0)l.supportUVs=false;t=0;for(var C in r)t++;if(!t){l.supportUVs=false;b("no uvs")}b("-- Original Faces + Vertices UVs completed",r,"vs",B.length);var v;t=0;for(u=m.length;t<u;t++){A=m[t];
p.push(A.centroid);h.push(A.centroid);if(l.supportUVs){v=new THREE.UV;if(A instanceof THREE.Face3){v.u=e(A.a,t).u+e(A.b,t).u+e(A.c,t).u;v.v=e(A.a,t).v+e(A.b,t).v+e(A.c,t).v;v.u=v.u/3;v.v=v.v/3}else if(A instanceof THREE.Face4){v.u=e(A.a,t).u+e(A.b,t).u+e(A.c,t).u+e(A.d,t).u;v.v=e(A.a,t).v+e(A.b,t).v+e(A.c,t).v+e(A.d,t).v;v.u=v.u/4;v.v=v.v/4}g(s+t,"",v)}}b("-- added UVs for new Faces",r);C=function(a,b){J[a]===void 0&&(J[a]=[]);J[a].push(b)};var J={},B=0;for(u=a.faces.length;B<u;B++){A=a.faces[B];
if(A instanceof THREE.Face3){v=f(A.a,A.b);C(v,B);v=f(A.b,A.c);C(v,B);v=f(A.c,A.a);C(v,B)}else if(A instanceof THREE.Face4){v=f(A.a,A.b);C(v,B);v=f(A.b,A.c);C(v,B);v=f(A.c,A.d);C(v,B);v=f(A.d,A.a);C(v,B)}}u=J;var F=0,O,P;C={};B={};for(t in u){v=u[t];O=t.split("_");P=O[0];O=O[1];z=P;A=[P,O];C[z]===void 0&&(C[z]=[]);C[z].push(A);z=O;A=[P,O];C[z]===void 0&&(C[z]=[]);C[z].push(A);z=0;for(x=v.length;z<x;z++){A=v[z];var G=P,E=A,I=t;B[G]===void 0&&(B[G]={});B[G][E]=I;G=O;E=t;B[G]===void 0&&(B[G]={});B[G][A]=
E}v.length<2&&(n[t]=true)}b("vertexEdgeMap",C,"vertexFaceMap",B);for(t in u){v=u[t];A=v[0];x=v[1];O=t.split("_");P=O[0];O=O[1];v=new THREE.Vector3;if(n[t]){v.addSelf(o[P]);v.addSelf(o[O]);v.multiplyScalar(0.5)}else{v.addSelf(p[A]);v.addSelf(p[x]);v.addSelf(o[P]);v.addSelf(o[O]);v.multiplyScalar(0.25)}q[t]=s+m.length+F;h.push(v);F++;if(l.supportUVs){v=new THREE.UV;v.u=e(P,A).u+e(O,A).u;v.v=e(P,A).v+e(O,A).v;v.u=v.u/2;v.v=v.v/2;g(q[t],A,v);if(!n[t]){v=new THREE.UV;v.u=e(P,x).u+e(O,x).u;v.v=e(P,x).v+
e(O,x).v;v.u=v.u/2;v.v=v.v/2;g(q[t],x,v)}}}b("-- Step 2 done");var R,M;O=["123","12","2","23"];x=["123","23","3","31"];var G=["123","31","1","12"],E=["1234","12","2","23"],I=["1234","23","3","34"],H=["1234","34","4","41"],V=["1234","41","1","12"];t=0;for(u=p.length;t<u;t++){A=m[t];v=s+t;if(A instanceof THREE.Face3){F=f(A.a,A.b);P=f(A.b,A.c);R=f(A.c,A.a);d(v,q[F],A.b,q[P],A,O,t);d(v,q[P],A.c,q[R],A,x,t);d(v,q[R],A.a,q[F],A,G,t)}else if(A instanceof THREE.Face4){F=f(A.a,A.b);P=f(A.b,A.c);R=f(A.c,A.d);
M=f(A.d,A.a);d(v,q[F],A.b,q[P],A,E,t);d(v,q[P],A.c,q[R],A,I,t);d(v,q[R],A.d,q[M],A,H,t);d(v,q[M],A.a,q[F],A,V,t)}else b("face should be a face!",A)}q=new THREE.Vector3;A=new THREE.Vector3;t=0;for(u=o.length;t<u;t++)if(C[t]!==void 0){q.set(0,0,0);A.set(0,0,0);P=new THREE.Vector3(0,0,0);v=0;for(z in B[t]){q.addSelf(p[z]);v++}O=0;F=C[t].length;for(z=0;z<F;z++)n[f(C[t][z][0],C[t][z][1])]&&O++;if(O!=2){q.divideScalar(v);for(z=0;z<F;z++){v=C[t][z];v=o[v[0]].clone().addSelf(o[v[1]]).divideScalar(2);A.addSelf(v)}A.divideScalar(F);
P.addSelf(o[t]);P.multiplyScalar(F-3);P.addSelf(q);P.addSelf(A.multiplyScalar(2));P.divideScalar(F);h[t]=P}}a.vertices=h;a.faces=i;a.faceVertexUvs[0]=j;delete a.__tmpVertices;a.computeCentroids();a.computeFaceNormals();a.computeVertexNormals()};THREE.ImmediateRenderObject=function(){THREE.Object3D.call(this);this.render=function(){}};THREE.ImmediateRenderObject.prototype=Object.create(THREE.Object3D.prototype);
THREE.LensFlare=function(a,b,c,d,f){THREE.Object3D.call(this);this.lensFlares=[];this.positionScreen=new THREE.Vector3;this.customUpdateCallback=void 0;a!==void 0&&this.add(a,b,c,d,f)};THREE.LensFlare.prototype=Object.create(THREE.Object3D.prototype);
THREE.LensFlare.prototype.add=function(a,b,c,d,f,e){b===void 0&&(b=-1);c===void 0&&(c=0);e===void 0&&(e=1);f===void 0&&(f=new THREE.Color(16777215));if(d===void 0)d=THREE.NormalBlending;c=Math.min(c,Math.max(0,c));this.lensFlares.push({texture:a,size:b,distance:c,x:0,y:0,z:0,scale:1,rotation:1,opacity:e,color:f,blending:d})};
THREE.LensFlare.prototype.updateLensFlares=function(){var a,b=this.lensFlares.length,c,d=-this.positionScreen.x*2,f=-this.positionScreen.y*2;for(a=0;a<b;a++){c=this.lensFlares[a];c.x=this.positionScreen.x+d*c.distance;c.y=this.positionScreen.y+f*c.distance;c.wantedRotation=c.x*Math.PI*0.25;c.rotation=c.rotation+(c.wantedRotation-c.rotation)*0.25}};
THREE.MorphBlendMesh=function(a,b){THREE.Mesh.call(this,a,b);this.animationsMap={};this.animationsList=[];var c=this.geometry.morphTargets.length;this.createAnimation("__default",0,c-1,c/1);this.setAnimationWeight("__default",1)};THREE.MorphBlendMesh.prototype=Object.create(THREE.Mesh.prototype);
THREE.MorphBlendMesh.prototype.createAnimation=function(a,b,c,d){b={startFrame:b,endFrame:c,length:c-b+1,fps:d,duration:(c-b)/d,lastFrame:0,currentFrame:0,active:false,time:0,direction:1,weight:1,directionBackwards:false,mirroredLoop:false};this.animationsMap[a]=b;this.animationsList.push(b)};
THREE.MorphBlendMesh.prototype.autoCreateAnimations=function(a){for(var b=/([a-z]+)(\d+)/,c,d={},f=this.geometry,e=0,g=f.morphTargets.length;e<g;e++){var h=f.morphTargets[e].name.match(b);if(h&&h.length>1){var i=h[1];d[i]||(d[i]={start:Infinity,end:-Infinity});h=d[i];if(e<h.start)h.start=e;if(e>h.end)h.end=e;c||(c=i)}}for(i in d){h=d[i];this.createAnimation(i,h.start,h.end,a)}this.firstAnimation=c};
THREE.MorphBlendMesh.prototype.setAnimationDirectionForward=function(a){if(a=this.animationsMap[a]){a.direction=1;a.directionBackwards=false}};THREE.MorphBlendMesh.prototype.setAnimationDirectionBackward=function(a){if(a=this.animationsMap[a]){a.direction=-1;a.directionBackwards=true}};THREE.MorphBlendMesh.prototype.setAnimationFPS=function(a,b){var c=this.animationsMap[a];if(c){c.fps=b;c.duration=(c.end-c.start)/c.fps}};
THREE.MorphBlendMesh.prototype.setAnimationDuration=function(a,b){var c=this.animationsMap[a];if(c){c.duration=b;c.fps=(c.end-c.start)/c.duration}};THREE.MorphBlendMesh.prototype.setAnimationWeight=function(a,b){var c=this.animationsMap[a];if(c)c.weight=b};THREE.MorphBlendMesh.prototype.setAnimationTime=function(a,b){var c=this.animationsMap[a];if(c)c.time=b};THREE.MorphBlendMesh.prototype.getAnimationTime=function(a){var b=0;if(a=this.animationsMap[a])b=a.time;return b};
THREE.MorphBlendMesh.prototype.getAnimationDuration=function(a){var b=-1;if(a=this.animationsMap[a])b=a.duration;return b};THREE.MorphBlendMesh.prototype.playAnimation=function(a){var b=this.animationsMap[a];if(b){b.time=0;b.active=true}else console.warn("animation["+a+"] undefined")};THREE.MorphBlendMesh.prototype.stopAnimation=function(a){if(a=this.animationsMap[a])a.active=false};
THREE.MorphBlendMesh.prototype.update=function(a){for(var b=0,c=this.animationsList.length;b<c;b++){var d=this.animationsList[b];if(d.active){var f=d.duration/d.length;d.time=d.time+d.direction*a;if(d.mirroredLoop){if(d.time>d.duration||d.time<0){d.direction=d.direction*-1;if(d.time>d.duration){d.time=d.duration;d.directionBackwards=true}if(d.time<0){d.time=0;d.directionBackwards=false}}}else{d.time=d.time%d.duration;if(d.time<0)d.time=d.time+d.duration}var e=d.startFrame+THREE.Math.clamp(Math.floor(d.time/
f),0,d.length-1),g=d.weight;if(e!==d.currentFrame){this.morphTargetInfluences[d.lastFrame]=0;this.morphTargetInfluences[d.currentFrame]=1*g;this.morphTargetInfluences[e]=0;d.lastFrame=d.currentFrame;d.currentFrame=e}f=d.time%f/f;d.directionBackwards&&(f=1-f);this.morphTargetInfluences[d.currentFrame]=f*g;this.morphTargetInfluences[d.lastFrame]=(1-f)*g}}};
THREE.LensFlarePlugin=function(){function a(a){var c=b.createProgram(),d=b.createShader(b.FRAGMENT_SHADER),e=b.createShader(b.VERTEX_SHADER);b.shaderSource(d,a.fragmentShader);b.shaderSource(e,a.vertexShader);b.compileShader(d);b.compileShader(e);b.attachShader(c,d);b.attachShader(c,e);b.linkProgram(c);return c}var b,c,d,f,e,g,h,i,j,l,o,m,p;this.init=function(q){b=q.context;c=q;d=new Float32Array(16);f=new Uint16Array(6);q=0;d[q++]=-1;d[q++]=-1;d[q++]=0;d[q++]=0;d[q++]=1;d[q++]=-1;d[q++]=1;d[q++]=
0;d[q++]=1;d[q++]=1;d[q++]=1;d[q++]=1;d[q++]=-1;d[q++]=1;d[q++]=0;d[q++]=1;q=0;f[q++]=0;f[q++]=1;f[q++]=2;f[q++]=0;f[q++]=2;f[q++]=3;e=b.createBuffer();g=b.createBuffer();b.bindBuffer(b.ARRAY_BUFFER,e);b.bufferData(b.ARRAY_BUFFER,d,b.STATIC_DRAW);b.bindBuffer(b.ELEMENT_ARRAY_BUFFER,g);b.bufferData(b.ELEMENT_ARRAY_BUFFER,f,b.STATIC_DRAW);h=b.createTexture();i=b.createTexture();b.bindTexture(b.TEXTURE_2D,h);b.texImage2D(b.TEXTURE_2D,0,b.RGB,16,16,0,b.RGB,b.UNSIGNED_BYTE,null);b.texParameteri(b.TEXTURE_2D,
b.TEXTURE_WRAP_S,b.CLAMP_TO_EDGE);b.texParameteri(b.TEXTURE_2D,b.TEXTURE_WRAP_T,b.CLAMP_TO_EDGE);b.texParameteri(b.TEXTURE_2D,b.TEXTURE_MAG_FILTER,b.NEAREST);b.texParameteri(b.TEXTURE_2D,b.TEXTURE_MIN_FILTER,b.NEAREST);b.bindTexture(b.TEXTURE_2D,i);b.texImage2D(b.TEXTURE_2D,0,b.RGBA,16,16,0,b.RGBA,b.UNSIGNED_BYTE,null);b.texParameteri(b.TEXTURE_2D,b.TEXTURE_WRAP_S,b.CLAMP_TO_EDGE);b.texParameteri(b.TEXTURE_2D,b.TEXTURE_WRAP_T,b.CLAMP_TO_EDGE);b.texParameteri(b.TEXTURE_2D,b.TEXTURE_MAG_FILTER,b.NEAREST);
b.texParameteri(b.TEXTURE_2D,b.TEXTURE_MIN_FILTER,b.NEAREST);if(b.getParameter(b.MAX_VERTEX_TEXTURE_IMAGE_UNITS)<=0){j=false;l=a(THREE.ShaderFlares.lensFlare)}else{j=true;l=a(THREE.ShaderFlares.lensFlareVertexTexture)}o={};m={};o.vertex=b.getAttribLocation(l,"position");o.uv=b.getAttribLocation(l,"uv");m.renderType=b.getUniformLocation(l,"renderType");m.map=b.getUniformLocation(l,"map");m.occlusionMap=b.getUniformLocation(l,"occlusionMap");m.opacity=b.getUniformLocation(l,"opacity");m.color=b.getUniformLocation(l,
"color");m.scale=b.getUniformLocation(l,"scale");m.rotation=b.getUniformLocation(l,"rotation");m.screenPosition=b.getUniformLocation(l,"screenPosition");p=false};this.render=function(a,d,f,s){var a=a.__webglFlares,t=a.length;if(t){var u=new THREE.Vector3,z=s/f,x=f*0.5,A=s*0.5,B=16/s,C=new THREE.Vector2(B*z,B),v=new THREE.Vector3(1,1,0),J=new THREE.Vector2(1,1),F=m,B=o;b.useProgram(l);if(!p){b.enableVertexAttribArray(o.vertex);b.enableVertexAttribArray(o.uv);p=true}b.uniform1i(F.occlusionMap,0);b.uniform1i(F.map,
1);b.bindBuffer(b.ARRAY_BUFFER,e);b.vertexAttribPointer(B.vertex,2,b.FLOAT,false,16,0);b.vertexAttribPointer(B.uv,2,b.FLOAT,false,16,8);b.bindBuffer(b.ELEMENT_ARRAY_BUFFER,g);b.disable(b.CULL_FACE);b.depthMask(false);var O,P,G,E,I;for(O=0;O<t;O++){B=16/s;C.set(B*z,B);E=a[O];u.set(E.matrixWorld.elements[12],E.matrixWorld.elements[13],E.matrixWorld.elements[14]);d.matrixWorldInverse.multiplyVector3(u);d.projectionMatrix.multiplyVector3(u);v.copy(u);J.x=v.x*x+x;J.y=v.y*A+A;if(j||J.x>0&&J.x<f&&J.y>0&&
J.y<s){b.activeTexture(b.TEXTURE1);b.bindTexture(b.TEXTURE_2D,h);b.copyTexImage2D(b.TEXTURE_2D,0,b.RGB,J.x-8,J.y-8,16,16,0);b.uniform1i(F.renderType,0);b.uniform2f(F.scale,C.x,C.y);b.uniform3f(F.screenPosition,v.x,v.y,v.z);b.disable(b.BLEND);b.enable(b.DEPTH_TEST);b.drawElements(b.TRIANGLES,6,b.UNSIGNED_SHORT,0);b.activeTexture(b.TEXTURE0);b.bindTexture(b.TEXTURE_2D,i);b.copyTexImage2D(b.TEXTURE_2D,0,b.RGBA,J.x-8,J.y-8,16,16,0);b.uniform1i(F.renderType,1);b.disable(b.DEPTH_TEST);b.activeTexture(b.TEXTURE1);
b.bindTexture(b.TEXTURE_2D,h);b.drawElements(b.TRIANGLES,6,b.UNSIGNED_SHORT,0);E.positionScreen.copy(v);E.customUpdateCallback?E.customUpdateCallback(E):E.updateLensFlares();b.uniform1i(F.renderType,2);b.enable(b.BLEND);P=0;for(G=E.lensFlares.length;P<G;P++){I=E.lensFlares[P];if(I.opacity>0.001&&I.scale>0.001){v.x=I.x;v.y=I.y;v.z=I.z;B=I.size*I.scale/s;C.x=B*z;C.y=B;b.uniform3f(F.screenPosition,v.x,v.y,v.z);b.uniform2f(F.scale,C.x,C.y);b.uniform1f(F.rotation,I.rotation);b.uniform1f(F.opacity,I.opacity);
b.uniform3f(F.color,I.color.r,I.color.g,I.color.b);c.setBlending(I.blending,I.blendEquation,I.blendSrc,I.blendDst);c.setTexture(I.texture,1);b.drawElements(b.TRIANGLES,6,b.UNSIGNED_SHORT,0)}}}}b.enable(b.CULL_FACE);b.enable(b.DEPTH_TEST);b.depthMask(true)}}};
THREE.ShadowMapPlugin=function(){var a,b,c,d,f,e=new THREE.Frustum,g=new THREE.Matrix4,h=new THREE.Vector3,i=new THREE.Vector3;this.init=function(e){a=e.context;b=e;var e=THREE.ShaderLib.depthRGBA,g=THREE.UniformsUtils.clone(e.uniforms);c=new THREE.ShaderMaterial({fragmentShader:e.fragmentShader,vertexShader:e.vertexShader,uniforms:g});d=new THREE.ShaderMaterial({fragmentShader:e.fragmentShader,vertexShader:e.vertexShader,uniforms:g,morphTargets:true});f=new THREE.ShaderMaterial({fragmentShader:e.fragmentShader,
vertexShader:e.vertexShader,uniforms:g,skinning:true});c._shadowPass=true;d._shadowPass=true;f._shadowPass=true};this.render=function(a,c){b.shadowMapEnabled&&b.shadowMapAutoUpdate&&this.update(a,c)};this.update=function(j,l){var o,m,p,q,n,r,s,t,u,z=[];q=0;a.clearColor(1,1,1,1);a.disable(a.BLEND);a.enable(a.CULL_FACE);b.shadowMapCullFrontFaces?a.cullFace(a.FRONT):a.cullFace(a.BACK);b.setDepthTest(true);o=0;for(m=j.__lights.length;o<m;o++){p=j.__lights[o];if(p.castShadow)if(p instanceof THREE.DirectionalLight&&
p.shadowCascade)for(n=0;n<p.shadowCascadeCount;n++){var x;if(p.shadowCascadeArray[n])x=p.shadowCascadeArray[n];else{u=p;s=n;x=new THREE.DirectionalLight;x.isVirtual=true;x.onlyShadow=true;x.castShadow=true;x.shadowCameraNear=u.shadowCameraNear;x.shadowCameraFar=u.shadowCameraFar;x.shadowCameraLeft=u.shadowCameraLeft;x.shadowCameraRight=u.shadowCameraRight;x.shadowCameraBottom=u.shadowCameraBottom;x.shadowCameraTop=u.shadowCameraTop;x.shadowCameraVisible=u.shadowCameraVisible;x.shadowDarkness=u.shadowDarkness;
x.shadowBias=u.shadowCascadeBias[s];x.shadowMapWidth=u.shadowCascadeWidth[s];x.shadowMapHeight=u.shadowCascadeHeight[s];x.pointsWorld=[];x.pointsFrustum=[];t=x.pointsWorld;r=x.pointsFrustum;for(var A=0;A<8;A++){t[A]=new THREE.Vector3;r[A]=new THREE.Vector3}t=u.shadowCascadeNearZ[s];u=u.shadowCascadeFarZ[s];r[0].set(-1,-1,t);r[1].set(1,-1,t);r[2].set(-1,1,t);r[3].set(1,1,t);r[4].set(-1,-1,u);r[5].set(1,-1,u);r[6].set(-1,1,u);r[7].set(1,1,u);x.originalCamera=l;r=new THREE.Gyroscope;r.position=p.shadowCascadeOffset;
r.add(x);r.add(x.target);l.add(r);p.shadowCascadeArray[n]=x;console.log("Created virtualLight",x)}s=p;t=n;u=s.shadowCascadeArray[t];u.position.copy(s.position);u.target.position.copy(s.target.position);u.lookAt(u.target);u.shadowCameraVisible=s.shadowCameraVisible;u.shadowDarkness=s.shadowDarkness;u.shadowBias=s.shadowCascadeBias[t];r=s.shadowCascadeNearZ[t];s=s.shadowCascadeFarZ[t];u=u.pointsFrustum;u[0].z=r;u[1].z=r;u[2].z=r;u[3].z=r;u[4].z=s;u[5].z=s;u[6].z=s;u[7].z=s;z[q]=x;q++}else{z[q]=p;q++}}o=
0;for(m=z.length;o<m;o++){p=z[o];if(!p.shadowMap){p.shadowMap=new THREE.WebGLRenderTarget(p.shadowMapWidth,p.shadowMapHeight,{minFilter:THREE.LinearFilter,magFilter:THREE.LinearFilter,format:THREE.RGBAFormat});p.shadowMapSize=new THREE.Vector2(p.shadowMapWidth,p.shadowMapHeight);p.shadowMatrix=new THREE.Matrix4}if(!p.shadowCamera){if(p instanceof THREE.SpotLight)p.shadowCamera=new THREE.PerspectiveCamera(p.shadowCameraFov,p.shadowMapWidth/p.shadowMapHeight,p.shadowCameraNear,p.shadowCameraFar);else if(p instanceof
THREE.DirectionalLight)p.shadowCamera=new THREE.OrthographicCamera(p.shadowCameraLeft,p.shadowCameraRight,p.shadowCameraTop,p.shadowCameraBottom,p.shadowCameraNear,p.shadowCameraFar);else{console.error("Unsupported light type for shadow");continue}j.add(p.shadowCamera);b.autoUpdateScene&&j.updateMatrixWorld()}if(p.shadowCameraVisible&&!p.cameraHelper){p.cameraHelper=new THREE.CameraHelper(p.shadowCamera);p.shadowCamera.add(p.cameraHelper)}if(p.isVirtual&&x.originalCamera==l){n=l;q=p.shadowCamera;
r=p.pointsFrustum;u=p.pointsWorld;h.set(Infinity,Infinity,Infinity);i.set(-Infinity,-Infinity,-Infinity);for(s=0;s<8;s++){t=u[s];t.copy(r[s]);THREE.ShadowMapPlugin.__projector.unprojectVector(t,n);q.matrixWorldInverse.multiplyVector3(t);if(t.x<h.x)h.x=t.x;if(t.x>i.x)i.x=t.x;if(t.y<h.y)h.y=t.y;if(t.y>i.y)i.y=t.y;if(t.z<h.z)h.z=t.z;if(t.z>i.z)i.z=t.z}q.left=h.x;q.right=i.x;q.top=i.y;q.bottom=h.y;q.updateProjectionMatrix()}q=p.shadowMap;r=p.shadowMatrix;n=p.shadowCamera;n.position.copy(p.matrixWorld.getPosition());
n.lookAt(p.target.matrixWorld.getPosition());n.updateMatrixWorld();n.matrixWorldInverse.getInverse(n.matrixWorld);if(p.cameraHelper)p.cameraHelper.lines.visible=p.shadowCameraVisible;p.shadowCameraVisible&&p.cameraHelper.update();r.set(0.5,0,0,0.5,0,0.5,0,0.5,0,0,0.5,0.5,0,0,0,1);r.multiplySelf(n.projectionMatrix);r.multiplySelf(n.matrixWorldInverse);if(!n._viewMatrixArray)n._viewMatrixArray=new Float32Array(16);if(!n._projectionMatrixArray)n._projectionMatrixArray=new Float32Array(16);n.matrixWorldInverse.flattenToArray(n._viewMatrixArray);
n.projectionMatrix.flattenToArray(n._projectionMatrixArray);g.multiply(n.projectionMatrix,n.matrixWorldInverse);e.setFromMatrix(g);b.setRenderTarget(q);b.clear();u=j.__webglObjects;p=0;for(q=u.length;p<q;p++){s=u[p];r=s.object;s.render=false;if(r.visible&&r.castShadow&&(!(r instanceof THREE.Mesh)||!r.frustumCulled||e.contains(r))){r._modelViewMatrix.multiply(n.matrixWorldInverse,r.matrixWorld);s.render=true}}p=0;for(q=u.length;p<q;p++){s=u[p];if(s.render){r=s.object;s=s.buffer;t=r.customDepthMaterial?
r.customDepthMaterial:r.geometry.morphTargets.length?d:r instanceof THREE.SkinnedMesh?f:c;s instanceof THREE.BufferGeometry?b.renderBufferDirect(n,j.__lights,null,t,s,r):b.renderBuffer(n,j.__lights,null,t,s,r)}}u=j.__webglObjectsImmediate;p=0;for(q=u.length;p<q;p++){s=u[p];r=s.object;if(r.visible&&r.castShadow){r._modelViewMatrix.multiply(n.matrixWorldInverse,r.matrixWorld);b.renderImmediateObject(n,j.__lights,null,c,r)}}}o=b.getClearColor();m=b.getClearAlpha();a.clearColor(o.r,o.g,o.b,m);a.enable(a.BLEND);
b.shadowMapCullFrontFaces&&a.cullFace(a.BACK)}};THREE.ShadowMapPlugin.__projector=new THREE.Projector;
THREE.SpritePlugin=function(){function a(a,b){return b.z-a.z}var b,c,d,f,e,g,h,i,j,l;this.init=function(a){b=a.context;c=a;d=new Float32Array(16);f=new Uint16Array(6);a=0;d[a++]=-1;d[a++]=-1;d[a++]=0;d[a++]=0;d[a++]=1;d[a++]=-1;d[a++]=1;d[a++]=0;d[a++]=1;d[a++]=1;d[a++]=1;d[a++]=1;d[a++]=-1;d[a++]=1;d[a++]=0;d[a++]=1;a=0;f[a++]=0;f[a++]=1;f[a++]=2;f[a++]=0;f[a++]=2;f[a++]=3;e=b.createBuffer();g=b.createBuffer();b.bindBuffer(b.ARRAY_BUFFER,e);b.bufferData(b.ARRAY_BUFFER,d,b.STATIC_DRAW);b.bindBuffer(b.ELEMENT_ARRAY_BUFFER,
g);b.bufferData(b.ELEMENT_ARRAY_BUFFER,f,b.STATIC_DRAW);var a=THREE.ShaderSprite.sprite,m=b.createProgram(),p=b.createShader(b.FRAGMENT_SHADER),q=b.createShader(b.VERTEX_SHADER);b.shaderSource(p,a.fragmentShader);b.shaderSource(q,a.vertexShader);b.compileShader(p);b.compileShader(q);b.attachShader(m,p);b.attachShader(m,q);b.linkProgram(m);h=m;i={};j={};i.position=b.getAttribLocation(h,"position");i.uv=b.getAttribLocation(h,"uv");j.uvOffset=b.getUniformLocation(h,"uvOffset");j.uvScale=b.getUniformLocation(h,
"uvScale");j.rotation=b.getUniformLocation(h,"rotation");j.scale=b.getUniformLocation(h,"scale");j.alignment=b.getUniformLocation(h,"alignment");j.color=b.getUniformLocation(h,"color");j.map=b.getUniformLocation(h,"map");j.opacity=b.getUniformLocation(h,"opacity");j.useScreenCoordinates=b.getUniformLocation(h,"useScreenCoordinates");j.affectedByDistance=b.getUniformLocation(h,"affectedByDistance");j.screenPosition=b.getUniformLocation(h,"screenPosition");j.modelViewMatrix=b.getUniformLocation(h,"modelViewMatrix");
j.projectionMatrix=b.getUniformLocation(h,"projectionMatrix");l=false};this.render=function(d,f,p,q){var d=d.__webglSprites,n=d.length;if(n){var r=i,s=j,t=q/p,p=p*0.5,u=q*0.5,z=true;b.useProgram(h);if(!l){b.enableVertexAttribArray(r.position);b.enableVertexAttribArray(r.uv);l=true}b.disable(b.CULL_FACE);b.enable(b.BLEND);b.depthMask(true);b.bindBuffer(b.ARRAY_BUFFER,e);b.vertexAttribPointer(r.position,2,b.FLOAT,false,16,0);b.vertexAttribPointer(r.uv,2,b.FLOAT,false,16,8);b.bindBuffer(b.ELEMENT_ARRAY_BUFFER,
g);b.uniformMatrix4fv(s.projectionMatrix,false,f._projectionMatrixArray);b.activeTexture(b.TEXTURE0);b.uniform1i(s.map,0);for(var x,A=[],r=0;r<n;r++){x=d[r];if(x.visible&&x.opacity!==0)if(x.useScreenCoordinates)x.z=-x.position.z;else{x._modelViewMatrix.multiply(f.matrixWorldInverse,x.matrixWorld);x.z=-x._modelViewMatrix.elements[14]}}d.sort(a);for(r=0;r<n;r++){x=d[r];if(x.visible&&x.opacity!==0&&x.map&&x.map.image&&x.map.image.width){if(x.useScreenCoordinates){b.uniform1i(s.useScreenCoordinates,1);
b.uniform3f(s.screenPosition,(x.position.x-p)/p,(u-x.position.y)/u,Math.max(0,Math.min(1,x.position.z)))}else{b.uniform1i(s.useScreenCoordinates,0);b.uniform1i(s.affectedByDistance,x.affectedByDistance?1:0);b.uniformMatrix4fv(s.modelViewMatrix,false,x._modelViewMatrix.elements)}f=x.map.image.width/(x.scaleByViewport?q:1);A[0]=f*t*x.scale.x;A[1]=f*x.scale.y;b.uniform2f(s.uvScale,x.uvScale.x,x.uvScale.y);b.uniform2f(s.uvOffset,x.uvOffset.x,x.uvOffset.y);b.uniform2f(s.alignment,x.alignment.x,x.alignment.y);
b.uniform1f(s.opacity,x.opacity);b.uniform3f(s.color,x.color.r,x.color.g,x.color.b);b.uniform1f(s.rotation,x.rotation);b.uniform2fv(s.scale,A);if(x.mergeWith3D&&!z){b.enable(b.DEPTH_TEST);z=true}else if(!x.mergeWith3D&&z){b.disable(b.DEPTH_TEST);z=false}c.setBlending(x.blending,x.blendEquation,x.blendSrc,x.blendDst);c.setTexture(x.map,0);b.drawElements(b.TRIANGLES,6,b.UNSIGNED_SHORT,0)}}b.enable(b.CULL_FACE);b.enable(b.DEPTH_TEST);b.depthMask(true)}}};
THREE.DepthPassPlugin=function(){this.enabled=false;this.renderTarget=null;var a,b,c,d,f=new THREE.Frustum,e=new THREE.Matrix4;this.init=function(e){a=e.context;b=e;var e=THREE.ShaderLib.depthRGBA,f=THREE.UniformsUtils.clone(e.uniforms);c=new THREE.ShaderMaterial({fragmentShader:e.fragmentShader,vertexShader:e.vertexShader,uniforms:f});d=new THREE.ShaderMaterial({fragmentShader:e.fragmentShader,vertexShader:e.vertexShader,uniforms:f,morphTargets:true});c._shadowPass=true;d._shadowPass=true};this.render=
function(a,b){this.enabled&&this.update(a,b)};this.update=function(g,h){var i,j,l,o,m,p;a.clearColor(1,1,1,1);a.disable(a.BLEND);b.setDepthTest(true);b.autoUpdateScene&&g.updateMatrixWorld();if(!h._viewMatrixArray)h._viewMatrixArray=new Float32Array(16);if(!h._projectionMatrixArray)h._projectionMatrixArray=new Float32Array(16);h.matrixWorldInverse.getInverse(h.matrixWorld);h.matrixWorldInverse.flattenToArray(h._viewMatrixArray);h.projectionMatrix.flattenToArray(h._projectionMatrixArray);e.multiply(h.projectionMatrix,
h.matrixWorldInverse);f.setFromMatrix(e);b.setRenderTarget(this.renderTarget);b.clear();p=g.__webglObjects;i=0;for(j=p.length;i<j;i++){l=p[i];m=l.object;l.render=false;if(m.visible&&(!(m instanceof THREE.Mesh)||!m.frustumCulled||f.contains(m))){m._modelViewMatrix.multiply(h.matrixWorldInverse,m.matrixWorld);l.render=true}}i=0;for(j=p.length;i<j;i++){l=p[i];if(l.render){m=l.object;l=l.buffer;m.material&&b.setMaterialFaces(m.material);o=m.customDepthMaterial?m.customDepthMaterial:m.geometry.morphTargets.length?
d:c;l instanceof THREE.BufferGeometry?b.renderBufferDirect(h,g.__lights,null,o,l,m):b.renderBuffer(h,g.__lights,null,o,l,m)}}p=g.__webglObjectsImmediate;i=0;for(j=p.length;i<j;i++){l=p[i];m=l.object;if(m.visible&&m.castShadow){m._modelViewMatrix.multiply(h.matrixWorldInverse,m.matrixWorld);b.renderImmediateObject(h,g.__lights,null,c,m)}}i=b.getClearColor();j=b.getClearAlpha();a.clearColor(i.r,i.g,i.b,j);a.enable(a.BLEND)}};
THREE.ShaderFlares={lensFlareVertexTexture:{vertexShader:"uniform vec3 screenPosition;\nuniform vec2 scale;\nuniform float rotation;\nuniform int renderType;\nuniform sampler2D occlusionMap;\nattribute vec2 position;\nattribute vec2 uv;\nvarying vec2 vUV;\nvarying float vVisibility;\nvoid main() {\nvUV = uv;\nvec2 pos = position;\nif( renderType == 2 ) {\nvec4 visibility = texture2D( occlusionMap, vec2( 0.1, 0.1 ) ) +\ntexture2D( occlusionMap, vec2( 0.5, 0.1 ) ) +\ntexture2D( occlusionMap, vec2( 0.9, 0.1 ) ) +\ntexture2D( occlusionMap, vec2( 0.9, 0.5 ) ) +\ntexture2D( occlusionMap, vec2( 0.9, 0.9 ) ) +\ntexture2D( occlusionMap, vec2( 0.5, 0.9 ) ) +\ntexture2D( occlusionMap, vec2( 0.1, 0.9 ) ) +\ntexture2D( occlusionMap, vec2( 0.1, 0.5 ) ) +\ntexture2D( occlusionMap, vec2( 0.5, 0.5 ) );\nvVisibility = (       visibility.r / 9.0 ) *\n( 1.0 - visibility.g / 9.0 ) *\n(       visibility.b / 9.0 ) *\n( 1.0 - visibility.a / 9.0 );\npos.x = cos( rotation ) * position.x - sin( rotation ) * position.y;\npos.y = sin( rotation ) * position.x + cos( rotation ) * position.y;\n}\ngl_Position = vec4( ( pos * scale + screenPosition.xy ).xy, screenPosition.z, 1.0 );\n}",fragmentShader:"precision mediump float;\nuniform sampler2D map;\nuniform float opacity;\nuniform int renderType;\nuniform vec3 color;\nvarying vec2 vUV;\nvarying float vVisibility;\nvoid main() {\nif( renderType == 0 ) {\ngl_FragColor = vec4( 1.0, 0.0, 1.0, 0.0 );\n} else if( renderType == 1 ) {\ngl_FragColor = texture2D( map, vUV );\n} else {\nvec4 texture = texture2D( map, vUV );\ntexture.a *= opacity * vVisibility;\ngl_FragColor = texture;\ngl_FragColor.rgb *= color;\n}\n}"},
lensFlare:{vertexShader:"uniform vec3 screenPosition;\nuniform vec2 scale;\nuniform float rotation;\nuniform int renderType;\nattribute vec2 position;\nattribute vec2 uv;\nvarying vec2 vUV;\nvoid main() {\nvUV = uv;\nvec2 pos = position;\nif( renderType == 2 ) {\npos.x = cos( rotation ) * position.x - sin( rotation ) * position.y;\npos.y = sin( rotation ) * position.x + cos( rotation ) * position.y;\n}\ngl_Position = vec4( ( pos * scale + screenPosition.xy ).xy, screenPosition.z, 1.0 );\n}",fragmentShader:"precision mediump float;\nuniform sampler2D map;\nuniform sampler2D occlusionMap;\nuniform float opacity;\nuniform int renderType;\nuniform vec3 color;\nvarying vec2 vUV;\nvoid main() {\nif( renderType == 0 ) {\ngl_FragColor = vec4( texture2D( map, vUV ).rgb, 0.0 );\n} else if( renderType == 1 ) {\ngl_FragColor = texture2D( map, vUV );\n} else {\nfloat visibility = texture2D( occlusionMap, vec2( 0.5, 0.1 ) ).a +\ntexture2D( occlusionMap, vec2( 0.9, 0.5 ) ).a +\ntexture2D( occlusionMap, vec2( 0.5, 0.9 ) ).a +\ntexture2D( occlusionMap, vec2( 0.1, 0.5 ) ).a;\nvisibility = ( 1.0 - visibility / 4.0 );\nvec4 texture = texture2D( map, vUV );\ntexture.a *= opacity * visibility;\ngl_FragColor = texture;\ngl_FragColor.rgb *= color;\n}\n}"}};
THREE.ShaderSprite={sprite:{vertexShader:"uniform int useScreenCoordinates;\nuniform int affectedByDistance;\nuniform vec3 screenPosition;\nuniform mat4 modelViewMatrix;\nuniform mat4 projectionMatrix;\nuniform float rotation;\nuniform vec2 scale;\nuniform vec2 alignment;\nuniform vec2 uvOffset;\nuniform vec2 uvScale;\nattribute vec2 position;\nattribute vec2 uv;\nvarying vec2 vUV;\nvoid main() {\nvUV = uvOffset + uv * uvScale;\nvec2 alignedPosition = position + alignment;\nvec2 rotatedPosition;\nrotatedPosition.x = ( cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y ) * scale.x;\nrotatedPosition.y = ( sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y ) * scale.y;\nvec4 finalPosition;\nif( useScreenCoordinates != 0 ) {\nfinalPosition = vec4( screenPosition.xy + rotatedPosition, screenPosition.z, 1.0 );\n} else {\nfinalPosition = projectionMatrix * modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );\nfinalPosition.xy += rotatedPosition * ( affectedByDistance == 1 ? 1.0 : finalPosition.z );\n}\ngl_Position = finalPosition;\n}",
fragmentShader:"precision mediump float;\nuniform vec3 color;\nuniform sampler2D map;\nuniform float opacity;\nvarying vec2 vUV;\nvoid main() {\nvec4 texture = texture2D( map, vUV );\ngl_FragColor = vec4( color * texture.xyz, texture.a * opacity );\n}"}};
// tquery.js - https://github.com/jeromeetienne/tquery - MIT License
/**
 * @fileOverview This file is the core of tQuery library. 
*/

/**
 * Create a tQuery element
 *
 * @class root class
 * 
 * @param {} object
 * @param {THREE.Object3D} rootnode
 * @returns {tQuery.*} the tQuery object created
*/
var tQuery	= function(object, root)
{
	// support for tQuery(geometry, material)
	if( arguments.length === 2 && 
			(arguments[0] instanceof THREE.Geometry
				|| arguments[0] instanceof THREE.BufferGeometry
				|| arguments[0] instanceof tQuery.Geometry)
			&& 
			(arguments[1] instanceof THREE.Material || arguments[1] instanceof tQuery.Material)
			){
		var tGeometry	= arguments[0] instanceof tQuery.Geometry ? arguments[0].get(0) : arguments[0];
		var tMaterial	= arguments[1] instanceof tQuery.Material ? arguments[1].get(0) : arguments[1];
		var tMesh	= new THREE.Mesh(tGeometry, tMaterial);
		return tQuery( tMesh );
	}

// TODO make tthat cleaner
// - there is a list of functions registered by each plugins
//   - handle() object instanceof THREE.Mesh
//   - create() return new tQuery(object)
// - this list is processed in order here

	// if the object is an array, compare only the first element
	// - up to the subconstructor to check if the whole array has proper type
	var instance	= Array.isArray(object) ? object[0] : object;

	if( instance instanceof THREE.Mesh  && tQuery.Mesh){
		return new tQuery.Mesh(object);
	}else if( instance instanceof THREE.DirectionalLight && tQuery.DirectionalLight){
		return new tQuery.DirectionalLight(object);
	}else if( instance instanceof THREE.AmbientLight && tQuery.AmbientLight){
		return new tQuery.AmbientLight(object);
	}else if( instance instanceof THREE.Light && tQuery.Light){
		return new tQuery.Light(object);

	}else if( instance instanceof THREE.Object3D  && tQuery.Object3D){
		return new tQuery.Object3D(object);
	}else if( instance instanceof THREE.Geometry && tQuery.Geometry){
		return new tQuery.Geometry(object);
	}else if( instance instanceof THREE.Material && tQuery.Material){
		return new tQuery.Material(object);
	}else if( typeof instance === "string" && tQuery.Object3D){
		return new tQuery.Object3D(object, root);
	}else{
		console.assert(false, "unsupported type")
	}
	return undefined;
};

/**
 * The version of tQuery
*/
tQuery.VERSION	= "r50";

//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

/**
 * generic getter/setter
 * 
 * @param {Object} object the object in which store the data
 * @param {String} key the key/name of the data to get/set
 * @param {*} value the value to set (optional)
 * @param {Boolean} mustNotExist if true, ensure that the key doesnt already exist, optional default to false
 * 
 * @returns {*} return the value stored in this object for this key
*/
tQuery.data	= function(object, key, value, mustNotExist)
{
	// sanity check
	console.assert( object, 'invalid parameters' );
	console.assert( typeof key === 'string', 'invalid parameters');

	// init _tqData
	object['_tqData']	= object['_tqData']	|| {};
	// honor mustNotExist
	if( mustNotExist ){
		console.assert(object['_tqData'][key] === undefined, "This key already exists "+key);
	}
	// set the value if any
	if( value ){
		object['_tqData'][key]	= value;
	}
	// return the value
	return object['_tqData'][key];
};

/**
 * Same as jQuery.removeData()
 *
 * @param {Boolean} mustExist if true, ensure the key does exist, default to false
*/
tQuery.removeData	= function(object, key, mustExist)
{
	// handle the 'key as Array' case
	if( key instanceof Array ){
		key.forEach(function(key){
			tQuery.removeData(object, key);
		})
		return;
	}
	// sanity check
	console.assert( typeof key === "string");
	// honor mustNotExist
	if( mustExist ){
		console.assert(object['_tqData'][key] !== undefined, "This key doesnt already exists "+key);
	}
	// do delete the key
	delete object['_tqData'][key];
	// TOTO remove object[_tqData] if empty now
}


//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

/**
 * loop over a Array.
 * 
 * @param {Array} arr the array to traverse.
 * @param {Function} callback the function to notify. function(element){ }.
 * 			loop interrupted if it returns false
 * 
 * @returns {Boolean} return true if completed, false if interrupted
*/
tQuery.each	= function(arr, callback){
	for(var i = 0; i < arr.length; i++){
		var keepLooping	= callback(arr[i])
		if( keepLooping === false )	return false;
	}
	return true;
};

/**
 * precise version of Date.now() -
 * It provide submillisecond precision based on window.performance.now() when 
 * available, fall back on Date.now()
 * see http://updates.html5rocks.com/2012/05/requestAnimationFrame-API-now-with-sub-millisecond-precision 
*/
tQuery.now	= (function(){
	var p			= window.performance	|| {};
	if( p.now )		return function(){ return p.timing.navigationStart + p.now();		};
	else if( p.mozNow )	return function(){ return p.timing.navigationStart + p.mozNow();	};
	else if( p.webkitNow)	return function(){ return p.timing.navigationStart + p.webkitNow()	};
	else if( p.mskitNow)	return function(){ return p.timing.navigationStart + p.msNow()		};
	else if( p.okitNow)	return function(){ return p.timing.navigationStart + p.oNow()		};
	else			return function(){ return Date.now;					};	
})();


/**
 * Make a child Class inherit from the parent class.
 *
 * @param {Object} childClass the child class which gonna inherit
 * @param {Object} parentClass the class which gonna be inherited
*/
tQuery.inherit	= function(childClass, parentClass){
	// trick to avoid calling parentClass constructor
	var tempFn		= function() {};
	tempFn.prototype	= parentClass.prototype;
	childClass.prototype	= new tempFn();


	childClass.parent	= parentClass.prototype;
	childClass.prototype.constructor= childClass;	
};

/**
 * extend function. mainly aimed at handling default values - jme: im not sure at all it is the proper one.
 * http://jsapi.info/_/extend
 * similar to jquery one but much smaller
*/
tQuery.extend = function(obj, base, deep){
	// handle parameter polymorphism
	deep		= deep !== undefined ? deep	: true;
	var extendFn	= deep ? deepExtend : shallowExtend;
	var result	= {};
	base	&& extendFn(result, base);
	obj	&& extendFn(result, obj);
	return result;
	
	function shallowExtend(dst, src){
		Object.keys(src).forEach(function(key){
			dst[key]	= src[key];
		})
	};
	// from http://andrewdupont.net/2009/08/28/deep-extending-objects-in-javascript/
	function deepExtend(dst, src){
		for (var property in src) {
			if (src[property] && src[property].constructor && src[property].constructor === Object) {
				dst[property] = dst[property] || {};
				arguments.callee(dst[property], src[property]);
			} else {
				dst[property] = src[property];
			}
		}
		return dst;
	};
};

//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

/**
 * Make an object pluginable
 * 
 * @param {Object} object the object on which you mixin function
 * @param {Object} dest the object in which to register the plugin
 * @param {string} suffix the suffix to add to the function name
*/
tQuery._pluginsOn	= function(object, dest, fnNameSuffix){
	dest		= dest	|| object.prototype || object;
	fnNameSuffix	= fnNameSuffix || '';
	object['register'+fnNameSuffix]		= function(name, funct) {
		if( dest[name] ){
			throw new Error('Conflict! Already method called: ' + name);
		}
		dest[name]	= funct;
	};
	object['unregister'+fnNameSuffix]	= function(name){
		if( dest.hasOwnProperty(name) === false ){
			throw new Error('Plugin not found: ' + name);
		}
		delete dest[name];
	};
	object['registered'+fnNameSuffix]	= function(name){
		return dest.hasOwnProperty(name) === true;
	}
};

tQuery.pluginsInstanceOn= function(klass){ return tQuery._pluginsOn(klass);			};
tQuery.pluginsStaticOn	= function(klass){ return tQuery._pluginsOn(klass, klass, 'Static');	};

/** for backward compatibility only */
tQuery.pluginsOn	= function(object, dest){
	console.warn("tQuery.pluginsOn is obsolete. prefere .pluginsInstanceOn, .pluginsStaticOn");
	console.trace();
	return tQuery._pluginsOn(object, dest)
}
// make it pluginable
tQuery.pluginsOn(tQuery, tQuery);


//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

tQuery.mixinAttributes	= function(dstObject, properties){
	// mixin the new property
	// FIXME the inheritance should work now... not sure
	dstObject.prototype._attrProps	= tQuery.extend(dstObject.prototype._attrProps, properties);

	dstObject.prototype.attr	= function(name, value){
		// handle parameters
		if( name instanceof Object && value === undefined ){
			Object.keys(name).forEach(function(key){
				this.attr(key, name[key]);
			}.bind(this));
		}else if( typeof(name) === 'string' ){
			console.assert( Object.keys(this._attrProps).indexOf(name) !== -1, 'invalid property name:'+name);
		}else	console.assert(false, 'invalid parameter');

		// handle setter
		if( value !== undefined ){
			var convertFn	= this._attrProps[name];
			value		= convertFn(value);
			this.each(function(element){
				element[name]	= value;
			})
			return this;			
		}
		// handle getter
		if( this.length === 0 )	return undefined
		var element	= this.get(0);
		return element[name];
	};

	// add shortcuts
	Object.keys(properties).forEach(function(name){
		dstObject.prototype[name]	= function(value){
			return this.attr(name, value);
		};
	}.bind(this));
};

//////////////////////////////////////////////////////////////////////////////////
//		put some helpers						//
//////////////////////////////////////////////////////////////////////////////////

/**
 * Flow control - from https://github.com/jeromeetienne/gowiththeflow.js
*/
tQuery.Flow	= function(){
	var self, stack = [], timerId = setTimeout(function(){ timerId = null; self._next(); }, 0);
	return self = {
		destroy	: function(){ timerId && clearTimeout(timerId);	},
		par	: function(callback, isSeq){
			if(isSeq || !(stack[stack.length-1] instanceof Array)) stack.push([]);
			stack[stack.length-1].push(callback);
			return self;
		},seq	: function(callback){ return self.par(callback, true);	},
		_next	: function(err, result){
			var errors = [], results = [], callbacks = stack.shift() || [], nbReturn = callbacks.length, isSeq = nbReturn == 1;
			callbacks && callbacks.forEach(function(fct, index){
				fct(function(error, result){
					errors[index]	= error;
					results[index]	= result;		
					if(--nbReturn == 0)	self._next(isSeq?errors[0]:errors, isSeq?results[0]:results)
				}, err, result)
			})
		}
	}
};

/**
 * microevents.js - https://github.com/jeromeetienne/microevent.js
*/
tQuery.MicroeventMixin	= function(destObj){
	var bind	= function(event, fct){
		if(this._events === undefined) 	this._events	= {};
		this._events[event] = this._events[event]	|| [];
		this._events[event].push(fct);
		return fct;
	};
	var unbind	= function(event, fct){
		if(this._events === undefined) 	this._events	= {};
		if( event in this._events === false  )	return;
		this._events[event].splice(this._events[event].indexOf(fct), 1);
	};
	var trigger	= function(event /* , args... */){
		if(this._events === undefined) 	this._events	= {};
		if( this._events[event] === undefined )	return;
		var tmpArray	= this._events[event].slice(); 
		for(var i = 0; i < tmpArray.length; i++){
			tmpArray[i].apply(this, Array.prototype.slice.call(arguments, 1))
		}
	};
	
	// backward compatibility
	destObj.bind	= bind;
	destObj.unbind	= unbind;
	destObj.trigger	= trigger;

	destObj.addEventListener	= function(event, fct){
		this.bind(event, fct)
		return this;	// for chained API
	}
	destObj.removeEventListener	= function(event, fct){
		this.unbind(event, fct)
		return this;	// for chained API
	}
	destObj.dispatchEvent		= function(event /* , args... */){
		this.trigger.apply(this, arguments)
		return this;
	}
};

tQuery.convert	= {};

/**
 * Convert the value into a THREE.Color object
 * 
 * @return {THREE.Color} the resulting color
*/
tQuery.convert.toThreeColor	= function(value){
	if( arguments.length === 1 && typeof(value) === 'number'){
		return new THREE.Color(value);
	}else if( arguments.length === 1 && value instanceof THREE.Color ){
		return value;
	}else{
		console.assert(false, "invalid parameter");
	}
	return undefined;	// never reached - just to workaround linter complaint
};

tQuery.convert.toNumber	= function(value){
	if( arguments.length === 1 && typeof(value) === 'number'){
		return value;
	}else{
		console.assert(false, "invalid parameter");
	}
	return undefined;	// never reached - just to workaround linter complaint
};

tQuery.convert.toNumberZeroToOne	= function(value){
	if( arguments.length === 1 && typeof(value) === 'number'){
		value	= Math.min(value, 1.0);
		value	= Math.max(value, 0);
		return value;
	}else{
		console.assert(false, "invalid parameter");
	}
	return undefined;	// never reached - just to workaround linter complaint
};

tQuery.convert.toInteger	= function(value){
	if( arguments.length === 1 && typeof(value) === 'number'){
		value	= Math.floor(value);
		return value;
	}else{
		console.assert(false, "invalid parameter");
	}
	return undefined;	// never reached - just to workaround linter complaint
};

tQuery.convert.identity	= function(value){
	return value;
};

tQuery.convert.toBoolean	= function(value){
	if( arguments.length === 1 && typeof(value) === 'boolean'){
		return value;
	}else{
		console.assert(false, "invalid parameter");
	}
	return undefined;	// never reached - just to workaround linter complaint
};

tQuery.convert.toString	= function(value){
	if( arguments.length === 1 && typeof(value) === 'string'){
		return value;
	}else{
		console.assert(false, "invalid parameter");
	}
	return undefined;	// never reached - just to workaround linter complaint
};

tQuery.convert.toTexture	= function(value){
	if( arguments.length === 1 && value instanceof THREE.Texture ){
		return value;
	}else if( arguments.length === 1 && typeof(value) === 'string' ){
		return THREE.ImageUtils.loadTexture(value);
	}else if( arguments.length === 1 && (value instanceof Image || value instanceof HTMLCanvasElement) ){
		var texture		= new THREE.Texture( value );
		texture.needsUpdate	= true;
		return texture;
	}else{
		console.assert(false, "invalid parameter");
	}
	return undefined;	// never reached - just to workaround linter complaint
};
/**
 * implementation of the tQuery.Node
 *
 * @class base class for tQuery objects
 *
 * @param {Object} object an instance or an array of instance
*/
tQuery.Node	= function(object)
{
	// handle parameters
	if( object instanceof Array )	this._lists	= object;
	else if( !object )		this._lists	= [];
	else				this._lists	= [object];
	this.length	= this._lists.length;
};

//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

/**
 * Retrieve the elements matched by the tQuery object
 * 
 * @param {Function} callback the function to notify. function(element){ }.
 * 			loop interrupted if it returns false
 * 
 * @returns {Boolean} return true if completed, false if interrupted
*/
tQuery.Node.prototype.get	= function(idx)
{
	if( idx === undefined )	return this._lists;
	// sanity check - it MUST be defined
	console.assert(this._lists[idx], "element not defined");
	return this._lists[idx];
};

/**
 * loop over element
 * 
 * @param {Function} callback the function to notify. function(element){ }.
 * 			loop interrupted if it returns false
 * 
 * @returns {Boolean} return true if completed, false if interrupted
*/
tQuery.Node.prototype.each	= function(callback)
{
	return tQuery.each(this._lists, callback)
};

/**
 * getter/setter of the back pointer
 *
 * @param {Object} back the value to return when .back() is called. optional
*/
tQuery.Node.prototype.back	= function(value)
{
	if( value  === undefined )	return this._back;
	this._back	= value;
	return this;
};

//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

/**
 * same as .data() in jquery
*/
tQuery.Node.prototype.data	= function(key, value)
{
	// handle the setter case
	if( value ){
		this.each(function(element){
			tQuery.data(element, key, value);
		});
		return this;	// for chained API
	}
	// return the value of the first element
	if( this.length > 0 )	return tQuery.data(this.get(0), key)
	// return undegined if the list is empty
	console.assert(this.length === 0);
	return undefined
}


/**
 * same as .data() in jquery
*/
tQuery.Node.prototype.removeData	= function(key)
{
	this.each(function(element){
		tQuery.removeData(element, key);
	});
	return this;	// for chained API
}/**
 * Handle object3D
 *
 * @class include THREE.Object3D
 *
 * @param {} object
 * @param {THREE.Object3D} rootnode
 * @returns {tQuery.*} the tQuery object created
*/
tQuery.Object3D	= function(object, root)
{
	// handle the case of selector
	if( typeof object === "string" ){
		object	= tQuery.Object3D._select(object, root);
	}

	// call parent ctor
	tQuery.Object3D.parent.constructor.call(this, object)

	// sanity check - all items MUST be THREE.Object3D
	this._lists.forEach(function(item){ console.assert(item instanceof THREE.Object3D); });
};

/**
 * inherit from tQuery.Node
*/
tQuery.inherit(tQuery.Object3D, tQuery.Node);

/**
 * Make it pluginable
*/
tQuery.pluginsInstanceOn(tQuery.Object3D);

/**
 * define all acceptable attributes for this class
*/
tQuery.mixinAttributes(tQuery.Object3D, {
	eulerOrder		: tQuery.convert.toString,
	
	doubleSided		: tQuery.convert.toBoolean,
	flipSided		: tQuery.convert.toBoolean,
	
	rotationAutoUpdate	: tQuery.convert.toBoolean,
	matrixAutoUpdate	: tQuery.convert.toBoolean,
	matrixWorldNeedsUpdate	: tQuery.convert.toBoolean,
	useQuaternion		: tQuery.convert.toBoolean,

	visible			: tQuery.convert.toBoolean,

	receiveShadow		: tQuery.convert.toBoolean,
	castShadow		: tQuery.convert.toBoolean
});

/**
 * Traverse the hierarchy of Object3D. 
 * 
 * @returns {tQuery.Object3D} return the tQuery.Object3D itself
*/
tQuery.Object3D.prototype.traverseHierarchy	= function(callback){
	this.each(function(object3d){
		THREE.SceneUtils.traverseHierarchy(object3d, function(object3d){
			callback(object3d);
		});
	});
	return this;	// for chained API
};


//////////////////////////////////////////////////////////////////////////////////
//		geometry and material						//
//////////////////////////////////////////////////////////////////////////////////

/**
 * get geometry.
 *
 * TODO this should be move in tQuery.Mesh
 * 
 * @returns {tQuery.Geometry} return the geometries from the tQuery.Object3D
*/
tQuery.Object3D.prototype.geometry	= function(value){
	var geometries	= [];
	this.each(function(object3d){
		geometries.push(object3d.geometry)
	});
	return new tQuery.Geometry(geometries).back(this);
};

/**
 * get material.
 * 
 * TODO this should be move in tQuery.Mesh
 * 
 * @returns {tQuery.Material} return the materials from the tQuery.Object3D
*/
tQuery.Object3D.prototype.material	= function(){
	var materials	= [];
	this.each(function(object3d){
		materials.push(object3d.material)
	});
	return new tQuery.Material(materials);
};


/**
 * Clone a Object3D
*/
tQuery.Object3D.prototype.clone	= function(){
	var clones	= [];
	this._lists.forEach(function(object3d){
		var clone	= THREE.SceneUtils.cloneObject(object3d)
		clones.push(clone);
	})  
	return tQuery(clones)
}

//////////////////////////////////////////////////////////////////////////////////
//			addTo/removeFrom tQuery.World/tQuery.Object3d		//
//////////////////////////////////////////////////////////////////////////////////

/**
 * add all matched elements to a world
 * 
 * @param {tQuery.World or tQuery.Object3D} target object to which add it
 * @returns {tQuery.Object3D} chained API
*/
tQuery.Object3D.prototype.addTo	= function(target)
{
	console.assert( target instanceof tQuery.World || target instanceof tQuery.Object3D || target instanceof THREE.Object3D )
	this.each(function(object3d){
		target.add(object3d)
	}.bind(this));
	return this;
}

/**
 * remove all matched elements from a world
 * 
 * @param {tQuery.World or tQuery.Object3D} target object to which add it
 * @returns {tQuery.Object3D} chained API
*/
tQuery.Object3D.prototype.removeFrom	= function(target)
{
	console.assert( target instanceof tQuery.World || target instanceof tQuery.Object3D )
	this.each(function(object3d){
		target.remove(object3d)
	}.bind(this));
	return this;
}

/**
 * remove an element from the parent to which it is attached
 * 
 * @returns {tQuery.Object3D} chained API
*/
tQuery.Object3D.prototype.detach	= function()
{
	this.each(function(object3D){
		if( !object3D.parent )	return;
		object3D.parent.remove(object3D)
	}.bind(this));
	return this;
}

//////////////////////////////////////////////////////////////////////////////////
//			addTo/removeFrom tQuery.World/tQuery.Object3d		//
//////////////////////////////////////////////////////////////////////////////////

/**
 * add all matched elements to a world
 * 
 * @param {tQuery.Object3D} target object to which add it
 * @returns {tQuery.Object3D} chained API
*/
tQuery.Object3D.prototype.add	= function(object3d)
{
	if( object3d instanceof tQuery.Object3D ){
		this.each(function(object1){
			object3d.each(function(object2){
				object1.add(object2);
			})
		}.bind(this));
	}else if( object3d instanceof THREE.Object3D ){
		this.each(function(object1){
			object1.add(object3d);
		});
	}else	console.assert(false, "invalid parameter");
	return this;
}

/**
 * remove all matched elements from a world
 * 
 * @param {tQuery.Object3D} object3d the object to add in this object
 * @returns {tQuery.Object3D} chained API
*/
tQuery.Object3D.prototype.remove	= function(tqObject3d)
{
	console.assert( tqObject3d instanceof tQuery.Object3D )
	this.each(function(object1){
		tqObject3d.each(function(object2){
			object1.remove(object2);
		})
	}.bind(this));
	return this;
}


//////////////////////////////////////////////////////////////////////////////////
//		Handle dom attribute						//
//////////////////////////////////////////////////////////////////////////////////

/**
 * Getter/Setter for the id of the matched elements
*/
tQuery.Object3D.prototype.id	= function(value)
{
	// sanity check 
	console.assert(this.length <= 1, "tQuery.Object3D.id used on multi-elements" );
	if( value !== undefined ){
		if( this.length > 0 ){
			var object3d	= this.get(0);
			object3d._tqId	= value;
		}
		return this;
	}else{
		if( this.length > 0 ){
			var object3d	= this.get(0);
			return object3d._tqId;
		}
		return undefined;
	}
};

/**
 * add a class to all matched elements
 * 
 * @param {string} className the name of the class to add
 * @returns {tQuery.Object3D} chained API
*/
tQuery.Object3D.prototype.addClass	= function(className){
	this.each(function(tObject3d){
		// init ._tqClasses if needed
		tObject3d._tqClasses	= tObject3d._tqClasses	|| '';

		if( tQuery.Object3D._hasClassOne(tObject3d, className) )	return;
		
		tObject3d._tqClasses	+= ' '+className;
	}.bind(this));
	return this;
};

/**
 * remove a class to all matched elements
 * 
 * @param {string} className the name of the class to remove
 * @returns {tQuery.Object3D} chained API
*/
tQuery.Object3D.prototype.removeClass	= function(className){
	this.each(function(tObject3d){
		tQuery.Object3D._removeClassOne(tObject3d, className);
	}.bind(this));
	return this;	// for chained api
};

/**
 * return true if any of the matched elements has this class
 *
 * @param {string} className the name of the class
 * @returns {tQuery.Object3D} true if any of the matched elements has this class, false overwise
*/
tQuery.Object3D.prototype.hasClass	= function(className){
	var completed	= this.each(function(object3d){
		// init ._tqClasses if needed
		object3d._tqClasses	= object3d._tqClasses	|| '';

		var hasClass	= tQuery.Object3D._hasClassOne(object3d, className);
		return hasClass ? false : true;
	}.bind(this));
	return completed ? false : true;
};

tQuery.Object3D._hasClassOne	= function(object3d, className){
	if( object3d._tqClasses === undefined )	return false;
	var classes	= object3d._tqClasses;
	var re		= new RegExp('(^| |\t)+('+className+')($| |\t)+');
	return classes.match(re) ? true : false;
};

tQuery.Object3D._removeClassOne	= function(object3d, className){
	if( object3d._tqClasses === undefined )	return;
	var re		= new RegExp('(^| |\t)('+className+')($| |\t)');
	object3d._tqClasses	= object3d._tqClasses.replace(re, ' ');
};

//////////////////////////////////////////////////////////////////////////////////
//			handling selection					//
//////////////////////////////////////////////////////////////////////////////////

tQuery.Object3D._select	= function(selector, root){
	// handle parameter
	root		= root	|| tQuery.world.tScene();
	if( root instanceof tQuery.Object3D )	root	= root.get(0)
	var selectItems	= selector.split(' ').filter(function(v){ return v.length > 0;})
	
	// sanity check
	console.assert(root instanceof THREE.Object3D);

	var lists	= [];
	root.children.forEach(function(child){
		var nodes	= this._crawls(child, selectItems);
		// FIXME reallocate the array without need
		lists		= lists.concat(nodes);
	}.bind(this));	
	return lists;
}

tQuery.Object3D._crawls	= function(root, selectItems)
{
	var result	= [];
//console.log("crawl", root, selectItems)
	console.assert( selectItems.length >= 1 );
	var match	= this._selectItemMatch(root, selectItems[0]);
//console.log("  match", match)
	var nextSelect	= match ? selectItems.slice(1) : selectItems;
//console.log("  nextSelect", nextSelect)

	if( nextSelect.length === 0 )	return [root];

	root.children.forEach(function(child){
		var nodes	= this._crawls(child, nextSelect);
		// FIXME reallocate the array without need
		result		= result.concat(nodes);
	}.bind(this));

	return result;
}

// all the geometries keywords
tQuery.Object3D._selectableGeometries	= Object.keys(THREE).filter(function(value){
	return value.match(/.+Geometry$/);}).map(function(value){ return value.replace(/Geometry$/,'').toLowerCase();
});

// all the light keywords
tQuery.Object3D._selectableLights	= Object.keys(THREE).filter(function(value){
	return value.match(/.+Light$/);}).map(function(value){ return value.replace(/Light$/,'').toLowerCase();
});

tQuery.Object3D._selectableClasses	= ['mesh', 'light'];

tQuery.Object3D._selectItemMatch	= function(object3d, selectItem)
{
	// sanity check
	console.assert( object3d instanceof THREE.Object3D );
	console.assert( typeof selectItem === 'string' );

	// parse selectItem into subItems
	var subItems	= selectItem.match(new RegExp("([^.#]+|\.[^.#]+|\#[^.#]+)", "g"));;

	// go thru each subItem
	var completed	= tQuery.each(subItems, function(subItem){
		var meta	= subItem.charAt(0);
		var suffix	= subItem.slice(1);
		//console.log("meta", meta, subItem, suffix, object3d)
		if( meta === "." ){
			var hasClass	= tQuery.Object3D._hasClassOne(object3d, suffix);
			return hasClass ? true : false;
		}else if( meta === "#" ){
			return object3d._tqId === suffix ? true : false;
		}else if( subItem === "*" ){
			return true;
		}else if( this._selectableGeometries.indexOf(subItem) !== -1 ){	// Handle geometries
			var geometry	= object3d.geometry;
			var className	= subItem.charAt(0).toUpperCase() + subItem.slice(1) + "Geometry";
			return geometry instanceof THREE[className];
		}else if( this._selectableLights.indexOf(subItem) !== -1 ){	// Handle light
			var className	= subItem.charAt(0).toUpperCase() + subItem.slice(1) + "Light";
			return object3d instanceof THREE[className];
		}else if( this._selectableClasses.indexOf(subItem) !== -1 ){	// Handle light
			var className	= subItem.charAt(0).toUpperCase() + subItem.slice(1);
			return object3d instanceof THREE[className];
		}
		// this point should never be reached
		console.assert(false, "invalid selector: "+subItem);
		return true;
	}.bind(this));

	return completed ? true : false;
}
/**
 * Handle geometry. It inherit from tQuery.Node
 *
 * @class handle THREE.Geometry. It inherit from {@link tQuery.Node}
 * 
 * @borrows tQuery.Node#get as this.get
 * @borrows tQuery.Node#each as this.each
 * @borrows tQuery.Node#back as this.back
 *
 * @param {THREE.Geometry} object an instance or an array of instance
*/
tQuery.Geometry	= function(object)
{
	// call parent
	tQuery.Geometry.parent.constructor.call(this, object)

	// sanity check - all items MUST be THREE.Geometry
	this._lists.forEach(function(item){ console.assert(item instanceof THREE.Geometry); });
};

/**
 * inherit from tQuery.Node
*/
tQuery.inherit(tQuery.Geometry, tQuery.Node);

/**
 * Make it pluginable
*/
tQuery.pluginsInstanceOn(tQuery.Geometry);

/**
 * define all acceptable attributes for this class
*/
tQuery.mixinAttributes(tQuery.Geometry, {
	hasTangents	: tQuery.convert.toBoolean,
	dynamic		: tQuery.convert.toBoolean
});/**
 * Handle material
 *
 * @class include THREE.Material. It inherit from {@link tQuery.Node}
 * 
 * @borrows tQuery.Node#get as this.get
 * @borrows tQuery.Node#each as this.each
 * @borrows tQuery.Node#back as this.back
 *
 * @param {THREE.Material} object an instance or array of instance
*/
tQuery.Material	= function(object)
{
	// call parent
	tQuery.Material.parent.constructor.call(this, object)

	// sanity check - all items MUST be THREE.Material
	this._lists.forEach(function(item){ console.assert(item instanceof THREE.Material); });
};

/**
 * inherit from tQuery.Node
*/
tQuery.inherit(tQuery.Material, tQuery.Node);

/**
 * Make it pluginable
*/
tQuery.pluginsInstanceOn(tQuery.Material);

/**
 * define all acceptable attributes for this class
*/
tQuery.mixinAttributes(tQuery.Material, {
	opacity		: tQuery.convert.toNumber,
	transparent	: tQuery.convert.toBoolean
});
/**
 * Handle light
 *
 * @class include THREE.Light. It inherit from {@link tQuery.Node}
 * 
 * @borrows tQuery.Node#get as this.get
 * @borrows tQuery.Node#each as this.each
 * @borrows tQuery.Node#back as this.back
 *
 * @param {THREE.Light} object an instance or array of instance
*/
tQuery.Light	= function(elements)
{
	// call parent ctor
	tQuery.Light.parent.constructor.call(this, elements)

	// sanity check - all items MUST be THREE.Light
	this._lists.forEach(function(item){ console.assert(item instanceof THREE.Light); });
};

/**
 * inherit from tQuery.Node
 * - TODO this should inherit from tQuery.Object3D but but in inheritance
*/
tQuery.inherit(tQuery.Light, tQuery.Object3D);

/**
 * Make it pluginable
*/
tQuery.pluginsInstanceOn(tQuery.Light);

/**
 * define all acceptable attributes for this class
*/
tQuery.mixinAttributes(tQuery.Light, {
	color	: tQuery.convert.toThreeColor
});


/**
 * Handle mesh
 *
 * @class include THREE.Mesh. It inherit from {@link tQuery.Node}
 * 
 * @borrows tQuery.Node#get as this.get
 * @borrows tQuery.Node#each as this.each
 * @borrows tQuery.Node#back as this.back
 *
 * @param {THREE.Mesh} object an instance or array of instance
*/
tQuery.Mesh	= function(elements)
{
	// call parent ctor
	var parent	= tQuery.Mesh.parent;
	parent.constructor.call(this, elements)

	// sanity check - all items MUST be THREE.Mesh
	this._lists.forEach(function(item){ console.assert(item instanceof THREE.Mesh); });
};

/**
 * inherit from tQuery.Object3D
*/
tQuery.inherit(tQuery.Mesh, tQuery.Object3D);

/**
 * Make it pluginable
*/
tQuery.pluginsInstanceOn(tQuery.Mesh);

//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

/**
 * TODO to remove. this function is crap
*/
tQuery.Mesh.prototype.material	= function(value){
	var parent	= tQuery.Mesh.parent;
	// handle the getter case
	if( value == undefined )	return parent.material.call(this);
	// handle parameter polymorphism
	if( value instanceof tQuery.Material )	value	= value.get(0)
	// sanity check
	console.assert( value instanceof THREE.Material )
	// handle the setter case
	this.each(function(tMesh){
		tMesh.material	= value;
	});
	return this;	// for the chained API
}

/**
 * Create a tQuery.Sprite
 * 
 * @returns {tQuery.Sprite} the create object
*/
tQuery.register('createSprite', function(opts){
	opts		= tQuery.extend(opts, {
		useScreenCoordinates	: false
	});
	var sprite	= new THREE.Sprite(opts);
	return new tQuery.Sprite(sprite)
})

//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

/**
 * Wrapper on top of THREE.Sprite
*/
tQuery.register('Sprite', function(elements){
	// call parent ctor
	tQuery.Sprite.parent.constructor.call(this, elements)

	// sanity check - all items MUST be THREE.Material
	this._lists.forEach(function(item){ console.assert(item instanceof THREE.Sprite); });
});

/**
 * inherit from tQuery.Node
*/
tQuery.inherit(tQuery.Sprite, tQuery.Object3D);


/**
 * define all acceptable attributes for this class
*/
tQuery.mixinAttributes(tQuery.Sprite, {
	color			: tQuery.convert.toThreeColor,
	map			: tQuery.convert.toTexture,
	useScreenCoordinates	: tQuery.convert.toBoolean
});
//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

/**
 * Handle world (aka scene+camera+renderer)
 *
 * @class youpla
 * 
 * @param {THREE.Material} object an instance or an array of instance
*/
tQuery.World	= function(opts)
{
	// handle parameters
	opts	= opts	|| {};
	opts	= tQuery.extend(opts, {
		renderW		: window.innerWidth,
		renderH		: window.innerHeight,
		webGLNeeded	: true, 
		autoRendering	: true,
		scene		: null,
		camera		: null,
		renderer	: null
	});
	this._opts	= opts;

	// update default world.
	// - TODO no sanity check ?
	// - not clear what to do with this...
	// - tQuery.world is the user world. like the camera controls
	console.assert( !tQuery.word );
	tQuery.world	= this;

	this._autoRendering	= true;
	
	// create a scene
	this._scene	= opts.scene	||(new THREE.Scene());

 	// create a camera in the scene
	if( !opts.camera ){
		this._camera	= new THREE.PerspectiveCamera(35, opts.renderW / opts.renderH, 0.01, 10000 );
		this._camera.position.set(0, 0, 3);
		this._scene.add(this._camera);
	}else{
		this._camera	= opts.camera;
	}
	
	// create the loop
	this._loop	= new tQuery.Loop();

	// hook the render function in this._loop
	this._$loopCb	= this._loop.hookOnRender(function(delta, now){
		this.render(delta);
	}.bind(this));

	// create a renderer
	if( opts.renderer ){
		this._renderer	= opts.renderer;
	}else if( tQuery.World.hasWebGL() ){
		this._renderer	= new THREE.WebGLRenderer({
			antialias		: true,	// to get smoother output
			preserveDrawingBuffer	: true	// to allow screenshot
		});
	}else if( !opts.webGLNeeded ){
		this._renderer	= new THREE.CanvasRenderer();
	}else{
		this._addGetWebGLMessage();
		throw new Error("WebGL required and not available")
	}
	this._renderer.setClearColorHex( 0xBBBBBB, 1 );
	this._renderer.setSize( opts.renderW, opts.renderH );
};

// make it pluginable
tQuery.pluginsInstanceOn(tQuery.World);

// make it eventable
tQuery.MicroeventMixin(tQuery.World.prototype)


tQuery.World.prototype.destroy	= function(){
	// microevent.js notification
	this.trigger('destroy');
	// unhook the render function in this._loop
	this._loop.unhookOnRender(this._$loopCb);
	// destroy the loop
	this._loop.destroy();
	// remove this._cameraControls if needed
	this.removeCameraControls();
	// remove renderer element
	var parent	= this._renderer.domElement.parentElement;
	parent	&& parent.removeChild(this._renderer.domElement);
	
	// clear the global if needed
	if( tQuery.world === this )	tQuery.world = null;
}

//////////////////////////////////////////////////////////////////////////////////
//		WebGL Support							//
//////////////////////////////////////////////////////////////////////////////////

tQuery.World._hasWebGL	= undefined;
/**
 * @returns {Boolean} true if webgl is available, false otherwise
*/
tQuery.World.hasWebGL	= function(){
	if( tQuery.World._hasWebGL !== undefined )	return tQuery.World._hasWebGL;

	// test from Detector.js
	try{
		tQuery.World._hasWebGL	= !! window.WebGLRenderingContext && !! document.createElement( 'canvas' ).getContext( 'experimental-webgl' );
	} catch( e ){
		tQuery.World._hasWebGL	= false;
	}
	return tQuery.World._hasWebGL;
};

/**
*/
tQuery.World.prototype._addGetWebGLMessage	= function(parent)
{
	parent	= parent || document.body;
	
	// message directly taken from Detector.js
	var domElement = document.createElement( 'div' );
	domElement.style.fontFamily	= 'monospace';
	domElement.style.fontSize	= '13px';
	domElement.style.textAlign	= 'center';
	domElement.style.background	= '#eee';
	domElement.style.color		= '#000';
	domElement.style.padding	= '1em';
	domElement.style.width		= '475px';
	domElement.style.margin		= '5em auto 0';
	domElement.innerHTML		= window.WebGLRenderingContext ? [
		'Your graphics card does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation">WebGL</a>.<br />',
		'Find out how to get it <a href="http://get.webgl.org/">here</a>.'
	].join( '\n' ) : [
		'Your browser does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation">WebGL</a>.<br/>',
		'Find out how to get it <a href="http://get.webgl.org/">here</a>.'
	].join( '\n' );

	parent.appendChild(domElement);
}

//////////////////////////////////////////////////////////////////////////////////
//		add/remove object3D						//
//////////////////////////////////////////////////////////////////////////////////

// TODO why not a getter/setter here
tQuery.World.prototype.setCameraControls	= function(control){
	if( this.hasCameraControls() )	this.removeCameraControls();
	this._cameraControls	= control;
	return this;	// for chained API
};

tQuery.World.prototype.getCameraControls	= function(){
	return this._cameraControls;
};


tQuery.World.prototype.removeCameraControls	= function(){
	if( this.hasCameraControls() === false )	return this;
	this._cameraControls	= undefined;
	return this;	// for chained API
};

tQuery.World.prototype.hasCameraControls	= function(){
	return this._cameraControls !== undefined ? true : false;
};

//////////////////////////////////////////////////////////////////////////////////
//		add/remove object3D						//
//////////////////////////////////////////////////////////////////////////////////

/**
 * add an object to the scene
 * 
 * @param {tQuery.Object3D} object3D to add to the scene (THREE.Object3D is accepted)
*/
tQuery.World.prototype.add	= function(object3d)
{
	if( object3d instanceof tQuery.Object3D ){
		object3d.each(function(object3d){
			this._scene.add(object3d)			
		}.bind(this));
	}else if( object3d instanceof THREE.Object3D ){
		this._scene.add(object3d)		
	}else	console.assert(false, "invalid type");
	// for chained API
	return this;
}

/**
 * remove an object to the scene
 * 
 * @param {tQuery.Object3D} object3D to add to the scene (THREE.Object3D is accepted)
*/
tQuery.World.prototype.remove	= function(object3d)
{
	if( object3d instanceof tQuery.Object3D ){
		object3d.each(function(object3d){
			this._scene.remove(object3d)
		}.bind(this));
	}else if( object3d instanceof THREE.Object3D ){
		this._scene.remove(object3d)
	}else	console.assert(false, "invalid type");
	// for chained API
	return this;
}

tQuery.World.prototype.appendTo	= function(domElement)
{
	domElement.appendChild(this._renderer.domElement)
	// for chained API
	return this;
}

/**
 * Start the loop
*/
tQuery.World.prototype.start	= function(){
	this._loop.start();
	return this;	// for chained API
}
/**
 * Stop the loop
*/
tQuery.World.prototype.stop	= function(){
	this._loop.stop();
	return this;	// for chained API
}

tQuery.World.prototype.loop	= function(){ return this._loop;	}

tQuery.World.prototype.tRenderer= function(){ return this._renderer;	}
tQuery.World.prototype.tScene	= function(){ return this._scene;	}
tQuery.World.prototype.tCamera	= function(){ return this._camera;	}


// backward compatible functions to remove
tQuery.World.prototype.renderer	= function(){  console.trace();console.warn("world.renderer() is ovbslete, use .tRenderer() instead");
						return this._renderer;	}
tQuery.World.prototype.camera	= function(){ console.trace();console.warn("world.camera() is obsolete, use .tCamerar() instead");
						return this._camera;	}
tQuery.World.prototype.scene	= function(){ console.trace();console.warn("world.scene() is obsolete, use .tScene() instead");
						return this._scene;	}
tQuery.World.prototype.get	= function(){ return this._scene;	}

//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

tQuery.World.prototype.autoRendering	= function(value){
	if(value === undefined)	return this._autoRendering;
	this._autoRendering	= value;
	return this;
}


tQuery.World.prototype.render	= function(delta)
{
	// update the cameraControl
	if( this.hasCameraControls() )	this._cameraControls.update(delta);
	// render the scene 
	if( this._autoRendering )	this._renderer.render( this._scene, this._camera );
}
//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

/**
 * Handle the rendering loop
 *
 * @class This class handle the rendering loop
 *
 * @param {THREE.World} world the world to display (optional)
*/
tQuery.Loop	= function()
{	
	// internally if world present do that
	this._hooks	= [];
	this._lastTime	= null;
};

// make it pluginable
tQuery.pluginsInstanceOn(tQuery.Loop);

/**
 * destructor
*/
tQuery.Loop.prototype.destroy	= function()
{
	this.stop();
}

//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

/**
 * start looping
 * 
 * @returns {tQuery.Loop} chained API
*/
tQuery.Loop.prototype.start	= function()
{
	if( this._timerId )	this.stop();
	this._timerId	= requestAnimationFrame( this._onAnimationFrame.bind(this) );
	// for chained API
	return this;
}

/**
 * stop looping
 * 
 * @returns {tQuery.Loop} chained API
*/
tQuery.Loop.prototype.stop	= function()
{
	cancelAnimationFrame(this._timerId);
	this._timerId	= null;
	// for chained API
	return this;
}

tQuery.Loop.prototype._onAnimationFrame	= function()
{
	// loop on request animation loop
	// - it has to be at the begining of the function
	// - see details at http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
	this._timerId	= requestAnimationFrame( this._onAnimationFrame.bind(this) );

	// update time values
	var now		= tQuery.now()/1000;
	if( !this._lastTime )	this._lastTime = now - 1/60;
	var delta	= now - this._lastTime;
	this._lastTime	= now;

	// run all the hooks - from lower priority to higher - in order of registration
	for(var priority = 0; priority <= this._hooks.length; priority++){
		if( this._hooks[priority] === undefined )	continue;
		var callbacks	= this._hooks[priority].slice(0)
		for(var i = 0; i < callbacks.length; i++){
			callbacks[i](delta, now);
		}
	}
}

//////////////////////////////////////////////////////////////////////////////////
//		Handle the hooks						//
//////////////////////////////////////////////////////////////////////////////////

tQuery.Loop.prototype.PRE_RENDER		= 20;
tQuery.Loop.prototype.ON_RENDER		= 50;
tQuery.Loop.prototype.POST_RENDER	= 80;

/**
 * hook a callback at a given priority
 *
 * @param {Number} priority for this callback
 * @param {Function} callback the function which will be called function(time){}
 * @returns {Function} the callback function. usefull for this._$callback = loop.hook(this._callback.bind(this))
 *                     and later loop.unhook(this._$callback)
*/
tQuery.Loop.prototype.hook	= function(priority, callback)
{
	// handle parameters
	if( typeof priority === 'function' ){
		callback	= priority;
		priority	= this.PRE_RENDER;
	}

	this._hooks[priority]	= this._hooks[priority] || [];
	console.assert(this._hooks[priority].indexOf(callback) === -1)
	this._hooks[priority].push(callback);
	return callback;
}

/**
 * unhook a callback at a given priority
 *
 * @param {Number} priority for this callback
 * @param {Function} callback the function which will be called function(time){}
 * @returns {tQuery.Loop} chained API
*/
tQuery.Loop.prototype.unhook	= function(priority, callback)
{
	// handle parameters
	if( typeof priority === 'function' ){
		callback	= priority;
		priority	= this.PRE_RENDER;
	}

	var index	= this._hooks[priority].indexOf(callback);
	console.assert(index !== -1);
	this._hooks[priority].splice(index, 1);
	this._hooks[priority].length === 0 && delete this._hooks[priority]
	// for chained API
	return this;
}


// bunch of shortcut
// - TODO should it be in a plugin ?

tQuery.Loop.prototype.hookPreRender	= function(callback){ return this.hook(this.PRE_RENDER, callback);	};
tQuery.Loop.prototype.hookOnRender	= function(callback){ return this.hook(this.ON_RENDER, callback);	};
tQuery.Loop.prototype.hookPostRender	= function(callback){ return this.hook(this.POST_RENDER, callback);	};
tQuery.Loop.prototype.unhookPreRender	= function(callback){ return this.unhook(this.PRE_RENDER, callback);	};
tQuery.Loop.prototype.unhookOnRender	= function(callback){ return this.unhook(this.ON_RENDER, callback);	};
tQuery.Loop.prototype.unhookPostRender	= function(callback){ return this.unhook(this.POST_RENDER, callback);	};
/**
 * @fileOverview plugins for tQuery.core to help creation of object
*/


//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

/**
 * Create tQuery.World
*/
tQuery.register('createWorld', function(opts){
	return new tQuery.World(opts);
});

/**
 * Create tQuery.World
*/
tQuery.register('createObject3D', function(){
	var object3d	= new THREE.Object3D();
	return tQuery(object3d);
});


/**
 * Create tQuery.loop
 * 
 * @param {tQuery.World} world the world to display (optional)
 * @function
*/
tQuery.register('createLoop', function(world){
	return new tQuery.Loop(world);
});


tQuery.register('createDirectionalLight', function(){
	var tLight	= new THREE.DirectionalLight();
	return new tQuery.DirectionalLight([tLight]);
});

tQuery.register('createSpotLight', function(){
	var tLight	= new THREE.SpotLight();
	return new tQuery.SpotLight([tLight]);
});

tQuery.register('createPointLight', function(){
	var tLight	= new THREE.PointLight();
	return new tQuery.PointLight([tLight]);
});

tQuery.register('createAmbientLight', function(){
	var tLight	= new THREE.AmbientLight();
	return new tQuery.AmbientLight([tLight]);
});


//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

/**
 * contains the default material to use when create tQuery.Object3D
 * 
 * @fieldOf tQuery
 * @name defaultObject3DMaterial
*/
tQuery.register('defaultObject3DMaterial', new THREE.MeshNormalMaterial());

tQuery.Geometry.prototype.toMesh	= function(material){
	var meshes	= [];
	this.each(function(tGeometry){
		// handle paramters
		material	= material || tQuery.defaultObject3DMaterial;
		// create the THREE.Mesh
		var mesh	= new THREE.Mesh(tGeometry, material)
		// return it
		meshes.push(mesh);
	});
	return new tQuery.Mesh(meshes);
};


/**
 * Create a cube
 * 
 * @returns {tQuery.Object3D} a tQuery.Object3D containing it
*/
tQuery.register('createCube', function(){
	var ctor	= THREE.CubeGeometry;
	var dflGeometry	= [1, 1, 1];
	return this._createMesh(ctor, dflGeometry, arguments)
});

tQuery.register('createTorus', function(){
	var ctor	= THREE.TorusGeometry;
	var dflGeometry	= [0.5-0.15, 0.15];
	return this._createMesh(ctor, dflGeometry, arguments)
});

tQuery.register('createVector3', function(x, y, z){
	return new THREE.Vector3(x, y, z);
});

tQuery.register('createSphere', function(){
	var ctor	= THREE.SphereGeometry;
	var dflGeometry	= [0.5, 32, 16];
	return this._createMesh(ctor, dflGeometry, arguments)
});

tQuery.register('createPlane', function(){
	var ctor	= THREE.PlaneGeometry;
	var dflGeometry	= [1, 1, 16, 16];
	return this._createMesh(ctor, dflGeometry, arguments)
});

tQuery.register('createCylinder', function(){
	var ctor	= THREE.CylinderGeometry;
	var dflGeometry	= [0.5, 0.5, 1, 16, 4];
	return this._createMesh(ctor, dflGeometry, arguments)
});

tQuery.register('_createMesh', function(ctor, dflGeometry, args)
{
	// convert args to array if it is instanceof Arguments
	// FIXME if( args instanceof Arguments )
	args	= Array.prototype.slice.call( args );
	
	// init the material
	var material	= tQuery.defaultObject3DMaterial;
	// if the last arguments is a material, use it
	if( args.length && args[args.length-1] instanceof THREE.Material ){
		material	= args.pop();
	}
	
	// ugly trick to get .apply() to work 
	var createFn	= function(ctor, a0, a1, a2, a3, a4, a5, a6, a7){
		console.assert(arguments.length <= 9);
		//console.log("createFn", arguments)
		return new ctor(a0,a1,a2,a3,a4,a5,a6,a7);
	}
	if( args.length === 0 )	args	= dflGeometry.slice();
	args.unshift(ctor);
	var geometry	= createFn.apply(this, args);

	// set the geometry.dynamic by default
	geometry.dynamic= true;
	// create the THREE.Mesh
	var mesh	= new THREE.Mesh(geometry, material)
	// return it
	return tQuery(mesh);
});

//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

tQuery.register('createAxis', function(){
	var axis	= new THREE.AxisHelper();
	axis.scale.multiplyScalar(1/100);
	return tQuery(axis);
});
/**
 * Handle ambient light
 *
 * @class include THREE.AmbientLight. It inherit from {@link tQuery.Light}
 * 
 * @borrows tQuery.Node#get as this.get
 * @borrows tQuery.Node#each as this.each
 * @borrows tQuery.Node#back as this.back
 *
 * @param {THREE.AmbientLight} element an instance or array of instance
*/
tQuery.AmbientLight	= function(elements)
{
	// call parent ctor
	tQuery.AmbientLight.parent.constructor.call(this, elements)

	// sanity check - all items MUST be THREE.Light
	this._lists.forEach(function(item){ console.assert(item instanceof THREE.AmbientLight); });
};

/**
 * inherit from tQuery.Node
*/
tQuery.inherit(tQuery.AmbientLight, tQuery.Light);

/**
 * Make it pluginable
*/
tQuery.pluginsInstanceOn(tQuery.AmbientLight);
/**
 * Handle directional light
 *
 * @class include THREE.DirectionalLight. It inherit from {@link tQuery.Light}
 * 
 * @borrows tQuery.Node#get as this.get
 * @borrows tQuery.Node#each as this.each
 * @borrows tQuery.Node#back as this.back
 *
 * @param {THREE.DirectionalLight} element an instance or array of instance
*/
tQuery.DirectionalLight	= function(elements)
{
	// call parent ctor
	tQuery.DirectionalLight.parent.constructor.call(this, elements)

	// sanity check - all items MUST be THREE.Light
	this._lists.forEach(function(item){ console.assert(item instanceof THREE.DirectionalLight); });
};

/**
 * inherit from tQuery.Light
*/
tQuery.inherit(tQuery.DirectionalLight, tQuery.Light);

/**
 * Make it pluginable
*/
tQuery.pluginsInstanceOn(tQuery.DirectionalLight);

/**
 * define all acceptable attributes for this class
*/
tQuery.mixinAttributes(tQuery.DirectionalLight, {
	intensity	: tQuery.convert.toNumber,
	distance	: tQuery.convert.toNumber,

	shadowDarkness		: tQuery.convert.toNumberZeroToOne,
	shadowBias		: tQuery.convert.toNumber,

	shadowMapWidth		: tQuery.convert.toInteger,
	shadowMapHeight		: tQuery.convert.toInteger,

	shadowCameraRight	: tQuery.convert.toNumber,
	shadowCameraLeft	: tQuery.convert.toNumber,
	shadowCameraTop		: tQuery.convert.toNumber,
	shadowCameraBottom	: tQuery.convert.toNumber,
	shadowCameraVisible	: tQuery.convert.toBoolean,
	
	shadowCameraNear	: tQuery.convert.toNumber,
	shadowCameraFar		: tQuery.convert.toNumber
});



/**
 * Handle directional light
 *
 * @class include THREE.PointLight. It inherit from {@link tQuery.Light}
 * 
 * @borrows tQuery.Node#get as this.get
 * @borrows tQuery.Node#each as this.each
 * @borrows tQuery.Node#back as this.back
 *
 * @param {THREE.PointLight} element an instance or array of instance
*/
tQuery.PointLight	= function(elements)
{
	// call parent ctor
	tQuery.PointLight.parent.constructor.call(this, elements)

	// sanity check - all items MUST be THREE.Light
	this._lists.forEach(function(item){ console.assert(item instanceof THREE.PointLight); });
};

/**
 * inherit from tQuery.Light
*/
tQuery.inherit(tQuery.PointLight, tQuery.Light);

/**
 * Make it pluginable
*/
tQuery.pluginsInstanceOn(tQuery.PointLight);

/**
 * define all acceptable attributes for this class
*/
tQuery.mixinAttributes(tQuery.PointLight, {
	intensity	: tQuery.convert.toNumber,
	distance	: tQuery.convert.toNumber
});


/**
 * Handle directional light
 *
 * @class include THREE.SpotLight. It inherit from {@link tQuery.Light}
 * 
 * @borrows tQuery.Node#get as this.get
 * @borrows tQuery.Node#each as this.each
 * @borrows tQuery.Node#back as this.back
 *
 * @param {THREE.SpotLight} element an instance or array of instance
*/
tQuery.SpotLight	= function(elements)
{
	// call parent ctor
	tQuery.SpotLight.parent.constructor.call(this, elements)

	// sanity check - all items MUST be THREE.Light
	this._lists.forEach(function(item){ console.assert(item instanceof THREE.SpotLight); });
};

/**
 * inherit from tQuery.Light
*/
tQuery.inherit(tQuery.SpotLight, tQuery.Light);

/**
 * Make it pluginable
*/
tQuery.pluginsInstanceOn(tQuery.SpotLight);

/**
 * define all acceptable attributes for this class
*/
tQuery.mixinAttributes(tQuery.SpotLight, {
	intensity	: tQuery.convert.toNumber,
	distance	: tQuery.convert.toNumber,

	shadowDarkness		: tQuery.convert.toNumberZeroToOne,
	shadowBias		: tQuery.convert.toNumber,
	shadowMapWidth		: tQuery.convert.toInteger,
	shadowMapHeight		: tQuery.convert.toInteger,
	shadowCameraRight	: tQuery.convert.toNumber,
	shadowCameraLeft	: tQuery.convert.toNumber,
	shadowCameraTop		: tQuery.convert.toNumber,
	shadowCameraBottom	: tQuery.convert.toNumber,
	shadowCameraVisible	: tQuery.convert.toBoolean
});


//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

tQuery.Mesh.register('setBasicMaterial', function(opts){
	var material	= tQuery.createMeshBasicMaterial(opts);
	this.material( material.get(0) );
	return material.back(this);
})

tQuery.register('createMeshBasicMaterial', function(opts){
	var tMaterial	= new THREE.MeshBasicMaterial(opts);
	var material	= new tQuery.MeshBasicMaterial(tMaterial);
	return material;
});

//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

/**
 * Handle Basic Material
 *
 * @class include THREE.MeshBasicMaterial. It inherit from {@link tQuery.Material}
 * 
 * @borrows tQuery.Node#get as this.get
 * @borrows tQuery.Node#each as this.each
 * @borrows tQuery.Node#back as this.back
 *
 * @param {THREE.BasicMaterial} element an instance or array of instance
*/
tQuery.MeshBasicMaterial	= function(elements)
{
	// call parent ctor
	tQuery.MeshBasicMaterial.parent.constructor.call(this, elements)

	// sanity check - all items MUST be THREE.Material
	this._lists.forEach(function(item){ console.assert(item instanceof THREE.MeshBasicMaterial); });
};

/**
 * inherit from tQuery.Material
*/
tQuery.inherit(tQuery.MeshBasicMaterial, tQuery.Material);


/**
 * Initial code to automatically extract attribute names from THREE.Material child classes

 	var extractMaterialAttribute	= function(className){
		var parentClass	= new THREE.Material();
		var mainClass	= new THREE[className]();
		var parentProps	= Object.keys(parentClass)
		var mainProps	= Object.keys(mainClass)
		console.log("parentProps", JSON.stringify(parentProps, null, '\t'),"mainProps", JSON.stringify(mainProps, null, '\t'));
		mainProps	= mainProps.filter(function(property){
			return parentProps.indexOf(property) === -1;
		})
		console.log("mainProps", JSON.stringify(mainProps, null, '\t'));
		return mainProps;
	}
*/
/**
 * define all acceptable attributes for this class
*/
tQuery.mixinAttributes(tQuery.MeshBasicMaterial, {
	color			: tQuery.convert.toThreeColor,
	ambient			: tQuery.convert.toThreeColor,
	map			: tQuery.convert.toTexture,
	envMap			: tQuery.convert.toTexture,
	wireframe		: tQuery.convert.toBoolean,
	wireframeLinewidth	: tQuery.convert.toInteger,
	wireframeLinecap	: tQuery.convert.toString
});


//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

tQuery.Mesh.register('setLambertMaterial', function(opts){
	var material	= tQuery.createMeshLambertMaterial(opts);
	this.material( material.get(0) );
	return material.back(this);
})

tQuery.register('createMeshLambertMaterial', function(opts){
	var tMaterial	= new THREE.MeshLambertMaterial(opts);
	var material	= new tQuery.MeshLambertMaterial(tMaterial);
	return material;
});

//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

/**
 * Handle directional light
 *
 * @class include THREE.LambertMaterial. It inherit from {@link tQuery.Material}
 * 
 * @borrows tQuery.Node#get as this.get
 * @borrows tQuery.Node#each as this.each
 * @borrows tQuery.Node#back as this.back
 *
 * @param {THREE.LambertMaterial} element an instance or array of instance
*/
tQuery.MeshLambertMaterial	= function(elements)
{
	// call parent ctor
	tQuery.MeshLambertMaterial.parent.constructor.call(this, elements)

	// sanity check - all items MUST be THREE.Material
	this._lists.forEach(function(item){ console.assert(item instanceof THREE.MeshLambertMaterial); });
};

/**
 * inherit from tQuery.Material
*/
tQuery.inherit(tQuery.MeshLambertMaterial, tQuery.Material);

/**
 * define all acceptable attributes for this class
*/
tQuery.mixinAttributes(tQuery.MeshLambertMaterial, {
	color		: tQuery.convert.toThreeColor,
	ambient		: tQuery.convert.toThreeColor,
	map		: tQuery.convert.toTexture,
	bumpMap		: tQuery.convert.toTexture,
	bumpScale	: tQuery.convert.toNumber
});


//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

tQuery.Mesh.register('setPhongMaterial', function(opts){
	var material	= tQuery.createMeshPhongMaterial(opts);
	this.material( material.get(0) );
	return material.back(this);
})

tQuery.register('createMeshPhongMaterial', function(opts){
	var tMaterial	= new THREE.MeshPhongMaterial(opts);
	var material	= new tQuery.MeshPhongMaterial(tMaterial);
	return material;
});

//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

/**
 * Handle directional light
 *
 * @class include THREE.PhongMaterial. It inherit from {@link tQuery.Material}
 * 
 * @borrows tQuery.Node#get as this.get
 * @borrows tQuery.Node#each as this.each
 * @borrows tQuery.Node#back as this.back
 *
 * @param {THREE.PhongMaterial} element an instance or array of instance
*/
tQuery.MeshPhongMaterial	= function(elements)
{
	// call parent ctor
	tQuery.MeshPhongMaterial.parent.constructor.call(this, elements)

	// sanity check - all items MUST be THREE.Material
	this._lists.forEach(function(item){ console.assert(item instanceof THREE.MeshPhongMaterial); });
};

/**
 * inherit from tQuery.Material
*/
tQuery.inherit(tQuery.MeshPhongMaterial, tQuery.Material);

/**
 * define all acceptable attributes for this class
*/
tQuery.mixinAttributes(tQuery.MeshPhongMaterial, {
	map		: tQuery.convert.toTexture,
	
	color		: tQuery.convert.toThreeColor,
	ambient		: tQuery.convert.toThreeColor,
	emissive	: tQuery.convert.toThreeColor,
	specular	: tQuery.convert.toThreeColor,

	shininess	: tQuery.convert.toNumber,
	
	bumpMap		: tQuery.convert.toTexture,
	bumpScale	: tQuery.convert.toNumber,

	metal		: tQuery.convert.toBoolean,
	perPixel	: tQuery.convert.toBoolean
});


/**
 * @fileOverview Plugins for tQuery.Geometry: tool box to play with geometry
*/

(function(){	// TODO why is there a closure here ?

//////////////////////////////////////////////////////////////////////////////////
//		Size functions							//
//////////////////////////////////////////////////////////////////////////////////

tQuery.Geometry.register('computeAll', function(){
	this.each(function(tGeometry){
		tGeometry.computeBoundingBox();
		//tGeometry.computeCentroids();
		tGeometry.computeFaceNormals();
		//tGeometry.computeVertexNormals();
		//tGeometry.computeTangents();
	});

	// return this, to get chained API	
	return this;
});

/**
 * zoom a geometry
 *
 * @name zoom
 * @methodOf tQuery.Geometry
*/
tQuery.Geometry.register('scaleBy', function(vector3){
	// handle parameters
	if( typeof vector3 === "number" && arguments.length === 1 ){
		vector3	= new THREE.Vector3(vector3, vector3, vector3);
	}else if( typeof vector3 === "number" && arguments.length === 3 ){
		vector3	= new THREE.Vector3(arguments[0], arguments[1], arguments[2]);
	}
	console.assert(vector3 instanceof THREE.Vector3, "Geometry.vector3 parameter error");

	// change all geometry.vertices
	this.each(function(geometry){
		for(var i = 0; i < geometry.vertices.length; i++) {
			var vertex	= geometry.vertices[i];
			vertex.multiplySelf(vector3); 
		}
		// mark the vertices as dirty
		geometry.verticesNeedUpdate = true;
		geometry.computeBoundingBox();
	})

	// return this, to get chained API	
	return this;
});

tQuery.Geometry.register('size', function(){
	// only on zero-or-one element
	console.assert(this.length <= 1)
	// if no element, return undefined
	if( this.length === 0 )	return undefined

	// else measure the size of the element
	var geometry	= this.get(0);
	// compute middle
	var size= new THREE.Vector3()
	size.x	= geometry.boundingBox.max.x - geometry.boundingBox.min.x;
	size.y	= geometry.boundingBox.max.y - geometry.boundingBox.min.y;
	size.z	= geometry.boundingBox.max.z - geometry.boundingBox.min.z;

	// return the just computed middle
	return size;	
});

/**
*/
tQuery.Geometry.register('normalize', function(){
	// change all geometry.vertices
	this.each(function(geometry){
		var node	= tQuery(geometry);
		var size	= node.size();
		if( size.x >= size.y && size.x >= size.z ){
			node.zoom(1/size.x);
		}else if( size.y >= size.x && size.y >= size.z ){
			node.zoom(1/size.y);
		}else{
			node.zoom(1/size.z);
		}
	});
	// return this, to get chained API	
	return this;
});


//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////


tQuery.Geometry.register('middlePoint', function(){
	// only on zero-or-one element
	console.assert(this.length <= 1)
	// if no element, return undegined
	if( this.length === 0 )	return undefined
	// else measure the size of the element
	var geometry	= this.get(0);
	// compute middle
	var middle	= new THREE.Vector3()
	middle.x	= ( geometry.boundingBox.max.x + geometry.boundingBox.min.x ) / 2;
	middle.y	= ( geometry.boundingBox.max.y + geometry.boundingBox.min.y ) / 2;
	middle.z	= ( geometry.boundingBox.max.z + geometry.boundingBox.min.z ) / 2;

	// return the just computed middle
	return middle;
});

//////////////////////////////////////////////////////////////////////////////////
//		move functions							//
//////////////////////////////////////////////////////////////////////////////////

tQuery.Geometry.register('translate', function(delta){
	// handle parameters
	if( typeof delta === "number" && arguments.length === 3 ){
		delta	= new THREE.Vector3(arguments[0], arguments[1], arguments[2]);
	}
	console.assert(delta instanceof THREE.Vector3, "Geometry.translate parameter error");

	// change all geometry.vertices
	this.each(function(geometry){
		// change all geometry.vertices
		for(var i = 0; i < geometry.vertices.length; i++) {
			var vertex	= geometry.vertices[i];
			vertex.addSelf(delta); 
		}
		// mark the vertices as dirty
		geometry.verticesNeedUpdate = true;
		geometry.computeBoundingBox();
	})

	// return this, to get chained API	
	return this;
});

tQuery.Geometry.register('rotate', function(angles, order){
	// handle parameters
	if( typeof angles === "number" && arguments.length === 3 ){
		angles	= new THREE.Vector3(arguments[0], arguments[1], arguments[2]);
	}
	console.assert(angles instanceof THREE.Vector3, "Geometry.rotate parameter error");

	// set default rotation order if needed
	order	= order	|| 'XYZ';
	// compute transformation matrix
	var matrix	= new THREE.Matrix4();
	matrix.setRotationFromEuler(angles, order);

	// change all geometry.vertices
	this.each(function(geometry){
		// apply the matrix
		geometry.applyMatrix( matrix );
	
		// mark the vertices as dirty
		geometry.verticesNeedUpdate = true;
		geometry.computeBoundingBox();
	});

	// return this, to get chained API	
	return this;
});

/**
*/
tQuery.Geometry.register('center', function(noX, noY, noZ){
	// change all geometry.vertices
	this.each(function(tGeometry){
		var geometry	= tQuery(tGeometry);
		// compute delta
		var delta 	= geometry.middlePoint().negate();
		if( noX )	delta.x	= 0;
		if( noY )	delta.y	= 0;
		if( noZ )	delta.z	= 0;

		return geometry.translate(delta)
	});
	// return this, to get chained API	
	return this;
});

/**
 * Smooth the geometry using catmull-clark
 *
 * @param {Number} subdivision the number of subdivision to do
*/
tQuery.Geometry.register('smooth', function(subdivision){
	// init the modifier
	var modifier	= new THREE.SubdivisionModifier( subdivision );
	// apply it to each geometry
	this.each(function(geometry){
		// apply it
		modifier.modify( geometry )
	
		// mark the vertices as dirty
		geometry.verticesNeedUpdate = true;
		geometry.computeBoundingBox();
	});
	// return this, to get chained API	
	return this;
});

// some shortcuts
tQuery.Geometry.register('translateX'	, function(delta){ return this.translate(delta, 0, 0);	});
tQuery.Geometry.register('translateY'	, function(delta){ return this.translate(0, delta, 0);	});
tQuery.Geometry.register('translateZ'	, function(delta){ return this.translate(0, 0, delta);	});
tQuery.Geometry.register('rotateX'	, function(angle){ return this.rotate(angle, 0, 0);	});
tQuery.Geometry.register('rotateY'	, function(angle){ return this.rotate(0, angle, 0);	});
tQuery.Geometry.register('rotateZ'	, function(angle){ return this.rotate(0, 0, angle);	});
tQuery.Geometry.register('scaleXBy'	, function(ratio){ return this.scaleBy(ratio, 1, 1);	});
tQuery.Geometry.register('scaleYBy'	, function(ratio){ return this.scaleBy(1, ratio, 1);	});
tQuery.Geometry.register('scaleZBy'	, function(ratio){ return this.scaleBy(1, 1, ratio);	});

// backward compatibility
tQuery.Geometry.register('zoom'		, function(value){return this.scaleBy(value);		});
tQuery.Geometry.register('zoomX'	, function(ratio){ return this.zoom(ratio, 1, 1);	});
tQuery.Geometry.register('zoomY'	, function(ratio){ return this.zoom(1, ratio, 1);	});
tQuery.Geometry.register('zoomZ'	, function(ratio){ return this.zoom(1, 1, ratio);	});


})();	// closure function end
/**
 * @fileOverview Plugins for tQuery.Object3D to play with .position/.rotation/.scale
*/

(function(){	// TODO why is there a closure here ?

//////////////////////////////////////////////////////////////////////////////////
//		set function							//
//////////////////////////////////////////////////////////////////////////////////

tQuery.Object3D.register('scale', function(scale){
	// handle parameters
	if( typeof scale === "number" && arguments.length === 1 ){
		scale	= new THREE.Vector3(scale, scale, scale);
	}else if( typeof scale === "number" && arguments.length === 3 ){
		scale	= new THREE.Vector3(arguments[0], arguments[1], arguments[2]);
	}
	console.assert(scale instanceof THREE.Vector3, "Geometry.scale parameter error");

	// do the operation on each node
	this.each(function(object3d){
		object3d.scale.copy(scale);
	});

	// return this, to get chained API	
	return this;
});

tQuery.Object3D.register('position', function(vector3){
	// handle parameters
	if( typeof vector3 === "number" && arguments.length === 3 ){
		vector3	= new THREE.Vector3(arguments[0], arguments[1], arguments[2]);
	}
	console.assert(vector3 instanceof THREE.Vector3, "Object3D.position parameter error");

	// do the operation on each node
	this.each(function(object3d){
		object3d.position.copy(vector3);
	})

	// return this, to get chained API	
	return this;
});

tQuery.Object3D.register('rotation', function(vector3){
	// handle parameters
	if( typeof vector3 === "number" && arguments.length === 3 ){
		vector3	= new THREE.Vector3(arguments[0], arguments[1], arguments[2]);
	}
	console.assert(vector3 instanceof THREE.Vector3, "Object3D.rotation parameter error");

	// do the operation on each node
	this.each(function(object3d){
		object3d.rotation.copy(vector3);
	})

	// return this, to get chained API	
	return this;
});

//////////////////////////////////////////////////////////////////////////////////
//		add function							//
//////////////////////////////////////////////////////////////////////////////////

tQuery.Object3D.register('translate', function(delta){
	// handle parameters
	if( typeof delta === "number" && arguments.length === 3 ){
		delta	= new THREE.Vector3(arguments[0], arguments[1], arguments[2]);
	}
	console.assert(delta instanceof THREE.Vector3, "Object3D.translate parameter error");

	// do the operation on each node
	this.each(function(object3d){
		object3d.position.addSelf(delta);
	})

	// return this, to get chained API	
	return this;
});


tQuery.Object3D.register('rotate', function(angles){
	// handle parameters
	if( typeof angles === "number" && arguments.length === 3 ){
		angles	= new THREE.Vector3(arguments[0], arguments[1], arguments[2]);
	}
	console.assert(angles instanceof THREE.Vector3, "Object3D.rotate parameter error");

	// do the operation on each node
	this.each(function(object3d){
		object3d.rotation.addSelf(angles);
	})

	// return this, to get chained API	
	return this;
});

tQuery.Object3D.register('scaleBy', function(ratio){
	// handle parameters
	if( typeof ratio === "number" && arguments.length === 1 ){
		ratio	= new THREE.Vector3(ratio, ratio, ratio);
	}else if( typeof ratio === "number" && arguments.length === 3 ){
		ratio	= new THREE.Vector3(arguments[0], arguments[1], arguments[2]);
	}
	console.assert(ratio instanceof THREE.Vector3, "Object3D.rotate parameter error");

	// do the operation on each node
	this.each(function(object3d){
		object3d.scale.multiplySelf(ratio);
	})

	// return this, to get chained API	
	return this;
});


// some shortcuts
tQuery.Object3D.register('translateX'	, function(delta){ return this.translate(delta, 0, 0);	});
tQuery.Object3D.register('translateY'	, function(delta){ return this.translate(0, delta, 0);	});
tQuery.Object3D.register('translateZ'	, function(delta){ return this.translate(0, 0, delta);	});
tQuery.Object3D.register('rotateX'	, function(angle){ return this.rotate(angle, 0, 0);	});
tQuery.Object3D.register('rotateY'	, function(angle){ return this.rotate(0, angle, 0);	});
tQuery.Object3D.register('rotateZ'	, function(angle){ return this.rotate(0, 0, angle);	});
tQuery.Object3D.register('scaleXBy'	, function(ratio){ return this.scaleBy(ratio, 1, 1);	});
tQuery.Object3D.register('scaleYBy'	, function(ratio){ return this.scaleBy(1, ratio, 1);	});
tQuery.Object3D.register('scaleZBy'	, function(ratio){ return this.scaleBy(1, 1, ratio);	});

// backward compatibility
tQuery.Object3D.register('zoom'		, function(value){ return this.scaleBy(value);		});
tQuery.Object3D.register('zoomX'	, function(ratio){ return this.zoom(ratio, 1, 1);	});
tQuery.Object3D.register('zoomY'	, function(ratio){ return this.zoom(1, ratio, 1);	});
tQuery.Object3D.register('zoomZ'	, function(ratio){ return this.zoom(1, 1, ratio);	});

})();	// closure function end
// backward compatibility only
tQuery.World.register('fullpage', function(){
	console.log("world.fullpage() is obsolete. use world.boilerplate() instead.");
	return this.boilerplate();
});

tQuery.World.register('boilerplate', function(opts){
	// put renderer fullpage
	var domElement	= document.body;
	domElement.style.margin		= "0";
	domElement.style.padding	= "0";
	domElement.style.overflow	= 'hidden';
	this.appendTo(domElement);
	this._renderer.setSize( domElement.offsetWidth, domElement.offsetHeight );
	
	// add the boilerplate
	this.addBoilerplate(opts);
	
	// for chained API
	return this;
});

/**
 * Define a page title
*/
tQuery.World.register('pageTitle', function(element){
	// handle parameters polymorphism
	if( typeof(element) === 'string' ){
		var element	= document.querySelector(element);
	}
	// sanity check
	console.assert( element instanceof HTMLElement, ".pageTitle(element) needs a HTMLElement");
	// set element.style
	element.style.position	= "absolute";
	element.style.width	= "100%";
	element.style.textAlign	= "center";
	element.style.fontWeight= "bolder";
	element.style.fontColor	= "white";
	element.style.paddingTop= "0.5em";
	element.style.fontFamily= "arial";
	// for chained API
	return this;
});

tQuery.World.register('addBoilerplate', function(opts){
	var _this	= this;
	// sanity check - no boilerplate is already installed
	console.assert( this.hasBoilerplate() !== true );
	// handle parameters	
	opts	= tQuery.extend(opts, {
		stats		: true,
		cameraControls	: true,
		windowResize	: true,
		screenshot	: true,
		fullscreen	: true
	});
	// get the context
	var ctx	= {};
	
	// make tRenderer.domElement style "display: block" - by default it is inline-block
	// - so it is affected by line-height and create a white line at the bottom
	this.tRenderer().domElement.style.display = "block"

	// create the context
	tQuery.data(this, '_boilerplateCtx', ctx);

	// get some variables
	var tCamera	= this.tCamera();
	var tRenderer	= this.tRenderer();

	// add Stats.js - https://github.com/mrdoob/stats.js
	if( opts.stats ){
		ctx.stats	= new Stats();
		ctx.stats.domElement.style.position	= 'absolute';
		ctx.stats.domElement.style.bottom	= '0px';
		tRenderer.domElement.parentNode && tRenderer.domElement.parentNode.appendChild( ctx.stats.domElement );
		ctx.loopStats	= function(){
			ctx.stats.update();
		};
		this.loop().hook(ctx.loopStats);		
	}

	// create a camera contol
	if( opts.cameraControls ){
		ctx.cameraControls	= new THREEx.DragPanControls(tCamera);
		this.setCameraControls(ctx.cameraControls);		
	}

	// transparently support window resize
	if( opts.windowResize ){
		ctx.windowResize	= THREEx.WindowResize.bind(tRenderer, tCamera);		
	}
	// allow 'p' to make screenshot
	if( opts.screenshot ){		
		ctx.screenshot		= THREEx.Screenshot.bindKey(tRenderer);
	}
	// allow 'f' to go fullscreen where this feature is supported
	if( opts.fullscreen && THREEx.FullScreen.available() ){
		ctx.fullscreen	= THREEx.FullScreen.bindKey();		
	}

	// bind 'destroy' event on tQuery.world
	ctx._$onDestroy	= this.bind('destroy', function(){
		if( this.hasBoilerplate() === false )	return;
		this.removeBoilerplate();	
	});
	
	// for chained API
	return this;
});

tQuery.World.register('hasBoilerplate', function(){
	// get the context
	var ctx	= tQuery.data(this, "_boilerplateCtx")
	// return true if ctx if defined, false otherwise
	return ctx === undefined ? false : true;
});

tQuery.World.register('removeBoilerplate', function(){
	// get context
	var ctx	= tQuery.data(this, '_boilerplateCtx');
	// if not present, return now
	if( ctx === undefined )	return	this;
	// remove the context from this
	tQuery.removeData(this, '_boilerplateCtx');

	// unbind 'destroy' for tQuery.World
	this.unbind('destroy', this._$onDestroy);

	// remove stats.js
	ctx.stats		&& document.body.removeChild(ctx.stats.domElement );
	ctx.stats		&& this.loop().unhook(ctx.loopStats);
	// remove camera
	ctx.cameraControls	&& this.removeCameraControls()
	// stop windowResize
	ctx.windowResize	&& ctx.windowResize.stop();
	// unbind screenshot
	ctx.screenshot		&& ctx.screenshot.unbind();
	// unbind fullscreen
	ctx.fullscreen		&& ctx.fullscreen.unbind();
});// This THREEx helper makes it easy to handle window resize.
// It will update renderer and camera when window is resized.
//
// # Usage
//
// **Step 1**: Start updating renderer and camera
//
// ```var windowResize = THREEx.WindowResize(aRenderer, aCamera)```
//    
// **Step 2**: Start updating renderer and camera
//
// ```windowResize.stop()```
// # Code

//

/** @namespace */
var THREEx	= THREEx 		|| {};

/**
 * Update renderer and camera when the window is resized
 * 
 * @param {Object} renderer the renderer to update
 * @param {Object} Camera the camera to update
*/
THREEx.WindowResize	= function(renderer, camera){
	var callback	= function(){
		// notify the renderer of the size change
		renderer.setSize( window.innerWidth, window.innerHeight );
		// update the camera
		camera.aspect	= window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
	}
	// bind the resize event
	window.addEventListener('resize', callback, false);
	// return .stop() the function to stop watching window resize
	return {
		/**
		 * Stop watching window resize
		*/
		stop	: function(){
			window.removeEventListener('resize', callback);
		}
	};
}

THREEx.WindowResize.bind	= function(renderer, camera){
	return THREEx.WindowResize(renderer, camera);
}
/** @namespace */
var THREEx	= THREEx 		|| {};

// TODO http://29a.ch/2011/9/11/uploading-from-html5-canvas-to-imgur-data-uri
// able to upload your screenshot without running servers

// forced closure
(function(){

	/**
	 * Take a screenshot of a renderer
	 * - require WebGLRenderer to have "preserveDrawingBuffer: true" to be set
	 * - TODO is it possible to check if this variable is set ? if so check it
	 *   and make advice in the console.log
	 *   - maybe with direct access to the gl context...
	 * 
	 * @param {Object} renderer to use
	 * @param {String} mimetype of the output image. default to "image/png"
	 * @param {String} dataUrl of the image
	*/
	var toDataURL	= function(renderer, mimetype)
	{
		mimetype	= mimetype	|| "image/png";
		var dataUrl	= renderer.domElement.toDataURL(mimetype);
		return dataUrl;
	}

	/**
	 * resize an image to another resolution while preserving aspect
	 *
	 * @param {String} srcUrl the url of the image to resize
	 * @param {Number} dstWidth the destination width of the image
	 * @param {Number} dstHeight the destination height of the image
	 * @param {Number} callback the callback to notify once completed with callback(newImageUrl)
	*/
	var _aspectResize	= function(srcUrl, dstW, dstH, callback){
		// to compute the width/height while keeping aspect
		var cpuScaleAspect	= function(maxW, maxH, curW, curH){
			var ratio	= curH / curW;
			if( curW >= maxW && ratio <= 1 ){ 
				curW	= maxW;
				curH	= maxW * ratio;
			}else if(curH >= maxH){
				curH	= maxH;
				curW	= maxH / ratio;
			}
			return { width: curW, height: curH };
		}
		// callback once the image is loaded
		var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
		var onLoad	= __bind(function(){
			// init the canvas
			var canvas	= document.createElement('canvas');
			canvas.width	= dstW;	canvas.height	= dstH;
			var ctx		= canvas.getContext('2d');

			// TODO is this needed
			ctx.fillStyle	= "black";
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			// scale the image while preserving the aspect
			var scaled	= cpuScaleAspect(canvas.width, canvas.height, image.width, image.height);

			// actually draw the image on canvas
			var offsetX	= (canvas.width  - scaled.width )/2;
			var offsetY	= (canvas.height - scaled.height)/2;
			ctx.drawImage(image, offsetX, offsetY, scaled.width, scaled.height);

			// dump the canvas to an URL		
			var mimetype	= "image/png";
			var newDataUrl	= canvas.toDataURL(mimetype);
			// notify the url to the caller
			callback && callback(newDataUrl)
		}, this);

		// Create new Image object
		var image 	= new Image();
		image.onload	= onLoad;
		image.src	= srcUrl;
	}
	

	// Super cooked function: THREEx.Screenshot.bindKey(renderer)
	// and you are done to get screenshot on your demo

	/**
	 * Bind a key to renderer screenshot
	*/
	var bindKey	= function(renderer, opts){
		// handle parameters
		opts		= opts		|| {};
		var charCode	= opts.charCode	|| 'p'.charCodeAt(0);
		var width	= opts.width;
		var height	= opts.height;
		var callback	= opts.callback	|| function(url){
			window.open(url, "name-"+Math.random());
		};

		// callback to handle keypress
		var __bind	= function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
		var onKeyPress	= __bind(function(event){
			// return now if the KeyPress isnt for the proper charCode
			if( event.which !== charCode )	return;
			// get the renderer output
			var dataUrl	= this.toDataURL(renderer);

			if( width === undefined && height === undefined ){
				callback( dataUrl )
			}else{
				// resize it and notify the callback
				// * resize == async so if callback is a window open, it triggers the pop blocker
				_aspectResize(dataUrl, width, height, callback);				
			}
		}, this);

		// listen to keypress
		// NOTE: for firefox it seems mandatory to listen to document directly
		document.addEventListener('keypress', onKeyPress, false);

		return {
			unbind	: function(){
				document.removeEventListener('keypress', onKeyPress, false);
			}
		};
	}

	// export it	
	THREEx.Screenshot	= {
		toDataURL	: toDataURL,
		bindKey		: bindKey
	};
})();
// This THREEx helper makes it easy to handle the fullscreen API
// * it hides the prefix for each browser
// * it hides the little discrepencies of the various vendor API
// * at the time of this writing (nov 2011) it is available in 
//   [firefox nightly](http://blog.pearce.org.nz/2011/11/firefoxs-html-full-screen-api-enabled.html),
//   [webkit nightly](http://peter.sh/2011/01/javascript-full-screen-api-navigation-timing-and-repeating-css-gradients/) and
//   [chrome stable](http://updates.html5rocks.com/2011/10/Let-Your-Content-Do-the-Talking-Fullscreen-API).

// 
// # Code

//

/** @namespace */
var THREEx		= THREEx 		|| {};
THREEx.FullScreen	= THREEx.FullScreen	|| {};

/**
 * test if it is possible to have fullscreen
 * 
 * @returns {Boolean} true if fullscreen API is available, false otherwise
*/
THREEx.FullScreen.available	= function()
{
	return this._hasWebkitFullScreen || this._hasMozFullScreen;
}

/**
 * test if fullscreen is currently activated
 * 
 * @returns {Boolean} true if fullscreen is currently activated, false otherwise
*/
THREEx.FullScreen.activated	= function()
{
	if( this._hasWebkitFullScreen ){
		return document.webkitIsFullScreen;
	}else if( this._hasMozFullScreen ){
		return document.mozFullScreen;
	}else{
		console.assert(false);
	}
}

/**
 * Request fullscreen on a given element
 * @param {DomElement} element to make fullscreen. optional. default to document.body
*/
THREEx.FullScreen.request	= function(element)
{
	element	= element	|| document.body;
	if( this._hasWebkitFullScreen ){
		element.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
	}else if( this._hasMozFullScreen ){
		element.mozRequestFullScreen();
	}else{
		console.assert(false);
	}
}

/**
 * Cancel fullscreen
*/
THREEx.FullScreen.cancel	= function()
{
	if( this._hasWebkitFullScreen ){
		document.webkitCancelFullScreen();
	}else if( this._hasMozFullScreen ){
		document.mozCancelFullScreen();
	}else{
		console.assert(false);
	}
}


// internal functions to know which fullscreen API implementation is available
THREEx.FullScreen._hasWebkitFullScreen	= 'webkitCancelFullScreen' in document	? true : false;	
THREEx.FullScreen._hasMozFullScreen	= 'mozCancelFullScreen' in document	? true : false;	

/**
 * Bind a key to renderer screenshot
*/
THREEx.FullScreen.bindKey	= function(opts){
	opts		= opts		|| {};
	var charCode	= opts.charCode	|| 'f'.charCodeAt(0);
	var dblclick	= opts.dblclick !== undefined ? opts.dblclick : false;
	var element	= opts.element

	var toggle	= function(){
		if( THREEx.FullScreen.activated() ){
			THREEx.FullScreen.cancel();
		}else{
			THREEx.FullScreen.request(element);
		}		
	}

	// callback to handle keypress
	var __bind	= function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
	var onKeyPress	= __bind(function(event){
		// return now if the KeyPress isnt for the proper charCode
		if( event.which !== charCode )	return;
		// toggle fullscreen
		toggle();
	}, this);

	// listen to keypress
	// NOTE: for firefox it seems mandatory to listen to document directly
	document.addEventListener('keypress', onKeyPress, false);
	// listen to dblclick
	dblclick && document.addEventListener('dblclick', toggle, false);

	return {
		unbind	: function(){
			document.removeEventListener('keypress', onKeyPress, false);
			dblclick && document.removeEventListener('dblclick', toggle, false);
		}
	};
}
/** @namespace */
var THREEx	= THREEx 		|| {};

THREEx.DragPanControls	= function(object, domElement)
{
	this._object	= object;
	this._domElement= domElement || document;

	// parameters that you can change after initialisation
	this.target	= new THREE.Vector3(0, 0, 0);
	this.speedX	= 0.03;
	this.speedY	= 0.03;
	this.rangeX	= -40;
	this.rangeY	= +40;

	// private variables
	this._mouseX	= 0;
	this._mouseY	= 0;

	var _this	= this;
	this._$onMouseMove	= function(){ _this._onMouseMove.apply(_this, arguments); };
	this._$onTouchStart	= function(){ _this._onTouchStart.apply(_this, arguments); };
	this._$onTouchMove	= function(){ _this._onTouchMove.apply(_this, arguments); };

	this._domElement.addEventListener( 'mousemove', this._$onMouseMove, false );
	this._domElement.addEventListener( 'touchstart', this._$onTouchStart,false );
	this._domElement.addEventListener( 'touchmove', this._$onTouchMove, false );
}

THREEx.DragPanControls.prototype.destroy	= function()
{
	this._domElement.removeEventListener( 'mousemove', this._$onMouseMove, false );
	this._domElement.removeEventListener( 'touchstart', this._$onTouchStart,false );
	this._domElement.removeEventListener( 'touchmove', this._$onTouchMove, false );
}

THREEx.DragPanControls.prototype.update	= function(event)
{
	this._object.position.x += ( this._mouseX * this.rangeX - this._object.position.x ) * this.speedX;
	this._object.position.y += ( this._mouseY * this.rangeY - this._object.position.y ) * this.speedY;
	this._object.lookAt( this.target );
}

THREEx.DragPanControls.prototype._onMouseMove	= function(event)
{
	this._mouseX	= ( event.clientX / window.innerWidth ) - 0.5;
	this._mouseY	= ( event.clientY / window.innerHeight) - 0.5;
}

THREEx.DragPanControls.prototype._onTouchStart	= function(event)
{
	if( event.touches.length != 1 )	return;

	// no preventDefault to get click event on ios

	this._mouseX	= ( event.touches[ 0 ].pageX / window.innerWidth ) - 0.5;
	this._mouseY	= ( event.touches[ 0 ].pageY / window.innerHeight) - 0.5;
}

THREEx.DragPanControls.prototype._onTouchMove	= function(event)
{
	if( event.touches.length != 1 )	return;

	event.preventDefault();

	this._mouseX	= ( event.touches[ 0 ].pageX / window.innerWidth ) - 0.5;
	this._mouseY	= ( event.touches[ 0 ].pageY / window.innerHeight) - 0.5;
}

// stats.js r10 - http://github.com/mrdoob/stats.js
var Stats=function(){var l=Date.now(),m=l,g=0,n=1E3,o=0,h=0,p=1E3,q=0,r=0,s=0,f=document.createElement("div");f.id="stats";f.addEventListener("mousedown",function(b){b.preventDefault();t(++s%2)},!1);f.style.cssText="width:80px;opacity:0.9;cursor:pointer";var a=document.createElement("div");a.id="fps";a.style.cssText="padding:0 0 3px 3px;text-align:left;background-color:#002";f.appendChild(a);var i=document.createElement("div");i.id="fpsText";i.style.cssText="color:#0ff;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px";
i.innerHTML="FPS";a.appendChild(i);var c=document.createElement("div");c.id="fpsGraph";c.style.cssText="position:relative;width:74px;height:30px;background-color:#0ff";for(a.appendChild(c);74>c.children.length;){var j=document.createElement("span");j.style.cssText="width:1px;height:30px;float:left;background-color:#113";c.appendChild(j)}var d=document.createElement("div");d.id="ms";d.style.cssText="padding:0 0 3px 3px;text-align:left;background-color:#020;display:none";f.appendChild(d);var k=document.createElement("div");
k.id="msText";k.style.cssText="color:#0f0;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px";k.innerHTML="MS";d.appendChild(k);var e=document.createElement("div");e.id="msGraph";e.style.cssText="position:relative;width:74px;height:30px;background-color:#0f0";for(d.appendChild(e);74>e.children.length;)j=document.createElement("span"),j.style.cssText="width:1px;height:30px;float:left;background-color:#131",e.appendChild(j);var t=function(b){s=b;switch(s){case 0:a.style.display=
"block";d.style.display="none";break;case 1:a.style.display="none",d.style.display="block"}};return{domElement:f,setMode:t,begin:function(){l=Date.now()},end:function(){var b=Date.now();g=b-l;n=Math.min(n,g);o=Math.max(o,g);k.textContent=g+" MS ("+n+"-"+o+")";var a=Math.min(30,30-30*(g/200));e.appendChild(e.firstChild).style.height=a+"px";r++;b>m+1E3&&(h=Math.round(1E3*r/(b-m)),p=Math.min(p,h),q=Math.max(q,h),i.textContent=h+" FPS ("+p+"-"+q+")",a=Math.min(30,30-30*(h/100)),c.appendChild(c.firstChild).style.height=
a+"px",m=b,r=0);return b},update:function(){l=this.end()}}};
