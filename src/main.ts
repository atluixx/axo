import makeWASocket, { Browsers } from "baileys";
import P from "pino";
import { redis } from "bun";

const socket = makeWASocket({
  browser: Browsers.ubuntu("Axo Browser"),
  logger: P(),
  cachedGroupMetadata: (jid: string) => redis.get(jid)
})
