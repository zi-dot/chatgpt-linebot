import { Client, TextMessage } from "@line/bot-sdk";
import { lineConfig } from "./config";

const client = new Client(lineConfig);

export const replyMessage = async (replyToken: string, text: string) => {
  const message: TextMessage = {
    type: "text",
    text,
  };

  await client.replyMessage(replyToken, message);
};
