/*eslint no-console:0 */

function success(message) {
  console.log(`%c${message}`, "color: green;");
}

function failure(message) {
  console.log(`%c${message}`, "color: red;");
}

function printError(error) {
  console.log(error);
}

export default {
  success,
  failure,
  error: printError
};
