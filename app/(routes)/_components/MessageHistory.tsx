import { MessageSender } from "@/context/HeyGenContext";
import { useMessageHistory } from "@/hooks/useMessageHistory";
import React, { useEffect, useRef } from "react";


export const MessageHistory: React.FC = () => {
  const { messages } = useMessageHistory();
const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container || messages.length === 0) return;

    container.scrollTop = container.scrollHeight;
  }, [messages]);

  return (
    <div className="relative w-[600px] h-full bg-gray-600 max-h-[800px] border-2 rounded-2xl gap-2 px-2 py-2 text-white">
      <h2 className="text-lg font-semibold my-4 text-center">Conversation</h2>
      {messages.length === 0 && (
        <div className="text-center">
          There is no current messages to be shown
        </div>
      )}
      <div
        ref={containerRef}
        className="relative w-full h-full overflow-y-auto flex flex-col gap-2 self-center"
      >
        {messages.length > 0 && messages.map((message) => (
          <div
            key={message.id}
            className={`flex flex-col gap-1 max-w-[350px] ${message.sender === MessageSender.CLIENT
              ? "self-end items-end"
              : "self-start items-start"
              }`}
          >
            <p className="text-xs text-zinc-400">
              {message.sender === MessageSender.AVATAR ? "Interviewer" : "You"}
            </p>
            <p className="text-sm">{message.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
