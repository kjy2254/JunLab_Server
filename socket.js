var net = require("net");
const connection = require("./database/mysql");
const connection2 = require("./database/apiConnection");
var ws = require("ws");

var socketServer = net.createServer();
var commandServer = net.createServer();
const wsServer = new ws.WebSocketServer({ port: 881 });

var sockets = {};
var commandSocket = [];
var last_command = {};

var sensorTime = "7000";
const wsIntervalMap = new Map(); // WebSocket 인터벌 맵

const sleep = (second) => new Promise((resolve) => setTimeout(resolve, second));

function getKeyByValue(object, value) {
  return Object.keys(object).find((key) => object[key] === value);
}

setInterval(() => {
  if (sockets != {}) {
    Object.keys(sockets).forEach((key) => {
      if (new Date() - sockets[key].last_time > parseInt(sensorTime) * 2) {
        sockets[key].write("sensorTA,1," + sensorTime + "\r\n");
        console.log("server send sensorTA,1," + sensorTime + "\r\n");
      }
    });
  }
}, parseInt(sensorTime) * 2);

socketServer.listen(4322, () => {
  console.log("Socket server listening on 4322 ...");
});

commandServer.listen(4323, () => {
  console.log("Command server listening on 4323 ...");
});

commandServer.on("connection", (socket) => {
  commandSocket.push(socket);

  // 커맨드 서버 최초 연결시 안내 메시지
  socket.write(
    "Welcome to Command Server\r\n" +
      "--------------------------------------------------------------------\r\n" +
      "Type this Command: \r\n" +
      "- Devices: Check registered devices \r\n" +
      "- ID_?/[command]: Send command to ID_?\r\n" +
      "- SensorTime/[time]: Set Default SensorTime to [time]\r\n" +
      "--------------------------------------------------------------------\r\n"
  );

  // 데이터 입력시
  socket.on("data", (data) => {
    console.log("Command:", data.toString());

    // devices 명령어
    if (data.toString().trim().toLowerCase() === "devices") {
      socket.write(
        "\r\nRegistered devices: [" + Object.keys(sockets).toString() + "]\r\n"
      );
    }
    // ID/Command 명령어
    else if (data.toString().trim().includes("ID")) {
      let commands = data.toString().trim().split("/");
      // console.log("ID:", commands[0]);
      // console.log("Command:", commands[1]);

      // 연결된 디바이스로의 명령일 경우
      if (Object.keys(sockets).includes(commands[0])) {
        sockets[commands[0]].write(commands[1] + "\r\n");
        // sockets[commands[0]].write(commands[1]);
        last_command = { ...last_command, [commands[0]]: commands[1] };
        console.log(last_command);
      }
      // 연결되지 않은 디바이스로의 명령일 경우
      else {
        socket.write("\r\n" + commands[0] + "is not registered\r\n");
      }
    } else if (data.toString().trim().toLowerCase().includes("time")) {
      sensorTime = data
        .toString()
        .trim()
        .split("/")[1]
        .replace("[", "")
        .replace("]", "");
      socket.write("default sensorTime changed:" + sensorTime);
      if (sockets != {}) {
        Object.keys(sockets).forEach((key) => {
          sockets[key].write("sensorTA,1," + sensorTime + "\r\n");
        });
      }
      console.log("server send sensorTA,1," + sensorTime + "\r\n");
    }
    // 등록되지 않은 명령어
    else {
      socket.write(
        "" +
          "--------------------------------------------------------------------\r\n" +
          "Type this Command: \r\n" +
          "- Devices: Check registered devices \r\n" +
          "- ID_?/[command]: Send command to ID_?\r\n" +
          "- SensorTime/[time]: Set Default SensorTime to [time]\r\n" +
          "--------------------------------------------------------------------\r\n"
      );
    }
  });

  // 연결 해제시
  socket.on("close", () => {
    commandSocket = commandSocket.filter((e) => e !== socket);
    // console.log('command server disconnected:', commandSocket) ;
  });
});

socketServer.on("connection", (socket) => {
  let count = 0;
  socket.last_time = new Date();

  console.log("new connection:", socket.last_time);

  socket.on("data", (rawData) => {
    socket.last_time = new Date();

    console.log("[" + String(count).padStart(4, " ") + "]", rawData.toString());
    // rawData 파싱
    let sensorData = rawData.toString().split(",");

    // 최초 연결일 경우
    if (
      sensorData.length > 1 &&
      sensorData[1].toString().includes("Connected AP")
    ) {
      if (
        Object.keys(sockets).includes("ID_" + sensorData[0]) &&
        sockets["ID_" + sensorData[0]] !== socket
      ) {
        console.log("execute destroy");
        sockets["ID_" + sensorData[0]].destroy();
      }

      // sokets에 ID 등록
      sockets = { ...sockets, ["ID_" + sensorData[0]]: socket };

      // 커맨드 서버에 연결된 클라이언트가 있는 경우
      if (commandSocket.length !== 0) {
        commandSocket.forEach((e) => {
          e.write("\r\n" + "ID_" + sensorData[0] + " is connected\r\n");
          e.write(
            "\r\nRegistered devices: [" +
              Object.keys(sockets).toString() +
              "]\r\n"
          );
        });
        if (Object.keys(last_command).includes("ID_" + sensorData[0])) {
          commandSocket.forEach((e) => {
            e.write(
              "\r\n" +
                "ID_" +
                sensorData[0] +
                "'s last command: " +
                last_command["ID_" + sensorData[0]] +
                "\r\n"
            );
          });
        } else {
          commandSocket.forEach((e) => {
            e.write("\r\n" + "ID_" + sensorData[0] + " is connected\r\n");
          });
        }
        commandSocket.forEach((e) => {
          e.write(
            "\r\nRegistered devices: [" +
              Object.keys(sockets).toString() +
              "]\r\n"
          );
        });
      }
    }

    // 센서 데이터일 경우
    if (sensorData.length === 21) {
      save(rawData);
      if (parseInt(sensorData[0]) > 2000 || parseInt(sensorData[0]) < 1000) {
        save2(rawData); // 2000번대 -> 고정식 데이터 (0번대도 같이 존재 중)
      } else if (parseInt(sensorData[0]) > 1000) {
        saveWatchData(rawData); // 1000번대 -> 시계 데이터
      }
      count++;
    }
  });

  socket.on("close", () => {
    if (commandSocket.length !== 0) {
      commandSocket.forEach((e) => {
        e.write(
          "\r\n" + getKeyByValue(sockets, socket) + " is disconnected\r\n"
        );
      });
    }
    delete sockets[getKeyByValue(sockets, socket)];
  });

  socket.on("error", (e) => {
    console.log("Update Connection");
    if (Object.keys(sockets).includes(last_command[0]))
      sockets[last_command[0]].write(last_command[1]);
  });
});

function save(rawData) {
  let keys = [
    "ID",
    "BATT",
    "magx",
    "MAGy",
    "MAGz",
    "ZYROx",
    "ZYROy",
    "ZYROz",
    "ACCx",
    "ACCy",
    "ACCz",
    "AQI",
    "TVOC",
    "EC2",
    "PM10",
    "PM25",
    "PM100",
    "IRUN",
    "RED",
    "ECG",
    "TEMP",
  ];
  let values = rawData.toString().replaceAll(" ", "").split(",");

  if (values.length !== 21) {
    console.log("not sensor data");
    return false;
  } else {
    const dict = keys.reduce((acc, curr, idx) => {
      return { ...acc, [curr]: values[idx] };
    }, new Object());

    let data = { ...dict, created_at: new Date(Date.now()) };

    // console.log(data);

    if (isNaN(parseInt(data.ID))) {
      return false;
    }

    connection.query("INSERT INTO SENSOR_DATA SET ?", data, (er) => {
      return !er;
    });
  }
  return true;
}

function save2(rawData) {
  let values = rawData.toString().replaceAll(" ", "").split(",");

  if (values.length !== 21) {
    return false;
  } else {
    if (isNaN(parseInt(values[0]))) {
      return false;
    }

    connection2.query(
      "SELECT factory_id FROM sensor_modules WHERE module_id = ?",
      parseInt(values[0]),
      (error, result) => {
        if (error) {
          console.log(error);
        }
        // console.log("factoryID:", result[0].factory_id);
        if (result.length === 0) {
          console.log("not registered module");
          return false;
        }
        const insert_query = `INSERT INTO sensor_data (factory_id,
                                          tvoc,
                                          co2,
                                          temperature,
                                          pm1_0,
                                          pm2_5,
                                          pm10,
                                          timestamp,
                                          sensor_module_id) VALUES (?,?,?,?,?,?,?,?,?)`;

        const insert_value = [
          result[0].factory_id,
          values[12],
          values[13],
          values[20],
          values[14],
          values[15],
          values[16],
          new Date(Date.now()),
          parseInt(values[0]),
        ];

        connection2.query(insert_query, insert_value, (error, result) => {
          if (error) {
            console.log(error);
          }
        });
      }
    );

    connection2.query(
      `update sensor_modules set last_update = ?, last_tvoc = ?, last_co2 = ?, last_temperature = ?, last_pm1_0 = ?, last_pm2_5 = ?, last_pm10 = ? where module_id = ?`,
      [
        new Date(Date.now()),
        parseInt(values[12]),
        parseInt(values[13]),
        parseFloat(values[20]),
        parseInt(values[14]),
        parseInt(values[15]),
        parseInt(values[16]),
        parseInt(values[0]),
      ],
      (error, result) => {
        if (error) {
          console.log(error);
        }
      }
    );
  }
  return true;
}

function saveWatchData(rawData) {
  let values = rawData
    .toString()
    .replaceAll(" ", "")
    .replaceAll("\\r\\n", "")
    .split(",");

  if (values.length !== 21) {
    return false;
  } else {
    if (isNaN(parseInt(values[0]))) {
      return false;
    }

    connection2.query(
      `SELECT u.user_id, w.last_heart_rate, w.last_oxygen_saturation 
      FROM watches w
      LEFT JOIN users u ON w.watch_id = u.watch_id
      WHERE w.watch_id = ?`,
      values[0],
      (error, result) => {
        if (error) {
          console.log(error);
        }

        // if(result.length != 0){

        // }

        const user_id = result[0].user_id;
        const lastHeartRate = result[0].last_heart_rate; // 이전 last_heart_rate 값
        const lastOxygen = result[0].last_oxygen_saturation;
        const timestamp = new Date(Date.now());

        const insert_query1 = `INSERT INTO watch_data (
          heart_rate,
          body_temperature,
          battery_level,
          tvoc,
          co2,
          device_id,
          user_id,
          oxygen_saturation,
          timestamp) VALUES (?,?,?,?,?,?,?,?,?)`;

        const insert_value1 = [
          values[18], // heart_rate
          values[20], // body_temperature
          values[1], // battery_level
          values[12], // tvoc
          values[13], // co2
          values[0], // device_id
          user_id, // user_id
          values[17],
          timestamp,
        ];

        connection2.query(insert_query1, insert_value1, (error) => {
          if (error) {
            console.log(error);
          }
        });

        // Check if 'ING' is present in values[18]
        const ingPresent_RED = values[18].includes("ING");
        const ingPresent_IRUN = values[17].includes("ING");

        // Prepare the data for the second query
        const insert_value2 = [
          timestamp,
          ingPresent_RED ? lastHeartRate : values[18], // If 'ING' is present, set lastHeartRate; otherwise, set values[18]
          ingPresent_IRUN ? lastOxygen : values[17],
          values[20],
          values[1],
          values[12],
          values[13],
          values[0],
        ];

        const insert_query2 = `UPDATE watches SET
          last_sync = ?,
          last_heart_rate = ?,
          last_oxygen_saturation = ?,
          last_body_temperature = ?,
          last_battery_level = ?,
          last_tvoc = ?,
          last_co2 = ?
          WHERE watch_id = ?`;

        connection2.query(insert_query2, insert_value2, (error, result) => {
          if (error) {
            console.log(error);
          }
        });
      }
    );
  }
  return true;
}

wsServer.on("connection", (ws, req) => {
  // 웹소켓 연결 시
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  console.log("새로운 클라이언트 접속", ip);
  ws.on("message", (message) => {
    // 클라이언트로부터 메시지
    console.log("message:", message.toString());
  });
  ws.on("error", (error) => {
    // 에러 시
    console.error(error);
  });
  ws.on("close", () => {
    // 연결 종료 시
    console.log("클라이언트 접속 해제", ip);
    clearInterval(ws.interval);
    wsIntervalMap.delete(ws); // 맵에서 제거
  });

  let query = `SELECT
    sd.ID,
        sd.BATT,
        sd.AQI,
        sd.TVOC,
        sd.EC2,
        sd.PM10,
        sd.PM25,
        sd.PM100,
        sd.IRUN,
        sd.TEMP,
        DATE_FORMAT(sd.created_at, '%Y/%m/%d %H:%i:%s') AS CREATED_AT
    FROM SENSOR_DATA sd
    INNER JOIN (
        SELECT
    ID,
        MAX(created_at) AS max_created_at
    FROM SENSOR_DATA
    GROUP BY ID
) max_data
    ON sd.ID = max_data.ID AND sd.created_at = max_data.max_created_at;`;

  const wsInterval = setInterval(() => {
    if (ws.readyState === ws.OPEN) {
      connection.query(query, (error, result) => {
        if (error) {
          console.log(error);
        }
        result.forEach((e) => ws.send(JSON.stringify(e)));
      });
    }
  }, 1000);

  wsIntervalMap.set(ws, wsInterval); // WebSocket과 해당 인터벌을 맵에 추가
});
