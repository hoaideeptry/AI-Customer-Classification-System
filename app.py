from flask import Flask, request, render_template, jsonify
import os

# Import các module từ rfm_engine do nhóm tự viết
from rfm_engine import read_and_clean_data, calculate_rfm, predict_segments

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'

# Cấu hình định dạng file cho phép
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
    # Route API để xử lý file tải lên vật lý
    if 'file' not in request.files:
        return jsonify({'error': 'Vui lòng đính kèm file dữ liệu!'})
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'File rỗng!'})
        
    if file and not allowed_file(file.filename):
        return jsonify({'error': 'Lỗi hệ thống Pipeline: Định dạng file không được hỗ trợ. Vui lòng dùng .csv hoặc .xlsx'})
        
    if file:
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(filepath)
        
        try:
            # 1. Tiền xử lý
            df_clean = read_and_clean_data(filepath)
            
            # 2. Trích xuất đặc trưng RFM
            rfm_df = calculate_rfm(df_clean)
            
            # 3. Chạy mô hình phân loại khách hàng
            final_df = predict_segments(rfm_df)
            
            stats = final_df['Segment'].value_counts().to_dict()
            final_df['Monetary'] = final_df['Monetary'].round(2)
            
            top_customers = final_df.head(50).to_dict(orient='records')
            
            return jsonify({
                'success': True,
                'stats': stats,
                'total_customers': len(final_df),
                'customers': top_customers
            })
            
        except Exception as e:
            return jsonify({'error': f'Lỗi hệ thống Pipeline: {str(e)}'})

@app.route('/predict_json', methods=['POST'])
def predict_json():
    # Route API xử lý dữ liệu JSON đã được map chuẩn từ Client (SaaS Data Mapper)
    try:
        import pandas as pd
        req_data = request.get_json()
        if not req_data or 'data' not in req_data or not req_data['data']:
            return jsonify({'error': 'Không nhận được dữ liệu JSON hoặc danh sách rỗng!'})
        
        df = pd.DataFrame(req_data['data'])
        
        required_cols = ['CustomerID', 'InvoiceDate', 'Quantity', 'UnitPrice', 'InvoiceNo']
        for col in required_cols:
            if col not in df.columns:
                return jsonify({'error': f'Thiếu cột dữ liệu bắt buộc: {col}'})
                
        # Làm sạch và ép kiểu dữ liệu
        df = df.dropna(subset=['CustomerID'])
        df['Quantity'] = pd.to_numeric(df['Quantity'], errors='coerce')
        df['UnitPrice'] = pd.to_numeric(df['UnitPrice'], errors='coerce')
        df = df.dropna(subset=['Quantity', 'UnitPrice'])
        df = df[(df['Quantity'] > 0) & (df['UnitPrice'] > 0)]
        
        df['CustomerID'] = df['CustomerID'].astype(str).str.replace(r'\.0$', '', regex=True)
        df['InvoiceDate'] = pd.to_datetime(df['InvoiceDate'], errors='coerce')
        df = df.dropna(subset=['InvoiceDate'])
        
        if len(df) == 0:
            return jsonify({'error': 'Dữ liệu không có dòng nào hợp lệ sau khi làm sạch (Quantity > 0, UnitPrice > 0, Ngày hợp lệ).'})
            
        df['TotalAmount'] = df['Quantity'] * df['UnitPrice']
        
        # 2. Trích xuất RFM
        rfm_df = calculate_rfm(df)
        
        # 3. Chạy mô hình phân loại khách hàng
        final_df = predict_segments(rfm_df)
        
        stats = final_df['Segment'].value_counts().to_dict()
        final_df['Monetary'] = final_df['Monetary'].round(2)
        top_customers = final_df.head(50).to_dict(orient='records')
        
        return jsonify({
            'success': True,
            'stats': stats,
            'total_customers': len(final_df),
            'customers': top_customers
        })
    except Exception as e:
        return jsonify({'error': f'Lỗi hệ thống Pipeline: {str(e)}'})

if __name__ == '__main__':
    print("=====================================================")
    print("🚀 HỆ THỐNG RFM CUSTOMER SEGMENTATION ĐANG CHẠY...")
    print("👉 Mở trình duyệt tại: http://127.0.0.1:5000")
    print("=====================================================")
    app.run(debug=True, port=5000)
