const fs = require('fs');
const path = require('path');

fs.readdir(
  path.join(__dirname, 'secret-folder'),
  { withFileTypes: true },
  (err, files) => {
    if (err) console.log(err.message);
    files.forEach((file) => {
      if (file.isFile()) {
        fs.stat(
          path.join(__dirname, 'secret-folder', file.name),
          (err, stats) => {
            if (err) console.log(err.message);
            const fileName = path.basename(file.name, path.extname(file.name));
            const size = Math.floor((stats.size / 1024) * 100) / 100;
            const extname = path.extname(file.name).slice(1);
            console.log(`${fileName} - ${extname} - ${size}kb`);
          },
        );
      }
    });
  },
);
