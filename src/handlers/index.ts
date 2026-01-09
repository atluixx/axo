import { getContentType, type WAMessage, type MessageUpsertType } from "baileys";
import { logger } from "@/utils";
import { message } from "./message";
import { media } from "./media";

export const handlers_logger = logger.child({ module: "handlers" });
type MessageHandlerType = {
  messages: WAMessage[],
  type: MessageUpsertType
}

export const main_handler = ({
  messages,
  type
}: MessageHandlerType): void => {
  if (type !== "notify") return;

  for (const m of messages) {
    if (!m.message) continue;
    if (m.key.fromMe) continue;

    const content =
      m.message.ephemeralMessage?.message ??
      m.message;

    const type = getContentType(content);
    if (!type) continue;

    let text: string | null | undefined;

    switch (type) {
      case "conversation":
        text = content.conversation;
        break;

      case "extendedTextMessage":
        text = content.extendedTextMessage?.text;
        break;

      case "imageMessage":
        text = content.imageMessage?.caption;
        break;

      case "videoMessage":
        text = content.videoMessage?.caption;
        break;
    }

    if (text) {
      return message({ m });
    } else {
      return media({ m });
    }
  }
};
