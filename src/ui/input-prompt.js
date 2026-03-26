import blessed from 'blessed';

export function showInputPrompt(screen, message, onSubmit, onCancel) {
  const form = blessed.form({
    top: 'center',
    left: 'center',
    width: '80%',
    height: 7,
    border: { type: 'line' },
    style: { border: { fg: 'gray' }, bg: 'black' },
    keys: true,
  });

  const label = blessed.text({
    parent: form,
    top: 0,
    left: 1,
    content: message,
    style: { fg: 'white', bg: 'black' },
  });

  const input = blessed.textbox({
    parent: form,
    top: 2,
    left: 1,
    right: 1,
    height: 1,
    inputOnFocus: true,
    style: {
      fg: 'white',
      bg: '#333333',
      focus: { bg: '#555555' },
    },
  });

  const hint = blessed.text({
    parent: form,
    top: 4,
    left: 1,
    content: 'Enter: 确认  Esc: 取消',
    style: { fg: 'gray', bg: 'black' },
  });

  input.key(['escape'], () => {
    form.detach();
    screen.render();
    onCancel();
  });

  input.on('submit', (value) => {
    form.detach();
    screen.render();
    onSubmit(value);
  });

  screen.append(form);
  input.focus();
  screen.render();
}
