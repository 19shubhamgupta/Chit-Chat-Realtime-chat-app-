import React, { useState, useRef } from "react";

// Props: { text, time, isOwn, senderImg, image, voice }
const Message = ({ text, time, isOwn, senderImg, image, voice }) => {
  const hasText = text && text.trim() !== "";
  const hasImage = image && image !== "";
  const hasVoice = voice && voice.trim() !== "";
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div
      className={`flex items-end mb-2 ${
        isOwn ? "justify-end" : "justify-start"
      }`}
    >
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
              className="max-w-[150px] max-h-[150px] rounded-lg object-cover border border-yellow-400"
              onError={(e) => {
                e.target.style.display = "none";
              }}
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
          {hasVoice && (
            <div className="flex items-center gap-3 px-3 py-2 bg-[#2b2b2b] rounded-xl max-w-[250px]">
              <audio
                controls
                className="hidden"
                ref={(el) => (audioRef.current = el)}
              >
                <source src={voice} type="audio/webm" />
              </audio>

              <button
                onClick={() => {
                  const audio = audioRef.current;
                  if (audio.paused) {
                    audio.play();
                    setIsPlaying(true);
                    audio.onended = () => setIsPlaying(false);
                  } else {
                    audio.pause();
                    setIsPlaying(false);
                  }
                }}
                className="w-8 h-8 rounded-full bg-yellow-400 text-black flex items-center justify-center hover:scale-105 transition"
              >
                {isPlaying ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M5.5 3.5A.5.5 0 0 1 6 4v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5zm5 0A.5.5 0 0 1 11 4v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M6 3.993v8.014c0 .593.638.954 1.148.63l6.482-4.007a.75.75 0 000-1.26L7.148 3.363A.75.75 0 006 3.993z" />
                  </svg>
                )}
              </button>

              <div className="flex-1 h-1.5 bg-gray-500 rounded-full relative overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full bg-yellow-400"
                  style={{ width: isPlaying ? "100%" : "0%" }}
                ></div>
              </div>

              <span className="text-xs text-gray-300 font-mono">0:12</span>
            </div>
          )}

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
