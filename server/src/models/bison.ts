import { BaseChatModel } from "langchain/chat_models/base";
import { CallbackManagerForLLMRun } from "langchain/callbacks";
import {
  AIChatMessage,
  BaseChatMessage,
  ChatGeneration,
  ChatResult,
  MessageType,
} from "langchain/schema";
import { BaseLLMParams } from "langchain/llms/base";
import { GoogleAuth } from "google-auth-library";
import { DiscussServiceClient } from "@google-ai/generativelanguage";
import { google } from "@google-ai/generativelanguage/build/protos/protos";

// need more testing before we can use this

interface GoogleChatBisonChatExample {
  input: GoogleChatBisonMessage;
  output: GoogleChatBisonMessage;
}
export interface GoogleChatBisonChatInstance {
  context?: string;
  examples?: GoogleChatBisonChatExample[];
  messages: GoogleChatBisonMessage[];
}

export interface GoogleChatBisonConnectionParams {
  model?: string;
}

export interface GoogleChatBisonModelParams {
  temperature?: number;
  topP?: number;

  topK?: number;
}

export interface GoogleChatBisonBaseLLMInput
  extends
    BaseLLMParams,
    GoogleChatBisonConnectionParams,
    GoogleChatBisonModelParams {}

export interface GoogleChatBisonBasePrediction {
  safetyAttributes?: any;
}

export interface GoogleChatBisonLLMResponse<
  PredictionType extends GoogleChatBisonBasePrediction,
> {
  data: {
    predictions: PredictionType[];
  };
}

export type GoogleChatBisonChatAuthor =
  | "user"
  | "bot"
  | "system"
  | "context";

export type GoogleChatBisonMessageFields = {
  author?: GoogleChatBisonChatAuthor;
  content: string;
  name?: string;
};

export class GoogleChatBisonMessage {
  public author?: GoogleChatBisonChatAuthor;

  public content: string;

  public name?: string;

  constructor(fields: GoogleChatBisonMessageFields) {
    this.author = fields.author;
    this.content = fields.content;
    this.name = fields.name;
  }

  static mapMessageTypeToVertexChatAuthor(
    baseMessageType: MessageType,
    model: string,
  ): GoogleChatBisonChatAuthor {
    switch (baseMessageType) {
      case "ai":
        return model.startsWith("codechat-") ? "system" : "bot";
      case "human":
        return "user";
      case "system":
        throw new Error(
          `System messages are only supported as the first passed message for Google Vertex AI.`,
        );
      default:
        throw new Error(
          `Unknown / unsupported message type: ${baseMessageType}`,
        );
    }
  }

  static fromChatMessage(message: BaseChatMessage, model: string) {
    return new GoogleChatBisonMessage({
      author: GoogleChatBisonMessage.mapMessageTypeToVertexChatAuthor(
        message._getType(),
        model,
      ),
      content: message.text,
    });
  }
}

export interface GoogleChatBisonChatInput extends GoogleChatBisonBaseLLMInput {
  context?: string;
}

export class GoogleChatBison extends BaseChatModel
  implements GoogleChatBisonChatInput {
  model = "models/chat-bison-001";

  temperature = 0.2;

  topP = 0.8;

  topK = 40;

  connection: DiscussServiceClient;

  constructor(fields?: GoogleChatBisonChatInput) {
    super(fields ?? {});

    this.model = fields?.model ?? this.model;
    this.temperature = fields?.temperature ?? this.temperature;
    this.topP = fields?.topP ?? this.topP;
    this.topK = fields?.topK ?? this.topK;

    try {
      this.connection = new DiscussServiceClient({
        authClient: new GoogleAuth().fromAPIKey(process.env.GOOGLE_API_KEY!),
      });
    } catch (e) {
      throw new Error(
        `Failed to connect to Google PaLM Discuss Service: ${e}`,
      );
    }
  }

  _combineLLMOutput?(
    ...llmOutputs: (Record<string, any> | undefined)[]
  ): Record<string, any> | undefined {
    return [];
  }
  _llmType(): string {
    return "google-chat-bison";
  }
  async _generate(
    messages: BaseChatMessage[],
    options: this["ParsedCallOptions"],
    runManager?: CallbackManagerForLLMRun | undefined,
  ): Promise<ChatResult> {
    const instance: GoogleChatBisonChatInstance = this.createInstance(messages);
    const parameters = {
      temperature: this.temperature,
      topK: this.topK,
      topP: this.topP,
      model: this.model,
    };

    const result = await this.connection.generateMessage({
      prompt: instance,
      candidateCount: 1,
      ...parameters,
    });

    console.log(JSON.stringify(result, null, 2));

    const generations = GoogleChatBison.convertPrediction(result as any);

    return {
      generations: [generations],
    };
  }

  createInstance(messages: BaseChatMessage[]): GoogleChatBisonChatInstance {
    let context = "";
    let conversationMessages = messages;
    if (messages[0]?._getType() === "system") {
      context = messages[0].text;
      conversationMessages = messages.slice(1);
    }
    if (conversationMessages.length % 2 === 0) {
      throw new Error(
        `GoogleChatBison requires an odd number of messages to generate a response.`,
      );
    }
    const vertexChatMessages = conversationMessages.map((baseMessage, i) => {
      if (
        i > 0 &&
        baseMessage._getType() === conversationMessages[i - 1]._getType()
      ) {
        throw new Error(
          `GoogleChatBison requires AI and human messages to alternate.`,
        );
      }
      return GoogleChatBisonMessage.fromChatMessage(baseMessage, this.model);
    });

    const instance: GoogleChatBisonChatInstance = {
      context,
      messages: vertexChatMessages,
    };

    return instance;
  }

  static convertPrediction(
    prediction?:
      google.ai.generativelanguage.v1beta2.IGenerateMessageResponse[],
  ): ChatGeneration {
    if (!prediction) {
      return {
        text: "",
        message: new AIChatMessage(""),
        generationInfo: {},
      };
    }

    if (prediction.length === 0) {
      return {
        text: "",
        message: new AIChatMessage(""),
        generationInfo: {},
      };
    }

    const messages = prediction[0].candidates;
    if (messages?.length === 0) {
      return {
        text: "",
        message: new AIChatMessage(""),
        generationInfo: {},
      };
    }

    const message = messages![0];
    return {
      text: message?.content ?? "",
      message: new AIChatMessage(message?.content ?? ""),
      generationInfo: prediction,
    };
  }
}
