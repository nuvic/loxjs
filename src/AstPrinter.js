class AstPrinter {
  print(expr) {
    return expr.accept(this);
  }

  visitBinaryExpr(expr) {
    return this.parenthesize(expr.operator.lexeme, expr.left, expr.right);
  }

  visitGroupingExpr(expr) {
    return this.parenthesize("group", expr.expression);
  }

  visitLiteralExpr(expr) {
    if (expr.value == null) return "nil";
    return expr.value.toString();
  }

  visitUnaryExpr(expr) {
    return this.parenthesize(expr.operator.lexeme, expr.right);
  }

  parenthesize(name, ...exprs) {
    let s = "";

    s += `(${name}`;

    exprs.forEach(expr => {
      s += ` ${expr.accept(this)}`;
    });

    s += `)`;

    return s;
  }
}

export { AstPrinter };
