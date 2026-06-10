import { useEffect, useState } from "react";
import { onChildAdded, push, ref as databaseRef, set } from "firebase/database";
import { database, isFirebaseConfigured } from "../firebase";

const MESSAGES_FOLDER_NAME = "messages";

function formatDisplayTime(value) {
  if (!value) {
    return "";
  }

  const date = typeof value === "number" ? new Date(value) : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function Chat() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!isFirebaseConfigured || !database) {
      return undefined;
    }

    const messageListRef = databaseRef(database, MESSAGES_FOLDER_NAME);

    const unsubscribe = onChildAdded(messageListRef, (snapshot) => {
      const data = snapshot.val() || {};
      setMessages((prevState) => [
        ...prevState,
        {
          id: snapshot.key,
          text: data.text,
          createdAt: data.createdAt,
        },
      ]);
    });

    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, []);

  const writeData = async (event) => {
    event.preventDefault();
    const trimmed = inputValue.trim();

    if (!trimmed) {
      return;
    }

    if (!isFirebaseConfigured || !database) {
      setErrorMessage("Firebase is not configured. Cannot send message.");
      return;
    }

    const messageListRef = databaseRef(database, MESSAGES_FOLDER_NAME);
    const newMessageRef = push(messageListRef);

    try {
      await set(newMessageRef, {
        text: trimmed,
        createdAt: Date.now(),
      });
      setInputValue("");
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <section className="chat-page">
      <h2>Chat</h2>
      {!isFirebaseConfigured ? (
        <p className="text-muted">
          Configure Firebase in <code>.env</code> to connect this chat to the database.
        </p>
      ) : null}

      <div className="chat-log">
        {messages.length === 0
          ? "No messages yet. Say hi!"
          : messages.map((message) => (
              <article key={message.id} className="chat-message">
                <p>{message.text}</p>
                <time>{formatDisplayTime(message.createdAt)}</time>
              </article>
            ))}
      </div>

      <form onSubmit={writeData} className="chat-form">
        <input
          type="text"
          value={inputValue}
          placeholder="Type a message..."
          onChange={(event) => setInputValue(event.target.value)}
          disabled={!isFirebaseConfigured}
        />
        <button type="submit" disabled={!isFirebaseConfigured || !inputValue.trim()}>
          Send
        </button>
      </form>
      {errorMessage && <p className="text-danger">{errorMessage}</p>}
    </section>
  );
}

export default Chat;
