const ws = new WebSocket("ws://141.223.198.28:881");

var content = document.getElementById('content');

function sayHi() {
    content.append('test\n');
    ws.send("Hello");
}