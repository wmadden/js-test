import declare from '../lib/js-test';
import NoOpLogger from './NoOpLogger';
import * as print from './Print';
import { assertTestsSucceeded } from './TestAssertions';

/* global describe, beforeEach, afterEach, it */

function testSuccess() {
  let testRunner = declare(function() {
    describe("A test that doesn't throw exceptions", function() {
      it("should pass", function() {
        // I should pass
      });
    });
  }, { in: window });

  testRunner(NoOpLogger()).run().then((result) => {
    if (!result.childContexts[0].tests[0].result.successful) {
      throw new Error("Test was not successful");
    }
    print.success("Success is recorded correctly ✓");
  }).catch((error) => {
    print.failure("Success is not recorded correctly ✗");
    print.error(error);
  });
}

function testFailure() {
  let testRunner = declare(function() {
    describe("A test that throws exceptions", function() {
      it("should not pass", function() {
        throw new Error("I'm an error");
      });
    });
  }, { in: window });

  testRunner(NoOpLogger()).run().then((result) => {
    if (!(
      result.childContexts[0].tests[0].result.successful === false &&
      result.childContexts[0].tests[0].result.error.message === "I'm an error"
    )) {
      throw new Error("Test was not successful");
    }
    print.success("Failure is recorded correctly ✓");
  }).catch((error) => {
    print.failure("Failure is not recorded correctly ✗");
    print.error(error);
  });
}

function testOrderIndependence() {
  let testRunner = declare(function() {
    describe("A test", function() {
      it('should not have stuff from previous tests', function() {
        if (this.previouslyDeclaredThing) {
          throw new Error("this.previouslyDeclaredThing is still defined");
        }
        this.previouslyDeclaredThing = true;
      });

      it('should still not have stuff from previous tests', function() {
        if (this.previouslyDeclaredThing) {
          throw new Error("this.previouslyDeclaredThing is still defined");
        }
        this.previouslyDeclaredThing = true;
      });
    });
  }, { in: window });

  testRunner(NoOpLogger()).run().then((result) => {
    assertTestsSucceeded(result);
  });
}

function testIt() {
  testSuccess();
  testFailure();
  testOrderIndependence();
}

export default testIt;
