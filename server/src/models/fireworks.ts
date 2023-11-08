import { BaseChatModel, BaseChatModelParams } from "langchain/chat_models/base";
import { CallbackManagerForLLMRun } from "langchain/callbacks";
import {
  AIMessage,
  BaseMessage,
  ChatGeneration,
  //   ChatMessage,
  ChatResult,
} from "langchain/schema";

declare interface DialoqbaseFireworksModelInput {
  temperature?: number;
  top_p?: number;
  streaming?: boolean;
  max_tokens?: number;
  n?: number;
  model?: string;
  is_chat?: boolean;
}

interface ChatCompletionRequest {
  messages?: {
    role: string;
    content: string;
  }[];
  prompt?: string;
  stream?: boolean;
  temperature?: number;
  top_p?: number;
}
// interface ChatCompletionResponse {
//     object: string;
//     created: number;
//     result: string;
//   }

// function extractGenericMessageCustomRole(message: ChatMessage) {
//   if (
//     message.role !== "system" &&
//     message.role !== "assistant" &&
//     message.role !== "user"
//   ) {
//     console.warn(`Unknown message role: ${message.role}`);
//   }

//   return message.role;
// }

function messageToFireworkRole(message: BaseMessage): string {
  const type = message._getType();
  switch (type) {
    case "system":
      return "system";
    case "ai":
      return "assistant";
    case "human":
      return "user";
    default:
      throw new Error(`Unknown message type: ${type}`);
  }
}
export class DialoqbaseFireworksModel
  extends BaseChatModel
  implements DialoqbaseFireworksModelInput
{
  temperature: number | undefined;

  top_p?: number | undefined;

  streaming?: boolean | undefined;

  model: string;

  max_tokens?: number | undefined;

  n?: number | undefined;

  is_chat?: boolean | undefined;

  constructor(
    fields?: Partial<DialoqbaseFireworksModelInput> & BaseChatModelParams
  ) {
    super(fields ?? {});

    this.model = fields?.model ?? "accounts/fireworks/models/llama-v2-7b-chat";
    this.temperature = fields?.temperature ?? 0.7;
    this.top_p = fields?.top_p ?? this.top_p;
    this.streaming = fields?.streaming ?? false;
    this.max_tokens = fields?.max_tokens ?? 1048;
    this.n = fields?.n ?? 1;
    this.is_chat = fields?.is_chat ?? true;

    if (!process.env.FIREWORKS_API_KEY) {
      throw new Error("FIREWORKS_API_KEY is not set");
    }
  }

  _llmType(): string {
    return "dialoqbase_fireworks";
  }
  async _generate(
    messages: BaseMessage[],
    options: this["ParsedCallOptions"],
    runManager?: CallbackManagerForLLMRun | undefined
  ): Promise<ChatResult> {
    const params = this.invocationParams(options);

    const messagesMapped = messages.map((message) => ({
      role: messageToFireworkRole(message),
      content: message.content,
    }));

    const prompt = messagesMapped.reduce((acc, message) => {
      return `[INST]${message.content}\n[/INST]`;
    }, "");

    console.log(this.model);

    let data = this.streaming
      ? await new Promise<any>((resolve, reject) => {
          let response: any;
          let rejected = false;
          let resolved = false;

          this.completionWithRetry(
            {
              ...params,
              messages: this.is_chat
                ? messagesMapped.map(({ role, content }) => ({
                    role,
                    content: content.toString(),
                  }))
                : undefined,
              prompt: !this.is_chat ? prompt : undefined,
            },
            options?.signal,
            (event) => {
              // console.log(event.data);
              if (event.data === "[DONE]") {
                if (resolved || rejected) {
                  return;
                }
                resolved = true;
                resolve(response);
                return;
              }
              try {
                const data = JSON.parse(event.data);
                if (data?.error_code) {
                  if (rejected) {
                    return;
                  }
                  rejected = true;
                  reject(data);
                  return;
                }
                const message = data as {
                  id: string;
                  object: string;
                  created: number;
                  model: string;
                  choices: {
                    index: number;
                    delta?: {
                      content?: string;
                      role?: string;
                    };
                    text?: string;
                    finish_reason: string;
                  }[];
                };

                if (!response) {
                  if (message.choices.length > 0) {
                    response = {
                      id: message.id,
                      object: message.object,
                      created: message.created,
                      result:
                        message.choices[0]?.delta?.content ||
                        message?.choices[0]?.text ||
                        "",
                    };
                  }
                } else {
                  if (message.choices.length > 0) {
                    response.created = message.created;
                    response.result +=
                      message.choices[0]?.delta?.content ||
                      message?.choices[0]?.text ||
                      "";
                  }
                }
                void runManager?.handleLLMNewToken(
                  message.choices[0]?.delta?.content ||
                    message?.choices[0]?.text ||
                    ""
                );
              } catch (e) {
                console.error(e);

                if (rejected) {
                  return;
                }
                rejected = true;
                reject(e);

                return;
              }
            }
          ).catch((e) => {
            if (rejected) {
              return;
            }
            rejected = true;
            reject(e);
          });
        })
      : await this.completionWithRetry(
          {
            ...params,
            messages: this.is_chat
              ? messagesMapped.map(({ role, content }) => ({
                  role,
                  content: content.toString(),
                }))
              : undefined,
            prompt: !this.is_chat ? prompt : undefined,
          },
          options?.signal
        );
    // console.log(data);
    const text =
      data?.result ??
      data?.choices[0]?.message?.content ??
      data?.choices[0]?.text ??
      "";

    const generations: ChatGeneration[] = [];

    generations.push({
      text,
      message: new AIMessage(text),
    });

    return {
      generations,
    };
  }

  /** @ignore */
  _combineLLMOutput() {
    return [];
  }

  invocationParams(options?: this["ParsedCallOptions"]) {
    return {
      model: this.model,
      temperature: this.temperature,
      top_p: this.top_p,
      stream: this.streaming,
      max_tokens: this.max_tokens,
    };
  }

  /** @ignore */
  async completionWithRetry(
    request: ChatCompletionRequest,
    signal?: AbortSignal,
    onmessage?: (event: MessageEvent) => void
  ) {
    if (!process.env.FIREWORKS_API_KEY) {
      throw new Error("FIREWORKS_API_KEY is not set");
    }
    const makeCompletionRequest = async () => {
      const baseURL = "https://api.fireworks.ai/inference/v1";
      const completionURL = this.is_chat ? "/chat/completions" : "/completions";
      const url = `${baseURL}${completionURL}`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.FIREWORKS_API_KEY}`,
        },
        body: JSON.stringify(request),
        signal,
      });

      if (!this.streaming) {
        return response.json();
      } else {
        if (response.body) {
          const reader = response.body.getReader();
          const decoder = new TextDecoder("utf-8");
          let data = "";

          let continueReading = true;

          while (continueReading) {
            const { done, value } = await reader.read();
            if (done) {
              continueReading = false;
              break;
            }
            data += decoder.decode(value);
            let continueProcessing = true;
            while (continueProcessing) {
              const newlineIndex = data.indexOf("\n");
              if (newlineIndex === -1) {
                continueProcessing = false;
                break;
              }
              const line = data.slice(0, newlineIndex);
              data = data.slice(newlineIndex + 1);

              if (line.startsWith("data:")) {
                const event = new MessageEvent("message", {
                  data: line.slice("data:".length).trim(),
                });
                onmessage?.(event);
              }
            }
          }
        }
      }
    };

    return this.caller.call(makeCompletionRequest);
  }
}
