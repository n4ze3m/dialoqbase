import { FastifyReply, FastifyRequest } from "fastify";
import { WhatsAppIntergationBodyType, WhatsAppIntergationType } from "./type";
import * as PubSub from "pubsub-js";

export const whatsappIntergationHandler = async (
  request: FastifyRequest<WhatsAppIntergationType>,
  reply: FastifyReply
) => {
  const prisma = request.server.prisma;

  const bot = await prisma.botIntegration.findFirst({
    where: {
      bot_id: request.params.id,
      provider: "whatsapp",
    },
  });

  if (!bot) {
    return reply.status(404).send({
      message: "Bot not found",
    });
  }

  if (
    request.query["hub.mode"] == "subscribe" &&
    request.query["hub.verify_token"] == bot.whatsapp_verify_token
  ) {
    return reply.status(200).send(request.query["hub.challenge"]);
  }

  console.log(JSON.stringify(request.body, null, 2));
  return reply.status(200).send({
    message: "Integration created",
  });
};

export const whatsappIntergationHandlerPost = async (
  req: FastifyRequest<WhatsAppIntergationBodyType>,
  reply: FastifyReply
) => {
  try {
    const signature = req.headers["x-hub-signature"];

    if (!signature) {
      return reply.status(400).send({
        message: "Invalid request",
      });
    }

    const prisma = req.server.prisma;

    const isBot = await prisma.botIntegration.findFirst({
      where: {
        bot_id: req.params.id,
        provider: "whatsapp",
      },
    });

    if (!isBot) {
      return reply.status(404).send({
        message: "Bot not found",
      });
    }

    if (!req.body.object || !req.body.entry?.[0]?.changes?.[0]?.value) {
      return reply.status(400).send({
        message: "Invalid request",
      });
    }

    if (req.body?.entry?.[0]?.changes?.[0]?.value?.statuses) {
      return reply.status(202).send();
    }

    const { from, id, timestamp, type, ...rest } =
      req.body.entry[0].changes[0].value.messages[0];
    const identifer =
      req.body.entry[0].changes[0].value.metadata.phone_number_id;

    let event: string | undefined = undefined;
    let data: any | undefined = undefined;

    switch (type) {
      case "text":
        event = "message";
        data = { text: rest.text?.body, identifer: identifer, from, id };
        break;
      default:
        break;
    }

    if (event && data) {
      // console.log("publishing to", req.params.id, { event, data });
      PubSub.publish(req.params.id, data);
    }

    // console.log(JSON.stringify(req.body, null, 2));
    return reply.status(200).send();
  } catch (error) {
    console.log(error);
    return reply.status(200).send();
  }
};
