const fs = require('fs');
const path = require('path');

async function main() {
  try {
    await createDist();
    await clearDist();
    await replaceHtmlTemplates();
    await mergeStyles();
    await mergeAssets();
  } catch (err) {
    console.error(err);
  }
}

main();

async function clearDist() {
  const files = await fs.promises.readdir(
    path.join(__dirname, 'project-dist'),
    {
      withFileTypes: true,
    },
  );

  if (files.length === 0) return;

  for (let file of files) {
    if (file.isDirectory()) {
      await fs.promises.rm(path.join(__dirname, 'project-dist', file.name), {
        recursive: true,
      });
    } else {
      await fs.promises.unlink(path.join(__dirname, 'project-dist', file.name));
    }
  }
}

async function createDist() {
  await fs.promises.mkdir(path.join(__dirname, 'project-dist'), {
    recursive: true,
  });
}

async function replaceHtmlTemplates() {
  const data = await fs.promises.readFile(
    path.join(__dirname, 'template.html'),
    'utf-8',
  );
  const components = {};

  const files = await fs.promises.readdir(path.join(__dirname, 'components'), {
    withFileTypes: true,
  });

  for (let file of files) {
    const currentFile = path.parse(file.name);
    if (file.isFile() && currentFile.ext === '.html') {
      const fileContent = await fs.promises.readFile(
        path.join(__dirname, 'components', file.name),
        'utf-8',
      );

      components[currentFile.name] = fileContent;
    }
  }

  const htmlTemplate = data.replace(/{{\w+}}/gi, (match) => {
    const component = match.slice(2, -2);
    return components[component] ?? match;
  });

  await fs.promises.writeFile(
    path.join(__dirname, 'project-dist', 'index.html'),
    htmlTemplate,
    'utf-8',
    (err) => {
      if (err) console.error(err);
    },
  );
}

async function mergeStyles() {
  await fs.promises.writeFile(
    path.join(__dirname, 'project-dist', 'style.css'),
    '',
    'utf-8',
  );

  const styles = await fs.promises.readdir(path.join(__dirname, 'styles'), {
    withFileTypes: true,
  });

  for (let style of styles) {
    if (style.isFile() && path.parse(style.name).ext === '.css') {
      const styleContent = await fs.promises.readFile(
        path.join(__dirname, 'styles', style.name),
        'utf-8',
      );

      await fs.promises.appendFile(
        path.join(__dirname, 'project-dist', 'style.css'),
        styleContent,
      );
    }
  }
}

async function mergeAssets() {
  const source = path.join(__dirname, 'assets');
  const output = path.join(__dirname, 'project-dist', 'assets');

  async function copyFolder(source, output) {
    await fs.promises.mkdir(output, { recursive: true });

    const assets = await fs.promises.readdir(source, {
      withFileTypes: true,
    });

    for (let asset of assets) {
      const srcPath = path.join(source, asset.name);
      const outPath = path.join(output, asset.name);

      if (asset.isDirectory()) {
        await copyFolder(srcPath, outPath);
      } else {
        await fs.promises.copyFile(srcPath, outPath);
      }
    }
  }

  await copyFolder(source, output);
}
