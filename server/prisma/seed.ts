import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const MODELS = [
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
