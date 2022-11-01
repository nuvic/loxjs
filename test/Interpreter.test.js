import test from 'node:test';
import assert from 'node:assert/strict';
import { Binary, Unary, Literal, Grouping, Variable } from '../src/Expr.js';
import { Block, Expression, Var } from '../src/Stmt.js';
import { Token } from '../src/Token.js';
import { Lox} from '../src/Lox.js'; // required because Lox calls Interpreter as a static method, so this prevents reference errors
import { Interpreter } from '../src/Interpreter.js';

test('interprets expression for a simple statement: `1 + 5;`', () => {
  const expression = [new Expression(
    new Binary( 
      new Literal(1), // left
      new Token({ type: '+', lexeme: '+', literal: null, line: 1 }), // operator
      new Literal(5) // right
    )
  )];

  const interpreter = new Interpreter();

  assert.deepStrictEqual(interpreter.interpret(expression), [6]);
});

test('interprets a grouped expression: `1 * (5 + 3);`', () => {
  const expression = [new Expression(
    new Binary( 
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
  )];

  const interpreter = new Interpreter();

  assert.deepStrictEqual(interpreter.interpret(expression), [8]);
});

test('interprets a bang unary expression: `!false`', () => {
  const expression = [new Expression(
    new Unary(
      new Token({ type: '!', lexeme: '!', literal: null, line: 1 }), // operator
      new Literal(false) // right
    )
  )];

  const interpreter = new Interpreter();

  assert.deepStrictEqual(interpreter.interpret(expression), [true]);
});

test('interprets a minus unary expression: `-5`', () => {
  const expression = [new Expression(
    new Unary(
      new Token({ type: '-', lexeme: '-', literal: null, line: 1 }), // operator
      new Literal(5) // right
    )
  )];

  const interpreter = new Interpreter();

  assert.deepStrictEqual(interpreter.interpret(expression), [-5]);
});

test('interprets a var assignment: `var a = 5; a;`', () => {
  const expression_var_assignment = [
    new Expression(
      new Var(
        new Token({ type: 'id', lexeme: 'a', literal: null, line: 1 }), // name
        new Literal(5), // initializer
      )
    )
  ]

  const expression_var_use = [
    new Expression(
      new Variable(new Token({ type: 'id', lexeme: 'a', literal: null, line: 1 })),
    )
  ];

  const interpreter = new Interpreter();

  // assign the variable first
  interpreter.interpret(expression_var_assignment);

  assert.deepStrictEqual(interpreter.interpret(expression_var_use), [5]);
});

test('interprets a block properly: `var a = 5; { var b = 3; } var b = 2; a + b;`', () => {
  const expression_var_a = [
    new Expression(
      new Var(
        new Token({ type: 'id', lexeme: 'a', literal: null, line: 1 }), // name
        new Literal(5), // initializer
      )
    )
  ]

  const expression_block = [
    new Block([
      new Var(
        new Token({ type: 'id', lexeme: 'b', literal: null, line: 1 }), // name
        new Literal(3), // initializer
      )
    ])
  ];

  const expression_var_b = [
    new Expression(
      new Var(
        new Token({ type: 'id', lexeme: 'b', literal: null, line: 1 }), // name
        new Literal(2), // initializer
      )
    )
  ]

  const expression_add = [new Expression(
    new Binary( 
      new Variable(new Token({ type: 'id', lexeme: 'a', literal: null, line: 1 })), //left
      new Token({ type: '+', lexeme: '+', literal: null, line: 1 }), // operator
      new Variable(new Token({ type: 'id', lexeme: 'b', literal: null, line: 1 })), //right
    )
  )];

  const interpreter = new Interpreter();

  // assign the variables and interpret block
  interpreter.interpret(expression_var_a);
  interpreter.interpret(expression_block);
  interpreter.interpret(expression_var_b);

  assert.deepStrictEqual(interpreter.interpret(expression_add), [7]);
});
