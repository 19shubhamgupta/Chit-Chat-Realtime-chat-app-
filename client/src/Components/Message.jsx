import React from "react";

// Props: { text, time, isOwn, senderImg, image }
const Message = ({ text, time, isOwn, senderImg, image }) => {
  const hasText = text && text.trim() !== "";
  const hasImage = image && image !== "";
  return (
    <div
      className={`flex items-end mb-2 ${
        isOwn ? "justify-end" : "justify-start"
      }`}
    >
      {/* Sender avatar (left for receiver, right for sender) */}
      {!isOwn && (
        <img
          src={senderImg || "/avatar.png"}
          alt="avatar"
          className="w-10 h-10 rounded-full mr-2 border-2 border-yellow-400"
        />
      )}
      <div
        className={`flex flex-col ${
          isOwn ? "items-end" : "items-start"
        } w-full`}
      >
        {hasImage && (
          <div
            className={`flex ${
              isOwn ? "justify-end" : "justify-start"
            } mb-1 w-full`}
          >
            <img
              src={image}
              alt="sent-img"
              className="max-w-[150px] max-h-[150px] rounded-lg object-cover"
            />
          </div>
        )}
        <div
          className={`max-w-[70%] min-w-30 px-2 py-2 rounded-2xl shadow-md relative text-sm break-words flex flex-col gap-1
            ${
              isOwn
                ? "bg-gray-600 text-gray-100 rounded-br-none border border-gray-500 ml-auto"
                : "bg-gray-600 text-gray-100 rounded-bl-none border border-gray-500 mr-auto"
            }
          `}
        >
          {hasText && <span>{text}</span>}
          <span className="block text-[11px] text-right text-gray-400 mt-1 font-mono">
            {time &&
              (typeof time === "string" && time.length > 5
                ? (() => {
                    const d = new Date(time);
                    return `${d.toLocaleDateString([], {
                      day: "2-digit",
                      month: "short",
                    })}  •  ${d.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}`;
                  })()
                : time)}
          </span>
        </div>
      </div>
      {isOwn && (
        <img
          src={senderImg || "/avatar.png"}
          alt="avatar"
          className="w-10 h-10 rounded-full ml-2 border-2 border-yellow-400"
        />
      )}
    </div>
  );
};

export default Message;
