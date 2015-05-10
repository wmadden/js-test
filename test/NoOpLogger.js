function NoOpLogger() {
  return {
    enterContext: () => {},
    executeTest: () => {},
    testCompleted: () => {},
    leaveContext: () => {},
    runHook: () => {}
  };
}

export default NoOpLogger;
