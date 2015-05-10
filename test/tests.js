// import declare from '../lib/js-test';
// import ConsoleLogger from '../lib/ConsoleLogger';
import testIt from './testIt';
import testBeforeEach from './testBeforeEach';
import testAfterEach from './testAfterEach';

testIt();
testBeforeEach();
testAfterEach();

// testAsyncIt();

/* global describe, beforeEach, afterEach, it */
// let testRunner = declare(() => {
//   describe("my test framework", () => {
//     beforeEach( () => {
//       this.thing = { some: 'thing' };
//     });
//
//     beforeEach( () => {
//       return new Promise( (resolve) => {
//         setTimeout(resolve, 1000);
//       });
//     });
//
//     it('should have stuff from the beforeEach() call', () => {
//       this.previouslyDeclaredThing = { some: 'other thing' };
//       if (!this.thing) {
//         throw new Error("@thing is undefined");
//       }
//     });
//
//     it('should not have stuff from previous tests', () => {
//       if (this.previouslyDeclaredThing) {
//         throw new Error("@previouslyDeclaredThing is still defined");
//       }
//     });
//
//     it('should respect async tests', () => {
//       return new Promise( (resolve) => {
//         setTimeout(resolve, 5000);
//       });
//     });
//
//     afterEach( () => {} );
//   });
// }, { in: window });
//
// testRunner(ConsoleLogger()).run();
