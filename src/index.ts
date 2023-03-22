import { replyMessage } from "./bot";
import { ChatCompletionRequestMessageRoleEnum } from "openai";
import { generateResponse } from "./chatGPT";

import type { HttpFunction } from "@google-cloud/functions-framework";
import { isValidRequest } from "./verify";
import { insertChat } from "./db/chat";

export const webhook: HttpFunction = async (req, res) => {
  const headers = req.headers;

  if (
    !isValidRequest(
      JSON.stringify(req.body),
      headers["x-line-signature"] as string
    )
  ) {
    return res.status(403).send();
  }

  const { events } = req.body;

  for (const event of events) {
    if (event.type === "message" && event.message.type === "text") {
      const userId = event.source.userId;

      await insertChat(
        userId,
        event.message.text,
        ChatCompletionRequestMessageRoleEnum.User
      );

      const response = await generateResponse(userId);

      await insertChat(
        userId,
        response,
        ChatCompletionRequestMessageRoleEnum.Assistant
      );
      await replyMessage(event.replyToken, response);
    }
  }

  res.status(200).send();
};
