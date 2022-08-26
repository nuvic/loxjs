import { argv } from 'node:process';
import fs from 'fs';
import readline from 'node:readline';

import { Scanner } from './Scanner.js';

class Lox {
  constructor() {
    this.hadError = false;
  }

  static main() {
    // 1st element is `process.execPath` and 2nd element is path to JS file being executed
    const args = argv.slice(2);

    if (args.length > 1) {
      console.log("Usage: node src/index.js [script]")
      process.exit(9);
    } else if (args.length == 1) {
      this.runFile(args[0]);
    } else {
      this.runPrompt();
    }
  }

  static runFile(source) {
    const data = fs.readFileSync(source, 'utf8');
    this.run(data);

    if (this.hadError) process.exit(1);
  }

  static runPrompt() {
    // https://nodejs.org/api/readline.html#readlinecreateinterfaceoptions
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: '> '
    })
    
    rl.prompt();

    rl.on('line', (line) => {
      this.run(line);
      this.hadError = false;
      rl.prompt();
    })
  }

  static run(source) {
    const scanner = new Scanner(source);
    const tokens = scanner.scanTokens();

    for (let t of tokens) {
      console.log(t);
    }
  }

  static error(line, message) {
    this.report(line, "", message);
  }

  static report(line, where, message) {
    console.error(
      `[line ${line}] Error${where}: ${message}`
    );

    this.hadError = true;
  }

}

export { Lox };
