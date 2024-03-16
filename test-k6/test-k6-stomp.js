import stomp from 'k6/x/stomp';
import exec from 'k6/execution';

export default function () {
    // connect to broker
    var uid = exec.vu.idInTest
    const client = stomp.connect({
        addr: '192.168.10.100:8080/chat/100/ses${uid}/websocket?chatRoomId=1',
        timeout: '2s',
    });

    // // send a message to '/my/destination' with text/plain as MIME content-type
    // client.send('my/destination', 'text/plain', 'Hello xk6-stomp!');

    // const subscribeOpts = {
    //     ack: 'client' // client-individual or auto (default)
    // }
    // // subscribe to receive messages from 'my/destination' with the client ack mode
    // const subscription = client.subscribe('my/destination', subscribeOpts); 

    // // read the message
    // const msg = subscription.read();

    // // show the message as a string
    // console.log('msg', msg.string());
    
    // // ack the message
    // client.ack(msg);
    
    // // unsubscribe from destination
    // subscription.unsubscribe();
}

// export function teardown() {
//     // disconnect from broker
//     client.disconnect();
// }