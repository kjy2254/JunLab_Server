const connection = require("../database/mysql");
const { predictWorkLoadByUserId } = require("../model/model");

const userList = [];

test_data["tvoc"] = test_data["tvoc"] / 1000 / 0.6;
test_data["co2"] = test_data["co2"] / 825;
test_data["heart_rate"] = test_data["heart_rate"] / 80;
test_data["Temperature"] = test_data["Temperature"] / 36.5;

const getUsers = () => {
  return new Promise((resolve, reject) => {
    const query = `SELECT user_id FROM users;`;

    connection.query(query, (error, results) => {
      if (error) {
        console.error("DB 조회 실패:", error);
        reject(error);
        return;
      }

      userList.length = 0; // 기존 배열 초기화
      results.forEach((row) => {
        userList.push(row.user_id);
      });

      resolve();
    });
  });
};

setInterval(async () => {
  try {
    await getUsers();
    // console.log("userList:", userList);

    userList.forEach((userId) => {
      saveWorkLoad(userId);
    });
  } catch (error) {
    console.error("Error updating user list:", error);
  }
}, 20000);

async function saveWorkLoad(id) {
  //   console.log("saveWorkload:", id);
  const userId = parseInt(id);
  const work_load = await predictWorkLoadByUserId(userId);

  const query1 = `INSERT INTO workload_data(user_id, value, timestamp) 
                 VALUE(?,?,NOW());`;

  const query2 = `UPDATE users SET last_workload = ?
                 WHERE user_id = ?;`;

  connection.query(
    query1 + query2,
    [userId, work_load, work_load, userId],
    (error, results) => {
      if (error) {
        console.error("DB 업데이트 실패:", error);
        return;
      }

      // userList 업데이트
      userList.length = 0; // 기존 배열 초기화
      results.forEach((row) => {
        userList.push(row.user_id);
      });
    }
  );
}
