CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS "User" (
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

CREATE TABLE IF NOT EXISTS "Deck" (
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

CREATE TABLE IF NOT EXISTS "Card" (
  "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  "deckId" uuid NOT NULL REFERENCES "Deck" ON UPDATE CASCADE ON DELETE CASCADE,
  "prompt" text DEFAULT '' NOT NULL,
  "fullAnswer" text DEFAULT '' NOT NULL,
  "answers" text[] DEFAULT '{}' NOT NULL,
  "sortKey" text DEFAULT '' NOT NULL,
  "editedAt" timestamp DEFAULT now() NOT NULL,
  "template" boolean DEFAULT false NOT NULL,
  "createdAt" timestamp DEFAULT now() NOT NULL,
  "updatedAt" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "UserCardRecord" (
  "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  "userId" uuid NOT NULL REFERENCES "User" ON UPDATE CASCADE ON DELETE CASCADE,
  "cardId" uuid NOT NULL REFERENCES "Card" ON UPDATE CASCADE ON DELETE CASCADE,
  "correctRecord" timestamp[] DEFAULT '{}' NOT NULL,
  "createdAt" timestamp DEFAULT now() NOT NULL,
  "updatedAt" timestamp DEFAULT now() NOT NULL,
  UNIQUE ("userId", "cardId")
);

CREATE TABLE IF NOT EXISTS "UserDeckRecord" (
  "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  "userId" uuid NOT NULL REFERENCES "User" ON UPDATE CASCADE ON DELETE CASCADE,
  "deckId" uuid NOT NULL REFERENCES "Deck" ON UPDATE CASCADE ON DELETE CASCADE,
  "notes" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "createdAt" timestamp DEFAULT now() NOT NULL,
  "updatedAt" timestamp DEFAULT now() NOT NULL,
  UNIQUE ("userId", "deckId")
);

CREATE TABLE IF NOT EXISTS "Room" (
  "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  "ownerId" uuid NOT NULL REFERENCES "User" ON UPDATE CASCADE ON DELETE CASCADE,
  "archived" boolean DEFAULT false NOT NULL,
  "config" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "createdAt" timestamp DEFAULT now() NOT NULL,
  "updatedAt" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "ChatMsg" (
  "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  "roomId" uuid NOT NULL REFERENCES "Room" ON UPDATE CASCADE ON DELETE CASCADE,
  "senderId" uuid REFERENCES "User" ON UPDATE CASCADE ON DELETE CASCADE,
  "type" text DEFAULT 'TEXT' NOT NULL,
  "content" text DEFAULT '' NOT NULL,
  "createdAt" timestamp DEFAULT now() NOT NULL,
  "updatedAt" timestamp DEFAULT now() NOT NULL
);
COMMENT ON COLUMN "ChatMsg"."roomId" IS 'message sent by a user being deleted should be deleted';

CREATE TABLE IF NOT EXISTS "_Subdeck" (
  "A" uuid NOT NULL REFERENCES "Deck" ON UPDATE CASCADE ON DELETE CASCADE,
  "B" uuid NOT NULL REFERENCES "Deck" ON UPDATE CASCADE ON DELETE CASCADE,
  PRIMARY KEY ("A", "B")
);
CREATE INDEX IF NOT EXISTS "_Subdeck_B_idx" ON "_Subdeck" ("B");
COMMENT ON COLUMN "_Subdeck"."A" IS 'parentId';
COMMENT ON COLUMN "_Subdeck"."B" IS 'subdeckId';

CREATE TABLE IF NOT EXISTS "_Occupant" (
  "A" uuid NOT NULL REFERENCES "Room" ON UPDATE CASCADE ON DELETE CASCADE,
  "B" uuid NOT NULL REFERENCES "User" ON UPDATE CASCADE ON DELETE CASCADE,
  PRIMARY KEY ("A", "B")
);
CREATE INDEX IF NOT EXISTS "_Occupant_B_idx" ON "_Occupant" ("B");
COMMENT ON COLUMN "_Occupant"."A" IS 'roomId';
COMMENT ON COLUMN "_Occupant"."B" IS 'occupantId';
