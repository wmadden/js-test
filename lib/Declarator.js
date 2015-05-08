function declarator() {
  const GLOBAL_METHOD_NAMES = ['describe', 'it', 'beforeEach', 'afterEach'];
  var currentContext = null;

  function declare(tests, { in: globalScope }) {
    var rootContext = testContext({ globalScope });
    setCurrentContext({ to: rootContext, in: globalScope });
    tests();
    deleteGlobalMethods({ in: globalScope });
    return rootContext;
  }

  function setCurrentContext({ to: context, in: globalScope }) {
    var currentContext = context;
    GLOBAL_METHOD_NAMES.forEach( (methodName) => {
      globalScope[methodName] = context[methodName]
    });
  }

  function deleteGlobalMethods({ in: globalScope }) {
    GLOBAL_METHOD_NAMES.forEach( (methodName) => {
      delete globalScope[methodName]
    });
  }

  function within({ context: context, run: func, in: globalScope }) {
    var originalContext = currentContext;
    setCurrentContext({ to: context, in: globalScope });
    func();
    currentContext = originalContext;
  }

  function testContext({ parent, description, originalFunction, globalScope }) {
    var localContext;

    function describe(description, testDefinitions) {
      innerContext = testContext({
        parent: localContext,
        description,
        originalFunction: testDefinitions,
        globalScope
      })
      localContext.childContexts.push(innerContext)
      within({ context: innerContext, run: testDefinitions, in: globalScope })
    }

    function it(description, definition) {
      // Record the context on the test object for visibility during debugging
      localContext.tests.push({ description, definition, context: localContext })
    }

    function beforeEach(func) {
      localContext.beforeHooks.push({ type: 'before', func })
    }

    function afterEach(func) {
      localContext.afterHooks.push({ type: 'after', func })
    }

    return localContext = {
      description,
      beforeHooks: [],
      afterHooks: [],
      tests: [],
      childContexts: [],
      originalFunction,
      describe, it, beforeEach, afterEach
    };
  }

  return { declare };
};

export default declarator;
