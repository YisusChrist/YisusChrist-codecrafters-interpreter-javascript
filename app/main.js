import fs from "fs";

// Tokenizer function to scan for tokens
function tokenize(input) {
  const tokenMap = createTokenMap();
  const reservedWords = createReservedWordsMap(); // Reserved words
  let errorState = { hasError: false }; // Use an object to track error state
  let line = 1; // Start line number at 1

  const handleComment = (i) => {
    while (i < input.length && input[i] !== "\n") {
      i++;
    }
    line++; // Increment line number
    return i; // Return the updated index
  };

  const handleWhitespace = (char) => {
    if (char === "\n") line++; // Increment line number on newlines
  };

  const reportError = (char) => {
    console.error(`[line ${line}] Error: Unexpected character: ${char}`);
    errorState.hasError = true;
  };

  const reportUnterminatedString = () => {
    console.error(`[line ${line}] Error: Unterminated string.`);
    errorState.hasError = true;
  };

  for (let i = 0; i < input.length; i++) {
    const char = input[i];

    // Handle comments
    if (char === "/" && input[i + 1] === "/") {
      i = handleComment(i);
      continue;
    }

    // Handle whitespace
    if (/\s/.test(char)) {
      handleWhitespace(char);
      continue;
    }

    // Handle string literals
    if (char === '"') {
      i = handleStringLiteral(input, i, line, reportUnterminatedString);
      continue;
    }

    // Handle number literals
    if (/\d/.test(char)) {
      i = handleNumberLiteral(input, i);
      continue;
    }

    if (isAlpha(char)) {
      i = handleIdentifier(input, i, reservedWords);
      continue;
    }

    const nextChar = input[i + 1];
    const handledOperator = handleOperators(char, nextChar, i);
    // If an operator is handled, skip the token map check and continue the loop
    if (handledOperator !== null) {
      i = handledOperator;
      continue;
    }

    // Check if character is a valid token
    if (!tokenMap[char]) reportError(char);
    else console.log(tokenMap[char]);
  }

  console.log("EOF  null");

  if (errorState.hasError) {
    process.exit(65);
  }
}

// Create a map of single-character tokens and their corresponding output
function createTokenMap() {
  return {
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
}

function createReservedWordsMap() {
  return {
    and: "AND and null",
    class: "CLASS class null",
    else: "ELSE else null",
    false: "FALSE false null",
    for: "FOR for null",
    fun: "FUN fun null",
    if: "IF if null",
    nil: "NIL nil null",
    or: "OR or null",
    print: "PRINT print null",
    return: "RETURN return null",
    super: "SUPER super null",
    this: "THIS this null",
    true: "TRUE true null",
    var: "VAR var null",
    while: "WHILE while null",
  };
}

function handleStringLiteral(input, i, line, reportUnterminatedString) {
  let stringLiteral = '"'; // Start with the opening quote
  i++; // Move past the opening quote

  while (i < input.length && input[i] !== '"') {
    if (input[i] === "\n") line++; // Increment line number for newlines
    stringLiteral += input[i]; // Append to the string literal
    i++;
  }

  if (i < input.length && input[i] === '"') {
    stringLiteral += '"'; // Close the string literal
    console.log(`STRING ${stringLiteral} ${stringLiteral.slice(1, -1)}`);
  } else {
    reportUnterminatedString(); // Report error if string is not terminated
  }

  return i; // Return updated index
}

function handleNumberLiteral(input, i) {
  let numberLiteral = input[i]; // Start with the first digit
  let isDecimal = false; // Track if we've encountered a decimal point

  while (i + 1 < input.length) {
    const nextChar = input[i + 1];

    if (/\d/.test(nextChar)) {
      numberLiteral += nextChar; // Append digit
    } else if (nextChar === "." && !isDecimal) {
      numberLiteral += nextChar; // Append decimal point
      isDecimal = true; // Mark that we have a decimal point
    } else {
      break; // Exit loop on non-digit, non-decimal
    }

    i++; // Move to the next character
  }

  // Determine the literal value based on whether it's an integer or decimal
  let literalValue;
  if (isDecimal) {
    // Check if the number ends with all zeros after the decimal point
    const decimalPart = numberLiteral.split(".")[1];
    if (decimalPart && parseInt(decimalPart) === 0) {
      literalValue = `${numberLiteral.split(".")[0]}.0`; // e.g., "51.0000" becomes "51.0"
    } else {
      literalValue = numberLiteral; // e.g., "1234.1234" remains "1234.1234"
    }
  } else {
    literalValue = `${numberLiteral}.0`; // e.g., "51" becomes "51.0"
  }

  console.log(`NUMBER ${numberLiteral} ${literalValue}`);

  return i; // Return updated index
}

function handleOperators(char, nextChar, i) {
  switch (char) {
    case "<":
      console.log(nextChar === "=" ? "LESS_EQUAL <= null" : "LESS < null");
      return nextChar === "=" ? i + 1 : i; // Skip the next character if needed
    case ">":
      console.log(
        nextChar === "=" ? "GREATER_EQUAL >= null" : "GREATER > null"
      );
      return nextChar === "=" ? i + 1 : i; // Skip the next character if needed
    case "!":
      console.log(nextChar === "=" ? "BANG_EQUAL != null" : "BANG ! null");
      return nextChar === "=" ? i + 1 : i; // Skip the next character if needed
    case "=":
      console.log(nextChar === "=" ? "EQUAL_EQUAL == null" : "EQUAL = null");
      return nextChar === "=" ? i + 1 : i; // Skip the next character if needed
    default:
      return null; // No operator handling needed
  }
}

function isAlpha(char) {
  return /^[a-zA-Z_]$/.test(char);
}

function isAlphaNumeric(char) {
  return /^[a-zA-Z0-9_]$/.test(char);
}

function handleIdentifier(input, i, reservedWords) {
  let identifier = input[i]; // Start with the first character
  i++;

  while (i < input.length && isAlphaNumeric(input[i])) {
    identifier += input[i];
    i++;
  }

  // Check if it's a reserved word
  if (reservedWords[identifier]) {
    console.log(reservedWords[identifier]);
  } else {
    console.log(`IDENTIFIER ${identifier} null`);
  }

  return i - 1; // Return the updated index
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
