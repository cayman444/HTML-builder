const fs = require('fs');
const path = require('path');

fs.readdir(
  path.join(__dirname, 'secret-folder'),
  { withFileTypes: true },
  (err, files) => {
    if (err) console.error(err);

    files.forEach((file) => {
      if (!file.isDirectory()) {
        fs.stat(
          path.join(__dirname, 'secret-folder', file.name),
          (err, stats) => {
            if (err) console.log(err.message);
            const fileName = path.parse(file.name).name;
            const fileExtension = path.parse(file.name).ext.slice(1);
            const fileSize = (stats.size / 1024).toFixed(3);

            console.log(`${fileName} - ${fileExtension} - ${fileSize}kb`);
          },
        );
      }
    });
  },
);
