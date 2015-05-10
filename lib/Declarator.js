function declarator({ globalScope }) {
  let DSL = {
    // dslMethod : internalMethod
    describe: 'newContext',
    context: 'newContext',
    it: 'newTest',
    afterEach: 'afterHook',
    beforeEach: 'beforeHook'
  };

  function testContext({ parent, description, originalFunction }) {
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

  function setCurrentContext({ to: context }) {
    /*eslint no-use-before-define: 0 */
    let methods = DSLMethods({ for: context });

    Object.keys(DSL).forEach( (dslMethod) => {
      let internalMethod = DSL[dslMethod];
      globalScope[dslMethod] = methods[internalMethod];
    });
  }

  function enterContext({ context: context, andRun: func }) {
    setCurrentContext({ to: context });
    func();
    setCurrentContext({ to: context.parent });
  }

  function DSLMethods({ for: context }) {
    return {
      newContext(description, innerTestDefinitions) {
        let innerContext = testContext({
          parent: context,
          description,
          originalFunction: innerTestDefinitions
        });
        context.childContexts.push(innerContext);
        enterContext({ context: innerContext, andRun: innerTestDefinitions });
      },

      newTest(testDescription, definition) {
        let test = {
          description: testDescription, definition, context,
          call: Function.call.bind(definition)
        };
        context.tests.push(test);
      },

      beforeHook(func) {
        let hook = { type: 'before', func, call: Function.call.bind(func) };
        context.beforeHooks.push(hook);
      },

      afterHook(func) {
        let hook = { type: 'after', func, call: Function.call.bind(func) };
        context.afterHooks.push(hook);
      }
    };
  }

  function deleteGlobalDSLMethods() {
    Object.keys(DSL).forEach( (dslMethod) => {
      delete globalScope[dslMethod];
    });
  }

  function declare(tests) {
    let rootContext = testContext({});
    enterContext({ context: rootContext, andRun: tests });
    deleteGlobalDSLMethods();
    return rootContext;
  }

  return { declare };
}

export default declarator;
