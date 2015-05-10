import declare from '../lib/js-test';
import NoOpLogger from './NoOpLogger';
import { assertTestsSucceeded } from './TestAssertions';
import * as print from './Print';

/* global describe, beforeEach, afterEach, it */

function testBeforeEachWorks() {
  let testRunner = declare(function() {
    describe("A context with a beforeEach() hook", function() {
      let beforeEachRan = false;

      beforeEach(function() {
        beforeEachRan = true;
      });

      it("should run the hook before the test", function() {
        if (!beforeEachRan) {
          throw new Error("The beforeEach() hook should have run first");
        }
      });
    });

    describe("A context with a beforeEach() hook", function() {
      beforeEach(function() {
        this.beforeEachWasHere = true;
      });

      it("should share `this` between the beforeHook and the test", function() {
        if (!this.beforeEachWasHere) {
          throw new Error("The beforeEach() hook should have the same `this` object as the test");
        }
      });
    });

    describe("A context with a beforeEach() hook", function() {
      let outerBeforeEachRan = false;

      beforeEach(function() {
        outerBeforeEachRan = true;
      });

      describe("and a nested test", function() {
        beforeEach(function() {
          if (!outerBeforeEachRan) {
            throw new Error("The outer beforeEach() hook should have run before the inner one");
          }
        });

        it("should call the outer beforeEach()", function() {
          if (!outerBeforeEachRan) {
            throw new Error("The outer beforeEach() hook should have run before the test");
          }
        });
      });
    });

    describe("A test with an async beforeEach() hook", function() {
      let beforeEachRan = false;

      beforeEach(function() {
        return new Promise( (resolve) => {
          setTimeout(function() {
            beforeEachRan = true;
            resolve();
          });
        });
      });

      it("should run the hook before the test", function() {
        if (!beforeEachRan) {
          throw new Error("The beforeEach() hook should have run first");
        }
      });
    });
  }, { in: window });

  testRunner(NoOpLogger()).run().then((result) => {
    assertTestsSucceeded(result, '');
  });
}

function testBeforeEachFailures() {
  let testRunner = declare(function() {
    describe("A context with a faulty beforeEach() hook", function() {
      beforeEach(function() {
        throw new Error("beforeEach() error");
      });

      it("should not call the tests at all", function() {
        throw new Error("The beforeEach() hook should fail first");
      });
    });
  }, { in: window });

  testRunner(NoOpLogger()).run().then((result) => {
    let test = result.childContexts[0].tests[0];
    if (test.result.successful) {
      print.failure('Faulty beforeEach() did not cause the test to fail ✗');
      return;
    }
    if (test.result.error.message !== "beforeEach() error") {
      print.failure('Faulty beforeEach() test failed for unexpected reason ✗');
      print.error(test.result.error);
      return;
    }
    print.success('Faulty beforeEach() causes test to fail ✓');
  });
}

function testBeforeEach() {
  testBeforeEachWorks();
  testBeforeEachFailures();
}

export default testBeforeEach;
