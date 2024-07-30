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

# 레이블 설정
env_level_labels = ['tvoc', 'co2', 'pm2_5', 'SensibleTemp']
hc_level_labels = ['heart_rate', 'body_temperature']
work_level_threshold = [1.0, 1.5, 2.5, 4.0, 6.0]

env_version = 'new_env_predict_ver2.h5'
hc_version = 'new_hc_predict_ver1.h5'

# 모델 경로 설정
env_model_path = os.getenv('ENV_MODEL_PATH', env_version)
hc_model_path = os.getenv('HC_MODEL_PATH', hc_version)

# 모델 로드 및 컴파일
env_model = tf.keras.models.load_model(env_model_path, compile=False)
hc_model = tf.keras.models.load_model(hc_model_path, compile=False)

env_model.compile(optimizer='adam', loss='mean_squared_error', metrics=['mean_absolute_error'])
hc_model.compile(optimizer='adam', loss='mean_squared_error', metrics=['mean_absolute_error'])

# Flask 앱 인스턴스 생성
app = Flask(__name__)

def calculate_work_level(env_predicted_value, hc_predicted_value, thresholds):
    vectors = np.array([env_predicted_value, hc_predicted_value])
    work_level = np.linalg.norm(vectors)

    for i, threshold in enumerate(thresholds):
        if work_level <= threshold:
            return i + 1, work_level
    return len(thresholds) + 1, work_level

@app.route("/predict", methods=['POST'])
def predict():

    input_data = request.get_json()
    if not input_data:
        return jsonify({"error": "No JSON data provided"}), 400

    try:
        # input_data에서 type을 확인
        if 'type' not in input_data or input_data['type'] not in ['env', 'hc', 'level']:
            return jsonify({"error": "Invalid or missing 'type'"}), 400
        
        data_type = input_data.pop('type')
        
        # 입력 데이터셋 만듬 
        test_data = pd.DataFrame(input_data)
        
        # 필요한 열이 있는지 확인
        expected_columns = ['tvoc', 'co2', 'pm2_5', 'temperature', 'heart_rate', 'body_temperature', 'humid']
        # 필요한 열만 존재하는지 확인
        if input_data['type'] == 'env':
            if not all(col in test_data.columns for col in env_level_labels):
                return jsonify({"error": f"Missing columns for type 'env': {env_level_labels}"}), 400
        elif input_data['type'] == 'hc':
            if not all(col in test_data.columns for col in hc_level_labels):
                return jsonify({"error": f"Missing columns for type 'hc': {hc_level_labels}"}), 400
        elif input_data['type'] == 'level':
            if not all(col in test_data.columns for col in expected_columns):
                return jsonify({"error": f"Missing columns for type 'level': {expected_columns}"}), 400
        
        # 모든 컬럼이 nan인 경우 0으로 반환
        if test_data.isna().all().all():
            return jsonify({"result": 0}), 200
        
        # temp_calculator 객체 생성
        temp_calculator = Temp()
        
        # 온도^습도 = 체감 온도 변환 후 입력 데이터 프레임에 추가
        test_data['SensibleTemp'] = test_data.apply(lambda row: temp_calculator.get_sensible_temp(row['temperature'], row['humid'], 0), axis=1).round(1)
        
        # 모델 예측 입력 변수 
        env_data = test_data[env_level_labels].to_numpy().reshape((-1, 30, 4, 1))
        hc_data = test_data[hc_level_labels].to_numpy().reshape((-1, 30, 2, 1))
        
        env_predictions = env_model.predict(env_data)
        hc_predictions = hc_model.predict(hc_data)
        
        env_predicted_value = float(env_predictions[0][0])
        hc_predicted_value = float(hc_predictions[0][0])
        
        work_level_class, work_level = calculate_work_level(env_predicted_value, hc_predicted_value, work_level_threshold)
        
        if data_type == 'env':
            response = OrderedDict([
                ("환경 지수", env_predicted_value)
            ])
        elif data_type == 'hc':
            response = OrderedDict([
                ("건강 지수", hc_predicted_value)
            ])
        else:  # type == 'level'
            response = OrderedDict([
                ("환경 지수", env_predicted_value),
                ("건강 지수", hc_predicted_value),
                ("작업 강도", work_level_class)
            ])
        
        return jsonify(response), 200

    except Exception as e:
        return jsonify({"error": f"An error occurred during data processing: {e}"}), 500

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=9900)