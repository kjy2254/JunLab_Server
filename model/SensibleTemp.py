# SensibleTemp.py

# libraries
import math
from datetime import datetime

# 체감온도 구하기
class Temp:
    def get_in_summer(self, ta, rh):
        """
        여름철 체감온도 (5월 ~ 9월)
        
        :param ta: 기온
        :param rh: 상대습도
        :return: 체감온도
        """
        tw = self.get_tw(ta, rh)
        return -0.2442 + 0.55399 * tw + 0.45535 * ta - 0.0022 * math.pow(tw, 2) + 0.00278 * tw * ta + 3.0

    def get_in_winter(self, ta, v):
        """
        겨울철 체감온도 (10월 ~ 익년 4월)
        
        :param ta: 기온
        :param v: 10분 평균 풍속
        :return: 체감온도
        """
        return 13.12 + 0.6215 * ta - 11.37 * math.pow(v, 0.16) + 0.3965 * math.pow(v, 0.16) * ta

    def get_sensible_temp(self, ta, rh, v):
        """
        지금이 몇월인지에 따라 여름 및 겨울 계산공식 적용
        
        :param ta: 기온
        :param rh: 상대습도
        :param v: 10분 평균 풍속
        :return: 체감온도
        """
        season = self.get_current_season()
        return self.get_in_summer(ta, rh) if 5 <= season <= 9 else self.get_in_winter(ta, v)

    def get_tw(self, ta, rh):
        """
        습구온도 계산공식
        
        :param ta: 온도
        :param rh: 상대습도
        :return: 습구온도
        """
        return ta * math.atan(0.151977 * math.pow(rh + 8.313659, 0.5)) + math.atan(ta + rh) - math.atan(rh - 1.67633) + (0.00391838 * math.pow(rh, 1.5) * math.atan(0.023101 * rh)) - 4.686035

    def get_current_season(self):
        """
        현재 월수 출력
        :return: 현재 월
        """
        return datetime.now().month