import React, { useContext, createContext, useState } from "react";
import type { IMessage, IRole } from "~/types/util";

function useChat() {
  const [messages, editMessages] = useState<IMessage[]>([
    {
      role: "system",
      content: "",
    },
    {
      role: "user",
      content: "",
    },
  ]);
  function appendEmptyMessage() {
    const lastMessage = messages[messages.length - 1];
    const role = lastMessage?.role;
    const nextRoleMap: Record<IRole, IRole> = {
      function: "assistant",
      system: "user",
      user: "assistant",
      assistant: "user",
    };
    const nextRole: IRole =
      role == undefined ? ("system" as const) : nextRoleMap[role];
    const message: IMessage = {
      role: nextRole,
      content: "",
    };
    editMessages((m) => [...m, message]);
  }

  function removeMessage(i: number) {
    editMessages((m) => {
      const newM = [...m];
      newM.splice(i, 1);
      return newM;
    });
  }

  function replaceMessage(i: number, message: IMessage) {
    editMessages((m) => {
      const newM = [...m];
      newM[i] = message;
      return newM;
    });
  }

  return {
    messages,
    appendMessage: appendEmptyMessage,
    removeMessage,
    replaceMessage,
  };
}

type IChatContext = ReturnType<typeof useChat>;

const ChatContext = createContext<IChatContext | undefined>(undefined);

export function useChatContext() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
}

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const context = useChat();
  return (
    <ChatContext.Provider value={context}>{children}</ChatContext.Provider>
  );
}
