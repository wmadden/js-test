import declarator from './Declarator';
import treeRunner from './TreeRunner';

export default {
  declare: (tests, options) => {
    if (options) {
      var { in: globalScope } = options;
    }
    globalScope = globalScope || this;
    rootContext = declarator().declare(tests, { in: globalScope });
    return (logger) => {
      if (!logger)
        throw new Error("You must supply a logger");
      return treeRunner(rootContext, logger);
    };
  }
};
