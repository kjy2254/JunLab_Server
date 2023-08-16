const webSocket = new WebSocket("ws://junlab.postech.ac.kr:881");
const sleep = second => new Promise(resolve => setTimeout(resolve, second));
const data_structure = [
    "ID",
    "BATT",
    "MAGx",
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
    "CREATED_AT"
];

webSocket.onopen = function () {
    console.log('서버와 웹소켓 연결 성공!');
};
webSocket.onmessage = (event) => {
    let data = JSON.parse(event.data);
    let tr = document.getElementById("id_" + data.ID.toString());
    let tds = tr.getElementsByTagName("td");

    if(tds[21].innerText !== data[data_structure[21]]){
        tr.className = "blinking";
        sleep(400).then(() => tr.className = "");
    }

    for (let i = 1; i < tds.length; i++) {
        tds[i].innerHTML = data[data_structure[i]];
    }

};