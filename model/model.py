import os
import mysql.connector
import tensorflow as tf
import numpy as np
import pandas as pd
import time
from datetime import datetime
import joblib

# 데이터베이스 연결 설정
config = {
    'user': 'root',
    'password': 'junlabFT7zDgh64',
    'host': '127.0.0.1',
    'port': 32306,
    'database': 'factorymanagement'
}

# 모델 로드
model_path = './new_model_1.h5'
model = tf.keras.models.load_model(model_path)
model_version = 'new_model_1.h5'
scaler_path = './scaler.pkl'

pd.options.display.float_format = '{:.2f}'.format
scaler = joblib.load(scaler_path)


def get_all_user_ids():
    conn = mysql.connector.connect(**config)
    cursor = conn.cursor(dictionary=True)
    query = "SELECT user_id FROM users"
    cursor.execute(query)
    result = cursor.fetchall()
    cursor.close()
    conn.close()
    return [row['user_id'] for row in result]

def preprocess_data(data, index_range, column_name):
    """ 입력 데이터를 Pandas DataFrame으로 변환 후 누락된 분은 np.nan으로 채우고 중복된 분은 평균으로 합침 """
    df = pd.DataFrame(data)
    if not df.empty:
        df = df.groupby('minute').mean().reindex(index_range, fill_value=np.nan).astype(np.float32)
        return df[column_name].values
    else:
        return np.full(len(index_range), np.nan)

def get_user_data(user_id):
    conn = mysql.connector.connect(**config)
    cursor = conn.cursor(dictionary=True)

    query1 = """
    SELECT 
        DATE_FORMAT(timestamp, '%Y-%m-%d %H:%i') AS minute,
        heart_rate,
        body_temperature
    FROM 
        airwatch_data
    WHERE 
        user_id = %s
        AND timestamp >= NOW() - INTERVAL 30 MINUTE
    ORDER BY 
        timestamp;
    """

    query2 = """
    SELECT 
        DATE_FORMAT(timestamp, '%Y-%m-%d %H:%i') AS minute,
        tvoc,
        co2
    FROM 
        airwall_data
    WHERE 
        sensor_module_id = (SELECT airwall_id FROM users WHERE user_id = %s)
        AND timestamp >= NOW() - INTERVAL 30 MINUTE
    ORDER BY 
        timestamp;
    """

    cursor.execute(query1, (user_id,))
    result1 = cursor.fetchall()

    cursor.execute(query2, (user_id,))
    result2 = cursor.fetchall()

    cursor.close()
    conn.close()

    return result1, result2

def predict_workload_for_user(user_id):
    result1, result2 = get_user_data(user_id)

    # 현재 시간부터 30분 전까지의 모든 분(minute) 생성
    index_range = pd.date_range(end=pd.Timestamp.now().floor('min'), periods=30, freq='min').strftime('%Y-%m-%d %H:%M')

    # 데이터 전처리
    heart_rate_data = [{'minute': row['minute'], 'heart_rate': row['heart_rate']} for row in result1]
    body_temp_data = [{'minute': row['minute'], 'body_temperature': row['body_temperature']} for row in result1]
    tvoc_data = [{'minute': row['minute'], 'tvoc': row['tvoc']} for row in result2]
    co2_data = [{'minute': row['minute'], 'co2': row['co2']} for row in result2]

    avg_heart_rates = preprocess_data(heart_rate_data, index_range, 'heart_rate')
    avg_body_temperatures = preprocess_data(body_temp_data, index_range, 'body_temperature')
    avg_tvoc = preprocess_data(tvoc_data, index_range, 'tvoc')
    avg_co2 = preprocess_data(co2_data, index_range, 'co2')

    # NaN 값을 0으로 대체
    avg_heart_rates = np.nan_to_num(avg_heart_rates)
    avg_body_temperatures = np.nan_to_num(avg_body_temperatures)
    avg_tvoc = np.nan_to_num(avg_tvoc)
    avg_co2 = np.nan_to_num(avg_co2)
    avg_tvoc = avg_tvoc / 1000

    # 소숫점 아래 둘째 자리까지만 출력되도록 설정
    np.set_printoptions(precision=2, suppress=True)

    # 30분 데이터를 4x30 형태로 변환
    input_data = np.array([avg_co2, avg_tvoc, avg_heart_rates, avg_body_temperatures]).T
    
    # 배열의 shape 저장
    original_shape = input_data.shape

    # 2차원 배열로 변환 (reshape)
    data_reshaped = input_data.reshape(-1, original_shape[-1])

    # 저장된 스케일러를 사용하여 테스트 데이터 변환
    scaled_data_reshaped = scaler.transform(data_reshaped)

    # 다시 원래 shape로 변환
    scaled_data = scaled_data_reshaped.reshape(original_shape)

    input_data = scaled_data.reshape(1, 30, 4)  # 모델 입력에 맞게 reshape

    print(input_data)

    # 예측 수행
    prediction = model.predict(input_data)
    
    # 가장 높은 값을 가진 인덱스+1을 계산
    highest_index = np.argmax(prediction) + 1

    return int(highest_index)

def save_prediction_to_db(user_id, prediction_value):
    conn = mysql.connector.connect(**config)
    cursor = conn.cursor()

    query1 = """
    INSERT INTO workload_data (timestamp, value, user_id, model_version)
    VALUES (%s, %s, %s, %s)
    """

    query2 = """
    UPDATE users SET last_workload = %s WHERE user_id = %s
    """

    cursor.execute(query1, (datetime.now(), prediction_value, user_id, model_version))
    cursor.execute(query2, (prediction_value, user_id))
    conn.commit()
    cursor.close()
    conn.close()

if __name__ == "__main__":
    while True:
        user_ids = get_all_user_ids()
        for user_id in user_ids:
            try:
                prediction_value = predict_workload_for_user(user_id)
                save_prediction_to_db(user_id, prediction_value)
                print(f"User ID: {user_id}, Prediction: {prediction_value}")
            except Exception as e:
                print(f"Error processing user ID {user_id}: {e}")
        time.sleep(30)  # 30초 대기
