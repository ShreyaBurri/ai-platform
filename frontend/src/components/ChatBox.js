import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { AI_API, BACKEND_API } from "../services/api";
import "./ChatBox.css";
import Sidebar from "./Sidebar";

function ChatBox() {

  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
 const [loadingChatId, setLoadingChatId] = useState(null);

  const chatEndRef = useRef(null);

  /* AUTO SCROLL */

  useEffect(() => {

    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });

  }, [chat, loadingChatId]);

  /* LOAD CHATS */

  useEffect(() => {

    fetchChats();

  }, []);

  /* LOAD MESSAGES WHEN CHAT CHANGES */

  useEffect(() => {

    if (currentChat) {
      fetchMessages(currentChat.id);
    }

  }, [currentChat]);

  /* FETCH ALL CHATS */

  const fetchChats = async () => {

    try {

      const response = await BACKEND_API.get("/chat/chats");

      setChats(response.data);

      if (response.data.length > 0) {

        setCurrentChat(response.data[0]);

      }

    } catch (error) {

      console.log(error);

    }

  };

  /* FETCH CHAT MESSAGES */

  const fetchMessages = async (chatId) => {

    try {

      const response = await BACKEND_API.get(
        `/chat/messages/${chatId}`
      );

      const formattedMessages = response.data.map((msg) => ({
        role: msg.role,
        text: msg.message,
        time: new Date(msg.created_at).toLocaleTimeString(
           [],
            {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            }
        ),
      }));

      /* IMPORTANT FIX */

      if (currentChat?.id === chatId || !currentChat) {
        setChat(formattedMessages);
      }

    } catch (error) {

      console.log(error);

    }

  };

  /* CREATE NEW CHAT */

  const createNewChat = async () => {

    try {

      const response = await BACKEND_API.post(
        "/chat/create-chat",
        {
          title: `New Chat ${chats.length + 1}`,
        }
      );

      const newChat = response.data;

      setChats((prev) => [newChat, ...prev]);

      setCurrentChat(newChat);

      setChat([]);

    } catch (error) {

      console.log(error);

    }

  };

  /* SEND MESSAGE */

  const sendMessage = async () => {

    if (!message.trim()) return;

    if (!currentChat) return;

    const activeChatId = currentChat.id;

    const currentMessage = message;

    setMessage("");

    setLoadingChatId(activeChatId);

    try {

      /* SAVE USER MESSAGE */

      await BACKEND_API.post("/chat/save-message", {
        chatId: activeChatId,
        role: "user",
        message: currentMessage,
      });

      /* REFRESH CURRENT CHAT */

      if (currentChat?.id === activeChatId) {
        await fetchMessages(activeChatId);
      }

      /* GET AI RESPONSE */

      const response = await AI_API.post("/chat", {
        message: currentMessage,
      });

      /* SAVE AI MESSAGE */

      await BACKEND_API.post("/chat/save-message", {
        chatId: activeChatId,
        role: "ai",
        message: response.data.response,
      });

      /* REFRESH ONLY ORIGINAL CHAT */

      if (currentChat?.id === activeChatId) {
        await fetchMessages(activeChatId);
      }

    } catch (error) {

      console.log(error);

    }

    setLoadingChatId(null);
  };

  /* ENTER KEY */

  const handleKeyPress = (e) => {

    if (e.key === "Enter") {
      sendMessage();
    }

  };

  const renameChat = async (
    chatId,
    newTitle
  ) => {

  try {

    await BACKEND_API.put(
      `/chat/rename-chat/${chatId}`,
      {
        title: newTitle,
      }
    );

    fetchChats();

  } catch (error) {

    console.log(error);

  }

};

const deleteChat = async (chatId) => {

  try {

    await BACKEND_API.delete(
      `/chat/delete-chat/${chatId}`
    );

    const updatedChats = chats.filter(
      (chat) => chat.id !== chatId
    );

    setChats(updatedChats);

    if (currentChat?.id === chatId) {

      if (updatedChats.length > 0) {

        setCurrentChat(updatedChats[0]);

      } else {

        setCurrentChat(null);

        setChat([]);

      }

    }

  } catch (error) {

    console.log(error);

  }

};

  return (

    <div className="app-container">

      <Sidebar
        chats={chats}
        currentChat={currentChat}
        setCurrentChat={setCurrentChat}
        createNewChat={createNewChat}
        renameChat={renameChat}
        deleteChat={deleteChat}
      />

      <div className="page">

        <div className="chat-wrapper">

          <div className="header">
            {currentChat
              ? currentChat.title
              : "AI Assistant"}
          </div>

          <div className="chat-container">

            {chat.length === 0 && (
              <div className="welcome-text">
                Ask me anything...
              </div>
            )}

            {chat.map((msg, index) => (

              <div
                key={index}
                className={
                  msg.role === "user"
                    ? "user-container"
                    : "ai-container"
                }
              >

                <div
                  className={
                    msg.role === "user"
                      ? "user-message"
                      : "ai-message"
                  }
                >

                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.text}
                  </ReactMarkdown>

                  <div className="message-time">
                    {msg.time}
                  </div>

                </div>

              </div>

            ))}

            {loadingChatId === currentChat?.id && (
            <div className="ai-container">
              <div className="ai-message">
                Thinking...
              </div>
            </div>
            )}

            <div ref={chatEndRef}></div>

          </div>

          <div className="input-container">

            <input
              type="text"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              className="chat-input"
            />

            <button
              onClick={sendMessage}
              className="send-button"
            >
              Send
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default ChatBox;

