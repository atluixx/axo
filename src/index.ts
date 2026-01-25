import {
  type BaileysEventEmitter,
  makeInMemoryStore,
} from "@adiwajshing/baileys";
import makeWASocket, { Browsers } from "baileys";
import pino from "pino";
import { process_metadata } from "@/auth";
import { connection_update } from "@/events";
import { main_handler } from "@/handlers";
import { mute_job } from "@/jobs";
import {
  type Axo,
  type Command,
  get_user_jid,
  load_commands_recursive,
} from "@/utils";
import { prisma, use_prisma_auth } from "@/utils/prisma";

export let skt: ReturnType<typeof makeWASocket>;
export let axo: Axo;

const store = makeInMemoryStore({});

export const start_socket = async () => {
  const { state, save_creds } = await use_prisma_auth();

  skt = makeWASocket({
    auth: state,
    browser: Browsers.ubuntu("Axo Browser"),
    logger: pino({ level: "silent" }),
    cachedGroupMetadata: process_metadata,
  });

  store.bind(skt.ev as BaileysEventEmitter);

  const commands = new Map<string, Command>();
  const timeouts = new Map<string, number>();

  const muteds = await prisma.mutedUser.findMany();

  axo = {
    find: get_user_jid,
    store,
    prisma,
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

start_socket();
