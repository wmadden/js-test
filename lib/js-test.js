import declarator from './Declarator';
import treeRunner from './TreeRunner';

function declare(tests, options) {
  let { in: globalScope } = options || {};

  // TODO: default global scope
  // if (!globalScope) {
  //   globalScope = window;
  // }
  let rootContext = declarator({ globalScope }).declare(tests);
  return (logger) => {
    if (!logger) {
      throw new Error("You must supply a logger");
    }
    return treeRunner(rootContext, logger);
  };
}

export default declare;
