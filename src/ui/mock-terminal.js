import blessed from 'blessed';

const MOCK_COMMANDS = [
  { cmd: '$ npm install express', output: 'added 48 packages in 3.2s' },
  { cmd: '$ npm install mongoose', output: 'added 12 packages in 1.5s' },
  { cmd: '$ npm run build', output: '> project@1.0.0 build\n> tsc\n\nCompilation successful.' },
  { cmd: '$ npm test', output: 'PASS  src/__tests__/api.test.js\nPASS  src/__tests__/utils.test.js\n\nTest Suites: 2 passed, 2 total' },
  { cmd: '$ git status', output: 'On branch main\nYour branch is up to date with \'origin/main\'.' },
  { cmd: '$ git commit -m "feat: add new feature"', output: '[main abc1234] feat: add new feature\n 2 files changed, 45 insertions(+)' },
  { cmd: '$ git push origin main', output: 'Enumerating objects: 5, done.\nCounting objects: 100% (5/5), done.' },
  { cmd: '$ docker-compose up -d', output: 'Starting app_database_1 ... done\nStarting app_backend_1 ... done\nStarting app_frontend_1 ... done' },
  { cmd: '$ kubectl get pods', output: 'NAME                        READY   STATUS    RESTARTS   AGE\napi-5f8b9c4d7-x2kz9      1/1     Running   0          2d\nworker-7d9c6b8e4-m3v2n   1/1     Running   0          5d' },
  { cmd: '$ curl -I https://api.example.com', output: 'HTTP/2 200\ncontent-type: application/json\ndate: Wed, 15 Apr 2026 12:00:00 GMT' },
  { cmd: '$ node scripts/migrate.js', output: 'Migration started...\nMigrating users table... done\nMigrating orders table... done\nMigration completed successfully.' },
  { cmd: '$ pm2 restart all', output: '[PM2] Restoring process list\n[PM2] Process restared successfully\n┌────┬───────────┬─────────────┬─────┬──────────┬──────────────┬──\n│ id │ name      │ status      │ cpu │ mem      │ uptime       │\n├────┼───────────┼─────────────┼─────┼──────────┼──────────────┼──\n│ 0  │ api       │ online      │ 2%  │ 45MB     │ 15 days      │\n│ 1  │ worker    │ online      │ 1%  │ 32MB     │ 15 days      │' },
];

export function showMockTerminal(screen, onExit) {
  // Create terminal container
  const terminal = blessed.box({
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    style: { fg: 'white', bg: 'black' },
  });

  // Terminal header
  const header = blessed.box({
    top: 0,
    left: 0,
    width: '100%',
    height: 1,
    tags: true,
    style: { fg: 'white', bg: '#333333', bold: true },
  });

  // Output area (scrollable)
  const output = blessed.box({
    top: 1,
    left: 0,
    right: 0,
    bottom: 1,
    scrollable: true,
    alwaysScroll: true,
    mouse: true,
    scrollbar: { ch: '│', style: { fg: 'gray' } },
    style: { fg: 'green', bg: 'black' },
    tags: false,
  });

  // Bottom bar
  const footer = blessed.box({
    bottom: 0,
    left: 0,
    width: '100%',
    height: 1,
    tags: true,
    style: { fg: 'gray', bg: 'black' },
  });

  header.setContent(' {bold}bash --terminal{/bold}  [Press m to return] ');
  footer.setContent(' mock@dev:~$ running script... ');

  screen.append(terminal);
  terminal.append(header);
  terminal.append(output);
  terminal.append(footer);

  // Detach reader UI elements temporarily
  const readerChildren = [];
  screen.children.forEach((child) => {
    if (child !== terminal) {
      readerChildren.push(child);
      child.detach();
    }
  });

  let outputBuffer = '';
  let cmdIndex = 0;
  let phase = 'cmd'; // 'cmd' or 'output'
  let outputLines = [];

  let currentLine = '';

  function addLine(line, append = false) {
    if (append) {
      currentLine += line;
    } else {
      if (currentLine) {
        outputLines.push(currentLine);
      }
      currentLine = line;
    }

    // Trim buffer if too large
    if (outputLines.length > 100) {
      outputLines.shift();
    }

    output.setContent(outputLines.join('\n') + (currentLine ? '\n' + currentLine : ''));
    output.scrollTo(output.getScrollHeight());
    screen.render();
  }

  function typeOutput(text, callback) {
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        addLine(text[i], true); // append=true
        i++;
      } else {
        clearInterval(interval);
        setTimeout(callback, 300);
      }
    }, 20);
  }

  function runNextCommand() {
    if (cmdIndex >= MOCK_COMMANDS.length) {
      cmdIndex = 0; // Loop
    }

    const item = MOCK_COMMANDS[cmdIndex];
    phase = 'cmd';
    addLine(item.cmd);
    cmdIndex++;

    setTimeout(() => {
      phase = 'output';
      addLine(''); // newline before output
      setTimeout(() => {
        typeOutput(item.output, () => {
          addLine('');
          setTimeout(runNextCommand, 500);
        });
      }, 1000);
    }, 200);
  }

  // Start executing commands
  setTimeout(runNextCommand, 500);

  // Key to exit
  screen.key(['n'], () => {
    // Restore reader UI
    readerChildren.forEach((child) => {
      screen.append(child);
    });
    terminal.detach();
    onExit();
  });

  screen.render();

  // Return cleanup function
  return () => {
    readerChildren.forEach((child) => {
      screen.append(child);
    });
    terminal.detach();
  };
}
