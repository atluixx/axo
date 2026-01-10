import { jidNormalizedUser, type WAMessage } from "baileys";
import { handlers_logger } from ".";
import { axo, skt } from "..";
import { command_handler } from "./command";

const message_handler = async ({ m, text }: { m: WAMessage; text: string }): Promise<void> => {
  const chat_jid = m.key.remoteJid!;
  const is_group = chat_jid.endsWith("@g.us");
  const sender_jid = jidNormalizedUser(m.key.participant ?? m.key.remoteJidAlt ?? chat_jid);
  const sender_name = m.pushName || sender_jid.split("@")[0];

  const group_name = is_group ? (await skt.groupMetadata(chat_jid)).subject : "DMs";

  const normalized = text.trim();

  if (normalized.startsWith(axo.prefix)) {
    const withoutPrefix = normalized.slice(axo.prefix.length).trim();

    if (!withoutPrefix) return;

    await command_handler({
      axo,
      m,
      text: withoutPrefix,
    });

    return;
  }

  handlers_logger.info(
    {
      text: normalized,
      sender: `${sender_name} (${sender_jid})`,
      group: `${is_group} | ${group_name}`,
    },
    "message received",
  );
};

export { message_handler };
