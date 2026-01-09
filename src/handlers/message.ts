import { type WAMessage } from "baileys";
import { handlers_logger } from ".";

export const message = ({ m }: { m: WAMessage }): void => {
  const text = m.message?.conversation ?? m.message?.extendedTextMessage?.text;
  const is_group = m.key.remoteJid?.endsWith("@g.us");
  const jid = is_group ? m.key.participant : m.key.remoteJid;
  const sender = m.pushName || jid;

  handlers_logger.info({ text, sender, group: is_group }, "message received");
};

