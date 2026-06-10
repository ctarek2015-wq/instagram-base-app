import { useState } from "react";

const INITIAL_MESSAGES = [
  { id: 1, text: "Welcome to the chat room." },
  { id: 2, text: "Share ideas or comment on posts here." },
];

function Chat() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = inputValue.trim();

    if (!trimmed) {
      return;
    }

    setMessages((prevMessages) => [
      ...prevMessages,
      { id: Date.now(), text: trimmed },
    ]);
    setInputValue("");
  };

  return (
    <section className="chat-page">
      <h2>Chat</h2>
      <div className="chat-log">
        {messages.map((message) => (
          <p key={message.id}>{message.text}</p>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          placeholder="Type a message..."
          onChange={(event) => setInputValue(event.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </section>
  );
}

export default Chat;
