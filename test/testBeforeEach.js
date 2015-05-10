import declare from '../lib/js-test';
import NoOpLogger from './NoOpLogger';
import { assertTestsSucceeded, assertTestsFailed } from './TestAssertions';

/*eslint no-console:0 */
/* global describe, beforeEach, afterEach, it */

function testBeforeEachWorks() {
  let testRunner = declare(function() {
    describe("A context with a beforeEach() hook", function() {
      let beforeEachRan = false;

      beforeEach(function() {
        beforeEachRan = true;
        this.beforeEachWasHere = true;
      });

      it("should run the hook before the test", function() {
        if (!beforeEachRan) {
          throw new Error("The beforeEach() hook should have run first");
        }
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
        it("should call the outer beforeEach()", function() {
          if (!outerBeforeEachRan) {
            throw new Error("The outer beforeEach() hook should have run first");
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
        throw new Error("beforeEach() throws an error");
      });

      it("should not call the tests at all", function() {
        throw new Error("The beforeEach() hook should fail first");
      });
    });
  }, { in: window });

  testRunner(NoOpLogger()).run().then((result) => {
    assertTestsFailed(result, '');
  });
}

function testBeforeEach() {
  testBeforeEachWorks();
  testBeforeEachFailures();
}

export default testBeforeEach;
