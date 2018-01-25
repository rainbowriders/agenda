/*!
 * angular-extend-promises v1.0.0-rc.3 - 2015-04-22
 * (c) 2014-2015 L.systems SARL, Etienne Folio, Quentin Raynaud
 * https://bitbucket.org/lsystems/angular-extend-promises
 * License: MIT
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define(factory);
	else if(typeof exports === 'object')
		exports["angular-extend-promises"] = factory();
	else
		root["angular-extend-promises"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	angular.module('angular-extend-promises', [])
	
	  .provider('angularExtendPromises', function() {
	    this.options = {
	      compatibilityAliases: true,
	      disableES5Methods: false
	    };
	
	    this.$get = function() {
	      return this.options;
	    };
	  })
	
	  .config(['$provide', function($provide) {
	    // In test mode, empty the cache before doing anything else
	    if (angular.mock) {
	      for (var key in __webpack_require__.c) {
	        delete __webpack_require__.c[key];
	      }
	    }
	
	    $provide.decorator('$q', ['$delegate', 'angularExtendPromises', function($delegate, angularExtendPromises) {
	      var globals = __webpack_require__(1);
	
	      globals.$delegate = $delegate;
	      globals.$options = angularExtendPromises;
	
	      return __webpack_require__(2);
	    }]);
	  }])
	
	;


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(3);
	
	_.extend(module.exports, {
	  $defer: _.noop(),
	  $delegate: {},
	  $options: {}
	});


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(3);
	var globals = __webpack_require__(1);
	var errors = __webpack_require__(4);
	
	var newq = module.exports = function(resolver) {
	  if (!_.isFunction(resolver))
	    throw new Error('resolver should be a function');
	
	  var deferred = newq.defer();
	  try {
	    resolver(deferred.resolve, deferred.reject);
	  }
	  catch (e) {
	    deferred.reject(e);
	  }
	  return deferred.promise;
	};
	
	_.extend(newq, {
	  // Methods & aliases
	  all: __webpack_require__(5),
	  any: __webpack_require__(6),
	  bind: __webpack_require__(7),
	  defer: __webpack_require__(8),
	  each: __webpack_require__(9),
	  filter: __webpack_require__(10),
	  map: __webpack_require__(11),
	  join: __webpack_require__(12),
	  method: __webpack_require__(13),
	  props: __webpack_require__(14),
	  reduce: __webpack_require__(15),
	  reject: __webpack_require__(16),
	  resolve: __webpack_require__(17),
	  some: __webpack_require__(18),
	  when: __webpack_require__(19),
	
	  // Errors
	  AggregateError: errors.AggregateError,
	  TimeoutError: errors.TimeoutError
	});
	
	if (globals.$options.compatibilityAliases) {
	  _.extend(newq, {
	    attempt: __webpack_require__(20)
	  });
	}
	
	if (!globals.$options.disableES5Methods) {
	  _.extend(newq, {
	    'try': __webpack_require__(20)
	  });
	}


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/* global _ */
	
	try {
	  module.exports = __webpack_require__(21);
	}
	catch (e) {
	  module.exports = _;
	}


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var NewQError = module.exports.NewQError = function NewQError(message) {
	  this.name = this.constructor.name;
	  Error.apply(this, arguments);
	  this.message = message;
	  if (Error.captureStackTrace)
	    Error.captureStackTrace(this, this.constructor);
	  else
	    this.stack = (new Error()).stack;
	};
	
	NewQError.prototype.toString = function() {
	    return this.stack.toString();
	};
	
	NewQError.subError = function subError(SubError, Parent) {
	  Parent = Parent || NewQError;
	
	  function F() {}
	  F.prototype = Parent.prototype;
	  SubError.prototype = new F();
	  SubError.prototype.constructor = SubError;
	
	  if (SubError.subError)
	    return;
	
	  SubError.subError = function subError(SubSubError) {
	    NewQError.subError(SubSubError, SubError);
	  };
	};
	
	NewQError.subError(NewQError, Error);
	
	var AggregateError = module.exports.AggregateError = function AggregateError() {
	  NewQError.apply(this, arguments);
	};
	NewQError.subError(AggregateError);
	
	var TimeoutError = module.exports.TimeoutError = function TimeoutError() {
	  NewQError.apply(this, arguments);
	};
	NewQError.subError(TimeoutError);


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(3);
	var decorate = __webpack_require__(22);
	var globals = __webpack_require__(1);
	var newq = __webpack_require__(2);
	
	module.exports = function(promises) {
	  if (!_.isArray(promises))
	    return newq.props(promises);
	
	  promises = _.map(promises, function(promise) {
	    return newq.when(promise);
	  });
	
	  return decorate(globals.$delegate.all(promises));
	};


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var newq = __webpack_require__(2);
	
	module.exports = function(array) {
	  return newq.some(array, 1).get(0);
	};


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var newq = __webpack_require__(2);
	
	module.exports = function(oThis) {
	  return newq.resolve().bind(oThis);
	};


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var decorate = __webpack_require__(22);
	var globals = __webpack_require__(1);
	
	globals.$defer = function $defer(parent) {
	  var deferred = globals.$delegate.defer();
	  deferred.promise = decorate(deferred.promise, parent);
	  return deferred;
	};
	
	module.exports = function defer() {
	  return globals.$defer();
	};


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var walkCollection = __webpack_require__(23);
	
	module.exports = walkCollection('tap');


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(3);
	var newq = __webpack_require__(2);
	
	module.exports = function(array, cb, options) {
	  return newq.map(array, function(val) {
	    return newq.props({
	      val: val,
	      toFilter: cb.apply(null, arguments)
	    });
	  }, options)
	    .then(function(array) {
	      return _.map(_.filter(array, 'toFilter'), 'val');
	    })
	  ;
	};


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var walkCollection = __webpack_require__(23);
	
	module.exports = walkCollection('then');


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(3);
	var newq = __webpack_require__(2);
	
	module.exports = function join() {
	  var args = _.toArray(arguments);
	  var cb = args.pop();
	  return newq.all(args).spread(cb);
	};


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var attempt = __webpack_require__(20);
	
	module.exports = function(fn) {
	  return function() {
	    return attempt(fn, arguments, this);
	  };
	};


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(3);
	var newq = __webpack_require__(2);
	
	module.exports = function(obj) {
	  return newq.all(_.values(obj)).then(function(vals) {
	    return _.object(_.keys(obj), vals);
	  });
	};


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(3);
	var newq = __webpack_require__(2);
	
	module.exports = function(array, cb, initialValue) {
	  return _.reduce(array, function(acc, val, i) {
	    return newq.join(acc, val, function(acc, val) {
	      return cb(acc, val, i, array.length);
	    });
	  }, newq.resolve(initialValue));
	};


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var autoDecorate = __webpack_require__(24);
	
	module.exports = autoDecorate('reject');


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var newq = __webpack_require__(2);
	var autoDecorate = __webpack_require__(24);
	
	// depending Angular's version, $q.resolve might not exist
	module.exports = autoDecorate('resolve') || function(val) {
	  var def = newq.defer();
	  def.resolve(val);
	  return def.promise;
	};


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(3);
	var newq = __webpack_require__(2);
	var AggregateError = __webpack_require__(4).AggregateError;
	
	module.exports = function(array, count) {
	  if (array.length < count) {
	    return newq.reject(new AggregateError(
	      'initial array length (' + array.length + ') > count (' + count + ')'
	    ));
	  }
	
	  var rejectedCount = 0;
	  var res = [];
	  var def = newq.defer();
	
	  _.each(array, function(elt) {
	    newq.when(elt)
	      .tap(function(val) {
	        if (res === null)
	          return;
	
	        res.push(val);
	
	        // resolve when we have enough fulfilled elements
	        if (res.length >= count) {
	          def.resolve(res);
	          res = null;
	        }
	      })
	      .$$catch(function() {
	        if (res === null)
	          return;
	
	        ++rejectedCount;
	
	        // reject if objective cannot be fulfilled
	        if (array.length - rejectedCount < count) {
	          def.reject(new AggregateError(
	            'Cannot resolve promise: too many rejections (' + rejectedCount + ')'
	          ));
	          res = null;
	        }
	      })
	    ;
	  });
	
	  return def.promise;
	};


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var autoDecorate = __webpack_require__(24);
	
	module.exports = autoDecorate('when');


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(3);
	var newq = __webpack_require__(2);
	
	module.exports = function(fn, args, oThis) {
	  try {
	    if (!_.isEmpty(args) && !(_.isArray(args) || _.isArguments(args)))
	      args = [args];
	
	    return newq.when(fn.apply(oThis || this, args));
	  }
	  catch (err) {
	    return newq.reject(err);
	  }
	};


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module, global) {/**
	 * @license
	 * lodash 3.7.0 (Custom Build) <https://lodash.com/>
	 * Build: `lodash include="constant,defaults,each,extend,filter,isArray,isEmpty,isFunction,isArguments,keys,map,methods,noop,object,pick,reduce,toArray,values" -o tmp/lodash.js`
	 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <https://lodash.com/license>
	 */
	;(function() {
	
	  /** Used as a safe reference for `undefined` in pre-ES5 environments. */
	  var undefined;
	
	  /** Used as the semantic version number. */
	  var VERSION = '3.7.0';
	
	  /** Used as the `TypeError` message for "Functions" methods. */
	  var FUNC_ERROR_TEXT = 'Expected a function';
	
	  /** `Object#toString` result references. */
	  var argsTag = '[object Arguments]',
	      arrayTag = '[object Array]',
	      boolTag = '[object Boolean]',
	      dateTag = '[object Date]',
	      errorTag = '[object Error]',
	      funcTag = '[object Function]',
	      mapTag = '[object Map]',
	      numberTag = '[object Number]',
	      objectTag = '[object Object]',
	      regexpTag = '[object RegExp]',
	      setTag = '[object Set]',
	      stringTag = '[object String]',
	      weakMapTag = '[object WeakMap]';
	
	  var arrayBufferTag = '[object ArrayBuffer]',
	      float32Tag = '[object Float32Array]',
	      float64Tag = '[object Float64Array]',
	      int8Tag = '[object Int8Array]',
	      int16Tag = '[object Int16Array]',
	      int32Tag = '[object Int32Array]',
	      uint8Tag = '[object Uint8Array]',
	      uint8ClampedTag = '[object Uint8ClampedArray]',
	      uint16Tag = '[object Uint16Array]',
	      uint32Tag = '[object Uint32Array]';
	
	  /** Used to match property names within property paths. */
	  var reIsDeepProp = /\.|\[(?:[^[\]]+|(["'])(?:(?!\1)[^\n\\]|\\.)*?)\1\]/,
	      reIsPlainProp = /^\w*$/,
	      rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\n\\]|\\.)*?)\2)\]/g;
	
	  /**
	   * Used to match `RegExp` [special characters](http://www.regular-expressions.info/characters.html#special).
	   * In addition to special characters the forward slash is escaped to allow for
	   * easier `eval` use and `Function` compilation.
	   */
	  var reRegExpChars = /[.*+?^${}()|[\]\/\\]/g,
	      reHasRegExpChars = RegExp(reRegExpChars.source);
	
	  /** Used to match backslashes in property paths. */
	  var reEscapeChar = /\\(\\)?/g;
	
	  /** Used to detect host constructors (Safari > 5). */
	  var reIsHostCtor = /^\[object .+?Constructor\]$/;
	
	  /** Used to fix the JScript `[[DontEnum]]` bug. */
	  var shadowProps = [
	    'constructor', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable',
	    'toLocaleString', 'toString', 'valueOf'
	  ];
	
	  /** Used to identify `toStringTag` values of typed arrays. */
	  var typedArrayTags = {};
	  typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
	  typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
	  typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
	  typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
	  typedArrayTags[uint32Tag] = true;
	  typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
	  typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
	  typedArrayTags[dateTag] = typedArrayTags[errorTag] =
	  typedArrayTags[funcTag] = typedArrayTags[mapTag] =
	  typedArrayTags[numberTag] = typedArrayTags[objectTag] =
	  typedArrayTags[regexpTag] = typedArrayTags[setTag] =
	  typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
	
	  /** Used to determine if values are of the language type `Object`. */
	  var objectTypes = {
	    'function': true,
	    'object': true
	  };
	
	  /** Detect free variable `exports`. */
	  var freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports;
	
	  /** Detect free variable `module`. */
	  var freeModule = objectTypes[typeof module] && module && !module.nodeType && module;
	
	  /** Detect free variable `global` from Node.js. */
	  var freeGlobal = freeExports && freeModule && typeof global == 'object' && global && global.Object && global;
	
	  /** Detect free variable `self`. */
	  var freeSelf = objectTypes[typeof self] && self && self.Object && self;
	
	  /** Detect free variable `window`. */
	  var freeWindow = objectTypes[typeof window] && window && window.Object && window;
	
	  /** Detect the popular CommonJS extension `module.exports`. */
	  var moduleExports = freeModule && freeModule.exports === freeExports && freeExports;
	
	  /**
	   * Used as a reference to the global object.
	   *
	   * The `this` value is used if it is the global object to avoid Greasemonkey's
	   * restricted `window` object, otherwise the `window` object is used.
	   */
	  var root = freeGlobal || ((freeWindow !== (this && this.window)) && freeWindow) || freeSelf || this;
	
	  /*--------------------------------------------------------------------------*/
	
	  /**
	   * The base implementation of `_.isFunction` without support for environments
	   * with incorrect `typeof` results.
	   *
	   * @private
	   * @param {*} value The value to check.
	   * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	   */
	  function baseIsFunction(value) {
	    // Avoid a Chakra JIT bug in compatibility modes of IE 11.
	    // See https://github.com/jashkenas/underscore/issues/1621 for more details.
	    return typeof value == 'function' || false;
	  }
	
	  /**
	   * Converts `value` to a string if it is not one. An empty string is returned
	   * for `null` or `undefined` values.
	   *
	   * @private
	   * @param {*} value The value to process.
	   * @returns {string} Returns the string.
	   */
	  function baseToString(value) {
	    if (typeof value == 'string') {
	      return value;
	    }
	    return value == null ? '' : (value + '');
	  }
	
	  /**
	   * Checks if `value` is a host object in IE < 9.
	   *
	   * @private
	   * @param {*} value The value to check.
	   * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
	   */
	  var isHostObject = (function() {
	    try {
	      Object({ 'toString': 0 } + '');
	    } catch(e) {
	      return function() { return false; };
	    }
	    return function(value) {
	      // IE < 9 presents many host objects as `Object` objects that can coerce
	      // to strings despite having improperly defined `toString` methods.
	      return typeof value.toString != 'function' && typeof (value + '') == 'string';
	    };
	  }());
	
	  /**
	   * Checks if `value` is object-like.
	   *
	   * @private
	   * @param {*} value The value to check.
	   * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	   */
	  function isObjectLike(value) {
	    return !!value && typeof value == 'object';
	  }
	
	  /*--------------------------------------------------------------------------*/
	
	  /** Used for native method references. */
	  var arrayProto = Array.prototype,
	      errorProto = Error.prototype,
	      objectProto = Object.prototype,
	      stringProto = String.prototype;
	
	  /** Used to resolve the decompiled source of functions. */
	  var fnToString = Function.prototype.toString;
	
	  /** Used to check objects for own properties. */
	  var hasOwnProperty = objectProto.hasOwnProperty;
	
	  /**
	   * Used to resolve the [`toStringTag`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring)
	   * of values.
	   */
	  var objToString = objectProto.toString;
	
	  /** Used to detect if a method is native. */
	  var reIsNative = RegExp('^' +
	    escapeRegExp(objToString)
	    .replace(/toString|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
	  );
	
	  /** Native method references. */
	  var getOwnPropertySymbols = isNative(getOwnPropertySymbols = Object.getOwnPropertySymbols) && getOwnPropertySymbols,
	      push = arrayProto.push,
	      preventExtensions = isNative(Object.preventExtensions = Object.preventExtensions) && preventExtensions,
	      propertyIsEnumerable = objectProto.propertyIsEnumerable,
	      splice = arrayProto.splice,
	      Uint8Array = isNative(Uint8Array = root.Uint8Array) && Uint8Array;
	
	  /** Used as `baseAssign`. */
	  var nativeAssign = (function() {
	    // Avoid `Object.assign` in Firefox 34-37 which have an early implementation
	    // with a now defunct try/catch behavior. See https://bugzilla.mozilla.org/show_bug.cgi?id=1103344
	    // for more details.
	    //
	    // Use `Object.preventExtensions` on a plain object instead of simply using
	    // `Object('x')` because Chrome and IE fail to throw an error when attempting
	    // to assign values to readonly indexes of strings in strict mode.
	    var object = { '1': 0 },
	        func = preventExtensions && isNative(func = Object.assign) && func;
	
	    try { func(preventExtensions(object), 'xo'); } catch(e) {}
	    return !object[1] && func;
	  }());
	
	  /* Native method references for those with the same name as other `lodash` methods. */
	  var nativeIsArray = isNative(nativeIsArray = Array.isArray) && nativeIsArray,
	      nativeKeys = isNative(nativeKeys = Object.keys) && nativeKeys,
	      nativeMax = Math.max;
	
	  /**
	   * Used as the [maximum length](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-number.max_safe_integer)
	   * of an array-like value.
	   */
	  var MAX_SAFE_INTEGER = Math.pow(2, 53) - 1;
	
	  /** Used to avoid iterating over non-enumerable properties in IE < 9. */
	  var nonEnumProps = {};
	  nonEnumProps[arrayTag] = nonEnumProps[dateTag] = nonEnumProps[numberTag] = { 'constructor': true, 'toLocaleString': true, 'toString': true, 'valueOf': true };
	  nonEnumProps[boolTag] = nonEnumProps[stringTag] = { 'constructor': true, 'toString': true, 'valueOf': true };
	  nonEnumProps[errorTag] = nonEnumProps[funcTag] = nonEnumProps[regexpTag] = { 'constructor': true, 'toString': true };
	  nonEnumProps[objectTag] = { 'constructor': true };
	
	  arrayEach(shadowProps, function(key) {
	    for (var tag in nonEnumProps) {
	      if (hasOwnProperty.call(nonEnumProps, tag)) {
	        var props = nonEnumProps[tag];
	        props[key] = hasOwnProperty.call(props, key);
	      }
	    }
	  });
	
	  /*------------------------------------------------------------------------*/
	
	  /**
	   * Creates a `lodash` object which wraps `value` to enable implicit chaining.
	   * Methods that operate on and return arrays, collections, and functions can
	   * be chained together. Methods that return a boolean or single value will
	   * automatically end the chain returning the unwrapped value. Explicit chaining
	   * may be enabled using `_.chain`. The execution of chained methods is lazy,
	   * that is, execution is deferred until `_#value` is implicitly or explicitly
	   * called.
	   *
	   * Lazy evaluation allows several methods to support shortcut fusion. Shortcut
	   * fusion is an optimization that merges iteratees to avoid creating intermediate
	   * arrays and reduce the number of iteratee executions.
	   *
	   * Chaining is supported in custom builds as long as the `_#value` method is
	   * directly or indirectly included in the build.
	   *
	   * In addition to lodash methods, wrappers have `Array` and `String` methods.
	   *
	   * The wrapper `Array` methods are:
	   * `concat`, `join`, `pop`, `push`, `reverse`, `shift`, `slice`, `sort`,
	   * `splice`, and `unshift`
	   *
	   * The wrapper `String` methods are:
	   * `replace` and `split`
	   *
	   * The wrapper methods that support shortcut fusion are:
	   * `compact`, `drop`, `dropRight`, `dropRightWhile`, `dropWhile`, `filter`,
	   * `first`, `initial`, `last`, `map`, `pluck`, `reject`, `rest`, `reverse`,
	   * `slice`, `take`, `takeRight`, `takeRightWhile`, `takeWhile`, `toArray`,
	   * and `where`
	   *
	   * The chainable wrapper methods are:
	   * `after`, `ary`, `assign`, `at`, `before`, `bind`, `bindAll`, `bindKey`,
	   * `callback`, `chain`, `chunk`, `commit`, `compact`, `concat`, `constant`,
	   * `countBy`, `create`, `curry`, `debounce`, `defaults`, `defer`, `delay`,
	   * `difference`, `drop`, `dropRight`, `dropRightWhile`, `dropWhile`, `fill`,
	   * `filter`, `flatten`, `flattenDeep`, `flow`, `flowRight`, `forEach`,
	   * `forEachRight`, `forIn`, `forInRight`, `forOwn`, `forOwnRight`, `functions`,
	   * `groupBy`, `indexBy`, `initial`, `intersection`, `invert`, `invoke`, `keys`,
	   * `keysIn`, `map`, `mapValues`, `matches`, `matchesProperty`, `memoize`,
	   * `merge`, `mixin`, `negate`, `omit`, `once`, `pairs`, `partial`, `partialRight`,
	   * `partition`, `pick`, `plant`, `pluck`, `property`, `propertyOf`, `pull`,
	   * `pullAt`, `push`, `range`, `rearg`, `reject`, `remove`, `rest`, `reverse`,
	   * `shuffle`, `slice`, `sort`, `sortBy`, `sortByAll`, `sortByOrder`, `splice`,
	   * `spread`, `take`, `takeRight`, `takeRightWhile`, `takeWhile`, `tap`,
	   * `throttle`, `thru`, `times`, `toArray`, `toPlainObject`, `transform`,
	   * `union`, `uniq`, `unshift`, `unzip`, `values`, `valuesIn`, `where`,
	   * `without`, `wrap`, `xor`, `zip`, and `zipObject`
	   *
	   * The wrapper methods that are **not** chainable by default are:
	   * `add`, `attempt`, `camelCase`, `capitalize`, `clone`, `cloneDeep`, `deburr`,
	   * `endsWith`, `escape`, `escapeRegExp`, `every`, `find`, `findIndex`, `findKey`,
	   * `findLast`, `findLastIndex`, `findLastKey`, `findWhere`, `first`, `has`,
	   * `identity`, `includes`, `indexOf`, `inRange`, `isArguments`, `isArray`,
	   * `isBoolean`, `isDate`, `isElement`, `isEmpty`, `isEqual`, `isError`, `isFinite`
	   * `isFunction`, `isMatch`, `isNative`, `isNaN`, `isNull`, `isNumber`, `isObject`,
	   * `isPlainObject`, `isRegExp`, `isString`, `isUndefined`, `isTypedArray`,
	   * `join`, `kebabCase`, `last`, `lastIndexOf`, `max`, `min`, `noConflict`,
	   * `noop`, `now`, `pad`, `padLeft`, `padRight`, `parseInt`, `pop`, `random`,
	   * `reduce`, `reduceRight`, `repeat`, `result`, `runInContext`, `shift`, `size`,
	   * `snakeCase`, `some`, `sortedIndex`, `sortedLastIndex`, `startCase`, `startsWith`,
	   * `sum`, `template`, `trim`, `trimLeft`, `trimRight`, `trunc`, `unescape`,
	   * `uniqueId`, `value`, and `words`
	   *
	   * The wrapper method `sample` will return a wrapped value when `n` is provided,
	   * otherwise an unwrapped value is returned.
	   *
	   * @name _
	   * @constructor
	   * @category Chain
	   * @param {*} value The value to wrap in a `lodash` instance.
	   * @returns {Object} Returns the new `lodash` wrapper instance.
	   * @example
	   *
	   * var wrapped = _([1, 2, 3]);
	   *
	   * // returns an unwrapped value
	   * wrapped.reduce(function(total, n) {
	   *   return total + n;
	   * });
	   * // => 6
	   *
	   * // returns a wrapped value
	   * var squares = wrapped.map(function(n) {
	   *   return n * n;
	   * });
	   *
	   * _.isArray(squares);
	   * // => false
	   *
	   * _.isArray(squares.value());
	   * // => true
	   */
	  function lodash() {
	    // No operation performed.
	  }
	
	  /**
	   * An object environment feature flags.
	   *
	   * @static
	   * @memberOf _
	   * @type Object
	   */
	  var support = lodash.support = {};
	
	  (function(x) {
	    var Ctor = function() { this.x = x; },
	        object = { '0': x, 'length': x },
	        props = [];
	
	    Ctor.prototype = { 'valueOf': x, 'y': x };
	    for (var key in new Ctor) { props.push(key); }
	
	    /**
	     * Detect if the `toStringTag` of `arguments` objects is resolvable
	     * (all but Firefox < 4, IE < 9).
	     *
	     * @memberOf _.support
	     * @type boolean
	     */
	    support.argsTag = objToString.call(arguments) == argsTag;
	
	    /**
	     * Detect if `name` or `message` properties of `Error.prototype` are
	     * enumerable by default (IE < 9, Safari < 5.1).
	     *
	     * @memberOf _.support
	     * @type boolean
	     */
	    support.enumErrorProps = propertyIsEnumerable.call(errorProto, 'message') ||
	      propertyIsEnumerable.call(errorProto, 'name');
	
	    /**
	     * Detect if `prototype` properties are enumerable by default.
	     *
	     * Firefox < 3.6, Opera > 9.50 - Opera < 11.60, and Safari < 5.1
	     * (if the prototype or a property on the prototype has been set)
	     * incorrectly set the `[[Enumerable]]` value of a function's `prototype`
	     * property to `true`.
	     *
	     * @memberOf _.support
	     * @type boolean
	     */
	    support.enumPrototypes = propertyIsEnumerable.call(Ctor, 'prototype');
	
	    /**
	     * Detect if functions can be decompiled by `Function#toString`
	     * (all but Firefox OS certified apps, older Opera mobile browsers, and
	     * the PlayStation 3; forced `false` for Windows 8 apps).
	     *
	     * @memberOf _.support
	     * @type boolean
	     */
	    support.funcDecomp = /\bthis\b/.test(function() { return this; });
	
	    /**
	     * Detect if `Function#name` is supported (all but IE).
	     *
	     * @memberOf _.support
	     * @type boolean
	     */
	    support.funcNames = typeof Function.name == 'string';
	
	    /**
	     * Detect if string indexes are non-enumerable (IE < 9, RingoJS, Rhino, Narwhal).
	     *
	     * @memberOf _.support
	     * @type boolean
	     */
	    support.nonEnumStrings = !propertyIsEnumerable.call('x', 0);
	
	    /**
	     * Detect if properties shadowing those on `Object.prototype` are non-enumerable.
	     *
	     * In IE < 9 an object's own properties, shadowing non-enumerable ones,
	     * are made non-enumerable as well (a.k.a the JScript `[[DontEnum]]` bug).
	     *
	     * @memberOf _.support
	     * @type boolean
	     */
	    support.nonEnumShadows = !/valueOf/.test(props);
	
	    /**
	     * Detect if `Array#shift` and `Array#splice` augment array-like objects
	     * correctly.
	     *
	     * Firefox < 10, compatibility modes of IE 8, and IE < 9 have buggy Array
	     * `shift()` and `splice()` functions that fail to remove the last element,
	     * `value[0]`, of array-like objects even though the "length" property is
	     * set to `0`. The `shift()` method is buggy in compatibility modes of IE 8,
	     * while `splice()` is buggy regardless of mode in IE < 9.
	     *
	     * @memberOf _.support
	     * @type boolean
	     */
	    support.spliceObjects = (splice.call(object, 0, 1), !object[0]);
	
	    /**
	     * Detect lack of support for accessing string characters by index.
	     *
	     * IE < 8 can't access characters by index. IE 8 can only access characters
	     * by index on string literals, not string objects.
	     *
	     * @memberOf _.support
	     * @type boolean
	     */
	    support.unindexedChars = ('x'[0] + Object('x')[0]) != 'xx';
	
	    /**
	     * Detect if `arguments` object indexes are non-enumerable.
	     *
	     * In Firefox < 4, IE < 9, PhantomJS, and Safari < 5.1 `arguments` object
	     * indexes are non-enumerable. Chrome < 25 and Node.js < 0.11.0 treat
	     * `arguments` object indexes as non-enumerable and fail `hasOwnProperty`
	     * checks for indexes that exceed the number of function parameters and
	     * whose associated argument values are `0`.
	     *
	     * @memberOf _.support
	     * @type boolean
	     */
	    try {
	      support.nonEnumArgs = !propertyIsEnumerable.call(arguments, 1);
	    } catch(e) {
	      support.nonEnumArgs = true;
	    }
	  }(1, 0));
	
	  /*------------------------------------------------------------------------*/
	
	  /**
	   * Copies the values of `source` to `array`.
	   *
	   * @private
	   * @param {Array} source The array to copy values from.
	   * @param {Array} [array=[]] The array to copy values to.
	   * @returns {Array} Returns `array`.
	   */
	  function arrayCopy(source, array) {
	    var index = -1,
	        length = source.length;
	
	    array || (array = Array(length));
	    while (++index < length) {
	      array[index] = source[index];
	    }
	    return array;
	  }
	
	  /**
	   * A specialized version of `_.forEach` for arrays without support for callback
	   * shorthands and `this` binding.
	   *
	   * @private
	   * @param {Array} array The array to iterate over.
	   * @param {Function} iteratee The function invoked per iteration.
	   * @returns {Array} Returns `array`.
	   */
	  function arrayEach(array, iteratee) {
	    var index = -1,
	        length = array.length;
	
	    while (++index < length) {
	      if (iteratee(array[index], index, array) === false) {
	        break;
	      }
	    }
	    return array;
	  }
	
	  /**
	   * A specialized version of `_.filter` for arrays without support for callback
	   * shorthands and `this` binding.
	   *
	   * @private
	   * @param {Array} array The array to iterate over.
	   * @param {Function} predicate The function invoked per iteration.
	   * @returns {Array} Returns the new filtered array.
	   */
	  function arrayFilter(array, predicate) {
	    var index = -1,
	        length = array.length,
	        resIndex = -1,
	        result = [];
	
	    while (++index < length) {
	      var value = array[index];
	      if (predicate(value, index, array)) {
	        result[++resIndex] = value;
	      }
	    }
	    return result;
	  }
	
	  /**
	   * A specialized version of `_.map` for arrays without support for callback
	   * shorthands and `this` binding.
	   *
	   * @private
	   * @param {Array} array The array to iterate over.
	   * @param {Function} iteratee The function invoked per iteration.
	   * @returns {Array} Returns the new mapped array.
	   */
	  function arrayMap(array, iteratee) {
	    var index = -1,
	        length = array.length,
	        result = Array(length);
	
	    while (++index < length) {
	      result[index] = iteratee(array[index], index, array);
	    }
	    return result;
	  }
	
	  /**
	   * A specialized version of `_.reduce` for arrays without support for callback
	   * shorthands and `this` binding.
	   *
	   * @private
	   * @param {Array} array The array to iterate over.
	   * @param {Function} iteratee The function invoked per iteration.
	   * @param {*} [accumulator] The initial value.
	   * @param {boolean} [initFromArray] Specify using the first element of `array`
	   *  as the initial value.
	   * @returns {*} Returns the accumulated value.
	   */
	  function arrayReduce(array, iteratee, accumulator, initFromArray) {
	    var index = -1,
	        length = array.length;
	
	    if (initFromArray && length) {
	      accumulator = array[++index];
	    }
	    while (++index < length) {
	      accumulator = iteratee(accumulator, array[index], index, array);
	    }
	    return accumulator;
	  }
	
	  /**
	   * Used by `_.defaults` to customize its `_.assign` use.
	   *
	   * @private
	   * @param {*} objectValue The destination object property value.
	   * @param {*} sourceValue The source object property value.
	   * @returns {*} Returns the value to assign to the destination object.
	   */
	  function assignDefaults(objectValue, sourceValue) {
	    return objectValue === undefined ? sourceValue : objectValue;
	  }
	
	  /**
	   * A specialized version of `_.assign` for customizing assigned values without
	   * support for argument juggling, multiple sources, and `this` binding `customizer`
	   * functions.
	   *
	   * @private
	   * @param {Object} object The destination object.
	   * @param {Object} source The source object.
	   * @param {Function} customizer The function to customize assigned values.
	   * @returns {Object} Returns `object`.
	   */
	  function assignWith(object, source, customizer) {
	    var props = keys(source);
	    push.apply(props, getSymbols(source));
	
	    var index = -1,
	        length = props.length;
	
	    while (++index < length) {
	      var key = props[index],
	          value = object[key],
	          result = customizer(value, source[key], key, object, source);
	
	      if ((result === result ? (result !== value) : (value === value)) ||
	          (value === undefined && !(key in object))) {
	        object[key] = result;
	      }
	    }
	    return object;
	  }
	
	  /**
	   * The base implementation of `_.assign` without support for argument juggling,
	   * multiple sources, and `customizer` functions.
	   *
	   * @private
	   * @param {Object} object The destination object.
	   * @param {Object} source The source object.
	   * @returns {Object} Returns `object`.
	   */
	  var baseAssign = nativeAssign || function(object, source) {
	    return source == null
	      ? object
	      : baseCopy(source, getSymbols(source), baseCopy(source, keys(source), object));
	  };
	
	  /**
	   * Copies properties of `source` to `object`.
	   *
	   * @private
	   * @param {Object} source The object to copy properties from.
	   * @param {Array} props The property names to copy.
	   * @param {Object} [object={}] The object to copy properties to.
	   * @returns {Object} Returns `object`.
	   */
	  function baseCopy(source, props, object) {
	    object || (object = {});
	
	    var index = -1,
	        length = props.length;
	
	    while (++index < length) {
	      var key = props[index];
	      object[key] = source[key];
	    }
	    return object;
	  }
	
	  /**
	   * The base implementation of `_.callback` which supports specifying the
	   * number of arguments to provide to `func`.
	   *
	   * @private
	   * @param {*} [func=_.identity] The value to convert to a callback.
	   * @param {*} [thisArg] The `this` binding of `func`.
	   * @param {number} [argCount] The number of arguments to provide to `func`.
	   * @returns {Function} Returns the callback.
	   */
	  function baseCallback(func, thisArg, argCount) {
	    var type = typeof func;
	    if (type == 'function') {
	      return thisArg === undefined
	        ? func
	        : bindCallback(func, thisArg, argCount);
	    }
	    if (func == null) {
	      return identity;
	    }
	    if (type == 'object') {
	      return baseMatches(func);
	    }
	    return thisArg === undefined
	      ? property(func)
	      : baseMatchesProperty(func, thisArg);
	  }
	
	  /**
	   * The base implementation of `_.forEach` without support for callback
	   * shorthands and `this` binding.
	   *
	   * @private
	   * @param {Array|Object|string} collection The collection to iterate over.
	   * @param {Function} iteratee The function invoked per iteration.
	   * @returns {Array|Object|string} Returns `collection`.
	   */
	  var baseEach = createBaseEach(baseForOwn);
	
	  /**
	   * The base implementation of `_.filter` without support for callback
	   * shorthands and `this` binding.
	   *
	   * @private
	   * @param {Array|Object|string} collection The collection to iterate over.
	   * @param {Function} predicate The function invoked per iteration.
	   * @returns {Array} Returns the new filtered array.
	   */
	  function baseFilter(collection, predicate) {
	    var result = [];
	    baseEach(collection, function(value, index, collection) {
	      if (predicate(value, index, collection)) {
	        result.push(value);
	      }
	    });
	    return result;
	  }
	
	  /**
	   * The base implementation of `_.flatten` with added support for restricting
	   * flattening and specifying the start index.
	   *
	   * @private
	   * @param {Array} array The array to flatten.
	   * @param {boolean} isDeep Specify a deep flatten.
	   * @param {boolean} isStrict Restrict flattening to arrays and `arguments` objects.
	   * @returns {Array} Returns the new flattened array.
	   */
	  function baseFlatten(array, isDeep, isStrict) {
	    var index = -1,
	        length = array.length,
	        resIndex = -1,
	        result = [];
	
	    while (++index < length) {
	      var value = array[index];
	
	      if (isObjectLike(value) && isLength(value.length) && (isArray(value) || isArguments(value))) {
	        if (isDeep) {
	          // Recursively flatten arrays (susceptible to call stack limits).
	          value = baseFlatten(value, isDeep, isStrict);
	        }
	        var valIndex = -1,
	            valLength = value.length;
	
	        result.length += valLength;
	        while (++valIndex < valLength) {
	          result[++resIndex] = value[valIndex];
	        }
	      } else if (!isStrict) {
	        result[++resIndex] = value;
	      }
	    }
	    return result;
	  }
	
	  /**
	   * The base implementation of `baseForIn` and `baseForOwn` which iterates
	   * over `object` properties returned by `keysFunc` invoking `iteratee` for
	   * each property. Iteratee functions may exit iteration early by explicitly
	   * returning `false`.
	   *
	   * @private
	   * @param {Object} object The object to iterate over.
	   * @param {Function} iteratee The function invoked per iteration.
	   * @param {Function} keysFunc The function to get the keys of `object`.
	   * @returns {Object} Returns `object`.
	   */
	  var baseFor = createBaseFor();
	
	  /**
	   * The base implementation of `_.forIn` without support for callback
	   * shorthands and `this` binding.
	   *
	   * @private
	   * @param {Object} object The object to iterate over.
	   * @param {Function} iteratee The function invoked per iteration.
	   * @returns {Object} Returns `object`.
	   */
	  function baseForIn(object, iteratee) {
	    return baseFor(object, iteratee, keysIn);
	  }
	
	  /**
	   * The base implementation of `_.forOwn` without support for callback
	   * shorthands and `this` binding.
	   *
	   * @private
	   * @param {Object} object The object to iterate over.
	   * @param {Function} iteratee The function invoked per iteration.
	   * @returns {Object} Returns `object`.
	   */
	  function baseForOwn(object, iteratee) {
	    return baseFor(object, iteratee, keys);
	  }
	
	  /**
	   * The base implementation of `_.functions` which creates an array of
	   * `object` function property names filtered from those provided.
	   *
	   * @private
	   * @param {Object} object The object to inspect.
	   * @param {Array} props The property names to filter.
	   * @returns {Array} Returns the new array of filtered property names.
	   */
	  function baseFunctions(object, props) {
	    var index = -1,
	        length = props.length,
	        resIndex = -1,
	        result = [];
	
	    while (++index < length) {
	      var key = props[index];
	      if (isFunction(object[key])) {
	        result[++resIndex] = key;
	      }
	    }
	    return result;
	  }
	
	  /**
	   * The base implementation of `get` without support for string paths
	   * and default values.
	   *
	   * @private
	   * @param {Object} object The object to query.
	   * @param {Array} path The path of the property to get.
	   * @param {string} [pathKey] The key representation of path.
	   * @returns {*} Returns the resolved value.
	   */
	  function baseGet(object, path, pathKey) {
	    if (object == null) {
	      return;
	    }
	    object = toObject(object);
	    if (pathKey !== undefined && pathKey in object) {
	      path = [pathKey];
	    }
	    var index = -1,
	        length = path.length;
	
	    while (object != null && ++index < length) {
	      var result = object = toObject(object)[path[index]];
	    }
	    return result;
	  }
	
	  /**
	   * The base implementation of `_.isEqual` without support for `this` binding
	   * `customizer` functions.
	   *
	   * @private
	   * @param {*} value The value to compare.
	   * @param {*} other The other value to compare.
	   * @param {Function} [customizer] The function to customize comparing values.
	   * @param {boolean} [isLoose] Specify performing partial comparisons.
	   * @param {Array} [stackA] Tracks traversed `value` objects.
	   * @param {Array} [stackB] Tracks traversed `other` objects.
	   * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
	   */
	  function baseIsEqual(value, other, customizer, isLoose, stackA, stackB) {
	    // Exit early for identical values.
	    if (value === other) {
	      // Treat `+0` vs. `-0` as not equal.
	      return value !== 0 || (1 / value == 1 / other);
	    }
	    var valType = typeof value,
	        othType = typeof other;
	
	    // Exit early for unlike primitive values.
	    if ((valType != 'function' && valType != 'object' && othType != 'function' && othType != 'object') ||
	        value == null || other == null) {
	      // Return `false` unless both values are `NaN`.
	      return value !== value && other !== other;
	    }
	    return baseIsEqualDeep(value, other, baseIsEqual, customizer, isLoose, stackA, stackB);
	  }
	
	  /**
	   * A specialized version of `baseIsEqual` for arrays and objects which performs
	   * deep comparisons and tracks traversed objects enabling objects with circular
	   * references to be compared.
	   *
	   * @private
	   * @param {Object} object The object to compare.
	   * @param {Object} other The other object to compare.
	   * @param {Function} equalFunc The function to determine equivalents of values.
	   * @param {Function} [customizer] The function to customize comparing objects.
	   * @param {boolean} [isLoose] Specify performing partial comparisons.
	   * @param {Array} [stackA=[]] Tracks traversed `value` objects.
	   * @param {Array} [stackB=[]] Tracks traversed `other` objects.
	   * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
	   */
	  function baseIsEqualDeep(object, other, equalFunc, customizer, isLoose, stackA, stackB) {
	    var objIsArr = isArray(object),
	        othIsArr = isArray(other),
	        objTag = arrayTag,
	        othTag = arrayTag;
	
	    if (!objIsArr) {
	      objTag = objToString.call(object);
	      if (objTag == argsTag) {
	        objTag = objectTag;
	      } else if (objTag != objectTag) {
	        objIsArr = isTypedArray(object);
	      }
	    }
	    if (!othIsArr) {
	      othTag = objToString.call(other);
	      if (othTag == argsTag) {
	        othTag = objectTag;
	      } else if (othTag != objectTag) {
	        othIsArr = isTypedArray(other);
	      }
	    }
	    var objIsObj = objTag == objectTag && !isHostObject(object),
	        othIsObj = othTag == objectTag && !isHostObject(other),
	        isSameTag = objTag == othTag;
	
	    if (isSameTag && !(objIsArr || objIsObj)) {
	      return equalByTag(object, other, objTag);
	    }
	    if (!isLoose) {
	      var valWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
	          othWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');
	
	      if (valWrapped || othWrapped) {
	        return equalFunc(valWrapped ? object.value() : object, othWrapped ? other.value() : other, customizer, isLoose, stackA, stackB);
	      }
	    }
	    if (!isSameTag) {
	      return false;
	    }
	    // Assume cyclic values are equal.
	    // For more information on detecting circular references see https://es5.github.io/#JO.
	    stackA || (stackA = []);
	    stackB || (stackB = []);
	
	    var length = stackA.length;
	    while (length--) {
	      if (stackA[length] == object) {
	        return stackB[length] == other;
	      }
	    }
	    // Add `object` and `other` to the stack of traversed objects.
	    stackA.push(object);
	    stackB.push(other);
	
	    var result = (objIsArr ? equalArrays : equalObjects)(object, other, equalFunc, customizer, isLoose, stackA, stackB);
	
	    stackA.pop();
	    stackB.pop();
	
	    return result;
	  }
	
	  /**
	   * The base implementation of `_.isMatch` without support for callback
	   * shorthands and `this` binding.
	   *
	   * @private
	   * @param {Object} object The object to inspect.
	   * @param {Array} props The source property names to match.
	   * @param {Array} values The source values to match.
	   * @param {Array} strictCompareFlags Strict comparison flags for source values.
	   * @param {Function} [customizer] The function to customize comparing objects.
	   * @returns {boolean} Returns `true` if `object` is a match, else `false`.
	   */
	  function baseIsMatch(object, props, values, strictCompareFlags, customizer) {
	    var index = -1,
	        length = props.length,
	        noCustomizer = !customizer;
	
	    while (++index < length) {
	      if ((noCustomizer && strictCompareFlags[index])
	            ? values[index] !== object[props[index]]
	            : !(props[index] in object)
	          ) {
	        return false;
	      }
	    }
	    index = -1;
	    while (++index < length) {
	      var key = props[index],
	          objValue = object[key],
	          srcValue = values[index];
	
	      if (noCustomizer && strictCompareFlags[index]) {
	        var result = objValue !== undefined || (key in object);
	      } else {
	        result = customizer ? customizer(objValue, srcValue, key) : undefined;
	        if (result === undefined) {
	          result = baseIsEqual(srcValue, objValue, customizer, true);
	        }
	      }
	      if (!result) {
	        return false;
	      }
	    }
	    return true;
	  }
	
	  /**
	   * The base implementation of `_.map` without support for callback shorthands
	   * and `this` binding.
	   *
	   * @private
	   * @param {Array|Object|string} collection The collection to iterate over.
	   * @param {Function} iteratee The function invoked per iteration.
	   * @returns {Array} Returns the new mapped array.
	   */
	  function baseMap(collection, iteratee) {
	    var index = -1,
	        length = getLength(collection),
	        result = isLength(length) ? Array(length) : [];
	
	    baseEach(collection, function(value, key, collection) {
	      result[++index] = iteratee(value, key, collection);
	    });
	    return result;
	  }
	
	  /**
	   * The base implementation of `_.matches` which does not clone `source`.
	   *
	   * @private
	   * @param {Object} source The object of property values to match.
	   * @returns {Function} Returns the new function.
	   */
	  function baseMatches(source) {
	    var props = keys(source),
	        length = props.length;
	
	    if (!length) {
	      return constant(true);
	    }
	    if (length == 1) {
	      var key = props[0],
	          value = source[key];
	
	      if (isStrictComparable(value)) {
	        return function(object) {
	          if (object == null) {
	            return false;
	          }
	          object = toObject(object);
	          return object[key] === value && (value !== undefined || (key in object));
	        };
	      }
	    }
	    var values = Array(length),
	        strictCompareFlags = Array(length);
	
	    while (length--) {
	      value = source[props[length]];
	      values[length] = value;
	      strictCompareFlags[length] = isStrictComparable(value);
	    }
	    return function(object) {
	      return object != null && baseIsMatch(toObject(object), props, values, strictCompareFlags);
	    };
	  }
	
	  /**
	   * The base implementation of `_.matchesProperty` which does not which does
	   * not clone `value`.
	   *
	   * @private
	   * @param {string} path The path of the property to get.
	   * @param {*} value The value to compare.
	   * @returns {Function} Returns the new function.
	   */
	  function baseMatchesProperty(path, value) {
	    var isArr = isArray(path),
	        isCommon = isKey(path) && isStrictComparable(value),
	        pathKey = (path + '');
	
	    path = toPath(path);
	    return function(object) {
	      if (object == null) {
	        return false;
	      }
	      var key = pathKey;
	      object = toObject(object);
	      if ((isArr || !isCommon) && !(key in object)) {
	        object = path.length == 1 ? object : baseGet(object, baseSlice(path, 0, -1));
	        if (object == null) {
	          return false;
	        }
	        key = last(path);
	        object = toObject(object);
	      }
	      return object[key] === value
	        ? (value !== undefined || (key in object))
	        : baseIsEqual(value, object[key], null, true);
	    };
	  }
	
	  /**
	   * The base implementation of `_.property` without support for deep paths.
	   *
	   * @private
	   * @param {string} key The key of the property to get.
	   * @returns {Function} Returns the new function.
	   */
	  function baseProperty(key) {
	    return function(object) {
	      return object == null ? undefined : toObject(object)[key];
	    };
	  }
	
	  /**
	   * A specialized version of `baseProperty` which supports deep paths.
	   *
	   * @private
	   * @param {Array|string} path The path of the property to get.
	   * @returns {Function} Returns the new function.
	   */
	  function basePropertyDeep(path) {
	    var pathKey = (path + '');
	    path = toPath(path);
	    return function(object) {
	      return baseGet(object, path, pathKey);
	    };
	  }
	
	  /**
	   * The base implementation of `_.reduce` and `_.reduceRight` without support
	   * for callback shorthands and `this` binding, which iterates over `collection`
	   * using the provided `eachFunc`.
	   *
	   * @private
	   * @param {Array|Object|string} collection The collection to iterate over.
	   * @param {Function} iteratee The function invoked per iteration.
	   * @param {*} accumulator The initial value.
	   * @param {boolean} initFromCollection Specify using the first or last element
	   *  of `collection` as the initial value.
	   * @param {Function} eachFunc The function to iterate over `collection`.
	   * @returns {*} Returns the accumulated value.
	   */
	  function baseReduce(collection, iteratee, accumulator, initFromCollection, eachFunc) {
	    eachFunc(collection, function(value, index, collection) {
	      accumulator = initFromCollection
	        ? (initFromCollection = false, value)
	        : iteratee(accumulator, value, index, collection);
	    });
	    return accumulator;
	  }
	
	  /**
	   * The base implementation of `_.slice` without an iteratee call guard.
	   *
	   * @private
	   * @param {Array} array The array to slice.
	   * @param {number} [start=0] The start position.
	   * @param {number} [end=array.length] The end position.
	   * @returns {Array} Returns the slice of `array`.
	   */
	  function baseSlice(array, start, end) {
	    var index = -1,
	        length = array.length;
	
	    start = start == null ? 0 : (+start || 0);
	    if (start < 0) {
	      start = -start > length ? 0 : (length + start);
	    }
	    end = (end === undefined || end > length) ? length : (+end || 0);
	    if (end < 0) {
	      end += length;
	    }
	    length = start > end ? 0 : ((end - start) >>> 0);
	    start >>>= 0;
	
	    var result = Array(length);
	    while (++index < length) {
	      result[index] = array[index + start];
	    }
	    return result;
	  }
	
	  /**
	   * The base implementation of `_.values` and `_.valuesIn` which creates an
	   * array of `object` property values corresponding to the property names
	   * of `props`.
	   *
	   * @private
	   * @param {Object} object The object to query.
	   * @param {Array} props The property names to get values for.
	   * @returns {Object} Returns the array of property values.
	   */
	  function baseValues(object, props) {
	    var index = -1,
	        length = props.length,
	        result = Array(length);
	
	    while (++index < length) {
	      result[index] = object[props[index]];
	    }
	    return result;
	  }
	
	  /**
	   * A specialized version of `baseCallback` which only supports `this` binding
	   * and specifying the number of arguments to provide to `func`.
	   *
	   * @private
	   * @param {Function} func The function to bind.
	   * @param {*} thisArg The `this` binding of `func`.
	   * @param {number} [argCount] The number of arguments to provide to `func`.
	   * @returns {Function} Returns the callback.
	   */
	  function bindCallback(func, thisArg, argCount) {
	    if (typeof func != 'function') {
	      return identity;
	    }
	    if (thisArg === undefined) {
	      return func;
	    }
	    switch (argCount) {
	      case 1: return function(value) {
	        return func.call(thisArg, value);
	      };
	      case 3: return function(value, index, collection) {
	        return func.call(thisArg, value, index, collection);
	      };
	      case 4: return function(accumulator, value, index, collection) {
	        return func.call(thisArg, accumulator, value, index, collection);
	      };
	      case 5: return function(value, other, key, object, source) {
	        return func.call(thisArg, value, other, key, object, source);
	      };
	    }
	    return function() {
	      return func.apply(thisArg, arguments);
	    };
	  }
	
	  /**
	   * Creates a function that assigns properties of source object(s) to a given
	   * destination object.
	   *
	   * **Note:** This function is used to create `_.assign`, `_.defaults`, and `_.merge`.
	   *
	   * @private
	   * @param {Function} assigner The function to assign values.
	   * @returns {Function} Returns the new assigner function.
	   */
	  function createAssigner(assigner) {
	    return restParam(function(object, sources) {
	      var index = -1,
	          length = object == null ? 0 : sources.length,
	          customizer = length > 2 && sources[length - 2],
	          guard = length > 2 && sources[2],
	          thisArg = length > 1 && sources[length - 1];
	
	      if (typeof customizer == 'function') {
	        customizer = bindCallback(customizer, thisArg, 5);
	        length -= 2;
	      } else {
	        customizer = typeof thisArg == 'function' ? thisArg : null;
	        length -= (customizer ? 1 : 0);
	      }
	      if (guard && isIterateeCall(sources[0], sources[1], guard)) {
	        customizer = length < 3 ? null : customizer;
	        length = 1;
	      }
	      while (++index < length) {
	        var source = sources[index];
	        if (source) {
	          assigner(object, source, customizer);
	        }
	      }
	      return object;
	    });
	  }
	
	  /**
	   * Creates a `baseEach` or `baseEachRight` function.
	   *
	   * @private
	   * @param {Function} eachFunc The function to iterate over a collection.
	   * @param {boolean} [fromRight] Specify iterating from right to left.
	   * @returns {Function} Returns the new base function.
	   */
	  function createBaseEach(eachFunc, fromRight) {
	    return function(collection, iteratee) {
	      var length = collection ? getLength(collection) : 0;
	      if (!isLength(length)) {
	        return eachFunc(collection, iteratee);
	      }
	      var index = fromRight ? length : -1,
	          iterable = toObject(collection);
	
	      while ((fromRight ? index-- : ++index < length)) {
	        if (iteratee(iterable[index], index, iterable) === false) {
	          break;
	        }
	      }
	      return collection;
	    };
	  }
	
	  /**
	   * Creates a base function for `_.forIn` or `_.forInRight`.
	   *
	   * @private
	   * @param {boolean} [fromRight] Specify iterating from right to left.
	   * @returns {Function} Returns the new base function.
	   */
	  function createBaseFor(fromRight) {
	    return function(object, iteratee, keysFunc) {
	      var iterable = toObject(object),
	          props = keysFunc(object),
	          length = props.length,
	          index = fromRight ? length : -1;
	
	      while ((fromRight ? index-- : ++index < length)) {
	        var key = props[index];
	        if (iteratee(iterable[key], key, iterable) === false) {
	          break;
	        }
	      }
	      return object;
	    };
	  }
	
	  /**
	   * Creates a function for `_.forEach` or `_.forEachRight`.
	   *
	   * @private
	   * @param {Function} arrayFunc The function to iterate over an array.
	   * @param {Function} eachFunc The function to iterate over a collection.
	   * @returns {Function} Returns the new each function.
	   */
	  function createForEach(arrayFunc, eachFunc) {
	    return function(collection, iteratee, thisArg) {
	      return (typeof iteratee == 'function' && thisArg === undefined && isArray(collection))
	        ? arrayFunc(collection, iteratee)
	        : eachFunc(collection, bindCallback(iteratee, thisArg, 3));
	    };
	  }
	
	  /**
	   * Creates a function for `_.reduce` or `_.reduceRight`.
	   *
	   * @private
	   * @param {Function} arrayFunc The function to iterate over an array.
	   * @param {Function} eachFunc The function to iterate over a collection.
	   * @returns {Function} Returns the new each function.
	   */
	  function createReduce(arrayFunc, eachFunc) {
	    return function(collection, iteratee, accumulator, thisArg) {
	      var initFromArray = arguments.length < 3;
	      return (typeof iteratee == 'function' && thisArg === undefined && isArray(collection))
	        ? arrayFunc(collection, iteratee, accumulator, initFromArray)
	        : baseReduce(collection, getCallback(iteratee, thisArg, 4), accumulator, initFromArray, eachFunc);
	    };
	  }
	
	  /**
	   * A specialized version of `baseIsEqualDeep` for arrays with support for
	   * partial deep comparisons.
	   *
	   * @private
	   * @param {Array} array The array to compare.
	   * @param {Array} other The other array to compare.
	   * @param {Function} equalFunc The function to determine equivalents of values.
	   * @param {Function} [customizer] The function to customize comparing arrays.
	   * @param {boolean} [isLoose] Specify performing partial comparisons.
	   * @param {Array} [stackA] Tracks traversed `value` objects.
	   * @param {Array} [stackB] Tracks traversed `other` objects.
	   * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
	   */
	  function equalArrays(array, other, equalFunc, customizer, isLoose, stackA, stackB) {
	    var index = -1,
	        arrLength = array.length,
	        othLength = other.length,
	        result = true;
	
	    if (arrLength != othLength && !(isLoose && othLength > arrLength)) {
	      return false;
	    }
	    // Deep compare the contents, ignoring non-numeric properties.
	    while (result && ++index < arrLength) {
	      var arrValue = array[index],
	          othValue = other[index];
	
	      result = undefined;
	      if (customizer) {
	        result = isLoose
	          ? customizer(othValue, arrValue, index)
	          : customizer(arrValue, othValue, index);
	      }
	      if (result === undefined) {
	        // Recursively compare arrays (susceptible to call stack limits).
	        if (isLoose) {
	          var othIndex = othLength;
	          while (othIndex--) {
	            othValue = other[othIndex];
	            result = (arrValue && arrValue === othValue) || equalFunc(arrValue, othValue, customizer, isLoose, stackA, stackB);
	            if (result) {
	              break;
	            }
	          }
	        } else {
	          result = (arrValue && arrValue === othValue) || equalFunc(arrValue, othValue, customizer, isLoose, stackA, stackB);
	        }
	      }
	    }
	    return !!result;
	  }
	
	  /**
	   * A specialized version of `baseIsEqualDeep` for comparing objects of
	   * the same `toStringTag`.
	   *
	   * **Note:** This function only supports comparing values with tags of
	   * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
	   *
	   * @private
	   * @param {Object} value The object to compare.
	   * @param {Object} other The other object to compare.
	   * @param {string} tag The `toStringTag` of the objects to compare.
	   * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
	   */
	  function equalByTag(object, other, tag) {
	    switch (tag) {
	      case boolTag:
	      case dateTag:
	        // Coerce dates and booleans to numbers, dates to milliseconds and booleans
	        // to `1` or `0` treating invalid dates coerced to `NaN` as not equal.
	        return +object == +other;
	
	      case errorTag:
	        return object.name == other.name && object.message == other.message;
	
	      case numberTag:
	        // Treat `NaN` vs. `NaN` as equal.
	        return (object != +object)
	          ? other != +other
	          // But, treat `-0` vs. `+0` as not equal.
	          : (object == 0 ? ((1 / object) == (1 / other)) : object == +other);
	
	      case regexpTag:
	      case stringTag:
	        // Coerce regexes to strings and treat strings primitives and string
	        // objects as equal. See https://es5.github.io/#x15.10.6.4 for more details.
	        return object == (other + '');
	    }
	    return false;
	  }
	
	  /**
	   * A specialized version of `baseIsEqualDeep` for objects with support for
	   * partial deep comparisons.
	   *
	   * @private
	   * @param {Object} object The object to compare.
	   * @param {Object} other The other object to compare.
	   * @param {Function} equalFunc The function to determine equivalents of values.
	   * @param {Function} [customizer] The function to customize comparing values.
	   * @param {boolean} [isLoose] Specify performing partial comparisons.
	   * @param {Array} [stackA] Tracks traversed `value` objects.
	   * @param {Array} [stackB] Tracks traversed `other` objects.
	   * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
	   */
	  function equalObjects(object, other, equalFunc, customizer, isLoose, stackA, stackB) {
	    var objProps = keys(object),
	        objLength = objProps.length,
	        othProps = keys(other),
	        othLength = othProps.length;
	
	    if (objLength != othLength && !isLoose) {
	      return false;
	    }
	    var skipCtor = isLoose,
	        index = -1;
	
	    while (++index < objLength) {
	      var key = objProps[index],
	          result = isLoose ? key in other : hasOwnProperty.call(other, key);
	
	      if (result) {
	        var objValue = object[key],
	            othValue = other[key];
	
	        result = undefined;
	        if (customizer) {
	          result = isLoose
	            ? customizer(othValue, objValue, key)
	            : customizer(objValue, othValue, key);
	        }
	        if (result === undefined) {
	          // Recursively compare objects (susceptible to call stack limits).
	          result = (objValue && objValue === othValue) || equalFunc(objValue, othValue, customizer, isLoose, stackA, stackB);
	        }
	      }
	      if (!result) {
	        return false;
	      }
	      skipCtor || (skipCtor = key == 'constructor');
	    }
	    if (!skipCtor) {
	      var objCtor = object.constructor,
	          othCtor = other.constructor;
	
	      // Non `Object` object instances with different constructors are not equal.
	      if (objCtor != othCtor &&
	          ('constructor' in object && 'constructor' in other) &&
	          !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
	            typeof othCtor == 'function' && othCtor instanceof othCtor)) {
	        return false;
	      }
	    }
	    return true;
	  }
	
	  /**
	   * Gets the appropriate "callback" function. If the `_.callback` method is
	   * customized this function returns the custom method, otherwise it returns
	   * the `baseCallback` function. If arguments are provided the chosen function
	   * is invoked with them and its result is returned.
	   *
	   * @private
	   * @returns {Function} Returns the chosen function or its result.
	   */
	  function getCallback(func, thisArg, argCount) {
	    var result = lodash.callback || callback;
	    result = result === callback ? baseCallback : result;
	    return argCount ? result(func, thisArg, argCount) : result;
	  }
	
	  /**
	   * Gets the "length" property value of `object`.
	   *
	   * **Note:** This function is used to avoid a [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792)
	   * in Safari on iOS 8.1 ARM64.
	   *
	   * @private
	   * @param {Object} object The object to query.
	   * @returns {*} Returns the "length" value.
	   */
	  var getLength = baseProperty('length');
	
	  /**
	   * Creates an array of the own symbols of `object`.
	   *
	   * @private
	   * @param {Object} object The object to query.
	   * @returns {Array} Returns the array of symbols.
	   */
	  var getSymbols = !getOwnPropertySymbols ? constant([]) : function(object) {
	    return getOwnPropertySymbols(toObject(object));
	  };
	
	  /**
	   * Checks if `value` is a valid array-like index.
	   *
	   * @private
	   * @param {*} value The value to check.
	   * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
	   * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
	   */
	  function isIndex(value, length) {
	    value = +value;
	    length = length == null ? MAX_SAFE_INTEGER : length;
	    return value > -1 && value % 1 == 0 && value < length;
	  }
	
	  /**
	   * Checks if the provided arguments are from an iteratee call.
	   *
	   * @private
	   * @param {*} value The potential iteratee value argument.
	   * @param {*} index The potential iteratee index or key argument.
	   * @param {*} object The potential iteratee object argument.
	   * @returns {boolean} Returns `true` if the arguments are from an iteratee call, else `false`.
	   */
	  function isIterateeCall(value, index, object) {
	    if (!isObject(object)) {
	      return false;
	    }
	    var type = typeof index;
	    if (type == 'number') {
	      var length = getLength(object),
	          prereq = isLength(length) && isIndex(index, length);
	    } else {
	      prereq = type == 'string' && index in object;
	    }
	    if (prereq) {
	      var other = object[index];
	      return value === value ? (value === other) : (other !== other);
	    }
	    return false;
	  }
	
	  /**
	   * Checks if `value` is a property name and not a property path.
	   *
	   * @private
	   * @param {*} value The value to check.
	   * @param {Object} [object] The object to query keys on.
	   * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
	   */
	  function isKey(value, object) {
	    var type = typeof value;
	    if ((type == 'string' && reIsPlainProp.test(value)) || type == 'number') {
	      return true;
	    }
	    if (isArray(value)) {
	      return false;
	    }
	    var result = !reIsDeepProp.test(value);
	    return result || (object != null && value in toObject(object));
	  }
	
	  /**
	   * Checks if `value` is a valid array-like length.
	   *
	   * **Note:** This function is based on [`ToLength`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength).
	   *
	   * @private
	   * @param {*} value The value to check.
	   * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
	   */
	  function isLength(value) {
	    return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
	  }
	
	  /**
	   * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
	   *
	   * @private
	   * @param {*} value The value to check.
	   * @returns {boolean} Returns `true` if `value` if suitable for strict
	   *  equality comparisons, else `false`.
	   */
	  function isStrictComparable(value) {
	    return value === value && (value === 0 ? ((1 / value) > 0) : !isObject(value));
	  }
	
	  /**
	   * A specialized version of `_.pick` that picks `object` properties specified
	   * by `props`.
	   *
	   * @private
	   * @param {Object} object The source object.
	   * @param {string[]} props The property names to pick.
	   * @returns {Object} Returns the new object.
	   */
	  function pickByArray(object, props) {
	    object = toObject(object);
	
	    var index = -1,
	        length = props.length,
	        result = {};
	
	    while (++index < length) {
	      var key = props[index];
	      if (key in object) {
	        result[key] = object[key];
	      }
	    }
	    return result;
	  }
	
	  /**
	   * A specialized version of `_.pick` that picks `object` properties `predicate`
	   * returns truthy for.
	   *
	   * @private
	   * @param {Object} object The source object.
	   * @param {Function} predicate The function invoked per iteration.
	   * @returns {Object} Returns the new object.
	   */
	  function pickByCallback(object, predicate) {
	    var result = {};
	    baseForIn(object, function(value, key, object) {
	      if (predicate(value, key, object)) {
	        result[key] = value;
	      }
	    });
	    return result;
	  }
	
	  /**
	   * A fallback implementation of `Object.keys` which creates an array of the
	   * own enumerable property names of `object`.
	   *
	   * @private
	   * @param {Object} object The object to query.
	   * @returns {Array} Returns the array of property names.
	   */
	  function shimKeys(object) {
	    var props = keysIn(object),
	        propsLength = props.length,
	        length = propsLength && object.length,
	        support = lodash.support;
	
	    var allowIndexes = length && isLength(length) &&
	      (isArray(object) || (support.nonEnumStrings && isString(object)) ||
	        (support.nonEnumArgs && isArguments(object)));
	
	    var index = -1,
	        result = [];
	
	    while (++index < propsLength) {
	      var key = props[index];
	      if ((allowIndexes && isIndex(key, length)) || hasOwnProperty.call(object, key)) {
	        result.push(key);
	      }
	    }
	    return result;
	  }
	
	  /**
	   * Converts `value` to an object if it is not one.
	   *
	   * @private
	   * @param {*} value The value to process.
	   * @returns {Object} Returns the object.
	   */
	  function toObject(value) {
	    if (lodash.support.unindexedChars && isString(value)) {
	      var index = -1,
	          length = value.length,
	          result = Object(value);
	
	      while (++index < length) {
	        result[index] = value.charAt(index);
	      }
	      return result;
	    }
	    return isObject(value) ? value : Object(value);
	  }
	
	  /**
	   * Converts `value` to property path array if it is not one.
	   *
	   * @private
	   * @param {*} value The value to process.
	   * @returns {Array} Returns the property path array.
	   */
	  function toPath(value) {
	    if (isArray(value)) {
	      return value;
	    }
	    var result = [];
	    baseToString(value).replace(rePropName, function(match, number, quote, string) {
	      result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
	    });
	    return result;
	  }
	
	  /*------------------------------------------------------------------------*/
	
	  /**
	   * Gets the last element of `array`.
	   *
	   * @static
	   * @memberOf _
	   * @category Array
	   * @param {Array} array The array to query.
	   * @returns {*} Returns the last element of `array`.
	   * @example
	   *
	   * _.last([1, 2, 3]);
	   * // => 3
	   */
	  function last(array) {
	    var length = array ? array.length : 0;
	    return length ? array[length - 1] : undefined;
	  }
	
	  /**
	   * The inverse of `_.pairs`; this method returns an object composed from arrays
	   * of property names and values. Provide either a single two dimensional array,
	   * e.g. `[[key1, value1], [key2, value2]]` or two arrays, one of property names
	   * and one of corresponding values.
	   *
	   * @static
	   * @memberOf _
	   * @alias object
	   * @category Array
	   * @param {Array} props The property names.
	   * @param {Array} [values=[]] The property values.
	   * @returns {Object} Returns the new object.
	   * @example
	   *
	   * _.zipObject([['fred', 30], ['barney', 40]]);
	   * // => { 'fred': 30, 'barney': 40 }
	   *
	   * _.zipObject(['fred', 'barney'], [30, 40]);
	   * // => { 'fred': 30, 'barney': 40 }
	   */
	  function zipObject(props, values) {
	    var index = -1,
	        length = props ? props.length : 0,
	        result = {};
	
	    if (length && !values && !isArray(props[0])) {
	      values = [];
	    }
	    while (++index < length) {
	      var key = props[index];
	      if (values) {
	        result[key] = values[index];
	      } else if (key) {
	        result[key[0]] = key[1];
	      }
	    }
	    return result;
	  }
	
	  /*------------------------------------------------------------------------*/
	
	  /**
	   * Iterates over elements of `collection`, returning an array of all elements
	   * `predicate` returns truthy for. The predicate is bound to `thisArg` and
	   * invoked with three arguments: (value, index|key, collection).
	   *
	   * If a property name is provided for `predicate` the created `_.property`
	   * style callback returns the property value of the given element.
	   *
	   * If a value is also provided for `thisArg` the created `_.matchesProperty`
	   * style callback returns `true` for elements that have a matching property
	   * value, else `false`.
	   *
	   * If an object is provided for `predicate` the created `_.matches` style
	   * callback returns `true` for elements that have the properties of the given
	   * object, else `false`.
	   *
	   * @static
	   * @memberOf _
	   * @alias select
	   * @category Collection
	   * @param {Array|Object|string} collection The collection to iterate over.
	   * @param {Function|Object|string} [predicate=_.identity] The function invoked
	   *  per iteration.
	   * @param {*} [thisArg] The `this` binding of `predicate`.
	   * @returns {Array} Returns the new filtered array.
	   * @example
	   *
	   * _.filter([4, 5, 6], function(n) {
	   *   return n % 2 == 0;
	   * });
	   * // => [4, 6]
	   *
	   * var users = [
	   *   { 'user': 'barney', 'age': 36, 'active': true },
	   *   { 'user': 'fred',   'age': 40, 'active': false }
	   * ];
	   *
	   * // using the `_.matches` callback shorthand
	   * _.pluck(_.filter(users, { 'age': 36, 'active': true }), 'user');
	   * // => ['barney']
	   *
	   * // using the `_.matchesProperty` callback shorthand
	   * _.pluck(_.filter(users, 'active', false), 'user');
	   * // => ['fred']
	   *
	   * // using the `_.property` callback shorthand
	   * _.pluck(_.filter(users, 'active'), 'user');
	   * // => ['barney']
	   */
	  function filter(collection, predicate, thisArg) {
	    var func = isArray(collection) ? arrayFilter : baseFilter;
	    predicate = getCallback(predicate, thisArg, 3);
	    return func(collection, predicate);
	  }
	
	  /**
	   * Iterates over elements of `collection` invoking `iteratee` for each element.
	   * The `iteratee` is bound to `thisArg` and invoked with three arguments:
	   * (value, index|key, collection). Iteratee functions may exit iteration early
	   * by explicitly returning `false`.
	   *
	   * **Note:** As with other "Collections" methods, objects with a "length" property
	   * are iterated like arrays. To avoid this behavior `_.forIn` or `_.forOwn`
	   * may be used for object iteration.
	   *
	   * @static
	   * @memberOf _
	   * @alias each
	   * @category Collection
	   * @param {Array|Object|string} collection The collection to iterate over.
	   * @param {Function} [iteratee=_.identity] The function invoked per iteration.
	   * @param {*} [thisArg] The `this` binding of `iteratee`.
	   * @returns {Array|Object|string} Returns `collection`.
	   * @example
	   *
	   * _([1, 2]).forEach(function(n) {
	   *   console.log(n);
	   * }).value();
	   * // => logs each value from left to right and returns the array
	   *
	   * _.forEach({ 'a': 1, 'b': 2 }, function(n, key) {
	   *   console.log(n, key);
	   * });
	   * // => logs each value-key pair and returns the object (iteration order is not guaranteed)
	   */
	  var forEach = createForEach(arrayEach, baseEach);
	
	  /**
	   * Creates an array of values by running each element in `collection` through
	   * `iteratee`. The `iteratee` is bound to `thisArg` and invoked with three
	   * arguments: (value, index|key, collection).
	   *
	   * If a property name is provided for `iteratee` the created `_.property`
	   * style callback returns the property value of the given element.
	   *
	   * If a value is also provided for `thisArg` the created `_.matchesProperty`
	   * style callback returns `true` for elements that have a matching property
	   * value, else `false`.
	   *
	   * If an object is provided for `iteratee` the created `_.matches` style
	   * callback returns `true` for elements that have the properties of the given
	   * object, else `false`.
	   *
	   * Many lodash methods are guarded to work as interatees for methods like
	   * `_.every`, `_.filter`, `_.map`, `_.mapValues`, `_.reject`, and `_.some`.
	   *
	   * The guarded methods are:
	   * `ary`, `callback`, `chunk`, `clone`, `create`, `curry`, `curryRight`, `drop`,
	   * `dropRight`, `every`, `fill`, `flatten`, `invert`, `max`, `min`, `parseInt`,
	   * `slice`, `sortBy`, `take`, `takeRight`, `template`, `trim`, `trimLeft`,
	   * `trimRight`, `trunc`, `random`, `range`, `sample`, `some`, `uniq`, and `words`
	   *
	   * @static
	   * @memberOf _
	   * @alias collect
	   * @category Collection
	   * @param {Array|Object|string} collection The collection to iterate over.
	   * @param {Function|Object|string} [iteratee=_.identity] The function invoked
	   *  per iteration.
	   * @param {*} [thisArg] The `this` binding of `iteratee`.
	   * @returns {Array} Returns the new mapped array.
	   * @example
	   *
	   * function timesThree(n) {
	   *   return n * 3;
	   * }
	   *
	   * _.map([1, 2], timesThree);
	   * // => [3, 6]
	   *
	   * _.map({ 'a': 1, 'b': 2 }, timesThree);
	   * // => [3, 6] (iteration order is not guaranteed)
	   *
	   * var users = [
	   *   { 'user': 'barney' },
	   *   { 'user': 'fred' }
	   * ];
	   *
	   * // using the `_.property` callback shorthand
	   * _.map(users, 'user');
	   * // => ['barney', 'fred']
	   */
	  function map(collection, iteratee, thisArg) {
	    var func = isArray(collection) ? arrayMap : baseMap;
	    iteratee = getCallback(iteratee, thisArg, 3);
	    return func(collection, iteratee);
	  }
	
	  /**
	   * Reduces `collection` to a value which is the accumulated result of running
	   * each element in `collection` through `iteratee`, where each successive
	   * invocation is supplied the return value of the previous. If `accumulator`
	   * is not provided the first element of `collection` is used as the initial
	   * value. The `iteratee` is bound to `thisArg` and invoked with four arguments:
	   * (accumulator, value, index|key, collection).
	   *
	   * Many lodash methods are guarded to work as interatees for methods like
	   * `_.reduce`, `_.reduceRight`, and `_.transform`.
	   *
	   * The guarded methods are:
	   * `assign`, `defaults`, `includes`, `merge`, `sortByAll`, and `sortByOrder`
	   *
	   * @static
	   * @memberOf _
	   * @alias foldl, inject
	   * @category Collection
	   * @param {Array|Object|string} collection The collection to iterate over.
	   * @param {Function} [iteratee=_.identity] The function invoked per iteration.
	   * @param {*} [accumulator] The initial value.
	   * @param {*} [thisArg] The `this` binding of `iteratee`.
	   * @returns {*} Returns the accumulated value.
	   * @example
	   *
	   * _.reduce([1, 2], function(total, n) {
	   *   return total + n;
	   * });
	   * // => 3
	   *
	   * _.reduce({ 'a': 1, 'b': 2 }, function(result, n, key) {
	   *   result[key] = n * 3;
	   *   return result;
	   * }, {});
	   * // => { 'a': 3, 'b': 6 } (iteration order is not guaranteed)
	   */
	  var reduce = createReduce(arrayReduce, baseEach);
	
	  /*------------------------------------------------------------------------*/
	
	  /**
	   * Creates a function that invokes `func` with the `this` binding of the
	   * created function and arguments from `start` and beyond provided as an array.
	   *
	   * **Note:** This method is based on the [rest parameter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters).
	   *
	   * @static
	   * @memberOf _
	   * @category Function
	   * @param {Function} func The function to apply a rest parameter to.
	   * @param {number} [start=func.length-1] The start position of the rest parameter.
	   * @returns {Function} Returns the new function.
	   * @example
	   *
	   * var say = _.restParam(function(what, names) {
	   *   return what + ' ' + _.initial(names).join(', ') +
	   *     (_.size(names) > 1 ? ', & ' : '') + _.last(names);
	   * });
	   *
	   * say('hello', 'fred', 'barney', 'pebbles');
	   * // => 'hello fred, barney, & pebbles'
	   */
	  function restParam(func, start) {
	    if (typeof func != 'function') {
	      throw new TypeError(FUNC_ERROR_TEXT);
	    }
	    start = nativeMax(start === undefined ? (func.length - 1) : (+start || 0), 0);
	    return function() {
	      var args = arguments,
	          index = -1,
	          length = nativeMax(args.length - start, 0),
	          rest = Array(length);
	
	      while (++index < length) {
	        rest[index] = args[start + index];
	      }
	      switch (start) {
	        case 0: return func.call(this, rest);
	        case 1: return func.call(this, args[0], rest);
	        case 2: return func.call(this, args[0], args[1], rest);
	      }
	      var otherArgs = Array(start + 1);
	      index = -1;
	      while (++index < start) {
	        otherArgs[index] = args[index];
	      }
	      otherArgs[start] = rest;
	      return func.apply(this, otherArgs);
	    };
	  }
	
	  /*------------------------------------------------------------------------*/
	
	  /**
	   * Checks if `value` is classified as an `arguments` object.
	   *
	   * @static
	   * @memberOf _
	   * @category Lang
	   * @param {*} value The value to check.
	   * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	   * @example
	   *
	   * _.isArguments(function() { return arguments; }());
	   * // => true
	   *
	   * _.isArguments([1, 2, 3]);
	   * // => false
	   */
	  function isArguments(value) {
	    var length = isObjectLike(value) ? value.length : undefined;
	    return isLength(length) && objToString.call(value) == argsTag;
	  }
	  // Fallback for environments without a `toStringTag` for `arguments` objects.
	  if (!support.argsTag) {
	    isArguments = function(value) {
	      var length = isObjectLike(value) ? value.length : undefined;
	      return isLength(length) && hasOwnProperty.call(value, 'callee') &&
	        !propertyIsEnumerable.call(value, 'callee');
	    };
	  }
	
	  /**
	   * Checks if `value` is classified as an `Array` object.
	   *
	   * @static
	   * @memberOf _
	   * @category Lang
	   * @param {*} value The value to check.
	   * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	   * @example
	   *
	   * _.isArray([1, 2, 3]);
	   * // => true
	   *
	   * _.isArray(function() { return arguments; }());
	   * // => false
	   */
	  var isArray = nativeIsArray || function(value) {
	    return isObjectLike(value) && isLength(value.length) && objToString.call(value) == arrayTag;
	  };
	
	  /**
	   * Checks if `value` is empty. A value is considered empty unless it is an
	   * `arguments` object, array, string, or jQuery-like collection with a length
	   * greater than `0` or an object with own enumerable properties.
	   *
	   * @static
	   * @memberOf _
	   * @category Lang
	   * @param {Array|Object|string} value The value to inspect.
	   * @returns {boolean} Returns `true` if `value` is empty, else `false`.
	   * @example
	   *
	   * _.isEmpty(null);
	   * // => true
	   *
	   * _.isEmpty(true);
	   * // => true
	   *
	   * _.isEmpty(1);
	   * // => true
	   *
	   * _.isEmpty([1, 2, 3]);
	   * // => false
	   *
	   * _.isEmpty({ 'a': 1 });
	   * // => false
	   */
	  function isEmpty(value) {
	    if (value == null) {
	      return true;
	    }
	    var length = getLength(value);
	    if (isLength(length) && (isArray(value) || isString(value) || isArguments(value) ||
	        (isObjectLike(value) && isFunction(value.splice)))) {
	      return !length;
	    }
	    return !keys(value).length;
	  }
	
	  /**
	   * Checks if `value` is classified as a `Function` object.
	   *
	   * @static
	   * @memberOf _
	   * @category Lang
	   * @param {*} value The value to check.
	   * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	   * @example
	   *
	   * _.isFunction(_);
	   * // => true
	   *
	   * _.isFunction(/abc/);
	   * // => false
	   */
	  var isFunction = !(baseIsFunction(/x/) || (Uint8Array && !baseIsFunction(Uint8Array))) ? baseIsFunction : function(value) {
	    // The use of `Object#toString` avoids issues with the `typeof` operator
	    // in older versions of Chrome and Safari which return 'function' for regexes
	    // and Safari 8 equivalents which return 'object' for typed array constructors.
	    return objToString.call(value) == funcTag;
	  };
	
	  /**
	   * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
	   * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	   *
	   * @static
	   * @memberOf _
	   * @category Lang
	   * @param {*} value The value to check.
	   * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	   * @example
	   *
	   * _.isObject({});
	   * // => true
	   *
	   * _.isObject([1, 2, 3]);
	   * // => true
	   *
	   * _.isObject(1);
	   * // => false
	   */
	  function isObject(value) {
	    // Avoid a V8 JIT bug in Chrome 19-20.
	    // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
	    var type = typeof value;
	    return type == 'function' || (!!value && type == 'object');
	  }
	
	  /**
	   * Checks if `value` is a native function.
	   *
	   * @static
	   * @memberOf _
	   * @category Lang
	   * @param {*} value The value to check.
	   * @returns {boolean} Returns `true` if `value` is a native function, else `false`.
	   * @example
	   *
	   * _.isNative(Array.prototype.push);
	   * // => true
	   *
	   * _.isNative(_);
	   * // => false
	   */
	  function isNative(value) {
	    if (value == null) {
	      return false;
	    }
	    if (objToString.call(value) == funcTag) {
	      return reIsNative.test(fnToString.call(value));
	    }
	    return isObjectLike(value) && (isHostObject(value) ? reIsNative : reIsHostCtor).test(value);
	  }
	
	  /**
	   * Checks if `value` is classified as a `String` primitive or object.
	   *
	   * @static
	   * @memberOf _
	   * @category Lang
	   * @param {*} value The value to check.
	   * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	   * @example
	   *
	   * _.isString('abc');
	   * // => true
	   *
	   * _.isString(1);
	   * // => false
	   */
	  function isString(value) {
	    return typeof value == 'string' || (isObjectLike(value) && objToString.call(value) == stringTag);
	  }
	
	  /**
	   * Checks if `value` is classified as a typed array.
	   *
	   * @static
	   * @memberOf _
	   * @category Lang
	   * @param {*} value The value to check.
	   * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	   * @example
	   *
	   * _.isTypedArray(new Uint8Array);
	   * // => true
	   *
	   * _.isTypedArray([]);
	   * // => false
	   */
	  function isTypedArray(value) {
	    return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[objToString.call(value)];
	  }
	
	  /**
	   * Converts `value` to an array.
	   *
	   * @static
	   * @memberOf _
	   * @category Lang
	   * @param {*} value The value to convert.
	   * @returns {Array} Returns the converted array.
	   * @example
	   *
	   * (function() {
	   *   return _.toArray(arguments).slice(1);
	   * }(1, 2, 3));
	   * // => [2, 3]
	   */
	  function toArray(value) {
	    var length = value ? getLength(value) : 0;
	    if (!isLength(length)) {
	      return values(value);
	    }
	    if (!length) {
	      return [];
	    }
	    return (lodash.support.unindexedChars && isString(value))
	      ? value.split('')
	      : arrayCopy(value);
	  }
	
	  /*------------------------------------------------------------------------*/
	
	  /**
	   * Assigns own enumerable properties of source object(s) to the destination
	   * object. Subsequent sources overwrite property assignments of previous sources.
	   * If `customizer` is provided it is invoked to produce the assigned values.
	   * The `customizer` is bound to `thisArg` and invoked with five arguments:
	   * (objectValue, sourceValue, key, object, source).
	   *
	   * **Note:** This method mutates `object` and is based on
	   * [`Object.assign`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.assign).
	   *
	   *
	   * @static
	   * @memberOf _
	   * @alias extend
	   * @category Object
	   * @param {Object} object The destination object.
	   * @param {...Object} [sources] The source objects.
	   * @param {Function} [customizer] The function to customize assigned values.
	   * @param {*} [thisArg] The `this` binding of `customizer`.
	   * @returns {Object} Returns `object`.
	   * @example
	   *
	   * _.assign({ 'user': 'barney' }, { 'age': 40 }, { 'user': 'fred' });
	   * // => { 'user': 'fred', 'age': 40 }
	   *
	   * // using a customizer callback
	   * var defaults = _.partialRight(_.assign, function(value, other) {
	   *   return _.isUndefined(value) ? other : value;
	   * });
	   *
	   * defaults({ 'user': 'barney' }, { 'age': 36 }, { 'user': 'fred' });
	   * // => { 'user': 'barney', 'age': 36 }
	   */
	  var assign = createAssigner(function(object, source, customizer) {
	    return customizer
	      ? assignWith(object, source, customizer)
	      : baseAssign(object, source);
	  });
	
	  /**
	   * Assigns own enumerable properties of source object(s) to the destination
	   * object for all destination properties that resolve to `undefined`. Once a
	   * property is set, additional values of the same property are ignored.
	   *
	   * **Note:** This method mutates `object`.
	   *
	   * @static
	   * @memberOf _
	   * @category Object
	   * @param {Object} object The destination object.
	   * @param {...Object} [sources] The source objects.
	   * @returns {Object} Returns `object`.
	   * @example
	   *
	   * _.defaults({ 'user': 'barney' }, { 'age': 36 }, { 'user': 'fred' });
	   * // => { 'user': 'barney', 'age': 36 }
	   */
	  var defaults = restParam(function(args) {
	    var object = args[0];
	    if (object == null) {
	      return object;
	    }
	    args.push(assignDefaults);
	    return assign.apply(undefined, args);
	  });
	
	  /**
	   * Creates an array of function property names from all enumerable properties,
	   * own and inherited, of `object`.
	   *
	   * @static
	   * @memberOf _
	   * @alias methods
	   * @category Object
	   * @param {Object} object The object to inspect.
	   * @returns {Array} Returns the new array of property names.
	   * @example
	   *
	   * _.functions(_);
	   * // => ['after', 'ary', 'assign', ...]
	   */
	  function functions(object) {
	    return baseFunctions(object, keysIn(object));
	  }
	
	  /**
	   * Creates an array of the own enumerable property names of `object`.
	   *
	   * **Note:** Non-object values are coerced to objects. See the
	   * [ES spec](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.keys)
	   * for more details.
	   *
	   * @static
	   * @memberOf _
	   * @category Object
	   * @param {Object} object The object to query.
	   * @returns {Array} Returns the array of property names.
	   * @example
	   *
	   * function Foo() {
	   *   this.a = 1;
	   *   this.b = 2;
	   * }
	   *
	   * Foo.prototype.c = 3;
	   *
	   * _.keys(new Foo);
	   * // => ['a', 'b'] (iteration order is not guaranteed)
	   *
	   * _.keys('hi');
	   * // => ['0', '1']
	   */
	  var keys = !nativeKeys ? shimKeys : function(object) {
	    if (object) {
	      var Ctor = object.constructor,
	          length = object.length;
	    }
	    if ((typeof Ctor == 'function' && Ctor.prototype === object) ||
	        (typeof object == 'function' ? lodash.support.enumPrototypes : isLength(length))) {
	      return shimKeys(object);
	    }
	    return isObject(object) ? nativeKeys(object) : [];
	  };
	
	  /**
	   * Creates an array of the own and inherited enumerable property names of `object`.
	   *
	   * **Note:** Non-object values are coerced to objects.
	   *
	   * @static
	   * @memberOf _
	   * @category Object
	   * @param {Object} object The object to query.
	   * @returns {Array} Returns the array of property names.
	   * @example
	   *
	   * function Foo() {
	   *   this.a = 1;
	   *   this.b = 2;
	   * }
	   *
	   * Foo.prototype.c = 3;
	   *
	   * _.keysIn(new Foo);
	   * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
	   */
	  function keysIn(object) {
	    if (object == null) {
	      return [];
	    }
	    if (!isObject(object)) {
	      object = Object(object);
	    }
	    var length = object.length,
	        support = lodash.support;
	
	    length = (length && isLength(length) &&
	      (isArray(object) || (support.nonEnumStrings && isString(object)) ||
	        (support.nonEnumArgs && isArguments(object))) && length) || 0;
	
	    var Ctor = object.constructor,
	        index = -1,
	        proto = (isFunction(Ctor) && Ctor.prototype) || objectProto,
	        isProto = proto === object,
	        result = Array(length),
	        skipIndexes = length > 0,
	        skipErrorProps = support.enumErrorProps && (object === errorProto || object instanceof Error),
	        skipProto = support.enumPrototypes && isFunction(object);
	
	    while (++index < length) {
	      result[index] = (index + '');
	    }
	    // lodash skips the `constructor` property when it infers it is iterating
	    // over a `prototype` object because IE < 9 can't set the `[[Enumerable]]`
	    // attribute of an existing property and the `constructor` property of a
	    // prototype defaults to non-enumerable.
	    for (var key in object) {
	      if (!(skipProto && key == 'prototype') &&
	          !(skipErrorProps && (key == 'message' || key == 'name')) &&
	          !(skipIndexes && isIndex(key, length)) &&
	          !(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
	        result.push(key);
	      }
	    }
	    if (support.nonEnumShadows && object !== objectProto) {
	      var tag = object === stringProto ? stringTag : (object === errorProto ? errorTag : objToString.call(object)),
	          nonEnums = nonEnumProps[tag] || nonEnumProps[objectTag];
	
	      if (tag == objectTag) {
	        proto = objectProto;
	      }
	      length = shadowProps.length;
	      while (length--) {
	        key = shadowProps[length];
	        var nonEnum = nonEnums[key];
	        if (!(isProto && nonEnum) &&
	            (nonEnum ? hasOwnProperty.call(object, key) : object[key] !== proto[key])) {
	          result.push(key);
	        }
	      }
	    }
	    return result;
	  }
	
	  /**
	   * Creates an object composed of the picked `object` properties. Property
	   * names may be specified as individual arguments or as arrays of property
	   * names. If `predicate` is provided it is invoked for each property of `object`
	   * picking the properties `predicate` returns truthy for. The predicate is
	   * bound to `thisArg` and invoked with three arguments: (value, key, object).
	   *
	   * @static
	   * @memberOf _
	   * @category Object
	   * @param {Object} object The source object.
	   * @param {Function|...(string|string[])} [predicate] The function invoked per
	   *  iteration or property names to pick, specified as individual property
	   *  names or arrays of property names.
	   * @param {*} [thisArg] The `this` binding of `predicate`.
	   * @returns {Object} Returns the new object.
	   * @example
	   *
	   * var object = { 'user': 'fred', 'age': 40 };
	   *
	   * _.pick(object, 'user');
	   * // => { 'user': 'fred' }
	   *
	   * _.pick(object, _.isString);
	   * // => { 'user': 'fred' }
	   */
	  var pick = restParam(function(object, props) {
	    if (object == null) {
	      return {};
	    }
	    return typeof props[0] == 'function'
	      ? pickByCallback(object, bindCallback(props[0], props[1], 3))
	      : pickByArray(object, baseFlatten(props));
	  });
	
	  /**
	   * Creates an array of the own enumerable property values of `object`.
	   *
	   * **Note:** Non-object values are coerced to objects.
	   *
	   * @static
	   * @memberOf _
	   * @category Object
	   * @param {Object} object The object to query.
	   * @returns {Array} Returns the array of property values.
	   * @example
	   *
	   * function Foo() {
	   *   this.a = 1;
	   *   this.b = 2;
	   * }
	   *
	   * Foo.prototype.c = 3;
	   *
	   * _.values(new Foo);
	   * // => [1, 2] (iteration order is not guaranteed)
	   *
	   * _.values('hi');
	   * // => ['h', 'i']
	   */
	  function values(object) {
	    return baseValues(object, keys(object));
	  }
	
	  /*------------------------------------------------------------------------*/
	
	  /**
	   * Escapes the `RegExp` special characters "\", "/", "^", "$", ".", "|", "?",
	   * "*", "+", "(", ")", "[", "]", "{" and "}" in `string`.
	   *
	   * @static
	   * @memberOf _
	   * @category String
	   * @param {string} [string=''] The string to escape.
	   * @returns {string} Returns the escaped string.
	   * @example
	   *
	   * _.escapeRegExp('[lodash](https://lodash.com/)');
	   * // => '\[lodash\]\(https:\/\/lodash\.com\/\)'
	   */
	  function escapeRegExp(string) {
	    string = baseToString(string);
	    return (string && reHasRegExpChars.test(string))
	      ? string.replace(reRegExpChars, '\\$&')
	      : string;
	  }
	
	  /*------------------------------------------------------------------------*/
	
	  /**
	   * Creates a function that invokes `func` with the `this` binding of `thisArg`
	   * and arguments of the created function. If `func` is a property name the
	   * created callback returns the property value for a given element. If `func`
	   * is an object the created callback returns `true` for elements that contain
	   * the equivalent object properties, otherwise it returns `false`.
	   *
	   * @static
	   * @memberOf _
	   * @alias iteratee
	   * @category Utility
	   * @param {*} [func=_.identity] The value to convert to a callback.
	   * @param {*} [thisArg] The `this` binding of `func`.
	   * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
	   * @returns {Function} Returns the callback.
	   * @example
	   *
	   * var users = [
	   *   { 'user': 'barney', 'age': 36 },
	   *   { 'user': 'fred',   'age': 40 }
	   * ];
	   *
	   * // wrap to create custom callback shorthands
	   * _.callback = _.wrap(_.callback, function(callback, func, thisArg) {
	   *   var match = /^(.+?)__([gl]t)(.+)$/.exec(func);
	   *   if (!match) {
	   *     return callback(func, thisArg);
	   *   }
	   *   return function(object) {
	   *     return match[2] == 'gt'
	   *       ? object[match[1]] > match[3]
	   *       : object[match[1]] < match[3];
	   *   };
	   * });
	   *
	   * _.filter(users, 'age__gt36');
	   * // => [{ 'user': 'fred', 'age': 40 }]
	   */
	  function callback(func, thisArg, guard) {
	    if (guard && isIterateeCall(func, thisArg, guard)) {
	      thisArg = null;
	    }
	    return baseCallback(func, thisArg);
	  }
	
	  /**
	   * Creates a function that returns `value`.
	   *
	   * @static
	   * @memberOf _
	   * @category Utility
	   * @param {*} value The value to return from the new function.
	   * @returns {Function} Returns the new function.
	   * @example
	   *
	   * var object = { 'user': 'fred' };
	   * var getter = _.constant(object);
	   *
	   * getter() === object;
	   * // => true
	   */
	  function constant(value) {
	    return function() {
	      return value;
	    };
	  }
	
	  /**
	   * This method returns the first argument provided to it.
	   *
	   * @static
	   * @memberOf _
	   * @category Utility
	   * @param {*} value Any value.
	   * @returns {*} Returns `value`.
	   * @example
	   *
	   * var object = { 'user': 'fred' };
	   *
	   * _.identity(object) === object;
	   * // => true
	   */
	  function identity(value) {
	    return value;
	  }
	
	  /**
	   * A no-operation function which returns `undefined` regardless of the
	   * arguments it receives.
	   *
	   * @static
	   * @memberOf _
	   * @category Utility
	   * @example
	   *
	   * var object = { 'user': 'fred' };
	   *
	   * _.noop(object) === undefined;
	   * // => true
	   */
	  function noop() {
	    // No operation performed.
	  }
	
	  /**
	   * Creates a function which returns the property value at `path` on a
	   * given object.
	   *
	   * @static
	   * @memberOf _
	   * @category Utility
	   * @param {Array|string} path The path of the property to get.
	   * @returns {Function} Returns the new function.
	   * @example
	   *
	   * var objects = [
	   *   { 'a': { 'b': { 'c': 2 } } },
	   *   { 'a': { 'b': { 'c': 1 } } }
	   * ];
	   *
	   * _.map(objects, _.property('a.b.c'));
	   * // => [2, 1]
	   *
	   * _.pluck(_.sortBy(objects, _.property(['a', 'b', 'c'])), 'a.b.c');
	   * // => [1, 2]
	   */
	  function property(path) {
	    return isKey(path) ? baseProperty(path) : basePropertyDeep(path);
	  }
	
	  /*------------------------------------------------------------------------*/
	
	  // Add functions that return wrapped values when chaining.
	  lodash.assign = assign;
	  lodash.callback = callback;
	  lodash.constant = constant;
	  lodash.defaults = defaults;
	  lodash.filter = filter;
	  lodash.forEach = forEach;
	  lodash.functions = functions;
	  lodash.keys = keys;
	  lodash.keysIn = keysIn;
	  lodash.map = map;
	  lodash.pick = pick;
	  lodash.property = property;
	  lodash.restParam = restParam;
	  lodash.toArray = toArray;
	  lodash.values = values;
	  lodash.zipObject = zipObject;
	
	  // Add aliases.
	  lodash.collect = map;
	  lodash.each = forEach;
	  lodash.extend = assign;
	  lodash.iteratee = callback;
	  lodash.methods = functions;
	  lodash.object = zipObject;
	  lodash.select = filter;
	
	  /*------------------------------------------------------------------------*/
	
	  // Add functions that return unwrapped values when chaining.
	  lodash.escapeRegExp = escapeRegExp;
	  lodash.identity = identity;
	  lodash.isArguments = isArguments;
	  lodash.isArray = isArray;
	  lodash.isEmpty = isEmpty;
	  lodash.isFunction = isFunction;
	  lodash.isNative = isNative;
	  lodash.isObject = isObject;
	  lodash.isString = isString;
	  lodash.isTypedArray = isTypedArray;
	  lodash.last = last;
	  lodash.noop = noop;
	  lodash.reduce = reduce;
	
	  // Add aliases.
	  lodash.foldl = reduce;
	  lodash.inject = reduce;
	
	  /*------------------------------------------------------------------------*/
	
	  /**
	   * The semantic version number.
	   *
	   * @static
	   * @memberOf _
	   * @type string
	   */
	  lodash.VERSION = VERSION;
	
	  /*--------------------------------------------------------------------------*/
	
	  // Some AMD build optimizers like r.js check for condition patterns like the following:
	  if (true) {
	    // Expose lodash to the global object when an AMD loader is present to avoid
	    // errors in cases where lodash is loaded by a script tag and not intended
	    // as an AMD module. See http://requirejs.org/docs/errors.html#mismatch for
	    // more details.
	    root._ = lodash;
	
	    // Define as an anonymous module so, through path mapping, it can be
	    // referenced as the "underscore" module.
	    !(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
	      return lodash;
	    }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  }
	  // Check for `exports` after `define` in case a build optimizer adds an `exports` object.
	  else if (freeExports && freeModule) {
	    // Export for Node.js or RingoJS.
	    if (moduleExports) {
	      (freeModule.exports = lodash)._ = lodash;
	    }
	    // Export for Narwhal or Rhino -require.
	    else {
	      freeExports._ = lodash;
	    }
	  }
	  else {
	    // Export for a browser or Rhino.
	    root._ = lodash;
	  }
	}.call(this));
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(41)(module), (function() { return this; }())))

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(3);
	var globals = __webpack_require__(1);
	var callNewQ = __webpack_require__(25);
	var defineProperty = __webpack_require__(26);
	
	var aliases = {
	  'catch': 'caught',
	  'finally': 'lastly',
	  'return': ['thenReturn', 'returns'],
	  'throw': ['thenThrow']
	};
	
	function Promise($qPromise, parent) {
	  defineProperty(this, '$$state', $qPromise.$$state);
	
	  _.each(_.methods($qPromise), function(name) {
	    defineProperty(this, '$$' + name, $qPromise[name]);
	  }, this);
	
	  if (parent && parent.$$boundTo)
	    defineProperty(this, '$$boundTo', parent.$$boundTo);
	
	  defineProperty(this, '$$arrayListeners', []);
	
	  this.then = $qPromise.then = this.then.bind(this);
	}
	
	module.exports = function decorate($qPromise, parent) {
	  return new Promise($qPromise, parent);
	};
	
	Promise.prototype = {
	  // call newQ.all if unsynced, does nothing otherwise
	  all: callNewQ('all'),
	  any: callNewQ('any'),
	  bind: __webpack_require__(27),
	  call: __webpack_require__(28),
	  'catch': __webpack_require__(29),
	  delay: __webpack_require__(30),
	  done: __webpack_require__(31),
	  each: callNewQ('each'),
	  filter: callNewQ('filter'),
	  'finally': function() {
	    return this.$$finally.apply(this, arguments);
	  },
	  get: __webpack_require__(32),
	  map: callNewQ('map'),
	  nodeify: __webpack_require__(33),
	  props: callNewQ('props'),
	  reduce: callNewQ('reduce'),
	  'return': __webpack_require__(34),
	  some: callNewQ('some'),
	  spread: __webpack_require__(35),
	  tap: __webpack_require__(36),
	  then: __webpack_require__(37),
	  'throw': __webpack_require__(38),
	  timeout: __webpack_require__(39),
	
	  constructor: Promise
	};
	
	defineProperty(Promise.prototype, '$$callArrayListeners', function(array) {
	  _.each(this.$$arrayListeners, function(listener) {
	    listener(array);
	  });
	});
	
	_.each(aliases, function(targets, method) {
	  if (!_.isArray(targets))
	    targets = [targets];
	
	  if (globals.$options.compatibilityAliases) {
	    _.each(targets, function(target) {
	      Promise.prototype[target] = Promise.prototype[method];
	    });
	  }
	
	  if (globals.$options.disableES5Methods)
	    delete Promise.prototype[method];
	});


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(3);
	var newq = __webpack_require__(2);
	var Gate = __webpack_require__(40);
	var defineProperty = __webpack_require__(26);
	
	module.exports = function walkCollection(promiseFn) {
	  return function(array, cb, options) {
	    options = _.pick(options, 'concurrency');
	
	    var gate = options.concurrency ? new Gate(options) : {
	      add: function(fn) {
	        return fn();
	      }
	    };
	
	    // create an array with each promises affected by the operation
	    var $$unsynced = _.map(array, function(val, i) {
	      // return a new promise for each item
	      return newq.when(val)[promiseFn](function(val) {
	        return gate.add(function() {
	          // call user callback
	          return newq.when(cb.call(null, val, i, array.length));
	        });
	      });
	    });
	
	    // create a promise synchronizing everything
	    var res = newq.all($$unsynced);
	
	    // save the unsynced array of promises in the result
	    defineProperty(res, '$$unsynced', $$unsynced);
	
	    // return the promise
	    return res;
	  };
	};


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var decorate = __webpack_require__(22);
	var globals = __webpack_require__(1);
	
	module.exports = function autoDecorate(name) {
	  return !(name in globals.$delegate) ? null : function() {
	    return decorate(globals.$delegate[name].apply(globals.$delegate, arguments));
	  };
	};


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var bindMethods = __webpack_require__(42);
	var newQ = __webpack_require__(2);
	var defineProperty = __webpack_require__(26);
	
	module.exports = function callNewQ(method) {
	  /* jshint -W040 */
	  function execute(args, arr) {
	    var res = newQ[method].apply(null, [arr].concat(args));
	    defineProperty(res, '$$boundTo', this.$$boundTo);
	    return res;
	  }
	  /* jshint +W040 */
	
	  return function() {
	    var args = bindMethods.call(this, arguments);
	
	    // chain if not synced
	    if (this.$$unsynced) {
	      // create new promise with next($$unsynced, args…)
	      return execute.call(this, args, this.$$unsynced);
	    }
	
	    var then = this.then(function(val) {
	      if (then.$$promiseResult)
	        return then.$$promiseResult;
	
	      var res = execute.call(this, args, val);
	
	      if (then.$$arrayListeners.length && res.$$unsynced)
	        then.$$callArrayListeners(res.$$unsynced);
	
	      return res;
	    }.bind(this));
	
	    this.$$arrayListeners.push(function(array) {
	      defineProperty(this, '$$promiseResult', execute.call(this, args, array));
	
	      if (then.$$arrayListeners.length && this.$$promiseResult.$$unsynced)
	        then.$$callArrayListeners(this.$$promiseResult.$$unsynced);
	    }.bind(this));
	
	    return then;
	  };
	};


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	module.exports = function defineProperty(obj, name, value) {
	  if (Object.defineProperty) {
	    try {
	      Object.defineProperty(obj, name, {
	        value: value
	      });
	    }
	    catch (e) {}
	  }
	
	  if (obj[name] !== value)
	    obj[name] = value;
	};


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var defineProperty = __webpack_require__(26);
	
	module.exports = function(bound) {
	  defineProperty(this, '$$boundTo', bound);
	  return this;
	};


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(3);
	
	module.exports = function() {
	  var args = _.toArray(arguments);
	  var method = args.shift();
	
	  return this.then(function(val) {
	    return val[method].apply(val, args);
	  });
	};


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var newq = __webpack_require__(2);
	var _ = __webpack_require__(3);
	
	function checkErrorsAndPredicates(errorsAndPredicates, err) {
	  var any = !errorsAndPredicates.length;
	  _.each(errorsAndPredicates, function(test) {
	    if (!_.isFunction(test))
	      throw new Error('Invalid argument.');
	
	    if (test instanceof Error || test.prototype instanceof Error) {
	      any = any || err instanceof test;
	
	      return !any;
	    }
	
	    any = any || test(err);
	    return !any;
	  });
	  return any;
	}
	
	module.exports = function() {
	  var errorsAndPredicates = _.toArray(arguments);
	  var callback = errorsAndPredicates.pop();
	
	  return this.$$catch(function(err) {
	    if (!_.isFunction(callback) || !checkErrorsAndPredicates(errorsAndPredicates, err))
	      return newq.reject(err);
	
	    return callback.call(this, err);
	  });
	};


/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var globals = __webpack_require__(1);
	
	module.exports = function(ms) {
	  return this.then(function(val) {
	    var def = globals.$defer(this);
	    setTimeout(def.resolve, ms, val);
	    return def.promise;
	  }.bind(this));
	};


/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var newQ = __webpack_require__(2);
	
	module.exports = function() {
	  return this
	    .then.apply(this, arguments)
	    .$$catch(function(err) {
	      setTimeout(function() {
	        throw err;
	      });
	    })
	    .$$finally(function() {
	      return newQ.reject(new Error('Do not chain anything after calling done()!'));
	    })
	  ;
	};


/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	module.exports = function(prop) {
	  return this.then(function(val) {
	    return val[prop];
	  });
	};


/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(3);
	var newq = __webpack_require__(2);
	
	module.exports = function(cb, options) {
	  cb = cb || _.noop;
	  options = options || {};
	
	  return this.then(
	    function(args) {
	      var a = args;
	
	      if (!options.spread || !_.isArray(a))
	        a = [null, a];
	      else
	        a = [null].concat(a);
	
	      cb.apply(this, a);
	
	      return args;
	    },
	
	    function(err) {
	      cb.call(this, err);
	      return newq.reject(err);
	    }
	  );
	};


/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(3);
	
	module.exports = function(val) {
	  return this.then(_.constant(val));
	};


/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(3);
	
	module.exports = function(fn) {
	  return this.then(function(value) {
	    // given value might not be an array
	    if (!_.isArray(value))
	      value = [value];
	
	    return fn.apply(this, value);
	  });
	};


/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var newQ = __webpack_require__(2);
	
	module.exports = function(fn) {
	  return this.then(function(value) {
	    // returns only when fn(value) promise chain is fully resolved
	    return newQ.when(fn.call(this, value)).returns(value);
	  });
	};


/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var bindMethods = __webpack_require__(42);
	var decorate = __webpack_require__(22);
	
	// Then is special because it needs the previous then to work
	module.exports = function() {
	  // convert the promise to newQ
	  return decorate(this.$$then.apply(this, bindMethods.call(this, arguments)), this);
	};


/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var newq = __webpack_require__(2);
	
	module.exports = function(err) {
	  return this.then(function() {
	    return newq.reject(err);
	  });
	};


/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var globals = __webpack_require__(1);
	var newq = __webpack_require__(2);
	
	module.exports = function(ms, msg) {
	  var def = globals.$defer(this);
	  var to = setTimeout(function() {
	    def.reject(new newq.TimeoutError(msg || 'Timed out after ' + ms + ' ms'));
	  }, ms);
	
	  this
	    .then(function(val) {
	      def.resolve(val);
	    }, function(err) {
	      def.reject(err);
	    })
	    ['finally'](clearTimeout.bind(null, to))
	  ;
	
	  return def.promise;
	};


/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(3);
	var globals = __webpack_require__(1);
	
	var Gate = module.exports = function Gate(options) {
	  this.$options = _.defaults(options, {
	    concurrency: 1,
	    maxQueue: 0
	  });
	  this.$fns = [];
	};
	
	Gate.prototype.add = function(fn) {
	  // if (this.$options.maxQueue > 0 && this.$fns.length - this.$options.concurrency >= this.$options.maxQueue)
	  //     return def.reject(new Error('Max queue size reached'));
	
	  var def = globals.$defer();
	
	  var $fn = function() {
	    fn()
	      ['finally'](function() {
	        this.$fns.splice(this.$fns.indexOf($fn), 1);
	
	        if (this.$fns.length >= this.$options.concurrency)
	          this.$fns[this.$options.concurrency - 1]();
	      }.bind(this))
	
	      .then(function(val) {
	        def.resolve(val);
	      }, function(err) {
	        def.reject(err);
	      })
	    ;
	  }.bind(this);
	
	  if (this.$fns.push($fn) <= this.$options.concurrency)
	    $fn();
	
	  return def.promise;
	};


/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(3);
	
	module.exports = function bindMethods(array) {
	  return _.map(array, function(arg) {
	    if (!_.isFunction(arg))
	      return arg;
	    return arg.bind(this.$$boundTo || this);
	  }, this);
	};


/***/ }
/******/ ])
});
;
//# sourceMappingURL=angular-extend-promises.js.map