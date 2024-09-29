import fs from "fs";

// Tokenizer function to scan for parentheses and braces
function tokenize(input) {
  // Define a map of single-character tokens and their corresponding output
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
  };

  for (let i = 0; i < input.length; i++) {
    const char = input[i];

    // Check if the character is a token we care about
    if (tokenMap[char]) {
      console.log(tokenMap[char]);
    }
  }

  // Print EOF token at the end
  console.log("EOF  null");
}

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
