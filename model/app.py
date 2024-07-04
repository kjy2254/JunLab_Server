import numpy as np
import pandas as pd
import joblib
import tensorflow as tf
from flask import Flask, request, jsonify
import os

# Flask 앱 인스턴스 생성
app = Flask(__name__)

print("실행됨")

@app.route("/predict", methods=['POST'])
def predict():
    if request.method == 'POST':
        input_data = request.get_json()
        if input_data:
            try:
                test_data = pd.DataFrame(input_data)
                expected_columns = ['tvoc', 'co2', 'heart_rate', 'Temperature']
                for col in expected_columns:
                    if col not in test_data.columns:
                        return jsonify({"error": f"Missing column: {col}"}), 400

                test_data['tvoc'] = test_data['tvoc'] / 1000

                scaler_path = os.getenv('SCALER_PATH', 'scaler.pkl')
                scaler = joblib.load(scaler_path)
                data_array = test_data.values
                original_shape = data_array.shape
                data_reshaped = data_array.reshape(-1, original_shape[-1])
                scaled_data_reshaped = scaler.transform(data_reshaped)
                scaled_data = scaled_data_reshaped.reshape(original_shape)
                test_data_reshaped = scaled_data.reshape(1, original_shape[0], original_shape[1])
                
                model_path = os.getenv('MODEL_PATH', 'new_model_1.h5')
                try:
                    model = tf.keras.models.load_model(model_path, compile=False)
                    model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
                    predictions = model.predict(test_data_reshaped)
                    predicted_class = np.argmax(predictions, axis=1)

                except Exception as e:
                    return jsonify({"error": f"An error occurred while loading the model: {e}"}), 500

                result = {'Predicted class': f'{predicted_class[0]+1} 단계'}
                return jsonify(result), 200

            except Exception as e:
                return jsonify({"error": f"An error occurred during data processing: {e}"}), 500
        else:
            return jsonify({"error": "No JSON data provided"}), 400

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=9900, debug=False)
