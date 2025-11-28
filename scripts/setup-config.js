import { copyFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const configsPath = join(__dirname, '..', 'configs');

const defaultFile = 'assistant-config.default.json';
const targetFile = 'assistant-config.json';

console.log('Setting up configuration files...');

const defaultPath = join(configsPath, defaultFile);
const targetPath = join(configsPath, targetFile);

if (!existsSync(targetPath)) {
  copyFileSync(defaultPath, targetPath);
  console.log(`✓ Created ${targetFile} from ${defaultFile}`);
} else {
  console.log(`- ${targetFile} already exists, skipping...`);
}

console.log('Configuration setup complete!');
