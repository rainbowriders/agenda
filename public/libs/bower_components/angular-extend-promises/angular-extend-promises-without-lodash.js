/*!
 * angular-extend-promises v1.0.0-rc.3 - 2015-04-22
 * (c) 2014-2015 L.systems SARL, Etienne Folio, Quentin Raynaud
 * https://bitbucket.org/lsystems/angular-extend-promises
 * License: MIT
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory((function webpackLoadOptionalExternalModule() { try { return require("../tmp/lodash"); } catch(e) {} }()));
	else if(typeof define === 'function' && define.amd)
		define(["../tmp/lodash"], factory);
	else if(typeof exports === 'object')
		exports["angular-extend-promises"] = factory((function webpackLoadOptionalExternalModule() { try { return require("../tmp/lodash"); } catch(e) {} }()));
	else
		root["angular-extend-promises"] = factory(root["../tmp/lodash"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_21__) {
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

	if(typeof __WEBPACK_EXTERNAL_MODULE_21__ === 'undefined') {var e = new Error("Cannot find module \"../tmp/lodash\""); e.code = 'MODULE_NOT_FOUND'; throw e;}
	module.exports = __WEBPACK_EXTERNAL_MODULE_21__;

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
	
	var bindMethods = __webpack_require__(41);
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
	
	var bindMethods = __webpack_require__(41);
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
//# sourceMappingURL=angular-extend-promises-without-lodash.js.map