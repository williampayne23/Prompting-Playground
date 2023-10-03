import type openai from "openai";

export type IMessage = openai.Chat.ChatCompletion.Choice["message"];

export type IRole = IMessage["role"];
