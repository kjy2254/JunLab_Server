const dgram = require("dgram");
const server = dgram.createSocket("udp4");
const connection = require("./database/mysql");

server.on("error", (err) => {
  console.log(`서버 에러:\n${err.stack}`);
  server.close();
});

server.on("message", (msg, rinfo) => {
  try {
    // 메시지를 JSON으로 파싱
    const data = JSON.parse(msg);

    // 각 필드 값을 변수에 할당
    const time = data.Time;
    const id = data.ID;
    const mac = data.MAC;
    const hrp = data.HRP;
    const temp = data.Temp;
    const wear = data.Wear === "true" ? 1 : 0;

    const query1 = `SELECT user_id FROM users WHERE id = ?`;
    const query2 = `INSERT INTO airwatch_data(user_id, device_id, heart_rate, body_temperature, wear, timestamp) 
                    VALUES(?,?,?,?,?,?)`;
    const query3 = `UPDATE airwatch SET last_sync = ?, last_heart_rate = ?, last_body_temperature = ?, last_wear = ? 
                    WHERE watch_id = ?`;

    // 1번 쿼리 실행
    connection.query(query1, [id], (err, results) => {
      if (err) {
        console.error(`쿼리 실행 에러: ${err.message}`);
        return;
      }

      if (results.length > 0) {
        const userId = results[0].user_id;

        // 2번 쿼리 실행
        connection.query(
          query2,
          [userId, mac, hrp, temp, wear, time],
          (err, results) => {
            if (err) {
              console.error(`데이터 삽입 에러: ${err.message}`);
              return;
            }
          }
        );

        // 3번 쿼리 실행
        connection.query(
          query3,
          [time, hrp, temp, wear, mac],
          (err, results) => {
            if (err) {
              console.error(`데이터 업데이트 에러: ${err.message}`);
              return;
            }
          }
        );
      } else {
        console.error(`사용자를 찾을 수 없습니다: ID = ${id}`);
      }
    });
  } catch (error) {
    console.error(`메시지 파싱 에러: ${error.message}`);
  }
});

server.on("listening", () => {
  const address = server.address();
  console.log(`서버 리스닝 ${address.address}:${address.port}`);
});

// 이 포트 번호를 원하는 포트로 변경하세요.
server.bind(4325);
