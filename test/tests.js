import declare from '../lib/js-test';
import ConsoleLogger from '../lib/ConsoleLogger';

/* global describe, beforeEach, afterEach, it */
let testRunner = declare(() => {
  describe("when a test doesn't throw an error", () => {
    beforeEach( () => {

    });

    it("should be considered successful", () => {

    });
  });

  // describe("when a test")

  beforeEach( () => {
    /*eslint no-console:0 */
    console.log("Come on");
  });

  describe("my test framework", () => {
    beforeEach( () => {
      this.thing = { some: 'thing' };
    });

    beforeEach( () => {
      return new Promise( (resolve) => {
        setTimeout(resolve, 1000);
      });
    });

    it('should have stuff from the beforeEach() call', () => {
      this.previouslyDeclaredThing = { some: 'other thing' };
      if (!this.thing) {
        throw new Error("@thing is undefined");
      }
    });

    it('should not have stuff from previous tests', () => {
      if (this.previouslyDeclaredThing) {
        throw new Error("@previouslyDeclaredThing is still defined");
      }
    });

    it('should record failures', () => {
      throw new Error("I'm a broken test");
    });

    it('should respect async tests', () => {
      return new Promise( (resolve) => {
        setTimeout(resolve, 5000);
      });
    });

    afterEach( () => {} );
  });
}, { in: window });

testRunner(ConsoleLogger()).run();
