import * as print from './Print';

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
      print.success(`${testDescription} ✓`);
    } else {
      print.failure(`${testDescription} ✗`);
      print.error(test.result.error);
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
      print.success(`${testDescription} ✗ (expected failure)`);
    } else {
      print.failure(`${testDescription} ✓`);
    }
  });
  testContext.childContexts.forEach( (childContext) => {
    assertTestsFailed(childContext, contextDescription);
  });
}

export default {
  assertTestsSucceeded,
  assertTestsFailed
};
