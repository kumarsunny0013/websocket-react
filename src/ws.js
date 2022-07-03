import React, { useCallback, useEffect, useState } from "react";

//https://socketsbay.com/test-websockets
const apiCall2 = {
    event: 'bts:subscribe',
    data: { channel: 'live_trades_btcusd' },
};
const apiCall = {
    event: 'bts:subscribe',
    data: { channel: 'order_book_btcusd' },
};
let ws3 = null;
function Ws() {
    const [bids, setBids] = useState([0]);
    const [tradeAmount, setTradeAmount] = useState();
    const [message, setMessage] = useState("");
    const [messageRcv, setMessageRcv] = useState("");
    const [connectionState, setConnectionState] = useState("");

    useEffect(() => {
        const ws = new WebSocket('wss://ws.bitstamp.net');
        ws.onopen = (event) => {
            ws.send(JSON.stringify(apiCall));
        };
        ws.onmessage = function (event) {
            const json = JSON.parse(event.data);
            try {
                if ((json.event === 'data')) {
                    setBids(json.data.bids.slice(0, 5));
                }
            } catch (err) {
                console.log(err);
            }
        };
        //clean up function
        return () => ws.close();
    }, []);
    useEffect(() => {
        const ws = new WebSocket('wss://ws.bitstamp.net');
        ws.onopen = (event) => {
            ws.send(JSON.stringify(apiCall2));
        };
        ws.onmessage = function (event) {
            const json = JSON.parse(event.data);
            try {
                // if ((json.event == 'trade')) {
                setTradeAmount(json.data);
                // }
            } catch (err) {
                console.log(err);
            }
        };
        //clean up function
        return () => ws.close();
    }, []);
    // useEffect(() => {
    //     const ws = new WebSocket('wss://socketsbay.com/wss/v2/2/demo/');
    //     // ws.onopen = (event) => {
    //     //     ws.send("Hello From Sunny");
    //     // };
    //     ws.onmessage = function (event) {
    //         // const json = JSON.parse(event.data);
    //         try {
    //             // if ((json.event == 'trade')) {
    //                 // setTradeAmount(json.data);
    //                 console.log(event)
    //             // }
    //         } catch (err) {
    //             console.log(err);
    //         }
    //     };
    //     //clean up function
    //     return () => ws.close();
    // }, []);
    const firstBids = bids.map((item, index) => (
        <div key={index}>
            <p> {item}</p>
        </div>
    ));

    const openConnection = () => {
        if(ws3!=null)
        setConnectionState(ws3.readyState);
        ws3 = new WebSocket('wss://socketsbay.com/wss/v2/2/demo/'); 
        ws3.onopen(()=>setConnectionState(ws3.readyState));
        setConnectionState(ws3.readyState)
    
    };
    const closeConnection = () => {
        if(ws3==null || ws3.readyState===WebSocket.CLOSED){
            return alert("connection already closed");
        }
        setConnectionState(ws3.readyState);
        ws3.close();
        ws3.onclose(()=>setConnectionState(ws3.readyState));
        

    }

    const sendMsg = useCallback(() => {
        if(ws3===null || ws3.readyState===WebSocket.CLOSED){
            return alert("please open a connection first");
        }
        if(message==="")
        return alert("type a message to send");
        ws3.send(message);
        setMessage("");
    }
        );
    // useEffect(() => {
        if(ws3!=null){
        ws3.onmessage = (event) => {
            console.log(event.data);
            setMessageRcv(event.data);
        }}
    // },[])

    // console.log(messageRcv)
    return <div>
        {firstBids}
        <p>Amount: {tradeAmount?.amount}</p>
        <p>Price: {tradeAmount?.price}</p>
        <p>{connectionState}</p>
        <button onClick={openConnection}>open connection</button>
        <button onClick={closeConnection}>close connection</button>
        <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
        <button onClick={sendMsg}>Cleck to send hi</button>
        <h4> {messageRcv}</h4>
    </div>;
}

export default Ws;