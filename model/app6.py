# app.py

# libraries
import numpy as np
import pandas as pd
import tensorflow as tf
from flask import Flask, request, jsonify
from collections import OrderedDict
import os
import pickle
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger('werkzeug')
handler = logging.StreamHandler()
logger.addHandler(handler)

# SensibleTemp.py에서 Temp 클래스 임포트
from SensibleTemp import Temp

# 작업 강도, 환경 지수, 건강 지수 단계 threshhold
work_level_threshold = [0.39280, 0.78581, 1.17889, 1.41316]
env_level_threshold = [1, 3, 6, 9]
hc_level_threshold = [0.1, 0.3, 0.6, 0.9]

# 모델 버전
env_version = 'env_predict_ver3.1.1.h5'
hc_version = 'hc_predict_ver3.1.1.h5'

# 저장된 Scaler 객체 불러오기
with open('mm_scaler.pkl', 'rb') as f:
    loaded_scaler = pickle.load(f)

# 모델 경로 설정
env_model_path = os.getenv('ENV_MODEL_PATH', env_version)
hc_model_path = os.getenv('HC_MODEL_PATH', hc_version)

# 모델 로드
env_model = tf.keras.models.load_model(env_model_path, compile=False)
hc_model = tf.keras.models.load_model(hc_model_path, compile=False)

# Temp 클래스의 전역 인스턴스 생성
temp_calculator = Temp()

# Flask 앱 인스턴스 생성
app = Flask(__name__)

# 작업 강도 계산 함수
def calculate_work_level(env_predicted_value, hc_predicted_value, thresholds):
    vectors = np.array([[env_predicted_value, hc_predicted_value]])
    scaled_data = loaded_scaler.transform(vectors)
    work_level_index = np.linalg.norm(scaled_data)
    for i, threshold in enumerate(thresholds):
        if work_level_index <= threshold:
            return i + 1, work_level_index
    return len(thresholds) + 1, work_level_index

# 지수 단계 계산 함수
def get_index_level(value, thresholds):
    for i, threshold in enumerate(thresholds):
        if value < threshold:
            return i
    return len(thresholds)

# 예측 함수
def predict_values(test_data, data_type):
    env_level_labels = ['tvoc', 'co2', 'pm2_5', 'SensibleTemp']
    hc_level_labels = ['heart_rate', 'body_temperature']

    env_predicted_value, hc_predicted_value = None, None

    if data_type in ['level', 'env']:
        test_data['SensibleTemp'] = test_data.apply(lambda row: temp_calculator.get_sensible_temp(row['temperature'], row['humid'], 0), axis=1).round(1)
        env_data = test_data[env_level_labels].to_numpy().reshape((-1, 30, len(env_level_labels), 1))
        env_predicted_value = float(env_model.predict(env_data)[0][0])

    if data_type in ['level', 'hc']:
        hc_data = test_data[hc_level_labels].to_numpy().reshape((-1, 30, len(hc_level_labels), 1))
        hc_predicted_value = float(hc_model.predict(hc_data)[0][0])

    return env_predicted_value, hc_predicted_value

# 플라스크 서버 실행
@app.route("/predict", methods=['POST'])
def predict():
    input_data = request.get_json()
    if not input_data:
        return jsonify({"error": "No JSON data provided"}), 400
    
    try:
        data_type = input_data.pop('type', None)
        if data_type not in ['env', 'hc', 'level']:
            return jsonify({"error": "Invalid or missing 'type'"}), 400
        
        # 07/29 -> None 처리 추가
        test_data = pd.DataFrame(input_data).replace({None: np.nan}).apply(lambda x: x.fillna(x.mean() if x.mean() is not np.nan else 0), axis=0)
        if test_data.isna().all().all():
            return jsonify({"result": 0}), 200
        
        # logger.info(f"Processed data: {test_data}")
        
        env_predicted_value, hc_predicted_value = predict_values(test_data, data_type)
        
        response = OrderedDict()
        if data_type in ['level', 'env']:
            env_level_class = get_index_level(env_predicted_value, env_level_threshold)
            response["환경 지수"] = env_predicted_value
            response["환경 단계"] = env_level_class
            response["env_version"] = env_version

        if data_type in ['level', 'hc']:
            hc_level_class = get_index_level(hc_predicted_value, hc_level_threshold)
            response["건강 지수"] = hc_predicted_value
            response["건강 단계"] = hc_level_class
            response["hc_version"] = hc_version

        if data_type == 'level':
            work_level_class, work_level_index = calculate_work_level(env_predicted_value, hc_predicted_value, work_level_threshold)
            response["작업 강도 단계"] = work_level_class
            response["작업 강도 지수"] = work_level_index
        
        return jsonify(response), 200

    except Exception as e:
        return jsonify({"error": f"An error occurred during data processing: {e}"}), 500

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=9900)
