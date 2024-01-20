const fs = require('fs');
const path = require('path');

fs.access(path.join(__dirname, 'project-dist'), (err) => {
  if (err) return assembly();
  fs.readdir(path.join(__dirname, 'project-dist'), (err, files) => {
    if (err) console.log(err);
    if (files.length === 0) return assembly();
    files.forEach((file) => {
      fs.stat(path.join(__dirname, 'project-dist', file), (err, stats) => {
        if (err) console.log(err);
        if (stats.isDirectory()) {
          fs.rm(
            path.join(__dirname, 'project-dist', file),
            { recursive: true },
            (err) => {
              if (err) console.log(err);
              assembly();
            },
          );
        } else {
          fs.unlink(path.join(__dirname, 'project-dist', file), (err) => {
            if (err) console.log(err);
            assembly();
          });
        }
      });
    });
  });
});

function assembly() {
  fs.mkdir(path.join(__dirname, 'project-dist'), { recursive: true }, (err) => {
    if (err) console.log(err);
  });
  fs.mkdir(
    path.join(__dirname, 'project-dist', 'assets'),
    { recursive: true },
    (err) => {
      if (err) console.log(err);
    },
  );
  assemblyHtml();
  assemblyCss();
  const sourceAssets = path.join(__dirname, 'assets');
  const outputAssets = path.join(__dirname, 'project-dist', 'assets');
  assemblyAssets(sourceAssets, outputAssets);
}

function assemblyHtml() {
  const readStreamTemplate = fs.createReadStream(
    path.join(__dirname, 'template.html'),
  );

  readStreamTemplate.on('data', (chunk) => {
    let template = chunk.toString();
    const match = template.match(/{{(.+?)}}/gi);

    fs.readdir(path.join(__dirname, 'components'), (err, files) => {
      if (err) console.log(err);
      files.forEach((file) => {
        if (path.extname(file) === '.html') {
          const fileName = path.basename(file, path.extname(file));
          for (let i = 0; i < match.length; i++) {
            const tempName = match[i].slice(2, -2);
            if (tempName === fileName) {
              const readStreamComponents = fs.createReadStream(
                path.join(__dirname, 'components', file),
              );
              const writeStreamTemplate = fs.createWriteStream(
                path.join(__dirname, 'project-dist', 'index.html'),
              );

              readStreamComponents.on('data', (chunk) => {
                template = template.replace(match[i], chunk.toString());
                writeStreamTemplate.write(template);
              });
            }
          }
        }
      });
    });
  });
}

function assemblyCss() {
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
            path.join(__dirname, 'project-dist', 'style.css'),
          );
          readStream.on('data', (chunk) => {
            arr.push(chunk.toString());
            writeStream.write(arr.join(''));
          });
        }
      });
    },
  );
}

function assemblyAssets(src, out) {
  fs.readdir(src, (err, files) => {
    if (err) console.log(err);
    files.forEach((file) => {
      const srcPath = path.join(src, file);
      const outPath = path.join(out, file);
      fs.stat(srcPath, (err, stats) => {
        if (err) console.log(err);
        if (stats.isDirectory()) {
          fs.mkdir(outPath, { recursive: true }, (err) => {
            if (err) console.log(err);
          });
          return assemblyAssets(srcPath, outPath);
        } else {
          fs.copyFile(srcPath, outPath, (err) => {
            if (err) console.log(err);
          });
        }
      });
    });
  });
}
