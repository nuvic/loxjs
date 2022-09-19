import { TokenType } from './TokenType.js';
import { Token } from './Token.js';
import { Lox } from './Lox.js';

class Scanner {
  constructor(source) {
    this.keywords = {
      'and': TokenType.AND,
      'class': TokenType.CLASS,
      'else': TokenType.ELSE,
      'false': TokenType.FALSE,
      'for': TokenType.FOR,
      'fun': TokenType.FUN,
      'if': TokenType.IF,
      'nil': TokenType.NIL,
      'or': TokenType.OR,
      'print': TokenType.PRINT,
      'return': TokenType.RETURN,
      'super': TokenType.SUPER,
      'this': TokenType.THIS,
      'true': TokenType.TRUE,
      'var': TokenType.VAR,
      'while': TokenType.WHILE
    }

    this.source = source;
    this.tokens = [];
    this.start = 0;
    this.current = 0;
    this.line = 1;
  }

  scanTokens() {
    while (!this.isAtEnd()) {
      this.start = this.current;
      this.scanToken();
    }

    this.tokens.push(
      new Token({
        type: TokenType.EOF,
        lexeme: "",
        literal: null,
        line: this.line
      }))

    return this.tokens;
  }

  scanToken() {
    let c = this.advance();
    switch (c) {
      case '(': this.addToken(TokenType.LEFT_PAREN); break;
      case ')': this.addToken(TokenType.RIGHT_PAREN); break;
      case '{': this.addToken(TokenType.LEFT_BRACE); break;
      case '}': this.addToken(TokenType.RIGHT_BRACE); break;
      case ',': this.addToken(TokenType.COMMA); break;
      case '.': this.addToken(TokenType.DOT); break;
      case '-': this.addToken(TokenType.MINUS); break;
      case '+': this.addToken(TokenType.PLUS); break;
      case ';': this.addToken(TokenType.SEMICOLON); break;
      case '*': this.addToken(TokenType.STAR); break;

      case '!': this.addToken(this.match('=') ? TokenType.BANG_EQUAL : TokenType.BANG); break;
      case '=': this.addToken(this.match('=') ? TokenType.EQUAL_EQUAL : TokenType.EQUAL); break;
      case '<': this.addToken(this.match('=') ? TokenType.LESS_EQUAL : TokenType.LESS);
      case '>': this.addToken(this.match('=') ? TokenType.GREATER_EQUAL : TokenType.GREATER); break;
      case '/':
        if (this.match('/')) {
          // A comment goes until the end of the line.
          while (this.peek() != '\n' && !this.isAtEnd()) this.advance();
        } else {
          this.addToken(TokenType.SLASH);
        }
        break;

      case ' ':
      case '\r':
      case '\t':
        // Ignore whitespace.
        break;

      case '\n':
        this.line++;
        break;

      case '"': this.string(); break;

      default:
        if (this.isDigit(c)) {
          this.number();
        } else if (this.isAlpha(c)) {
          this.identifier();
        } else {
          Lox.error(this.line, "Unexpected character.");
        }
        break;
    }
  }

  identifier() {
    while (this.isAlphaNumeric(this.peek())) this.advance();

    const text = this.source.substring(this.start, this.current);
    let type = this.keywords[text];
    if (type == null) type = TokenType.IDENTIFIER;
    this.addToken(type);
  }

  number() {
    while (this.isDigit(this.peek())) this.advance();

    // Look for a fractional part.
    if (this.peek() == '.' && this.isDigit(this.peekNext())) {
      // Consume the "."
      this.advance();

      while (this.isDigit(this.peek())) this.advance();
    }

    this.addTokenWithLiteral(
      TokenType.NUMBER,
      parseFloat(this.source.substring(this.start, this.current))
    );
  }

  string() {
    while (this.peek() != '"' && !this.isAtEnd()) {
      // Allow for multiline strings
      if (this.peek() == '\n') this.line++;
      this.advance();
    }

    if (this.isAtEnd()) {
      Lox.error(this.line, "Unterminated string.");
      return;
    }

    // The closing ".
    this.advance();

    // Trim the surrounding quotes.
    const value = this.source.substring(this.start + 1, this.current - 1);
    this.addTokenWithLiteral(TokenType.STRING, value);
  }

  match(expected) {
    if (this.isAtEnd()) return false;
    if (this.source.charAt(this.current) != expected) return false;

    this.current++;
    return true;
  }

  peek() {
    if (this.isAtEnd()) return '\0';
    return this.source.charAt(this.current);
  }

  peekNext() {
    if (this.current + 1 >= this.source.length) return '\0';
    return this.source.charAt(this.current + 1);
  }

  isAlpha(c) {
    return (c >= 'a' && c <= 'z') ||
           (c >= 'A' && c <= 'Z') ||
           c == '_';
  }

  isAlphaNumeric(c) {
    return this.isAlpha(c) || this.isDigit(c);
  }

  isDigit(c) {
    return c >= '0' && c <= '9';
  }

  isAtEnd() {
    return this.current >= this.source.length;
  }

  advance() {
    const c =  this.source.charAt(this.current);
    this.current++;
    return c;
  }

  addToken(type) {
    this.addTokenWithLiteral(type, null)
  }

  addTokenWithLiteral(type, literal) {
    const text = this.source.substring(this.start, this.current);
    this.tokens.push(
      new Token({
        type: type,
        lexeme: text,
        literal: literal,
        line: this.line
      })
    );
  }

}

export { Scanner };