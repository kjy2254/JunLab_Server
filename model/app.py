# libraries
import numpy as np
import pandas as pd
import tensorflow as tf
from flask import Flask, request, jsonify
from collections import OrderedDict
import os

env_level_labels = ['tvoc', 'co2']
hc_level_labels = ['heart_rate', 'Temperature']
work_level_threshold = [1.0, 1.5, 2.5, 4.0, 6.0]

env_version = "env_predict.h5"
hc_version = "hc_predict.h5"

# 모델 경로 설정
env_model_path = os.getenv('ENV_MODEL_PATH', env_version)
hc_model_path = os.getenv('HC_MODEL_PATH', hc_version)

# 모델 로드
env_model = tf.keras.models.load_model(env_model_path, compile=False)
hc_model = tf.keras.models.load_model(hc_model_path, compile=False)

env_model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
hc_model.compile(optimizer='adam', loss='mean_squared_error', metrics=['mean_absolute_error'])

# Flask 앱 인스턴스 생성
app = Flask(__name__)

def calculate_work_level(env_predicted_value, hc_predicted_value, thresholds):
    vectors = np.array([env_predicted_value, hc_predicted_value])
    work_level = np.linalg.norm(vectors)
    
    app.logger.info(f'작업강도지수: {work_level}')

    for i, threshold in enumerate(thresholds):
        if work_level <= threshold:
            return i + 1, work_level
    return len(thresholds) , work_level

@app.route("/predict", methods=['POST'])
def predict():
    input_data = request.get_json()
    if not input_data:
        return jsonify({"error": "No JSON data provided"}), 400

    try:
        # input_data에서 type을 확인
        if 'type' not in input_data or input_data['type'] not in ['env', 'hc', 'level']:
            return jsonify({"error": "Invalid or missing 'type'"}), 400
        
        # type을 제외한 데이터프레임 생성, null 값을 NaN으로 변환
        data_dict = {k: v if v is not None else np.nan for k, v in input_data.items() if k != 'type'}
        
        # 각 리스트를 개별 행으로 확장
        test_data = pd.DataFrame(data_dict)
        
        expected_columns = ['tvoc', 'co2', 'heart_rate', 'Temperature']
        
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
        
        env_predicted_value = None
        hc_predicted_value = None
        
        # 모든 값이 NaN인지 확인하는 함수
        def all_nan(data, columns):
            return all(data[col].isna().all() for col in columns)
        
        # 입력 데이터 길이 맞추기
        def pad_data(data, target_length=30):
            if len(data) < target_length:
                return np.pad(data, (0, target_length - len(data)), 'constant', constant_values=0)
            return np.array(data[:target_length])

        # 예측 수행
        if input_data['type'] in ['env', 'level']:
            if all_nan(test_data, env_level_labels):
                env_predicted_value = 0
            else:
                env_data = np.array([pad_data(test_data[col].values) for col in env_level_labels]).reshape(1, 30, 2)
                env_predictions = env_model.predict(env_data)
                env_predicted_value = float(env_predictions[0][0])
        
        if input_data['type'] in ['hc', 'level']:
            if all_nan(test_data, hc_level_labels):
                hc_predicted_value = 0
            else:
                hc_data = np.array([pad_data(test_data[col].values) for col in hc_level_labels]).reshape(1, 30, 2)
                hc_predictions = hc_model.predict(hc_data)
                hc_predicted_value = float(hc_predictions[0][0])
        
        response = OrderedDict()
        
        
        if input_data['type'] == 'env':
            response["환경 지수"] = round(env_predicted_value, 3)
            response["env_version"] = env_version
        elif input_data['type'] == 'hc':
            response["건강 지수"] = round(hc_predicted_value, 3)
            response["hc_version"] = hc_version
        elif input_data['type'] == 'level':
            work_level_class, work_level = calculate_work_level(env_predicted_value, hc_predicted_value, work_level_threshold)
            response["환경 지수"] = round(env_predicted_value, 3)
            response["건강 지수"] = round(hc_predicted_value, 3)
            response["작업 강도"] = work_level_class
            response["env_version"] = env_version
            response["hc_version"] = hc_version
        
        return jsonify(response), 200

    except Exception as e:
        return jsonify({"error": f"An error occurred during data processing: {e}"}), 500

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=9900)
