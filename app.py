from flask import Flask, request, render_template, jsonify
import pandas as pd
import datetime as dt
import joblib
import os

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'Vui lòng chọn file dữ liệu!'})
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'Chưa chọn file!'})
        
    if file:
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(filepath)
        
        try:
            # 1. Đọc dữ liệu
            if filepath.endswith('.csv'):
                df = pd.read_csv(filepath, encoding='unicode_escape')
            elif filepath.endswith(('.xls', '.xlsx')):
                df = pd.read_excel(filepath)
            else:
                return jsonify({'error': 'Định dạng file không hỗ trợ. Vui lòng tải lên CSV hoặc Excel.'})
                
            # Kiểm tra cột bắt buộc
            required_cols = ['CustomerID', 'InvoiceDate', 'Quantity', 'UnitPrice', 'InvoiceNo']
            if not all(col in df.columns for col in required_cols):
                return jsonify({'error': f'File thiếu các cột bắt buộc: {required_cols}'})
            
            # 2. Tiền xử lý
            df = df.dropna(subset=['CustomerID'])
            df = df[(df['Quantity'] > 0) & (df['UnitPrice'] > 0)]
            df['CustomerID'] = df['CustomerID'].astype(int).astype(str)
            df['InvoiceDate'] = pd.to_datetime(df['InvoiceDate'])
            df['TotalAmount'] = df['Quantity'] * df['UnitPrice']
            
            # 3. Tính RFM
            current_date = df['InvoiceDate'].max() + dt.timedelta(days=1)
            rfm = df.groupby('CustomerID').agg({
                'InvoiceDate': lambda x: (current_date - x.max()).days,
                'InvoiceNo': 'nunique',
                'TotalAmount': 'sum'
            }).reset_index()
            rfm.columns = ['CustomerID', 'Recency', 'Frequency', 'Monetary']
            
            # 4. Load Model AI
            try:
                model = joblib.load('rfm_classifier_model.pkl')
            except FileNotFoundError:
                return jsonify({'error': 'Không tìm thấy file rfm_classifier_model.pkl trong thư mục hệ thống.'})
                
            # 5. Dự đoán
            X = rfm[['Recency', 'Frequency', 'Monetary']]
            predictions = model.predict(X)
            rfm['Segment'] = predictions
            
            # 6. Chuẩn bị kết quả trả về Frontend
            stats = rfm['Segment'].value_counts().to_dict()
            
            # Formatting tiền tệ và làm tròn ngày cho đẹp
            rfm['Monetary'] = rfm['Monetary'].round(2)
            top_customers = rfm.head(50).to_dict(orient='records')
            
            return jsonify({
                'success': True,
                'stats': stats,
                'total_customers': len(rfm),
                'customers': top_customers
            })
            
        except Exception as e:
            return jsonify({'error': f'Lỗi khi xử lý dữ liệu: {str(e)}'})

if __name__ == '__main__':
    print("Khởi động AI Customer Segmentation Web App...")
    app.run(debug=True, port=5000)
