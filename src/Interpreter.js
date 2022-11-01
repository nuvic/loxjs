import { Lox } from './Lox.js'
import { TokenType } from './TokenType.js';
import { RuntimeError } from './RuntimeError.js';
import { Environment } from './Environment.js';

class Interpreter {
  constructor() {
    this.environment = new Environment;
  }

  interpret(statements) {
    const values = [];

    try {
      for (let stmt of statements) {
        values.push(this.execute(stmt));
      }

      return values;
    } catch (error) {
      Lox.runtimeError(error);
    }
  }

  accept(visitor) { }

  // sends the expression back into the interpreter's
  // visitor implementation
  evaluate(expr) {
    return expr.accept(this);
  }

  execute(stmt) {
    return stmt.accept(this);
  }

  executeBlock(statements, newEnv) {
    const previous = this.environment;
    
    try {
      this.environment = newEnv;

      for (let stmt of statements) {
        this.execute(stmt);
      }
    } finally {
      // throw away the new environment in this block at the end
      this.environment = previous;
    }
  }

  visitBlockStmt(stmt) {
    return this.executeBlock(stmt.statements, new Environment(this.environment));
  }

  visitExpressionStmt(stmt) {
    return this.evaluate(stmt.expression);
  }

  visitPrintStmt(stmt) {
    const value = this.evaluate(stmt.expression);
    console.log(value);
    return value;
  }

  visitVarStmt(stmt) {
    let value = null;
    if (stmt.initializer != null) {
      value = this.evaluate(stmt.initializer);
    }

    return this.environment.define(stmt.name.lexeme, value);
  }

  visitAssignExpr(expr) {
    const value = this.evaluate(expr.value);
    this.environment.assign(expr.name, value);
    return value;
  }

  visitVariableExpr(expr) {
    return this.environment.get(expr.name);
  }

  visitLiteralExpr(expr) {
    return expr.value;
  }

  visitUnaryExpr(expr) {
    const right = this.evaluate(expr.right);

    switch (expr.operator.type) {
      case TokenType.BANG:
        return !this.isTruthy(right);
      case TokenType.MINUS:
        this.checkNumberOperand(expr.operator, right);
        return -Number(right);
    }

    // Unreachable.
    return null;
  }

  checkNumberOperand(operator, operand) {
    if (typeof(operand) === 'number') return;
    throw new RuntimeError(operator, "Operand must be a number.");
  }

  checkNumberOperands(operator, left, right) {
    if (typeof(left) === 'number' && typeof(right) === 'number') return;
    throw new RuntimeError(operator, "Operands must be numbers.");
  }

  // `false` and `nil` are falsey,
  // and everything else is truthy.
  isTruthy(object) {
    if (object === null) return false;
    if (typeof object === 'boolean') return Boolean(object);
    return true;
  }

  visitGroupingExpr(expr) {
    return this.evaluate(expr.expression);
  }

  visitBinaryExpr(expr) {
    const left = this.evaluate(expr.left);
    const right = this.evaluate(expr.right);

    switch (expr.operator.type) {
      case TokenType.GREATER:
        this.checkNumberOperands(expr.operator, left, right)
        return Number(left) > Number(right);
      case TokenType.GREATER_EQUAL:
        this.checkNumberOperands(expr.operator, left, right)
        return Number(left) >= Number(right);
      case TokenType.LESS:
        this.checkNumberOperands(expr.operator, left, right)
        return Number(left) < Number(right);
      case TokenType.LESS_EQUAL:
        this.checkNumberOperands(expr.operator, left, right)
        return Number(left) <= Number(right);
      case TokenType.BANG_EQUAL:
        return !this.isEqual(left, right);
      case TokenType.EQUAL_EQUAL:
        return this.isEqual(left, right);
      case TokenType.MINUS:
        this.checkNumberOperands(expr.operator, left, right)
        return Number(left) - Number(right);
      case TokenType.PLUS:
        if (typeof(left) === 'number' && typeof(right) === 'number') {
          return Number(left) + Number(right);
        }

        if (typeof(left) === 'string' && typeof(right) === 'string') {
          return left + right;
        }

        throw new RuntimeError(expr.operator, "Operands must be two numbers or two strings.");
      case TokenType.SLASH:
        this.checkNumberOperands(expr.operator, left, right)
        return Number(left) / Number(right);
      case TokenType.STAR:
        this.checkNumberOperands(expr.operator, left, right)
        return Number(left) * Number(right);
    }

    // Unreachable.
    return null;
  }

  isEqual(a, b) {
    if (a === null && b === null) return true;
    if (a === null) return false;

    // strict equality comparison without type conversion
    return a === b;
  }
}

export { Interpreter };
