(() => {
  const root = document.documentElement;
  const toggle = document.getElementById('themeToggle');
  toggle.addEventListener('click', () => {
    const theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = theme;
    toggle.textContent = theme === 'dark' ? '🌙' : '☀️';
    toggle.setAttribute('aria-label', theme === 'dark' ? 'Chuyển giao diện sáng' : 'Chuyển giao diện tối');
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
  });

  window.showToast = (text, success = true) => {
    Toastify({
      text: String(text), duration: 3500, gravity: 'bottom', position: 'right',
      style: { background: success ? '#16a34a' : '#dc2626', borderRadius: '8px' }
    }).showToast();
  };

  window.addLog = (message, type = 'normal') => {
    const box = document.getElementById('systemLog');
    const line = document.createElement('p');
    const stamp = document.createElement('span');
    stamp.className = 'timestamp';
    stamp.textContent = `[${new Date().toLocaleTimeString('vi-VN', { hour12: false })}]`;
    const text = document.createElement('span');
    text.className = type === 'error' ? 'error' : type === 'info' ? 'info' : '';
    text.textContent = ` ${message}`;
    line.append(stamp, text);
    box.appendChild(line);
    box.scrollTop = box.scrollHeight;
  };

  const fileInput = document.getElementById('fileInput');
  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (!file) return;
    document.getElementById('fileNameDisplay').textContent = file.name;
    document.getElementById('fileInfo').classList.remove('d-none');
    window.addLog(`Đã chọn file: ${file.name}`, 'info');
    window.showToast('Đã chọn file thành công.');
  });

  const dropZone = document.getElementById('dropZone');
  ['dragenter', 'dragover'].forEach(event => dropZone.addEventListener(event, e => {
    e.preventDefault();
    dropZone.classList.add('dragover');
  }));
  ['dragleave', 'drop'].forEach(event => dropZone.addEventListener(event, e => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
  }));
  dropZone.addEventListener('drop', e => {
    if (!e.dataTransfer.files.length) return;
    fileInput.files = e.dataTransfer.files;
    fileInput.dispatchEvent(new Event('change'));
  });
})();
