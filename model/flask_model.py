# app.py

# libraries
import numpy as np
import pandas as pd
import tensorflow as tf
from flask import Flask, request, jsonify
from collections import OrderedDict
import os

# SensibleTemp.py에서 Temp 클래스 임포트
from SensibleTemp import Temp

# 작업 강도 threshhold (임시)
work_level_threshold = [1.5, 2.5, 4.0, 6.0]

# 모델 버전
env_version = 'env_predict_ver2.h5'
hc_version = 'hc_predict_ver1.h5'

# 모델 경로 설정
env_model_path = os.getenv('ENV_MODEL_PATH', env_version)
hc_model_path = os.getenv('HC_MODEL_PATH', hc_version)

# 모델 로드 및 컴파일
env_model = tf.keras.models.load_model(env_model_path, compile=False)
hc_model = tf.keras.models.load_model(hc_model_path, compile=False)

env_model.compile(optimizer='adam', loss='mean_squared_error', metrics=['mean_absolute_error'])
hc_model.compile(optimizer='adam', loss='mean_squared_error', metrics=['mean_absolute_error'])

# Temp 클래스의 전역 인스턴스 생성
temp_calculator = Temp()

# Flask 앱 인스턴스 생성
app = Flask(__name__)

# 작업 강도 계산 함수
def calculate_work_level(env_predicted_value, hc_predicted_value, thresholds):
    vectors = np.array([env_predicted_value, hc_predicted_value])
    work_level = np.linalg.norm(vectors)

    for i, threshold in enumerate(thresholds):
        if work_level <= threshold:
            return i + 1, work_level
    return len(thresholds) + 1, work_level

# 예측 함수
def predict_values(test_data, data_type):
    env_level_labels = ['tvoc', 'co2', 'pm2_5', 'temperature', 'humid']
    env_level_labels2 = ['tvoc', 'co2', 'pm2_5', 'SensibleTemp']
    hc_level_labels = ['heart_rate', 'body_temperature']

    # 0719 09:54 => none -> nan 변환 로직 추가
    test_data = test_data.replace({None: np.nan})

    if data_type == 'level' or data_type == 'env':
        test_data['SensibleTemp'] = test_data.apply(lambda row: temp_calculator.get_sensible_temp(row['temperature'], row['humid'], 0), axis=1).round(1)
        env_data = test_data[env_level_labels2].to_numpy().reshape((-1, 30, len(env_level_labels2), 1))
        env_predictions = env_model.predict(env_data)
        env_predicted_value = float(env_predictions[0][0])
    else:
        env_predicted_value = None

    if data_type == 'level' or data_type == 'hc':
        hc_data = test_data[hc_level_labels].to_numpy().reshape((-1, 30, len(hc_level_labels), 1))
        hc_predictions = hc_model.predict(hc_data)
        hc_predicted_value = float(hc_predictions[0][0])
    else:
        hc_predicted_value = None

    return env_predicted_value, hc_predicted_value

# 플라스크 서버 실행
@app.route("/predict", methods=['POST'])
def predict():
    input_data = request.get_json()
    if not input_data:
        return jsonify({"error": "No JSON data provided"}), 400
    
    try:
        if 'type' not in input_data or input_data['type'] not in ['env', 'hc', 'level']:
            return jsonify({"error": "Invalid or missing 'type'"}), 400
        
        data_type = input_data.pop('type')
        test_data = pd.DataFrame(input_data)

        if test_data.isna().all().all():
            return jsonify({"result": 0}), 200

        env_predicted_value, hc_predicted_value = predict_values(test_data, data_type)
        
        if data_type == 'level':
            work_level_class, work_level = calculate_work_level(env_predicted_value, hc_predicted_value, work_level_threshold)
            response = OrderedDict([
                ("환경 지수", env_predicted_value),
                ("건강 지수", hc_predicted_value),
                ("작업 강도", work_level_class),
                ("env_version", env_version),
                ("hc_version", hc_version)
            ])
        elif data_type == 'env':
            response = OrderedDict([
                ("환경 지수", env_predicted_value),
                ("env_version", env_version)
            ])
        elif data_type == 'hc':
            response = OrderedDict([
                ("건강 지수", hc_predicted_value),
                ("hc_version", hc_version)
            ])
        
        return jsonify(response), 200

    except Exception as e:
        return jsonify({"error": f"An error occurred during data processing: {e}"}), 500

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=9900)
