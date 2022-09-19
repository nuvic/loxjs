import { TokenType } from './TokenType.js';
import { Binary, Literal, Grouping, Unary } from './Expr.js';
import { Lox } from './Lox.js';

class ParseError extends Error {}

/*
Grammar rules for the lox parser

expression     → equality ;
equality       → comparison ( ( "!=" | "==" ) comparison )* ;
comparison     → term ( ( ">" | ">=" | "<" | "<=" ) term )* ;
term           → factor ( ( "-" | "+" ) factor )* ;
factor         → unary ( ( "/" | "*" ) unary )* ;
unary          → ( "!" | "-" ) unary
              | primary ;
primary        → NUMBER | STRING | "true" | "false" | "nil"
              | "(" expression ")" ;
*/
class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.current = 0;
  }

  parse() {
    try {
      return this.expression();
    } catch(err) {
      if (err instanceof ParseError) {
        return null;
      } else {
        throw err;
      }
    }
  }

  expression() {
    return this.equality();
  }

  // equality       → comparison ( ( "!=" | "==" ) comparison )* ;
  equality() {
    let expr = this.comparison();

    while (this.match(TokenType.BANG_EQUAL, TokenType.EQUAL_EQUAL)) {
      const operator = this.previous();
      const right = this.comparison();
      expr = new Binary(expr, operator, right);
    }

    return expr;
  }

  match(...types) {
    for (const type of types) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }

    return false;
  }

  check(type) {
    if (this.isAtEnd()) return false;
    return this.peek().type == type;
  }

  advance() {
    if (!this.isAtEnd()) this.current++;
    return this.previous();
  }

  isAtEnd() {
    return this.peek().type == TokenType.EOF;
  }

  peek() {
    return this.tokens.at(this.current);
  }

  previous() {
    return this.tokens.at(this.current - 1);
  }

  // comparison     → term ( ( ">" | ">=" | "<" | "<=" ) term )* ;
  comparison() {
    let expr = this.term();

    while (this.match(TokenType.GREATER, TokenType.GREATER_EQUAL, TokenType.LESS, TokenType.LESS_EQUAL)) {
      const operator = this.previous();
      const right = this.term();
      expr = new Binary(expr, operator, right);
    }

    return expr;
  }

  // term           → factor ( ( "-" | "+" ) factor )* ;
  term() {
    let expr = this.factor();

    while (this.match(TokenType.MINUS, TokenType.PLUS)) {
      const operator = this.previous();
      const right = this.factor();
      expr = new Binary(expr, operator, right);
    }

    return expr;
  }

  // factor         → unary ( ( "/" | "*" ) unary )* ;
  factor() {
    let expr = this.unary();

    while (this.match(TokenType.SLASH, TokenType.STAR)) {
      const operator = this.previous();
      const right = this.unary();
      expr = new Binary(expr, operator, right);
    }

    return expr;
  }

  // unary          → ( "!" | "-" ) unary
  //                | primary ;
  unary() {
    if (this.match(TokenType.BANG, TokenType.MINUS)) {
      const operator = this.previous();
      const right = this.unary();
      return new Unary(operator, right);
    }

    return this.primary();
  }

  // primary      → NUMBER | STRING | "true" | "false" | "nil"
  //              | "(" expression ")" ;
  primary() {
    if (this.match(TokenType.FALSE)) return new Literal(false);
    if (this.match(TokenType.TRUE)) return new Literal(true);
    if (this.match(TokenType.NIL)) return new Literal(null);

    if (this.match(TokenType.NUMBER, TokenType.STRING)) {
      return new Literal(this.previous().literal);
    }

    if (this.match(TokenType.LEFT_PAREN)) {
      const expr = this.expression();
      this.consume(TokenType.RIGHT_PAREN, "Expect ')' after expression.");
      return new Grouping(expr);
    }

    // if none of the cases match,
    // it means there is a token that can't start an expression
    throw this.error(this.peek(), "Expect expression.");
  }

  consume(type, message) {
    if (this.check(type)) return this.advance();

    throw this.error(this.peek(), message);
  }

  error(token, message) {
    Lox.parseError(token, message);
    return new ParseError();
  }

  // after catching a ParseError,
  // discard tokens that would have likely caused cascaded errors
  // by discarding tokens until it finds a statement boundary
  synchronize() {
    this.advance();

    while (!this.isAtEnd()) {
      // if next token is a semicolon, we're probably going to start a statement
      if (this.previous().type == TokenType.SEMICOLON) return;

      switch(this.peek().type) {
        case TokenType.CLASS:
        case TokenType.FUN:
        case TokenType.VAR:
        case TokenType.FOR:
        case TokenType.IF:
        case TokenType.WHILE:
        case TokenType.PRINT:
        case TokenType.RETURN:
          return;
      }

      this.advance();
    }
  }
}

export { Parser };
