import crypto from "crypto";

import { lineConfig } from "./config";
export const isValidRequest = (body: string, sig: string) => {
  const signature = crypto
    .createHmac("sha256", lineConfig.channelSecret)
    .update(Buffer.from(body))
    .digest("base64");

  return signature === sig;
};
