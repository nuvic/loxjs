# loxjs: Making a programming language with Javascript

This repo is a JS port of Bob Nystrom's amazing book [Crafting Interpreters](http://www.craftinginterpreters.com/).

Table of contents:
1. [lox code](#lox)
2. [Running lox](#running-lox)

## lox

This repo builds a JS interpreter for the programming language `lox`. It's syntax is from the C family, so it will look familiar to you if you know C, Java, Javascript, etc. It is also a dynamically typed language.

Here are some examples of what `lox` code looks like.

```js
print "Hello, world!";
```

```js
1 == 2;         // false.
"cat" != "dog"; // true.
123 == "123"; // false.
```

```js
var average = (min + max) / 2;
```

```js
if (condition) {
  print "yes";
} else {
  print "no";
}
```

```js
for (var a = 1; a < 10; a = a + 1) {
  print a;
}
```

```js
fun printSum(a, b) {
  print a + b;
}
```

```js
fun addPair(a, b) {
  return a + b;
}

fun identity(a) {
  return a;
}

print identity(addPair)(1, 2); // Prints "3".
```

```js
class Breakfast {
  cook() {
    print "Eggs a-fryin'!";
  }

  serve(who) {
    print "Enjoy your breakfast, " + who + ".";
  }
}
```

## Running lox

There are 2 ways to run lox code:
- REPL
- from a file

To run it in a REPL:
```bash
> node src/main.js
```

To run it from a file:
```bash
> node src/main.js your_file.lox
```
