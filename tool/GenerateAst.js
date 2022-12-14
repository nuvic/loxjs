import { argv } from 'node:process';
import fs from 'fs';
import path, { basename } from 'node:path';

class GenerateAst {
  constructor() {
    this.outputDir;
  }
  static main() {
    // 1st element is `process.execPath` and 2nd element is path to JS file being executed
    const args = argv.slice(2);

    if (args.length != 1) {
      console.log("Usage: node src/GenerateAst.js <output directory>");
      process.exit(9);
    }

    this.outputDir = args[0];

    this.defineAst(this.outputDir, "Expr", [
      ["Assign", "name, value"],
      ["Binary", "left, operator, right"],
      ["Grouping", "expression"],
      ["Literal", "value"],
      ["Unary", "operator, right"],
      ["Variable", "name"]
    ]);

    this.defineAst(this.outputDir, "Stmt", [
      ["Block", "statements"],
      ["Expression", "expression"],
      ["Print", "expression"],
      ["Var", "name, initializer"]
    ]);
  }

  static defineAst(outputDir, baseName, types) {
    const outputPath = path.resolve(outputDir, `${baseName}.js`);
    const writer = fs.createWriteStream(outputPath, { flags: 'a' });

    writer.write("// Generated by tool/GenerateAst.js\n\n");
    writer.write(`class ${baseName} {\n`);
    writer.write(`  accept(visitor) {}\n`);
    writer.write(`}\n\n`);

    const allClasses = [];

    // The AST classes.
    for (const type of types) {
      const className = type[0].trim();
      allClasses.push(className);
      const fields = type[1].trim();
      this.defineType(writer, baseName, className, fields);
    }

    // Exports
    const allClassesString = allClasses.join(", ");
    writer.write(`export { ${baseName}, ${allClassesString} };\n`)

    writer.close();
  }

  static defineType(writer, baseName, className, fieldList) {
    writer.write(`class ${className} extends ${baseName} {\n`)
    writer.write(`  constructor(${fieldList}) {\n`)
    writer.write(`    super();\n`)

    const fields = fieldList.split(", ");

    for (const field of fields) {
      writer.write(`    this.${field} = ${field};\n`);
    }
    writer.write("  }\n\n");

    writer.write(`  accept(visitor) {\n`);
    writer.write(`    return visitor.visit${className}${baseName}(this);\n`);
    writer.write("  }\n");

    writer.write("}\n\n");
  }
}

GenerateAst.main();
