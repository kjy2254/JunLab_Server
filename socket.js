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

socketServer.on('connection', (socket) => {
    console.log(socket.address().address + " connected");

    // 디바이스 켜짐 체크
    if(rawData.compare(hello)){
        // 센서 데이터 1회 수신
        socket.write("sensorTA,1,10000");
        socket.write("sensorTA,0,10000");
    }

    socket.on('data', (rawData) => {
        let sensorData = rawData.toString().split(',');

        console.log(rawData.toString());
        if (save(rawData)) {
            socket.write("Data Save Successful" + "\r\n");
        } else {
            socket.write("Invalid Data testsetsetstse" + "\r\n");
        }
    })

    if(sensorData.length == 21){
        sockets = {...sockets, ["ID_"+sensorData[0]]:socket};

    }


    console.log(sockets);

    socket.on('close', () => {
        console.log('disconnected');
    })



    
})

function save(rawData) {
    console.log("received data:", rawData.toString());
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
            if(er){
                return false;
            }
            else{
                 return true;
            }
        });
    }
    return true;
}


module.exports = socketServer;