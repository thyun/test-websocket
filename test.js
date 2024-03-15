var str = '{"type":"CHAT","subChannelName":"1","data":{"id":10,"chatRoomId":1,"userId":1,"nickname":"aaa","profileImageUrl":"http://ogog.kr/aaa.jpeg","type":"NORMAL","message":"I like korea!","targetChat":null,"imageUrl":null,"status":"NORMAL","createdAt":[2024,3,15,23,30,59,818577000],"updatedAt":[2024,3,15,23,30,59,818577000]}}'
var jo = JSON.parse(str)
console.log(jo["type"])


//var http = require('http');
//
//http.createServer(function (req, res) {
//  res.writeHead(200, {'Content-Type': 'text/plain'});
//  res.end('Hello World!');
//}).listen(8080);

