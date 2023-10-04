"use client";
import { Message } from "~/components/Message";
import { ChatProvider, useChatContext } from "~/hooks/useChatContext";

export default function HomePage() {
  return (
    <ChatProvider>
      <div className="flex h-full">
        <div className="flex flex-grow flex-col">
          <div className="max-h-full flex-grow overflow-scroll">
            <MessageStack />
          </div>
          <ButtonRow />
        </div>
        <div className="w-[30%]">
          <Options />
        </div>
      </div>
    </ChatProvider>
  );
}

function ButtonRow() {
  const chatContext = useChatContext();
  return (
    <div className="m-2 p-2">
      <button
        onClick={() => {
          chatContext.generateNewMessageWithSettings().catch(console.error);
        }}
        className="rounded-md bg-teal-600 p-2 px-4 text-white hover:bg-teal-700"
      >
        Submit
      </button>
    </div>
  );
}

function MessageStack() {
  const chatContext = useChatContext();

  return (
    <div className="flex flex-col overflow-scroll px-2">
      {chatContext.messages.map((m, i) => (
        <Message key={i} id={i} message={m} />
      ))}
      <button
        onClick={chatContext.appendMessage}
        className="py-4 pl-2 text-left text-lg transition duration-100 hover:bg-slate-100"
      >
        ⊕ Add Message
      </button>
    </div>
  );
}

function Options() {
  return <div>Hello</div>;
}
