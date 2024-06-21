from flask import Flask, jsonify,request
from flask_cors import CORS
import pandas as pd
from nilmtk import DataSet
from sklearn.preprocessing import MinMaxScaler
import tensorflow as tf
import numpy as np
import json


app = Flask(__name__)
CORS(app)

@app.route('/get_data', methods=['GET'])
def get_data():
        start_date = request.args.get('start')
        end_date = request.args.get('end')
        ukdale = DataSet('ukdale.h5')
        ukdale.set_window(start=start_date, end=end_date)
        building = ukdale.buildings[1]
        elec = building.elec

        mains = elec.mains()
        mains_data = next(mains.load())[('power', 'active')].resample('1T').mean().fillna(0)
        # Convert to list of values
        list = []
        list.append(mains_data.index.tolist())
        list.append(mains_data.values.tolist())
        return jsonify(list)
    



@app.route('/predict', methods=['POST'])
def predict():
    keys = ['fridge freezer', 'washer dryer', 'dish washer', 'computer', 'television', 'kettle']
    if request.method == 'POST':
        data = request.json
        data = np.array(data).reshape(-1, 1)
        model = tf.keras.models.load_model('cnnModel.h5')
        scaler_X = MinMaxScaler()
        input_data = scaler_X.fit_transform(data)

        # Sliding window approach
        window_size = 60  # 1 hour windows for example
        input_data = np.array([input_data[i:i + window_size] for i in range(len(input_data) - window_size)])


        pred = model.predict(input_data)
        
        predictions_sum = np.sum(pred, axis=1)
        # Inverse transform predictions
        predictions = np.transpose(predictions_sum)
        column_sums = np.sum(predictions, axis=1)
        sorted_indices = np.argsort(column_sums)[::-1]
        sorted_predictions = predictions[sorted_indices, :].tolist()
        sorted_keys = [keys[i] for i in sorted_indices]
        combined = [{sorted_keys[i]: sorted_predictions[i]} for i in range(len(keys))]
        return jsonify(combined)
    else:
        response = app.response_class(
            response=json.dumps({}),
            status=200,
            mimetype='application/json'
        )
        return response
    
    

if __name__ == '__main__':
    app.run(debug=True)

