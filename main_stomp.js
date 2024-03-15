var SockJS = require('sockjs-client');
var stomp = require('@stomp/stompjs');
var timers = require('timers');
var http = require('http');

var time = {}; 

//if (process.argv.length != 3) {
//	throw new Error("Expected Processor Identifier");  
//} 

var username = 'aaa'
//var username = process.argv[2];
// console.log("Running under username: ", username);  

// An object of options to indicate where to post to
var post_options = {
  host: 'localhost',
  port: '8080',
  path: '/spring-websocket-performance-endpoint/login',
  method: 'GET',
  headers: {
      'Content-Type': 'application/json',
      'Content-Length': 0,
      'username': username, 
      'password': username
  }
};


// 1일때만 동작, 2일때 에러
const numConnections = 1;
var stompClient = null;
var stompClientList = [];
var chatCount = 0;

function connect(username) {
	var url = "http://localhost:8080/chat?chatRoomId=1";
    //var socket = new SockJS('/chat');
    stompClient = stomp.Stomp.over(function() {
		return new SockJS(url);
	});
	stompClient.debug = () => {};
	stompClient.reconnect_delay = 5000;
	stompClient.username = username

    stompClient.connect("guest", "guest",
			function(frame) {
				setConnected(true);
				console.log('Connected: ' + stompClient.username)
				// console.log('Connected: ' + frame);
				stompClient.subscribe('/sub/1', function(messageOutput) {
					showMessageOutput(stompClient, JSON.parse(messageOutput.body));
				});
			},
			function(error) {
				console.log("Connect errorCallback: " + error)
			},
			function(closeEvent) {
				console.log("Connect closeEventCallback: " + closeEvent)
			}
	);
	return stompClient
}

// Create multiple connections
for (let i = 0; i < numConnections; i++) {
	username = 'user ' + i
    stompClientList.push(connect(username));
}



function setConnected(connected) {
	//    document.getElementById('connect').disabled = connected;
	//    document.getElementById('disconnect').disabled = !connected;
	//    document.getElementById('conversationDiv').style.visibility = connected ? 'visible' : 'hidden';
	//    //document.getElementById('response').innerHTML = '';
}

function disconnect() {
    if(stompClient != null) {
        stompClient.disconnect();
    }

    setConnected(false);
    console.log("Disconnected");
}

// TODO REST POST로 변경 필요
function sendMessage() {
	var from = document.getElementById('from').value;
    var text = document.getElementById('text').value;
    stompClient.send("/api/1.0/chat_room/1/chat", {}, JSON.stringify({'userId':1, 'nickname':'홍길동', 'profileImageUrl':'https://ogog.kr/aaaa.jpeg',
		'type': 'NORMAL',
		'message':text}));
}

function showMessageOutput(stompClient, messageOutput) {
      console.log(stompClient.username + ': ' + JSON.stringify(messageOutput))
//    var response = document.getElementById('response');
//    var p = document.createElement('p');
//    p.style.wordWrap = 'break-word';
//	p.appendChild(document.createTextNode(JSON.stringify(messageOutput)))
//    //p.appendChild(document.createTextNode(messageOutput.chat.id + ": " + messageOutput.chat.message + " (" + messageOutput.chat.createdAt + ")"));
//    response.appendChild(p);
}

