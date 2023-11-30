import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const MODELS: {
  name: string;
  model_id: string;
  model_type: string;
  model_provider?: string;
  stream_available?: boolean;
  local_model?: boolean;
  config?: string;
}[] = [
  {
    name: "Claude 2.1 (Anthropic)",
    model_id: "claude-2.1-dbase",
    model_type: "chat",
    model_provider: "Anthropic",
    stream_available: true,
    local_model: false,
    config: "{}",
  },
  {
    name: "Claude Instant 1.2 (Anthropic)",
    model_id: "claude-instant-1.2-dbase",
    model_type: "chat",
    model_provider: "Anthropic",
    stream_available: true,
    local_model: false,
    config: "{}",
  },
  {
    name: "Yi 34B 200k (Fireworks)",
    model_id: "accounts/fireworks/models/yi-34b-200k",
    model_type: "instruct",
    stream_available: true,
    model_provider: "Fireworks",
    local_model: false,
    config: "{}",
  },
  {
    model_id: "accounts/fireworks/models/yi-34b-200k-capybara",
    name: "Capybara 34B (Fireworks)",
    model_type: "chat",
    stream_available: true,
    model_provider: "Fireworks",
    local_model: false,
    config: "{}",
  },
];

const newModels = async () => {
  console.log("Seeding new models...");
  for (const model of MODELS) {
    await prisma.dialoqbaseModels.upsert({
      where: {
        model_id: model.model_id,
      },
      update: {},
      create: model,
    });
  }
};

const main = async () => {
  await newModels();
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
