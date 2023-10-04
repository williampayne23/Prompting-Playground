"use client";
import React, { useContext, createContext, useState } from "react";
import OpenAI from "openai";
import type { IMessage, IOptions, IRole } from "~/types/util";
import { useQuestion } from "./Question";

function useChat() {
  const [messages, editMessages] = useState<IMessage[]>([
    {
      role: "system",
      content:
        "You will be provided with a tweet, and your task is to classify its sentiment as positive, neutral, or negative.",
    },
    {
      role: "user",
      content: "I loved the new Batman movie!",
    },
  ]);

  const [options, editOptions] = useState<IOptions>({
    apiKey: "",
    model: "gpt-3.5-turbo",
    stream: true,
  });

  const askQuestion = useQuestion();

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

  async function generateNewMessageWithSettings() {
    const apiKey =
      options.apiKey == ""
        ? await askQuestion("Provide your api key.")
        : options.apiKey;

    const openai = new OpenAI({
      dangerouslyAllowBrowser: true,
      apiKey: apiKey,
    });

    const message = {
      role: "assistant",
      content: "",
    } as const;
    editMessages((m) => [...m, message]);

    const createOptions = { ...options };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    delete createOptions.apiKey;

    const response = await openai.chat.completions.create({
      ...createOptions,
      messages,
    });

    function updateLastMessage(
      delta: OpenAI.Chat.Completions.ChatCompletionChunk.Choice.Delta,
    ) {
      editMessages((m) => {
        const newM = [...m];
        const lastMessage = newM[m.length - 1];
        if (lastMessage == undefined) return m;
        newM[newM.length - 1] = {
          role: lastMessage.role,
          content: (lastMessage.content ?? "") + (delta.content ?? ""),
          function_call: lastMessage.function_call,
        };
        return newM;
      });
    }

    for await (const chunk of response) {
      const choiceDelta = chunk.choices[0]?.delta;
      if (choiceDelta) updateLastMessage(choiceDelta);
    }
  }

  return {
    messages,
    appendMessage: appendEmptyMessage,
    removeMessage,
    replaceMessage,
    generateNewMessageWithSettings,
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
