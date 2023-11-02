-- AlterTable
ALTER TABLE "User" ADD COLUMN     "api_config" JSON DEFAULT '{"OPENAI_API_KEY": null, "ANTHROPIC_API_KEY": null, "GOOGLE_API_KEY": null, "COHERE_API_KEY": null, "FIREWORKS_API_KEY": null}';
