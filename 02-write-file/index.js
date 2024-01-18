const fs = require('fs');
const path = require('path');
const readline = require('readline');

const output = fs.createWriteStream(path.join(__dirname, '02-write-file.txt'));

let rl = readline.createInterface(process.stdin, process.stdout);

rl.setPrompt('Hello, enter anything:\n');
rl.prompt();

rl.on('line', (data) => {
  if (data === 'exit') {
    console.log('bye bye');
    process.exit();
  }

  output.write(data);
});

rl.on('SIGINT', () => {
  console.log('bye bye');
  process.exit();
});
