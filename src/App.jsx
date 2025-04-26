import ChatForm from "./components/ChatForm";
import FuriaIcon from "./components/FuriaIcon";
import ChatMessage from "./components/ChatMessage";
import { useRef, useState, useEffect } from "react";

const App = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const chatBodyRef = useRef();

  const generateBotResponse = async (history) => {
    const updateHistory = (text) => {
      setChatHistory((prev) => [
        ...prev.filter((msg) => msg.text !== "Pensando..."),
        { role: "model", text },
      ]);
    };

    history = history.map(({ role, text }) => ({ role, parts: [{ text }] }));

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: history }),
    };

    try {
      const response = await fetch(
        import.meta.env.VITE_API_URL,
        requestOptions
      );
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error.message || "algo deu errado");

      const apiReponseText = data.candidates[0].content.parts[0].text
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .trim();
      updateHistory(apiReponseText);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    chatBodyRef.current.scrollTo({
      top: chatBodyRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [chatHistory]);

  return (
    <div className="container">
      <div className="chat-popup">
        {/* chat header */}
        <div className="chat-header">
          <div className="header-info">
            <FuriaIcon />
            <h2 className="logo-text">
              <strong>Furiabot</strong>
            </h2>
          </div>
        </div>
        {/*chat body */}
        <div ref={chatBodyRef} className="chat-body">
          <div className="message bot-message">
            <FuriaIcon />
            <div className="message-text">
              <p>Olá! Eu sou o Furiabot. Como posso ajudar?</p>
            </div>
          </div>

          {/*histórico de bate-papo */}
          {chatHistory.map((chat, index) => (
            <ChatMessage key={index} chat={chat} />
          ))}
        </div>

        {/* chat footer */}
        <div className="chat-footer">
          <ChatForm
            chatHistory={chatHistory}
            setChatHistory={setChatHistory}
            generateBotResponse={generateBotResponse}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
