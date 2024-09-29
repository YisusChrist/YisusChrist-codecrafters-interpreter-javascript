import fs from "fs";

// Tokenizer function to scan for parentheses, braces, operators, and other single-character tokens
function tokenize(input) {
  const tokenMap = {
    "(": "LEFT_PAREN ( null",
    ")": "RIGHT_PAREN ) null",
    "{": "LEFT_BRACE { null",
    "}": "RIGHT_BRACE } null",
    "*": "STAR * null",
    ".": "DOT . null",
    ",": "COMMA , null",
    "-": "MINUS - null",
    "+": "PLUS + null",
    ";": "SEMICOLON ; null",
    "=": "EQUAL = null",
    "!": "BANG ! null",
    "<": "LESS < null",
    ">": "GREATER > null",
    "/": "SLASH / null",
  };

  let hasError = false;

  const handleRelationalOperators = (char, nextChar) => {
    if (char === "<") {
      console.log(nextChar === "=" ? "LESS_EQUAL <= null" : "LESS < null");
    } else if (char === ">") {
      console.log(
        nextChar === "=" ? "GREATER_EQUAL >= null" : "GREATER > null"
      );
    }
  };

  const handleNegationOperator = (nextChar) => {
    console.log(nextChar === "=" ? "BANG_EQUAL != null" : "BANG ! null");
  };

  const handleEqualityOperator = (nextChar) => {
    console.log(nextChar === "=" ? "EQUAL_EQUAL == null" : "EQUAL = null");
  };

  const reportError = (char) => {
    if (!/\s/.test(char)) {
      console.error(`[line 1] Error: Unexpected character: ${char}`);
      hasError = true;
    }
  };

  for (let i = 0; i < input.length; i++) {
    const char = input[i];

    // Check for comments
    if (char === "/" && input[i + 1] === "/") {
      // Ignore everything after // until the end of the line
      while (i < input.length && input[i] !== "\n") {
        i++;
      }
      continue; // Skip the rest of the loop for this iteration
    }

    // Ignore whitespace characters (spaces, tabs, and newlines)
    if (/\s/.test(char)) {
      continue; // Skip this iteration for whitespace
    }

    const nextChar = input[i + 1];

    if (char === "<" || char === ">") {
      handleRelationalOperators(char, nextChar);
      if (nextChar === "=") i++; // Skip the next character
    } else if (char === "!") {
      handleNegationOperator(nextChar);
      if (nextChar === "=") i++; // Skip the next character
    } else if (char === "=") {
      handleEqualityOperator(nextChar);
      if (nextChar === "=") i++; // Skip the next character
    } else if (tokenMap[char]) {
      console.log(tokenMap[char]);
    } else if (char === "/") {
      console.log(tokenMap[char]); // Print SLASH token
    } else {
      reportError(char);
    }
  }

  console.log("EOF  null");

  if (hasError) {
    process.exit(65);
  }
}

// Handle command-line arguments
const args = process.argv.slice(2); // Skip the first two arguments (node path and script path)

if (args.length < 2) {
  console.error("Usage: ./your_program.sh tokenize <filename>");
  process.exit(1);
}

const command = args[0];

if (command !== "tokenize") {
  console.error(`Usage: Unknown command: ${command}`);
  process.exit(1);
}

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.error("Logs from your program will appear here!");

const filename = args[1];

// Read the file content
const fileContent = fs.readFileSync(filename, "utf8");

// Call the tokenizer with the file
tokenize(fileContent);
