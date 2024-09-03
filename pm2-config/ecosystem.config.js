module.exports = {
    apps: [
      {
        name: 'CalcIndex', // 애플리케이션 이름
        script: '../data_collect/Indexes.js', // 실행할 스크립트 경로
        log: '/root/.pm2/logs/CalcIndex/CalcIndex.log', // 로그 파일 경로
        out_file: '/root/.pm2/logs/CalcIndex/CalcIndex.log', // 출력 로그 경로
        error_file: '/root/.pm2/logs/CalcIndex/CalcIndex-error.log', // 오류 로그 경로
        time: true,
      },
      {
        name: 'AIServer',
        script: '../model/app6.py',
        log: '/root/.pm2/logs/AIServer/AIServer.log',
        out_file: '/root/.pm2/logs/AIServer/AIServer.log', // 출력 로그 경로
        error_file: '/root/.pm2/logs/AIServer/AIServer-error.log', // 오류 로그 경로
        interpreter: 'python3',
        cwd: '../model',
        time: true,
      },
      {
        name: 'WearOS',
        script: '../data_collect/WearOS.js',
        log: '/root/.pm2/logs/WearOS/WearOS.log',
        out_file: '/root/.pm2/logs/WearOS/WearOS.log', // 출력 로그 경로
        error_file: '/root/.pm2/logs/WearOS/WearOS-error.log', // 오류 로그 경로
        time: true,
      },
      {
        name: 'Fitrus',
        script: '../data_collect/fitrus.js',
        log: '/root/.pm2/logs/Fitrus/Fitrus.log',
        out_file: '/root/.pm2/logs/Fitrus/Fitrus.log', // 출력 로그 경로
        error_file: '/root/.pm2/logs/Fitrus/Fitrus-error.log', // 오류 로그 경로
        time: true,
      },
      {
        name: 'Pico',
        script: '../data_collect/pico.js',
        log: '/root/.pm2/logs/Pico/Pico.log',
        out_file: '/root/.pm2/logs/Pico/Pico.log', // 출력 로그 경로
        error_file: '/root/.pm2/logs/Pico/Pico-error.log', // 오류 로그 경로
        time: true,
      },
      {
        name: 'OSLab',
        script: '../data_collect/socket.js',
        log: '/root/.pm2/logs/OSLab/OSLab.log',
        out_file: '/root/.pm2/logs/OSLab/OSLab.log', // 출력 로그 경로
        error_file: '/root/.pm2/logs/OSLab/OSLab-error.log', // 오류 로그 경로
        time: true,
      },
      {
        name: 'Weather',
        script: '../routes/weather.py',
        log: '/root/.pm2/logs/Weather/Weather.log',
        out_file: '/root/.pm2/logs/Weather/Weather.log', // 출력 로그 경로
        error_file: '/root/.pm2/logs/Weather/Weather-error.log', // 오류 로그 경로
        interpreter: 'python3', 
        time: true,
      },
      {
        name: 'WWW',
        script: '../bin/www',
        log: '/root/.pm2/logs/WWW/WWW.log',
        out_file: '/root/.pm2/logs/WWW/WWW.log', // 출력 로그 경로
        error_file: '/root/.pm2/logs/WWW/WWW-error.log', // 오류 로그 경로
        time: true,
      },
    ],
  };
  