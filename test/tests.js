import { declare } from '../lib/js-test';

var testRunner = declare(() => {

  beforeEach( () => {
    var a = "do this first";
    console.log("Come on");
  });

  describe("my test framework", () => {
    beforeEach( () => {
      this.thing = { some: 'thing' };
    });

    beforeEach( () => {
      return new Promise( (resolve, reject) => {
        setTimeout(resolve, 1000);
      });
    });

    it('should have stuff from the beforeEach() call', () => {
      this.previouslyDeclaredThing = { some: 'other thing' };
      if (!this.thing)
        throw new Error("@thing is undefined");
    });

    it('should not have stuff from previous tests', () => {
      if (this.previouslyDeclaredThing)
        throw new Error("@previouslyDeclaredThing is still defined")
    });

    it('should record failures', () => {
      throw new Error("I'm a broken test")
    });

    it('should respect async tests', () => {
      new Promise( (resolve, reject) => {
        setTimeout(resolve, 5000);
      });
    });

    afterEach( () => {} );
  });

});

testRunner(ConsoleLogger()).run();
