-- CreateEnum
CREATE TYPE "Permission" AS ENUM ('ADMIN', 'GROUP_ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "PlayerClass" AS ENUM ('WARRIOR', 'MAGE', 'ROGUE', 'HUNTER', 'HEALER');

-- CreateEnum
CREATE TYPE "ItemType" AS ENUM ('WEAPON', 'ARMOR', 'POTION', 'GUN', 'SHIELD', 'FOOD', 'WATER', 'MISC');

-- CreateEnum
CREATE TYPE "PetType" AS ENUM ('DOG', 'CAT', 'DRAGON', 'FAIRY', 'WOLF', 'GRIFFIN');

-- CreateTable
CREATE TABLE "WaAuth" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "WaAuth_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "User" (
    "jid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "permission" "Permission" NOT NULL DEFAULT 'USER',

    CONSTRAINT "User_pkey" PRIMARY KEY ("jid")
);

-- CreateTable
CREATE TABLE "Player" (
    "jid" TEXT NOT NULL,
    "class" "PlayerClass",
    "level" INTEGER NOT NULL DEFAULT 1,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "gold" INTEGER NOT NULL DEFAULT 0,
    "strength" INTEGER NOT NULL DEFAULT 1,
    "agility" INTEGER NOT NULL DEFAULT 1,
    "intelligence" INTEGER NOT NULL DEFAULT 1,
    "health" INTEGER NOT NULL DEFAULT 100,
    "maxHealth" INTEGER NOT NULL DEFAULT 100,
    "hunger" INTEGER NOT NULL DEFAULT 100,
    "thirst" INTEGER NOT NULL DEFAULT 100,
    "stamina" INTEGER NOT NULL DEFAULT 100,
    "reputation" INTEGER NOT NULL DEFAULT 0,
    "familyId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("jid")
);

-- CreateTable
CREATE TABLE "MutedUser" (
    "jid" TEXT NOT NULL,
    "muted_until" BIGINT NOT NULL,
    "reason" TEXT NOT NULL DEFAULT 'Desobedeceu o papai',

    CONSTRAINT "MutedUser_pkey" PRIMARY KEY ("jid")
);

-- CreateTable
CREATE TABLE "Item" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "ItemType" NOT NULL,
    "power" INTEGER NOT NULL,
    "rarity" INTEGER NOT NULL DEFAULT 1,
    "price" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InventoryItem" (
    "playerJid" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "InventoryItem_pkey" PRIMARY KEY ("playerJid","itemId")
);

-- CreateTable
CREATE TABLE "EquippedItem" (
    "playerJid" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,

    CONSTRAINT "EquippedItem_pkey" PRIMARY KEY ("playerJid","itemId")
);

-- CreateTable
CREATE TABLE "Enemy" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "hp" INTEGER NOT NULL,
    "attack" INTEGER NOT NULL,
    "rewardXp" INTEGER NOT NULL,
    "rewardGold" INTEGER NOT NULL,

    CONSTRAINT "Enemy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Duel" (
    "id" TEXT NOT NULL,
    "attackerJid" TEXT NOT NULL,
    "defenderJid" TEXT NOT NULL,
    "winnerJid" TEXT,
    "wagerGold" INTEGER NOT NULL DEFAULT 0,
    "timestamp" BIGINT NOT NULL DEFAULT 0,
    "completed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Duel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quest" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "goal" TEXT NOT NULL,
    "rewardXp" INTEGER NOT NULL,
    "rewardGold" INTEGER NOT NULL,

    CONSTRAINT "Quest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayerQuest" (
    "playerJid" TEXT NOT NULL,
    "questId" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "progress" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "PlayerQuest_pkey" PRIMARY KEY ("playerJid","questId")
);

-- CreateTable
CREATE TABLE "Guild" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ownerJid" TEXT NOT NULL,

    CONSTRAINT "Guild_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GuildMember" (
    "guildId" TEXT NOT NULL,
    "playerJid" TEXT NOT NULL,

    CONSTRAINT "GuildMember_pkey" PRIMARY KEY ("guildId","playerJid")
);

-- CreateTable
CREATE TABLE "Family" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "founderJid" TEXT NOT NULL,

    CONSTRAINT "Family_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FamilyMember" (
    "familyId" TEXT NOT NULL,
    "playerJid" TEXT NOT NULL,

    CONSTRAINT "FamilyMember_pkey" PRIMARY KEY ("familyId","playerJid")
);

-- CreateTable
CREATE TABLE "Friend" (
    "playerJid" TEXT NOT NULL,
    "friendJid" TEXT NOT NULL,

    CONSTRAINT "Friend_pkey" PRIMARY KEY ("playerJid","friendJid")
);

-- CreateTable
CREATE TABLE "Pet" (
    "id" TEXT NOT NULL,
    "playerJid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "PetType" NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 1,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "loyalty" INTEGER NOT NULL DEFAULT 100,
    "health" INTEGER NOT NULL DEFAULT 100,
    "hunger" INTEGER NOT NULL DEFAULT 100,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Pet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Achievement" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Achievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayerAchievement" (
    "playerJid" TEXT NOT NULL,
    "achievementId" TEXT NOT NULL,

    CONSTRAINT "PlayerAchievement_pkey" PRIMARY KEY ("playerJid","achievementId")
);

-- CreateTable
CREATE TABLE "DailyReward" (
    "jid" TEXT NOT NULL,
    "lastClaim" BIGINT NOT NULL,

    CONSTRAINT "DailyReward_pkey" PRIMARY KEY ("jid")
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "maxLevel" INTEGER NOT NULL DEFAULT 10,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayerSkill" (
    "playerJid" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "PlayerSkill_pkey" PRIMARY KEY ("playerJid","skillId")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "rewardXp" INTEGER NOT NULL,
    "rewardGold" INTEGER NOT NULL,
    "chance" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Shop" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Shop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShopItem" (
    "shopId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "price" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ShopItem_pkey" PRIMARY KEY ("shopId","itemId")
);

-- CreateIndex
CREATE INDEX "MutedUser_muted_until_idx" ON "MutedUser"("muted_until");

-- CreateIndex
CREATE INDEX "InventoryItem_itemId_idx" ON "InventoryItem"("itemId");
