(() => {
  // =========================================================================
  // BỘ TỪ ĐIỂN ĐA NGÔN NGỮ TOÀN DIỆN (DEEP I18N DICTIONARY: VI & EN)
  // =========================================================================
  const translations = {
    vi: {
      // Topbar & Navigation
      app_title: "RFM INTELLIGENCE",
      app_sub: "Hệ thống AI Phân tích Khách hàng",
      nav_section_data: "QUẢN TRỊ DỮ LIỆU & AI",
      nav_upload: "1. Tải lên Dữ liệu",
      nav_logs: "2. Nhật ký Hệ thống",
      nav_dashboard: "3. Bảng Điều Khiển",
      nav_section_system: "HỆ THỐNG & MÔ HÌNH",
      nav_sample_csv: "Tải file CSV Mẫu",
      nav_project_info: "Thông tin Đồ án",
      nav_engine_status: "RFM Engine v2.0 AI",
      admin_role: "Hệ thống AI",
      breadcrumb_admin: "Quản trị",
      breadcrumb_upload: "Tải lên dữ liệu",
      breadcrumb_logs: "Nhật ký hệ thống (Audit Logs)",
      breadcrumb_dashboard: "Bảng điều khiển (Dashboard)",

      // Page 1: Upload Step 1
      upload_header_title: "Tải lên & Khớp Dữ Liệu Khách Hàng",
      upload_header_sub: "Nạp tập tin giao dịch và cấu hình ánh xạ cột thông minh theo chuẩn SaaS",
      btn_download_sample: "Tải file mẫu (Sample CSV)",
      step1_card_header: "BƯỚC 1: CHỌN TẬP TIN GIAO DỊCH",
      step1_badge: "Bước 1/2",
      dropzone_title: "Chọn hoặc kéo thả file dữ liệu vào đây",
      dropzone_formats: "Hỗ trợ định dạng: .CSV, .XLS, .XLSX",
      file_selected_label: "Đã chọn:",
      btn_start_mapping: "Đọc & Khớp Cột Dữ Liệu (Data Mapping)",
      guide_card_header: "QUY CHUẨN DỮ LIỆU & MÔ HÌNH",
      guide_box1_title: "Tính Năng Auto-Map SaaS",
      guide_box1_desc: "Hệ thống hỗ trợ tự động nhận diện tên cột tiếng Việt hoặc tiếng Anh không cần đặt tên chính xác tuyệt đối:",
      guide_box2_title: "Quy trình Pipeline 3 bước",
      guide_step1_desc: "Đọc nhanh dòng tiêu đề & dữ liệu tại máy khách.",
      guide_step2_desc: "Người dùng kiểm tra và khớp 5 trường chuẩn.",
      guide_step3_desc: "Gửi JSON chuẩn lên AI Pipeline phân cụm RFM.",

      // Auto-Map Schema Field Hints
      hint_customer_id: "Mã khách, ID KH, Client ID, User ID...",
      hint_invoice_date: "Ngày mua, Transaction Date, Order Date...",
      hint_quantity: "Số lượng, Qty, Sản lượng...",
      hint_unit_price: "Đơn giá, Price, Giá bán, Rate...",
      hint_invoice_no: "Mã đơn, Order ID, Số hóa đơn...",

      // Modal Thông tin đồ án
      modal_info_title: "THÔNG TIN ĐỒ ÁN MÔN HỌC",
      modal_project_name: "RFM INTELLIGENCE - HỆ THỐNG PHÂN LOẠI KHÁCH HÀNG BẰNG AI",
      modal_project_sub: "Nền tảng phân tích vòng đời khách hàng & dự báo chiến lược Marketing tự động theo chuẩn Doanh nghiệp SaaS",
      modal_univ_label: "Đơn vị đào tạo:",
      modal_univ_name: "Khoa Công nghệ Thông tin",
      modal_univ_school: "Trường Đại học Lạc Hồng (LHU)",
      modal_students_label: "Sinh viên thực hiện:",
      modal_student_1: "Nguyễn Văn Hoài",
      modal_student_2: "Dương Duy Khánh",
      modal_tech_stack_label: "Công nghệ & Kiến trúc Hệ thống:",
      modal_features_label: "Tính năng nổi bật:",
      modal_feat_1: "Khớp cột thông minh Client-side (Data Mapper Engine kiểu Mailchimp)",
      modal_feat_2: "Mô hình học máy phân cụm RFM & Trực quan hóa không gian 3D Plotly tương tác",
      modal_feat_3: "Mô phỏng khách hàng thời gian thực (What-If Simulation Engine)",
      modal_btn_close: "Đóng",

      // Page 1: Data Mapper UI Step 2
      mapper_title: "Khớp Cột Dữ Liệu (Data Field Mapping)",
      mapper_file_label: "Tệp:",
      mapper_total_label: "Tổng:",
      mapper_detected_label: "Phát hiện:",
      btn_change_file: "Đổi tệp khác",
      mapper_tip: "Hệ thống đã tự động liên kết các cột tương ứng. Bạn có thể kiểm tra cột 'Xem trước dữ liệu' và chỉnh sửa nếu muốn.",
      btn_re_automap: "Tự động khớp lại",
      th_system_field: "Trường Hệ Thống (System Field)",
      th_file_column: "Cột Trong Tệp Của Bạn (Your File Column)",
      th_preview: "Dữ Liệu Mẫu (Sample Preview)",
      th_status: "Trạng Thái",
      field_required: "Bắt buộc",
      field_cust_title: "Mã Khách Hàng",
      field_date_title: "Ngày Giao Dịch",
      field_qty_title: "Số Lượng Sản Phẩm",
      field_price_title: "Đơn Giá Món Hàng",
      field_inv_title: "Mã Đơn Hàng",
      unmapped_option: "-- Chưa chọn cột / Unmapped --",
      no_data_preview: "Chưa có dữ liệu",
      empty_column_preview: "Cột rỗng",
      status_unmatched: "Chưa khớp",
      status_matched: "Đã khớp",
      matched_progress: "Đã khớp:",
      matched_all: "Đã khớp hoàn tất 5/5 trường",
      btn_back_upload: "Quay lại chọn file",
      btn_confirm_run: "Xác Nhận & Chạy Phân Tích Pipeline",

      // Page 2: Audit Logs
      logs_page_title: "Nhật ký hoạt động",
      logs_page_sub: "Theo dõi toàn bộ lịch sử tương tác, xử lý mô hình và pipeline AI",
      btn_clear_logs: "Xóa nhật ký",
      btn_export_logs: "Xuất nhật ký (CSV)",
      filter_all_actions: "Tất cả hành động",
      search_placeholder: "Tìm kiếm theo nội dung, tác nhân...",
      showing_events: "Đang hiển thị:",
      events_unit: "sự kiện",
      th_time: "Thời gian",
      th_actor: "Nhân viên / Tác nhân",
      th_action: "Hành động",
      th_details: "Tóm tắt hoạt động & Chi tiết",

      // Tác nhân (Actors)
      actor_ai_system: "Hệ thống AI",
      actor_user: "Người dùng",
      actor_sheetjs: "Công cụ SheetJS",
      actor_automap: "AI Auto-Mapper",
      actor_datamapper: "Data Mapper",
      actor_transformer: "Bộ chuyển đổi dữ liệu",
      actor_ai_client: "AI Client",

      // Thông điệp Audit Logs (Log Messages with Interpolation)
      log_init_env: "Môi trường AI và mô hình phân cụm RFM đã được khởi tạo thành công.",
      log_portal_ready: "Hệ thống sẵn sàng tiếp nhận tập tin giao dịch khách hàng.",
      log_file_selected: "Đã chọn tệp: {filename} ({size} KB)",
      log_reading_file: "Đang đọc cấu trúc tập tin {filename} trực tiếp tại máy khách (SheetJS)...",
      log_read_success: "Đã đọc thành công {rows} dòng dữ liệu với {cols} cột.",
      log_automap_success: "AI Auto-Map đã so khớp thành công {matched}/5 trường theo quy tắc chuẩn xác.",
      log_pipeline_start: "Khởi tạo pipeline với cấu trúc ánh xạ cột: CustomerID -> [{CustomerID}], InvoiceDate -> [{InvoiceDate}], Quantity -> [{Quantity}], UnitPrice -> [{UnitPrice}], InvoiceNo -> [{InvoiceNo}]",
      log_normalizing: "Đang chuẩn hóa {rows} bản ghi sang chuẩn JSON 5 trường hệ thống...",
      log_dispatching: "Gửi payload JSON chuẩn ({rows} dòng) tới endpoint /predict_json...",
      log_clustering_success: "Phân cụm hoàn tất thành công cho {count} khách hàng!",
      log_failed: "Thất bại: {error}",

      // Page 3: Dashboard
      dashboard_title: "Bảng Điều Khiển Phân Cụm Khách Hàng",
      dashboard_sub: "Trực quan hóa đa chiều các chỉ số RFM và chiến lược Marketing tự động",
      btn_print_report: "In báo cáo",
      kpi_total: "TỔNG KHÁCH HÀNG",
      kpi_vip: "TỶ LỆ KHÁCH VIP",
      kpi_risk: "NGUY CƠ RỜI BỎ",
      chart_segment_title: "PHÂN BỔ PHÂN KHÚC",
      ai_strategy_title: "Gợi ý Chiến lược từ AI",
      ai_strategy_placeholder: "Tải dữ liệu để nhận gợi ý chiến lược.",
      chart_3d_title: "KHÔNG GIAN PHÂN CỤM 3D (R - F - M)",
      chart_3d_hint: "Xoay / cuộn để khám phá 3D",
      whatif_card_title: "MÔ PHỎNG KHÁCH HÀNG (WHAT-IF)",
      whatif_sub: "Thử nghiệm thay đổi chỉ số R-F-M để quan sát AI dự đoán phân khúc trong thời gian thực:",
      whatif_recency_label: "Recency (R - Số ngày):",
      whatif_frequency_label: "Frequency (F - Số đơn hàng):",
      whatif_monetary_label: "Monetary (M - Tổng chi tiêu):",
      whatif_result_header: "Dự đoán phân khúc AI",
      whatif_r_min: "1 ngày (Gần đây)",
      whatif_r_max: "365 ngày (Lâu)",
      whatif_f_min: "1 lần",
      whatif_f_max: "50 lần",
      whatif_m_min: "$10",
      whatif_m_max: "$10,000+",
      table_results_title: "KẾT QUẢ DỰ ĐOÁN (TOP 50 KHÁCH HÀNG TIÊU BIỂU)",
      th_cust_id: "Mã khách",
      th_recency: "Recency (Ngày)",
      th_frequency: "Frequency (Lần)",
      th_monetary: "Monetary ($)",
      th_segment: "Phân khúc AI",

      // Ghi chú What-If Segments
      whatif_note_vip: "Giao dịch gần đây, tần suất cao và chi tiêu rất lớn. Đóng góp doanh thu cốt lõi.",
      whatif_note_risk: "Đã rất lâu chưa quay lại mua sắm. Cần can thiệp chiến dịch tái kích hoạt sớm.",
      whatif_note_loyal: "Khách hàng có lịch sử quay lại đều đặn và doanh thu ổn định.",
      whatif_note_casual: "Khách mới hoặc tần suất giao dịch còn thấp. Cần ưu đãi kích cầu mua lại.",

      // Notifications Toast
      toast_file_selected: "Đã chọn file thành công.",
      toast_columns_detected: "Đã nhận diện các cột dữ liệu!",
      toast_missing_fields: "Vui lòng khớp đủ 5 trường bắt buộc! Còn thiếu:",
      toast_analysis_complete: "Phân tích dữ liệu hoàn tất!",
      toast_logs_cleared: "Đã xóa sạch nhật ký.",
      toast_logs_exported: "Đã xuất file Audit Logs thành công.",
      toast_project_info: "Đồ án: RFM Customer Segmentation AI Engine - Đã sẵn sàng bảo vệ!"
    },

    en: {
      // Topbar & Navigation
      app_title: "RFM INTELLIGENCE",
      app_sub: "Enterprise Customer AI Analytics",
      nav_section_data: "DATA & AI MANAGEMENT",
      nav_upload: "1. Data Ingestion",
      nav_logs: "2. Audit Logs",
      nav_dashboard: "3. AI Dashboard",
      nav_section_system: "SYSTEM & MODELS",
      nav_sample_csv: "Download Sample CSV",
      nav_project_info: "Project Overview",
      nav_engine_status: "RFM Engine v2.0 AI",
      admin_role: "AI System",
      breadcrumb_admin: "Admin",
      breadcrumb_upload: "Data Ingestion",
      breadcrumb_logs: "Audit Logs",
      breadcrumb_dashboard: "AI Dashboard",

      // Page 1: Upload Step 1
      upload_header_title: "Data Ingestion & Field Mapping",
      upload_header_sub: "Upload transaction logs and configure smart column mappings per SaaS standard",
      btn_download_sample: "Download Sample CSV",
      step1_card_header: "STEP 1: SELECT TRANSACTION FILE",
      step1_badge: "Step 1/2",
      dropzone_title: "Select or drag & drop data file here",
      dropzone_formats: "Supported formats: .CSV, .XLS, .XLSX",
      file_selected_label: "Selected:",
      btn_start_mapping: "Inspect & Map Columns (Data Mapping)",
      guide_card_header: "DATA SPECIFICATION & MODEL",
      guide_box1_title: "SaaS Smart Auto-Map",
      guide_box1_desc: "System automatically identifies Vietnamese or English column headers without requiring exact naming:",
      guide_box2_title: "3-Step Pipeline Flow",
      guide_step1_desc: "Instantly parse headers & sample records on client.",
      guide_step2_desc: "Verify and map the 5 standard schema fields.",
      guide_step3_desc: "Dispatch normalized JSON to RFM AI pipeline.",

      // Auto-Map Schema Field Hints
      hint_customer_id: "Customer ID, Client ID, User ID...",
      hint_invoice_date: "Purchase Date, Transaction Date, Order Date...",
      hint_quantity: "Quantity, Qty, Volume, Count...",
      hint_unit_price: "Unit Price, Price, Item Cost, Rate...",
      hint_invoice_no: "Invoice No, Order ID, Bill No...",

      // Modal Thông tin đồ án
      modal_info_title: "GRADUATION CAPSTONE PROJECT",
      modal_project_name: "RFM INTELLIGENCE - AI-POWERED CUSTOMER SEGMENTATION",
      modal_project_sub: "Enterprise SaaS Platform for Customer Lifecycle Analytics & Automated Marketing Strategies",
      modal_univ_label: "Institution:",
      modal_univ_name: "Faculty of Information Technology",
      modal_univ_school: "Lac Hong University (LHU)",
      modal_students_label: "Project Authors / Students:",
      modal_student_1: "Nguyen Van Hoai",
      modal_student_2: "Duong Duy Khanh",
      modal_tech_stack_label: "Technology Stack & Architecture:",
      modal_features_label: "Key Highlights:",
      modal_feat_1: "Smart Client-side Data Mapping (Mailchimp style)",
      modal_feat_2: "RFM Machine Learning & Interactive 3D Plotly Space",
      modal_feat_3: "Real-time Customer Simulation (What-If Analysis Engine)",
      modal_btn_close: "Close",

      // Page 1: Data Mapper UI Step 2
      mapper_title: "Data Field Mapping",
      mapper_file_label: "File:",
      mapper_total_label: "Total:",
      mapper_detected_label: "Detected:",
      btn_change_file: "Change File",
      mapper_tip: "AI has mapped corresponding fields. You can inspect sample previews and modify mapping if needed.",
      btn_re_automap: "Re-run Auto-Map",
      th_system_field: "System Field (Standard)",
      th_file_column: "Your File Column",
      th_preview: "Sample Preview",
      th_status: "Status",
      field_required: "Required",
      field_cust_title: "Customer ID",
      field_date_title: "Transaction Date",
      field_qty_title: "Purchased Quantity",
      field_price_title: "Unit Price",
      field_inv_title: "Invoice / Order No",
      unmapped_option: "-- Unmapped / Select Column --",
      no_data_preview: "No data available",
      empty_column_preview: "Empty column",
      status_unmatched: "Unmatched",
      status_matched: "Matched",
      matched_progress: "Matched:",
      matched_all: "Successfully matched 5/5 fields",
      btn_back_upload: "Back to file selection",
      btn_confirm_run: "Confirm & Execute AI Pipeline",

      // Page 2: Audit Logs
      logs_page_title: "Activity Audit Logs",
      logs_page_sub: "Track end-to-end interactions, pipeline execution, and model inferences",
      btn_clear_logs: "Clear Logs",
      btn_export_logs: "Export Logs (CSV)",
      filter_all_actions: "All Actions",
      search_placeholder: "Search by message, actor, action...",
      showing_events: "Displaying:",
      events_unit: "events",
      th_time: "Timestamp",
      th_actor: "Actor / User",
      th_action: "Action",
      th_details: "Activity Summary & Details",

      // Tác nhân (Actors)
      actor_ai_system: "AI System",
      actor_user: "User",
      actor_sheetjs: "SheetJS Engine",
      actor_automap: "Auto-Mapper AI",
      actor_datamapper: "Data Mapper",
      actor_transformer: "Client Transformer",
      actor_ai_client: "AI Client",

      // Thông điệp Audit Logs (Log Messages with Interpolation)
      log_init_env: "AI environment and RFM clustering models successfully initialized.",
      log_portal_ready: "System ready to ingest customer transaction datasets.",
      log_file_selected: "Selected file: {filename} ({size} KB)",
      log_reading_file: "Parsing file structure for {filename} directly on client (SheetJS)...",
      log_read_success: "Successfully parsed {rows} data rows across {cols} columns.",
      log_automap_success: "AI Auto-Map successfully matched {matched}/5 schema fields accurately.",
      log_pipeline_start: "Initialized pipeline with field mapping: CustomerID -> [{CustomerID}], InvoiceDate -> [{InvoiceDate}], Quantity -> [{Quantity}], UnitPrice -> [{UnitPrice}], InvoiceNo -> [{InvoiceNo}]",
      log_normalizing: "Normalizing {rows} records into system 5-field JSON standard...",
      log_dispatching: "Dispatching normalized JSON payload ({rows} rows) to /predict_json...",
      log_clustering_success: "Clustering completed successfully for {count} customers!",
      log_failed: "Execution failed: {error}",

      // Page 3: Dashboard
      dashboard_title: "Customer Segmentation Dashboard",
      dashboard_sub: "Multi-dimensional RFM visualization and automated strategic marketing advice",
      btn_print_report: "Print Report",
      kpi_total: "TOTAL CUSTOMERS",
      kpi_vip: "VIP CLIENT RATIO",
      kpi_risk: "CHURN RISK RATIO",
      chart_segment_title: "SEGMENT DISTRIBUTION",
      ai_strategy_title: "AI Strategic Recommendations",
      ai_strategy_placeholder: "Upload data to receive AI strategic guidance.",
      chart_3d_title: "3D CLUSTERING SPACE (R - F - M)",
      chart_3d_hint: "Drag / scroll to explore 3D view",
      whatif_card_title: "CUSTOMER SIMULATION (WHAT-IF)",
      whatif_sub: "Experiment with R-F-M parameters to observe real-time AI segmentation in action:",
      whatif_recency_label: "Recency (R - Days ago):",
      whatif_frequency_label: "Frequency (F - Orders count):",
      whatif_monetary_label: "Monetary (M - Total spending):",
      whatif_result_header: "AI Segment Prediction",
      whatif_r_min: "1 day (Recent)",
      whatif_r_max: "365 days (Inactive)",
      whatif_f_min: "1 time",
      whatif_f_max: "50 times",
      whatif_m_min: "$10",
      whatif_m_max: "$10,000+",
      table_results_title: "INFERENCE RESULTS (TOP 50 SAMPLE CUSTOMERS)",
      th_cust_id: "Customer ID",
      th_recency: "Recency (Days)",
      th_frequency: "Frequency (Times)",
      th_monetary: "Monetary ($)",
      th_segment: "AI Segment",

      // Ghi chú What-If Segments
      whatif_note_vip: "Recent purchases, high frequency and substantial monetary spend. Core revenue driver.",
      whatif_note_risk: "Inactive for an extended period. Needs prompt win-back campaign intervention.",
      whatif_note_loyal: "Customers with consistent return history and steady financial contribution.",
      whatif_note_casual: "New or low frequency buyers. Needs targeted incentives to boost repurchase rate.",

      // Notifications Toast
      toast_file_selected: "File loaded successfully.",
      toast_columns_detected: "Detected file columns successfully!",
      toast_missing_fields: "Please map all 5 required fields! Missing:",
      toast_analysis_complete: "Data analysis completed!",
      toast_logs_cleared: "Audit logs cleared.",
      toast_logs_exported: "Audit logs exported successfully.",
      toast_project_info: "Project: RFM Customer Segmentation AI Engine - Enterprise SaaS Standard!"
    }
  };

  let currentLanguage = localStorage.getItem('rfm_language') || 'vi';

  // Hàm dịch có hỗ trợ nội suy tham số {param}
  window.t = function (key, params = {}, fallback = '') {
    const langDict = translations[currentLanguage] || translations.vi;
    let text = langDict[key] || fallback || key;
    if (typeof text === 'string' && params && typeof params === 'object') {
      Object.keys(params).forEach(p => {
        text = text.replace(new RegExp(`\\{${p}\\}`, 'g'), params[p]);
      });
    }
    return text;
  };

  window.getCurrentLang = function () {
    return currentLanguage;
  };

  // Hàm chuyển đổi ngôn ngữ toàn diện (Deep i18n)
  window.changeLanguage = function (lang) {
    if (lang !== 'vi' && lang !== 'en') {
      lang = currentLanguage === 'vi' ? 'en' : 'vi';
    }
    currentLanguage = lang;
    localStorage.setItem('rfm_language', lang);
    document.documentElement.setAttribute('lang', lang);

    const langLabelEl = document.getElementById('currentLangLabel');
    if (langLabelEl) {
      langLabelEl.textContent = lang.toUpperCase();
    }

    // 1. Quét toàn bộ DOM có data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const translation = window.t(key);
      if (translation) {
        el.textContent = translation;
      }
    });

    // 2. Placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      const translation = window.t(key);
      if (translation) {
        el.setAttribute('placeholder', translation);
      }
    });

    // 3. Title
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      const translation = window.t(key);
      if (translation) {
        el.setAttribute('title', translation);
      }
    });

    // Phát custom event cho ui.js và api.js cập nhật các phần động
    window.dispatchEvent(new CustomEvent('languagechange', { detail: { lang } }));
  };

  document.addEventListener('DOMContentLoaded', () => {
    const langToggleBtn = document.getElementById('langToggle');
    if (langToggleBtn) {
      langToggleBtn.addEventListener('click', () => {
        window.changeLanguage();
      });
    }
    window.changeLanguage(currentLanguage);
  });
})();
