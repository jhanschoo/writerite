CREATE EXTENSION "pgcrypto";

CREATE TYPE "Unit" AS ENUM ('UNIT');

CREATE TYPE "RoomState" AS ENUM ('WAITING', 'SERVING', 'SERVED');

CREATE TABLE "User" (
  "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  "email" text NOT NULL UNIQUE,
  "passwordHash" text,
  "googleId" text UNIQUE,
  "facebookId" text UNIQUE,
  "name" text,
  "roles" text[] DEFAULT '{}' NOT NULL, -- investigate
  "createdAt" timestamp DEFAULT now() NOT NULL,
  "updatedAt" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE "Deck" (
  "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  "ownerId" uuid NOT NULL REFERENCES "User" ON UPDATE CASCADE ON DELETE CASCADE,
  "name" text DEFAULT '' NOT NULL,
  "description" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "promptLang" text DEFAULT '' NOT NULL,
  "answerLang" text DEFAULT '' NOT NULL,
  "published" boolean DEFAULT false NOT NULL,
  "editedAt" timestamp DEFAULT now() NOT NULL,
  "usedAt" timestamp DEFAULT now() NOT NULL,
  "createdAt" timestamp DEFAULT now() NOT NULL,
  "updatedAt" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE "Card" (
  "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  "deckId" uuid NOT NULL REFERENCES "Deck" ON UPDATE CASCADE ON DELETE CASCADE,
  "prompt" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "fullAnswer" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "answers" text[] DEFAULT '{}' NOT NULL,
  "sortKey" text DEFAULT '' NOT NULL,
  "editedAt" timestamp DEFAULT now() NOT NULL,
  "template" boolean DEFAULT false NOT NULL,
  "default" "Unit",
  "createdAt" timestamp DEFAULT now() NOT NULL,
  "updatedAt" timestamp DEFAULT now() NOT NULL,
  UNIQUE ("deckId", "default"),
  CHECK ("template" OR "default" IS NULL)
);

CREATE TABLE "UserCardRecord" (
  "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  "userId" uuid NOT NULL REFERENCES "User" ON UPDATE CASCADE ON DELETE CASCADE,
  "cardId" uuid NOT NULL REFERENCES "Card" ON UPDATE CASCADE ON DELETE CASCADE,
  "correctRecord" timestamp[] DEFAULT '{}' NOT NULL,
  "createdAt" timestamp DEFAULT now() NOT NULL,
  "updatedAt" timestamp DEFAULT now() NOT NULL,
  UNIQUE ("userId", "cardId")
);

CREATE TABLE "UserDeckRecord" (
  "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  "userId" uuid NOT NULL REFERENCES "User" ON UPDATE CASCADE ON DELETE CASCADE,
  "deckId" uuid NOT NULL REFERENCES "Deck" ON UPDATE CASCADE ON DELETE CASCADE,
  "notes" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "createdAt" timestamp DEFAULT now() NOT NULL,
  "updatedAt" timestamp DEFAULT now() NOT NULL,
  UNIQUE ("userId", "deckId")
);

CREATE TABLE "Room" (
  "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  "ownerId" uuid NOT NULL REFERENCES "User" ON UPDATE CASCADE ON DELETE CASCADE,
  "ownerConfig" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "internalConfig" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "state" "RoomState" DEFAULT 'WAITING' NOT NULL,
  "createdAt" timestamp DEFAULT now() NOT NULL,
  "updatedAt" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE "ChatMsg" (
  "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  "roomId" uuid NOT NULL REFERENCES "Room" ON UPDATE CASCADE ON DELETE CASCADE,
  "senderId" uuid REFERENCES "User" ON UPDATE CASCADE ON DELETE CASCADE,
  "type" text DEFAULT 'TEXT' NOT NULL,
  "content" text DEFAULT '' NOT NULL,
  "createdAt" timestamp DEFAULT now() NOT NULL,
  "updatedAt" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE "Subdeck" (
  "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  "parentDeckId" uuid NOT NULL REFERENCES "Deck" ON UPDATE CASCADE ON DELETE CASCADE,
  "subdeckId" uuid NOT NULL REFERENCES "Deck" ON UPDATE CASCADE ON DELETE CASCADE,
  "createdAt" timestamp DEFAULT now() NOT NULL,
  "updatedAt" timestamp DEFAULT now() NOT NULL,
  UNIQUE ("parentDeckId", "subdeckId")
);
CREATE INDEX "Subdeck_subdeckId_idx" ON "Subdeck" ("subdeckId");

CREATE TABLE "Occupant" (
  "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  "roomId" uuid NOT NULL REFERENCES "Room" ON UPDATE CASCADE ON DELETE CASCADE,
  "occupantId" uuid NOT NULL REFERENCES "User" ON UPDATE CASCADE ON DELETE CASCADE,
  "createdAt" timestamp DEFAULT now() NOT NULL,
  "updatedAt" timestamp DEFAULT now() NOT NULL,
  UNIQUE ("roomId", "occupantId")
);
CREATE INDEX "Occupant_occupantId_idx" ON "Occupant" ("occupantId");
