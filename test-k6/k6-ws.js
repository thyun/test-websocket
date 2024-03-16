import ws from 'k6/ws';
import { check } from 'k6';
import exec from 'k6/execution';

export const options = {
    stages: [
        { duration: '40s', target: 5000 }, // below normal load
        { duration: '1m', target: 0 }, // scale down. Recovery stage.
    ],
};


export default function () {
  var uid = exec.vu.idInTest
  const url = `ws://192.168.10.101:8080/chat/100/ses${uid}/websocket?chatRoomId=1`;
  //const url = 'ws://192.168.10.100:8080/chat/100/ses1/websocket?chatRoomId=1';
  const params = { tags: { my_tag: 'hello' } };

  // STOMP 프로토콜에 따라 필요한 커맨드 정의
  const connectFrame = `["CONNECT\\naccept-version:1.1,1.0\\nheart-beat:10000,10000\\n\\n\\u0000"]`
  const subscribeFrame = `["SUBSCRIBE\\nid:user${uid}\\ndestination:/sub/1\\n\\n\\u0000"]`;
  const messageFrame = "SEND\ndestination:/topic/your_topic\n\n{\"message\":\"Hello STOMP Server\"}\x00";
  const disconnectFrame = "DISCONNECT\n\n\x00";

  const res = ws.connect(url, params, function (socket) {
    socket.on('open', function open() {
      console.log(`Connected: ${uid}`);

	    // STOMP 연결
      socket.send(connectFrame);

      // STOMP 구독
      socket.send(subscribeFrame);
    });

    socket.on("message", function (message) {
      console.log(`message user ${uid}: ${message}`);
    });

    socket.on('error', function (e) {
      if (e.error() != 'websocket: close sent') {
        console.log('An unexpected error occured: ', e.error());
      }
    });
  });

  check(res, { 'status is 101': (r) => r && r.status === 101 });
}

function showContext() {
  console.log(`Execution context

  Instance info
  -------------
  Vus active: ${exec.instance.vusActive}
  Iterations completed: ${exec.instance.iterationsCompleted}
  Iterations interrupted:  ${exec.instance.iterationsInterrupted}
  Iterations completed:  ${exec.instance.iterationsCompleted}
  Iterations active:  ${exec.instance.vusActive}
  Initialized vus:  ${exec.instance.vusInitialized}
  Time passed from start of run(ms):  ${exec.instance.currentTestRunDuration}

  Scenario info
  -------------
  Name of the running scenario: ${exec.scenario.name}
  Executor type: ${exec.scenario.executor}
  Scenario start timestamp: ${exec.scenario.startTime}
  Percenatage complete: ${exec.scenario.progress}
  Iteration in instance: ${exec.scenario.iterationInInstance}
  Iteration in test: ${exec.scenario.iterationInTest}

  Test info
  ---------
  All test options: ${exec.test.options}

  VU info
  -------
  Iteration id: ${exec.vu.iterationInInstance}
  Iteration in scenario: ${exec.vu.iterationInScenario}
  VU ID in instance: ${exec.vu.idInInstance}
  VU ID in test: ${exec.vu.idInTest}
  VU tags: ${exec.vu.tags}`);
}
