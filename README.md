# loxjs: Making a programming language with Javascript

This repo is a JS port of Bob Nystrom's amazing book [Crafting Interpreters](http://www.craftinginterpreters.com/).

▶️ If you're interested in learning how it works, check out my youtube series ["Making a programming language with JavaScript"](https://www.youtube.com/playlist?list=PL83wNvo6TbPjdQI2bvGAe-VjROaeoTC5P)

There are branches that correspond to each chapter of the book.
1. [Scannning](https://github.com/nuvic/loxjs/tree/chp4.scanners) (chp4 in the book) (Part 1 on YouTube)
2. [Representing Code](https://github.com/nuvic/loxjs/tree/chp5) (chp5 in the book) (Part 2 on YouTube)
3. [Parsing Expressions](https://github.com/nuvic/loxjs/tree/chp6) (chp6 in the book) (Part 3 on YouTube)
4. [Evaluating Expressions](https://github.com/nuvic/loxjs/tree/chp7) (chp7 in the book) (Part 4 on YouTube)
4. [Statements and State](https://github.com/nuvic/loxjs/tree/chp8) (chp8 in the book) (Part 5 on YouTube)

Table of contents:
1. [lox code](#lox)
2. [Running lox](#running-lox)
3. [tests](#running-tests)

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
```console
> node src/main.js
```

To run it from a file:
```console
> node src/main.js your_file.lox
```

## Running tests

Requires `Node 18` to run tests.

```console
> node --test
```
