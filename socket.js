var net = require('net');
const connection = require("./database/mysql");

var socketServer = net.createServer();
var commandServer = net.createServer();

var sockets = {};
var commandSocket = undefined;
var last_command = {};

function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

socketServer.listen(4322, () => {
    console.log('Socket server listening on 4322 ...');
})

commandServer.listen(4323, () => {
    console.log('Command server listening on 4323 ...');
})

commandServer.on('connection', (socket) => {
    commandSocket = socket;

    // 커맨드 서버 최초 연결시 안내 메시지
    socket.write("Welcome to Command Server\r\n" +
        "--------------------------------------------------------------------\r\n" +
        "Type this Command: \r\n " +
        "- Devices: Check registered devices \r\n " +
        "- ID_?/[command]: Send command to ID_?\r\n" +
        "--------------------------------------------------------------------\r\n");

    // 데이터 입력시
    socket.on('data', (data) => {

        // devices 명령어
        if (data.toString().trim().toLowerCase() === "devices") {
            socket.write("\r\nRegistered devices: [" + Object.keys(sockets).toString() + "]\r\n");
        }
        // ID/Command 명령어
        else if (data.toString().trim().includes("/")) {
            let commands = data.toString().trim().split('/');
            // console.log("ID:", commands[0]);
            // console.log("Command:", commands[1]);

            // 연결된 디바이스로의 명령일 경우
            if (Object.keys(sockets).includes(commands[0])) {
                sockets[commands[0]].write(commands[1]);
                last_command = {...last_command, [commands[0]]: commands[1]}
            }
            // 연결되지 않은 디바이스로의 명령일 경우
            else {
                socket.write("\r\n" + commands[0] + "is not registered\r\n");
            }
        }
        // 등록되지 않은 명령어
        else {
            socket.write("" +
                "--------------------------------------------------------------------\r\n" +
                "Type this Command: \r\n " +
                "- Devices: Check registered devices \r\n " +
                "- ID_?/[command]: Send command to ID_?\r\n" +
                "--------------------------------------------------------------------\r\n");
        }
    })

    // 연결 해제시
    socket.on('close', () => {
        console.log('command server disconnected');
    })
})

socketServer.on('connection', (socket) => {
    console.log(last_command);
    socket.on('data', (rawData) => {
        console.log(rawData.toString());
        // rawData 파싱
        let sensorData = rawData.toString().split(',');

        // !!! 업데이트 전 테스트
        // if(rawData.toString().trim().toLowerCase() === "hello server?"){
        //     socket.write("sensorTA,1,1000");
        // }

        // 최초 연결일 경우
        if (sensorData.length > 1 && sensorData[1].toString().includes("AP")) {

            // sokets에 ID 등록
            sockets = {...sockets, ["ID_" + sensorData[0]]: socket};

            // 이전 커맨드기록이 있을 경우
            if (Object.keys(last_command).includes("ID_" + sensorData[0])) {
                // console.log("last command: ", last_command["ID_" + sensorData[0]]);
                //해당 커맨드 실행
                socket.write(last_command["ID_" + sensorData[0]]);

            }
            // 커맨드 서버에 연결된 클라이언트가 있는 경우
            if (commandSocket != undefined) { // !! command 여러개일 경우 수정 필요
                // commandSocket.write("\r\n" + "ID_" + sensorData[0] + " is connected\r\n");
                // commandSocket.write("\r\nRegistered devices: [" + Object.keys(sockets).toString() + "]\r\n");
                if (Object.keys(last_command).includes("ID_" + sensorData[0])) {
                    commandSocket.write("\r\n" + "ID_" + sensorData[0] + " is reconnected\r\n");
                    commandSocket.write("\r\n" + "Run ID_" + sensorData[0] + "'s last command: " + last_command["ID_" + sensorData[0]] + "\r\n");
                }
                else{
                    commandSocket.write("\r\n" + "ID_" + sensorData[0] + " is connected\r\n");
                }
                commandSocket.write("\r\nRegistered devices: [" + Object.keys(sockets).toString() + "]\r\n");
            }
        }

        // 센서 데이터일 경우
        if (sensorData.length === 21) {
            if (save(rawData)) {
                socket.write("\r\nData save success" + "\r\n");
            } else {
                socket.write("\r\nSomething went wrong" + "\r\n");
            }
        }
    })

    socket.on('close', () => {
        if (commandSocket != undefined) {
            commandSocket.write("\r\n" + getKeyByValue(sockets, socket) + " is disconnected\r\n");
        }
        delete sockets[getKeyByValue(sockets, socket)];
    })

    socket.on('error', function (exc) {
        console.log("Update Connection");
        if (Object.keys(sockets).includes(last_command[0])) sockets[last_command[0]].write(last_command[1]);
    });
})

function save(rawData) {
    let keys = [
        'ID',
        'BATT',
        'magx',
        'MAGy',
        'MAGz',
        'ZYROx',
        'ZYROy',
        'ZYROz',
        'ACCx',
        'ACCy',
        'ACCz',
        'AQI',
        'TVOC',
        'EC2',
        'PM10',
        'PM25',
        'PM100',
        'IRUN',
        'RED',
        'ECG',
        'TEMP'];
    let values = rawData.toString().replaceAll(' ', '').split(',');

    if (values.length !== 21) {
        return false;
    } else {
        const dict = keys.reduce((acc, curr, idx) => {
            return {...acc, [curr]: values[idx]};
        }, new Object);

        let data = {...dict, "created_at": new Date(Date.now())};

        // console.log(data);

        connection.query("INSERT INTO SENSOR_DATA SET ?", data, (er) => {
            return !(er);
        });
    }
    return true;
}


module.exports = socketServer;