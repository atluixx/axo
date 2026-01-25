import { PrismaPg } from "@prisma/adapter-pg";
import { BufferJSON, initAuthCreds } from "baileys";
import { config } from "dotenv";
import { Pool } from "pg";
import { PrismaClient } from "@/prisma/generated/prisma";

config({ path: `${__dirname}/../.env` });

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({ adapter });
export const use_prisma_auth = async () => {
  const row = await prisma.waAuth.findUnique({
    where: { key: "creds" },
  });

  const creds = row
    ? JSON.parse(row.value, BufferJSON.reviver)
    : initAuthCreds();

  return {
    state: {
      creds,

      keys: {
        get: async (type: string, ids: string[]) => {
          if (ids.length === 0) return {};

          const rows = await prisma.waAuth.findMany({
            where: {
              key: {
                in: ids.map((id) => `${type}:${id}`),
              },
            },
          });

          return Object.fromEntries(
            rows.map((r) => [
              r.key.split(":")[1],
              JSON.parse(r.value, BufferJSON.reviver),
            ]),
          );
        },

        // biome-ignore lint/suspicious/noExplicitAny: data can be anything
        set: async (data: any) => {
          const operations = [];

          for (const type in data) {
            for (const id in data[type]) {
              const key = `${type}:${id}`;
              const value = data[type][id];

              if (value === null) {
                operations.push(
                  prisma.waAuth.deleteMany({
                    where: { key },
                  }),
                );
              } else {
                operations.push(
                  prisma.waAuth.upsert({
                    where: { key },
                    update: {
                      value: JSON.stringify(value, BufferJSON.replacer),
                    },
                    create: {
                      key,
                      value: JSON.stringify(value, BufferJSON.replacer),
                    },
                  }),
                );
              }
            }
          }

          if (operations.length > 0) {
            await prisma.$transaction(operations);
          }
        },
      },
    },

    save_creds: async () => {
      await prisma.waAuth.upsert({
        where: { key: "creds" },
        update: {
          value: JSON.stringify(creds, BufferJSON.replacer),
        },
        create: {
          key: "creds",
          value: JSON.stringify(creds, BufferJSON.replacer),
        },
      });
    },
  };
};
