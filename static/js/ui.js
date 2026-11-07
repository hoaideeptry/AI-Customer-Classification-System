(() => {
  const root = document.documentElement;
  const toggle = document.getElementById('themeToggle');
  
  // Đồng bộ Bootstrap 5 dark theme
  if (!root.getAttribute('data-bs-theme')) {
    root.setAttribute('data-bs-theme', root.dataset.theme || 'dark');
  }

  // Chuyển đổi Dark / Light Theme
  toggle.addEventListener('click', () => {
    const theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = theme;
    root.setAttribute('data-bs-theme', theme);
    toggle.textContent = theme === 'dark' ? '🌙' : '☀️';
    toggle.setAttribute('aria-label', theme === 'dark' ? 'Chuyển giao diện sáng' : 'Chuyển giao diện tối');
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
  });

  // =====================================================
  // QUẢN LÝ MỞ / ĐÓNG SIDEBAR
  // =====================================================
  const sidebar = document.getElementById('sidebar');
  const sidebarToggle = document.getElementById('sidebarToggle');
  const sidebarBackdrop = document.getElementById('sidebarBackdrop');

  function openSidebar() {
    if (!sidebar) return;
    sidebar.classList.add('show');
    if (sidebarBackdrop) sidebarBackdrop.classList.add('show');
  }

  function closeSidebar() {
    if (!sidebar) return;
    sidebar.classList.remove('show');
    if (sidebarBackdrop) sidebarBackdrop.classList.remove('show');
  }

  function toggleSidebar() {
    if (sidebar && sidebar.classList.contains('show')) {
      closeSidebar();
    } else {
      openSidebar();
    }
  }

  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', event => {
      event.stopPropagation();
      toggleSidebar();
    });
  }

  if (sidebarBackdrop) {
    sidebarBackdrop.addEventListener('click', closeSidebar);
  }

  const adminMain = document.querySelector('.admin-main');
  if (adminMain) {
    adminMain.addEventListener('click', event => {
      if (sidebar && sidebar.classList.contains('show')) {
        if (!event.target.closest('#sidebarToggle')) {
          closeSidebar();
        }
      }
    });
  }

  const allSidebarLinks = document.querySelectorAll('.sidebar-menu .nav-link');
  allSidebarLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeSidebar();
    });
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && sidebar && sidebar.classList.contains('show')) {
      closeSidebar();
    }
  });

  // Cập nhật Breadcrumb khi chuyển trang trên Sidebar
  let currentActiveTabId = 'upload-tab';

  function updateBreadcrumb(targetId) {
    currentActiveTabId = targetId || currentActiveTabId;
    const breadcrumbMap = {
      'upload-tab': 'breadcrumb_upload',
      'logs-tab': 'breadcrumb_logs',
      'dashboard-tab': 'breadcrumb_dashboard'
    };
    const key = breadcrumbMap[currentActiveTabId] || 'breadcrumb_upload';
    const breadcrumbEl = document.getElementById('currentBreadcrumb');
    if (breadcrumbEl) {
      breadcrumbEl.textContent = window.t ? window.t(key) : 'Tải lên dữ liệu';
    }
  }

  const navLinks = document.querySelectorAll('#adminTabs .nav-link');
  navLinks.forEach(link => {
    link.addEventListener('shown.bs.tab', event => {
      updateBreadcrumb(event.target.id);
      closeSidebar();

      if (event.target.id === 'dashboard-tab' && window.Plotly) {
        setTimeout(() => {
          const chartDiv = document.getElementById('scatter3dChart');
          if (chartDiv && chartDiv.data) {
            Plotly.Plots.resize(chartDiv);
          }
        }, 150);
      }
    });
  });

  // Toast thông báo góc màn hình
  window.showToast = (text, success = true) => {
    Toastify({
      text: String(text),
      duration: 3500,
      gravity: 'bottom',
      position: 'right',
      style: {
        background: success ? '#16a34a' : '#dc2626',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
      }
    }).showToast();
  };

  // =========================================================================
  // HỆ THỐNG AUDIT LOGS DEEP I18N (HỖ TRỢ DỊCH REALTIME KHI ĐỔI NGÔN NGỮ)
  // =========================================================================
  window.auditLogsData = [];

  function getActionBadge(actionType) {
    const action = String(actionType || 'INFO').toUpperCase();
    switch (action) {
      case 'UPLOAD':
        return '<span class="badge bg-primary px-2 py-1"><i class="bi bi-cloud-arrow-up me-1"></i>UPLOAD</span>';
      case 'PROCESSING':
        return '<span class="badge bg-warning text-dark px-2 py-1"><i class="bi bi-arrow-repeat me-1"></i>PROCESSING</span>';
      case 'SUCCESS':
        return '<span class="badge bg-success px-2 py-1"><i class="bi bi-check-circle me-1"></i>SUCCESS</span>';
      case 'ERROR':
        return '<span class="badge bg-danger px-2 py-1"><i class="bi bi-exclamation-triangle me-1"></i>ERROR</span>';
      case 'SYSTEM':
      case 'INIT':
        return '<span class="badge bg-secondary px-2 py-1"><i class="bi bi-gear me-1"></i>SYSTEM</span>';
      default:
        return `<span class="badge bg-info text-dark px-2 py-1">${action}</span>`;
    }
  }

  // Hàm ghi log có hỗ trợ i18n key và nội suy params
  window.addLogKey = (msgKey, actionType = 'INFO', actorKey = 'actor_ai_system', params = {}, fallbackMessage = '') => {
    const now = new Date();
    const timeString = now.toLocaleTimeString('vi-VN', { hour12: false }) + `.${String(now.getMilliseconds()).padStart(3, '0')}`;
    const dateString = now.toLocaleDateString('vi-VN');

    const logEntry = {
      timestamp: `${timeString} ${dateString}`,
      actorKey: actorKey,
      action: String(actionType).toUpperCase(),
      msgKey: msgKey,
      params: params,
      fallbackMessage: fallbackMessage || msgKey
    };

    window.auditLogsData.unshift(logEntry);
    renderAuditLogsTable();
  };

  // Backwards compatibility cho addLog truyền thống
  window.addLog = (message, actionType = 'INFO', actor = 'Hệ thống AI') => {
    // Nếu message trùng với một key trong từ điển i18n
    const actorKey = actor === 'Admin' || actor === 'User' || actor === 'Người dùng' ? 'actor_user' : 'actor_ai_system';
    window.addLogKey(message, actionType, actorKey, {}, message);
  };

  // Render bảng Audit Logs với khả năng dịch tự động theo ngôn ngữ đang chọn
  function renderAuditLogsTable() {
    const tbody = document.getElementById('auditLogBody');
    if (!tbody) return;

    const searchKeyword = (document.getElementById('logSearchInput')?.value || '').toLowerCase().trim();
    const actionFilter = document.getElementById('logActionFilter')?.value || 'ALL';

    const filtered = window.auditLogsData.filter(log => {
      const matchAction = actionFilter === 'ALL' || log.action === actionFilter;
      const displayMsg = window.t ? window.t(log.msgKey, log.params, log.fallbackMessage) : log.fallbackMessage;
      const displayActor = window.t ? window.t(log.actorKey, {}, log.actorKey) : log.actorKey;

      const matchSearch = !searchKeyword ||
        displayMsg.toLowerCase().includes(searchKeyword) ||
        displayActor.toLowerCase().includes(searchKeyword) ||
        log.action.toLowerCase().includes(searchKeyword);
      return matchAction && matchSearch;
    });

    tbody.replaceChildren();

    filtered.forEach(log => {
      const displayMsg = window.t ? window.t(log.msgKey, log.params, log.fallbackMessage) : log.fallbackMessage;
      const displayActor = window.t ? window.t(log.actorKey, {}, log.actorKey) : log.actorKey;

      const tr = document.createElement('tr');
      tr.className = 'audit-log-row';
      tr.innerHTML = `
        <td class="text-nowrap text-muted font-monospace small"><i class="bi bi-clock me-1 opacity-75"></i>${log.timestamp}</td>
        <td class="fw-semibold small"><i class="bi bi-person-gear text-primary me-1"></i>${displayActor}</td>
        <td>${getActionBadge(log.action)}</td>
        <td class="small">${displayMsg}</td>
      `;
      tbody.appendChild(tr);
    });

    const displayCountEl = document.getElementById('logCountDisplay');
    if (displayCountEl) displayCountEl.textContent = filtered.length;

    const sidebarCountEl = document.getElementById('sidebarLogCount');
    if (sidebarCountEl) sidebarCountEl.textContent = window.auditLogsData.length;
  }

  // Bắt sự kiện lọc và tìm kiếm nhanh
  const searchInput = document.getElementById('logSearchInput');
  const actionFilter = document.getElementById('logActionFilter');
  if (searchInput) searchInput.addEventListener('input', renderAuditLogsTable);
  if (actionFilter) actionFilter.addEventListener('change', renderAuditLogsTable);

  // Xóa danh sách nhật ký
  window.clearAuditLogs = () => {
    window.auditLogsData = [];
    renderAuditLogsTable();
    window.showToast(window.t ? window.t('toast_logs_cleared') : 'Đã xóa sạch nhật ký.');
  };

  // Xuất file CSV nhật ký hệ thống
  window.exportAuditLogs = () => {
    if (!window.auditLogsData.length) {
      return window.showToast(window.t ? window.t('toast_missing_fields') : 'Chưa có nhật ký nào để xuất.', false);
    }
    const isEn = window.getCurrentLang && window.getCurrentLang() === 'en';
    const headers = isEn ? ['Timestamp', 'Actor', 'Action', 'Details'] : ['Thời gian', 'Tác nhân', 'Hành động', 'Chi tiết'];
    
    const rows = window.auditLogsData.map(l => {
      const displayMsg = window.t ? window.t(l.msgKey, l.params, l.fallbackMessage) : l.fallbackMessage;
      const displayActor = window.t ? window.t(l.actorKey, {}, l.actorKey) : l.actorKey;
      return [
        `"${l.timestamp}"`,
        `"${displayActor}"`,
        `"${l.action}"`,
        `"${displayMsg.replace(/"/g, '""')}"`
      ];
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `audit_logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.showToast(window.t ? window.t('toast_logs_exported') : 'Đã xuất file Audit Logs thành công.');
  };

  // Modal thông tin đồ án (Bootstrap 5 Modal)
  window.showSystemInfoModal = () => {
    const modalEl = document.getElementById('projectInfoModal');
    if (modalEl && typeof bootstrap !== 'undefined') {
      const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
      modal.show();
    } else if (typeof window.showToast === 'function') {
      window.showToast(window.t ? window.t('toast_project_info') : 'Đồ án: RFM Customer Segmentation AI Engine - Chuẩn Doanh nghiệp SaaS!');
    }
  };
  window.showProjectInfo = window.showSystemInfoModal;

  // 2 log hệ thống ban đầu (sử dụng logKey để hỗ trợ Deep i18n)
  window.addLogKey('log_init_env', 'SYSTEM', 'actor_ai_system');
  window.addLogKey('log_portal_ready', 'SUCCESS', 'actor_ai_system');

  // Lắng nghe sự kiện chuyển đổi ngôn ngữ để cập nhật Breadcrumb và bảng Audit Logs
  window.addEventListener('languagechange', () => {
    updateBreadcrumb(currentActiveTabId);
    renderAuditLogsTable();
  });

  // Xử lý kéo thả và chọn file
  const fileInput = document.getElementById('fileInput');
  if (fileInput) {
    fileInput.addEventListener('change', () => {
      const file = fileInput.files[0];
      if (!file) return;
      document.getElementById('fileNameDisplay').textContent = file.name;
      const infoBox = document.getElementById('fileInfo');
      if (infoBox) {
        infoBox.classList.remove('d-none');
        infoBox.classList.add('d-flex');
      }
      window.addLogKey('log_file_selected', 'UPLOAD', 'actor_user', { filename: file.name, size: (file.size / 1024).toFixed(1) });
      window.showToast(window.t ? window.t('toast_file_selected') : 'Đã chọn file thành công.');
    });
  }

  const dropZone = document.getElementById('dropZone');
  if (dropZone) {
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
  }
})();
