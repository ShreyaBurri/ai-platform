import { useState } from "react";

function Sidebar({
  chats,
  currentChat,
  setCurrentChat,
  createNewChat,
  renameChat,
  deleteChat,
}) {

  const [editingChatId, setEditingChatId] = useState(null);

  const [editedTitle, setEditedTitle] = useState("");

  const startEditing = (chat) => {

    setEditingChatId(chat.id);

    setEditedTitle(chat.title);

  };

  const saveEdit = async (chatId) => {

    if (!editedTitle.trim()) return;

    await renameChat(chatId, editedTitle);

    setEditingChatId(null);

  };

  return (

    <div className="sidebar">

      <button
        className="new-chat-btn"
        onClick={createNewChat}
      >
        + New Chat
      </button>

      <div className="chat-list">

        {chats.map((chat) => (

          <div
            key={chat.id}
            className={
              currentChat?.id === chat.id
                ? "chat-item active-chat"
                : "chat-item"
            }
          >

            {editingChatId === chat.id ? (

              <input
                className="edit-input"
                value={editedTitle}
                onChange={(e) =>
                  setEditedTitle(e.target.value)
                }
                onBlur={() => saveEdit(chat.id)}
                onKeyDown={(e) => {

                  if (e.key === "Enter") {
                    saveEdit(chat.id);
                  }

                }}
                autoFocus
              />

            ) : (

              <div
                className="chat-title"
                onClick={() => setCurrentChat(chat)}
              >
                {chat.title}
              </div>

            )}

            <div className="chat-actions">

              <button
                className="action-btn"
                onClick={() => startEditing(chat)}
              >
                ✏️
              </button>

              <button
                className="action-btn"
                onClick={() => deleteChat(chat.id)}
              >
                🗑️
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default Sidebar;
