import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const packageJson = JSON.parse(
  fs.readFileSync(new URL('../package.json', import.meta.url))
);
const sdkPackageJson = JSON.parse(
  fs.readFileSync(new URL('../node_modules/@cedelabs-private/sdk/package.json', import.meta.url))
);
const version = `${packageJson.version}_sdk${sdkPackageJson.version}`;

// Update tsoa.json with version
const tsoaPath = path.join(__dirname, '../tsoa.json');
const tsoa = createRequire(import.meta.url)(tsoaPath);
tsoa.spec.info.version = version;
fs.writeFileSync(tsoaPath, JSON.stringify(tsoa, null, 2)); 