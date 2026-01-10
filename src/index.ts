import makeWASocket, { Browsers } from "baileys";
import { makeInMemoryStore, type BaileysEventEmitter } from "@adiwajshing/baileys";
import pino from "pino";

import { process_metadata } from "@/auth";
import { connection_update } from "@/events";
import { use_sqlite_auth, db } from "@/database";
import { main_handler } from "@/handlers";
import { mute_job } from "@/jobs";
import { get_user_jid, load_commands_recursive, type Axo, type Command, type MutedUser } from "@/utils";

export let skt: ReturnType<typeof makeWASocket>;
export let axo: Axo;

const store = makeInMemoryStore({});

export const start_socket = async () => {
  const { state, save_creds } = await use_sqlite_auth();

  skt = makeWASocket({
    auth: state,
    browser: Browsers.ubuntu("Axo Browser"),
    logger: pino({ level: "silent" }),
    cachedGroupMetadata: process_metadata,
  });

  store.bind(skt.ev as BaileysEventEmitter);

  const commands = new Map<string, Command>();
  const timeouts = new Map<string, number>();
  const muteds = db.query(`SELECT * FROM muted_users`).all() as MutedUser[];

  axo = {
    find: get_user_jid,
    store,
    db,
    commands,
    timeouts,
    muteds,
    socket: skt,
    prefix: "-",
    default_example: "@luiz",
  };

  await load_commands_recursive({ axo });

  skt.ev.on("messages.upsert", async (payload) => {
    await Promise.all([main_handler(payload), mute_job(payload)]);
  });

  skt.ev.on("creds.update", save_creds);
  skt.ev.on("connection.update", connection_update);
};

const noop = () => {};

console.log = noop;
console.info = noop;
console.warn = noop;
console.error = noop;

await start_socket();

setInterval(() => {
  store.writeToFile("./store.json");
}, 10_000);
