import makeWASocket, { Browsers } from "baileys";
import { process_metadata } from "@/auth";
import { connection_update } from "@/events";
import { use_sqlite_auth } from "@/database";
import pino from "pino";
import { main_handler } from "@/handlers";
import type { Axo, Command } from "@/utils/axo";

const { state, save_creds } = await use_sqlite_auth();

export let skt: ReturnType<typeof makeWASocket>;

export const start_socket = async () => {
  skt = makeWASocket({
    auth: state,
    browser: Browsers.ubuntu("Axo Browser"),
    logger: pino({ level: "silent" }),
    cachedGroupMetadata: (jid: string) => process_metadata(jid),
  });

  const commands: Record<string, Command> = {};

  const axo: Axo = {
    socket: skt,
    commands,
  };

  skt.ev.on("messages.upsert", async ({ messages, type }) => await main_handler({ messages, type }));
  skt.ev.on("creds.update", save_creds);
  skt.ev.on("connection.update", connection_update);
}

const noop = () => { };
console.log = noop;
console.info = noop;
console.warn = noop;

await start_socket();
