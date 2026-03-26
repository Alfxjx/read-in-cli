import { homedir } from 'node:os';
import { join } from 'node:path';
import { mkdirSync } from 'node:fs';

const isDev = process.env.NODE_ENV === 'development';
const APP_DIR = join(homedir(), isDev ? '.ricli-dev' : '.ricli');
const LIBRARY_FILE = join(APP_DIR, 'library.json');
const PROGRESS_FILE = join(APP_DIR, 'progress.json');
const CONFIG_FILE = join(APP_DIR, 'config.json');

// Ensure app directory exists
mkdirSync(APP_DIR, { recursive: true });

export { APP_DIR, LIBRARY_FILE, PROGRESS_FILE, CONFIG_FILE };
