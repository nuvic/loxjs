import test from 'node:test';
import assert from 'node:assert/strict';
import { AstPrinter } from '../src/AstPrinter.js';
import { Binary, Unary, Literal, Grouping } from '../src/Expr.js';
import { Token } from '../src/Token.js';
import { TokenType } from '../src/TokenType.js';

test('prints out a nested expression as AST', (t) => {
  const expression = new Binary(
    new Unary(
      new Token(
        { type: TokenType.MINUS, lexeme: "-", literal: null, line: 1 }
      ),
      new Literal(123)
    ),
    new Token(
      { type: TokenType.STAR, lexeme: "*", literal: null, line: 1 }
    ),
    new Grouping(new Literal(45.67))
  );

  const res = new AstPrinter().print(expression);

  const expected = "(* (- 123) (group 45.67))";

  assert.strictEqual(res, expected);
});
