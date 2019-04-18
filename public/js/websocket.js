/**
 * websocket方法
 * */
// wechat = new WebSocket("ws://localhost:3000");
//
// wechat.onopen = function () {
//     console.log("链接成功");
// };
//
// wechat.onmessage = function (obj) {
//     console.log(obj.data)
// };
//
// wechat.onclose = function () {
//     console.log("关闭链接");
// };

var socket = io("http://localhost:3000");
    socket.on("news",function (data) {
            var history = document.getElementById("history");
            history.innerText += data.my.data + "\r\n";
    });
function sendMessage() {
    console.log(socket);
    socket.emit("test",{data:document.getElementById('chat').value})
}