const dgram = require("dgram");
const server = dgram.createSocket("udp4");
const connection = require("./database/mysql");

const lastSavedTime = {};
const saveInterval = 5000; // db에 저장하는 주기

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

    const currentTime = new Date().getTime();

    // 마지막 저장 시간과 현재 시간의 차이를 계산
    if (lastSavedTime[id] && currentTime - lastSavedTime[id] < saveInterval) {
      //   console.log(`ID = ${id} 메시지가 최근에 저장되어 무시되었습니다.`);
      return;
    }

    console.log(JSON.stringify(data));

    // 마지막 저장 시간을 업데이트
    lastSavedTime[id] = currentTime;

    const query1 = `SELECT user_id, watch_id FROM users WHERE id = ?`;
    const query2 = `INSERT INTO airwatch_data(user_id, device_id, heart_rate, body_temperature, wear, timestamp) 
                        VALUES(?,?,?,?,?,?)`;
    const query3 = `INSERT INTO airwatch (watch_id, last_sync, last_heart_rate, last_body_temperature, last_wear) 
                        VALUES (?, ?, ?, ?, ?)
                      ON DUPLICATE KEY UPDATE 
                        last_sync = VALUES(last_sync),
                        last_heart_rate = VALUES(last_heart_rate),
                        last_body_temperature = VALUES(last_body_temperature),
                        last_wear = VALUES(last_wear)`;
    const query5_get = `SELECT id FROM users WHERE watch_id = ?`;
    const query5_update_old = `UPDATE users SET watch_id = NULL WHERE id = ?`;
    const query5_update_new = `UPDATE users SET watch_id = ? WHERE id = ?`;

    // 1번 쿼리 실행
    connection.query(query1, [id], (err, results) => {
      if (err) {
        console.error(`쿼리 실행 에러: ${err.message}`);
        return;
      }

      if (results.length > 0) {
        const userId = results[0].user_id;
        const currentWatchId = results[0].watch_id;

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
          [mac, time, hrp, temp, wear],
          (err, results) => {
            if (err) {
              console.error(`데이터 업데이트 에러: ${err.message}`);
              return;
            }
          }
        );

        // 5번 쿼리 실행 - 새로운 로직 추가
        if (currentWatchId !== mac) {
          // 기존 watch_id가 mac과 다를 때
          connection.query(query5_get, [mac], (err, results) => {
            if (err) {
              console.error(`쿼리 실행 에러: ${err.message}`);
              return;
            }

            if (results.length > 0) {
              const oldUserId = results[0].id;

              // 기존 사용자의 watch_id를 null로 업데이트
              connection.query(
                query5_update_old,
                [oldUserId],
                (err, results) => {
                  if (err) {
                    console.error(`데이터 업데이트 에러: ${err.message}`);
                    return;
                  }

                  // 새로운 사용자의 watch_id를 업데이트
                  connection.query(
                    query5_update_new,
                    [mac, id],
                    (err, results) => {
                      if (err) {
                        console.error(`데이터 업데이트 에러: ${err.message}`);
                        return;
                      }
                    }
                  );
                }
              );
            } else {
              // 새로운 사용자의 watch_id를 업데이트
              connection.query(query5_update_new, [mac, id], (err, results) => {
                if (err) {
                  console.error(`데이터 업데이트 에러: ${err.message}`);
                  return;
                }
              });
            }
          });
        }
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
