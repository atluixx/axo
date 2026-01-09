import type { Boom } from "@hapi/boom";
import { DisconnectReason, type ConnectionState } from "baileys";
import qrcode from "qrcode-terminal";
import { start_socket } from "@/index"
import { logger } from "@/utils";

let qr_shown: boolean = false;
const events_logger = logger.child({ module: "events" });

export const connection_update = async (update: Partial<ConnectionState>): Promise<void> => {

  const { qr, connection, lastDisconnect } = update;

  if (connection === "close") {
    const reason = (lastDisconnect?.error as Boom)?.output.statusCode;

    if (reason === DisconnectReason.restartRequired) {
      start_socket();
      events_logger.info("restart required.");
    }
  } else if (connection === "open") {
    qr_shown = false;
    console.clear();
    events_logger.info("client connected successfully.");
  }

  if (qr && !qr_shown) {
    qr_shown = true;
    console.clear();
    qrcode.generate(qr, { small: true });
    events_logger.info("scan the qr to connect.");
  }

  return;
}
