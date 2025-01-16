const fs = require('fs');
const path = require('path');
const { stdout, stdin } = require('process');

const writeStream = fs.createWriteStream(
  path.join(__dirname, '02-write-file.txt'),
);

stdout.write('Hello! Enter something:\n');
stdin.on('data', (data) => {
  if (data.toString().trim() === 'exit') {
    exit();
  }

  writeStream.write(data);
});

process.on('SIGINT', exit);

function exit() {
  console.log('bue');
  process.exit();
}
