-- Enable pg_vector
create extension if not exists vector;
-- Tables
CREATE TABLE "public"."Bot" (
    "id" text NOT NULL,
    "publicId" text NOT NULL,
    "name" text NOT NULL,
    "description" text,
    "createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "temperature" double precision DEFAULT '0.7' NOT NULL,
    "model" text DEFAULT 'gpt-3.5-turbo' NOT NULL,
    "provider" text DEFAULT 'openai' NOT NULL,
    "embedding" text DEFAULT 'openai' NOT NULL,
    CONSTRAINT "Bot_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Bot_publicId_key" UNIQUE ("publicId")
) WITH (oids = false);

CREATE SEQUENCE "BotDocument_id_seq" INCREMENT 1 CACHE 1;

CREATE TABLE "public"."BotDocument" (
    "id" integer DEFAULT nextval('"BotDocument_id_seq"') NOT NULL,
    "sourceId" text NOT NULL,
    "botId" text NOT NULL,
    "content" text NOT NULL,
    "embedding" vector NOT NULL,
    "metadata" jsonb NOT NULL,
    CONSTRAINT "BotDocument_pkey" PRIMARY KEY ("id")
) WITH (oids = false);

CREATE TABLE "public"."BotSource" (
    "id" text NOT NULL,
    "botId" text NOT NULL,
    "type" text DEFAULT 'website' NOT NULL,
    "content" text,
    "location" text,
    "isPending" boolean DEFAULT true NOT NULL,
    "status" text DEFAULT 'pending' NOT NULL,
    "createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) NOT NULL,
    CONSTRAINT "BotSource_pkey" PRIMARY KEY ("id")
) WITH (oids = false);

CREATE SEQUENCE "User_user_id_seq" INCREMENT 1 CACHE 1;

CREATE TABLE "public"."User" (
    "user_id" integer DEFAULT nextval('"User_user_id_seq"') NOT NULL,
    "username" text NOT NULL,
    "password" text NOT NULL,
    "isFirstLogin" boolean DEFAULT true NOT NULL,
    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
) WITH (oids = false);

INSERT INTO "User" ("user_id", "username", "password", "isFirstLogin") VALUES
(1, 'admin', '$2a$12$zY2slOG8LUQwzAkMQcooM.UVr0ArR/P0xD.8tyLIMs7Gevx5xHUI6', 't');

ALTER TABLE ONLY "public"."BotDocument" ADD CONSTRAINT "BotDocument_botId_fkey" FOREIGN KEY ("botId") REFERENCES "Bot"(id) ON UPDATE CASCADE ON DELETE RESTRICT NOT DEFERRABLE;
ALTER TABLE ONLY "public"."BotDocument" ADD CONSTRAINT "BotDocument_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "BotSource"(id) ON UPDATE CASCADE ON DELETE RESTRICT NOT DEFERRABLE;

ALTER TABLE ONLY "public"."BotSource" ADD CONSTRAINT "BotSource_botId_fkey" FOREIGN KEY ("botId") REFERENCES "Bot"(id) ON UPDATE CASCADE ON DELETE RESTRICT NOT DEFERRABLE;
-- Functions
CREATE OR REPLACE FUNCTION similarity_search (
  query_embedding vector,
  botId text,
  match_count int DEFAULT null
) RETURNS TABLE (
  content text,
  metadata jsonb,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    bt.content,
    bt.metadata,
    1 - (bt.embedding <=> query_embedding) AS similarity
  FROM "BotDocument" AS bt
  WHERE bt."botId" = similarity_search.botId -- Check botId
  ORDER BY bt.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;