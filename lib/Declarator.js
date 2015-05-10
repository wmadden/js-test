function declarator() {
  const GLOBAL_METHOD_NAMES = ['describe', 'it', 'beforeEach', 'afterEach'];
  let methodMap = {
    // shortcut : methodName
    describe: 'newContext',
    context: 'newContext',
    it: 'newTest',
    afterEach: 'afterHook',
    beforeEach: 'beforeHook'
  };

  function DSLMethods({ for: context, in: globalScope }) {
    return {
      newContext(innerDescription, innerTestDefinitions) {
        let innerContext = testContext({
          parent: context,
          description: innerDescription,
          originalFunction: innerTestDefinitions,
          globalScope
        });
        context.childContexts.push(innerContext);
        within({ context: innerContext, from: context,
          run: innerTestDefinitions, in: globalScope });
      },

      newTest(testDescription, definition) {
        // Record the context on the test object for visibility during debugging
        context.tests.push({ description: testDescription, definition,
          context: context });
      },

      beforeHook(func) {
        context.beforeHooks.push({ type: 'before', func });
      },

      afterHook(func) {
        context.afterHooks.push({ type: 'after', func });
      }
    };
  }

  function setCurrentContext({ to: context, in: globalScope }) {
    let methods = DSLMethods({ for: context, in: globalScope });

    Object.keys(methodMap).forEach( (shortcutName) => {
      let methodName = methodMap[shortcutName];
      globalScope[shortcutName] = methods[methodName];
    });
  }

  function deleteGlobalMethods({ in: globalScope }) {
    Object.keys(methodMap).forEach( (shorcutName) => {
      delete globalScope[shorcutName];
    });
  }

  function within({ context: context, from: originalContext, run: func, in: globalScope }) {
    setCurrentContext({ to: context, in: globalScope });
    func();
    setCurrentContext({ to: originalContext, in: globalScope });
  }

  function testContext({ parent, description, originalFunction, globalScope }) {
    return {
      parent,
      description,
      originalFunction,
      beforeHooks: [],
      afterHooks: [],
      tests: [],
      childContexts: []
    };
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
