import fs from 'fs';
import path from 'path';
import { glob } from 'glob'; // ✅ named import works in ESM

// Get all .js files in src folder recursively
const files = glob.sync('src/**/*.js');

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf-8');
  const regex = /from ['"](.+\.js)['"]/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const importedPath = match[1];
    const fullPath = path.resolve(path.dirname(file), importedPath);

    if (!fs.existsSync(fullPath)) {
      console.log(`❌ Missing or mis-capitalized file: ${fullPath} (imported in ${file})`);
    }
  }
});