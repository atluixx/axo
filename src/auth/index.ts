import type { GroupMetadata } from "baileys";
import { redis } from "bun";

export const process_metadata = async (jid: string): Promise<GroupMetadata | undefined> => {
  const raw = await redis.get(jid);
  if (!raw) return undefined;

  try {
    return JSON.parse(raw) as GroupMetadata;
  } catch {
    await redis.del(jid);
    return undefined;
  }
};
