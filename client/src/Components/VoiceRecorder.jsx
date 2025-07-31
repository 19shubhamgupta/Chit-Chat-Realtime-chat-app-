import React, { useRef, useState } from "react";
import { FaMicrophone } from "react-icons/fa";

const VoiceRecorder = ({ handleSendMessage }) => {
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        handleSendMessage(audioBlob);
      };

      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (err) {
      // Handle microphone access error silently
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  return (
    <button
      onMouseDown={startRecording}
      onMouseUp={stopRecording}
      onMouseLeave={stopRecording}
      className={`p-2 rounded-lg transition ${
        recording ? "bg-red-700" : "hover:bg-gray-700"
      }`}
      title="Hold to record"
    >
      <FaMicrophone className="w-6 h-6 text-yellow-400" />
    </button>
  );
};

export default VoiceRecorder;
