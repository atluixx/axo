import makeWASocket, { Browsers } from "baileys";
import { process_metadata } from "@/auth";
import { connection_update } from "@/events";
import { use_sqlite_auth } from "@/database";
import { logger } from "@/utils";

const { state, save_creds } = await use_sqlite_auth();

let skt: ReturnType<typeof makeWASocket>;

export const start_socket = async () => {
  skt = makeWASocket({
    auth: state,
    browser: Browsers.ubuntu("Axo Browser"),
    logger: logger.child({ module: "baileys" }),
    cachedGroupMetadata: (jid: string) => process_metadata(jid),
  });


  skt.ev.on("creds.update", save_creds);
  skt.ev.on("connection.update", connection_update);
}


await start_socket();
