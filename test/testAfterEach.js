import declare from '../lib/js-test';
import NoOpLogger from './NoOpLogger';
import { assertTestsSucceeded, assertTestsFailed } from './TestAssertions';

/*eslint no-console:0 */
/* global describe, beforeEach, afterEach, it */

function testAfterEachWorksAtAll() {
  let afterEachRan = false;
  let testRunner = declare(function() {
    describe("A context with an afterEach() hook", function() {
      afterEach(function() {
        afterEachRan = true;
      });

      it("should only call the afterEach() after the test", function() {
        if (afterEachRan) {
          throw new Error("The afterEach() hook should not have run before the test");
        }
      });
    });
  }, { in: window });

  testRunner(NoOpLogger()).run().then((result) => {
    assertTestsSucceeded(result, '');
    if (afterEachRan) {
      console.log(`%cafterEach() is called ✓`, "color: green;");
    } else {
      console.log(new Error("afterEach() is not called ✗"));
    }
  });
}

function testAfterEachWorksInNestedTests() {
  let outerAfterEachRan = false;
  let testRunner = declare(function() {
    describe("A context with an afterEach() hook", function() {
      afterEach(function() {
        outerAfterEachRan = true;
      });

      describe("and a nested test", function() {
        it("should only call the afterEach() after the test", function() {
          if (outerAfterEachRan) {
            throw new Error("The afterEach() hook should not have run before the test");
          }
        });
      });
    });
  }, { in: window });

  testRunner(NoOpLogger()).run().then(function() {
    if (outerAfterEachRan) {
      console.log(`%cafterEach() is called for nested tests ✓`, "color: green;");
    } else {
      console.log(new Error("afterEach() is not called for nested tests ✗"));
    }
  });
}

function testAfterEachSomeMore() {
  let testRunner = declare(function() {
    describe("A context with an afterEach() hook", function() {
      it("should share `this` between the afterEach() hook and the test", function() {
        this.testWasHere = true;
      });

      afterEach(function() {
        if (!this.testWasHere) {
          throw new Error("The test and afterEach() should have the same `this`");
        }
      });
    });

    describe("A context with an afterEach() hook", function() {
      let afterEachRan = false;

      afterEach(function() {
        afterEachRan = true;
      });

      it("should only call the afterEach() after the test", function() {
        if (afterEachRan) {
          throw new Error("The afterEach() hook should not have run before the test");
        }
      });
    });
  }, { in: window });

  testRunner(NoOpLogger()).run().then((result) => {
    assertTestsSucceeded(result, '');
  });
}

function testAsyncAfterEach() {
  let afterEachRan = false;
  let testRunner = declare(function() {
    describe("A test with an async afterEach() hook", function() {
      it("should only call the afterEach() after the test", function() {
        if (afterEachRan) {
          throw new Error("The afterEach() hook should not have run before the test");
        }
      });

      afterEach(function() {
        return new Promise( (resolve) => {
          setTimeout(function() {
            afterEachRan = true;
            resolve();
          });
        });
      });
    });
  }, { in: window });

  testRunner(NoOpLogger()).run().then((result) => {
    assertTestsSucceeded(result, '');
    if (afterEachRan) {
      console.log(`%cTest runner waits for async afterEach()  ✓`, "color: green;");
    } else {
      console.log(new Error("Test runner does not wait for async afterEach() ✗"));
    }
  });
}

function testAfterEachFailures() {
  let testRunner = declare(function() {
    describe("A context with a faulty afterEach() hook", function() {
      it("should fail the test if the hook fails", function() {
        // I would pass otherwise
      });

      afterEach(function() {
        throw new Error("afterEach() throws an error");
      });
    });
  }, { in: window });

  testRunner(NoOpLogger()).run().then((result) => {
    assertTestsFailed(result, '');
  });
}

function testAfterEach() {
  testAfterEachWorksAtAll();
  testAfterEachWorksInNestedTests();
  testAfterEachSomeMore();
  testAsyncAfterEach();
  testAfterEachFailures();
}

export default testAfterEach;
