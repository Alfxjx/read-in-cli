import { readFileSync, writeFileSync } from 'node:fs';
import { existsSync } from 'node:fs';
import { LIBRARY_FILE } from './paths.js';

function loadLibrary() {
  if (!existsSync(LIBRARY_FILE)) return [];
  try {
    return JSON.parse(readFileSync(LIBRARY_FILE, 'utf-8'));
  } catch {
    return [];
  }
}

function saveLibrary(library) {
  writeFileSync(LIBRARY_FILE, JSON.stringify(library, null, 2), 'utf-8');
}

export function getBooks() {
  return loadLibrary();
}

export function addBook(filePath, title) {
  const library = loadLibrary();
  const existing = library.find((b) => b.filePath === filePath);
  if (existing) {
    existing.lastOpened = Date.now();
    existing.title = title || existing.title;
  } else {
    library.push({
      filePath,
      title: title || filePath,
      addedAt: Date.now(),
      lastOpened: Date.now(),
    });
  }
  saveLibrary(library);
}

export function removeBook(filePath) {
  const library = loadLibrary().filter((b) => b.filePath !== filePath);
  saveLibrary(library);
}
