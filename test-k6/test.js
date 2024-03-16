import ws from "k6/ws";

export default function () {
    var uid = '1'
    const url = "ws://192.168.10.100:8080/chat/100/ses${uid}/websocket?chatRoomId=1"; // WebSocket 서버 URL
    const params = { tags: { my_tag: "hello" } };

    const response = ws.connect(url, params, function (socket) {
        socket.on("open", function open() {
            console.log("WebSocket 연결이 열렸습니다.");

            // STOMP 연결을 초기화합니다.
            socket.send('CONNECT\n\n\0');

            // 서버로부터 메시지를 수신합니다.
            socket.on("message", function (message) {
                console.log(`서버로부터 메시지를 받았습니다: ${message}`);
            });

            // // 예제로 메시지를 보내보겠습니다.
            // const message = {
            //     body: "Hello, STOMP Server!"
            // };
            // socket.send(`SEND\n\n${JSON.stringify(message)}\0`);
        });

        socket.on("close", function () {
            console.log("WebSocket 연결이 닫혔습니다.");
        });
    });

    // 연결 결과를 확인합니다.
    if (response && response.error) {
        console.error(response.error);
    }
}
