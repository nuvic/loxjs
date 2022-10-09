import test from 'node:test';
import assert from 'node:assert/strict';
import { Binary, Unary, Literal, Grouping } from '../src/Expr.js';
import { Token } from '../src/Token.js';
import { Lox} from '../src/Lox.js';
import { Interpreter } from '../src/Interpreter.js';

test('interprets expression for a simple statement: `1 + 5;`', () => {
  const expression = new Binary( 
    new Literal(1), // left
    new Token({ type: '+', lexeme: '+', literal: null, line: 1 }), // operator
    new Literal(5) // right
  )

  const interpreter = new Interpreter();

  assert.deepStrictEqual(interpreter.interpret(expression), 6);
});

test('interprets a grouped expression: `1 * (5 + 3);`', () => {
  const expression = new Binary( 
    new Literal(1), // left
    new Token({ type: '*', lexeme: '*', literal: null, line: 1 }), // operator
    new Grouping(
      new Binary(
        new Literal(5),
        new Token({ type: '+', lexeme: '+', literal: null, line: 1 }),
        new Literal(3)
      )
    ) // right
  )

  const interpreter = new Interpreter();

  assert.deepStrictEqual(interpreter.interpret(expression), 8);
});

test('interprets a bang unary expression: `!false`', () => {
  const expression = new Unary(
    new Token({ type: '!', lexeme: '!', literal: null, line: 1 }), // operator
    new Literal(false) // right
  )

  const interpreter = new Interpreter();

  assert.deepStrictEqual(interpreter.interpret(expression), true);
});

test('interprets a minus unary expression: `-5`', () => {
  const expression = new Unary(
    new Token({ type: '-', lexeme: '-', literal: null, line: 1 }), // operator
    new Literal(5) // right
  )

  const interpreter = new Interpreter();

  assert.deepStrictEqual(interpreter.interpret(expression), -5);
});
