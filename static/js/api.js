(() => {
  let chart;
  let currentCustomers = [];
  const byId = id => document.getElementById(id);

  // Biến toàn cục quản lý dữ liệu Mapper
  window.rawFileData = [];
  window.fileHeaders = [];
  window.currentFileName = '';

  const chartColor = name => {
    if (name.includes('VIP')) return '#eab308';
    if (name.includes('Trung Thành')) return '#22c55e';
    if (name.includes('Vãng Lai')) return '#0ea5e9';
    return '#ef4444';
  };

  const segmentColor = name => {
    if (name.includes('VIP')) return 'bg-vip';
    if (name.includes('Trung Thành')) return 'bg-trungthanh';
    if (name.includes('Vãng Lai')) return 'bg-vanglai';
    return 'bg-nguyco';
  };

  Chart.defaults.color = document.documentElement.dataset.theme === 'dark' ? '#94a3b8' : '#64748b';

  window.addEventListener('themechange', event => {
    const isDark = event.detail.theme === 'dark';
    Chart.defaults.color = isDark ? '#94a3b8' : '#64748b';
    if (chart) chart.update();
    if (currentCustomers.length > 0) {
      updatePlotlyTheme(isDark);
    }
  });

  // Chuyển tab trên Sidebar
  function activateTab(id) {
    const button = byId(`${id}-tab`);
    if (!button) return;
    button.disabled = false;
    bootstrap.Tab.getOrCreateInstance(button).show();

    if (id === 'dashboard') {
      const readyBadge = byId('readyBadge');
      if (readyBadge) readyBadge.classList.remove('d-none');
    }
  }

  function buildStrategy(stats, total) {
    const entries = Object.entries(stats).sort((a, b) => b[1] - a[1]);
    const vip = stats['Khách VIP'] || 0;
    const risk = stats['Khách Nguy Cơ'] || 0;
    const top = entries[0];
    const advice = [];

    const isEn = window.getCurrentLang && window.getCurrentLang() === 'en';

    if (isEn) {
      if (vip) advice.push(`Nurture ${vip.toLocaleString()} VIP customers with personalized rewards and exclusive retention perks.`);
      if (risk) advice.push(`Prioritize win-back campaigns for ${risk.toLocaleString()} customers at risk with compelling incentives.`);
      if (stats['Khách Trung Thành']) advice.push('Encourage loyal customers to spend more with points bundles and cross-sell combos.');
      if (stats['Khách Vãng Lai']) advice.push('Offer next-purchase vouchers to increase visit frequency for casual shoppers.');
      if (!advice.length) advice.push('Monitor the largest customer segment and test tailored promotions before expanding.');
    } else {
      if (vip) advice.push(`Chăm sóc ${vip.toLocaleString()} khách VIP bằng ưu đãi cá nhân hóa và đặc quyền giữ chân.`);
      if (risk) advice.push(`Ưu tiên kích hoạt lại ${risk.toLocaleString()} khách thuộc nhóm nguy cơ bằng khuyến mãi thu hút.`);
      if (stats['Khách Trung Thành']) advice.push('Khuyến khích khách trung thành chi tiêu thêm với gói tích điểm và combo bổ trợ.');
      if (stats['Khách Vãng Lai']) advice.push('Dùng ưu đãi lần mua tiếp theo để kích thích tần suất quay lại của khách vãng lai.');
      if (!advice.length) advice.push('Theo dõi phân khúc lớn nhất và thử nghiệm ưu đãi phù hợp trước khi mở rộng.');
    }

    const summary = top
      ? (isEn ? `Largest group is ${top[0]} (${((top[1] / total) * 100).toFixed(1)}%).` : `Nhóm lớn nhất là ${top[0]} (${((top[1] / total) * 100).toFixed(1)}%).`)
      : (isEn ? 'No segment available to analyze.' : 'Không có phân khúc để thống kê.');

    const container = byId('aiStrategy');
    container.replaceChildren();

    const intro = document.createElement('p');
    intro.className = 'mb-2 fw-semibold';
    intro.textContent = isEn
      ? `${summary} AI recommendations based on ${total.toLocaleString()} profiled customers:`
      : `${summary} Gợi ý chiến lược dựa trên ${total.toLocaleString()} khách hàng phân tích:`;

    const list = document.createElement('ul');
    list.className = 'mb-0 ps-3';
    advice.forEach(item => {
      const li = document.createElement('li');
      li.className = 'mb-1';
      li.textContent = item;
      list.appendChild(li);
    });

    container.append(intro, list);
  }

  // ==========================================
  // BIỂU ĐỒ 3D SCATTER PLOT VỚI PLOTLY.JS
  // ==========================================
  function render3DScatter(customers) {
    const chartDiv = byId('scatter3dChart');
    if (!chartDiv || !window.Plotly) return;

    currentCustomers = customers;
    const isDark = document.documentElement.dataset.theme === 'dark';

    const segments = ['Khách VIP', 'Khách Trung Thành', 'Khách Vãng Lai', 'Khách Nguy Cơ'];
    const segmentColors = {
      'Khách VIP': '#eab308',
      'Khách Trung Thành': '#22c55e',
      'Khách Vãng Lai': '#0ea5e9',
      'Khách Nguy Cơ': '#ef4444'
    };

    const traces = segments.map(seg => {
      const segData = customers.filter(c => (c.Segment || '').includes(seg.replace('Khách ', '')) || c.Segment === seg);
      return {
        x: segData.map(c => Number(c.Recency)),
        y: segData.map(c => Number(c.Frequency)),
        z: segData.map(c => Number(c.Monetary)),
        mode: 'markers',
        name: seg,
        type: 'scatter3d',
        text: segData.map(c => `<b>Mã khách:</b> ${c.CustomerID}<br><b>Phân khúc:</b> ${seg}<br>Recency: ${c.Recency} ngày<br>Frequency: ${c.Frequency} lần<br>Monetary: $${Number(c.Monetary).toLocaleString()}`),
        hoverinfo: 'text',
        marker: {
          size: 4,
          color: segmentColors[seg] || '#94a3b8',
          opacity: 0.82
        }
      };
    }).filter(t => t.x.length > 0);

    const whatIfTrace = getWhatIfTrace();
    if (whatIfTrace) {
      traces.push(whatIfTrace);
    }

    const layout = {
      autosize: true,
      paper_bgcolor: 'transparent',
      plot_bgcolor: 'transparent',
      margin: { l: 0, r: 0, b: 0, t: 20 },
      legend: {
        orientation: 'h',
        x: 0.5,
        xanchor: 'center',
        y: 1.05,
        font: { color: isDark ? '#f8fafc' : '#0f172a', size: 11 }
      },
      scene: {
        xaxis: {
          title: { text: 'Recency (Ngày / Days)' },
          gridcolor: isDark ? '#334155' : '#e2e8f0',
          zerolinecolor: isDark ? '#475569' : '#cbd5e1',
          color: isDark ? '#94a3b8' : '#64748b'
        },
        yaxis: {
          title: { text: 'Frequency (Lần / Orders)' },
          gridcolor: isDark ? '#334155' : '#e2e8f0',
          zerolinecolor: isDark ? '#475569' : '#cbd5e1',
          color: isDark ? '#94a3b8' : '#64748b'
        },
        zaxis: {
          title: { text: 'Monetary ($)' },
          gridcolor: isDark ? '#334155' : '#e2e8f0',
          zerolinecolor: isDark ? '#475569' : '#cbd5e1',
          color: isDark ? '#94a3b8' : '#64748b'
        },
        camera: {
          eye: { x: 1.6, y: 1.6, z: 1.3 }
        }
      }
    };

    const config = {
      responsive: true,
      displayModeBar: true,
      displaylogo: false,
      modeBarButtonsToRemove: ['resetCameraLastSave3d']
    };

    Plotly.newPlot('scatter3dChart', traces, layout, config);
  }

  function updatePlotlyTheme(isDark) {
    const chartDiv = byId('scatter3dChart');
    if (!chartDiv || !chartDiv.data) return;

    Plotly.relayout('scatter3dChart', {
      'legend.font.color': isDark ? '#f8fafc' : '#0f172a',
      'scene.xaxis.gridcolor': isDark ? '#334155' : '#e2e8f0',
      'scene.xaxis.color': isDark ? '#94a3b8' : '#64748b',
      'scene.yaxis.gridcolor': isDark ? '#334155' : '#e2e8f0',
      'scene.yaxis.color': isDark ? '#94a3b8' : '#64748b',
      'scene.zaxis.gridcolor': isDark ? '#334155' : '#e2e8f0',
      'scene.zaxis.color': isDark ? '#94a3b8' : '#64748b'
    });
  }

  // ==========================================
  // CÔNG CỤ MÔ PHỎNG WHAT-IF
  // ==========================================
  function predictWhatIfSegment(r, f, m) {
    if ((r <= 60 && f >= 7 && m >= 1500) || (r <= 90 && m >= 3000) || (f >= 12 && m >= 2000 && r <= 90)) {
      return {
        segment: 'Khách VIP',
        badgeClass: 'bg-vip',
        note: window.t ? window.t('whatif_note_vip') : 'Giao dịch gần đây, tần suất cao và chi tiêu rất lớn. Đóng góp doanh thu cốt lõi.'
      };
    }
    if (r >= 150 || (r >= 90 && f <= 2 && m <= 500)) {
      return {
        segment: 'Khách Nguy Cơ',
        badgeClass: 'bg-nguyco',
        note: window.t ? window.t('whatif_note_risk') : 'Đã rất lâu chưa quay lại mua sắm. Cần can thiệp chiến dịch tái kích hoạt sớm.'
      };
    }
    if (r <= 120 && f >= 4 && m >= 500) {
      return {
        segment: 'Khách Trung Thành',
        badgeClass: 'bg-trungthanh',
        note: window.t ? window.t('whatif_note_loyal') : 'Khách hàng có lịch sử quay lại đều đặn và doanh thu ổn định.'
      };
    }
    return {
      segment: 'Khách Vãng Lai',
      badgeClass: 'bg-vanglai',
      note: window.t ? window.t('whatif_note_casual') : 'Khách mới hoặc tần suất giao dịch còn thấp. Cần ưu đãi kích cầu mua lại.'
    };
  }

  function getWhatIfTrace() {
    const rEl = byId('whatifRecency');
    const fEl = byId('whatifFrequency');
    const mEl = byId('whatifMonetary');
    if (!rEl || !fEl || !mEl) return null;

    const r = Number(rEl.value);
    const f = Number(fEl.value);
    const m = Number(mEl.value);
    const prediction = predictWhatIfSegment(r, f, m);

    return {
      x: [r],
      y: [f],
      z: [m],
      mode: 'markers+text',
      name: 'Khách What-If (Đang thử)',
      type: 'scatter3d',
      text: ['★ ĐIỂM THỬ NGHIỆM'],
      textposition: 'top center',
      textfont: { size: 12, color: '#f59e0b' },
      hoverinfo: 'text',
      hovertext: `<b>[MÔ PHỎNG WHAT-IF]</b><br>R: ${r} ngày | F: ${f} lần | M: $${m.toLocaleString()}<br><b>Dự đoán:</b> ${prediction.segment}`,
      marker: {
        size: 9,
        symbol: 'diamond',
        color: '#f43f5e',
        line: { color: '#ffffff', width: 2 }
      }
    };
  }

  function updateWhatIfUI() {
    const r = Number(byId('whatifRecency').value);
    const f = Number(byId('whatifFrequency').value);
    const m = Number(byId('whatifMonetary').value);

    byId('valRecency').textContent = `${r} ngày`;
    byId('valFrequency').textContent = `${f} lần`;
    byId('valMonetary').textContent = `$${m.toLocaleString()}`;

    const res = predictWhatIfSegment(r, f, m);
    const badgeContainer = byId('whatifSegment');
    badgeContainer.innerHTML = `<span class="badge ${res.badgeClass} px-3 py-2 fs-6 shadow-sm"><i class="bi bi-person-badge me-1"></i>${res.segment}</span>`;
    byId('whatifNote').textContent = res.note;

    const chartDiv = byId('scatter3dChart');
    if (chartDiv && chartDiv.data && window.Plotly) {
      const whatIfTraceIndex = chartDiv.data.findIndex(t => t.name === 'Khách What-If (Đang thử)');
      const newTrace = getWhatIfTrace();
      if (newTrace) {
        if (whatIfTraceIndex !== -1) {
          Plotly.deleteTraces('scatter3dChart', whatIfTraceIndex);
        }
        Plotly.addTraces('scatter3dChart', newTrace);
      }
    }
  }

  function initWhatIfControls() {
    ['whatifRecency', 'whatifFrequency', 'whatifMonetary'].forEach(id => {
      const el = byId(id);
      if (el) {
        el.addEventListener('input', updateWhatIfUI);
      }
    });
    updateWhatIfUI();
  }

  // ==========================================
  // HIỂN THỊ KẾT QUẢ TỔNG THỂ
  // ==========================================
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
      data: {
        labels: Object.keys(stats),
        datasets: [{
          data: Object.values(stats),
          backgroundColor: Object.keys(stats).map(chartColor),
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '68%',
        plugins: { legend: { position: 'bottom' } }
      }
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
    render3DScatter(customers);
  }
  window.displayResults = displayResults;

  // =========================================================================
  // THUẬT TOÁN AUTO-MAP CHẶT CHẼ, CHÍNH XÁC (KHÔNG MAP NHẦM "GIAO" VÀ "GIÁ")
  // =========================================================================

  function cleanString(str) {
    if (!str) return '';
    return String(str)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'd')
      .replace(/[^a-z0-9]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Regex kiểm tra từ độc lập (\b) để ngăn "giao" hoặc "thời gian" dính chữ "giá"
  function hasWord(cleanStr, word) {
    const regex = new RegExp('(^|\\s)' + word + '(\\s|$)', 'i');
    return regex.test(cleanStr);
  }

  function computeMatchScore(fieldKey, header) {
    if (!header) return 0;
    const rawLower = String(header).toLowerCase().trim();
    const clean = cleanString(header);
    const compact = clean.replace(/\s+/g, '');

    // 1. Khớp chính xác 100% tên trường chuẩn hệ thống
    if (header === fieldKey || rawLower === fieldKey.toLowerCase() || compact === fieldKey.toLowerCase()) {
      return 1000;
    }

    // -------------------------------------------------------------
    // Trường 1: CustomerID
    // Dict yêu cầu: "khách", "customer", "id", "user"
    // -------------------------------------------------------------
    if (fieldKey === 'CustomerID') {
      if (hasWord(clean, 'don') || hasWord(clean, 'invoice') || hasWord(clean, 'order') || hasWord(clean, 'gia') || hasWord(clean, 'price')) {
        return -1000;
      }
      if (compact.includes('customerid') || clean.includes('ma khach hang') || clean.includes('ma kh') || compact.includes('clientid') || compact.includes('userid')) {
        return 900;
      }
      if (hasWord(clean, 'khach') || hasWord(clean, 'customer') || hasWord(clean, 'user') || hasWord(clean, 'client')) {
        return 700;
      }
      if (hasWord(clean, 'id') || clean.endsWith(' id')) {
        return 400;
      }
      return 0;
    }

    // -------------------------------------------------------------
    // Trường 2: InvoiceDate
    // Dict yêu cầu: "ngày", "date", "thời gian", "time"
    // -------------------------------------------------------------
    if (fieldKey === 'InvoiceDate') {
      if (hasWord(clean, 'gia') || hasWord(clean, 'price') || hasWord(clean, 'tien') || hasWord(clean, 'luong') || hasWord(clean, 'qty')) {
        return -1000;
      }
      if (compact.includes('invoicedate') || clean.includes('ngay mua') || clean.includes('ngay giao dich') || clean.includes('ngay don') || compact.includes('orderdate') || compact.includes('transdate')) {
        return 900;
      }
      if (hasWord(clean, 'ngay') || hasWord(clean, 'date') || clean.includes('thoi gian') || hasWord(clean, 'time')) {
        return 750;
      }
      return 0;
    }

    // -------------------------------------------------------------
    // Trường 3: Quantity
    // Dict yêu cầu: "lượng", "qty", "quantity", "số"
    // -------------------------------------------------------------
    if (fieldKey === 'Quantity') {
      if (hasWord(clean, 'ngay') || hasWord(clean, 'date') || hasWord(clean, 'gia') || hasWord(clean, 'price') || hasWord(clean, 'tien')) {
        return -1000;
      }
      if (compact.includes('quantity') || clean.includes('so luong') || compact.includes('soluong') || compact.includes('qty')) {
        return 900;
      }
      if (hasWord(clean, 'luong') || hasWord(clean, 'qty') || hasWord(clean, 'quantity') || clean.includes('san luong') || hasWord(clean, 'count')) {
        return 700;
      }
      if (hasWord(clean, 'so') && !clean.includes('dien thoai') && !clean.includes('hoa don') && !clean.includes('don')) {
        return 400;
      }
      return 0;
    }

    // -------------------------------------------------------------
    // Trường 4: UnitPrice
    // Dict yêu cầu: "giá", "price", "tiền", "amount", "đơn"
    // -------------------------------------------------------------
    if (fieldKey === 'UnitPrice') {
      // Phủ định nghiêm ngặt: Tuyệt đối KHÔNG map nếu header chứa ngày, date, time, thoi gian, khach, customer, luong, qty
      if (hasWord(clean, 'ngay') || hasWord(clean, 'date') || hasWord(clean, 'time') || clean.includes('thoi gian') || hasWord(clean, 'khach') || hasWord(clean, 'customer') || hasWord(clean, 'luong') || hasWord(clean, 'qty')) {
        return -1000;
      }
      if (compact.includes('unitprice') || clean.includes('don gia') || compact.includes('dongia') || compact.includes('unitcost') || rawLower.includes('unit price')) {
        return 950;
      }
      if (hasWord(clean, 'gia') || hasWord(clean, 'price') || clean.includes('gia ban')) {
        return 800;
      }
      if (hasWord(clean, 'tien') || hasWord(clean, 'amount') || hasWord(clean, 'cost') || hasWord(clean, 'rate')) {
        return 600;
      }
      if (hasWord(clean, 'don') && !clean.includes('ma') && !clean.includes('hoa don') && !clean.includes('so')) {
        return 350;
      }
      return 0;
    }

    // -------------------------------------------------------------
    // Trường 5: InvoiceNo
    // Dict yêu cầu: "đơn", "invoice", "order", "mã hóa đơn"
    // -------------------------------------------------------------
    if (fieldKey === 'InvoiceNo') {
      if (hasWord(clean, 'gia') || hasWord(clean, 'price') || hasWord(clean, 'tien') || hasWord(clean, 'ngay') || hasWord(clean, 'date')) {
        return -1000;
      }
      if (compact.includes('invoiceno') || clean.includes('ma hoa don') || clean.includes('ma don') || compact.includes('orderid') || compact.includes('orderno') || compact.includes('invoicenumber')) {
        return 950;
      }
      if (hasWord(clean, 'invoice') || hasWord(clean, 'order') || clean.includes('hoa don') || clean.includes('don hang') || hasWord(clean, 'bill')) {
        return 750;
      }
      if (hasWord(clean, 'don')) {
        return 450;
      }
      return 0;
    }

    return 0;
  }

  // Thuật toán AI Smart Auto-Map (Khớp tối ưu 1-to-1, ngăn chặn trùng lặp)
  function runSmartAutoMap() {
    const headers = window.fileHeaders || [];
    const fields = ['CustomerID', 'InvoiceDate', 'Quantity', 'UnitPrice', 'InvoiceNo'];

    const candidates = [];
    fields.forEach(fieldKey => {
      headers.forEach(header => {
        const score = computeMatchScore(fieldKey, header);
        if (score > 0) {
          candidates.push({ fieldKey, header, score });
        }
      });
    });

    candidates.sort((a, b) => b.score - a.score);

    const usedFields = new Set();
    const usedHeaders = new Set();
    const optimalMapping = {};

    candidates.forEach(c => {
      if (!usedFields.has(c.fieldKey) && !usedHeaders.has(c.header)) {
        usedFields.add(c.fieldKey);
        usedHeaders.add(c.header);
        optimalMapping[c.fieldKey] = c.header;
      }
    });

    let matchedCount = 0;
    fields.forEach(f => {
      const select = byId(`select_${f}`);
      if (!select) return;
      if (optimalMapping[f]) {
        select.value = optimalMapping[f];
        matchedCount++;
        updateFieldPreview(f, optimalMapping[f]);
      } else {
        select.value = '';
        updateFieldPreview(f, '');
      }
    });

    checkMappingProgress();
    window.addLogKey('log_automap_success', 'SUCCESS', 'actor_automap', { matched: matchedCount });
  }

  // Đọc file tại Client bằng SheetJS
  function handleFileRead(file) {
    if (!file) return window.showToast(window.t ? window.t('toast_missing_fields') : 'Vui lòng chọn tập tin hợp lệ.', false);
    if (!window.XLSX) return window.showToast('Thư viện SheetJS chưa sẵn sàng.', false);

    window.currentFileName = file.name;
    const submitBtn = byId('submitBtn');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span>Đang đọc tập tin...';

    window.addLogKey('log_reading_file', 'PROCESSING', 'actor_sheetjs', { filename: file.name });

    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array', cellDates: true });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const json = XLSX.utils.sheet_to_json(worksheet, { defval: '', raw: false });
        if (!json || json.length === 0) {
          throw new Error('Tập tin không chứa dữ liệu hoặc bảng tính rỗng!');
        }

        window.rawFileData = json;
        window.fileHeaders = Object.keys(json[0]);

        window.addLogKey('log_read_success', 'SUCCESS', 'actor_sheetjs', { rows: json.length.toLocaleString(), cols: window.fileHeaders.length });
        window.showToast(window.t ? window.t('toast_columns_detected') : `Đã nhận diện ${window.fileHeaders.length} cột dữ liệu!`);

        setupDataMapperUI(file.name, json.length, window.fileHeaders);
      } catch (err) {
        window.addLogKey('log_failed', 'ERROR', 'actor_sheetjs', { error: err.message });
        window.showToast(`Lỗi đọc file: ${err.message}`, false);
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<i class="bi bi-magic me-1"></i><span data-i18n="btn_start_mapping">${window.t ? window.t('btn_start_mapping') : 'Đọc & Khớp Cột Dữ Liệu (Data Mapping)'}</span>`;
      }
    };

    reader.onerror = function() {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<i class="bi bi-magic me-1"></i><span data-i18n="btn_start_mapping">${window.t ? window.t('btn_start_mapping') : 'Đọc & Khớp Cột Dữ Liệu (Data Mapping)'}</span>`;
      window.showToast('Lỗi khi đọc file trên thiết bị của bạn.', false);
    };

    reader.readAsArrayBuffer(file);
  }

  // Khởi tạo giao diện Data Mapper UI Bước 2
  function setupDataMapperUI(fileName, rowCount, headers) {
    byId('uploadStep1').classList.add('d-none');
    byId('uploadStep2').classList.remove('d-none');

    byId('mapperFileName').textContent = fileName;
    byId('mapperRowCount').textContent = `${rowCount.toLocaleString()} dòng`;
    byId('mapperColCount').textContent = `${headers.length} cột`;

    const fields = ['CustomerID', 'InvoiceDate', 'Quantity', 'UnitPrice', 'InvoiceNo'];

    fields.forEach(fieldKey => {
      const select = byId(`select_${fieldKey}`);
      if (!select) return;

      select.replaceChildren();
      const defaultOpt = document.createElement('option');
      defaultOpt.value = '';
      defaultOpt.textContent = window.t ? window.t('unmapped_option') : '-- Chưa chọn cột / Unmapped --';
      select.appendChild(defaultOpt);

      headers.forEach(h => {
        const opt = document.createElement('option');
        opt.value = h;
        opt.textContent = h;
        select.appendChild(opt);
      });

      select.onchange = () => {
        updateFieldPreview(fieldKey, select.value);
        checkMappingProgress();
      };
    });

    runSmartAutoMap();
  }

  // Cập nhật ô xem trước dữ liệu mẫu (Sample Preview) và Badge trạng thái
  function updateFieldPreview(fieldKey, selectedHeader) {
    const previewEl = byId(`preview_${fieldKey}`);
    const badgeEl = byId(`badge_${fieldKey}`);
    const selectEl = byId(`select_${fieldKey}`);

    if (!selectedHeader || selectedHeader === '') {
      if (previewEl) previewEl.innerHTML = `<span class="text-muted small fst-italic">${window.t ? window.t('no_data_preview') : 'Chưa có dữ liệu'}</span>`;
      if (badgeEl) {
        badgeEl.className = 'badge bg-secondary';
        badgeEl.innerHTML = `<i class="bi bi-dash me-1"></i><span>${window.t ? window.t('status_unmatched') : 'Chưa khớp'}</span>`;
      }
      if (selectEl) selectEl.classList.remove('is-valid');
      return;
    }

    const samples = [];
    for (let i = 0; i < Math.min(window.rawFileData.length, 10); i++) {
      const val = window.rawFileData[i][selectedHeader];
      if (val !== undefined && val !== null && String(val).trim() !== '') {
        samples.push(String(val).trim());
        if (samples.length >= 2) break;
      }
    }

    if (previewEl) {
      if (samples.length > 0) {
        previewEl.innerHTML = samples.map(s => `<span class="fw-bold text-primary font-monospace">${s}</span>`).join(' <span class="text-muted">|</span> ');
      } else {
        previewEl.innerHTML = `<span class="text-warning small">${window.t ? window.t('empty_column_preview') : 'Cột rỗng'}</span>`;
      }
    }

    if (badgeEl) {
      badgeEl.className = 'badge bg-success';
      badgeEl.innerHTML = `<i class="bi bi-check-circle me-1"></i><span>${window.t ? window.t('status_matched') : 'Đã khớp'}</span>`;
    }
    if (selectEl) selectEl.classList.add('is-valid');
  }

  // Cập nhật tổng số trường đã khớp
  function checkMappingProgress() {
    let matched = 0;
    const fields = ['CustomerID', 'InvoiceDate', 'Quantity', 'UnitPrice', 'InvoiceNo'];
    fields.forEach(f => {
      const val = byId(`select_${f}`)?.value;
      if (val) matched++;
    });

    const countEl = byId('matchedFieldsCount');
    if (countEl) countEl.textContent = matched;

    const progressBadge = byId('mappingProgressBadge');
    if (progressBadge) {
      if (matched === 5) {
        progressBadge.className = 'badge bg-success text-white px-3 py-2 shadow-sm animate-fade-in';
        progressBadge.innerHTML = `<i class="bi bi-check-all me-1"></i><span>${window.t ? window.t('matched_all') : 'Đã khớp hoàn tất 5/5 trường'}</span>`;
      } else {
        progressBadge.className = 'badge bg-warning text-dark px-3 py-2';
        progressBadge.innerHTML = `<i class="bi bi-exclamation-circle me-1"></i><span>${window.t ? window.t('matched_progress') : 'Đã khớp:'}</span> <strong>${matched}</strong>/5`;
      }
    }
  }

  function backToStep1() {
    byId('uploadStep2').classList.add('d-none');
    byId('uploadStep1').classList.remove('d-none');
  }

  // ==========================================
  // XÁC NHẬN VÀ GỬI DỮ LIỆU ĐÃ MAP LÊN BACKEND
  // ==========================================
  async function confirmAndRunPipeline() {
    const fields = ['CustomerID', 'InvoiceDate', 'Quantity', 'UnitPrice', 'InvoiceNo'];
    const mapping = {};
    const missing = [];

    fields.forEach(f => {
      const val = byId(`select_${f}`)?.value;
      if (!val) {
        missing.push(f);
      } else {
        mapping[f] = val;
      }
    });

    if (missing.length > 0) {
      const missingMsg = window.t ? window.t('toast_missing_fields') : 'Vui lòng khớp đủ 5 trường bắt buộc! Còn thiếu:';
      return window.showToast(`${missingMsg} ${missing.join(', ')}`, false);
    }

    const confirmBtn = byId('btnConfirmAndRun');
    confirmBtn.disabled = true;
    confirmBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Đang chuẩn hóa & phân tích AI...';

    activateTab('logs');
    window.addLogKey('log_pipeline_start', 'SYSTEM', 'actor_datamapper', mapping);
    window.addLogKey('log_normalizing', 'PROCESSING', 'actor_transformer', { rows: window.rawFileData.length.toLocaleString() });

    try {
      const normalizedData = window.rawFileData.map(row => ({
        CustomerID: row[mapping.CustomerID],
        InvoiceDate: row[mapping.InvoiceDate],
        Quantity: row[mapping.Quantity],
        UnitPrice: row[mapping.UnitPrice],
        InvoiceNo: row[mapping.InvoiceNo]
      }));

      window.addLogKey('log_dispatching', 'UPLOAD', 'actor_ai_client', { rows: normalizedData.length.toLocaleString() });

      const response = await fetch('/predict_json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: normalizedData })
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || `Máy chủ phản hồi mã lỗi HTTP ${response.status}.`);
      }
      if (!data.stats || !Array.isArray(data.customers) || !Number.isFinite(Number(data.total_customers))) {
        throw new Error('Dữ liệu phân cụm từ máy chủ không đúng cấu trúc yêu cầu.');
      }

      displayResults(data);
      window.addLogKey('log_clustering_success', 'SUCCESS', 'actor_ai_system', { count: Number(data.total_customers).toLocaleString() });
      window.showToast(window.t ? window.t('toast_analysis_complete') : 'Phân tích dữ liệu hoàn tất!');

      activateTab('dashboard');
    } catch (error) {
      window.addLogKey('log_failed', 'ERROR', 'actor_ai_system', { error: error.message });
      window.showToast(error.message || 'Lỗi kết nối máy chủ.', false);
    } finally {
      confirmBtn.disabled = false;
      confirmBtn.innerHTML = `<i class="bi bi-play-circle-fill me-2"></i><span data-i18n="btn_confirm_run">${window.t ? window.t('btn_confirm_run') : 'Xác Nhận & Chạy Phân Tích Pipeline'}</span>`;
    }
  }

  // Bắt các sự kiện Form Upload & Data Mapper
  byId('uploadForm').addEventListener('submit', event => {
    event.preventDefault();
    const file = byId('fileInput').files[0];
    if (!file) return window.showToast('Vui lòng chọn file dữ liệu trước.', false);
    handleFileRead(file);
  });

  byId('fileInput').addEventListener('change', () => {
    const file = byId('fileInput').files[0];
    if (file) {
      handleFileRead(file);
    }
  });

  const btnChangeFile = byId('btnChangeFile');
  if (btnChangeFile) btnChangeFile.addEventListener('click', backToStep1);

  const btnBackToStep1 = byId('btnBackToStep1');
  if (btnBackToStep1) btnBackToStep1.addEventListener('click', backToStep1);

  const btnReAutoMap = byId('btnReAutoMap');
  if (btnReAutoMap) btnReAutoMap.addEventListener('click', runSmartAutoMap);

  const btnConfirmAndRun = byId('btnConfirmAndRun');
  if (btnConfirmAndRun) btnConfirmAndRun.addEventListener('click', confirmAndRunPipeline);

  // Lắng nghe sự kiện chuyển đổi ngôn ngữ để cập nhật lại chiến lược AI và Data Mapper UI
  window.addEventListener('languagechange', () => {
    if (currentCustomers.length > 0) {
      const stats = {};
      currentCustomers.forEach(c => {
        stats[c.Segment] = (stats[c.Segment] || 0) + 1;
      });
      buildStrategy(stats, currentCustomers.length);
    }
    // Cập nhật lại dropdowns và badges trong Data Mapper
    const fields = ['CustomerID', 'InvoiceDate', 'Quantity', 'UnitPrice', 'InvoiceNo'];
    fields.forEach(f => {
      const select = byId(`select_${f}`);
      if (select) {
        if (select.options.length > 0) {
          select.options[0].textContent = window.t('unmapped_option');
        }
        updateFieldPreview(f, select.value);
      }
    });
    checkMappingProgress();
    updateWhatIfUI();
  });

  // Khởi tạo các sự kiện What-If khi load xong DOM
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initWhatIfControls();
  } else {
    document.addEventListener('DOMContentLoaded', initWhatIfControls);
  }
})();
