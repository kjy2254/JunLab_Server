var net = require('net');
const connection = require("./database/mysql");

var socketServer = net.createServer();
var commandServer = net.createServer();

var sockets = {};
const hello = Buffer.from([0x48, 0x65, 0x6c, 0x6c, 0x6f, 0x20, 0x73, 0x65, 0x72, 0x76, 0x65, 0x72, 0x3f, 0x0d, 0x0a]);

socketServer.listen(4322, () => {
    console.log('Socket server listening on 4322 ...');
})

commandServer.listen(4323, () => {
    console.log('Command server listening on 4323 ...');
})

commandServer.on('connection', (socket) => {
    socket.on('data', (data) => {
        if(data.toString().trim() === "devices"){
            socket.write("\r\nregistered devices: " + Object.keys(sockets).toString() + "\r\n");
        }
        else if(data.toString().trim().includes("/")){
            let commands = data.toString().trim().split('/');
            console.log("ID:", commands[0]);
            console.log("Command:", commands[1]);

            if(Object.keys(sockets).includes(commands[0])){
                sockets[commands[0]].write(commands[1]);
            }
            else{
                socket.write("\r\n" + commands[0] + "is not registered");
            }
        }
        else{
            socket.write("\r\nType this Command: \r\n - devices: Check registered devices \r\n - ID_?/[command]: Send command to ID_?\r\n");
        }
    })
})

socketServer.on('connection', (socket) => {
    socket.on('data', (rawData) => {
        let sensorData = rawData.toString().split(',');
        // 디바이스 켜짐 체크
        if(rawData.compare(hello) === 0){
            // 센서 데이터 1회 수신
            socket.write("sensorTA,1,1000");
            console.log('receive one packet');
        }

        if(sensorData.length === 21){
            if(Object.keys(sockets).includes("ID_"+sensorData[0])){
                if (save(rawData)) {
                    socket.write("Data save success" + "\r\n");
                } else {
                    socket.write("Something went wrong" + "\r\n");
                }
            }
            else{
                sockets = {...sockets, ["ID_"+sensorData[0]]:socket};
                socket.write("sensorTA,0,1000");
                socket.write("device"+sensorData[0]+" is registered");
            }
            console.log(sockets);
        }
    })

    socket.on('close', () => {
        console.log('disconnected');
    })
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