import type { WAMessage } from "baileys";
import { handlers_logger } from ".";

export const media = ({ m }: { m: WAMessage }) => {
  const data = m.message?.imageMessage || m.message?.videoMessage || m.message?.audioMessage || m.message?.documentMessage || m.message?.stickerMessage;
  if (!data) return handlers_logger.info("media not found.");

  const metadata = {
    mimetype: data.mimetype,
    file_length: data.fileLength,
    sha_256: data.fileSha256,
    media_key: data.mediaKey,
    file_enc_sha_256: data.fileEncSha256,
    direct_path: data.directPath
  };

  handlers_logger.info({ metadata }, "media received");
};
