import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { CONFIG_FILE } from './paths.js';

const DEFAULT_CONFIG = {
  theme: {
    fg: 'grey',
    bg: 'black',
    headerFg: 'yellow',
    headerBg: 'blue',
    tocSelectedFg: 'black',
    tocSelectedBg: 'green',
  },
  linesPerPage: 0, // 0 = auto (based on terminal height)
  padding: 2,
};

function loadConfig() {
  if (!existsSync(CONFIG_FILE)) return { ...DEFAULT_CONFIG };
  try {
    const userConfig = JSON.parse(readFileSync(CONFIG_FILE, 'utf-8'));
    return {
      ...DEFAULT_CONFIG,
      ...userConfig,
      theme: { ...DEFAULT_CONFIG.theme, ...(userConfig.theme || {}) },
    };
  } catch {
    return { ...DEFAULT_CONFIG };
  }
}

function saveConfig(config) {
  writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8');
}

export function getConfig() {
  return loadConfig();
}

export function updateConfig(partial) {
  const config = loadConfig();
  Object.assign(config, partial);
  if (partial.theme) {
    config.theme = { ...config.theme, ...partial.theme };
  }
  saveConfig(config);
  return config;
}

export function resetConfig() {
  saveConfig(DEFAULT_CONFIG);
  return { ...DEFAULT_CONFIG };
}
