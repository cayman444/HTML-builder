const fs = require('fs');
const path = require('path');

fs.mkdir(path.join(__dirname, 'files-copy'), { recursive: true }, (err) => {
  if (err) console.error(err);

  cleanFolder();

  fs.readdir(path.join(__dirname, 'files'), (err, files) => {
    if (err) console.error(err);

    files.forEach((file) => {
      fs.copyFile(
        path.join(__dirname, 'files', file),
        path.join(__dirname, 'files-copy', file),
        (err) => {
          if (err) {
            console.error(err);
          }
        },
      );
    });
  });
});

function cleanFolder() {
  fs.readdir(path.join(__dirname, 'files-copy'), (err, files) => {
    if (err) console.error(err);
    files.forEach((file) => {
      fs.unlink(path.join(__dirname, 'files-copy', file), (err) => {
        if (err) console.error(err);
      });
    });
  });
}
