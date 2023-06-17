import { FastifyReply, FastifyRequest } from "fastify";
import { GetChannelsByProviderType } from "./type";
import { providers } from "./const";

export async function getChannelsByProvider(
  request: FastifyRequest<GetChannelsByProviderType>,
  reply: FastifyReply,
) {
  const { id } = request.params;
  const prisma = request.server.prisma;

  const bot = await prisma.bot.findUnique({
    where: {
      id,
    },
    include: {
      BotIntegration: true,
    },
  });

  if (!bot) {
    return reply.status(404).send({
      statusCode: 404,
      error: "Not Found",
      message: "Bot not found",
    });
  }

  let channels = providers.map((provider) => {
    const integration = bot.BotIntegration.find((integration) =>
      integration.provider === provider.channel
    );
    if (integration) {
      switch (provider.channel) {
        case "telegram":
          provider.status = integration.telegram_bot_token
            ? "CONNECTED"
            : "CONNECT";
          provider.color = integration.telegram_bot_token
            ? "#00B900"
            : "#ffffff";

          if (integration.is_pause) {
            provider.status = "PAUSED";
            provider.color = "#FF0000";
          }
          provider.fields[0].value = integration.telegram_bot_token || "";
          break;
        default:
          break;
      }
      provider.isPaused = integration.is_pause || false;
      return provider;
    }

    return provider;
  });

  return {
    "data": channels,
  };
}
