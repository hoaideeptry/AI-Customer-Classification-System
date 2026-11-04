(() => {
  let chart;
  const byId = id => document.getElementById(id);
  const chartColor = name => name.includes('VIP') ? '#eab308'
    : name.includes('Trung Thành') ? '#22c55e'
      : name.includes('Vãng Lai') ? '#0ea5e9' : '#ef4444';
  const segmentColor = name => name.includes('VIP') ? 'bg-vip'
    : name.includes('Trung Thành') ? 'bg-trungthanh'
      : name.includes('Vãng Lai') ? 'bg-vanglai' : 'bg-nguyco';
  Chart.defaults.color = document.documentElement.dataset.theme === 'dark' ? '#94a3b8' : '#64748b';
  window.addEventListener('themechange', event => {
    Chart.defaults.color = event.detail.theme === 'dark' ? '#94a3b8' : '#64748b';
    if (chart) chart.update();
  });

  function activateTab(id) {
    const button = byId(`${id}-tab`);
    button.disabled = false;
    bootstrap.Tab.getOrCreateInstance(button).show();
  }

  function buildStrategy(stats, total) {
    const entries = Object.entries(stats).sort((a, b) => b[1] - a[1]);
    const vip = stats['Khách VIP'] || 0;
    const risk = stats['Khách Nguy Cơ'] || 0;
    const top = entries[0];
    const advice = [];
    if (vip) advice.push(`Chăm sóc ${vip.toLocaleString()} khách VIP bằng ưu đãi cá nhân hóa và chương trình giữ chân.`);
    if (risk) advice.push(`Ưu tiên chiến dịch tái kích hoạt cho ${risk.toLocaleString()} khách thuộc nhóm nguy cơ.`);
    if (stats['Khách Trung Thành']) advice.push('Khuyến khích khách trung thành mua thêm bằng gói sản phẩm bổ trợ.');
    if (stats['Khách Vãng Lai']) advice.push('Dùng ưu đãi cho lần mua tiếp theo để tăng tần suất của khách vãng lai.');
    if (!advice.length) advice.push('Theo dõi phân khúc lớn nhất và thử nghiệm ưu đãi phù hợp trước khi mở rộng.');
    const summary = top ? `Nhóm lớn nhất là ${top[0]} (${((top[1] / total) * 100).toFixed(1)}%).` : 'Không có phân khúc để thống kê.';
    byId('aiStrategy').replaceChildren();
    const intro = document.createElement('p');
    intro.textContent = `${summary} Gợi ý dựa trên ${total.toLocaleString()} khách hàng được phân loại:`;
    const list = document.createElement('ul');
    advice.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      list.appendChild(li);
    });
    byId('aiStrategy').append(intro, list);
  }

  function displayResults(data) {
    const stats = data.stats || {};
    const customers = Array.isArray(data.customers) ? data.customers : [];
    const total = Number(data.total_customers) || 0;
    byId('kpiTotal').textContent = total.toLocaleString();
    byId('kpiVip').textContent = `${total ? (((stats['Khách VIP'] || 0) / total) * 100).toFixed(1) : '0.0'}%`;
    byId('kpiRisk').textContent = `${total ? (((stats['Khách Nguy Cơ'] || 0) / total) * 100).toFixed(1) : '0.0'}%`;

    if (chart) chart.destroy();
    chart = new Chart(byId('segmentChart'), {
      type: 'doughnut',
      data: { labels: Object.keys(stats), datasets: [{ data: Object.values(stats), backgroundColor: Object.keys(stats).map(chartColor), borderWidth: 0 }] },
      options: { responsive: true, maintainAspectRatio: false, cutout: '68%', plugins: { legend: { position: 'bottom' } } }
    });
    const tbody = byId('tableBody');
    tbody.replaceChildren();
    customers.forEach(customer => {
      const row = document.createElement('tr');
      [customer.CustomerID, customer.Recency, customer.Frequency, Number(customer.Monetary).toLocaleString()].forEach(value => {
        const cell = document.createElement('td');
        cell.textContent = value ?? '';
        row.appendChild(cell);
      });
      row.children[1].className = 'text-end';
      row.children[2].className = 'text-end';
      row.children[3].className = 'text-end';
      const segmentCell = document.createElement('td');
      const badge = document.createElement('span');
      badge.className = `segment-badge ${segmentColor(String(customer.Segment || ''))}`;
      badge.textContent = customer.Segment || 'Chưa xác định';
      segmentCell.appendChild(badge);
      row.appendChild(segmentCell);
      tbody.appendChild(row);
    });
    buildStrategy(stats, total);
  }
  window.displayResults = displayResults;

  byId('uploadForm').addEventListener('submit', async event => {
    event.preventDefault();
    const file = byId('fileInput').files[0];
    if (!file) return window.showToast('Vui lòng chọn file dữ liệu trước.', false);
    const button = byId('submitBtn');
    button.disabled = true;
    button.textContent = 'Đang xử lý...';
    activateTab('logs');
    window.addLog(`Đang gửi ${file.name} tới pipeline...`, 'info');
    try {
      const body = new FormData();
      body.append('file', file);
      const response = await fetch('/predict', { method: 'POST', body });
      const data = await response.json();
      if (!response.ok || data.error) throw new Error(data.error || `Máy chủ trả về lỗi ${response.status}.`);
      if (!data.stats || !Array.isArray(data.customers) || !Number.isFinite(Number(data.total_customers))) {
        throw new Error('Dữ liệu phản hồi từ máy chủ không hợp lệ.');
      }
      displayResults(data);
      window.addLog(`Phân loại hoàn tất: ${data.total_customers} khách hàng.`, 'info');
      activateTab('dashboard');
      window.showToast('Phân tích hoàn tất.');
    } catch (error) {
      window.addLog(error.message || 'Không thể kết nối máy chủ Flask.', 'error');
      window.showToast(error.message || 'Lỗi kết nối máy chủ.', false);
    } finally {
      button.disabled = false;
      button.innerHTML = '<i class="bi bi-play-fill me-1"></i>Chạy phân tích';
    }
  });
})();
