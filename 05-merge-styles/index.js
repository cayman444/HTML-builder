const fs = require('fs');
const path = require('path');

const writeStream = fs.createWriteStream(
  path.join(__dirname, 'project-dist', 'bundle.css'),
);

fs.readdir(
  path.join(__dirname, 'styles'),
  { withFileTypes: true },
  (err, files) => {
    if (err) console.error(err);
    files.forEach((file) => {
      if (file.isFile() && path.parse(file.name).ext === '.css') {
        const readStream = fs.createReadStream(
          path.join(__dirname, 'styles', file.name),
          'utf-8',
        );

        readStream.pipe(writeStream);
      }
    });
  },
);
