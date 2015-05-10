function declarator() {
  const GLOBAL_METHOD_NAMES = ['describe', 'it', 'beforeEach', 'afterEach'];
  let currentContext = null;

  function setCurrentContext({ to: context, in: globalScope }) {
    currentContext = context;
    GLOBAL_METHOD_NAMES.forEach( (methodName) => {
      globalScope[methodName] = context[methodName];
    });
  }

  function deleteGlobalMethods({ in: globalScope }) {
    GLOBAL_METHOD_NAMES.forEach( (methodName) => {
      delete globalScope[methodName];
    });
  }

  function within({ context: context, run: func, in: globalScope }) {
    let originalContext = currentContext;
    setCurrentContext({ to: context, in: globalScope });
    func();
    setCurrentContext({ to: originalContext, in: globalScope });
  }

  function testContext({ parent, description, originalFunction, globalScope }) {
    let localContext;

    // TODO: manufacture these test methods when they're needed instead of here
    function describe(innerDescription, innerTestDefinitions) {
      let innerContext = testContext({
        parent: localContext,
        description: innerDescription,
        originalFunction: innerTestDefinitions,
        globalScope
      });
      localContext.childContexts.push(innerContext);
      within({ context: innerContext, run: innerTestDefinitions, in: globalScope });
    }

    function it(testDescription, definition) {
      // Record the context on the test object for visibility during debugging
      localContext.tests.push({ description: testDescription, definition,
        context: localContext });
    }

    function beforeEach(func) {
      localContext.beforeHooks.push({ type: 'before', func });
    }

    function afterEach(func) {
      localContext.afterHooks.push({ type: 'after', func });
    }

    localContext = {
      parent,
      description,
      beforeHooks: [],
      afterHooks: [],
      tests: [],
      childContexts: [],
      originalFunction,
      describe, it, beforeEach, afterEach
    };
    return localContext;
  }

  function declare(tests, { in: globalScope }) {
    let rootContext = testContext({ globalScope });
    setCurrentContext({ to: rootContext, in: globalScope });
    tests();
    deleteGlobalMethods({ in: globalScope });
    return rootContext;
  }

  return { declare };
}

export default declarator;
