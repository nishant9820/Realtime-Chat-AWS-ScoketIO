import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import "./App.css";

// Connect to the Socket.IO server
const socket = io("http://<EC2_PUBLIC_IP>:4000");

function App() {
  const [message, setMessage] = useState("");
  const [userName, setUserName] = useState(""); // State for user name
  const [chat, setChat] = useState([]);

  useEffect(() => {
    // Listen for incoming messages from the server
    socket.on("message", (data) => {
      setChat((prevChat) => [...prevChat, data]);
    });

    return () => {
      socket.off("message");
    };
  }, []);

  // Function to send message to server
  const sendMessage = () => {
    if (message !== "" && userName !== "") {
      // Emit message with the username and message
      socket.emit("message", { userName, message });
      setMessage("");
    }
  };

  return (
    <div className="App">
      <h1>Real-Time Chat</h1>
      <div className="chat-box">
        {chat.map((data, idx) => (
          <div key={idx} className="chat-message">
            <div className="message-content">
              {/* Display the username and the message */}
              <p>
                <strong>{data.userName}:</strong> {data.message}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Enter your name"
        />
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;
