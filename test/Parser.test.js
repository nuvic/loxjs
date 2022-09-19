import test from 'node:test';
import assert from 'node:assert/strict';
import { Binary, Unary, Literal, Grouping } from '../src/Expr.js';
import { Token } from '../src/Token.js';
import { Parser } from '../src/Parser.js'; 

test('returns correct parsed expression for a simple statement: `1 + 5;`', () => {
  const tokens = [
    new Token({ type: 'num', lexeme: '1', literal: 1, line: 1 }),
    new Token({ type: '+', lexeme: '+', literal: null, line: 1 }),
    new Token({ type: 'num', lexeme: '5', literal: 5, line: 1 }),
    new Token({ type: ';', lexeme: ';', literal: null, line: 1 }),
    new Token({ type: 'eof', lexeme: '', literal: null, line: 1 })
  ]

  const parser = new Parser(tokens);
  const expression = parser.parse();

  const expected = new Binary( 
    new Literal(1), // left
    new Token({ type: '+', lexeme: '+', literal: null, line: 1 }), // operator
    new Literal(5) // right
  )

  assert.deepStrictEqual(expression, expected)
})

test('returns correct parsed expression for a grouped expression: `1 * (5 + 3);`', () => {
  const tokens = [
    new Token({ type: 'num', lexeme: '1', literal: 1, line: 1 }),
    new Token({ type: '*', lexeme: '*', literal: null, line: 1 }),
    new Token({ type: '(', lexeme: '(', literal: null, line: 1 }),
    new Token({ type: 'num', lexeme: '5', literal: 5, line: 1 }),
    new Token({ type: '+', lexeme: '+', literal: null, line: 1 }),
    new Token({ type: 'num', lexeme: '3', literal: 3, line: 1 }),
    new Token({ type: ')', lexeme: ')', literal: null, line: 1 }),
    new Token({ type: ';', lexeme: ';', literal: null, line: 1 }),
    new Token({ type: 'eof', lexeme: '', literal: null, line: 1 })
  ]

  const parser = new Parser(tokens);
  const expression = parser.parse();

  const expected = new Binary( 
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

  assert.deepStrictEqual(expression, expected)
})

test('returns correct parsed expression for a unary expression: `!false`', () => {
  const tokens = [
    new Token({ type: '!', lexeme: '!', literal: null, line: 1 }),
    new Token({ type: 'false', lexeme: 'false', literal: null, line: 1 }),
    new Token({ type: 'eof', lexeme: '', literal: null, line: 1 })
  ]

  const parser = new Parser(tokens);
  const expression = parser.parse();

  const expected = new Unary(
    new Token({ type: '!', lexeme: '!', literal: null, line: 1 }), // operator
    new Literal(false) // right
  )

  assert.deepStrictEqual(expression, expected)
})

test('returns null for an invalid expression: `var ++`', () => {
  const tokens = [
    new Token({ type: 'var', lexeme: 'var', literal: null, line: 1 }),
    new Token({ type: '+', lexeme: '+', literal: null, line: 1 }),
    new Token({ type: '+', lexeme: '+', literal: null, line: 1 }),
    new Token({ type: 'eof', lexeme: '', literal: null, line: 1 })
  ]

  const parser = new Parser(tokens);
  const expression = parser.parse();

  assert.strictEqual(expression, null)
})
