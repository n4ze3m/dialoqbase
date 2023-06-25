CREATE TABLE "BotAppearance" (
  "id" serial NOT NULL,
  PRIMARY KEY ("id"),
  "bot_id" text NOT NULL,
  "bot_name" text NOT NULL,
  "first_message" text NOT NULL,
  "background_color" text NULL,
  "chat_bot_bubble_style" json NULL,
  "chat_human_bubble_style" json NULL
);


ALTER TABLE "BotAppearance"
ADD FOREIGN KEY ("bot_id") REFERENCES "Bot" ("id") ON DELETE CASCADE ON UPDATE CASCADE;