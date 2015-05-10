function success(message) {
  console.log(`%c${message}`, "color: green;");
}

function failure(message) {
  console.log(`%c${message}`, "color: red;");
}

function error(error) {
  console.log(error);
}

export default {
  success,
  failure,
  error
};
