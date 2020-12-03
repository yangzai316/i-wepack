const fs = require("fs");

const path = require("path");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const babel = require("@babel/core");


class Webpack {
  constructor(options) {
    this.options = options;
    const { entry, output } = options;
    this.entry = entry;
    this.output = output;
    this.modules = [];
  }

  run() {
    const entryModule = this.parse(this.entry);

    this.modules.push(entryModule)

    this.collectDependence(entryModule.dependencies); 
    const modulesObj = {};
    this.modules.forEach(item => {
      modulesObj[item.filename] = {
        dependencies: item.dependencies,
        code: item.code
      }
    }); 
    this.file(modulesObj);
  }

  collectDependence(dependencies) { 
    for (let key in dependencies) {
      const _ = this.parse(dependencies[key]);
      this.modules.push(_);
      this.collectDependence(_.dependencies);
    }
  }

  parse(entry) {
    //获取入口文件的内容
    const content = fs.readFileSync(entry, "utf-8");
    //将内容转为 ast
    const Ast = parser.parse(content, {
      sourceType: "module"
    });
    //处理 ast 数据，只处理Node.type = 'ImportDeclaration';\
    //dependencies 得到入口文件依赖的模块路径
    const dependencies = {};
    traverse(Ast, {
      ImportDeclaration({ node }) {
        const fullPath = "./" + path.join(path.dirname(entry), node.source.value);
        dependencies[node.source.value] = fullPath;
      }
    });




    const { code } = babel.transformFromAst(Ast, null, {
      presets: ["@babel/preset-env"]
    });

    return {
      filename: entry,
      dependencies,
      code
    };

  }

  file(code) {
    const filePath = path.join(this.output.path, this.output.filename);

    const newCode = JSON.stringify(code);

    const bundle = `(function(graph){
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
        require('${this.entry}') //./src/index
    })(${newCode})`;

    fs.writeFileSync(filePath, bundle, "utf-8");
    console.log('打包结束...')
  }
};
module.exports = Webpack;