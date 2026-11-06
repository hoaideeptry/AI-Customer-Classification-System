from flask import Flask, request, render_template, jsonify
import os

# Import các module từ rfm_engine do nhóm tự viết
from rfm_engine import read_and_clean_data, calculate_rfm, predict_segments

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'

# THÊM MỚI: Cấu hình định dạng file cho phép
ALLOWED_EXTENSIONS = {'csv', 'xlsx', 'xls'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Đảm bảo các thư mục tồn tại khi app chạy
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.makedirs('models', exist_ok=True)

@app.route('/')
def index():
    # Render giao diện web
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    # Route API để xử lý file tải lên
    if 'file' not in request.files:
        return jsonify({'error': 'Vui lòng đính kèm file dữ liệu!'})
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'File rỗng!'})
        
    # THÊM MỚI: Bắt lỗi nếu người dùng tải lên sai định dạng file (ví dụ: .jpg, .png)
    if file and not allowed_file(file.filename):
        return jsonify({'error': 'Lỗi hệ thống Pipeline: Định dạng file không được hỗ trợ. Vui lòng dùng .csv hoặc .xlsx'})
        
    if file:
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(filepath)
        
        try:
            # --- QUY TRÌNH DATA PIPELINE (Gọi từ rfm_engine) ---
            # 1. Tiền xử lý
            df_clean = read_and_clean_data(filepath)
            
            # 2. Trích xuất đặc trưng RFM
            rfm_df = calculate_rfm(df_clean)
            
            # 3. Chạy mô hình phân loại khách hàng
            final_df = predict_segments(rfm_df)
            
            # --- CHUẨN BỊ RESPONSE CHO FRONTEND ---
            stats = final_df['Segment'].value_counts().to_dict()
            final_df['Monetary'] = final_df['Monetary'].round(2)
            
            # Lấy top 50 khách để hiển thị trên bảng
            top_customers = final_df.head(50).to_dict(orient='records')
            
            return jsonify({
                'success': True,
                'stats': stats,
                'total_customers': len(final_df),
                'customers': top_customers
            })
            
        except Exception as e:
            # Bắt và trả về lỗi nếu có trục trặc trong quá trình tính toán
            return jsonify({'error': f'Lỗi hệ thống Pipeline: {str(e)}'})

if __name__ == '__main__':
    print("=====================================================")
    print("🚀 HỆ THỐNG RFM CUSTOMER SEGMENTATION ĐANG CHẠY...")
    print("👉 Mở trình duyệt tại: http://127.0.0.1:5000")
    print("=====================================================")
    app.run(debug=True, port=5000)