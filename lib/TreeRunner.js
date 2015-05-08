function treeRunner(rootContext, logger) {
  function contextRunner({ for: context }) {
    function run() {
      return Promise.resolve()
        .then(() => logger.enterContext(context))
        .then(() => runTests(context.tests.slice(0)))
        .then(() => runContexts(context.childContexts.slice(0)))
        .then(() => logger.leaveContext(context))
    }

    function runTests(remainingTests) {
      if (remainingTests.length == 0)
        return Promise.resolve();
      return testRunner({ for: remainingTests.pop(), belongingTo: context })
        .run()
        .then(() => { runTests(remainingTests) });
    }

    function runContexts(remainingContexts) {
      if (remainingContexts.length == 0)
        return Promise.resolve(remainingContexts);
      return contextRunner({ for: remainingContexts.pop() }).run()
        .then(() => runContexts(remainingContexts));
    }

    return { context, run };
  };

  function testRunner({ for: test, belongingTo: context }) {
    function run() {
      testScope = {};
      hooks = collectHooks({ for: context });
      return Promise.resolve()
        .then(() => runHooks(hooks.before, { in: testScope }))
        .then(() => {
          logger.executeTest(test);
          return test.definition.call(testScope);
        })
        .then(
          success = () => test.result = { successful: true },
          (error) => test.result = { successful: false, error }
        )
        .then(() => {
          logger.testCompleted(test);
          return runHooks(hooks.after, { in: testScope });
        });
    }

    function collectHooks({ for: context }) {
      if (!context)
        return { before: [], after: [] };
      parentHooks = collectHooks({ context: context.parent });
      return {
        before: parentHooks.before.concat(context.beforeHooks),
        after: parentHooks.after.concat(context.afterHooks)
      };
    }

    function runHooks(remainingHooks, { in: scope }) {
      if (remainingHooks.length == 0)
        return Promise.resolve(remainingHooks)
      hook = remainingHooks.pop();
      logger.runHook(hook);
      return Promise.resolve(hook.func.call(scope))
        .then( () => runHooks(remainingHooks, { in: scope }));
    }

    return { test, run };
  };

  return { run: () => contextRunner({ for: rootContext }).run() };
}
