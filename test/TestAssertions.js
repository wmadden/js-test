/*eslint no-console:0 */
function assertTestsSucceeded(testContext, parentDescription) {
  let contextDescription = '';
  if (parentDescription) {
    contextDescription += parentDescription + ' ';
  }
  if (testContext.description) {
    contextDescription += testContext.description;
  }
  testContext.tests.forEach( (test) => {
    let testDescription = `${contextDescription} ${test.description}`;
    if (test.result.successful) {
      console.log(`%c${testDescription} ✓`, "color: green;");
    } else {
      console.log(`%c${testDescription} ✗`, "color: red;");
      console.log(test.result.error);
    }
  });
  testContext.childContexts.forEach( (childContext) => {
    assertTestsSucceeded(childContext, contextDescription);
  });
}

function assertTestsFailed(testContext, parentDescription) {
  let contextDescription = '';
  if (parentDescription) {
    contextDescription += parentDescription + ' ';
  }
  if (testContext.description) {
    contextDescription += testContext.description;
  }
  testContext.tests.forEach( (test) => {
    let testDescription = `${contextDescription} ${test.description}`;
    if (!test.result.successful) {
      console.log(`%c${testDescription} ✗ (expected failure)`, "color: green;");
    } else {
      console.log(`%c${testDescription} ✓`, "color: red;");
    }
  });
  testContext.childContexts.forEach( (childContext) => {
    assertTestsFailed(childContext, contextDescription);
  });
}

export default { assertTestsSucceeded, assertTestsFailed };
