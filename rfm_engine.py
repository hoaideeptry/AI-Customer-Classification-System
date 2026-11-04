import pandas as pd
import datetime as dt
import joblib
import os

# Đường dẫn mặc định tới thư mục models
MODEL_DIR = 'models'
MODEL_PATH = os.path.join(MODEL_DIR, 'rfm_classifier_model.pkl')

def read_and_clean_data(filepath):
    """Bước 1: Đọc file và làm sạch dữ liệu thô"""
    # Đọc file dựa theo định dạng
    if filepath.endswith('.csv'):
        df = pd.read_csv(filepath, encoding='unicode_escape')
    elif filepath.endswith(('.xls', '.xlsx')):
        df = pd.read_excel(filepath)
    else:
        raise ValueError("Định dạng file không được hỗ trợ. Vui lòng dùng .csv hoặc .xlsx")
    
    # Kiểm tra tính toàn vẹn của dữ liệu (Data Integrity)
    required_cols = ['CustomerID', 'InvoiceDate', 'Quantity', 'UnitPrice', 'InvoiceNo']
    if not all(col in df.columns for col in required_cols):
        raise ValueError(f"File tải lên thiếu các cột bắt buộc: {required_cols}")
        
    # Xử lý Missing values và Outliers
    df = df.dropna(subset=['CustomerID'])
    df = df[(df['Quantity'] > 0) & (df['UnitPrice'] > 0)]
    
    # Ép kiểu dữ liệu
    df['CustomerID'] = df['CustomerID'].astype(int).astype(str)
    df['InvoiceDate'] = pd.to_datetime(df['InvoiceDate'])
    
    # Kỹ thuật đặc trưng (Feature Engineering)
    df['TotalAmount'] = df['Quantity'] * df['UnitPrice']
    
    return df

def calculate_rfm(df):
    """Bước 2: Trích xuất ma trận RFM từ lịch sử giao dịch"""
    current_date = df['InvoiceDate'].max() + dt.timedelta(days=1)
    
    rfm = df.groupby('CustomerID').agg({
        'InvoiceDate': lambda x: (current_date - x.max()).days, # Recency
        'InvoiceNo': 'nunique',                                 # Frequency
        'TotalAmount': 'sum'                                    # Monetary
    }).reset_index()
    
    rfm.columns = ['CustomerID', 'Recency', 'Frequency', 'Monetary']
    return rfm

def predict_segments(rfm_df):
    """Bước 3: Chạy Inference với mô hình Random Forest"""
    # Tải mô hình
    if not os.path.exists(MODEL_PATH):
        # Fallback nếu sinh viên lỡ để model ở thư mục gốc
        fallback_path = 'rfm_classifier_model.pkl'
        if os.path.exists(fallback_path):
            model = joblib.load(fallback_path)
        else:
            raise FileNotFoundError(f"Hệ thống không tìm thấy file mô hình AI tại {MODEL_PATH}")
    else:
        model = joblib.load(MODEL_PATH)
    
    # Dự đoán
    X = rfm_df[['Recency', 'Frequency', 'Monetary']]
    predictions = model.predict(X)
    rfm_df['Segment'] = predictions
    
    return rfm_df
