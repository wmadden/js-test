/*eslint no-console:0 */

let tests = 0;

function success(message) {
  tests += 1;
  console.log(`%c${tests}: ${message}`, "color: green;");
}

function failure(message) {
  tests += 1;
  console.log(`%c${tests}: ${message}`, "color: red;");
}

function printError(error) {
  console.log(error);
}

export default {
  success,
  failure,
  error: printError
};
