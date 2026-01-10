import type { makeInMemoryStore } from "@adiwajshing/baileys";
import type { WAMessage, WASocket } from "baileys";
import Database from "bun:sqlite";

export type MessageType = {
  m: WAMessage;
  t: string;
  axo: Axo;
};

export enum CommandPermissions {
  ALL,
  USER,
  MODERATOR,
  ADMIN,
}

export type MutedUser = {
  user: string;
  muted_until: string;
  reason: string;
};

export interface Command {
  name: string;
  description?: string;
  examples?: string[] | ((axo: Axo) => string[]);
  aliases?: string[];
  perms?: CommandPermissions[];
  execute: (ctx: { axo: Axo; m: WAMessage; args: string[] }) => Promise<void>;
}

export interface Axo {
  find: ({ axo, m, t }: { m: WAMessage; t: string; axo: Axo }) => string | undefined;
  commands: Map<string, Command>;
  timeouts: Map<string, number>;
  muteds: MutedUser[];
  prefix: string;
  db: Database;
  store: ReturnType<typeof makeInMemoryStore>;
  socket: WASocket;
  default_example: string; // default number to show on examples: .mute {default_example}
}
