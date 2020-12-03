(function(graph){
        function require(module){
            function localRequire(relativePath){
               
               return require( graph[module].dependencies[relativePath])
            }
            var exports={};
            (function(require,exports,code){
                eval(code)
            })(localRequire,exports,graph[module].code)
            
            return exports;
        }
        require('./test/index.js') //./src/index
    })({"./test/index.js":{"dependencies":{"./a.js":"./test\\a.js"},"code":"\"use strict\";\n\nvar _a = require(\"./a.js\");\n\nvar fun = function fun() {\n  console.log('>>>', _a.a);\n  console.log('>>>c', _a.c);\n  console.log('>>>b', _a.b);\n};\n\nfun();\nconsole.log('hello');"},"./test\\a.js":{"dependencies":{"./c.js":"./test\\c.js"},"code":"\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nObject.defineProperty(exports, \"b\", {\n  enumerable: true,\n  get: function get() {\n    return _c.b;\n  }\n});\nObject.defineProperty(exports, \"c\", {\n  enumerable: true,\n  get: function get() {\n    return _c.c;\n  }\n});\nexports.a = void 0;\n\nvar _c = require(\"./c.js\");\n\nvar a = '123';\nexports.a = a;"},"./test\\c.js":{"dependencies":{"./b.js":"./test\\b.js"},"code":"\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nObject.defineProperty(exports, \"b\", {\n  enumerable: true,\n  get: function get() {\n    return _b.b;\n  }\n});\nexports.c = void 0;\n\nvar _b = require(\"./b.js\");\n\nconsole.log(_b.b);\nvar c = 'ccc';\nexports.c = c;"},"./test\\b.js":{"dependencies":{},"code":"\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.b = void 0;\nvar b = 'bbb';\nexports.b = b;"}})