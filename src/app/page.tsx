"use client";

import { useEffect } from "react";
import { Message } from "~/components/Message";
import { ChatProvider, useChatContext } from "~/hooks/useChatContext";

export default function HomePage() {
  return (
    <ChatProvider>
      <div className="flex">
        <div className="flex-grow">
          <MessageStack />
        </div>
        <div className="w-[30%]">
          <Options />
        </div>
      </div>
    </ChatProvider>
  );
}

function MessageStack() {
  const chatContext = useChatContext();

  return (
    <div className="flex flex-col px-2">
      {chatContext.messages.map((m, i) => (
        <Message key={i} id={i} message={m} />
      ))}
      <button
        onClick={chatContext.appendMessage}
        className="py-4 pl-2 text-lg transition duration-100 hover:bg-slate-100"
      >
        ⊕ Add Message
      </button>
    </div>
  );
}

function Options() {
  return <div>Hello</div>;
}
