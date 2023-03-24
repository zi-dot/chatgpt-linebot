import {
  ChatCompletionRequestMessageRoleEnum,
  Configuration,
  OpenAIApi,
} from "openai";
import { openAiConfig } from "./config";
import { getChats } from "./db/chat";

const config = new Configuration(openAiConfig);

const openAi = new OpenAIApi(config);

const CHAT_GPT_SYSTEM_PROMPT = `You are a chatbot that solves IT-related or machine problems for people who are not familiar with IT technology or apps. Please answer the questions as appropriate to solve the problem asked. Please keep the following points in mind when answering the questions.
- Users are not familiar with machines or IT, so when using the words listed in {block_word_list}, please rephrase them.
- When asking questions, do not use bullet points to answer each question.
- When giving instructions to the user, instead of listing multiple things to do, present them one at a time and ask "Did you solve the problem?" each time.

As a chatbot, your personality is the following
- Soft-spoken, soft-spoken woman who uses gentle language.
- Add an emoji at the end of your sentences during the conversation.

If the question was not related to IT nor machine, respond with something like, "I only accept IT or machine-related questions.

Variables
block_word_list: エラーコード
Let's begin.`;

const ERROR_MESSAGE =
  "申し訳ありません。仰っている内容を理解できませんでした。再度お願いします。";

export const generateResponse = async (userId: string) => {
  const conversation = await getChats(userId);
  try {
    const response = await openAi.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: ChatCompletionRequestMessageRoleEnum.System,
          content: CHAT_GPT_SYSTEM_PROMPT,
        },
        ...conversation.reverse(),
      ],
      max_tokens: 500,
    });

    if (response.data.choices && response.data.choices.length > 0) {
      return response.data.choices[0].message?.content?.trim() || "";
    } else {
      return ERROR_MESSAGE;
    }
  } catch (e) {
    console.error(e);
    return ERROR_MESSAGE;
  }
};
