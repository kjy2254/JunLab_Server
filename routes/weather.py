from flask import Flask, request, jsonify, Response
import requests
import mysql.connector
from datetime import datetime, timedelta
from collections import OrderedDict
import json
from flask_cors import CORS

# Flask 앱 인스턴스 생성
app = Flask(__name__)
CORS(app)  # 모든 도메인에 대해 CORS 허용

# 공통 변수 설정
service_key = 'gMd0YK8U3nHitfme0jM/329mJIWWC+iT6ef9ZFOE3uKbEqaxUoX1pHYfydANX461W006heWvEj9SpPyC1QEKiA=='

# 날짜 및 시간 형식 변환 함수
def format_datetime(base_date, base_time):
    dt_str = base_date + base_time
    dt = datetime.strptime(dt_str, '%Y%m%d%H%M')
    return dt.strftime('%y.%m.%d %H:%M')

# API 호출 함수
def get_weather_data(url, params):
    response = requests.get(url, params=params)
    response.raise_for_status()  # 요청 실패 시 예외 발생
    return response.json()

# 하늘 상태(SKY) 코드 변환 함수
def sky_code_to_text(code):
    return {
        "1": "맑음",
        "3": "구름많음",
        "4": "흐림"
    }.get(str(code), "정보 없음")

# 강수량(RN1) 범주화 함수
def rn1_to_category(rn1):
    if rn1 == '-' or rn1 == '0' or rn1 is None:
        return '강수없음'
    rn1 = float(rn1)
    if rn1 < 1.0:
        return '1.0mm 미만'
    elif 1.0 <= rn1 < 30.0:
        return f'{rn1:.1f}mm'
    elif 30.0 <= rn1 < 50.0:
        return '30.0~50.0mm'
    else:
        return '50.0mm 이상'

# 초단기 실황 데이터 가져오기 함수
def get_ncst_data(base_date, base_time, nx, ny, service_key):
    url_ncst = 'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst'
    params_ncst = {
        'serviceKey': service_key,
        'pageNo': '1',
        'numOfRows': '1000',
        'dataType': 'json',
        'base_date': base_date,
        'base_time': base_time,
        'nx': nx,
        'ny': ny
    }
    data_ncst = get_weather_data(url_ncst, params_ncst)
    items_ncst = data_ncst['response']['body']['items']['item']
    weather_info = {item['category']: item['obsrValue'] for item in items_ncst}
    formatted_datetime = format_datetime(items_ncst[0]['baseDate'], items_ncst[0]['baseTime'])
    return formatted_datetime, weather_info

# 초단기 예보 데이터 가져오기 함수
def get_fcst_data(base_date, base_time, base_date_prev, base_time_prev, nx, ny, service_key):
    url_fcst = 'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst'
    params_fcst = {
        'serviceKey': service_key,
        'pageNo': '1',
        'numOfRows': '1000',
        'dataType': 'json',
        'base_date': base_date,
        'base_time': base_time,
        'nx': nx,
        'ny': ny
    }
    data_fcst = get_weather_data(url_fcst, params_fcst)
    if data_fcst['response']['header']['resultCode'] == '03':
        params_fcst['base_date'], params_fcst['base_time'] = base_date_prev, base_time_prev
        data_fcst = get_weather_data(url_fcst, params_fcst)
        if data_fcst['response']['header']['resultCode'] == '03':
            raise KeyError('NO_DATA')
    
    items_fcst = data_fcst['response']['body']['items']['item']
    forecast = {item['fcstTime']: item['fcstValue'] for item in items_fcst if item['category'] == 'SKY'}
    sorted_times = sorted(forecast.keys())
    if sorted_times:
        first_time = sorted_times[0]
        first_sky = forecast[first_time]
        formatted_first_time = format_datetime(base_date, first_time)
        return formatted_first_time, first_sky
    else:
        raise KeyError('NO_FORECAST_DATA')

# 데이터베이스에서 공장 좌표 가져오기 함수
def get_factory_coordinates(factory_id):
    conn = mysql.connector.connect(
        host='127.0.0.1',
        port=32306,
        user='root',
        password='junlabFT7zDgh64',
        database='factorymanagement'
    )
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT nx, ny, location FROM factories WHERE factory_id = %s", (factory_id,))
    result = cursor.fetchone()
    cursor.close()
    conn.close()
    if result and result['nx'] and result['ny']:
        return int(result['nx']), int(result['ny']), str(result['location'])
    else:
        raise ValueError("Invalid factory_id or missing coordinates")

# 날씨 정보 가져오기 함수
def get_weather_info(factory_id):
    try:
        # 현재 시간 정각으로 맞추기
        now = datetime.now()
        base_date = now.strftime('%Y%m%d')
        base_time = now.strftime('%H') + '00'

        # 한 시간 전 시간으로 설정
        previous_hour = now - timedelta(hours=1)
        base_date_prev = previous_hour.strftime('%Y%m%d')
        base_time_prev = previous_hour.strftime('%H') + '00'

        nx, ny, location = get_factory_coordinates(factory_id)
        ncst_datetime, weather_info = get_ncst_data(base_date, base_time, nx, ny, service_key)
        fcst_datetime, first_sky = get_fcst_data(base_date, base_time, base_date_prev, base_time_prev, nx, ny, service_key)
        
        # 강수량 범주 확인
        rn1_category = rn1_to_category(weather_info.get('RN1', '정보 없음'))
        
        # 강수량이 존재하면 하늘 상태에 '비' 추가
        sky_text = sky_code_to_text(first_sky)
        if rn1_category != '강수없음':
            sky_text += ' (비)'
        
        result = OrderedDict()
        result['location'] = location
        result['update'] = ncst_datetime
        result['temperature'] = f"{weather_info.get('T1H', '정보 없음')}℃"
        result['humidity'] = f"{weather_info.get('REH', '정보 없음')}%"
        result['precipitation'] = rn1_category
        result['sky'] = sky_text

        return result
    except KeyError as e:
        return {"오류": f"데이터 오류: {e}"}
    except requests.exceptions.HTTPError as e:
        return {"오류": f"HTTP 요청 오류: {e}"}
    except Exception as e:
        return {"오류": f"알 수 없는 오류 발생: {e}"}

# Flask 엔드포인트 정의
@app.route('/weather', methods=['GET'])
def weather():
    try:
        factory_id = request.args.get('factory_id')
        if factory_id is None: 
            return jsonify({"오류": "factory_id가 제공되지 않았습니다."}), 400
        weather_info = get_weather_info(factory_id)
        response = Response(json.dumps(weather_info, ensure_ascii=False), content_type='application/json; charset=utf-8')
        return response
    except Exception as e:
        return jsonify({"오류": f"잘못된 요청: {e}"}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=9977)
