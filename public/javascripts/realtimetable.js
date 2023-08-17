
const webSocket = new WebSocket("ws://junlab.postech.ac.kr:881");
const sleep = second => new Promise(resolve => setTimeout(resolve, second));
const data_structure = [
    "ID",
    "BATT",
    "AQI",
    "PM10",
    "PM25",
    "PM100",
    "TVOC",
    "EC2",
    "IRUN",
    "TEMP",
    "CREATED_AT"
];

webSocket.onopen = function () {
    console.log('서버와 웹소켓 연결 성공!');
};
webSocket.onmessage = (event) => {
    // console.log(event.data);
    let data = JSON.parse(event.data);
    let card = document.getElementById("card_" + data.ID.toString());
    let spans = card.getElementsByTagName("span");

    // Check if CREATED_AT has changed
    if (card.dataset.lastUpdatedAt !== data[data_structure[10]]) {
        card.dataset.lastUpdatedAt = data[data_structure[10]];

        // Compare current values with new values and add blinking class to changed elements
        for (let i = 0; i < spans.length; i++) {
            if (spans[i].innerText !== data[data_structure[i]].toString()) {
                // console.log(spans[i].innerText, data[data_structure[i]].toString());
                spans[i].classList.add("blinking");
            }
        }

        // Remove blinking class after a delay
        setTimeout(() => {
            for (let i = 0; i < spans.length; i++) {
                spans[i].classList.remove("blinking");
            }
        }, 400);
    }

    updateCardContents(card, data);
};

function updateCardContents(card, data) {
    let spans = card.getElementsByTagName("span");
    for (let i = 0; i < spans.length; i++) {
        spans[i].innerHTML = data[data_structure[i]];
    }
}

