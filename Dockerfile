# 1. 베이스 이미지 선택
FROM node:18-alpine

# 2. 작업 디렉토리 설정
WORKDIR /usr/src/app

# 3. 패키지 종속성 복사 및 설치
COPY package*.json ./

RUN npm install

# 4. 애플리케이션 소스 복사
COPY . .

# 5. 애플리케이션 포트 설정 (예: 8080 포트 사용)
EXPOSE 8080

# 6. 애플리케이션 실행 명령어 설정
CMD ["npm", "start"]
