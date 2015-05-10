import declare from '../lib/js-test';
import NoOpLogger from './NoOpLogger';
import { assertTestsSucceeded } from './TestAssertions';
import * as print from './Print';

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
      print.success("afterEach() is called ✓");
    } else {
      print.failure("afterEach() is not called ✗");
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
        afterEach(function() {
          if (!outerAfterEachRan) {
            throw new Error("The outer afterEach() hook should have run before the inner one");
          }
        });

        it("should only call the afterEach() after the test", function() {
          if (outerAfterEachRan) {
            throw new Error("The afterEach() hook should not have run before the test");
          }
        });
      });
    });
  }, { in: window });

  testRunner(NoOpLogger()).run().then(function(result) {
    if (outerAfterEachRan) {
      print.success("afterEach() is called for nested tests ✓");
    } else {
      print.failure("afterEach() is not called for nested tests ✗");
    }
    assertTestsSucceeded(result);
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
      print.success("Test runner waits for async afterEach()  ✓");
    } else {
      print.failure("Test runner does not wait for async afterEach() ✗");
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
        throw new Error("afterEach() error");
      });
    });
  }, { in: window });

  testRunner(NoOpLogger()).run().then((result) => {
    let test = result.childContexts[0].tests[0];
    if (test.result.successful) {
      print.failure('Faulty afterEach() did not cause the test to fail ✗');
      return;
    }
    if (test.result.error.message !== "afterEach() error") {
      print.failure('Faulty afterEach() test failed for unexpected reason ✗');
      print.error(test.result.error);
      return;
    }
    print.success('Faulty afterEach() causes test to fail ✓');
  });
}

function testAfterEachFailuresForBrokenTest() {
  let testRunner = declare(function() {
    describe("A context with a faulty afterEach() hook", function() {
      it("should record the test's error", function() {
        throw new Error("error from test");
      });

      afterEach(function() {
        throw new Error("afterEach() error");
      });
    });
  }, { in: window });

  testRunner(NoOpLogger()).run().then((result) => {
    let test = result.childContexts[0].tests[0];
    if (test.result.successful) {
      print.failure('Test did not fail ✗');
      return;
    }
    if (test.result.error.message !== "error from test") {
      print.failure('Did not receive expected error ✗');
      print.error(test.result.error);
      return;
    }
    print.success('Should record error from test despite broken afterEach() ✓');
  });
}

function testAfterEach() {
  testAfterEachWorksAtAll();
  testAfterEachWorksInNestedTests();
  testAfterEachSomeMore();
  testAsyncAfterEach();
  testAfterEachFailures();
  testAfterEachFailuresForBrokenTest();
}

export default testAfterEach;
