const fs = require('fs');
const path = require('path');

fs.access(path.join(__dirname, 'files-copy'), (err) => {
  if (err) return filesCopy();
  fs.readdir(path.join(__dirname, 'files-copy'), (err, files) => {
    if (err) console.log(err);
    files.forEach((file) => {
      fs.unlink(path.join(__dirname, 'files-copy', file), (err) => {
        if (err) console.log(err);
      });
    });
    filesCopy();
  });
});

function filesCopy() {
  fs.mkdir(path.join(__dirname, 'files-copy'), { recursive: true }, (err) => {
    if (err) console.log(err);
    console.log('folder created');
  });

  fs.readdir(path.join(__dirname, 'files'), (err, files) => {
    if (err) console.log(err);
    files.forEach((file) => {
      fs.copyFile(
        path.join(__dirname, 'files', file),
        path.join(__dirname, 'files-copy', file),
        (err) => {
          if (err) console.log(err);
        },
      );
    });
  });
}
