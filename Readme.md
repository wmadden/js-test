# js-test

I was thoroughly sick of the existing bloated test frameworks (I'm looking at
you, Mocha) so I decided to write my own.

# Usage

It's just JavaScript. Include it on Node or in the Browser, declare and run
your tests.

```javascript

require(['js-test', 'MyClass'], function({ declare, ConsoleLogger }, MyClass) {

  testRunner = declare(function() {
    describe("MyClass", function() {
      beforeEach(function() {
        this.myClass = new MyClass();
      });

      it("should do something awesome", function() {
        expect(this.myClass.somethingAwesome()).to.exist;
      });
    });
  });

  testRunner(ConsoleLogger()).run();

});

```

# Things it can do

Standard BDD-style test methods:

- `describe(description, suiteFn)`
- `beforeEach(hookFn)`
- `afterEach(hookFn)`
- `it(description, specFn)`

If any of the `hookFn` or `specFn` functions returns a Promise, execution will
wait for it to complete.

# Logging

`declare()` returns a test runner factory which takes as its only argument a
logger instance.

The logger looks like this:

```javascript
{
  enterContext: function({ description }) {},

  executeTest: function({ description }) {},

  testCompleted: function({ description, result: { successful, error } }) {},

  leaveContext: function({ description }) {},

  executeHook: function({ type, func }) {}
}
```

The objects passed in are the internal representations of contexts, tests and
hooks, which have other properties but guarantee to conform to this interface.

# Test Runner

The test runner returned by the `declare()` factory looks like this:

```javascript
{
  run: function() {}
}
```

It will run your tests.
