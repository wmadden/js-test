function ConsoleLogger() {
  var depth = 0;
  var testOutput = null;

  function indent() {
    var result = "";
    for(var i = 1; i < depth; i++) {
      result += '  ';
    }
    return result;
  }

  return {
    enterContext: (context) => {
      if (context.description) {
        console.log(`${indent()}Entering context: ${context.description}`);
      }
      depth += 1;
    },

    executeTest: (test) => {
      testOutput = `${indent()}It ${test.description}...`;
    },

    testCompleted: ({ result: { successful, error } }) => {
      if (successful) {
        console.log(`${testOutput} passed!`);
      }
      else {
        console.error(`${testOutput} failed!`, error);
      }
      testOutput = null;
    },

    leaveContext: () => {
      depth -= 1;
    },

    runHook: (hook) => {
      console.log(`${indent()}Running ${hook.type} hook:`, hook.func);
    }
  };
}

export default ConsoleLogger;
