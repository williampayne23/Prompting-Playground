"use client";
import { useEffect, useState } from "react";
import ButtonRow from "~/components/ButtonRow";
import MessageStack from "~/components/MessageStack";
import Options from "~/components/Options";
import { GiHamburgerMenu } from "react-icons/gi";
import { AiOutlineClose } from "react-icons/ai";
import { useChatContext } from "~/hooks/useChatContext";

export default function HomePage() {
  const [optionVisible, setOptionVisible] = useState(false);
  const chatContext = useChatContext();

  useEffect(() => {
    function handleButtonClick(e: KeyboardEvent) {
      if (e.key == "Enter" && e.metaKey) {
        chatContext.generateNewMessageWithSettings().catch(console.error);
      }
    }

    addEventListener("keydown", handleButtonClick);

    return () => {
      removeEventListener("keydown", handleButtonClick);
    };
  }, [chatContext]);

  return (
    <div className="flex h-full">
      <div className="flex flex-grow flex-col">
        <div className="max-h-full flex-grow overflow-scroll">
          <MessageStack />
        </div>
        <ButtonRow />
      </div>
      <div
        className={`fixed right-0 z-10 w-56 bg-white transition duration-500 md:static ${
          optionVisible ? "" : "translate-x-56 opacity-0 md:translate-x-0 md:opacity-100"
        }`}
      >
        <Options />
      </div>
      <button
        className={`fixed right-0 z-10 p-2 transition duration-500 md:hidden ${
          optionVisible ? "" : "translate-x-56 opacity-0"
        }`}
        onClick={() => setOptionVisible((v) => !v)}
      >
        <AiOutlineClose />
      </button>
      <button className={`fixed right-0 p-2 md:hidden `} onClick={() => setOptionVisible((v) => !v)}>
        <GiHamburgerMenu />
      </button>
    </div>
  );
}
