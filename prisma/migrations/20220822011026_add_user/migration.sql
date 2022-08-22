-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Senhorio', 'Administrador');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "access_token" VARCHAR(32),
    "token_expires" TIMESTAMP,
    "role" "Role" NOT NULL DEFAULT 'Senhorio',
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
