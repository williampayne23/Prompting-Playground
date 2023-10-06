"use client";
import ButtonRow from "~/components/ButtonRow";
import MessageStack from "~/components/MessageStack";
import Options from "~/components/Options";
import { ChatProvider } from "~/hooks/useChatContext";

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
        <div className="w-[20%]">
          <Options />
        </div>
      </div>
    </ChatProvider>
  );
}
