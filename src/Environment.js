import { RuntimeError } from "./RuntimeError.js";

class Environment {
  // Each environment has a reference to the environment
  // of the immediately enclosing scope.
  // When we look up a variable, we walk that chain
  // from innermost out until we find the variable.
  // (this is called a parent-pointer tree)
  constructor(enclosing = null) {
    this.enclosing = enclosing;
    this.values = {};
  }

  get(name) {
    if (name.lexeme in this.values) {
      return this.values[name.lexeme];
    }

    if (this.enclosing != null) return this.enclosing.get(name);

    throw new RuntimeError(name, `Undefined variable ${name.lexeme}.`);
  }

  assign(name, value) {
    if (name.lexeme in this.values) {
      this.values[name.lexeme] = value;
      return;
    }

    if (this.enclosing != null) {
      this.enclosing.assign(name, value);
      return;
    }

    throw new RuntimeError(name, `Undefined variable ${name.lexeme}.`);
  }

  define(name, value) {
    this.values[name] = value;
  }
}

export { Environment };
