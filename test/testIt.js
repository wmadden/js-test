import declare from '../lib/js-test';
import NoOpLogger from './NoOpLogger';

/* global describe, beforeEach, afterEach, it */
/*eslint no-console:0 */

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
    console.log("%cSuccess is recorded correctly ✓", "color: green;");
  }).catch((error) => {
    console.error("Success is not recorded correctly ✗");
    console.log(error);
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
    console.log("%cFailure is recorded correctly ✓", "color: green;");
  }).catch((error) => {
    console.error("Failure is not recorded correctly ✗");
    console.log(error);
  });
}

function testIt() {
  testSuccess();
  testFailure();
}

export default testIt;
