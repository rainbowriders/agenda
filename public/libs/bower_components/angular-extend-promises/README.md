Angular-extend-promises
=======================

Have you ever dreamed of using Angular's promises like [Bluebird](https://github.com/petkaantonov/bluebird)'s? With methods like ```map```, ```join```, ```filter```, ```tap```, …?

Now you can!


# Setup

This library uses lodash as a dependency. Two versions are shipped:

- one without lodash (it will require ```window._```. This is your best choice if you already use lodash in your project)
- one with an embedded custom build of lodash, only the parts needed, nothing more.

### Install the library

With Bower:

    bower install angular-extend-promises

With NPM:

    npm install angular-extend-promises


### Then, include the js file in your project:

    <!-- if you already included lodash -->
    <script src="bower_components/angular-extend-promises/angular-extend-promises-without-lodash.min.js" type="text/javascript"></script>

    <!-- if you don't -->
    <script src="bower_components/angular-extend-promises/angular-extend-promises.min.js" type="text/javascript"></script>

Replace ```bower_components``` by ```node_modules``` if necessary.

### Finally, include the module in your app:

```js
angular.module('my-project', [
  // [...]
  'angular-extend-promises'
])
```

And that's all! Angular's $q now contains all your favorite helpers!

# Documentation

## Core

On $q:

- [```$q.defer()```](#markdown-header-qdefer)
- [```$q.join(Promise|Thenable|value promises…, Function handler)```](#markdown-header-qjoinpromisethenablevalue-promises-function-handler)
- [```$q.method(Function method)```](#markdown-header-qmethodfunction-method)
- [```$q.reject(dynamic reason)```](#markdown-header-qrejectdynamic-reason)
- [```$q.resolve(dynamic value)```](#markdown-header-qresolvedynamic-value)
- [```$q.try(Function fn [, Array<dynamic>|dynamic argument] [, dynamic ctx])```](#markdown-header-qtryfunction-fn-91-arraydynamicdynamic-arguments93-91-dynamic-ctx93)
- [```$q.when(dynamic value)```](#markdown-header-qwhendynamic-value)

On promises:

- [```.bind(dynamic thisArg)```](#markdown-header-binddynamic-thisarg)
- [```.catch(Function handler)```](#markdown-header-catchfunction-handler)
- [```.finally(Function handler)```](#markdown-header-finallyfunction-handler)
- [```.spread([Function fulfilledHandler] [, Function rejectedHandler ])```](#markdown-header-spread91function-fulfilledhandler93-91-function-rejectedhandler-93)
- [```.then([Function fulfilledHandler] [, Function rejectedHandler ])```](#markdown-header-then91function-fulfilledhandler93-91-function-rejectedhandler-93)

## Collections

On $q and on promises:

- [```.all()```](#markdown-header-all)
- [```.any()```](#markdown-header-any)
- [```.each(Function iterator)```](#markdown-header-eachfunction-iterator)
- [```.filter(Function filterer [, Object options])```](#markdown-header-filterfunction-filterer-object-options)
- [```.map(Function mapper [, Object options])```](#markdown-header-mapfunction-mapper-object-options)
- [```.props()```](#markdown-header-props)
- [```.reduce(Function reducer [, dynamic initialValue])```](#markdown-header-reducefunction-reducer-dynamic-initialvalue)
- [```.settle()```](#markdown-header-settle) **not implemented yet**
- [```.some(int count)```](#markdown-header-someint-count)

## Utility

On promises:

- [```.call(String propertyName [, dynamic arg...])```](#markdown-header-callstring-propertyname-dynamic-arg)
- [```.get(String propertyName)```](#markdown-header-getstring-propertyname)
- [```.return(dynamic value)```](#markdown-header-returndynamic-value)
- [```.tap(Function handler)```](#markdown-header-tapfunction-handler)
- [```.throw(dynamic reason)```](#markdown-header-throwdynamic-reason)

## Promisification

On promises

- [```.nodeify([Function callback] [, Object options])```](#markdown-header-nodeify91function-callback93-91-object-options93)

## Timers

On promises:

- [```.delay(int ms)```](#markdown-header-delayint-ms)
- [```.timeout(int ms [, String message])```](#markdown-header-timeoutint-ms-string-message)


## Error management

On promises:

- [```.done([Function fulfilledHandler] [, Function rejectedHandler ])```](#markdown-header-done91function-fulfilledhandler93-91-function-rejectedhandler-93)


## Aliases

IE8 doesn't handle keywords as properties or method's names, so using ```.catch()``` will throw ```"SCRIPT1010: Expected identifier"``` for example.

You can use aliases in order not to use the ugly ```['catch'](err)``` syntax.

- ```$q.attempt``` -> ```$q.try```
- ```.caught``` -> ```.catch```
- ```.lastly``` -> ```.finally```
- ```.thenReturn``` and ```.returns``` -> ```.return```
- ```.thenThrow``` -> ```.throw```

You can configure this behavior during the initialization of your app:

```js
.config(['angularExtendPromisesProvider', function (angularExtendPromisesProvider) {
    angularExtendPromisesProvider.options.compatibilityAliases = false;
    angularExtendPromisesProvider.options.disableES5Methods = true;
}])
```

#### compatibilityAliases

The option ```compatibilityAliases``` is ```true``` by default.

You may want to disable aliases if your target browsers are ≥ IE9 (you don't need them).

#### disableES5Methods

The option ```disableES5Methods``` is ```false``` by default.

When ```true```, it disables ```.catch()```, ```.finally()```, ```.try()```, ```.return()``` and ```.throw()```.

This is a good way to prevent other contributors to use these methods when your app must run on IE ≤ 8.


## $q.defer()

Example:

```js
function thatReturnsAPromise() {
  var def = $q.defer();

  try {
    doAsyncStuff(function callback(result) {
      if (result.err)
        return def.reject(result.err);

      return def.resolve(result);
    });
  }
  catch (err) {
    def.reject(result.err);
  }

  return def.promise;
}
```

More documentation on [Angular's project](https://docs.angularjs.org/api/ng/service/$q#defer)


## $q.join(Promise|Thenable|value promises…, Function handler)

Example:

```js
$q.join(getPictures(), getComments(), getTweets(),
  function(pictures, comments, tweets) {
    console.log('in total: ' + pictures.length + comments.length + tweets.length);
  }
);
```

More documentation on [Bluebird's project](https://github.com/petkaantonov/bluebird/blob/master/API.md#promisejoinpromisethenablevalue-promises-function-handler---promise)


## $q.method(Function method)

Example:

```js
MyClass.prototype.method = Promise.method(function(input) {
  if (!this.isValid(input))
    throw new TypeError('input is not valid');

  if (this.cachedFor(input))
    return this.someCachedValue;

  return db.queryAsync(input).bind(this)
    .then(function(value) {
      this.someCachedValue = value;
      return value;
    })
  ;
});
```

More documentation on [Bluebird's project](https://github.com/petkaantonov/bluebird/blob/master/API.md#promisemethodfunction-fn---function)


## $q.reject(dynamic reason)

Example:

```js
$q.reject('Just because.')
  .catch(function(theReason) {
    console.error(theReason);
  })
;
```

More documentation on [Angular's project](https://docs.angularjs.org/api/ng/service/$q#reject)


## $q.resolve(dynamic value)

Example:

```js
$q.resolve(value)
  .then(function(resolvedValue) {
    console.log(resolvedValue);
  })
;
```

More documentation on [Bluebird's project](https://github.com/petkaantonov/bluebird/blob/master/API.md#promiseresolvedynamic-value---promise)


## $q.try(Function fn \[, Array<dynamic>|dynamic argument\] \[, dynamic ctx\])

Example:

```js
function getUserById(id) {
  return $q.try(function() {
    if (!_.isNumber(id)) {
      throw new Error('id must be a number');
    }
    return db.getUserById(id);
  });
}
```

Alias: $q.attempt

More documentation on [Bluebird's project](https://github.com/petkaantonov/bluebird/blob/master/API.md#promisetryfunction-fn--arraydynamicdynamic-arguments--dynamic-ctx----promise)


## $q.when(dynamic value)

Example:

```js
$q.when(somethingPossiblyAPromise)
  .then(function(resolvedValue) {
    console.log(resolvedValue);
  })
;
```

More documentation on [Angular's project](https://docs.angularjs.org/api/ng/service/$q#when)


## .bind(dynamic thisArg)

Example:

```js
somethingAsync().bind({})
  .spread(function (a, b) {
    this.a = a;
    this.b = b;
    return somethingElseAsync(a, b);
  })
  .then(function (c) {
    return this.a + this.b + c;
  });

```

More documentation on [Bluebird's project](https://github.com/petkaantonov/bluebird/blob/master/API.md#binddynamic-thisarg---promise)


## .catch(Function handler)

Example:

```js
somePromise
  .then(function() {
    return a.b.c.d();
  })
  .catch(TypeError, function(e) {
    // If a is defined, will end up here because it is a type error to reference property of undefined
  })
  .catch(ReferenceError, function(e) {
    // Will end up here if a wasn't defined at all
  })
  .catch(MyCustomError1, MyCustomError2, function(e) {
    // Will end up here if one of the 2 defined above
  })
  .catch(function predicate(e) {
    return e.code >= 400
  }, function(e) {
    // Will end up here if e.code >= 400
  })
  .catch(MyCustomError3, function predicate(e) {
    return e.code < 300;
  }, function(e) {
    // You can mix predicates & error constructor to filter errors
  })
  .catch(function(e) {
    // Generic catch-the rest, error wasn't TypeError nor ReferenceError
  })
;
```

Alias: Promise.caught

More documentation on [Angular's project](https://docs.angularjs.org/api/ng/service/$q#the-promise-api)
and on [Bluebird's project](https://github.com/petkaantonov/bluebird/blob/master/API.md#catchfunction-errorclassfunction-predicate-function-handler---promise)


## .finally(Function handler)

Example:

```js
$scope.jobRunning = true;
job.run(data)
  .then(function(output) {
    $scope.output = output;
  })
  .catch(errorHandler)
  .finally(function() {
    $scope.jobRunning = false;
  })
;
```

Alias: Promise.lastly

More documentation on [Angular's project](https://docs.angularjs.org/api/ng/service/$q#the-promise-api)


## .spread(\[Function fulfilledHandler\] \[, Function rejectedHandler \])

Example:

```js
$q.all([somethingAsync1, somethingAsync2])
  .spread(function(result1, result2) {
    console.log(arguments);
  })
;
```

More documentation on [Bluebird's project](https://github.com/petkaantonov/bluebird/blob/master/API.md#spreadfunction-fulfilledhandler--function-rejectedhandler----promise)


## .then(\[Function fulfilledHandler\] \[, Function rejectedHandler \])

Example:

```js
$http.get(url)
  .then(function(result) {
    console.log(result.data);
  })
;
```

More documentation on [Angular's project](https://docs.angularjs.org/api/ng/service/$q#the-promise-api)


## .all()

Example:

```js
$q.resolve(urls)
  .map($http.get)
  .all(function(results) {
    console.log(results.join('\n'));
  })
;
```

More documentation on [Bluebird's project](https://github.com/petkaantonov/bluebird/blob/master/API.md#all---promise)


## .any()

Like ```.some()```, with 1 as ```count```.

However, if the promise fulfills, the fulfillment value is not an array of 1 but the value directly.

More documentation on [Bluebird's project](https://github.com/petkaantonov/bluebird/blob/master/API.md#any---promise)


## .each(Function iterator)

Example:

```js
$q.resolve(['http://some.url', urlPromise])
  .each(function(url, index, length) {
    return ping(url)
      .catch(function() {
        console.warn('Url ' + url + ' does not respond...');
      })
    ;
  })
;
```

More documentation on [Bluebird's project](https://github.com/petkaantonov/bluebird/blob/master/API.md#eachfunction-iterator---promise)


## .filter(Function filterer [, Object options])

Example:

```js
$q.resolve(values)
  // keep only even numbers
  .filter(function(val, i, length) {
    return !(val % 2); // you can also return a promise here
  })
;
```

More documentation on [Bluebird's project](https://github.com/petkaantonov/bluebird/blob/master/API.md#filterfunction-filterer--object-options---promise)


## .map(Function mapper [, Object options])

Example:

```js
$q.resolve(values)
  // square
  .map(function(val, index, length) {
    return val * val; // you can also return a promise here
  })
;
```

More documentation on [Bluebird's project](https://github.com/petkaantonov/bluebird/blob/master/API.md#mapfunction-mapper--object-options---promise)


## .props()

Example:

```js
promise.resolve({
  prop1: 42,
  prop2: somePromise
})
  .props()
  .then(function(val) {
    // val.prop === 42
    // val.prop2 is the resolveValue of somePromise
  })
;
```

More documentation on [Bluebird's project](https://github.com/petkaantonov/bluebird/blob/master/API.md#props---promise)


## .reduce(Function reducer [, dynamic initialValue])

Example:

```js
$q.resolve(values)
  // sum values
  .reduce(function(acc, val, index, length) {
    return acc + val; // you can also return a promise here
  }, 0)
;
```

More documentation on [Bluebird's project](https://github.com/petkaantonov/bluebird/blob/master/API.md#reducefunction-reducer--dynamic-initialvalue---promise)


## .settle()

**Not implemented yet**

More documentation on [Bluebird's project](https://github.com/petkaantonov/bluebird/blob/master/API.md#settle---promise)


## .some(int count)

Example:

```js
promise.resolve([$q.resolve(42).delay(10), 21, $q.resolve(0).delay(20)])
  // get first x promises that resolve (ignore rejections)
  .some(2)
  .then(function(vals) {
    // vals === [21, 42]
  })
;
```

More documentation on [Bluebird's project](https://github.com/petkaantonov/bluebird/blob/master/API.md#someint-count---promise)


## .call(String propertyName [, dynamic arg...])

Example:

```js
$q.resolve({
  method: function(arg1, arg2) {}
})
  // calls object's 'method' method with arg1 === 21 & arg2 === 42
  .call('method', 21, 42)
;
```

More documentation on [Bluebird's project](https://github.com/petkaantonov/bluebird/blob/master/API.md#callstring-propertyname--dynamic-arg---promise)


## .get(String propertyName)

Example:

```js
$q.resolve({
  prop: 42
})
  .get('prop')
  // here value in then will be 42
;

$q.resolve([21, 42])
  .get(1)
  // here value in then will be 42
;
```

More documentation on [Bluebird's project](https://github.com/petkaantonov/bluebird/blob/master/API.md#getstring-propertyname---promise)


## .return(dynamic value)

Example:

```js
$q.resolve(values)
  .return(42)
  // here value in then will be 42
;
```

Alias: Promise.returns & Promise.thenReturn

More documentation on [Bluebird's project](https://github.com/petkaantonov/bluebird/blob/master/API.md#returndynamic-value---promise)


## .tap(Function handler)

Example:

```js
$q.resolve(42)
  .tap(function(val) {
    console.log(val);
    return $q.reolve(21).delay(10);
  })
  // here value in then will be 42 but it will sync promise
  // on 21 and thus wait for the 10ms delay
```

More documentation on [Bluebird's project](https://github.com/petkaantonov/bluebird/blob/master/API.md#tapfunction-handler---promise)


## .throw(dynamic reason)

Example:

```js
$q.resolve(42)
  .throw(new Error('toto'))
  // here the promise will coninue on its error flow with
  // the constructed error
;
```

Alias: Promise.thenThrow

More documentation on [Bluebird's project](https://github.com/petkaantonov/bluebird/blob/master/API.md#throwdynamic-reason---promise)


## .nodeify(\[Function callback\] \[, Object options\])

Example:

```js
$q.resolve([1,2,3]).nodeify(function(err, result) {
  // err == null
  // result is the array [1,2,3]
});

$q.resolve([1,2,3]).nodeify(function(err, a, b, c) {
  // err == null
  // a == 1
  // b == 2
  // c == 3
}, {spread: true});
```

More documentation on [Bluebird's project](https://github.com/petkaantonov/bluebird/blob/master/API.md#nodeifyfunction-callback--object-options---promise)


## .delay(int ms)

Example:

```js
$q.resolve(42)
  // wait 10ms before going through with the previous value
  .delay(10)
  // here value will be 42 in then
```

More documentation on [Bluebird's project](https://github.com/petkaantonov/bluebird/blob/master/API.md#delayint-ms---promise)


## .timeout(int ms [, String message])

Example:

```js
$q.resolve($q.resolve(42).delay(20))
  // fail if values do not resolve in 10ms max
  .timeout(10, 'optional message to construct the TimeoutError with')
  // thus here promise will be rejected with a $q.TImeoutError
;
```

More documentation on [Bluebird's project](https://github.com/petkaantonov/bluebird/blob/master/API.md#timeoutint-ms--string-message---promise)


## .done(\[Function fulfilledHandler\] \[, Function rejectedHandler \])

Example:

```js
$q.reject(42)
  .done() // will throw 42 globally
;

$q.resolve(42)
  .done(function() {
    // will throw 42 globally
    return $q.reject(42);
  })
;

$q.resolve(42)
  .done(function() {
    throw 42; // will throw 42 globally
  })
;

$q.reject(42)
  .done(null, function() {}) // will not throw
;
```

More documentation on [Bluebird's project](https://github.com/petkaantonov/bluebird/blob/master/API.md#donefunction-fulfilledhandler--function-rejectedhandler----void)


# Tests

The library is tested as much as possible. Right now there are:

* 60 unit tests
* 90 functional tests

We probably still miss tests, PR are welcome!

# You've seen a bug, you'd like a feature

Pull requests are welcome! (and an issue tracker is available)


# License

[License MIT](raw/master/LICENSE)
