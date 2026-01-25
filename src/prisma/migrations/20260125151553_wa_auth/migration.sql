-- CreateTable
CREATE TABLE "WaAuth" (
    "key" TEXT NOT NULL PRIMARY KEY,
    "value" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "MutedUser" (
    "jid" TEXT NOT NULL,
    "muted_until" BIGINT NOT NULL DEFAULT 60000,
    "reason" TEXT NOT NULL DEFAULT 'Desobedeceu o papai'
);

-- CreateTable
CREATE TABLE "User" (
    "jid" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "permission" TEXT NOT NULL DEFAULT 'USER'
);

-- CreateIndex
CREATE UNIQUE INDEX "MutedUser_jid_key" ON "MutedUser"("jid");

-- CreateIndex
CREATE UNIQUE INDEX "User_jid_key" ON "User"("jid");
