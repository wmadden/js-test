function treeRunner(rootContext, logger) {
  function collectHooks({ for: context }) {
    if (!context) {
      return { before: [], after: [] };
    }
    let parentHooks = collectHooks({ for: context.parent });
    return {
      before: parentHooks.before.concat(context.beforeHooks),
      after: parentHooks.after.concat(context.afterHooks)
    };
  }

  function testRunner({ for: test, belongingTo: context }) {
    function runHooks(remainingHooks, { in: scope }) {
      if (remainingHooks.length === 0) {
        return Promise.resolve();
      }
      let hook = remainingHooks.shift();
      logger.runHook(hook);
      return Promise.resolve()
        .then(() => hook.func.call(scope))
        .then(() => runHooks(remainingHooks, { in: scope }));
    }

    function run() {
      let testScope = {};
      let hooks = collectHooks({ for: context });
      return Promise.resolve()
        .then(() => runHooks(hooks.before, { in: testScope }))
        .then(() => {
          logger.executeTest(test);
          return test.definition.call(testScope);
        })
        .then(
          () => test.result = { successful: true },
          (error) => test.result = { successful: false, error }
        )
        .then(() => {
          logger.testCompleted(test);
          return runHooks(hooks.after, { in: testScope });
        })
        .catch((error) => {
          if (!test.result.successful) {
            return; // Don't overwrite the error already recorded for the test
          }
          test.result = { successful: false, error };
        });
    }

    return { test, run };
  }

  function contextRunner({ for: context }) {
    function runTests(remainingTests) {
      if (remainingTests.length === 0) {
        return Promise.resolve();
      }
      return testRunner({ for: remainingTests.pop(), belongingTo: context })
        .run()
        .then(() => runTests(remainingTests));
    }

    function runContexts(remainingContexts) {
      if (remainingContexts.length === 0) {
        return Promise.resolve(remainingContexts);
      }
      return contextRunner({ for: remainingContexts.pop() }).run()
        .then(() => runContexts(remainingContexts));
    }

    function run() {
      return Promise.resolve()
        .then(() => logger.enterContext(context))
        .then(() => runTests(context.tests.slice(0)))
        .then(() => runContexts(context.childContexts.slice(0)))
        .then(() => logger.leaveContext(context))
        .then(() => { return context; });
    }

    return { context, run };
  }

  return { run: () => contextRunner({ for: rootContext }).run() };
}

export default treeRunner;
