import {
  ChatCompletionRequestMessage,
  ChatCompletionRequestMessageRoleEnum,
  ChatCompletionResponseMessage,
} from "openai";
import { supabase } from "../supabase";

const TABLE_NAME = "chat";

const insertChat = async (
  userId: string,
  content: string,
  role: ChatCompletionRequestMessageRoleEnum
) => {
  const { error } = await supabase.from(TABLE_NAME).insert({
    user_id: userId,
    role,
    content,
  });

  if (error) {
    console.error(error);
    throw error;
  }
};

const getChats = async (userId: string) => {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(10);
  if (error) {
    console.error(error);
    throw error;
  }

  return convertInfo(data);
};

const convertInfo = (
  data: { [x: string]: any }[] | null
): ChatCompletionRequestMessage[] => {
  if (!data || data.length < 1) return [];

  const r: ChatCompletionRequestMessage[] = [];
  for (const d of data) {
    r.push({
      role: d.role as ChatCompletionRequestMessageRoleEnum,
      content: d.content,
    });
  }

  return r;
};

export { insertChat, getChats };
