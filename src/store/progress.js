import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { PROGRESS_FILE } from './paths.js';

function loadProgress() {
  if (!existsSync(PROGRESS_FILE)) return {};
  try {
    return JSON.parse(readFileSync(PROGRESS_FILE, 'utf-8'));
  } catch {
    return {};
  }
}

function saveProgressData(data) {
  writeFileSync(PROGRESS_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

export function getProgress(filePath) {
  const data = loadProgress();
  return data[filePath] || { chapterIndex: 0, scrollPos: 0 };
}

export function saveProgress(filePath, chapterIndex, scrollPos) {
  const data = loadProgress();
  data[filePath] = { chapterIndex, scrollPos, updatedAt: Date.now() };
  saveProgressData(data);
}
