# 기존 이미지 사용 (npm이 설치되지 않은 이미지)
FROM junlabweb:latest

# 작업 디렉토리 설정
WORKDIR /usr/src/app

# Node.js 및 npm 설치
RUN curl -fsSL https://deb.nodesource.com/setup_14.x | bash - \
    && apt-get install -y nodejs

# pm2 설치
RUN npm install -g pm2

# 컨테이너 시작 시 여러 디렉토리에서 npm 명령어 실행 및 pm2 시작
CMD /bin/bash -c "npm install && cd frontend_bs && npm install && npm run build && cd ../labelingsystem && npm install && npm run build && pm2 resurrect"
