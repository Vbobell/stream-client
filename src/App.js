import React, { useState, useRef, useEffect } from "react";
import socketIOClient from "socket.io-client";

function App() {
  const [messages, setMesssages] = useState([]);
  const socket = socketIOClient("http://localhost:3333");

  const inputUser = useRef(null);
  const inputPassword = useRef(null);
  const input = useRef(null);

  function sendMessage() {
    const { value: user } = inputUser.current;
    const { value: password } = inputPassword.current;
    const { value } = input.current;

    socket.emit("send-message", {
      user,
      message: value,
      token: `${user}&${password}`,
    });
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
      <header className="App-header">Chat</header>
      <section>
        <form>
          <div>
            <label>Usuário</label>
            <input type="text" ref={inputUser} />
          </div>
          <div>
            <label>Senha</label>
            <input type="password" ref={inputPassword} />
          </div>
          <input type="text" ref={input} placeholder="Insira sua mensagem" />
          <input type="button" onClick={sendMessage} value="Enviar" />
        </form>
      </section>
      <section>
        <h2>Chat</h2>
        {messages.map(({ message, user }, index) => (
          <article key={index}>
            <p>
              {user}: {message}
            </p>
          </article>
        ))}
      </section>
    </div>
  );
}
export default App;
