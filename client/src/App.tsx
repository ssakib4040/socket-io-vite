import React, { useEffect, useState } from "react";
import "./App.css";

import { io } from "socket.io-client";
const socket = io("http://localhost:3000");

export default function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { id: 1, message: "message 1" },
    { id: 2, message: "message 2" },
  ]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    socket.on("connect", () => {});

    socket.on("message", (data) => {
      console.log(data);
    });

    socket.on("message:server-to-client", (data) => {
      console.log(data);
      setMessages([...messages, { id: messages.length + 1, message: data }]);
    });

    socket.on("disconnect", () => {
      console.log("socket disconnected");
    });
  }, [messages]);

  const handleMessage = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (!message) return;

    setMessages([
      ...messages,
      {
        id: messages.length + 1,
        message: message,
      },
    ]);

    socket.emit("message:client-to-server", message);
    setMessage("");
  };

  return (
    <div className="main">
      <div className="container">
        <div className="chat">
          {messages.map((message, index) => (
            <div className="message" key={index}>
              {message.message}
            </div>
          ))}
        </div>
        <form className="input-container" onSubmit={handleMessage}>
          <input
            type="text"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
}
