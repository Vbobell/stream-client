import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import socketIOClient from "socket.io-client";

function App() {
  const [messages, setMesssages] = useState([]);
  const [user, setUser] = useState("");
  const [token, setToken] = useState("");
  const rest = axios.create({
    baseURL: "http://localhost:3333",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const socket = socketIOClient("http://localhost:3333");

  const inputUser = useRef(null);
  const inputPassword = useRef(null);
  const input = useRef(null);

  function sendMessage() {
    const { value } = input.current;

    socket.emit("send-message", {
      user,
      message: value,
      token,
    });
  }

  async function getToken() {
    const { value: email } = inputUser.current;
    const { value: password } = inputPassword.current;

    const { data } = await rest.post("/login", {
      email,
      password,
    });

    setUser(email);
    setToken(data);
  }

  useEffect(() => {
    function handler({ data }) {
      const msgs = data;

      if (msgs.length !== messages.length) {
        setMesssages(data);
      }
    }

    socket.on("send-message", handler);

    return () => {
      socket.off("send-message", handler);
    };
  }, [socket, messages]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Chat Example</h1>
      </header>
      {token === "" ? (
        <section className="App-form">
          <form onSubmit={getToken}>
            <div>
              <label>User</label>
              <input type="text" ref={inputUser} />
            </div>
            <div>
              <label>Password</label>
              <input type="password" ref={inputPassword} />
            </div>
            <div>
              <input type="button" onClick={getToken} value="Login" />
            </div>
          </form>
        </section>
      ) : (
        <section className="App-chat">
          <h2>Chat</h2>
          <article>
            {messages.map(({ message, user }, index) => (
              <p key={index}>
                <span>{user}:</span> {message}
              </p>
            ))}
          </article>
          <div className="content-message">
            <input type="text" ref={input} placeholder="Input message" />
            <input type="button" onClick={sendMessage} value="Enviar" />
          </div>
        </section>
      )}
    </div>
  );
}
export default App;
