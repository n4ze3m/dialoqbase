import { FastifyReply, FastifyRequest } from "fastify";
import { ElevenLabTypes } from "../types";
import {
  isElevenLabAPIKeyPresent,
  isElevenLabAPIValid,
  textToSpeech,
} from "../../../../../utils/elevenlabs";

export const voiceTTSHandler = async (
  request: FastifyRequest<ElevenLabTypes>,
  reply: FastifyReply,
) => {

  if (!isElevenLabAPIKeyPresent()) {
    return reply.status(400).send({
      message: "Eleven Labs API key not present",
    });
  }

  const is11LabAPIVValid = await isElevenLabAPIValid();

  if (!is11LabAPIVValid) {
    return reply.status(400).send({
      message: "Eleven Labs API key not valid",
    });
  }

  const buffer = await textToSpeech(request.body.text, request.body.voice_id);
  return reply.status(200).send(buffer);
};
