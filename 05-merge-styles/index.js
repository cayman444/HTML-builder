const fs = require('fs');
const path = require('path');
let arr = [];

fs.readdir(
  path.join(__dirname, 'styles'),
  { withFileTypes: true },
  (err, files) => {
    if (err) console.log(err);
    files.forEach((file) => {
      if (file.isFile() && path.extname(file.name) === '.css') {
        const readStream = fs.createReadStream(
          path.join(__dirname, 'styles', file.name),
        );
        const writeStream = fs.createWriteStream(
          path.join(__dirname, 'project-dist', 'bundle.css'),
        );
        readStream.on('data', (chunk) => {
          arr.push(chunk.toString());
          writeStream.write(arr.join(''));
        });
      }
    });
  },
);
